import TicketCard from './TicketCard'
import { GlassCard } from '../../ui'
import { cn } from '../../../types/ui'
import { getCoverPalette } from '../../../lib/covers/palettes'
import type { UIEvent } from '../../../types/uiEvent'

interface TicketGridProps {
  events: UIEvent[]
  /** Marca todas como pasadas (visual saturado). */
  past?: boolean
  /** Mensaje cuando no hay eventos. */
  emptyMessage?: string
  className?: string
  /** Builder del href de cada ticket. */
  hrefFor?: (event: UIEvent) => string | undefined
}

/**
 * Grid de tickets en variante 'list'. 1 col mobile, 2 desktop.
 * Para upcoming y past.
 */
export default function TicketGrid({
  events,
  past,
  emptyMessage = "You don't have any events here yet.",
  className,
  hrefFor
}: TicketGridProps) {
  if (events.length === 0) {
    return (
      <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
        <div className='font-display text-base font-semibold text-white'>
          Nothing here yet
        </div>
        <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>
          {emptyMessage}
        </p>
      </GlassCard>
    )
  }
  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {events.map((event) => (
        <TicketCard
          key={event.id}
          event={event}
          variant='list'
          past={past}
          href={hrefFor?.(event)}
        />
      ))}
    </div>
  )
}

interface CollectionGridProps {
  events: UIEvent[]
  emptyMessage?: string
  className?: string
}

/**
 * Grid 2/3/4 cols de mini NFT cards para la pestaña Collectibles.
 * Estilizado como una "vitrina" de coleccionables.
 */
export const CollectionGrid = ({
  events,
  emptyMessage = 'Past events you attended will appear here as collectibles.',
  className
}: CollectionGridProps) => {
  if (events.length === 0) {
    return (
      <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
        <div className='font-display text-base font-semibold text-white'>
          No collectibles yet
        </div>
        <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>
          {emptyMessage}
        </p>
      </GlassCard>
    )
  }
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3',
        className
      )}
    >
      {events.map((event, i) => (
        <CollectibleTile key={event.id} event={event} index={i} />
      ))}
    </div>
  )
}

const CollectibleTile = ({
  event,
  index
}: {
  event: UIEvent
  index: number
}) => {
  const palette = getCoverPalette(event.cover)
  return (
    <article
      className='relative aspect-[3/4] rounded-glass-md overflow-hidden border border-white/[0.10]'
      style={{
        background: `linear-gradient(135deg, ${palette.a}, ${palette.b}, ${palette.c})`
      }}
    >
      <div
        aria-hidden
        className='absolute inset-0'
        style={{
          background: `radial-gradient(circle at 30% 30%, ${palette.accent}55, transparent 60%)`
        }}
      />
      <svg
        aria-hidden
        className='absolute inset-0 w-full h-full pointer-events-none'
        style={{ opacity: 0.22, mixBlendMode: 'overlay' }}
      >
        <filter id={`collect-noise-${event.id.replace(/[^a-z0-9]/gi, '')}-${index}`}>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves={2} />
        </filter>
        <rect
          width='100%'
          height='100%'
          filter={`url(#collect-noise-${event.id.replace(/[^a-z0-9]/gi, '')}-${index})`}
        />
      </svg>
      <div className='absolute left-2.5 top-2.5 text-white text-[8.5px] font-display font-bold uppercase tracking-[0.14em] opacity-85'>
        #{String(index + 1).padStart(3, '0')}
      </div>
      <div className='absolute left-2.5 right-2.5 bottom-2.5 text-white'>
        <div className='font-display text-[11px] font-semibold tracking-tight truncate'>
          {event.title}
        </div>
        <div className='text-[9px] opacity-65 mt-0.5'>
          {event.month} · {event.year || 2024}
        </div>
      </div>
    </article>
  )
}
