import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import EventCardV2, { type EventCardVariant } from './EventCardV2'
import { cn } from '../../types/ui'
import type { UIEvent } from '../../types/uiEvent'

interface EventCarouselProps {
  title: string
  subtitle?: string
  events: UIEvent[]
  variant?: EventCardVariant
  /** Ancho fijo de cada card en px. */
  cardWidth?: number
  /** Espacio entre cards en px. */
  gap?: number
  /** Href para el link "See all". Si no se provee, no se muestra. */
  seeAllHref?: string
  className?: string
  /** Mensaje cuando `events` está vacío. */
  emptyState?: ReactNode
}

export default function EventCarousel({
  title,
  subtitle,
  events,
  variant = 'poster',
  cardWidth = 240,
  gap = 12,
  seeAllHref,
  className,
  emptyState
}: EventCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const delta = (cardWidth + gap) * 2 * direction
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (events.length === 0 && !emptyState) return null

  return (
    <section className={cn('relative', className)}>
      <header className='flex items-end justify-between gap-4 px-5 lg:px-10 pb-3'>
        <div className='min-w-0'>
          <h2 className='font-display text-lg lg:text-2xl font-semibold tracking-tight text-white'>
            {title}
          </h2>
          {subtitle && (
            <p className='text-[11.5px] lg:text-[13px] text-white/55 mt-1 truncate'>
              {subtitle}
            </p>
          )}
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          <button
            type='button'
            aria-label='Scroll previous'
            onClick={() => scrollBy(-1)}
            className='hidden md:grid h-9 w-9 place-items-center rounded-pill bg-white/[0.06] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.10] transition'
          >
            <ChevLeft />
          </button>
          <button
            type='button'
            aria-label='Scroll next'
            onClick={() => scrollBy(1)}
            className='hidden md:grid h-9 w-9 place-items-center rounded-pill bg-white/[0.06] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.10] transition'
          >
            <ChevRight />
          </button>
          {seeAllHref && (
            <Link
              to={seeAllHref}
              className='inline-flex items-center gap-1 text-[11px] lg:text-xs font-display font-medium text-brand-hi hover:text-white transition'
            >
              See all
              <ChevRight />
            </Link>
          )}
        </div>
      </header>

      {events.length === 0 ? (
        <div className='px-5 lg:px-10 text-sm text-white/45'>{emptyState}</div>
      ) : (
        <div
          ref={scrollerRef}
          className={cn(
            'flex overflow-x-auto snap-x snap-mandatory px-5 lg:px-10 pb-2 no-scrollbar',
            'scroll-smooth'
          )}
          style={{ gap }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className='snap-start shrink-0'
              style={{ width: cardWidth }}
            >
              <EventCardV2 event={event} variant={variant} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const ChevRight = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='m4.5 2.5 3.5 3.5-3.5 3.5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const ChevLeft = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='m7.5 2.5-3.5 3.5 3.5 3.5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
