import TicketCard from './TicketCard'
import { GlassCard } from '../../ui'
import { cn } from '../../../types/ui'
import type { UIEvent } from '../../../types/uiEvent'

export interface TicketGridItem {
  key: string
  event: UIEvent
  href?: string
  /** "Zona 205 · Fila A · Asiento 1" — distingue cards del mismo evento. */
  seatLabel?: string
}

interface TicketGridProps {
  /** Una card por TICKET (asiento), no por evento. */
  items: TicketGridItem[]
  /** Marca todas como pasadas (visual saturado). */
  past?: boolean
  /** Mensaje cuando no hay tickets. */
  emptyMessage?: string
  className?: string
}

/**
 * Grid de tickets en variante 'list'. 1 col mobile, 2 desktop.
 * Para upcoming y past.
 */
export default function TicketGrid({
  items,
  past,
  emptyMessage = "You don't have any events here yet.",
  className
}: TicketGridProps) {
  if (items.length === 0) {
    return (
      <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
        <div className='font-display text-base font-semibold text-white'>Nothing here yet</div>
        <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>{emptyMessage}</p>
      </GlassCard>
    )
  }
  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {items.map((item) => (
        <TicketCard
          key={item.key}
          event={item.event}
          variant='list'
          past={past}
          href={item.href}
          seatLabel={item.seatLabel}
        />
      ))}
    </div>
  )
}
