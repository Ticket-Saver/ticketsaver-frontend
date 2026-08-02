import { forwardRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import EventCover from './EventCover'
import { cn } from '../../types/ui'
import { getCoverPalette } from '../../lib/covers/palettes'
import type { UIEvent } from '../../types/uiEvent'
import glass from '../../styles/effects/glass.module.css'

export type EventCardVariant = 'poster' | 'cinema' | 'ticket' | 'minimal'

interface EventCardV2Props {
  event: UIEvent
  variant?: EventCardVariant
  /** Ancho fijo cuando se usa dentro de un carousel horizontal. */
  width?: number | string
  className?: string
  /** Override del comportamiento default de click (navegar a detail). */
  onClick?: (event: UIEvent) => void
}

const formatPrice = (priceFrom: number | null): string =>
  priceFrom !== null ? `$${Math.round(priceFrom)}` : 'View'

interface CardShellProps {
  event: UIEvent
  className?: string
  children: ReactNode
  onClick?: (event: UIEvent) => void
}

/**
 * Wrap interno: si el evento tiene tricket_url se renderiza como <a>
 * external; si no, como Link a la detalle interna. Maneja focus ring y
 * stop-propagation cuando se pasa `onClick` override.
 */
const CardShell = forwardRef<HTMLElement, CardShellProps>(function CardShell(
  { event, className, children, onClick },
  ref
) {
  const baseClass = cn(
    'group relative block w-full text-left text-white transition',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60 rounded-glass-md',
    'hover:-translate-y-0.5',
    event.expired && 'opacity-50 pointer-events-none',
    className
  )

  const handleClick = onClick
    ? (e: React.MouseEvent) => {
        e.preventDefault()
        onClick(event)
      }
    : undefined

  if (event.isExternal && event.ticketUrl) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={event.ticketUrl}
        target='_blank'
        rel='noopener noreferrer'
        className={baseClass}
        onClick={handleClick}
        aria-label={`${event.title} — open external ticket page`}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      to={event.detailHref}
      className={baseClass}
      onClick={handleClick}
      aria-label={`${event.title} — view details`}
    >
      {children}
    </Link>
  )
})

export default function EventCardV2({
  event,
  variant = 'poster',
  width,
  className,
  onClick
}: EventCardV2Props) {
  const widthStyle =
    typeof width === 'number'
      ? { width: `${width}px` }
      : width
        ? { width }
        : undefined

  if (variant === 'cinema')
    return (
      <CardShell event={event} className={className} onClick={onClick}>
        <div
          className={cn(
            'flex gap-3 p-2.5 rounded-glass-md transition group-hover:bg-white/[0.10]',
            glass.glassMd
          )}
          style={widthStyle}
        >
          <div className='w-16 shrink-0 rounded-glass-sm border border-white/10 bg-white/[0.04] flex flex-col items-center justify-center py-2.5 font-display'>
            <div className='text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55'>
              {event.day}
            </div>
            <div className='text-[28px] font-bold text-white leading-none my-1'>
              {String(event.date).padStart(2, '0')}
            </div>
            <div className='text-[9.5px] font-semibold uppercase tracking-[0.18em] text-brand-hi'>
              {event.month}
            </div>
          </div>

          <div className='w-16 shrink-0 rounded-glass-sm overflow-hidden'>
            <EventCover event={event} height={84} hideTitle hideCategory hideDate />
          </div>

          <div className='min-w-0 flex-1 flex flex-col justify-between py-0.5'>
            <div>
              <div className='font-display text-[13px] font-semibold tracking-tight text-white truncate'>
                {event.title}
              </div>
              <div className='text-[10.5px] text-white/55 truncate mt-0.5'>
                {event.subtitle}
                {event.time && (
                  <>
                    {' · '}
                    {event.time}
                  </>
                )}
              </div>
            </div>
            <div className='flex items-center justify-end gap-2 mt-1.5'>
              <PriceLabel priceFrom={event.priceFrom} compact />
            </div>
          </div>
        </div>
      </CardShell>
    )

  if (variant === 'ticket')
    return (
      <CardShell event={event} className={className} onClick={onClick}>
        <div
          className={cn(
            'rounded-glass-md overflow-hidden transition group-hover:shadow-glass-deep',
            glass.glassMd
          )}
          style={widthStyle}
        >
          <EventCover event={event} height={180} hideTitle />
          <div
            aria-hidden
            className='h-px'
            style={{
              background:
                'linear-gradient(to right, transparent 4px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 10px, transparent 10px) 0 0/14px 1px repeat-x'
            }}
          />
          <div className='p-3.5 flex items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='text-[9px] uppercase tracking-[0.2em] text-white/50 font-display'>
                Admit one
              </div>
              <div className='font-display text-[13px] font-semibold text-white mt-1 truncate'>
                {event.title}
              </div>
              <div className='text-[11px] text-white/55 mt-0.5 truncate'>
                {event.venueName} · {event.day} {event.date} {event.month}
              </div>
            </div>
            <div className='shrink-0 text-right'>
              <div className='text-[9px] uppercase tracking-[0.16em] text-white/45 font-display'>
                Price
              </div>
              <div className='font-display text-sm font-bold text-white mt-0.5 tabular-nums'>
                {formatPrice(event.priceFrom)}
                {event.priceFrom !== null && (
                  <span className='text-[10px] text-white/55 ml-0.5'>+</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardShell>
    )

  if (variant === 'minimal') {
    const c = getCoverPalette(event.cover)
    return (
      <CardShell event={event} className={className} onClick={onClick}>
        <div
          className={cn(
            'flex items-center gap-3.5 p-3.5 rounded-glass-md transition group-hover:bg-white/[0.10]',
            glass.glassSm
          )}
          style={widthStyle}
        >
          <div
            className='h-11 w-11 shrink-0 rounded-glass-sm'
            style={{
              background: `linear-gradient(135deg, ${c.a}, ${c.b})`,
              boxShadow: `0 4px 16px ${c.a}40`
            }}
          />
          <div className='flex-1 min-w-0'>
            <div className='flex items-baseline gap-2 text-[9px] font-display font-semibold uppercase tracking-[0.16em] text-white/55'>
              <span>
                {event.day} {String(event.date).padStart(2, '0')} {event.month}
              </span>
              {event.time && (
                <>
                  <span className='h-1 w-1 rounded-full bg-white/30' />
                  <span className='text-white/45 tracking-[0.14em]'>
                    {event.time}
                  </span>
                </>
              )}
            </div>
            <div className='mt-1 font-display text-sm font-semibold text-white truncate tracking-tight'>
              {event.title}
            </div>
            <div className='text-[11px] text-white/55 truncate mt-0.5'>
              {event.subtitle}
            </div>
          </div>
          <div className='shrink-0 text-right font-display text-sm font-semibold text-white tabular-nums'>
            {formatPrice(event.priceFrom)}
          </div>
        </div>
      </CardShell>
    )
  }

  // Default: poster
  return (
    <CardShell event={event} className={className} onClick={onClick}>
      <div
        className={cn(
          'rounded-glass-md overflow-hidden transition group-hover:shadow-glass-deep',
          glass.glassMd
        )}
        style={widthStyle}
      >
        <EventCover event={event} height={180} />
        <div className='p-3.5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='font-display text-sm font-semibold text-white truncate tracking-tight'>
                {event.subtitle}
              </div>
              <div className='text-[11.5px] text-white/55 truncate mt-1'>
                {event.day} {String(event.date).padStart(2, '0')} {event.month}
                {event.time && ` · ${event.time}`}
              </div>
            </div>
            <div className='shrink-0 text-right'>
              <div className='text-[9px] uppercase tracking-[0.1em] text-white/50 font-display'>
                From
              </div>
              <div className='font-display text-sm font-semibold text-white tabular-nums mt-0.5'>
                {formatPrice(event.priceFrom)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

const PriceLabel = ({
  priceFrom,
  compact
}: {
  priceFrom: number | null
  compact?: boolean
}) =>
  compact ? (
    <span className='font-display text-[12.5px] font-semibold text-white tabular-nums'>
      {formatPrice(priceFrom)}
      {priceFrom !== null && '+'}
    </span>
  ) : (
    <span className='font-display text-sm font-semibold text-white tabular-nums'>
      {formatPrice(priceFrom)}
    </span>
  )
