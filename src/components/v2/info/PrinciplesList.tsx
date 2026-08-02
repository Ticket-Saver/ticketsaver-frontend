import { GlassCard } from '../../ui'

export interface Principle {
  title: string
  body: string
}

interface PrinciplesListProps {
  principles: Principle[]
}

export default function PrinciplesList({ principles }: PrinciplesListProps) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      {principles.map((p, i) => (
        <GlassCard key={p.title} depth='sm' radius='md' className='p-4 flex gap-3'>
          <div className='shrink-0 font-display text-[11px] font-bold text-brand-hi tracking-[0.14em]'>
            {String(i + 1).padStart(2, '0')}
          </div>
          <div className='min-w-0'>
            <div className='font-display text-[14px] font-semibold text-white tracking-tight'>
              {p.title}
            </div>
            <p className='mt-1.5 text-[12px] text-white/65 leading-relaxed'>{p.body}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
