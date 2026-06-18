import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassCard, Pill, useToast } from '../../ui'
import SeatLegend from './SeatLegend'
import SeatIcon from './SeatIconV2'
import {
  CartSidebar,
  CartMobileSheet,
  type CartSummaryItem
} from './CartSummaryPanel'
import { useSessionTimer } from '../../../hooks/useSessionTimer'
import { validateSeatAddByNumber, type RowSeatInfo } from '../../../hooks/useSeatContiguity'
import { useCart } from '../../../router/cartContext'
import { hiEventsService, HiEventsApiError, type HiSeatPricing } from '../../../services/hiEventsService'
import type { PricingBreakdown } from '../../../lib/pricing'
import type { UIEvent } from '../../../types/uiEvent'
import type { SeatItem } from './seatTypes'

const MAX_SEATS = 10
const round2 = (n: number) => Math.round(n * 100) / 100
const SEAT_NUM = (s: SeatItem): number =>
  typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0

export interface SelectedSection {
  /** Nombre legible de la sección (ej. "Left Orange"). */
  label: string
  /** Asientos de la sección (todos: disponibles y ocupados). */
  seats: SeatItem[]
  /** id del grupo (position-color) — para buscar el molde de la sección. */
  groupId?: string
}

interface SeatPickerV2Props {
  event: UIEvent
  section: SelectedSection
  /**
   * Molde de la sección (fila → columnas con seat_number | null). Solo para mapas
   * con geometría cargada (map3/Copernicus). Si viene, la grilla respeta la forma
   * REAL (cada butaca en su columna, con huecos); si no, se renderiza por filas.
   */
  sectionLayout?: Record<string, (number | null)[]>
  onBack: () => void
}

/**
 * Paso 2 del flujo de venta enumerado — selección de asientos de una sección,
 * con la línea de diseño v2 (glass card + Stage + grilla + SeatLegend + sidebar
 * de carrito). Reemplaza al Seatchart: renderiza los asientos REALES de HiEvents
 * (fila/número) y usa los precios con tax/fee reales. Conserva la contigüidad y
 * el timer de sesión del flujo original.
 */
export default function SeatPickerV2({ event, section, sectionLayout, onBack }: SeatPickerV2Props) {
  const navigate = useNavigate()
  const toast = useToast()
  const { items: cart, addItem, removeItem } = useCart()
  const timerState = useSessionTimer(event.id, 10)
  const [warning, setWarning] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const wasEmptyRef = useRef(cart.length === 0)
  // session_identifier ESTABLE para toda la sesión de compra (idempotencia de
  // reintentos de la orden). Se comparte con el checkout vía el snapshot.
  const sessionIdRef = useRef(
    `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  )

  // El mapa masivo NO trae precio (performance). Al abrir la sección traemos el precio
  // + impuestos SOLO de sus asientos (pocos → <0.6s) vía /tickets/by-seat-ids.
  const [pricing, setPricing] = useState<Map<number, HiSeatPricing>>(new Map())
  const [pricingReady, setPricingReady] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    setPricingReady(false)
    const ids = section.seats.map((s) => s.id)
    hiEventsService
      .getTicketsBySeatIds(event.eventId, ids, controller.signal)
      .then((rows) => {
        if (!mounted) return
        setPricing(new Map(rows.map((r) => [r.id, r])))
        setPricingReady(true)
      })
      .catch(() => {
        // Si falla, no bloqueamos la compra: se permite con el precio base.
        if (mounted) setPricingReady(true)
      })
    return () => {
      mounted = false
      controller.abort()
    }
  }, [section.seats, event.eventId])

  // B1 · Disponibilidad EN VIVO. Refrescamos los asientos de la sección cada ~11s
  // (pausado si la pestaña está oculta). Si un asiento que tenías seleccionado lo
  // tomó otra persona, lo quitamos del carrito y avisamos. `liveAvail` overridea
  // la disponibilidad inicial de la prop `section.seats`.
  const [liveAvail, setLiveAvail] = useState<Map<number, boolean>>(new Map())
  const cartRef = useRef(cart)
  useEffect(() => {
    cartRef.current = cart
  }, [cart])

  const isSeatAvailable = useCallback(
    (seat: SeatItem): boolean => {
      const live = liveAvail.get(seat.id)
      return live !== undefined ? live : seat.is_available && !seat.is_sold_out
    },
    [liveAvail]
  )

  useEffect(() => {
    if (!section.groupId) return
    let cancelled = false
    const poll = async () => {
      if (document.visibilityState === 'hidden') return
      try {
        const fresh = (await hiEventsService.getSeats(
          event.eventId,
          section.groupId
        )) as unknown as SeatItem[]
        if (cancelled) return
        const next = new Map<number, boolean>()
        for (const s of fresh) {
          next.set(s.id, s.is_available === true && s.is_sold_out !== true)
        }
        setLiveAvail(next)
        // ¿Algún asiento del carrito se ocupó mientras tanto?
        const lost = cartRef.current.filter((c) => next.get(Number(c.seatId)) === false)
        if (lost.length > 0) {
          lost.forEach((it) => removeItem(it.ticketId))
          toast.show({
            variant: 'warn',
            title: lost.length === 1 ? 'Asiento ya no disponible' : 'Asientos ya no disponibles',
            message: `${lost.map((l) => l.seatLabel).join(', ')} ${
              lost.length === 1 ? 'fue tomado' : 'fueron tomados'
            } por otra persona. Lo quitamos de tu selección; elegí otro para continuar.`,
            duration: 7000
          })
        }
      } catch {
        /* error de red en el polling → se reintenta en el próximo tick */
      }
    }
    const interval = setInterval(poll, 11000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [section.groupId, event.eventId, removeItem, toast])

  const seatsByRow = useMemo(() => {
    const acc: Record<string, SeatItem[]> = {}
    for (const s of section.seats) {
      const row = s.row || '?'
      if (!acc[row]) acc[row] = []
      acc[row].push(s)
    }
    for (const row in acc) acc[row].sort((a, b) => SEAT_NUM(a) - SEAT_NUM(b))
    return acc
  }, [section.seats])

  const rows = useMemo(
    () =>
      Object.keys(seatsByRow).sort((a, b) =>
        a.length !== b.length ? a.length - b.length : a.localeCompare(b)
      ),
    [seatsByRow]
  )

  // Asiento por (fila|número) — para ubicar cada butaca del molde.
  const seatByKey = useMemo(() => {
    const m = new Map<string, SeatItem>()
    for (const s of section.seats) m.set(`${s.row}|${SEAT_NUM(s)}`, s)
    return m
  }, [section.seats])

  // Filas a renderizar: del molde (en su orden) si hay; si no, las de los asientos.
  const gridRows = useMemo(
    () => (sectionLayout ? Object.keys(sectionLayout) : rows),
    [sectionLayout, rows]
  )

  // Asientos seleccionados = los que ya están en el carrito (por seat id).
  const selectedSeatIds = useMemo(
    () => new Set(cart.map((c) => Number(c.seatId)).filter((n) => !Number.isNaN(n))),
    [cart]
  )

  // Toast "Hold started" al primer asiento del carrito.
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
    if (cart.length === 0) wasEmptyRef.current = true
  }, [cart.length, toast])

  // Timer expirado → aviso (el cartContext limpia el carrito automáticamente).
  useEffect(() => {
    if (!timerState.isExpired || cart.length === 0) return
    toast.show({
      variant: 'warn',
      title: 'Session expired',
      message: 'Your held seats were released. Pick again to continue.',
      duration: 6000
    })
  }, [timerState.isExpired, cart.length, toast])

  const handleSeatClick = (seat: SeatItem) => {
    if (!isSeatAvailable(seat)) return

    // Ya seleccionado → quitar (siempre permitido).
    if (selectedSeatIds.has(seat.id)) {
      const item = cart.find((c) => Number(c.seatId) === seat.id)
      if (item) removeItem(item.ticketId)
      setWarning(null)
      return
    }

    // Precios de la sección aún cargando → no agregar sin precio (se resuelve en <1s).
    if (!pricingReady) {
      setWarning('Loading seat prices, one moment…')
      return
    }

    if (cart.length >= MAX_SEATS) {
      setWarning(`You can select up to ${MAX_SEATS} seats per order.`)
      return
    }

    // Contigüidad / anti-huérfanos dentro de la fila (bloqueo duro).
    const rowList = seatsByRow[seat.row] || []
    const rowSeats: RowSeatInfo[] = rowList.map((s) => ({
      num: SEAT_NUM(s),
      available: isSeatAvailable(s)
    }))
    const selectedNums = rowList.filter((s) => selectedSeatIds.has(s.id)).map(SEAT_NUM)
    const res = validateSeatAddByNumber(SEAT_NUM(seat), rowSeats, selectedNums)
    if (!res.ok) {
      setWarning(res.reason || 'That seat would break the seating rules.')
      return
    }

    setWarning(null)
    const p = pricing.get(seat.id)
    const base = p?.price ?? seat.price ?? 0
    const final = p?.price_including_taxes_and_fees ?? base
    addItem({
      ticketId: `seat-${seat.id}`,
      seatLabel: `${seat.row}${seat.seat_number}`,
      subZone: section.label,
      zoneName: event.id,
      priceType: seat.price_range,
      seatType: seat.price_range,
      price_base: base,
      price_final: final,
      issuedAt: Date.now(),
      // metadata para el desglose y la orden de HiEvents (C5)
      seatId: seat.id,
      fee: p?.fee_total ?? 0,
      tax: p?.tax_total ?? 0
    })
  }

  const summaryItems: CartSummaryItem[] = useMemo(
    () =>
      cart.map((c) => ({
        id: c.ticketId,
        label: `${c.subZone} · ${c.seatLabel}`,
        sublabel: typeof c.priceType === 'string' ? c.priceType : undefined,
        price: c.price_final,
        net: c.price_base,
        fee: Number(c.fee) || 0,
        tax: Number(c.tax) || 0
      })),
    [cart]
  )

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

  const eventInfo = {
    id: event.id,
    eventId: event.eventId,
    name: event.title,
    venue: event.venueName,
    venueId: event.venueLabel,
    date: event.raw.event_date,
    location: event.city
  }

  // B2 · HOLD AL CONFIRMAR. Al tocar "Checkout" reservamos los asientos en HiEvents
  // (POST /order) ANTES de ir al pago. Si otro comprador se adelantó, la reserva
  // rebota acá mismo (409/422) y el usuario sigue en el mapa (el realtime ya marca
  // el asiento como ocupado). Si todo va bien, el contador pasa a reflejar el
  // tiempo REAL de la reserva (10 min frescos para pagar) y pasamos la orden ya
  // creada al checkout.
  const handleCheckout = async () => {
    if (cart.length === 0 || cart.length > MAX_SEATS || confirming) return
    setConfirming(true)
    setWarning(null)
    try {
      const seatIds = cart
        .map((c) => Number(c.seatId))
        .filter((n) => Number.isFinite(n) && n > 0)
      const rows = await hiEventsService.getTicketsBySeatIds(event.eventId, seatIds)
      const priceIds: number[] = []
      const tickets = cart.map((c, i) => {
        const row = rows[i]
        if (!row) throw new Error(`No se pudo resolver el asiento ${c.seatLabel}.`)
        const priceId = row.prices?.[0]?.id ?? row.id
        priceIds.push(priceId)
        return { ticket_id: row.id, quantities: [{ price_id: priceId, quantity: 1 }] }
      })

      const order = await hiEventsService.createOrder(event.eventId, {
        tickets,
        session_identifier: sessionIdRef.current,
        // Preventa: si se validó un código en el detalle, viaja para que el back
        // permita la compra anticipada (red de seguridad además del gate visual).
        presale_code:
          sessionStorage.getItem(`presale_code_${event.eventId}`) || undefined
      })

      const reservedMs = Date.parse((order.reserved_until || '').replace(' ', 'T') + 'Z')
      if (!Number.isNaN(reservedMs)) timerState.syncToServerExpiry(reservedMs)

      localStorage.setItem(
        'cart_checkout',
        JSON.stringify({
          cart,
          eventInfo,
          orderShortId: order.short_id,
          reservedUntil: order.reserved_until,
          priceIds,
          sessionIdentifier: sessionIdRef.current
        })
      )
      navigate('/checkout')
    } catch (e) {
      const conflict =
        e instanceof HiEventsApiError && (e.status === 409 || e.status === 422)
      setWarning(
        conflict
          ? 'Uno o más de tus asientos acaban de ser tomados por otra persona. Elegí otros para continuar.'
          : 'No pudimos reservar tus asientos. Reintentá en unos segundos.'
      )
    } finally {
      setConfirming(false)
    }
  }

  const disabledCta = cart.length === 0 || cart.length > MAX_SEATS || confirming
  const ctaLabel = confirming
    ? 'Reservando tus asientos…'
    : cart.length === 0
      ? 'Pick at least one seat'
      : `Checkout · $${breakdown.total.toFixed(2)} (${cart.length})`

  return (
    <>
      <div className='grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start pb-44 lg:pb-12'>
        <div className='min-w-0 space-y-4'>
          <header className='flex items-center justify-between gap-3'>
            <div className='min-w-0'>
              <div className='font-display text-[10px] font-bold uppercase tracking-[0.16em] text-brand-hi'>
                Section
              </div>
              <h2 className='mt-1 truncate font-display text-xl font-bold tracking-tight text-white lg:text-2xl'>
                {section.label}
              </h2>
              <p className='mt-0.5 text-[11px] text-white/55'>
                {pricingReady ? 'Click on available seats to select them' : 'Loading seat prices…'}
              </p>
            </div>
            <Pill state={cart.length >= MAX_SEATS ? 'warn' : 'normal'} size='sm'>
              {cart.length} / {MAX_SEATS}
            </Pill>
          </header>

          <GlassCard depth='md' radius='lg' className='p-3 lg:p-4'>
            <div className='py-2 text-center font-display text-[10px] font-bold uppercase tracking-[0.22em] text-white/55'>
              Stage
            </div>
            <div
              aria-hidden
              className='mx-8 mb-3 h-0.5 rounded-pill'
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
              }}
            />
            {section.seats.length === 0 ? (
              <div className='grid h-[300px] place-items-center text-[12px] text-white/45'>
                No seats available in this section.
              </div>
            ) : (
              <div className='overflow-auto'>
                <div className='mx-auto flex w-max min-w-full flex-col items-center gap-1.5 py-3'>
                  {gridRows.map((row) => (
                    <div key={row} className='flex items-center'>
                      <div className='mr-3 w-8 shrink-0 text-right font-display text-[11px] font-semibold text-white/45'>
                        {row}
                      </div>
                      <div className='flex items-center gap-1'>
                        {sectionLayout?.[row]
                          ? sectionLayout[row].map((sn, col) => {
                              const seat = sn !== null ? seatByKey.get(`${row}|${sn}`) : undefined
                              if (!seat) {
                                // Hueco/pasillo (o butaca no cargada) → espacio para conservar la forma real.
                                return <span key={col} aria-hidden className='inline-block h-[38px] w-[38px]' />
                              }
                              return (
                                <SeatIcon
                                  key={col}
                                  isAvailable={isSeatAvailable(seat)}
                                  isSelected={selectedSeatIds.has(seat.id)}
                                  seatNumber={seat.seat_number}
                                  row={seat.row}
                                  onClick={() => handleSeatClick(seat)}
                                  className='transition-transform hover:scale-110'
                                />
                              )
                            })
                          : (seatsByRow[row] ?? []).map((seat) => (
                              <SeatIcon
                                key={seat.id}
                                isAvailable={isSeatAvailable(seat)}
                                isSelected={selectedSeatIds.has(seat.id)}
                                seatNumber={seat.seat_number}
                                row={seat.row}
                                onClick={() => handleSeatClick(seat)}
                                className='transition-transform hover:scale-110'
                              />
                            ))}
                      </div>
                      <div className='ml-3 w-8 shrink-0 opacity-0' aria-hidden>
                        {row}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {warning && (
              <div className='mt-3 flex items-start gap-2 rounded-glass-sm border border-accent-coral/25 bg-[rgba(255,94,158,0.10)] px-3 py-2.5'>
                <span
                  aria-hidden
                  className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-coral'
                />
                <p className='text-[11.5px] leading-relaxed text-white/85'>{warning}</p>
              </div>
            )}
          </GlassCard>

          <SeatLegend />
        </div>

        <CartSidebar
          title='Your seats'
          items={summaryItems}
          breakdown={breakdown}
          count={cart.length}
          max={MAX_SEATS}
          ctaLabel={ctaLabel}
          ctaDisabled={disabledCta}
          onCheckout={handleCheckout}
          onBack={onBack}
          helperText='Tap a selected seat to remove it.'
        />
      </div>

      <CartMobileSheet
        title='Your seats'
        items={summaryItems}
        breakdown={breakdown}
        count={cart.length}
        max={MAX_SEATS}
        ctaLabel={ctaLabel}
        ctaDisabled={disabledCta}
        onCheckout={handleCheckout}
        onBack={onBack}
        helperText='Tap a selected seat to remove it.'
      />
    </>
  )
}
