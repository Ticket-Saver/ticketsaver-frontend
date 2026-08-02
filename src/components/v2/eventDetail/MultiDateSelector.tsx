import { cn } from '../../../types/ui'
import type { Availability, UIEvent } from '../../../types/uiEvent'

interface MultiDateSelectorProps {
  /** Lista completa de fechas del artista. Si tiene <=1 el componente no renderiza. */
  dates: UIEvent[]
  /**
   * eventId (numérico, ÚNICO por fecha) de la fecha activa. NO usar el slug: en
   * multifecha todas las fechas comparten el mismo slug y no se distinguirían.
   */
  selectedEventId: string
  onSelect: (event: UIEvent) => void
  /** Heading custom — default "Pick your date". */
  title?: string
}

const STATUS_LABEL: Record<Availability, string> = {
  available: 'On sale',
  'few-left': 'Few left',
  'selling-fast': 'Selling fast',
  'sold-out': 'Sold out'
}

export default function MultiDateSelector({
  dates,
  selectedEventId,
  onSelect,
  title = 'Pick your date'
}: MultiDateSelectorProps) {
  if (dates.length <= 1) return null

  const cityCount = new Set(dates.map((d) => d.city).filter(Boolean)).size

  return (
    <section className='pt-6'>
      <header className='flex items-end justify-between px-5 lg:px-10 pb-3'>
        <div>
          <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight'>
            {title}
          </h2>
          <p className='text-[11px] text-white/55 mt-1'>
            {dates.length} shows
            {cityCount > 1 && ` · ${cityCount} cities`}
          </p>
        </div>
      </header>

      <div
        className='flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 lg:px-10 pb-2 no-scrollbar'
        role='radiogroup'
        aria-label='Available show dates'
      >
        {dates.map((d) => (
          <DateCard
            key={d.eventId}
            event={d}
            active={d.eventId === selectedEventId}
            onClick={() => onSelect(d)}
          />
        ))}
      </div>
    </section>
  )
}

interface DateCardProps {
  event: UIEvent
  active: boolean
  onClick: () => void
}

const DateCard = ({ event, active, onClick }: DateCardProps) => {
  const statusLabel = STATUS_LABEL[event.availability]

  return (
    <button
      type='button'
      role='radio'
      aria-checked={active}
      onClick={onClick}
      disabled={event.expired || event.availability === 'sold-out'}
      className={cn(
        'snap-start shrink-0 w-[150px] p-3 rounded-glass-md text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60',
        active
          ? 'bg-white text-brand-ink border border-transparent shadow-[0_10px_26px_rgba(212,168,240,0.30)]'
          : 'bg-white/[0.05] text-white border border-white/10 backdrop-blur-glass hover:bg-white/[0.08]',
        (event.expired || event.availability === 'sold-out') && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'flex items-baseline gap-2 font-display text-[9.5px] font-bold uppercase tracking-[0.18em]',
          active ? 'text-brand-ink/55' : 'text-white/55'
        )}
      >
        <span>{event.day}</span>
        <span>{event.month}</span>
      </div>
      <div
        className={cn(
          'mt-1 font-display text-3xl font-bold leading-none tracking-tight',
          active ? 'text-brand-ink' : 'text-white'
        )}
      >
        {String(event.date).padStart(2, '0')}
      </div>
      <div
        className={cn(
          'mt-2 text-[11px] font-medium truncate',
          active ? 'text-[#3D2566]' : 'text-white/65'
        )}
      >
        {event.venueName}
      </div>
      <div className={cn('text-[10px] truncate', active ? 'text-brand-ink/65' : 'text-white/50')}>
        {event.city || '—'}
        {event.time && ` · ${event.time}`}
      </div>
      <div
        className={cn(
          'mt-2.5 pt-2 border-t flex items-center justify-between',
          active ? 'border-brand-ink/10' : 'border-white/[0.08]'
        )}
      >
        <span
          className={cn(
            'font-display text-[9px] font-bold uppercase tracking-[0.12em]',
            active ? 'text-brand-lo' : 'text-brand-hi'
          )}
        >
          {statusLabel}
        </span>
        <span
          className={cn(
            'font-display text-[11.5px] font-semibold tabular-nums',
            active ? 'text-brand-ink' : 'text-white'
          )}
        >
          {event.priceFrom !== null ? `$${Math.round(event.priceFrom)}+` : '—'}
        </span>
      </div>
    </button>
  )
}
