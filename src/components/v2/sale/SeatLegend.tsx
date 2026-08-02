import { cn } from '../../../types/ui'

interface SeatLegendProps {
  className?: string
}

const ITEMS: { label: string; color: string; icon?: 'wheelchair' | 'companion' }[] = [
  { label: 'Available', color: '#3B82F6' },
  { label: 'Your selection', color: '#F6C84A' },
  { label: 'Taken', color: '#9CA3AF' },
  { label: 'Companion', color: '#C084FC', icon: 'companion' },
  { label: 'Wheelchair', color: '#1E3A8A', icon: 'wheelchair' },
  { label: 'Reduced mobility', color: '#10B981' }
]

export default function SeatLegend({ className }: SeatLegendProps) {
  return (
    <div
      className={cn(
        'rounded-glass-md bg-white/[0.04] border border-white/[0.10] backdrop-blur-glass px-3 py-2.5',
        className
      )}
      aria-label='Seat status legend'
    >
      <div className='text-[9px] uppercase tracking-[0.16em] font-display font-bold text-white/55 mb-2'>
        Legend
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2'>
        {ITEMS.map((item) => (
          <div key={item.label} className='flex items-center gap-2 min-w-0'>
            <span
              aria-hidden
              className='grid h-4 w-4 shrink-0 place-items-center rounded-sm'
              style={{ background: item.color }}
            >
              {item.icon === 'wheelchair' && (
                <svg width='7' height='7' viewBox='0 0 10 10' fill='#fff' aria-hidden>
                  <circle cx='5' cy='2' r='1.1' />
                  <path d='M4 4v3l2 1v1.5h1.5V8L5.5 7V5h2V4z' />
                </svg>
              )}
              {item.icon === 'companion' && (
                <svg width='7' height='7' viewBox='0 0 10 10' fill='#1A0F33' aria-hidden>
                  <circle cx='3.5' cy='2.5' r='1.1' />
                  <circle cx='6.5' cy='2.5' r='1.1' />
                  <path d='M1.5 8c0-1.5 1-2 2-2s2 .5 2 2zM5 8c0-1.5 1-2 2-2s2 .5 2 2z' />
                </svg>
              )}
            </span>
            <span className='text-[10.5px] text-white/75 truncate'>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
