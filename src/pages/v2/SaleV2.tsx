import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Options } from 'seatchart'
import LayoutV2 from '../../layouts/LayoutV2'
import StepHeader, { type SaleStep } from '../../components/v2/sale/StepHeader'
import VenuePicker, {
  type SelectedArea,
  type VenueArea,
  type VenueZone
} from '../../components/v2/sale/VenuePicker'
import SeatGrid from '../../components/v2/sale/SeatGrid'
import SaleNoSeatsV2 from './SaleNoSeatsV2'
import { Button, GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { useVenues } from '../../router/venuesContext'
import { cacheService } from '../../services/cacheService'
import { fallbackDataService } from '../../services/fallbackDataService'
import { extractZonePrices } from '../../components/Utils/priceUtils'
import { coverSeed } from '../../lib/covers/coverHash'
import { mapConfig } from '../../components/maps/DataMap'
import type { UIEvent } from '../../types/uiEvent'

interface SaleV2Props {
  /** event_label del evento. */
  eventLabel: string
  /**
   * Hook opcional para sobrescribir el flujo cuando se selecciona un
   * área — útil para _SaleCheck (preview).
   */
  onSelectArea?: (area: SelectedArea) => void
}

interface ZoneEntry {
  zone: string
  prices: { priceBase: number; priceFinal: number }[]
}

interface ResolvedMap {
  src: string
  areas: VenueArea[]
  areaOptionsById: Record<string, Options>
  viewBox: { width: number; height: number }
}

const DEFAULT_MAP_VIEWBOX = { width: 2094, height: 1485 }

const toVenueZones = (list: ZoneEntry[]): VenueZone[] =>
  list
    .map((entry) => {
      const min = entry.prices.length
        ? Math.min(...entry.prices.map((p) => p.priceFinal / 100))
        : 0
      return { zone: entry.zone, priceFrom: min }
    })
    .filter((z) => z.zone)


/**
 * Lee el `mapConfig` del evento y arma la estructura que el VenuePicker
 * necesita: src del SVG, lista de areas con polygons y un map de
 * `Options` por id de area (para inyectar al SeatGrid después).
 *
 * Sólo retorna el primer floor disponible. Cuando un venue tenga
 * varias plantas (ej. india_yuridia.01: orchestra + loge), el cliente
 * podrá elegir desde un selector adicional — fuera del alcance B4b.
 */
const resolveMapFromConfig = (label: string): ResolvedMap | null => {
  const conf = mapConfig[label]
  if (!conf?.zones) return null

  for (const floor of Object.values(conf.zones)) {
    if (!floor?.src || !floor?.defaultMap) continue
    const defaultMap =
      typeof floor.defaultMap === 'function'
        ? floor.defaultMap()
        : floor.defaultMap
    const rawAreas = (defaultMap as { areas?: unknown }).areas as
      | Array<{
          id?: string
          title?: string
          name?: string
          polygon?: [number, number][] | number[][]
          fillColor?: string
          Options?: Options
        }>
      | undefined
    if (!rawAreas || rawAreas.length === 0) continue

    const areas: VenueArea[] = []
    const areaOptionsById: Record<string, Options> = {}
    rawAreas.forEach((area, index) => {
      const id = area.id ?? `area-${index}`
      if (!area.polygon || !area.title || !area.name) return
      areas.push({
        id,
        title: area.title,
        name: area.name,
        polygon: area.polygon as [number, number][],
        fillColor: area.fillColor
      })
      if (area.Options) areaOptionsById[id] = area.Options
    })

    if (areas.length === 0) continue

    return {
      src: floor.src,
      areas,
      areaOptionsById,
      viewBox: DEFAULT_MAP_VIEWBOX
    }
  }

  return null
}

export default function SaleV2({ eventLabel, onSelectArea }: SaleV2Props) {
  const { loading: eventsLoading, byLabel } = useUIEvents()
  const { venues } = useVenues()
  const event = byLabel(eventLabel)
  const venue = event && venues ? venues[event.venueLabel] : null
  const venueHasSeatmap = venue ? venue.seatmap : null

  const [step, setStep] = useState<SaleStep>('venue')
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null)
  const [zonesList, setZonesList] = useState<ZoneEntry[]>([])
  const [zonesLoading, setZonesLoading] = useState(true)

  // Carga zone_price con cache + fallback (igual flow que B3/legacy)
  useEffect(() => {
    if (!eventLabel) return
    let cancelled = false
    setZonesLoading(true)

    const token = import.meta.env.VITE_GITHUB_TOKEN
    const url = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${eventLabel}/zone_price.json`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }

    const load = async () => {
      try {
        if (fallbackDataService.isEmergencyMode()) {
          const local = await fallbackDataService.getLocalZonePrice(eventLabel)
          if (local && !cancelled) setZonesList(extractZonePrices(local))
          return
        }
        const data = await cacheService.fetchWithCache(url, options, {
          ttl: 5 * 60 * 1000
        })
        if (!cancelled) setZonesList(extractZonePrices(data))
      } catch {
        try {
          const local = await fallbackDataService.getLocalZonePrice(eventLabel)
          if (local && !cancelled) setZonesList(extractZonePrices(local))
        } catch {
          if (!cancelled) setZonesList([])
        }
      } finally {
        if (!cancelled) setZonesLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [eventLabel])

  const resolvedMap = useMemo(
    () => (event ? resolveMapFromConfig(event.id) : null),
    [event]
  )

  const venueZones = useMemo(() => toVenueZones(zonesList), [zonesList])

  const handleAreaSelect = (area: SelectedArea) => {
    setSelectedArea(area)
    setStep('seats')
    if (onSelectArea) onSelectArea(area)
  }

  if (eventsLoading || venues === null) {
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <LoadingState />
      </LayoutV2>
    )
  }

  if (!event) {
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <ErrorState
          title='Event not found'
          message='That event is not currently available.'
        />
      </LayoutV2>
    )
  }

  if (venueHasSeatmap === false) {
    return <SaleNoSeatsV2 event={event} />
  }

  const pricingMissing = !zonesLoading && venueZones.length === 0
  const showFallbackToClassic =
    !zonesLoading && !resolvedMap && venueZones.length === 0

  const subtitle = `${event.day}, ${event.month} ${event.date}${event.time ? ` · ${event.time}` : ''} · ${event.venueName}`

  return (
    <LayoutV2
      hideHeader
      hideFooter
      hideMobileTabBar
      meshSeed={(coverSeed(event.id) % 8) + 2}
    >
      <StepHeader
        step={step}
        title={event.title}
        subtitle={subtitle}
        onBack={step === 'seats' ? () => setStep('venue') : undefined}
        eventLabel={event.id}
      />

      {step === 'venue' ? (
        <main className='mx-auto max-w-6xl px-4 lg:px-10 py-5 lg:py-8'>
          <HoldBanner />
          {showFallbackToClassic ? (
            <NoZonesFallback event={event} />
          ) : (
            <>
              {pricingMissing && resolvedMap && <PricingMissingBanner />}
              {!resolvedMap && !pricingMissing && <MapMissingBanner />}
              <div className='mt-4'>
                <VenuePicker
                  zones={venueZones}
                  loading={zonesLoading}
                  mapImageSrc={resolvedMap?.src}
                  areas={resolvedMap?.areas}
                  areaOptionsById={resolvedMap?.areaOptionsById}
                  mapViewBox={resolvedMap?.viewBox}
                  selectedAreaId={selectedArea?.id}
                  onSelect={handleAreaSelect}
                />
              </div>
            </>
          )}
          {resolvedMap && <ShortcutHints />}
        </main>
      ) : selectedArea ? (
        <main className='mx-auto max-w-6xl px-4 lg:px-10 py-5 lg:py-8'>
          <SeatGrid
            event={event}
            selectedArea={selectedArea}
            onBack={() => setStep('venue')}
          />
        </main>
      ) : null}
    </LayoutV2>
  )
}

const HoldBanner = () => (
  <div
    className='flex items-center gap-2.5 rounded-glass-md border border-brand-hi/22 px-3 py-2.5 backdrop-blur-glass-strong'
    style={{ background: 'rgba(212,168,240,0.10)' }}
  >
    <span
      aria-hidden
      className='h-1.5 w-1.5 rounded-full bg-accent-coral shadow-[0_0_8px_var(--accent-coral)]'
    />
    <span className='text-[11.5px] text-white/75'>
      <strong className='text-white font-semibold'>Pick a section.</strong>{' '}
      The hold timer starts once you select your first seat.
    </span>
  </div>
)

const ShortcutHints = () => (
  <div className='mt-3 hidden md:flex items-center justify-center gap-3 text-[10.5px] text-white/40 font-display'>
    <Shortcut keys={['Scroll']} desc='zoom' />
    <Shortcut keys={['Drag']} desc='pan' />
    <Shortcut keys={['Pinch']} desc='zoom on touch' />
  </div>
)

const Shortcut = ({ keys, desc }: { keys: string[]; desc: string }) => (
  <span className='inline-flex items-center gap-1.5'>
    {keys.map((k) => (
      <kbd
        key={k}
        className='inline-block rounded-md bg-white/[0.06] border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider'
      >
        {k}
      </kbd>
    ))}
    <span>{desc}</span>
  </span>
)

const LoadingState = () => (
  <div className='mx-auto max-w-3xl px-4 py-10 space-y-4'>
    <div className='h-14 rounded-glass-md bg-white/[0.04] animate-pulse' />
    <div className='h-[340px] rounded-glass-lg bg-white/[0.04] animate-pulse' />
  </div>
)

const ErrorState = ({
  title,
  message
}: {
  title: string
  message: string
}) => (
  <div className='mx-auto max-w-md px-4 py-16 text-center'>
    <GlassCard depth='md' radius='lg' className='p-8'>
      <div className='font-display text-lg font-semibold text-white'>
        {title}
      </div>
      <p className='mt-2 text-sm text-white/55'>{message}</p>
    </GlassCard>
  </div>
)

const PricingMissingBanner = () => (
  <div
    className='mt-3 flex items-center gap-2.5 rounded-glass-md border border-accent-coral/30 px-3.5 py-2.5 backdrop-blur-glass-strong'
    style={{ background: 'rgba(255, 177, 200, 0.10)' }}
  >
    <span
      aria-hidden
      className='h-1.5 w-1.5 rounded-full bg-accent-coral shadow-[0_0_8px_var(--accent-coral)]'
    />
    <p className='text-[11.5px] text-white/80 leading-relaxed'>
      <strong className='text-white font-semibold'>Preview mode.</strong>{' '}
      Pricing for this event hasn&apos;t been published yet — sections come
      from the venue map only.
    </p>
  </div>
)

const MapMissingBanner = () => (
  <div
    className='mt-3 flex items-center gap-2.5 rounded-glass-md border border-white/[0.12] px-3.5 py-2.5 backdrop-blur-glass-strong'
    style={{ background: 'rgba(255,255,255,0.04)' }}
  >
    <span
      aria-hidden
      className='h-1.5 w-1.5 rounded-full bg-white/55'
    />
    <p className='text-[11.5px] text-white/70 leading-relaxed'>
      No seat map is published for this venue yet — pick a section from the
      list below.
    </p>
  </div>
)

interface NoZonesFallbackProps {
  event: UIEvent
}

const NoZonesFallback = ({ event }: NoZonesFallbackProps) => {
  const navigate = useNavigate()
  return (
    <GlassCard depth='md' radius='lg' className='p-6 lg:p-8 text-center mt-4'>
      <div className='mx-auto h-12 w-12 rounded-glass-sm bg-accent-coral/15 grid place-items-center mb-3'>
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' aria-hidden>
          <path
            d='M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-accent-coral'
          />
        </svg>
      </div>
      <h3 className='font-display text-base font-semibold text-white'>
        Tickets not available right now
      </h3>
      <p className='mt-2 text-[12.5px] text-white/65 max-w-md mx-auto leading-relaxed'>
        We couldn&apos;t load ticket zones for{' '}
        <span className='font-semibold text-white'>{event.title}</span>. This is
        usually temporary — try again in a moment, or reach out and we&apos;ll
        help.
      </p>
      <div className='mt-5'>
        <Button
          variant='primary'
          size='md'
          onClick={() => navigate('/footer/contact')}
        >
          Contact support
        </Button>
      </div>
    </GlassCard>
  )
}
