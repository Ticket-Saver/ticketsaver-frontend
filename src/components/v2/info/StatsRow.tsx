import { GlassCard } from '../../ui'

export interface Stat {
  label: string
  value: string
}

interface StatsRowProps {
  stats: Stat[]
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
      <div className='grid grid-cols-2 gap-4 lg:gap-8'>
        {stats.map((s) => (
          <div key={s.label}>
            <div className='font-display text-2xl lg:text-4xl font-bold text-white tracking-[-0.025em] leading-none'>
              {s.value}
            </div>
            <div className='mt-2 text-[9.5px] lg:text-[11px] uppercase tracking-[0.14em] text-white/50 font-display font-semibold'>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
