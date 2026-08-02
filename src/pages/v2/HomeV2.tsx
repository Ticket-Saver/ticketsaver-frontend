import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import CategoryChips from '../../components/v2/CategoryChips'
import HeroEvent from '../../components/v2/HeroEvent'
import EventCarousel from '../../components/v2/EventCarousel'
import CoverFlow3D from '../../components/v2/CoverFlow3D'
import { GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { useHomeConfig } from '../../hooks/useHomeConfig'
import gradients from '../../styles/effects/gradients.module.css'
import type { Category, CategoryFilter, UIEvent } from '../../types/uiEvent'

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short'
})

const isTonight = (now: Date): boolean => now.getHours() >= 17 || now.getHours() < 5

const pickFeaturedCategory = (events: UIEvent[]): Category => {
  const counts = new Map<Category, number>()
  for (const e of events) {
    counts.set(e.category, (counts.get(e.category) ?? 0) + 1)
  }
  let best: Category = 'Music'
  let bestCount = -1
  for (const [cat, count] of counts) {
    if (count > bestCount) {
      best = cat
      bestCount = count
    }
  }
  return best
}

export default function HomeV2() {
  const navigate = useNavigate()
  const { loading, hero, thisWeek, tonight, visible, byCategory, byId } = useUIEvents()
  const { config: homeConfig } = useHomeConfig()

  // Hero: si el admin curó eventos destacados, se usan esos (en orden); si no,
  // cae al hero automático. Mismo criterio para los carruseles.
  const heroEvents = useMemo(() => {
    const curated = (homeConfig?.featured_event_ids ?? [])
      .map((id) => byId(String(id)))
      .filter((e): e is UIEvent => !!e && !e.expired && !e.hidden)
    return curated.length > 0 ? curated : hero
  }, [homeConfig, byId, hero])

  const curatedCarousels = useMemo(
    () =>
      (homeConfig?.carousels ?? [])
        .map((c) => ({
          title: c.title,
          events: c.event_ids
            .map((id) => byId(String(id)))
            .filter((e): e is UIEvent => !!e && !e.expired && !e.hidden)
        }))
        .filter((c) => c.events.length > 0),
    [homeConfig, byId]
  )

  const now = useMemo(() => new Date(), [])
  const greetingDate = DATE_FMT.format(now)
  const tonightCopy = isTonight(now)

  const featuredCategory = useMemo(() => pickFeaturedCategory(visible), [visible])

  const trending = useMemo(
    () => visible.filter((e) => !heroEvents.some((h) => h.id === e.id)).slice(0, 8),
    [visible, heroEvents]
  )

  const thisWeekRow = useMemo(
    () => thisWeek.filter((e) => !heroEvents.some((h) => h.id === e.id)).slice(0, 10),
    [thisWeek, heroEvents]
  )

  const featuredRow = useMemo(
    () =>
      byCategory(featuredCategory)
        .filter((e) => !heroEvents.some((h) => h.id === e.id))
        .slice(0, 10),
    [byCategory, featuredCategory, heroEvents]
  )

  // Selección para el cover-flow 3D — eventos visibles que no estén en
  // el hero, capados a 6 para que el efecto 3D no se sature.
  const closerLook = useMemo(
    () => visible.filter((e) => !heroEvents.some((h) => h.id === e.id)).slice(0, 6),
    [visible, heroEvents]
  )

  const handleCategory = (cat: CategoryFilter) => {
    if (cat === 'All') navigate('/events')
    else navigate(`/events?cat=${encodeURIComponent(cat)}`)
  }

  return (
    <LayoutV2 meshSeed={3}>
      <div className='pt-6 lg:pt-10 pb-10 space-y-8 lg:space-y-12'>
        <header className='px-5 lg:px-10 max-w-[1280px] mx-auto w-full'>
          <p className='font-display text-[11px] uppercase tracking-[0.16em] font-semibold text-brand-hi'>
            {greetingDate}
          </p>
          <h1 className='mt-2 font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.05]'>
            {tonightCopy ? "Tonight's a " : "Today's a "}
            <span className={gradients.textBrandSoft}>
              {tonightCopy ? 'good night' : 'good day'}
            </span>
            <br className='hidden sm:block' />
            <span className='sm:hidden'> </span>
            for a show.
          </h1>
          <p className='mt-3 text-sm lg:text-base text-white/55 max-w-xl'>
            {tonight.length > 0
              ? `${tonight.length} event${tonight.length > 1 ? 's' : ''} happening tonight, and many more this week.`
              : 'Browse what’s coming up — face value, tickets are yours.'}
          </p>
        </header>

        <div className='px-5 lg:px-10 max-w-[1280px] mx-auto w-full'>
          <CategoryChips active='All' onChange={handleCategory} />
        </div>

        {loading ? (
          <LoadingState />
        ) : heroEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <HeroEvent
              events={heroEvents.slice(0, 5)}
              autoPlayMs={9000}
              className='mx-auto w-full max-w-[1280px]'
            />

            {closerLook.length > 0 && (
              <CoverFlow3D events={closerLook} className='mx-auto w-full max-w-[1280px]' />
            )}

            {curatedCarousels.length > 0 ? (
              curatedCarousels.map((c, i) => (
                <EventCarousel
                  key={`${c.title}-${i}`}
                  className='mx-auto w-full max-w-[1280px]'
                  title={c.title}
                  events={c.events}
                  variant='poster'
                  cardWidth={260}
                  seeAllHref='/events'
                />
              ))
            ) : (
              <>
                {trending.length > 0 && (
                  <EventCarousel
                    className='mx-auto w-full max-w-[1280px]'
                    title='Trending now'
                    subtitle='Picks selling fast across cities'
                    events={trending}
                    variant='poster'
                    cardWidth={260}
                    seeAllHref='/events'
                  />
                )}

                {thisWeekRow.length > 0 && (
                  <EventCarousel
                    className='mx-auto w-full max-w-[1280px]'
                    title='This week'
                    subtitle='Next 7 days, all categories'
                    events={thisWeekRow}
                    variant='cinema'
                    cardWidth={320}
                    seeAllHref='/events'
                  />
                )}

                {featuredRow.length > 0 && (
                  <EventCarousel
                    className='mx-auto w-full max-w-[1280px]'
                    title={`${featuredCategory} highlights`}
                    subtitle='Curated by what you love'
                    events={featuredRow}
                    variant='poster'
                    cardWidth={260}
                    seeAllHref={`/events?cat=${encodeURIComponent(featuredCategory)}`}
                  />
                )}
              </>
            )}
          </>
        )}

        <PrinciplesPanel />
      </div>
    </LayoutV2>
  )
}

const PRINCIPLES = [
  {
    title: 'Face value, always',
    body: 'No dynamic pricing. The price you see is the one the artist asked for.'
  },
  {
    title: 'Tickets are yours',
    body: 'Every ticket lives in your wallet as an NFT. Yours forever, no platform lock-in.'
  },
  {
    title: 'No scalpers',
    body: 'Resale capped at face value. Built so fans win.'
  }
]

const PrinciplesPanel = () => (
  <section className='px-5 lg:px-10 max-w-[1280px] mx-auto w-full pt-8 lg:pt-14'>
    <div className='flex items-center gap-4 mb-6 lg:mb-8'>
      <span className='font-display text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-hi'>
        Why TicketSaver
      </span>
      <span className='h-px flex-1 bg-white/10' />
    </div>
    <div className='grid gap-4 sm:grid-cols-3'>
      {PRINCIPLES.map((p, i) => (
        <GlassCard key={p.title} depth='sm' radius='lg' className='p-6 lg:p-7'>
          <div className='grid h-9 w-9 place-items-center rounded-glass-sm bg-brand-hi/10 mb-4'>
            <span className='font-display text-[13px] font-bold text-brand-hi'>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <div className='font-display text-base font-semibold tracking-tight text-white'>
            {p.title}
          </div>
          <p className='mt-2 text-[13px] text-white/65 leading-relaxed'>{p.body}</p>
        </GlassCard>
      ))}
    </div>
  </section>
)

const LoadingState = () => (
  <div className='px-5 lg:px-10 max-w-[1280px] mx-auto w-full'>
    <div className='h-[420px] sm:h-[460px] lg:h-[520px] rounded-glass-lg bg-white/[0.04] border border-white/[0.08] animate-pulse' />
    <div className='mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className='h-60 rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
        />
      ))}
    </div>
  </div>
)

const EmptyState = () => (
  <div className='px-5 lg:px-10 max-w-[1280px] mx-auto w-full'>
    <GlassCard depth='md' radius='lg' className='p-8 text-center'>
      <div className='font-display text-lg font-semibold text-white'>No upcoming events</div>
      <p className='mt-2 text-sm text-white/55'>Stay tuned — we’re lining up the next wave.</p>
    </GlassCard>
  </div>
)
