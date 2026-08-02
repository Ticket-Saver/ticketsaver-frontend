import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import EventCover from '../../components/v2/EventCover'
import QueueStatePill, { QUEUE_STATE_COLOR } from '../../components/v2/queue/QueueState'
import QueueStream from '../../components/v2/queue/QueueStream'
import QueueProgress from '../../components/v2/queue/QueueProgress'
import TipRotator from '../../components/v2/queue/TipRotator'
import { Button, GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { useQueuePosition } from '../../hooks/useQueuePosition'
import { coverSeed } from '../../lib/covers/coverHash'
import { cn } from '../../types/ui'
import gradients from '../../styles/effects/gradients.module.css'
import styles from '../../styles/effects/queue.module.css'
import type { UIEvent } from '../../types/uiEvent'

const RELEASE_REDIRECT_DELAY_MS = 1500
// Si a los 15s de "released" seguimos sin admissionToken, redirigimos igual
// (mejor eso que dejar al usuario colgado en "You're in").
const NO_TOKEN_GRACE_MS = 15_000

const buildSaleHref = (event: UIEvent): string => {
  const safe = (s: string | undefined | null) => encodeURIComponent(s ?? '')
  const cityForRoute = event.city || event.venueLabel
  const deleteParam = event.raw.event_deleted_at ?? 'null'
  return `/sale/${safe(event.title)}/${safe(event.venueLabel)}/${safe(cityForRoute)}/${safe(event.raw.event_date)}/${safe(event.id)}/${safe(deleteParam)}`
}

/**
 * QueueV2 — sala de espera virtual.
 *
 * Hooks: `useUIEvents` para los datos del evento, `useQueuePosition`
 * para el snapshot vivo. Cuando el state vira a `released`, esperamos
 * brevemente (mostrando "You're in") y redirigimos al SaleV2 del label.
 */
export default function QueueV2() {
  const { label } = useParams<{ label: string }>()
  const navigate = useNavigate()
  const { loading: eventsLoading, byLabel } = useUIEvents()
  const event = byLabel(label)
  const eventId = event ? Number(event.eventId) : undefined

  const {
    snapshot,
    loading: queueLoading,
    error,
    admissionToken,
    rejoin
  } = useQueuePosition(eventId)

  // Auto-redirect cuando se libera: persiste el token de turno para que
  // hiEventsService lo adjunte (X-Queue-Token) en createOrder/updateOrder.
  // No redirigimos sin token: el checkout responde 403 si llega sin él.
  // Si tarda demasiado, hay un timeout de gracia que redirige igual.
  useEffect(() => {
    if (!snapshot || snapshot.state !== 'released' || !event) return
    if (admissionToken) sessionStorage.setItem(`queue_token:${event.eventId}`, admissionToken)

    let redirectTimer: number | null = null
    if (admissionToken) {
      redirectTimer = window.setTimeout(() => {
        navigate(buildSaleHref(event), { replace: true })
      }, RELEASE_REDIRECT_DELAY_MS)
    }

    const graceTimer = window.setTimeout(() => {
      if (!admissionToken) {
        console.warn(
          'QueueV2: released sin admissionToken tras el timeout de gracia, redirigiendo igual'
        )
        navigate(buildSaleHref(event), { replace: true })
      }
    }, NO_TOKEN_GRACE_MS)

    return () => {
      if (redirectTimer !== null) window.clearTimeout(redirectTimer)
      window.clearTimeout(graceTimer)
    }
  }, [snapshot, event, admissionToken, navigate])

  if (!label) return <Navigate to='/events' replace />

  if (eventsLoading) {
    return (
      <LayoutV2 hideHeader hideFooter meshSeed={6}>
        <div className='min-h-[60vh] grid place-items-center'>
          <div className='h-12 w-12 rounded-pill border-[3px] border-white/15 border-t-white/70 animate-spin' />
        </div>
      </LayoutV2>
    )
  }

  if (!event) {
    return (
      <LayoutV2 hideHeader hideFooter meshSeed={6}>
        <div className='min-h-[60vh] grid place-items-center px-4'>
          <GlassCard depth='md' radius='lg' className='p-8 text-center max-w-md'>
            <div className='font-display text-base font-semibold text-white'>Event not found</div>
            <p className='mt-2 text-sm text-white/55'>That event is no longer accepting queues.</p>
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

  const stateKind = snapshot?.state ?? 'far'
  const color = QUEUE_STATE_COLOR[stateKind]

  return (
    <LayoutV2 hideHeader hideFooter meshSeed={(coverSeed(event.id) % 8) + 5} meshPalette='charcoal'>
      {/* Cover blureado del evento como fondo ambiental */}
      <div
        aria-hidden
        className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'
        style={{ filter: 'blur(60px) saturate(140%) brightness(0.5)' }}
      >
        <EventCover event={event} height={900} big hideCategory hideDate hideTitle />
      </div>
      <div
        aria-hidden
        className='fixed inset-0 -z-10 pointer-events-none'
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,12,0.30) 0%, rgba(10,10,12,0.88) 100%)'
        }}
      />

      <TopBar event={event} state={stateKind} />

      <main className='mx-auto max-w-7xl px-5 lg:px-10 pb-16'>
        {/* Mobile + Desktop layout */}
        <div className='grid gap-8 lg:gap-12 lg:grid-cols-[420px_1fr] lg:items-start mt-6 lg:mt-10'>
          <EventPanel event={event} />

          <div>
            {error ? (
              <GlassCard depth='md' radius='lg' className='p-6 text-center'>
                <div className='font-display text-base font-semibold text-white'>
                  Queue is offline
                </div>
                <p className='mt-2 text-sm text-white/55'>{error}</p>
                <Button variant='primary' size='md' onClick={rejoin} className='mt-4'>
                  Rejoin queue
                </Button>
              </GlassCard>
            ) : stateKind === 'released' ? (
              <ReleasedHero />
            ) : (
              <PositionPanel
                snapshot={snapshot}
                loading={queueLoading}
                color={color}
                stateKind={stateKind}
              />
            )}
          </div>
        </div>
      </main>
    </LayoutV2>
  )
}

/* ─────────────── Sub-componentes ─────────────── */

const TopBar = ({
  event,
  state
}: {
  event: UIEvent
  state: 'far' | 'close' | 'next' | 'released'
}) => (
  <header className='sticky top-0 z-30 backdrop-blur-glass-strong border-b border-white/[0.08] bg-[#0A0A0C]/55'>
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-14 lg:h-16 flex items-center gap-3'>
      <div className='flex items-center gap-2.5 shrink-0'>
        <div className='h-7 w-7 rounded-glass-sm bg-gradient-to-br from-brand-hi to-brand-mid' />
        <span className='font-display text-sm font-semibold text-white tracking-tight'>
          ticketsaver
        </span>
      </div>
      <span className='hidden sm:inline text-white/40 text-[11px] font-display uppercase tracking-[0.16em]'>
        Waiting room · {event.title}
      </span>
      <div className='flex-1' />
      <QueueStatePill state={state} size='sm' />
    </div>
  </header>
)

const EventPanel = ({ event }: { event: UIEvent }) => (
  <div className='rounded-glass-lg overflow-hidden border border-white/[0.10] backdrop-blur-glass-strong bg-white/[0.05]'>
    <div className='relative h-48 lg:h-64'>
      <EventCover event={event} height={300} big hideCategory hideDate hideTitle />
    </div>
    <div className='p-5 lg:p-6'>
      <div className='text-[10.5px] uppercase tracking-[0.2em] font-display font-bold text-brand-hi'>
        You&apos;re queuing for
      </div>
      <h1 className='mt-2 font-display text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-tight'>
        {event.title}
      </h1>
      <div className='mt-2 text-[13px] text-white/65'>{event.venueName}</div>
      <div className='text-[13px] text-white/65'>
        {event.day}, {event.month} {event.date}
        {event.time && ` · ${event.time}`}
      </div>

      <div className='mt-5 rounded-glass-md border border-white/[0.10] p-4 bg-white/[0.04]'>
        <TipRotator />
      </div>
    </div>
  </div>
)

interface PositionPanelProps {
  snapshot: { position: number; total: number; eta: string; pct: number } | null
  loading: boolean
  color: string
  stateKind: 'far' | 'close' | 'next'
}

const PositionPanel = ({ snapshot, loading, color, stateKind }: PositionPanelProps) => {
  if (loading || !snapshot) {
    return (
      <div className='min-h-[420px] grid place-items-center'>
        <div className={cn('h-16 w-16', styles.spinner)} />
      </div>
    )
  }
  return (
    <div>
      <div className='text-[11px] uppercase tracking-[0.2em] text-white/55 font-display font-bold'>
        Your place in line
      </div>
      <div
        className={cn(
          'font-display font-bold leading-[0.9] tracking-[-0.045em] text-white mt-3',
          stateKind === 'next'
            ? 'text-[140px] sm:text-[200px] lg:text-[260px]'
            : 'text-[100px] sm:text-[140px] lg:text-[200px]'
        )}
        style={{ textShadow: `0 0 60px ${color}40` }}
      >
        <span className='text-[0.35em] text-white/40 align-top mr-2'>#</span>
        {snapshot.position.toLocaleString()}
      </div>

      <div className='mt-5 flex flex-wrap items-center gap-3'>
        <InfoPill>
          <ClockIcon />
          <span>
            Est. wait{' '}
            <span style={{ color }} className='font-display font-semibold'>
              {snapshot.eta}
            </span>
          </span>
        </InfoPill>
        <InfoPill>
          <span aria-hidden className='h-2 w-2 rounded-pill bg-white/55' />
          <span>{snapshot.total.toLocaleString()} in queue</span>
        </InfoPill>
      </div>

      <div className='mt-8 lg:mt-12'>
        <QueueStream pct={snapshot.pct} color={color} />
        <div className='mt-5 flex items-center justify-between text-[10.5px] uppercase tracking-[0.16em] font-display font-bold text-white/45'>
          <span>← Door</span>
          <span>Back of queue →</span>
        </div>
      </div>

      <div className='mt-6'>
        <QueueProgress pct={snapshot.pct} color={color} />
      </div>

      {stateKind === 'next' && <GetReadyCard />}
    </div>
  )
}

const GetReadyCard = () => (
  <div
    className='mt-6 rounded-glass-md border border-accent-mint/35 p-5 flex items-center gap-4'
    style={{
      background: 'linear-gradient(135deg, rgba(125,255,176,0.18), rgba(212,168,240,0.10))'
    }}
  >
    <span aria-hidden className='text-2xl'>
      ✨
    </span>
    <div className='flex-1 min-w-0'>
      <div className='font-display text-base lg:text-lg font-semibold text-white'>
        Get ready — door opens in seconds
      </div>
      <p className='text-[12.5px] text-white/70 mt-1'>
        You&apos;ll have 20 minutes to pick seats once you&apos;re inside.
      </p>
    </div>
  </div>
)

const ReleasedHero = () => (
  <div className='flex flex-col items-center justify-center text-center py-10 lg:py-16'>
    <div
      className={cn(
        'font-display font-bold leading-[0.95] tracking-[-0.04em]',
        'text-[100px] sm:text-[140px] lg:text-[200px]',
        gradients.textBrandSoft
      )}
    >
      You&apos;re in.
    </div>
    <div className='mt-5 text-[15px] lg:text-lg text-white/72'>Redirecting to seat picker…</div>
    <div className={cn('mt-8 h-16 w-16', styles.spinner)} />
  </div>
)

const InfoPill = ({ children }: { children: React.ReactNode }) => (
  <div
    className='inline-flex items-center gap-2.5 px-4 py-2.5 rounded-pill border border-white/[0.10] backdrop-blur-glass text-[13px] text-white/85'
    style={{ background: 'rgba(255,255,255,0.06)' }}
  >
    {children}
  </div>
)

const ClockIcon = () => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill='none' aria-hidden>
    <circle cx='8' cy='8' r='6' stroke='currentColor' strokeWidth='1.4' />
    <path d='M8 5v3l2 1.5' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
  </svg>
)
