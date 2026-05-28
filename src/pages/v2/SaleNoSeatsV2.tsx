import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LayoutV2 from '../../layouts/LayoutV2'
import StepHeader from '../../components/v2/sale/StepHeader'
import {
  CartMobileSheet,
  CartSidebar,
  type CartSummaryItem
} from '../../components/v2/sale/CartSummaryPanel'
import { GlassCard, Pill, useToast } from '../../components/ui'
import { useSessionTimer } from '../../hooks/useSessionTimer'
import { cacheService } from '../../services/cacheService'
import { fallbackDataService } from '../../services/fallbackDataService'
import { extractLatestPrices } from '../../components/Utils/priceUtils'
import { ticketId } from '../../components/TicketUtils'
import { coverSeed } from '../../lib/covers/coverHash'
import { useCart, type CartItem } from '../../router/cartContext'
import { cn } from '../../types/ui'
import type { UIEvent } from '../../types/uiEvent'

const MAX_TICKETS = 10

interface SaleNoSeatsV2Props {
  event: UIEvent
}

interface TierEntry {
  /** Zona (ej. "General Admission", "VIP"). */
  zoneLabel: string
  /** Tier de precio (ej. "P1"). */
  priceType: string
  /** USD. */
  priceBase: number
  priceFinal: number
}


interface ZonePriceRaw {
  prices: Record<string, Record<string, { price_base: number; price_final: number }>>
  zones: Record<string, Record<string, unknown>>
}

const tiersFromZoneData = (data: ZonePriceRaw | null): TierEntry[] => {
  if (!data?.zones) return []
  const latest = extractLatestPrices(data) as Record<
    string,
    { price_base: number; price_final: number }
  >
  const out: TierEntry[] = []
  for (const [zoneLabel, priceTiers] of Object.entries(data.zones)) {
    for (const priceType of Object.keys(priceTiers)) {
      const info = latest[priceType]
      if (!info) continue
      out.push({
        zoneLabel,
        priceType,
        priceBase: info.price_base / 100,
        priceFinal: info.price_final / 100
      })
    }
  }
  return out
}

/**
 * Pantalla v2 para eventos General Admission (venue.seatmap=false).
 * Reemplaza la redirección al `TicketEventSaleNoSeats` legacy con un UI
 * consistente con el resto del v2. Mantiene el mismo backend contract
 * (carga zone_price del schema, guarda cart_checkout en localStorage,
 * navega a /checkout).
 */
export default function SaleNoSeatsV2({ event }: SaleNoSeatsV2Props) {
  const navigate = useNavigate()
  const { user } = useAuth0()
  const toast = useToast()
  const {
    items: cart,
    eventLabel: cartEventLabel,
    pricing,
    addItem,
    removeItem,
    clear: clearCart
  } = useCart()

  const [zoneData, setZoneData] = useState<ZonePriceRaw | null>(null)
  const [zonesLoading, setZonesLoading] = useState(true)
  const timer = useSessionTimer(event.id, 10)
  const wasEmptyRef = useRef(cart.length === 0)

  // Si el cart pertenece a otro evento, lo limpiamos al entrar para no
  // mezclar tickets.
  useEffect(() => {
    if (cartEventLabel && cartEventLabel !== event.id) {
      clearCart()
    }
  }, [event.id, cartEventLabel, clearCart])

  useEffect(() => {
    if (!event.id) return
    let cancelled = false
    setZonesLoading(true)

    const token = import.meta.env.VITE_GITHUB_TOKEN
    const url = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${event.id}/zone_price.json`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }

    const load = async () => {
      try {
        if (fallbackDataService.isEmergencyMode()) {
          const local = await fallbackDataService.getLocalZonePrice(event.id)
          if (local && !cancelled) setZoneData(local)
          return
        }
        const data = await cacheService.fetchWithCache<ZonePriceRaw>(url, options, {
          ttl: 5 * 60 * 1000
        })
        if (!cancelled) setZoneData(data)
      } catch {
        try {
          const local = await fallbackDataService.getLocalZonePrice(event.id)
          if (local && !cancelled) setZoneData(local)
        } catch {
          if (!cancelled) setZoneData(null)
        }
      } finally {
        if (!cancelled) setZonesLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [event.id])

  const tiers = useMemo(() => tiersFromZoneData(zoneData), [zoneData])

  const totalTickets = cart.length

  // Cantidad por tier (zoneLabel + priceType) derivada del cart.
  const quantitiesByKey = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of cart) {
      const key = `${t.subZone}::${t.priceType}`
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return map
  }, [cart])

  const findTicketsOfTier = (zoneLabel: string, priceType: string) =>
    cart.filter((t) => t.subZone === zoneLabel && t.priceType === priceType)

  // Toast "Hold started" al primer item.
  useEffect(() => {
    if (totalTickets > 0 && wasEmptyRef.current) {
      wasEmptyRef.current = false
      toast.show({
        variant: 'info',
        title: 'Hold started',
        message: 'You have 10 minutes to complete your purchase.',
        duration: 4000
      })
    }
    if (totalTickets === 0) wasEmptyRef.current = true
  }, [totalTickets, toast])

  // Timer expired → toast (la limpieza la hace el CartContext).
  useEffect(() => {
    if (timer.isExpired && totalTickets > 0) {
      toast.show({
        variant: 'warn',
        title: 'Session expired',
        message: 'Your hold was released. Pick again to continue.',
        duration: 6000
      })
    }
  }, [timer.isExpired, totalTickets, toast])

  const incrementTier = (tier: TierEntry) => {
    if (totalTickets >= MAX_TICKETS) {
      toast.show({
        variant: 'warn',
        title: 'Limit reached',
        message: `Maximum of ${MAX_TICKETS} tickets per order.`
      })
      return
    }
    const issuedAt = Date.now()
    const tid = ticketId(event.id, tier.zoneLabel, totalTickets + 1, issuedAt)
    const newItem: CartItem = {
      ticketId: tid,
      seatLabel: tid,
      subZone: tier.zoneLabel,
      zoneName: event.id,
      priceType: tier.priceType,
      seatType: tier.priceType,
      price_base: tier.priceBase,
      price_final: tier.priceFinal,
      issuedAt
    }
    addItem(newItem)
  }

  const decrementTier = (tier: TierEntry) => {
    const tickets = findTicketsOfTier(tier.zoneLabel, tier.priceType)
    if (tickets.length === 0) return
    const last = tickets[tickets.length - 1]
    removeItem(last.ticketId)
  }

  const handleCheckout = () => {
    if (cart.length === 0 || cart.length > MAX_TICKETS) return
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({
        cart,
        eventInfo: {
          id: event.id,
          name: event.title,
          venue: event.venueName,
          venueId: event.venueLabel,
          date: event.raw.event_date,
          location: event.city
        },
        customer: {
          name: user?.name,
          email: user?.email,
          phone: (user as { phone_number?: string })?.phone_number
        }
      })
    )
    navigate('/checkout')
  }

  const subtitle = `${event.day}, ${event.month} ${event.date}${event.time ? ` · ${event.time}` : ''} · ${event.venueName}`

  const summaryItems = useMemo<CartSummaryItem[]>(() => {
    const grouped = new Map<
      string,
      { count: number; price: number; label: string }
    >()
    for (const t of cart) {
      const key = `${t.subZone}::${t.priceType}`
      const existing = grouped.get(key)
      if (existing) {
        existing.count += 1
        existing.price += t.price_final
      } else {
        grouped.set(key, {
          count: 1,
          price: t.price_final,
          label: `${t.subZone}`
        })
      }
    }
    return Array.from(grouped.entries()).map(([key, g]) => ({
      id: key,
      label: `${g.count} × ${g.label}`,
      sublabel: `$${(g.price / g.count).toFixed(2)} each`,
      price: g.price
    }))
  }, [cart])

  const disabledCta = totalTickets === 0
  const ctaLabel = totalTickets === 0
    ? 'Add at least one ticket'
    : `Checkout · $${pricing.total.toFixed(2)} (${totalTickets})`

  return (
    <LayoutV2
      hideHeader
      hideFooter
      hideMobileTabBar
      meshSeed={(coverSeed(event.id) % 8) + 2}
    >
      <StepHeader
        step='seats'
        title={event.title}
        subtitle={subtitle}
        eventLabel={event.id}
      />

      <main className='mx-auto max-w-6xl px-4 lg:px-10 py-5 lg:py-8 pb-44 lg:pb-12'>
        <div className='grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start'>
          <div className='space-y-4 min-w-0'>
            <header className='flex items-center justify-between gap-3'>
              <div className='min-w-0'>
                <div className='text-[10px] uppercase tracking-[0.16em] font-display font-bold text-brand-hi'>
                  General admission
                </div>
                <h2 className='mt-1 font-display text-xl lg:text-2xl font-bold text-white tracking-tight'>
                  Choose how many
                </h2>
                <p className='text-[11px] text-white/55 mt-0.5'>
                  Pick the quantity per tier. Standing room — no assigned
                  seats.
                </p>
              </div>
              <Pill
                state={totalTickets >= MAX_TICKETS ? 'warn' : 'normal'}
                size='sm'
              >
                {totalTickets} / {MAX_TICKETS}
              </Pill>
            </header>

            {zonesLoading ? (
              <TiersSkeleton />
            ) : tiers.length === 0 ? (
              <NoTiersState />
            ) : (
              <div className='space-y-2.5'>
                {tiers.map((tier) => {
                  const key = `${tier.zoneLabel}::${tier.priceType}`
                  const qty = quantitiesByKey.get(key) ?? 0
                  const canIncrement = totalTickets < MAX_TICKETS
                  return (
                    <TierRow
                      key={key}
                      tier={tier}
                      qty={qty}
                      canIncrement={canIncrement}
                      onAdd={() => incrementTier(tier)}
                      onRemove={() => decrementTier(tier)}
                    />
                  )
                })}
              </div>
            )}
          </div>

          <CartSidebar
            title='Order summary'
            items={summaryItems}
            breakdown={pricing}
            count={totalTickets}
            max={MAX_TICKETS}
            ctaLabel={ctaLabel}
            ctaDisabled={disabledCta}
            onCheckout={handleCheckout}
            onBack={() => navigate(-1)}
          />
        </div>
      </main>

      <CartMobileSheet
        title='Order summary'
        items={summaryItems}
        breakdown={pricing}
        count={totalTickets}
        max={MAX_TICKETS}
        ctaLabel={ctaLabel}
        ctaDisabled={disabledCta}
        onCheckout={handleCheckout}
        onBack={() => navigate(-1)}
      />
    </LayoutV2>
  )
}

interface TierRowProps {
  tier: TierEntry
  qty: number
  canIncrement: boolean
  onAdd: () => void
  onRemove: () => void
}

const TierRow = ({ tier, qty, canIncrement, onAdd, onRemove }: TierRowProps) => (
  <GlassCard depth='md' radius='md' className='p-4'>
    <div className='flex items-center justify-between gap-3'>
      <div className='min-w-0 flex-1'>
        <div className='font-display text-base font-semibold text-white tracking-tight truncate'>
          {tier.zoneLabel}
        </div>
        <div className='text-[11px] text-white/55 mt-0.5'>
          {tier.priceType} · ${tier.priceFinal.toFixed(2)} per ticket
        </div>
      </div>

      <div className='flex items-center gap-1 shrink-0 rounded-pill border border-white/15 bg-white/[0.06] p-1'>
        <StepperButton
          label='Remove one'
          disabled={qty === 0}
          onClick={onRemove}
        >
          −
        </StepperButton>
        <span className='font-display text-base font-semibold text-white tabular-nums min-w-[28px] text-center'>
          {qty}
        </span>
        <StepperButton
          label='Add one'
          disabled={!canIncrement}
          onClick={onAdd}
        >
          +
        </StepperButton>
      </div>
    </div>
    {qty > 0 && (
      <div className='mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[12.5px]'>
        <span className='text-white/65'>Subtotal</span>
        <span className='font-display font-semibold text-white tabular-nums'>
          ${(qty * tier.priceFinal).toFixed(2)}
        </span>
      </div>
    )}
  </GlassCard>
)

interface StepperButtonProps {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

const StepperButton = ({ label, disabled, onClick, children }: StepperButtonProps) => (
  <button
    type='button'
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'grid h-8 w-8 place-items-center rounded-pill font-display text-base font-bold transition',
      disabled
        ? 'text-white/30 cursor-not-allowed'
        : 'text-white hover:bg-white/[0.10]'
    )}
  >
    {children}
  </button>
)

const TiersSkeleton = () => (
  <div className='space-y-2.5'>
    {Array.from({ length: 2 }).map((_, i) => (
      <div
        key={i}
        className='h-20 rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
      />
    ))}
  </div>
)

const NoTiersState = () => (
  <GlassCard depth='md' radius='lg' className='p-6 text-center'>
    <div className='font-display text-base font-semibold text-white'>
      No tickets on sale yet
    </div>
    <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>
      Pricing for this event hasn&apos;t been published. Check back soon — or
      try another date if the artist is touring.
    </p>
  </GlassCard>
)

