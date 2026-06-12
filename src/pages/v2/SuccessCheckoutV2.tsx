import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import LayoutV2 from '../../layouts/LayoutV2'
import { Button, GlassCard } from '../../components/ui'
import { hiEventsService } from '../../services/hiEventsService'
import { useCart } from '../../router/cartContext'

/**
 * SuccessCheckoutV2 — pantalla post-pago, porta el flujo de producción
 * (origin/new-version SuccessCheckout) con piel v2. Tras volver de Stripe:
 *   POST /confirm_payment (con reintentos) → GET /order → QR con public_id.
 * HiEvents ya emitió (QR + email); acá mostramos la confirmación.
 *
 * Ruta: /checkout/:venueId/:orderShortId/success?session_id=cs_...
 * (`venueId` = id numérico del evento HiEvents).
 */

const MAX_RETRIES = 6
const BASE_DELAY_MS = 700
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface Attendee {
  public_id: string
  first_name?: string
  last_name?: string
  ticket?: { id?: number; title?: string; event_id?: number; seat_label?: string }
}

interface OrderData {
  short_id: string
  status: string
  payment_status: string
  total_gross: number
  currency: string
  first_name?: string
  last_name?: string
  email?: string
  attendees?: Attendee[]
  order_items?: Array<{ item_name?: string; quantity?: number; price?: number }>
}

/** Extrae el session_id real de la URL (Stripe a veces deja el placeholder o `?` repetidos). */
const extractSessionId = (): string | null => {
  const matches = window.location.href.match(/session_id=([^&?#]+)/g)
  if (matches) {
    for (const m of matches) {
      const v = m.replace('session_id=', '')
      if (v && !v.includes('CHECKOUT_SESSION_ID') && !v.includes('%7B') && !v.includes('%7D')) {
        return decodeURIComponent(v)
      }
    }
  }
  return new URLSearchParams(window.location.search).get('session_id')
}

export default function SuccessCheckoutV2() {
  const navigate = useNavigate()
  const { venueId, orderShortId } = useParams<{ venueId: string; orderShortId: string }>()
  const { clear } = useCart()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true
    let mounted = true

    ;(async () => {
      try {
        if (!venueId || !orderShortId) throw new Error('Faltan datos de la orden.')
        const sessionId = extractSessionId()
        if (!sessionId) throw new Error('No se encontró la sesión de pago en la URL.')

        // Confirmar el pago con reintentos exponenciales (el webhook de HiEvents
        // puede tardar unos segundos en marcar la orden como pagada).
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            await hiEventsService.confirmPayment(venueId, orderShortId, sessionId)
            break
          } catch {
            if (attempt < MAX_RETRIES - 1) {
              await delay(Math.round(BASE_DELAY_MS * Math.pow(1.7, attempt)))
            }
          }
        }

        const data = (await hiEventsService.getOrder(venueId, orderShortId)) as unknown as OrderData
        if (!mounted) return
        setOrder(data)
        // La compra se concretó → liberar el carrito local.
        clear()
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'No pudimos confirmar el pago.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [venueId, orderShortId, clear])

  if (loading) {
    return (
      <LayoutV2 hideFooter meshSeed={5}>
        <div className='min-h-[60vh] grid place-items-center px-4 text-center'>
          <div>
            <span className='mx-auto block h-9 w-9 rounded-full border-2 border-white/15 border-t-brand-hi animate-spin' />
            <p className='mt-4 text-sm text-white/70'>Confirmando tu pago…</p>
            <p className='mt-1 text-[11.5px] text-white/45'>Esto puede tardar unos segundos.</p>
          </div>
        </div>
      </LayoutV2>
    )
  }

  if (error || !order) {
    return (
      <LayoutV2 hideFooter meshSeed={5}>
        <div className='min-h-[60vh] grid place-items-center px-4'>
          <GlassCard depth='md' radius='lg' className='max-w-md p-8 text-center'>
            <div className='font-display text-base font-semibold text-white'>
              No pudimos confirmar el pago automáticamente
            </div>
            <p className='mt-2 text-sm text-white/55'>
              {error ?? 'Intentá de nuevo en unos segundos.'} Si ya pagaste, vas a recibir
              tus tickets por email.
            </p>
            <Button variant='primary' size='md' className='mt-4' onClick={() => navigate('/dashboard/tickets')}>
              Ver mis tickets
            </Button>
          </GlassCard>
        </div>
      </LayoutV2>
    )
  }

  const attendees = order.attendees ?? []
  const buyerName = order.first_name ? `${order.first_name} ${order.last_name ?? ''}`.trim() : null

  return (
    <LayoutV2 hideFooter meshSeed={5}>
      <main className='mx-auto max-w-3xl px-4 py-10 lg:py-14'>
        <div className='text-center'>
          <div className='mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-mint/15 border border-accent-mint/30'>
            <svg width='26' height='26' viewBox='0 0 24 24' fill='none' aria-hidden>
              <path d='m5 12.5 4 4 10-10' stroke='#7DFFB0' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </div>
          <h1 className='mt-4 font-display text-2xl font-bold text-white tracking-tight'>
            ¡Listo! Tu compra está confirmada
          </h1>
          <p className='mt-2 text-sm text-white/60'>
            {buyerName ? `Gracias, ${buyerName}. ` : ''}
            {order.email ? `Te enviamos los tickets a ${order.email}.` : 'Te enviamos los tickets por email.'}
          </p>
          <p className='mt-1 font-display text-[11px] uppercase tracking-[0.16em] text-white/40'>
            Orden {order.short_id} · ${Number(order.total_gross ?? 0).toFixed(2)} {order.currency}
          </p>
        </div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          {attendees.map((a) => {
            const validateUrl = `${window.location.origin}/ticket/${venueId}/${a.public_id}`
            return (
              <GlassCard key={a.public_id} depth='md' radius='lg' className='p-5 text-center'>
                <div className='font-display text-sm font-semibold text-white truncate'>
                  {a.ticket?.title ?? 'Entrada'}
                  {a.ticket?.seat_label ? ` · ${a.ticket.seat_label}` : ''}
                </div>
                <div className='mt-0.5 text-[11.5px] text-white/55 truncate'>
                  {`${a.first_name ?? ''} ${a.last_name ?? ''}`.trim() || '—'}
                </div>
                <div className='mt-3 inline-block rounded-glass-md bg-white p-2.5'>
                  <QRCodeSVG value={validateUrl} size={148} level='M' />
                </div>
                <div className='mt-2 font-display text-[10px] uppercase tracking-[0.14em] text-white/40'>
                  {a.public_id}
                </div>
              </GlassCard>
            )
          })}
        </div>

        {attendees.length === 0 && (
          <p className='mt-6 text-center text-[12.5px] text-white/55'>
            Tus tickets están en camino a tu email.
          </p>
        )}

        <div className='mt-8 flex flex-col items-center gap-3'>
          <Button variant='primary' size='md' onClick={() => navigate('/dashboard/tickets')}>
            Ver mis tickets
          </Button>
          <Button variant='ghost' size='sm' onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </main>
    </LayoutV2>
  )
}
