import { cn } from '../../../types/ui'

interface QueueProgressProps {
  pct: number
  color: string
  className?: string
}

export default function QueueProgress({ pct, color, className }: QueueProgressProps) {
  const safePct = Math.max(0, Math.min(1, pct))
  return (
    <div
      className={cn('rounded-glass-md border border-white/[0.10] p-5', className)}
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className='flex items-baseline justify-between mb-2.5'>
        <div className='text-[11px] uppercase tracking-[0.16em] text-white/55 font-display font-bold'>
          Queue progress
        </div>
        <div className='font-display text-base font-semibold text-white tabular-nums'>
          {Math.round(safePct * 100)}%
        </div>
      </div>
      <div className='h-1.5 rounded-pill overflow-hidden bg-white/[0.08]'>
        <div
          className='h-full transition-[width] duration-500'
          style={{
            width: `${safePct * 100}%`,
            background: `linear-gradient(90deg, #7C5BC4, ${color})`
          }}
        />
      </div>
    </div>
  )
}
