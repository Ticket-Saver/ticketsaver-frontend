import { GlassCard } from '../../ui'

export interface TeamMember {
  name: string
  role: string
  /** Color base del gradient del avatar. */
  color: string
}

interface TeamGridProps {
  members: TeamMember[]
}

export default function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3'>
      {members.map((m) => (
        <GlassCard
          key={m.name}
          depth='sm'
          radius='md'
          className='p-3 text-center'
        >
          <div
            className='h-12 w-12 mx-auto rounded-pill grid place-items-center font-display text-base font-bold text-white border-[1.5px] border-white/20'
            style={{
              background: `linear-gradient(135deg, ${m.color}, #5B3FA8)`
            }}
            aria-hidden
          >
            {m.name[0]}
          </div>
          <div className='mt-2 text-[12px] text-white font-semibold truncate'>
            {m.name}
          </div>
          <div className='text-[10px] text-white/50 mt-0.5 truncate'>
            {m.role}
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
