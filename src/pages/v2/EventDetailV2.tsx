import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import Banner from '../../components/v2/eventDetail/Banner'
import MultiDateSelector from '../../components/v2/eventDetail/MultiDateSelector'
import TagList from '../../components/v2/eventDetail/TagList'
import Gallery from '../../components/v2/eventDetail/Gallery'
import VenueMap from '../../components/v2/eventDetail/VenueMap'
import StickyCTA from '../../components/v2/eventDetail/StickyCTA'
import { GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { getDatesForArtist } from '../../services/multiDateAdapter'
import { cacheService } from '../../services/cacheService'
import { fallbackDataService } from '../../services/fallbackDataService'
import { extractZonePrices } from '../../components/Utils/priceUtils'
import { fetchDescription } from '../../components/Utils/FetchDataJson'
import { coverSeed } from '../../lib/covers/coverHash'
import type { UIEvent } from '../../types/uiEvent'

const SALE_DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

interface ZoneEntry {
  zone: string
  prices: { priceBase: number; priceFinal: number }[]
}

export default function EventDetailV2() {
  const { label, delete: deleteParam } = useParams()
  const navigate = useNavigate()
  const { loading, byLabel, visible } = useUIEvents()

  const event = byLabel(label)

  // Guards: delete flag, expired o label inexistente → redirige
  useEffect(() => {
    if (deleteParam === 'delete') {
      navigate('/', { replace: true })
      return
    }
    if (!loading && !event) {
      navigate('/events', { replace: true })
      return
    }
    if (event?.expired) {
      navigate('/events', { replace: true })
    }
  }, [deleteParam, event, loading, navigate])

  const dates = useMemo(
    () => getDatesForArtist(visible, event?.title),
    [visible, event?.title]
  )
  const datesForArtist = dates.length > 0 ? dates : event ? [event] : []

  const [zonePriceList, setZonePriceList] = useState<ZoneEntry[]>([])
  const [description, setDescription] = useState('')
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  // Fetch zone_price con caché + fallback (mismo flow que el legacy)
  useEffect(() => {
    if (!label) return
    let cancelled = false

    const token = import.meta.env.VITE_GITHUB_TOKEN
    const url = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }

    const load = async () => {
      try {
        if (fallbackDataService.isEmergencyMode()) {
          const local = await fallbackDataService.getLocalZonePrice(label)
          if (local && !cancelled) setZonePriceList(extractZonePrices(local))
          return
        }
        const data = await cacheService.fetchWithCache(url, options, {
          ttl: 5 * 60 * 1000
        })
        if (!cancelled) setZonePriceList(extractZonePrices(data))
      } catch {
        try {
          const local = await fallbackDataService.getLocalZonePrice(label)
          if (local && !cancelled) setZonePriceList(extractZonePrices(local))
        } catch {
          if (!cancelled) setZonePriceList([])
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [label])

  // Fetch description con cache + fallback
  useEffect(() => {
    if (!label) return
    let cancelled = false
    const token = import.meta.env.VITE_GITHUB_TOKEN
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }
    fetchDescription(label, options)
      .then((d) => {
        if (cancelled) return
        if (typeof d !== 'string') {
          setDescription('')
          return
        }
        // Si el endpoint devolvió HTML (dev server fallback, página 404 de
        // GitHub, etc.), no lo mostramos como texto crudo.
        if (/^\s*(<!doctype|<html|<\?xml)/i.test(d)) {
          setDescription('')
          return
        }
        setDescription(d)
      })
      .catch(() => {
        if (!cancelled) setDescription('')
      })
    return () => {
      cancelled = true
    }
  }, [label])

  const priceFrom = useMemo(() => {
    if (zonePriceList.length === 0) return null
    const all = zonePriceList.flatMap((z) =>
      z.prices.map((p) => p.priceFinal / 100)
    )
    return all.length > 0 ? Math.min(...all) : null
  }, [zonePriceList])

  const saleStartsAt = event?.raw.sale_starts_at
    ? new Date(event.raw.sale_starts_at)
    : null
  const isSaleActive = saleStartsAt
    ? saleStartsAt.getTime() <= Date.now()
    : true
  const saleStartsLabel =
    saleStartsAt && !isSaleActive
      ? `On sale ${SALE_DATE_FMT.format(saleStartsAt)}`
      : undefined

  const handleDateChange = (newEvent: UIEvent) => {
    if (newEvent.id === event?.id) return
    navigate(newEvent.detailHref, { replace: true })
  }

  if (loading || !event) {
    return (
      <LayoutV2 hideMobileTabBar hideFooter meshSeed={1}>
        <LoadingState />
      </LayoutV2>
    )
  }

  return (
    <LayoutV2 hideFooter meshSeed={(coverSeed(event.id) % 8) + 1}>
      <Banner event={event} />

      <div className='mt-8 lg:mt-10 px-5 lg:px-10 max-w-7xl mx-auto'>
        <TitleBlock event={event} />
        {event.tags.length > 0 && (
          <div className='mt-4'>
            <TagList tags={event.tags} />
          </div>
        )}
      </div>

      <div className='mt-6 max-w-7xl mx-auto'>
        <MultiDateSelector
          dates={datesForArtist}
          selectedId={event.id}
          onSelect={handleDateChange}
        />
      </div>

      <div className='mt-6 px-5 lg:px-10 max-w-7xl mx-auto'>
        <SelectedDateHighlight event={event} />
      </div>

      <Section title='About the show'>
        <Description
          text={description}
          expanded={descriptionExpanded}
          onToggle={() => setDescriptionExpanded((s) => !s)}
        />
      </Section>

      <section className='mt-8 max-w-7xl mx-auto'>
        <div className='px-5 lg:px-10 pb-3'>
          <SectionLabel>Gallery</SectionLabel>
        </div>
        <Gallery event={event} />
      </section>

      <Section title='Location'>
        <VenueMap
          venueName={event.venueName}
          city={event.city}
          mapsUrl={event.mapsUrl}
        />
      </Section>

      <Section title='Good to know'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
          <FactPill label='Doors' value={event.time || 'TBA'} />
          <FactPill label='Duration' value='Varies' />
          <FactPill label='Age' value='All ages' />
          <FactPill label='Bag policy' value='Clear bags only' />
        </div>
      </Section>

      <ZonePricesPanel zonePriceList={zonePriceList} />

      <div className='h-32 lg:h-24' />

      <StickyCTA
        event={event}
        priceFrom={priceFrom}
        isSaleActive={isSaleActive}
        saleStartsLabel={saleStartsLabel}
      />
    </LayoutV2>
  )
}

const TitleBlock = ({ event }: { event: UIEvent }) => (
  <div className='min-w-0'>
    <div className='text-[10.5px] uppercase tracking-[0.16em] font-display font-semibold text-brand-hi'>
      {event.category} · Tour
    </div>
    <h1 className='mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.05]'>
      {event.title}
    </h1>
    <p className='mt-3 text-sm lg:text-base text-white/70'>
      {event.subtitle}
    </p>
  </div>
)

const SelectedDateHighlight = ({ event }: { event: UIEvent }) => (
  <div
    className='flex items-center gap-3 p-3.5 rounded-glass-md border border-brand-hi/30 backdrop-blur-glass-strong'
    style={{ background: 'rgba(212,168,240,0.12)' }}
  >
    <div className='h-[52px] w-[52px] shrink-0 rounded-glass-sm bg-white text-brand-ink flex flex-col items-center justify-center font-display'>
      <div className='text-[8.5px] font-bold uppercase tracking-[0.16em] opacity-70'>
        {event.month}
      </div>
      <div className='text-[22px] font-bold leading-none mt-0.5'>
        {String(event.date).padStart(2, '0')}
      </div>
    </div>
    <div className='flex-1 min-w-0'>
      <div className='font-display text-[13.5px] font-semibold text-white tracking-tight'>
        {event.day}, {event.month} {event.date}
        {event.time && ` · ${event.time}`}
      </div>
      <div className='text-[11.5px] text-white/65 mt-0.5 flex items-center gap-1.5'>
        <PinIcon />
        <span className='truncate'>
          {event.venueName}
          {event.city && `, ${event.city}`}
        </span>
      </div>
    </div>
    <span className='shrink-0 px-2 py-1 rounded-glass-sm bg-accent-coral/20 text-accent-coral font-display text-[9.5px] font-bold uppercase tracking-[0.10em]'>
      {event.availability.replace('-', ' ')}
    </span>
  </div>
)

interface DescriptionProps {
  text: string
  expanded: boolean
  onToggle: () => void
}

const Description = ({ text, expanded, onToggle }: DescriptionProps) => {
  if (!text)
    return (
      <p className='text-[13px] text-white/45 italic leading-relaxed'>
        Description coming soon.
      </p>
    )

  const limit = 320
  const isLong = text.length > limit
  const display = expanded || !isLong ? text : `${text.slice(0, limit)}…`

  return (
    <div>
      <p
        className='text-[13px] leading-[1.55] text-white/78 whitespace-pre-wrap'
        style={{ textWrap: 'pretty' as never }}
      >
        {display}
      </p>
      {isLong && (
        <button
          type='button'
          onClick={onToggle}
          className='mt-2 text-[11px] font-medium text-brand-hi hover:text-white transition'
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

const ZonePricesPanel = ({
  zonePriceList
}: {
  zonePriceList: ZoneEntry[]
}) => {
  if (zonePriceList.length === 0) return null
  return (
    <Section title='Ticket zones'>
      <GlassCard depth='sm' radius='md' className='divide-y divide-white/[0.08]'>
        {zonePriceList.map((zone) => {
          const min = Math.min(
            ...zone.prices.map((p) => p.priceFinal / 100)
          )
          return (
            <div
              key={zone.zone}
              className='flex items-center justify-between px-4 py-3'
            >
              <div>
                <div className='font-display text-sm font-semibold text-white'>
                  {zone.zone}
                </div>
                <div className='text-[10.5px] text-white/45 uppercase tracking-[0.14em] mt-0.5 font-display'>
                  Starting from
                </div>
              </div>
              <div className='font-display text-sm font-semibold text-white tabular-nums'>
                ${min.toFixed(0)} USD
              </div>
            </div>
          )
        })}
      </GlassCard>
    </Section>
  )
}

const Section = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className='mt-8 px-5 lg:px-10 max-w-7xl mx-auto'>
    <SectionLabel>{title}</SectionLabel>
    {children}
  </section>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight mb-3'>
    {children}
  </h2>
)

const FactPill = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-glass-sm bg-white/[0.05] border border-white/[0.10] px-3 py-2.5'>
    <div className='text-[9px] uppercase tracking-[0.14em] text-white/50 font-display font-semibold'>
      {label}
    </div>
    <div className='mt-1 text-[12.5px] text-white font-medium tracking-tight'>
      {value}
    </div>
  </div>
)

const PinIcon = () => (
  <svg width='10' height='10' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='M6 1.5C4 1.5 2.5 3 2.5 5c0 2.5 3.5 5.5 3.5 5.5S9.5 7.5 9.5 5c0-2-1.5-3.5-3.5-3.5Z'
      stroke='currentColor'
      strokeWidth='1.2'
    />
    <circle cx='6' cy='5' r='1.3' fill='currentColor' />
  </svg>
)

const LoadingState = () => (
  <div className='px-5 lg:px-10 max-w-3xl mx-auto pt-10 space-y-6'>
    <div className='h-72 rounded-glass-lg bg-white/[0.04] border border-white/[0.08] animate-pulse' />
    <div className='h-12 rounded-glass-md bg-white/[0.04] animate-pulse w-2/3' />
    <div className='h-32 rounded-glass-md bg-white/[0.04] animate-pulse' />
  </div>
)
