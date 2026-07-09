import TicketCard from './TicketCard'
import { GlassCard } from '../../ui'
import { cn } from '../../../types/ui'
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
