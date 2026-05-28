import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import TicketCard from '../../components/v2/ticket/TicketCard'
import NFTPreview from '../../components/v2/ticket/NFTPreview'
import AppleWalletButton from '../../components/v2/ticket/AppleWalletButton'
import ShareSheet from '../../components/v2/ticket/ShareSheet'
import { Button, GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { useCart } from '../../router/cartContext'
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

interface SessionStatusResponse {
  status?: 'open' | 'complete' | string
  customer_email?: string
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

/**
 * TicketReceivedV2 — landing post-checkout (proviene del return de Stripe).
 *
 * Estructura:
 *  - Mini-header propio con "Back home" + link a "My tickets".
 *  - Hero de confirmación (checkmark + "You're in." + cantidad).
 *  - `TicketCard` hero (NFT card visual) del evento comprado.
 *  - `NFTPreview` con wallet address (mock por ahora).
 *  - Apple Wallet + Share image buttons.
 *
 * Datos: del `cart_checkout` del localStorage (set por SaleV2 antes de
 * Stripe) + `session-status` API (legacy). Cuando llegamos vía session
 * complete, limpiamos `local_cart` para que el cart drawer no muestre
 * cosas viejas.
 */
export default function TicketReceivedV2() {
  const navigate = useNavigate()
  const { byLabel } = useUIEvents()
  const { clear: clearCart } = useCart()

  const [snapshot, setSnapshot] = useState<CartCheckoutSnapshot | null>(() =>
    readCartSnapshot()
  )
  const [status, setStatus] = useState<SessionStatusResponse['status'] | null>(
    null
  )
  const [customerEmail, setCustomerEmail] = useState<string>(
    snapshot?.customer?.email ?? ''
  )

  // Valida el session_id contra Stripe (igual flow que legacy Return).
  // Si está 'open', volvemos al checkout. Si 'complete', confirmamos.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    if (!sessionId) return

    fetch(`/api/session-status?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data: SessionStatusResponse) => {
        setStatus(data.status ?? null)
        if (data.customer_email) setCustomerEmail(data.customer_email)
        if (data.status === 'complete') {
          // Limpia el cart legacy + context — el usuario ya pagó.
          try {
            localStorage.removeItem('local_cart')
          } catch {}
          clearCart()
        }
      })
      .catch(() => {
        // En dev sin /api endpoint asumimos complete (best effort) para
        // no bloquear la demo.
        if (import.meta.env.DEV) {
          setStatus('complete')
        }
      })
  }, [clearCart])

  // Si el status del backend es 'open', redirigimos al checkout.
  useEffect(() => {
    if (status === 'open') navigate('/checkout', { replace: true })
  }, [status, navigate])

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

  const cartCount = snapshot?.cart?.length ?? 0
  const firstSeat = snapshot?.cart?.[0]
  const seatInfo = firstSeat
    ? {
        section: firstSeat.subZone,
        row: firstSeat.coords ? String.fromCharCode(65 + firstSeat.coords.row) : undefined,
        seat: firstSeat.coords
          ? String(firstSeat.coords.col + 1)
          : undefined
      }
    : undefined

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

        <div className='mt-8'>
          <TicketCard
            event={displayEvent}
            variant='hero'
            seatInfo={seatInfo}
            ticketNumber={firstSeat?.ticketId?.slice(0, 4) ?? 42}
          />
        </div>

        <div className='mt-5'>
          <NFTPreview
            walletAddress='0x3f2ad14ed2bcdbef91f8e15f88b91d'
            explorerUrl='https://zora.co/'
          />
        </div>

        <div className='mt-4 grid gap-2.5'>
          <AppleWalletButton
            payload={{
              ticketId: firstSeat?.ticketId ?? 'preview',
              eventLabel: displayEvent.id,
              eventName: displayEvent.title,
              venueName: displayEvent.venueName,
              date: displayEvent.isoDate,
              time: displayEvent.time,
              seatInfo
            }}
          />
          <ShareSheet
            input={{
              ticketId: firstSeat?.ticketId ?? displayEvent.id.slice(0, 6),
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
