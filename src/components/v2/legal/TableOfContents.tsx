import { cn } from '../../../types/ui'

export interface TocItem {
  id: string
  title: string
}

interface TableOfContentsProps {
  items: TocItem[]
  activeId: string
  onSelect: (id: string) => void
}

export default function TableOfContents({
  items,
  activeId,
  onSelect
}: TableOfContentsProps) {
  return (
    <nav aria-label='Document sections'>
      <div className='text-[9.5px] uppercase tracking-[0.18em] text-white/40 font-display font-bold mb-2.5'>
        Contents
      </div>
      <ul className='flex flex-col gap-1'>
        {items.map((item, i) => {
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <button
                type='button'
                onClick={() => onSelect(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-glass-sm px-2.5 py-2 text-left transition',
                  active
                    ? 'bg-brand-hi/12 border border-brand-hi/25'
                    : 'border border-transparent hover:bg-white/[0.05]'
                )}
              >
                <span className='text-[10px] text-brand-hi font-display font-bold tracking-[0.1em] min-w-[22px]'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-[12.5px] truncate',
                    active ? 'text-white font-semibold' : 'text-white/70'
                  )}
                >
                  {item.title}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
