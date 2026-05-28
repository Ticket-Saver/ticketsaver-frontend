import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SeatchartJS, { CartChangeEvent, Options } from 'seatchart'
import Seatchart from '../../Seatchart'
import { Button, GlassCard, Pill, useToast } from '../../ui'
import SeatLegend from './SeatLegend'
import {
  CartSidebar,
  CartMobileSheet,
  type CartSummaryItem
} from './CartSummaryPanel'
import { useSessionTimer } from '../../../hooks/useSessionTimer'
import { useSessionCleanup } from '../../../hooks/useSessionCleanup'
import { useSeatContiguity } from '../../../hooks/useSeatContiguity'
import {
  lockSeatAudited,
  unlockSeatAudited
} from '../../../services/seatRaceAudit'
import {
  getSessionId,
  releaseAllSeatsForSession
} from '../../../services/sessionCleanupService'
import { ticketId } from '../../TicketUtils'
import { computePricing } from '../../../lib/pricing'
import { useCart, type CartItem } from '../../../router/cartContext'
import seatmap from '../../../styles/effects/seatmap.module.css'
import type { UIEvent } from '../../../types/uiEvent'
import type { SelectedArea } from './VenuePicker'

const MAX_SEATS = 10

/**
 * Reescritura v2 del flow del antiguo `TicketEventSale.tsx`.
 *
 * Mantiene la misma plomería de backend (lockSeat / fetchTakenSeats /
 * sessionTimer / sessionCleanup / cart_checkout en localStorage), pero
 * la UI es nueva (glass panels, toasts en vez de alert(), warnings de
 * contigüidad, sticky CTA). El SeatchartJS sigue rindiendo los seats —
 * sólo le inyectamos un `themeClassMap` para que use las clases CSS
 * module del v2 en vez de las globales del index.css legacy.
 */

interface SeatGridProps {
  event: UIEvent
  selectedArea: SelectedArea
  onBack: () => void
}


// Mapa que reemplaza el cssClass global por la clase CSS module
const SEAT_THEME_CLASS_MAP: Record<string, string> = {
  economy: seatmap.economy,
  evip: seatmap.evip,
  Orange: seatmap.Orange,
  Green: seatmap.Green,
  Purple: seatmap.Purple,
  Pink: seatmap.Pink,
  Yellow: seatmap.Yellow,
  Gray: seatmap.Gray,
  Red: seatmap.Red,
  Brown: seatmap.Brown,
  Blue: seatmap.Blue,
  Aqua: seatmap.Aqua,
  Beige: seatmap.Beige,
  Coral: seatmap.Coral,
  Celeste: seatmap.Celeste,
  white_background: seatmap.white_background,
  wheelchair: seatmap.wheelchair,
  companion: seatmap.companion,
  reduced: seatmap.reduced,
  default: seatmap.economy
}

const fetchTakenSeats = async (
  subZone: string,
  eventLabel: string
): Promise<{ row: number; col: number }[]> => {
  try {
    const r = await fetch('/api/fetchTakenSeats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subZone, Event: eventLabel })
    })
    if (!r.ok) return []
    const data = await r.json()
    return (data.data || []).map((s: { row: number; col: number }) => ({
      row: s.row,
      col: s.col
    }))
  } catch (err) {
    if (import.meta.env.DEV) console.error('fetchTakenSeats error', err)
    return []
  }
}

export default function SeatGrid({
  event,
  selectedArea,
  onBack
}: SeatGridProps) {
  const navigate = useNavigate()
  const toast = useToast()

  const areaOptions = selectedArea.options ?? null

  const [reservedSeats, setReservedSeats] = useState<
    { row: number; col: number }[]
  >([])
  const [reservedLoading, setReservedLoading] = useState(true)
  const {
    items: cart,
    addItem,
    removeItem,
    setItems: setCartItems,
    clear: clearCart
  } = useCart()
  const seatchartRef = useRef<SeatchartJS>()

  const timerState = useSessionTimer(event.id, 10)
  const { validatedCart, isValidating } = useSessionCleanup(event.id)
  const prevWarningCountRef = useRef(0)
  const wasEmptyRef = useRef(cart.length === 0)
  const hydratedRef = useRef(false)

  // Fetch reservedSeats al montar / cambiar de zona
  useEffect(() => {
    if (!areaOptions) return
    setReservedLoading(true)
    let cancelled = false
    fetchTakenSeats(selectedArea.title, event.id).then((seats) => {
      if (!cancelled) {
        setReservedSeats(seats)
        setReservedLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [areaOptions, selectedArea.title, event.id])

  // Hidrata cart desde sesión validada — sólo una vez al montar.
  // Si el CartContext ya tiene items (porque el usuario volvió desde
  // otra ruta sin perder estado), no pisamos.
  useEffect(() => {
    if (hydratedRef.current) return
    if (isValidating) return
    if (validatedCart && validatedCart.length > 0 && cart.length === 0) {
      setCartItems(validatedCart as CartItem[])
    }
    hydratedRef.current = true
  }, [isValidating, validatedCart, cart.length, setCartItems])

  // Timer expirado → toast + release seats backend + clear cart.
  // El cartContext auto-clear también limpia, pero acá hacemos el side
  // effect específico de SeatGrid (release de los locks server-side).
  useEffect(() => {
    if (!timerState.isExpired || cart.length === 0) return
    const sessionId = getSessionId()
    toast.show({
      variant: 'warn',
      title: 'Session expired',
      message: 'Your held seats were released. Pick again to continue.',
      duration: 6000
    })
    if (sessionId) {
      releaseAllSeatsForSession(sessionId, event.id).catch(() => {})
    }
    clearCart()
  }, [timerState.isExpired, cart.length, event.id, toast, clearCart])

  // Toast "Hold started" cuando agregamos el primer item del carrito.
  useEffect(() => {
    if (cart.length > 0 && wasEmptyRef.current) {
      wasEmptyRef.current = false
      toast.show({
        variant: 'info',
        title: 'Hold started',
        message: 'You have 10 minutes to complete your purchase.',
        duration: 4000
      })
    }
    if (cart.length === 0) {
      wasEmptyRef.current = true
    }
  }, [cart.length, toast])

  const contiguity = useSeatContiguity({
    selected: cart
      .map((c) => c.coords)
      .filter((c): c is { row: number; col: number } => Boolean(c)),
    reserved: reservedSeats,
    disabled:
      ((areaOptions?.map as any)?.disabledSeats as {
        row: number
        col: number
      }[]) || [],
    columns: (areaOptions?.map as any)?.columns
  })

  // Toast cuando aparece un nuevo asiento aislado
  useEffect(() => {
    const current = contiguity.warnings.length
    if (current > prevWarningCountRef.current) {
      const w = contiguity.warnings[current - 1]
      toast.show({
        variant: 'info',
        title: 'Isolated seat',
        message: w.message,
        duration: 6000
      })
    }
    prevWarningCountRef.current = current
  }, [contiguity.warnings, toast])

  const seatchartOptions: Options | null = useMemo(() => {
    if (!areaOptions) return null
    return {
      ...areaOptions,
      map: {
        ...(areaOptions.map as Record<string, unknown>),
        reservedSeats
      } as Options['map'],
      cart: {
        ...((areaOptions as any).cart || {}),
        visible: false
      }
    } as Options
  }, [areaOptions, reservedSeats])

  const handleSeatClick = async (e: CartChangeEvent) => {
    if (!areaOptions) return
    const sessionId = getSessionId()

    const lockingSeat = {
      Seat: e.seat.label,
      row: e.seat.index.row,
      col: e.seat.index.col,
      subZone: selectedArea.title,
      sessionId,
      Event: event.id
    }

    if (e.action === 'add') {
      if (cart.length >= MAX_SEATS) {
        toast.show({
          variant: 'warn',
          title: 'Limit reached',
          message: `Maximum of ${MAX_SEATS} tickets per order.`
        })
        // Revertimos visualmente la selección en el Seatchart
        try {
          ;(seatchartRef.current as any)?.removeFromCart?.(e.seat)
        } catch {
          /* noop */
        }
        return
      }

      const result = await lockSeatAudited(lockingSeat)
      if (!result.ok) {
        // Race real: el server confirma que otro session se llevó el seat
        // → no agregamos al cart y re-fetcheamos para sincronizar el map.
        if (result.raceDetected) {
          toast.show({
            variant: 'warn',
            title: 'Seat taken',
            message:
              result.userMessage || 'Another buyer grabbed it first. Try another.'
          })
          const updated = await fetchTakenSeats(selectedArea.title, event.id)
          setReservedSeats(updated)
          try {
            ;(seatchartRef.current as any)?.removeFromCart?.(e.seat)
          } catch {
            /* noop */
          }
          return
        }

        // Error de red, 404 (endpoint no disponible en dev), 500, etc.
        // Best-effort: agregamos al cart pero avisamos al usuario que el
        // hold no quedó garantizado server-side. Evita que el flow se
        // rompa en dev local donde /api/lockSeat es una Netlify Function
        // que no corre con `vite dev`.
        if (import.meta.env.DEV) {
          console.warn('[SeatGrid] lockSeat falló — agregando al cart igual (DEV).', result)
        } else {
          toast.show({
            variant: 'warn',
            title: 'Hold unconfirmed',
            message:
              'We could not confirm your seat hold. It may be released if someone else picks it.',
            duration: 5000
          })
        }
        // Continúa abajo y agrega al cart.
      }

      const issuedAt = Date.now()
      const newTicketId = ticketId(
        event.id,
        selectedArea.title,
        cart.length + 1,
        issuedAt
      )
      const priceBase = selectedArea.priceFrom
      const priceFinal = selectedArea.priceFrom

      // Dedupe: si ya hay un item con ese seatLabel, no agregamos otra vez.
      if (cart.some((p) => p.seatLabel === e.seat.label)) return

      addItem({
        ticketId: newTicketId,
        seatLabel: e.seat.label,
        coords: { row: e.seat.index.row, col: e.seat.index.col },
        subZone: selectedArea.title,
        zoneName: event.id,
        priceType: 'default',
        seatType: selectedArea.name || 'default',
        price_base: priceBase,
        price_final: priceFinal,
        issuedAt
      })
    } else if (e.action === 'remove') {
      const result = await unlockSeatAudited(lockingSeat)
      if (!result.ok && !result.raceDetected) {
        toast.show({
          variant: 'warn',
          message: result.userMessage || 'Could not release the seat.'
        })
      }
      const removed = cart.find((c) => c.seatLabel === e.seat.label)
      if (removed) removeItem(removed.ticketId)
    }
  }

  const subtotalCost = useMemo(
    () => cart.reduce((sum, c) => sum + c.price_final, 0),
    [cart]
  )

  const pricing = useMemo(
    () => computePricing(subtotalCost),
    [subtotalCost]
  )

  const summaryItems = useMemo<CartSummaryItem[]>(
    () =>
      cart.map((c) => ({
        id: c.ticketId,
        label: `${c.subZone} · ${c.seatLabel}`,
        sublabel: c.coords
          ? `Row ${c.coords.row + 1} · Seat ${c.coords.col + 1}`
          : undefined,
        price: c.price_final
      })),
    [cart]
  )

  const handleCheckout = () => {
    if (cart.length === 0 || cart.length > MAX_SEATS) return
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
        customer: {}
      })
    )
    navigate('/checkout')
  }

  if (!areaOptions) {
    return <FallbackState event={event} area={selectedArea} onBack={onBack} />
  }

  const disabledCta = cart.length === 0 || cart.length > MAX_SEATS
  const ctaLabel = cart.length === 0
    ? 'Pick at least one seat'
    : `Checkout · $${pricing.total.toFixed(2)} (${cart.length})`

  return (
    <>
      <div className='grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start pb-44 lg:pb-12'>
        <div className='space-y-4 min-w-0'>
          <header className='flex items-center justify-between gap-3'>
            <div className='min-w-0'>
              <div className='text-[10px] uppercase tracking-[0.16em] font-display font-bold text-brand-hi'>
                Section
              </div>
              <h2 className='mt-1 font-display text-xl lg:text-2xl font-bold text-white tracking-tight truncate'>
                {selectedArea.title}
              </h2>
              <p className='text-[11px] text-white/55 mt-0.5'>
                Click on available seats to select them
              </p>
            </div>
            <Pill state={cart.length >= MAX_SEATS ? 'warn' : 'normal'} size='sm'>
              {cart.length} / {MAX_SEATS}
            </Pill>
          </header>

          <GlassCard depth='md' radius='lg' className='p-3 lg:p-4'>
            <div className='text-center text-[10px] uppercase tracking-[0.22em] text-white/55 font-display font-bold py-2'>
              Stage
            </div>
            <div
              aria-hidden
              className='mx-8 h-0.5 rounded-pill mb-3'
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
              }}
            />
            {reservedLoading || !seatchartOptions ? (
              <div className='h-[420px] lg:h-[500px] rounded-glass-md bg-white/[0.04] animate-pulse' />
            ) : (
              <div className='overflow-x-auto'>
                <Seatchart
                  key={`${selectedArea.title}-${reservedSeats.length}`}
                  ref={seatchartRef}
                  options={seatchartOptions}
                  onSeatClick={handleSeatClick}
                  themeClassMap={SEAT_THEME_CLASS_MAP}
                  className='relative overflow-x-auto w-full h-[420px] lg:h-[500px] min-w-[600px]'
                />
              </div>
            )}
          </GlassCard>

          <SeatLegend />

          {contiguity.hasIsolation && (
            <ContiguityBanner count={contiguity.warnings.length} />
          )}
        </div>

        <CartSidebar
          title='Your seats'
          items={summaryItems}
          breakdown={pricing}
          count={cart.length}
          max={MAX_SEATS}
          ctaLabel={ctaLabel}
          ctaDisabled={disabledCta}
          onCheckout={handleCheckout}
          onBack={onBack}
          helperText='Tap a selected seat on the map to remove it.'
        />
      </div>

      <CartMobileSheet
        title='Your seats'
        items={summaryItems}
        breakdown={pricing}
        count={cart.length}
        max={MAX_SEATS}
        ctaLabel={ctaLabel}
        ctaDisabled={disabledCta}
        onCheckout={handleCheckout}
        onBack={onBack}
        helperText='Tap a selected seat on the map to remove it.'
      />
    </>
  )
}

const ContiguityBanner = ({ count }: { count: number }) => (
  <div
    className='rounded-glass-md border border-accent-coral/30 px-3.5 py-2.5 flex items-start gap-2.5 backdrop-blur-glass-strong'
    style={{ background: 'rgba(255, 177, 200, 0.12)' }}
  >
    <span
      aria-hidden
      className='mt-1 h-1.5 w-1.5 rounded-full bg-accent-coral shadow-[0_0_8px_var(--accent-coral)]'
    />
    <p className='text-[11.5px] text-white/85 leading-relaxed'>
      <strong className='text-white font-semibold'>Heads up.</strong>{' '}
      Your selection would leave {count} {count === 1 ? 'seat' : 'seats'}{' '}
      isolated. Consider widening your group or shifting it to avoid orphans.
    </p>
  </div>
)

interface FallbackProps {
  event: UIEvent
  area: SelectedArea
  onBack: () => void
}

const FallbackState = ({ area, onBack }: FallbackProps) => {
  const navigate = useNavigate()
  return (
    <GlassCard depth='md' radius='lg' className='p-6 lg:p-8 text-center'>
      <div className='mx-auto h-12 w-12 rounded-glass-sm bg-accent-coral/15 grid place-items-center mb-3'>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          aria-hidden
        >
          <path
            d='M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-accent-coral'
          />
        </svg>
      </div>
      <h3 className='font-display text-base font-semibold text-white'>
        Seat map not available
      </h3>
      <p className='mt-2 text-[12.5px] text-white/65 max-w-md mx-auto leading-relaxed'>
        We don&apos;t have a detailed seatmap for{' '}
        <span className='font-semibold text-white'>{area.title}</span> yet, so
        we can&apos;t sell assigned seats for it right now. Pick another
        section, or reach out and we&apos;ll sort it for you.
      </p>
      <div className='mt-5 flex flex-col sm:flex-row gap-2 justify-center'>
        <Button variant='ghost' size='md' onClick={onBack}>
          ← Choose another section
        </Button>
        <Button
          variant='primary'
          size='md'
          onClick={() => navigate('/footer/contact')}
        >
          Contact support
        </Button>
      </div>
    </GlassCard>
  )
}
