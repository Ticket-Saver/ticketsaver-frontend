import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import LayoutV2 from '../../layouts/LayoutV2'
import CategoryChips from '../../components/v2/CategoryChips'
import EventCardV2 from '../../components/v2/EventCardV2'
import { GlassCard, Pill } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { cn } from '../../types/ui'
import type { CategoryFilter, UIEvent } from '../../types/uiEvent'
import glass from '../../styles/effects/glass.module.css'

type SortMode = 'date' | 'name'

const SORT_LABEL: Record<SortMode, string> = {
  date: 'Soonest first',
  name: 'A → Z'
}

const VALID_CATEGORIES: ReadonlyArray<CategoryFilter> = [
  'All',
  'Music',
  'Theatre',
  'Comedy',
  'Sports',
  'Family'
]

const isValidCategory = (v: string | null): v is CategoryFilter =>
  v !== null && (VALID_CATEGORIES as readonly string[]).includes(v)

const ensureSessionId = () => {
  const hasSession = document.cookie
    .split(';')
    .some((c) => c.trim().startsWith('sessionId='))
  if (!hasSession) {
    const id = uuidv4()
    document.cookie = `sessionId=${id}; path=/`
  }
}

const matchesQuery = (event: UIEvent, q: string): boolean => {
  if (!q) return true
  const haystack = `${event.title} ${event.subtitle} ${event.venueName} ${event.city} ${event.category} ${event.tags.join(' ')}`
  return haystack.toLowerCase().includes(q.toLowerCase())
}

export default function EventsV2() {
  const { loading, visible, availableCategories } = useUIEvents()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState<SortMode>('date')

  // Mantenemos el comportamiento legacy: garantiza un sessionId al entrar al listing.
  useEffect(() => {
    ensureSessionId()
  }, [])

  const activeCategory: CategoryFilter = (() => {
    const c = searchParams.get('cat')
    return isValidCategory(c) ? c : 'All'
  })()

  const query = searchParams.get('q') ?? ''

  const updateParam = (key: 'cat' | 'q', value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value === null || value === '' || (key === 'cat' && value === 'All')) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? visible
        : visible.filter((e) => e.category === activeCategory)
    const searched = base.filter((e) => matchesQuery(e, query))
    return sort === 'name'
      ? [...searched].sort((a, b) => a.title.localeCompare(b.title))
      : [...searched].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  }, [visible, activeCategory, query, sort])

  return (
    <LayoutV2 meshSeed={5}>
      <div className='pt-6 lg:pt-10 pb-10'>
        <header className='px-5 lg:px-10 max-w-7xl mx-auto w-full'>
          <p className='font-display text-[11px] uppercase tracking-[0.16em] font-semibold text-brand-hi'>
            Discover
          </p>
          <div className='mt-2 flex flex-wrap items-end justify-between gap-3'>
            <h1 className='font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.05]'>
              All events
            </h1>
            {!loading && (
              <Pill state='normal' size='sm'>
                {filtered.length} result{filtered.length === 1 ? '' : 's'}
              </Pill>
            )}
          </div>
          <p className='mt-3 text-sm text-white/55 max-w-xl'>
            Face value tickets across music, theatre, sports and more. Filter
            by category, search by artist or venue.
          </p>
        </header>

        <div
          className={cn(
            'sticky top-16 lg:top-20 z-30 mt-6 lg:mt-8',
            glass.glassNav
          )}
        >
          <div className='mx-auto max-w-7xl px-5 lg:px-10 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4'>
            <div className='flex-1 min-w-0'>
              <CategoryChips
                active={activeCategory}
                onChange={(cat) =>
                  updateParam('cat', cat === 'All' ? null : cat)
                }
                available={['All', ...availableCategories]}
              />
            </div>

            <div className='flex items-center gap-3'>
              <SearchInput
                value={query}
                onChange={(v) => updateParam('q', v || null)}
              />
              <SortSelect value={sort} onChange={setSort} />
            </div>
          </div>
        </div>

        <div className='px-5 lg:px-10 max-w-7xl mx-auto w-full mt-6 lg:mt-8'>
          {loading ? (
            <GridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState query={query} activeCategory={activeCategory} />
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filtered.map((event) => (
                <EventCardV2 key={event.id} event={event} variant='poster' />
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutV2>
  )
}

const SearchInput = ({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) => (
  <label className='flex items-center gap-2 rounded-pill bg-white/[0.06] border border-white/10 px-3.5 h-10 w-[200px] sm:w-[240px] text-xs text-white/85 focus-within:border-brand-mid/60 transition'>
    <SearchIcon />
    <input
      type='search'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Search artists, venues…'
      className='flex-1 bg-transparent outline-none placeholder:text-white/40 font-body'
      aria-label='Search events'
    />
    {value && (
      <button
        type='button'
        aria-label='Clear search'
        onClick={() => onChange('')}
        className='text-white/55 hover:text-white transition'
      >
        ×
      </button>
    )}
  </label>
)

const SortSelect = ({
  value,
  onChange
}: {
  value: SortMode
  onChange: (v: SortMode) => void
}) => (
  <label className='hidden sm:inline-flex items-center gap-2 rounded-pill bg-white/[0.06] border border-white/10 h-10 pl-3.5 pr-2 text-xs text-white/85 cursor-pointer hover:bg-white/[0.10] transition font-display'>
    <span className='text-white/55 text-[10px] uppercase tracking-[0.12em]'>
      Sort
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortMode)}
      className='appearance-none bg-transparent outline-none pr-5 font-body text-white text-xs cursor-pointer'
      style={{
        backgroundImage:
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12"><path d="m3 5 3 3 3-3" stroke="white" stroke-opacity="0.65" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
        backgroundSize: '10px 10px'
      }}
    >
      <option className='bg-brand-ink' value='date'>
        {SORT_LABEL.date}
      </option>
      <option className='bg-brand-ink' value='name'>
        {SORT_LABEL.name}
      </option>
    </select>
  </label>
)

const SearchIcon = () => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill='none' aria-hidden>
    <circle cx='7' cy='7' r='5' stroke='currentColor' strokeWidth='1.6' />
    <path
      d='m11 11 3 3'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
    />
  </svg>
)

const GridSkeleton = () => (
  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className='h-72 rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
      />
    ))}
  </div>
)

const EmptyState = ({
  query,
  activeCategory
}: {
  query: string
  activeCategory: CategoryFilter
}) => (
  <GlassCard depth='md' radius='lg' className='p-8 text-center'>
    <div className='font-display text-lg font-semibold text-white'>
      No events found
    </div>
    <p className='mt-2 text-sm text-white/55'>
      {query
        ? `Nothing matches "${query}"${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.`
        : `No upcoming events in ${activeCategory}.`}
      {' '}
      Try clearing your filters.
    </p>
  </GlassCard>
)
