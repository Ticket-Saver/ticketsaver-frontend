import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LayoutV2 from '../../layouts/LayoutV2'
import StepHeader from '../../components/v2/sale/StepHeader'
import {
  CartMobileSheet,
  CartSidebar,
  type CartSummaryItem
} from '../../components/v2/sale/CartSummaryPanel'
import { GlassCard, Pill, useToast } from '../../components/ui'
import { useSessionTimer } from '../../hooks/useSessionTimer'
import { hiEventsService } from '../../services/hiEventsService'
import { useCart, type CartItem } from '../../router/cartContext'
import { coverSeed } from '../../lib/covers/coverHash'
import { cn } from '../../types/ui'
import type { PricingBreakdown } from '../../lib/pricing'
import type { UIEvent } from '../../types/uiEvent'
import type { HiTicketPublic } from '../../types/hievents'

/** Tope de seguridad por orden (HiEvents limita además por max_per_order de cada ticket). */
const GLOBAL_MAX = 20
const round2 = (n: number) => Math.round(n * 100) / 100

interface SaleNoSeatsV2Props {
  event: UIEvent
}

/** Una fila comprable = un precio de un ticket (un ticket TIERED expande a varias filas). */
interface TicketRow {
  key: string
  ticketHiId: number
  priceId: number
  title: string
  label: string | null
  /** Precio NETO (lo que se muestra en la fila). */
  net: number
  /** Precio con impuestos/cargos (lo que llega al carrito y a Stripe). */
  incl: number
  fee: number
  tax: number
  maxPerOrder: number
  minPerOrder: number
  available: boolean
  soldOut: boolean
  saleStart: string | null
}

const rowsFromTickets = (tickets: HiTicketPublic[]): TicketRow[] => {
  const out: TicketRow[] = []
  for (const t of tickets) {
    for (const p of t.prices || []) {
      const soldOut = !!t.is_sold_out || !!p.is_sold_out
      out.push({
        key: `${t.id}-${p.id}`,
        ticketHiId: t.id,
        priceId: p.id,
        title: t.title,
        label: p.label,
        net: p.price,
        incl: p.price_including_taxes_and_fees ?? p.price,
        fee: p.fee_total ?? 0,
        tax: p.tax_total ?? 0,
        maxPerOrder: t.max_per_order ?? 10,
        minPerOrder: t.min_per_order ?? 1,
        available: t.is_available !== false && p.is_available !== false && !soldOut,
        soldOut,
        saleStart: p.sale_start_date ?? t.sale_start_date
      })
    }
  }
  return out
}

const fmtSaleStart = (s: string | null): string | null => {
  if (!s) return null
  const d = new Date(s.includes('T') ? s : s.replace(' ', 'T'))
  if (Number.isNaN(d.getTime()) || d.getTime() <= Date.now()) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
}

/**
 * Pantalla v2 para eventos GENERAL (sin asientos numerados). C3b: carga los
 * tickets reales de HiEvents (`/tickets`) en vez del `zone_price.json` de GitHub.
 * La fila del tipo de ticket muestra el precio neto; el carrito/resumen llevan el
 * desglose real (neto + fee + tax + total), sin porcentajes hardcodeados.
 */
export default function SaleNoSeatsV2({ event }: SaleNoSeatsV2Props) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const {
    items: cart,
    eventLabel: cartEventLabel,
    addItem,
    removeItem,
    clear: clearCart
  } = useCart()

  const [tickets, setTickets] = useState<HiTicketPublic[] | null>(null)
  const [loading, setLoading] = useState(true)
  const timer = useSessionTimer(event.id, 10)
  const wasEmptyRef = useRef(cart.length === 0)

  // Si el carrito es de otro evento, lo limpiamos al entrar.
  useEffect(() => {
    if (cartEventLabel && cartEventLabel !== event.id) clearCart()
  }, [event.id, cartEventLabel, clearCart])

  // Tickets reales de HiEvents.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    hiEventsService
      .getTickets(event.eventId)
      .then((t) => {
        if (!cancelled) setTickets(t)
      })
      .catch(() => {
        if (!cancelled) setTickets([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [event.eventId])

  const rows = useMemo(() => rowsFromTickets(tickets ?? []), [tickets])
  const totalTickets = cart.length

  const quantitiesByKey = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of cart) {
      const k = String(c.rowKey ?? '')
      m.set(k, (m.get(k) ?? 0) + 1)
    }
    return m
  }, [cart])

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

  // Timer expirado → aviso (la limpieza la hace el CartContext).
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

  const incrementRow = (row: TicketRow) => {
    if (!row.available) return
    const current = quantitiesByKey.get(row.key) ?? 0
    if (current >= row.maxPerOrder) {
      toast.show({
        variant: 'warn',
        title: 'Limit reached',
        message: `Up to ${row.maxPerOrder} of "${row.title}${row.label ? ' · ' + row.label : ''}" per order.`
      })
      return
    }
    if (totalTickets >= GLOBAL_MAX) {
      toast.show({
        variant: 'warn',
        title: 'Limit reached',
        message: `Up to ${GLOBAL_MAX} tickets per order.`
      })
      return
    }
    const issuedAt = Date.now()
    const item: CartItem = {
      ticketId: `tkt-${row.key}-${issuedAt}-${current + 1}`,
      seatLabel: row.label ? `${row.title} · ${row.label}` : row.title,
      subZone: row.title,
      zoneName: event.id,
      priceType: row.label ?? 'Standard',
      seatType: row.label ?? row.title,
      price_base: row.net,
      price_final: row.incl,
      issuedAt,
      // metadata para el desglose y la orden de HiEvents (C5)
      rowKey: row.key,
      ticketHiId: row.ticketHiId,
      priceId: row.priceId,
      fee: row.fee,
      tax: row.tax
    }
    addItem(item)
  }

  const decrementRow = (row: TicketRow) => {
    const ofRow = cart.filter((c) => c.rowKey === row.key)
    if (ofRow.length === 0) return
    removeItem(ofRow[ofRow.length - 1].ticketId)
  }

  const breakdown: PricingBreakdown = useMemo(() => {
    const subtotal = cart.reduce((s, c) => s + c.price_base, 0)
    const serviceFee = cart.reduce((s, c) => s + (Number(c.fee) || 0), 0)
    const taxes = cart.reduce((s, c) => s + (Number(c.tax) || 0), 0)
    return {
      subtotal: round2(subtotal),
      serviceFee: round2(serviceFee),
      taxes: round2(taxes),
      total: round2(subtotal + serviceFee + taxes)
    }
  }, [cart])

  const summaryItems = useMemo<CartSummaryItem[]>(() => {
    const grouped = new Map<
      string,
      { count: number; label: string; net: number; fee: number; tax: number; incl: number }
    >()
    for (const c of cart) {
      const k = String(c.rowKey ?? c.ticketId)
      const g = grouped.get(k)
      if (g) {
        g.count += 1
        g.net += c.price_base
        g.fee += Number(c.fee) || 0
        g.tax += Number(c.tax) || 0
        g.incl += c.price_final
      } else {
        grouped.set(k, {
          count: 1,
          label: c.seatLabel,
          net: c.price_base,
          fee: Number(c.fee) || 0,
          tax: Number(c.tax) || 0,
          incl: c.price_final
        })
      }
    }
    return Array.from(grouped.entries()).map(([key, g]) => ({
      id: key,
      label: `${g.count} × ${g.label}`,
      sublabel: `$${(g.net / g.count).toFixed(2)} each`,
      price: g.incl,
      net: g.net,
      fee: g.fee,
      tax: g.tax
    }))
  }, [cart])

  const handleCheckout = () => {
    if (cart.length === 0 || cart.length > GLOBAL_MAX) return
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({
        cart,
        eventInfo: {
          id: event.id,
          eventId: event.eventId,
          name: event.title,
          venue: event.venueName,
          venueId: event.venueLabel,
          date: event.raw.event_date,
          location: event.city
        },
        customer: {
          name: user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : undefined,
          email: user?.email,
          phone: user?.phone
        }
      })
    )
    navigate('/checkout')
  }

  const subtitle = `${event.day}, ${event.month} ${event.date}${event.time ? ` · ${event.time}` : ''} · ${event.venueName}`
  const disabledCta = totalTickets === 0
  const ctaLabel =
    totalTickets === 0
      ? 'Add at least one ticket'
      : `Checkout · $${breakdown.total.toFixed(2)} (${totalTickets})`

  return (
    <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={(coverSeed(event.id) % 8) + 2}>
      <StepHeader step='seats' title={event.title} subtitle={subtitle} eventLabel={event.id} />

      <main className='mx-auto max-w-6xl px-4 py-5 pb-44 lg:px-10 lg:py-8 lg:pb-12'>
        <div className='grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start'>
          <div className='min-w-0 space-y-4'>
            <header className='flex items-center justify-between gap-3'>
              <div className='min-w-0'>
                <div className='font-display text-[10px] font-bold uppercase tracking-[0.16em] text-brand-hi'>
                  General admission
                </div>
                <h2 className='mt-1 font-display text-xl font-bold tracking-tight text-white lg:text-2xl'>
                  Choose how many
                </h2>
                <p className='mt-0.5 text-[11px] text-white/55'>
                  Pick the quantity per ticket type. Standing room — no assigned seats.
                </p>
              </div>
              <Pill state={totalTickets >= GLOBAL_MAX ? 'warn' : 'normal'} size='sm'>
                {totalTickets}
              </Pill>
            </header>

            {loading ? (
              <TiersSkeleton />
            ) : rows.length === 0 ? (
              <NoTiersState />
            ) : (
              <div className='space-y-2.5'>
                {rows.map((row) => (
                  <TicketRowCard
                    key={row.key}
                    row={row}
                    qty={quantitiesByKey.get(row.key) ?? 0}
                    canIncrement={row.available && totalTickets < GLOBAL_MAX}
                    onAdd={() => incrementRow(row)}
                    onRemove={() => decrementRow(row)}
                  />
                ))}
              </div>
            )}
          </div>

          <CartSidebar
            title='Order summary'
            items={summaryItems}
            breakdown={breakdown}
            count={totalTickets}
            max={GLOBAL_MAX}
            ctaLabel={ctaLabel}
            ctaDisabled={disabledCta}
            onCheckout={handleCheckout}
            onBack={() => navigate(event.detailHref)}
          />
        </div>
      </main>

      <CartMobileSheet
        title='Order summary'
        items={summaryItems}
        breakdown={breakdown}
        count={totalTickets}
        max={GLOBAL_MAX}
        ctaLabel={ctaLabel}
        ctaDisabled={disabledCta}
        onCheckout={handleCheckout}
        onBack={() => navigate(event.detailHref)}
      />
    </LayoutV2>
  )
}

interface TicketRowProps {
  row: TicketRow
  qty: number
  canIncrement: boolean
  onAdd: () => void
  onRemove: () => void
}

const TicketRowCard = ({ row, qty, canIncrement, onAdd, onRemove }: TicketRowProps) => {
  const saleLabel = fmtSaleStart(row.saleStart)
  const offReason = row.soldOut ? 'Sold out' : saleLabel ? `On sale ${saleLabel}` : 'Not available'

  return (
    <GlassCard depth='md' radius='md' className={cn('p-4', !row.available && 'opacity-70')}>
      <div className='flex items-center justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='truncate font-display text-base font-semibold tracking-tight text-white'>
            {row.title}
            {row.label && <span className='text-white/55'> · {row.label}</span>}
          </div>
          {row.available ? (
            <div className='mt-0.5 text-[11px] text-white/55'>${row.net.toFixed(2)} per ticket</div>
          ) : (
            <div className='mt-0.5 inline-flex items-center gap-1.5 rounded-pill border border-white/12 bg-white/[0.05] px-2 py-0.5 text-[10.5px] text-white/60'>
              <span aria-hidden className='h-1 w-1 rounded-full bg-accent-coral' />
              {offReason}
            </div>
          )}
        </div>

        {row.available && (
          <div className='flex shrink-0 items-center gap-1 rounded-pill border border-white/15 bg-white/[0.06] p-1'>
            <StepperButton label='Remove one' disabled={qty === 0} onClick={onRemove}>
              −
            </StepperButton>
            <span className='min-w-[28px] text-center font-display text-base font-semibold tabular-nums text-white'>
              {qty}
            </span>
            <StepperButton label='Add one' disabled={!canIncrement} onClick={onAdd}>
              +
            </StepperButton>
          </div>
        )}
      </div>
      {qty > 0 && (
        <div className='mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3 text-[12.5px]'>
          <span className='text-white/65'>Subtotal</span>
          <span className='font-display font-semibold tabular-nums text-white'>
            ${(qty * row.net).toFixed(2)}
          </span>
        </div>
      )}
    </GlassCard>
  )
}

interface StepperButtonProps {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}

const StepperButton = ({ label, disabled, onClick, children }: StepperButtonProps) => (
  <button
    type='button'
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'grid h-8 w-8 place-items-center rounded-pill font-display text-base font-bold transition',
      disabled ? 'cursor-not-allowed text-white/30' : 'text-white hover:bg-white/[0.10]'
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
        className='h-20 animate-pulse rounded-glass-md border border-white/[0.08] bg-white/[0.04]'
      />
    ))}
  </div>
)

const NoTiersState = () => (
  <GlassCard depth='md' radius='lg' className='p-6 text-center'>
    <div className='font-display text-base font-semibold text-white'>No tickets on sale yet</div>
    <p className='mx-auto mt-2 max-w-md text-[12.5px] text-white/55'>
      Pricing for this event hasn&apos;t been published. Check back soon — or try another date if
      the artist is touring.
    </p>
  </GlassCard>
)
