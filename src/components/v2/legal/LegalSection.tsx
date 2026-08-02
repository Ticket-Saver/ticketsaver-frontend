export interface LegalSectionData {
  id: string
  title: string
  body: string
  bullets?: string[]
}

interface LegalSectionProps {
  section: LegalSectionData
  index: number
}

export default function LegalSection({ section, index }: LegalSectionProps) {
  return (
    <div>
      <div className='flex items-baseline gap-2 mb-3'>
        <span className='font-display text-[11px] text-brand-hi font-bold tracking-[0.14em]'>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className='font-display text-lg lg:text-xl font-semibold text-white tracking-tight'>
          {section.title}
        </h2>
      </div>
      <p
        className='text-[13px] text-white/78 leading-[1.65] whitespace-pre-wrap'
        style={{ textWrap: 'pretty' as never }}
      >
        {section.body}
      </p>
      {section.bullets && section.bullets.length > 0 && (
        <div className='mt-4 flex flex-col gap-2'>
          {section.bullets.map((b, j) => (
            <div
              key={j}
              className='flex gap-3 rounded-glass-sm bg-white/[0.03] border border-white/[0.08] px-3 py-2.5'
            >
              <span
                aria-hidden
                className='w-1 self-stretch rounded-pill shrink-0'
                style={{
                  background: 'linear-gradient(180deg, #FFB1C8, #7C5BC4)'
                }}
              />
              <span className='text-[12px] text-white/78 leading-relaxed flex-1'>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
