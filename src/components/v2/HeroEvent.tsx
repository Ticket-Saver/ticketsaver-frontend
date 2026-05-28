import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCover from './EventCover'
import { cn } from '../../types/ui'
import type { UIEvent } from '../../types/uiEvent'

interface HeroEventProps {
  events: UIEvent[]
  initialIndex?: number
  /** Si > 0, auto-rota cada N ms. Pausa al hover/focus. */
  autoPlayMs?: number
  /** Alto del hero — default responsive (380/420/520). */
  className?: string
}

export default function HeroEvent({
  events,
  initialIndex = 0,
  autoPlayMs = 0,
  className
}: HeroEventProps) {
  const [active, setActive] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(events.length - 1, 0))
  )
  const [paused, setPaused] = useState(false)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const programmaticScrollRef = useRef(false)

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % events.length) + events.length) % events.length
      setActive(next)
      const el = scrollerRef.current
      if (el) {
        programmaticScrollRef.current = true
        el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
        window.setTimeout(() => {
          programmaticScrollRef.current = false
        }, 400)
      }
    },
    [events.length]
  )

  // Auto-rotación
  useEffect(() => {
    if (!autoPlayMs || autoPlayMs <= 0 || events.length <= 1 || paused) return
    const t = window.setInterval(() => {
      goTo(active + 1)
    }, autoPlayMs)
    return () => window.clearInterval(t)
  }, [autoPlayMs, paused, active, events.length, goTo])

  // Sincronizar active con el scroll del usuario (swipe mobile / drag).
  const onScroll = () => {
    if (programmaticScrollRef.current) return
    const el = scrollerRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== active) setActive(idx)
  }

  if (events.length === 0) return null

  return (
    <section
      aria-roledescription='carousel'
      aria-label='Featured events'
      className={cn('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className='px-5 lg:px-10'>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className='flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 lg:-mx-10 px-5 lg:px-10'
          style={{ scrollbarWidth: 'none' }}
        >
          {events.map((event, i) => (
            <div
              key={event.id}
              className='snap-center shrink-0 w-full pr-2'
              aria-roledescription='slide'
              aria-label={`${i + 1} of ${events.length}`}
            >
              <HeroSlide event={event} active={i === active} />
            </div>
          ))}
        </div>
      </div>

      {events.length > 1 && (
        <div className='mt-4 flex items-center justify-center gap-2'>
          {events.map((_, i) => (
            <button
              key={i}
              type='button'
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-pill transition-all duration-300',
                i === active
                  ? 'w-7 bg-white'
                  : 'w-1.5 bg-white/30 hover:bg-white/55'
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}

interface HeroSlideProps {
  event: UIEvent
  active: boolean
}

const HeroSlide = ({ event }: HeroSlideProps) => {
  const target = event.isExternal && event.ticketUrl ? event.ticketUrl : event.detailHref
  const isExt = Boolean(event.isExternal && event.ticketUrl)

  const ctaCommon = (
    <>
      <span className='font-display text-sm font-semibold tracking-tight'>
        Get tickets
        {event.priceFrom !== null && ` · from $${Math.round(event.priceFrom)}`}
      </span>
      <ChevRight />
    </>
  )

  return (
    <article className='relative h-[420px] sm:h-[460px] lg:h-[520px] rounded-glass-lg overflow-hidden border border-white/[0.12] shadow-glass-deep'>
      <div className='absolute inset-0'>
        <EventCover event={event} height={520} big hideCategory hideTitle hideDate />
      </div>

      <div
        aria-hidden
        className='absolute inset-x-0 bottom-0 h-3/5'
        style={{
          background:
            'linear-gradient(to top, rgba(8,4,20,0.92) 0%, rgba(8,4,20,0.5) 50%, transparent 100%)'
        }}
      />

      <div className='absolute top-4 right-4'>
        <button
          type='button'
          aria-label='Save to my list'
          className='grid h-10 w-10 place-items-center rounded-glass-sm border border-white/20 text-white backdrop-blur-glass'
          style={{ background: 'rgba(0,0,0,0.36)' }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Wishlist en B6. Por ahora visual.
          }}
        >
          <HeartIcon />
        </button>
      </div>

      <div className='absolute inset-x-5 lg:inset-x-8 bottom-5 lg:bottom-8 text-white'>
        <span className='inline-flex items-center gap-2 px-2.5 py-1 rounded-pill bg-brand-hi/20 border border-brand-hi/40 text-[10px] font-display font-semibold uppercase tracking-[0.12em] text-brand-hi mb-3'>
          <span className='h-1.5 w-1.5 rounded-full bg-brand-hi shadow-[0_0_8px_var(--brand-hi)]' />
          Featured · {event.category}
        </span>
        <h2
          className='font-display font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[0.95]'
          style={{ textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}
        >
          {event.title}
        </h2>
        <p className='text-xs sm:text-sm text-white/85 mt-2'>
          <span className='text-white/65'>
            {event.day} {event.date} {event.month}
            {event.time && `, ${event.time} · `}
          </span>
          {event.subtitle}
        </p>

        {isExt ? (
          <a
            href={target}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-4 inline-flex w-full sm:w-auto items-center justify-between gap-3 rounded-glass-md bg-white text-brand-ink px-5 py-3.5 font-display font-semibold shadow-[0_6px_20px_rgba(255,255,255,0.18)] hover:brightness-95 transition'
          >
            {ctaCommon}
          </a>
        ) : (
          <Link
            to={target}
            className='mt-4 inline-flex w-full sm:w-auto items-center justify-between gap-3 rounded-glass-md bg-white text-brand-ink px-5 py-3.5 font-display font-semibold shadow-[0_6px_20px_rgba(255,255,255,0.18)] hover:brightness-95 transition'
          >
            {ctaCommon}
          </Link>
        )}
      </div>
    </article>
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

const HeartIcon = () => (
  <svg width='15' height='15' viewBox='0 0 14 14' fill='none' aria-hidden>
    <path
      d='M7 12s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7Z'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinejoin='round'
    />
  </svg>
)
