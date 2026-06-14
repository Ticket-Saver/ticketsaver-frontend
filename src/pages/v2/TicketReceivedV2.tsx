import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import TicketCard from '../../components/v2/ticket/TicketCard'
import NFTPreview from '../../components/v2/ticket/NFTPreview'
import AppleWalletButton from '../../components/v2/ticket/AppleWalletButton'
import GoogleWalletButton from '../../components/v2/ticket/GoogleWalletButton'
import ShareSheet from '../../components/v2/ticket/ShareSheet'
import { Button, GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { useCart } from '../../router/cartContext'
import { hiEventsService } from '../../services/hiEventsService'
import type { HiOrder } from '../../types/hievents'
import { coverHash, coverSeed } from '../../lib/covers/coverHash'
import gradients from '../../styles/effects/gradients.module.css'
import type { UIEvent } from '../../types/uiEvent'

interface CartCheckoutSnapshot {
  cart?: Array<{
    seatLabel?: string
    subZone?: string
    ticketId?: string
    coords?: { row: number; col: number }
  }>
  eventInfo?: {
    id?: string
    name?: string
    venue?: string
    date?: string
    location?: string
  }
  customer?: { email?: string }
}

const MAX_RETRIES = 6
const BASE_DELAY_MS = 700
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Extrae el session_id real de la URL (Stripe a veces deja el placeholder). */
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

const readCartSnapshot = (): CartCheckoutSnapshot | null => {
  try {
    const raw = localStorage.getItem('cart_checkout')
    if (!raw) return null
    return JSON.parse(raw) as CartCheckoutSnapshot
  } catch {
    return null
  }
}

/** "A15" / "K-7" → { row: "A", seat: "15" }. Los asientos de HiEvents traen el
 *  seatLabel como `${row}${seat_number}`; el flujo Seatchart viejo usaba coords. */
const parseSeatLabel = (label?: string): { row?: string; seat?: string } => {
  if (!label) return {}
  const m = label.match(/^([A-Za-z]+)[\s-]?(\d+)$/)
  return m ? { row: m[1].toUpperCase(), seat: m[2] } : {}
}

/**
 * TicketReceivedV2 — landing post-checkout (return de Stripe), con la estética
 * de Claude Design: hero de confirmación + `TicketCard` (NFT) + `NFTPreview` +
 * Apple Wallet + Share.
 *
 * Datos: el evento y los asientos vienen del `cart_checkout` (snapshot que
 * setea CheckoutV2 antes de ir a Stripe) → el ticket se muestra al instante,
 * fiel al diseño, sin spinner. La CONFIRMACIÓN del pago se hace contra
 * HiEvents en background (ruta /checkout/:venueId/:orderShortId/success):
 * POST /confirm_payment con reintentos. HiEvents ya emitió QR + mail.
 */
export default function TicketReceivedV2() {
  const navigate = useNavigate()
  const { venueId, orderShortId } = useParams<{ venueId?: string; orderShortId?: string }>()
  const { byLabel } = useUIEvents()
  const { clear: clearCart } = useCart()

  const [snapshot, setSnapshot] = useState<CartCheckoutSnapshot | null>(() =>
    readCartSnapshot()
  )
  const [customerEmail, setCustomerEmail] = useState<string>(
    snapshot?.customer?.email ?? ''
  )
  const [order, setOrder] = useState<HiOrder | null>(null)
  const confirmRan = useRef(false)

  // Confirma el pago contra HiEvents en background y limpia el carrito. El
  // `ranRef` evita la doble ejecución del StrictMode SIN un flag `mounted`
  // (que censuraría el setState — lección del bug del spinner infinito).
  useEffect(() => {
    if (confirmRan.current || !venueId || !orderShortId) return
    confirmRan.current = true
    ;(async () => {
      try {
        const sessionId = extractSessionId()
        if (sessionId) {
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
        }
        const ord = await hiEventsService.getOrder(venueId, orderShortId)
        setOrder(ord)
        if (ord?.email) setCustomerEmail(ord.email)
      } catch {
        // El pago igual se confirma vía webhook de HiEvents; no bloqueamos la UI.
      } finally {
        try {
          localStorage.removeItem('local_cart')
        } catch {}
        clearCart()
      }
    })()
  }, [venueId, orderShortId, clearCart])

  const event = useMemo<UIEvent | undefined>(() => {
    if (snapshot?.eventInfo?.id) return byLabel(snapshot.eventInfo.id)
    return undefined
  }, [snapshot, byLabel])

  // Reload del snapshot por si llegamos justo cuando el cart se está
  // limpiando (en dev/StrictMode).
  useEffect(() => {
    if (!snapshot) {
      const s = readCartSnapshot()
      if (s) setSnapshot(s)
    }
  }, [snapshot])

  // Un "ticket" visual por asiento. Fuente preferida: los attendees de la orden
  // HiEvents (traen public_id para el QR REAL + el asiento real). Mientras no
  // llegó la orden, fallback al snapshot del checkout (QR decorativo).
  const tickets = useMemo(() => {
    if (order?.attendees && order.attendees.length > 0) {
      return order.attendees.map((a, i) => ({
        key: a.public_id ?? `a-${i}`,
        ticketId: a.public_id ?? `a-${i}`,
        qrValue: a.public_id || undefined,
        ticketNumber: i + 1,
        seatInfo: {
          section: a.ticket?.section ?? undefined,
          row: a.ticket?.row ?? undefined,
          seat: a.ticket?.seat_number ?? undefined
        }
      }))
    }
    return (snapshot?.cart ?? []).map((it, i) => {
      const parsed = parseSeatLabel(it.seatLabel)
      return {
        key: it.ticketId ?? `t-${i}`,
        ticketId: it.ticketId ?? `seat-${i}`,
        qrValue: undefined as string | undefined,
        ticketNumber: i + 1,
        seatInfo: {
          section: it.subZone,
          row:
            parsed.row ??
            (it.coords ? String.fromCharCode(65 + it.coords.row) : undefined),
          seat:
            parsed.seat ??
            (it.coords ? String(it.coords.col + 1) : undefined)
        }
      }
    })
  }, [order, snapshot])

  const cartCount = tickets.length

  // Fallback: si no hay event en useUIEvents pero sí hay eventInfo, mock.
  const displayEvent: UIEvent | null = useMemo(() => {
    if (event) return event
    if (!snapshot?.eventInfo) return null
    const ei = snapshot.eventInfo
    return {
      id: ei.id ?? 'unknown',
      eventId: ei.id ?? 'unknown',
      title: ei.name ?? 'Event',
      subtitle: ei.venue ? `${ei.venue}${ei.location ? ` · ${ei.location}` : ''}` : '',
      category: 'Music',
      isoDate: ei.date ?? '',
      day: 'SAT',
      date: 1,
      month: 'JAN',
      year: 2026,
      time: '',
      startsAt: new Date(),
      venueLabel: '',
      venueName: ei.venue ?? '',
      city: ei.location ?? '',
      country: '',
      cover: coverHash(ei.id ?? ''),
      priceFrom: null,
      availability: 'available',
      tags: [],
      hero: false,
      isExternal: false,
      hidden: false,
      expired: false,
      requiresQueue: false,
      detailHref: '',
      raw: {
        eventId: ei.id ?? '',
        event_date: ei.date ?? '',
        event_hour: '',
        event_name: ei.name ?? '',
        venue_label: '',
        event_label: ei.id ?? '',
        event_deleted_at: null,
        sale_starts_at: '',
        tricket_url: ''
      }
    } satisfies UIEvent
  }, [event, snapshot])

  if (!displayEvent) {
    return (
      <LayoutV2 hideHeader hideFooter meshSeed={4}>
        <PageHeader onBack={() => navigate('/')} />
        <div className='min-h-[50vh] grid place-items-center px-4'>
          <GlassCard depth='md' radius='lg' className='p-8 text-center max-w-md'>
            <div className='font-display text-base font-semibold text-white'>
              Nothing to confirm yet
            </div>
            <p className='mt-2 text-sm text-white/55'>
              We could not find a recent purchase. Maybe the page expired or
              you opened it by mistake.
            </p>
            <Button
              variant='primary'
              size='md'
              onClick={() => navigate('/events')}
              className='mt-4'
            >
              Browse events
            </Button>
          </GlassCard>
        </div>
      </LayoutV2>
    )
  }

  return (
    <LayoutV2 hideHeader hideFooter meshSeed={(coverSeed(displayEvent.id) % 8) + 4}>
      <PageHeader onBack={() => navigate('/')} />

      <main className='mx-auto max-w-2xl px-5 lg:px-8 pb-12'>
        <header className='text-center pt-6 sm:pt-8'>
          <div
            className='h-14 w-14 mx-auto rounded-pill grid place-items-center'
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #E0C0FF, #7B3FE4)',
              boxShadow: '0 10px 40px rgba(123,63,228,0.50)'
            }}
          >
            <svg width='22' height='22' viewBox='0 0 22 22' fill='none' aria-hidden>
              <path
                d='M5 11.5 9 15.5 17 7'
                stroke='#fff'
                strokeWidth='2.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <h1
            className={`mt-4 font-display text-3xl lg:text-4xl font-bold tracking-tight ${gradients.textBrandSoft}`}
          >
            You&apos;re in.
          </h1>
          <p className='mt-2 text-sm text-white/65'>
            {cartCount > 0
              ? `${cartCount} ${cartCount === 1 ? 'ticket' : 'tickets'} minted to your wallet`
              : 'Your order is confirmed'}
          </p>
          {customerEmail && (
            <p className='mt-1 text-[11px] text-white/45'>
              A confirmation was sent to{' '}
              <span className='text-white/70'>{customerEmail}</span>
            </p>
          )}
        </header>

        {/* Un ticket por asiento; cada uno con su pase de wallet (1 por 1:
            cada entrada tiene su QR propio y se escanea individualmente). */}
        <div className='mt-8 space-y-7'>
          {tickets.map((t) => (
            <div key={t.key}>
              <TicketCard
                event={displayEvent}
                variant='hero'
                seatInfo={t.seatInfo}
                ticketNumber={t.ticketNumber}
                qrValue={t.qrValue}
              />
              <AppleWalletButton
                className='mt-3'
                payload={{
                  ticketId: t.ticketId,
                  eventLabel: displayEvent.id,
                  eventName: displayEvent.title,
                  venueName: displayEvent.venueName,
                  date: displayEvent.isoDate,
                  time: displayEvent.time,
                  seatInfo: t.seatInfo
                }}
              />
              <GoogleWalletButton
                className='mt-2'
                payload={{
                  ticketId: t.ticketId,
                  eventLabel: displayEvent.id,
                  eventName: displayEvent.title,
                  venueName: displayEvent.venueName,
                  date: displayEvent.isoDate,
                  time: displayEvent.time,
                  seatInfo: t.seatInfo
                }}
              />
            </div>
          ))}
        </div>

        {/* Wallet del comprador + compartir, a nivel de la compra. */}
        <div className='mt-8 space-y-2.5'>
          <NFTPreview walletAddress='0x3f2ad14ed2bcdbef91f8e15f88b91d' />
          <ShareSheet
            input={{
              ticketId: tickets[0]?.ticketId ?? displayEvent.id.slice(0, 6),
              eventTitle: displayEvent.title,
              eventSubtitle: displayEvent.subtitle,
              venueName: displayEvent.venueName,
              city: displayEvent.city,
              date: displayEvent.date,
              month: displayEvent.month,
              day: displayEvent.day,
              time: displayEvent.time,
              coverKey: displayEvent.cover
            }}
          />
        </div>

        <div className='mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/55'>
          <Link
            to='/dashboard/tickets/upcomingevent'
            className='text-brand-hi font-display font-semibold hover:text-white transition'
          >
            View all my tickets →
          </Link>
          <Link to='/events' className='hover:text-white transition'>
            Browse more events
          </Link>
        </div>
      </main>
    </LayoutV2>
  )
}

const PageHeader = ({ onBack }: { onBack: () => void }) => (
  <header className='sticky top-0 z-30 backdrop-blur-glass-strong border-b border-white/[0.08] bg-brand-ink/55'>
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-14 lg:h-16 flex items-center justify-between gap-3'>
      <button
        type='button'
        aria-label='Back to home'
        onClick={onBack}
        className='inline-flex items-center gap-2 text-white/75 hover:text-white text-[12px] font-display'
      >
        <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
          <path
            d='M9 2 4 7l5 5'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        Home
      </button>
      <div className='font-display text-[11px] uppercase tracking-[0.18em] text-brand-hi font-semibold'>
        Order confirmed
      </div>
      <Link
        to='/dashboard/tickets/upcomingevent'
        className='text-white/75 hover:text-white text-[12px] font-display'
      >
        My tickets
      </Link>
    </div>
  </header>
)
