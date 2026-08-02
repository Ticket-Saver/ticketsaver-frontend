import { cn } from '../../types/ui'
import type { CategoryFilter } from '../../types/uiEvent'

const DEFAULT_CATEGORIES: CategoryFilter[] = [
  'All',
  'Music',
  'Theatre',
  'Comedy',
  'Sports',
  'Family'
]

interface CategoryChipsProps {
  active: CategoryFilter
  onChange: (cat: CategoryFilter) => void
  /** Override de la lista por defecto. */
  categories?: CategoryFilter[]
  /** Si se provee, deshabilita las que no estén en este set. */
  available?: ReadonlyArray<CategoryFilter>
  className?: string
}

export default function CategoryChips({
  active,
  onChange,
  categories = DEFAULT_CATEGORIES,
  available,
  className
}: CategoryChipsProps) {
  return (
    <div
      role='tablist'
      aria-label='Event category filter'
      className={cn('flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1', className)}
    >
      {categories.map((cat) => {
        const isActive = active === cat
        const isAvailable = cat === 'All' || !available || available.includes(cat)
        return (
          <button
            key={cat}
            role='tab'
            type='button'
            aria-selected={isActive}
            disabled={!isAvailable}
            onClick={() => onChange(cat)}
            className={cn(
              'flex-shrink-0 rounded-pill px-3.5 py-2 text-xs font-display tracking-tight transition border',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60',
              isActive
                ? 'bg-white text-brand-ink border-transparent font-semibold shadow-cover-glow'
                : 'bg-white/[0.07] text-white/85 border-white/[0.12] hover:bg-white/[0.10] font-medium backdrop-blur-glass',
              !isAvailable && 'opacity-35 cursor-not-allowed hover:bg-white/[0.07]'
            )}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
