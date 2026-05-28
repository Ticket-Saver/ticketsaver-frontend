import { Link } from 'react-router-dom'
import { cn } from '../../../types/ui'
import type { UIEvent } from '../../../types/uiEvent'

interface StickyCTAProps {
  event: UIEvent
  /** Precio mínimo (USD) cargado lazy del zone_price. */
  priceFrom: number | null
  /** Whether sale_starts_at <= now. */
  isSaleActive: boolean
  /** Para "Tickets available on X" cuando isSaleActive es false. */
  saleStartsLabel?: string
  /**
   * Si está definido, sobrescribe el href default (e.g., para Queue
   * redirige a /queue/:label en B7).
   */
  overrideHref?: string
}

/**
 * Construye la ruta legacy /sale/:name/:venue/:city/:date/:label/:delete?
 * que el SalePage espera.
 */
const buildSaleHref = (event: UIEvent): string => {
  const safe = (s: string | undefined | null) => encodeURIComponent(s ?? '')
  const cityForRoute = event.city || event.venueLabel
  const deleteParam = event.raw.event_deleted_at ?? 'null'
  return `/sale/${safe(event.title)}/${safe(event.venueLabel)}/${safe(cityForRoute)}/${safe(event.raw.event_date)}/${safe(event.id)}/${safe(deleteParam)}`
}

export default function StickyCTA({
  event,
  priceFrom,
  isSaleActive,
  saleStartsLabel,
  overrideHref
}: StickyCTAProps) {
  const isSoldOut = event.availability === 'sold-out'
  const disabled = !isSaleActive || event.expired || isSoldOut

  const ctaLabel = (() => {
    if (isSoldOut) return 'Sold out'
    if (event.expired) return 'Event ended'
    if (!isSaleActive) return saleStartsLabel ?? 'Coming soon'
    if (event.requiresQueue) return 'Join queue'
    return 'Choose seats'
  })()

  const priceLabel = priceFrom !== null ? `From $${Math.round(priceFrom)}` : ''

  const queueHref = `/queue/${encodeURIComponent(event.id)}`

  const targetHref =
    overrideHref ??
    (event.isExternal && event.ticketUrl
      ? event.ticketUrl
      : event.requiresQueue
        ? queueHref
        : buildSaleHref(event))

  const content = (
    <>
      <span className='flex items-center gap-2 min-w-0'>
        <span className='font-display text-sm font-semibold truncate'>
          {ctaLabel}
        </span>
        {isSaleActive && !disabled && (
          <span className='text-[10px] uppercase tracking-[0.14em] font-display opacity-50 hidden sm:inline'>
            {event.day} {event.date}
          </span>
        )}
      </span>
      <span className='flex items-center gap-2 shrink-0'>
        {!disabled && priceLabel && (
          <span className='font-display text-sm font-semibold tabular-nums'>
            {priceLabel}
          </span>
        )}
        {!disabled && <ChevRight />}
      </span>
    </>
  )

  const btnClass = cn(
    'w-full px-4 py-3.5 rounded-glass-md font-display font-semibold transition',
    'flex items-center justify-between gap-3',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60',
    disabled
      ? 'bg-white/[0.08] text-white/45 cursor-not-allowed border border-white/10'
      : 'bg-gradient-to-b from-white to-white/85 text-brand-ink hover:brightness-95 shadow-[0_10px_30px_rgba(212,168,240,0.20)]'
  )

  return (
    <div
      className='fixed inset-x-0 z-40 px-3 lg:px-10 pointer-events-none bottom-[76px] md:bottom-0 md:pb-3 lg:pb-6'
    >
      <div
        aria-hidden
        className='absolute inset-x-0 bottom-0 h-32 pointer-events-none'
        style={{
          background:
            'linear-gradient(to top, rgba(10,4,24,0.95) 50%, rgba(10,4,24,0))'
        }}
      />
      <div className='relative max-w-3xl mx-auto pointer-events-auto'>
        {disabled || !targetHref ? (
          <button type='button' disabled className={btnClass}>
            {content}
          </button>
        ) : event.isExternal && event.ticketUrl && !overrideHref ? (
          <a
            href={targetHref}
            target='_blank'
            rel='noopener noreferrer'
            className={btnClass}
          >
            {content}
          </a>
        ) : (
          <Link to={targetHref} className={btnClass}>
            {content}
          </Link>
        )}
      </div>
    </div>
  )
}

const ChevRight = () => (
  <svg width='14' height='14' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='m4.5 2.5 3.5 3.5-3.5 3.5'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
