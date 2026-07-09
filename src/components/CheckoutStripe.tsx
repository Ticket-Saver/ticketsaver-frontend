import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hiEventsService, HiEventsApiError } from '../services/hiEventsService'
import { Button } from './ui'
import type { CartItem } from '../router/cartContext'

/**
 * CheckoutStripe (v2) — porta el flujo de pago de PRODUCCIÓN (origin/new-version),
 * reexpresado con `hiEventsService`. Cadena 100% HiEvents:
 *
 *   [enumerado] /tickets/by-seat-ids → resuelve ticket_id/price_id por asiento
 *   POST /order (reserva)  →  form de attendees  →  PUT /order (attendees)
 *   POST /order/{id}/stripe/checkout_session  →  redirect a Stripe
 *
 * HiEvents cobra (con la cuenta que tenga configurada) y emite QR/attendees.
 * El front NO maneja Stripe ni Supabase: solo orquesta y redirige.
 */

interface CheckoutStripeProps {
  cart: CartItem[]
  /** eventInfo del checkout. `eventId` = id numérico de HiEvents. */
  eventInfo: { eventId?: string; name?: string; [k: string]: unknown }
  customer: { name?: string; email?: string; [k: string]: unknown }
}

interface Attendee {
  firstName: string
  lastName: string
  email: string
}

const genSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

const seatIdsOf = (cart: CartItem[]) =>
  cart.map((c) => Number(c.seatId)).filter((n) => Number.isFinite(n) && n > 0)

interface CheckoutSnapshot {
  orderShortId?: string
  priceIds?: number[]
  sessionIdentifier?: string
}

/** Lee la orden que el seat-picker pudo haber creado (hold al confirmar, B2). */
const readCheckoutSnapshot = (): CheckoutSnapshot | null => {
  try {
    const raw = localStorage.getItem('cart_checkout')
    return raw ? (JSON.parse(raw) as CheckoutSnapshot) : null
  } catch {
    return null
  }
}

function humanizeError(e: unknown): string {
  if (e instanceof HiEventsApiError) {
    if (e.status === 409 || e.status === 422) {
      return 'Uno o más de tus asientos acaban de ser tomados por otra persona. Volvé al mapa para elegir otros y continuar.'
    }
    if (e.status === 0) {
      return 'No pudimos conectar para reservar tus asientos. Reintentá en unos segundos.'
    }
    return 'No pudimos procesar tu orden. Probá de nuevo en unos segundos.'
  }
  return e instanceof Error ? e.message : 'Ocurrió un error inesperado.'
}

const inputCls =
  'w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-[13px] text-white placeholder-white/35 outline-none transition focus:border-brand-mid focus:bg-white/[0.06]'

export default function CheckoutStripe({ cart, eventInfo, customer }: CheckoutStripeProps) {
  const navigate = useNavigate()
  const eventId = String(eventInfo?.eventId ?? '')

  const [orderShortId, setOrderShortId] = useState<string | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // price_id por item (mismo orden que `cart`) — para mandar cada attendee con el
  // MISMO ticket_price_id usado al crear la orden.
  const priceIdsRef = useRef<number[]>([])
  const sessionIdRef = useRef<string>(genSessionId())
  const initRef = useRef(false)

  // Arma el payload de tickets: enumerado (resuelve por seat ids) o general
  // (agrupa por ticket/price de cada item del carrito).
  const buildOrderTickets = useCallback(async () => {
    const seatIds = seatIdsOf(cart)
    const isSeated = seatIds.length === cart.length && seatIds.length > 0

    if (isSeated) {
      const rows = await hiEventsService.getTicketsBySeatIds(eventId, seatIds)
      const priceIds: number[] = []
      const tickets = cart.map((c, i) => {
        const row = rows[i]
        if (!row) throw new Error(`No se pudo resolver el asiento ${c.seatLabel}.`)
        const priceId = row.prices?.[0]?.id ?? row.id
        priceIds.push(priceId)
        return { ticket_id: row.id, quantities: [{ price_id: priceId, quantity: 1 }] }
      })
      return { tickets, priceIds }
    }

    // General: cada item ya trae ticketHiId/priceId (de SaleNoSeatsV2). Agrupar.
    const grouped = new Map<string, { ticket_id: number; price_id: number; quantity: number }>()
    const priceIds: number[] = []
    for (const c of cart) {
      const ticket_id = Number(c.ticketHiId)
      const price_id = Number(c.priceId)
      priceIds.push(price_id)
      const key = `${ticket_id}-${price_id}`
      const g = grouped.get(key)
      if (g) g.quantity += 1
      else grouped.set(key, { ticket_id, price_id, quantity: 1 })
    }
    const tickets = [...grouped.values()].map((g) => ({
      ticket_id: g.ticket_id,
      quantities: [{ price_id: g.price_id, quantity: g.quantity }]
    }))
    return { tickets, priceIds }
  }, [cart, eventId])

  // Crear la orden (reserva en HiEvents) al montar.
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    setAttendees(
      cart.map(() => ({ firstName: '', lastName: '', email: customer?.email || '' }))
    )
    ;(async () => {
      try {
        if (!eventId) throw new Error('Falta el identificador del evento.')
        if (cart.length === 0) throw new Error('El carrito está vacío.')
        // Si el seat-picker ya reservó (hold al confirmar), reusamos esa orden en
        // vez de crear otra — evita una segunda reserva del mismo asiento.
        const snap = readCheckoutSnapshot()
        if (
          snap?.orderShortId &&
          Array.isArray(snap.priceIds) &&
          snap.priceIds.length === cart.length
        ) {
          priceIdsRef.current = snap.priceIds
          if (snap.sessionIdentifier) sessionIdRef.current = snap.sessionIdentifier
          setOrderShortId(snap.orderShortId)
        } else {
          const { tickets, priceIds } = await buildOrderTickets()
          priceIdsRef.current = priceIds
          const order = await hiEventsService.createOrder(eventId, {
            tickets,
            session_identifier: sessionIdRef.current,
            presale_code:
              sessionStorage.getItem(`presale_code_${eventId}`) || undefined
          })
          setOrderShortId(order.short_id)
        }
      } catch (e) {
        setError(humanizeError(e))
      } finally {
        setLoading(false)
      }
    })()
    // Solo al montar: la orden se crea una vez para este carrito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onAttendeeChange = (i: number, field: keyof Attendee, value: string) => {
    setAttendees((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  const attendeesValid =
    attendees.length > 0 &&
    attendees.every((a) => a.firstName.trim() && a.lastName.trim() && a.email.includes('@'))

  const handlePay = async () => {
    if (!orderShortId || submitting) return
    if (!attendeesValid) {
      setError('Completá nombre, apellido y un email válido para cada asistente.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const attendeesData = attendees.map((a, i) => ({
        first_name: a.firstName,
        last_name: a.lastName,
        email: a.email,
        ticket_price_id: priceIdsRef.current[i]
      }))
      const nameParts = (customer?.name || '').trim().split(' ').filter(Boolean)
      await hiEventsService.updateOrder(eventId, orderShortId, {
        order: {
          first_name: nameParts[0] || attendees[0]?.firstName || '',
          last_name: nameParts.slice(1).join(' ') || attendees[0]?.lastName || '',
          email: customer?.email || attendees[0]?.email || ''
        },
        attendees: attendeesData
      })
      const session = await hiEventsService.createStripeCheckoutSession(eventId, orderShortId, {
        success_url: `${window.location.origin}/checkout/${eventId}/${orderShortId}/success`,
        cancel_url: `${window.location.origin}/checkout`,
        session_identifier: sessionIdRef.current
      })
      if (session.checkout_url) {
        window.location.href = session.checkout_url
      } else {
        throw new Error('No se recibió la URL de pago de Stripe.')
      }
    } catch (e) {
      setError(humanizeError(e))
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='grid place-items-center py-16 text-center'>
        <span className='h-8 w-8 rounded-full border-2 border-white/15 border-t-brand-hi animate-spin' />
        <p className='mt-3 text-[12px] text-white/60'>Reservando tus lugares…</p>
      </div>
    )
  }

  // Error al crear la orden (ej. asiento ya tomado) → bloquear y volver a elegir.
  if (error && !orderShortId) {
    return (
      <div className='py-10 text-center'>
        <p className='mx-auto max-w-sm text-[13px] font-semibold text-red-400'>{error}</p>
        <Button variant='primary' size='md' className='mt-4' onClick={() => navigate(-1)}>
          Volver al mapa a elegir otro asiento
        </Button>
      </div>
    )
  }

  return (
    <div className='text-white'>
      <h3 className='font-display text-sm font-bold text-white/90'>Datos de los asistentes</h3>
      <p className='mt-0.5 text-[11.5px] text-white/50'>
        Un titular por entrada. Los boletos quedan a nombre del comprador.
      </p>

      <div className='mt-4 space-y-3'>
        {attendees.map((a, i) => (
          <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-3'>
            <div className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/45'>
              {cart[i]?.subZone ? `${cart[i].subZone} · ` : ''}
              {String(cart[i]?.seatLabel ?? `Entrada ${i + 1}`)}
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <input
                className={inputCls}
                placeholder='Nombre'
                value={a.firstName}
                onChange={(e) => onAttendeeChange(i, 'firstName', e.target.value)}
              />
              <input
                className={inputCls}
                placeholder='Apellido'
                value={a.lastName}
                onChange={(e) => onAttendeeChange(i, 'lastName', e.target.value)}
              />
              <input
                className={`${inputCls} col-span-2`}
                type='email'
                placeholder='Email'
                value={a.email}
                onChange={(e) => onAttendeeChange(i, 'email', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className='mt-3 text-[12px] font-medium text-red-400'>{error}</p>}

      <Button
        variant='primary'
        size='lg'
        fullWidth
        className='mt-5'
        onClick={handlePay}
        disabled={submitting || !attendeesValid}
      >
        {submitting ? 'Redirigiendo a Stripe…' : 'Pagar de forma segura'}
      </Button>
      <p className='mt-2 text-center text-[10.5px] text-white/40'>
        Te llevamos a Stripe para completar el pago de forma segura.
      </p>
    </div>
  )
}
