import { GlassCard } from '../../ui'
import { cn } from '../../../types/ui'

export interface HelpCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href?: string
}

interface HelpCategoriesProps {
  categories: HelpCategory[]
}

export default function HelpCategories({ categories }: HelpCategoriesProps) {
  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  )
}

const CategoryCard = ({ category }: { category: HelpCategory }) => {
  const content = (
    <GlassCard
      depth='md'
      radius='lg'
      hoverable
      className={cn(
        'p-5 h-full block transition',
        category.href && 'cursor-pointer'
      )}
    >
      <div
        aria-hidden
        className='h-10 w-10 rounded-glass-sm grid place-items-center text-white mb-3'
        style={{
          background:
            'linear-gradient(135deg, rgba(212,168,240,0.30), rgba(181,123,232,0.18))'
        }}
      >
        {category.icon}
      </div>
      <h3 className='font-display text-base font-semibold text-white tracking-tight'>
        {category.title}
      </h3>
      <p className='mt-1.5 text-[12.5px] text-white/65 leading-relaxed'>
        {category.description}
      </p>
      <div className='mt-3 inline-flex items-center gap-1 text-[11px] text-brand-hi font-display font-semibold'>
        Learn more
        <svg width='10' height='10' viewBox='0 0 12 12' fill='none' aria-hidden>
          <path
            d='m4.5 2.5 3.5 3.5-3.5 3.5'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    </GlassCard>
  )
  if (category.href) {
    return (
      <a
        href={category.href}
        className='block focus-visible:outline-none rounded-glass-lg'
      >
        {content}
      </a>
    )
  }
  return content
}
