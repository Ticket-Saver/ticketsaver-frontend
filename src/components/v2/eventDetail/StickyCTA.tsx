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
  /**
   * Preventa abierta ahora: habilita el botón aunque la venta general no haya
   * empezado. Al tocarlo se pide el código (vía onChooseSeats) en vez de navegar.
   */
  presaleActive?: boolean
  /**
   * Si está definido, el botón "Choose seats" llama esto en vez de navegar directo
   * (lo usa el gate de preventa para pedir el código antes de entrar a /sale).
   */
  onChooseSeats?: () => void
}

/**
 * Construye la ruta legacy /sale/:name/:venue/:city/:date/:label/:delete?
 * que el SalePage espera.
 */
export const buildSaleHref = (event: UIEvent): string => {
  const safe = (s: string | undefined | null) => encodeURIComponent(s ?? '')
  const cityForRoute = event.city || event.venueLabel
  const deleteParam = event.raw.event_deleted_at ?? 'null'
  // ?eid lleva el eventId numérico (único por fecha) para que /sale resuelva la
  // fecha correcta en multifecha (el slug del path se repite entre fechas).
  const eid = encodeURIComponent(event.eventId)
  return `/sale/${safe(event.title)}/${safe(event.venueLabel)}/${safe(cityForRoute)}/${safe(event.raw.event_date)}/${safe(event.id)}/${safe(deleteParam)}?eid=${eid}`
}

/**
 * Estado del CTA de compra (label + disabled + href) derivado del evento.
 * Única fuente de verdad: la comparten StickyCTA y cualquier otro botón de
 * compra (ej. "Buy now" del resumen de fecha) para no divergir en la lógica.
 */
export const getCtaState = (
  event: UIEvent,
  priceFrom: number | null,
  isSaleActive: boolean,
  saleStartsLabel: string | undefined,
  presaleActive: boolean | undefined,
  overrideHref?: string
) => {
  const isSoldOut = event.availability === 'sold-out'
  // La preventa activa también habilita la compra (con código).
  const effectiveActive = isSaleActive || !!presaleActive
  const disabled = !effectiveActive || event.expired || isSoldOut

  const label = (() => {
    if (event.expired) return 'Event ended'
    // La pre-venta tiene prioridad: 0 disponibles antes de abrir ≠ agotado.
    if (!effectiveActive) return saleStartsLabel ?? 'Coming soon'
    if (isSoldOut) return 'Sold out'
    if (event.requiresQueue) return 'Join queue'
    if (presaleActive && !isSaleActive) return 'Choose seats · Presale'
    return 'Choose seats'
  })()

  const priceLabel = priceFrom !== null ? `From $${priceFrom.toFixed(2)}` : ''

  // eventId numérico (único por fecha): el slug se repite en multifecha.
  const queueHref = `/queue/${encodeURIComponent(event.eventId)}`

  const targetHref =
    overrideHref ??
    (event.isExternal && event.ticketUrl
      ? event.ticketUrl
      : event.requiresQueue
        ? queueHref
        : buildSaleHref(event))

  return { disabled, label, priceLabel, targetHref, isSoldOut }
}

export default function StickyCTA({
  event,
  priceFrom,
  isSaleActive,
  saleStartsLabel,
  overrideHref,
  presaleActive,
  onChooseSeats
}: StickyCTAProps) {
  const {
    disabled,
    label: ctaLabel,
    priceLabel,
    targetHref
  } = getCtaState(event, priceFrom, isSaleActive, saleStartsLabel, presaleActive, overrideHref)

  const content = (
    <>
      <span className='flex items-center gap-2 min-w-0'>
        <span className='font-display text-sm font-semibold truncate'>{ctaLabel}</span>
        {isSaleActive && !disabled && (
          <span className='text-[10px] uppercase tracking-[0.14em] font-display opacity-50 hidden sm:inline'>
            {event.day} {event.date}
          </span>
        )}
      </span>
      <span className='flex items-center gap-2 shrink-0'>
        {!disabled && priceLabel && (
          <span className='font-display text-sm font-semibold tabular-nums'>{priceLabel}</span>
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
    <div className='fixed inset-x-0 z-40 px-3 lg:px-10 pointer-events-none bottom-[76px] md:bottom-0 md:pb-3 lg:pb-6'>
      <div
        aria-hidden
        className='absolute inset-x-0 bottom-0 h-32 pointer-events-none'
        style={{
          background: 'linear-gradient(to top, rgba(10,10,12,0.95) 50%, rgba(10,10,12,0))'
        }}
      />
      <div className='relative max-w-3xl mx-auto pointer-events-auto'>
        {disabled || !targetHref ? (
          <button type='button' disabled className={btnClass}>
            {content}
          </button>
        ) : event.isExternal && event.ticketUrl && !overrideHref ? (
          <a href={targetHref} target='_blank' rel='noopener noreferrer' className={btnClass}>
            {content}
          </a>
        ) : onChooseSeats && !event.requiresQueue && !overrideHref ? (
          // Gate: el handler decide si pedir el código (preventa) o navegar directo.
          <button type='button' onClick={onChooseSeats} className={btnClass}>
            {content}
          </button>
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
