import { useEffect, useMemo, useRef, useState } from 'react'
import ZoomPanContainer from './ZoomPanContainer'
import type { Options } from 'seatchart'

/**
 * VenuePicker — paso 1 del flujo de compra.
 *
 * Tiene dos modos según los datos disponibles:
 *
 * 1. **Modo SVG** (cuando hay `mapImageSrc` + `areas`): monta el SVG real
 *    del venue (la diseñadora lo provee) y dibuja un overlay con los
 *    polígonos clickeables. Es el modo preferido — fiel al diseño que
 *    aprueba el cliente.
 *
 * 2. **Modo lista** (cuando sólo hay `zones`): renderiza glass cards
 *    apiladas con la zona y el precio. Es el fallback para eventos sin
 *    mapeo geométrico cargado.
 *
 * Ambos modos comparten el mismo `onSelect(area)` para que `SaleV2` no
 * tenga que diferenciar.
 */

export interface VenueZone {
  /** Nombre de la zona/sección (matchea con zone_price.zones key). */
  zone: string
  /** Precio mínimo USD. 0 cuando aún no hay pricing publicado. */
  priceFrom: number
}

export interface VenueArea {
  /** id estable del polígono dentro del SVG. */
  id: string
  /** Título humano (ej. "Stage Left 1"). */
  title: string
  /** Nombre del tier de color/precio (ej. "Blue", "VIP"). */
  name: string
  /** Polygon en coords del viewBox original. */
  polygon: [number, number][]
  /** Color de fill cuando el polygon está visible. */
  fillColor?: string
}

/**
 * Datos enriquecidos que el VenuePicker emite cuando el usuario elige
 * una sección. SeatGrid los consume directamente para evitar el matching
 * heurístico entre `zone_price` y `mapConfig`.
 */
export interface SelectedArea {
  id: string
  title: string
  name: string
  priceFrom: number
  /** Options de Seatchart, presentes cuando vienen del mapConfig. */
  options?: Options
}

interface VenuePickerProps {
  /** Lista de zonas/precios derivada del zone_price.json del evento. */
  zones: VenueZone[]
  /** URL del SVG/PNG del venue (mapConfig.src). */
  mapImageSrc?: string
  /** Polígonos clickeables y sus Options (mapConfig.areas). */
  areas?: VenueArea[]
  /** `Options` por id de area — se inyecta en `SelectedArea` para el SeatGrid. */
  areaOptionsById?: Record<string, Options>
  /**
   * ViewBox del SVG overlay. Default a las dimensiones del legacy
   * `InteractiveMap` (2094×1485). Pasalo cuando el SVG tenga otras.
   */
  mapViewBox?: { width: number; height: number }
  selectedAreaId?: string
  onSelect: (area: SelectedArea) => void
  loading?: boolean
}

type Tier = 'front' | 'orch' | 'mezz' | 'bal'

interface TieredZone extends VenueZone {
  tier: Tier
}

const TIER_COLOR: Record<Tier, string> = {
  front: '#F6C84A',
  orch: '#E879F9',
  mezz: '#F97A4A',
  bal: '#3B82F6'
}

const TIER_LABEL: Record<Tier, string> = {
  front: 'Premium',
  orch: 'Orchestra',
  mezz: 'Mezzanine',
  bal: 'Balcony'
}

const TIER_ORDER: Tier[] = ['front', 'orch', 'mezz', 'bal']

const DEFAULT_VIEWBOX = { width: 2094, height: 1485 }

const tierOfZone = (zone: VenueZone, all: VenueZone[]): Tier => {
  if (all.length === 0) return 'orch'
  const sorted = [...all].sort((a, b) => b.priceFrom - a.priceFrom)
  const idx = sorted.findIndex((z) => z.zone === zone.zone)
  const total = sorted.length
  const ratio = total <= 1 ? 0 : idx / total
  if (ratio < 0.25) return 'front'
  if (ratio < 0.5) return 'orch'
  if (ratio < 0.75) return 'mezz'
  return 'bal'
}

const findPriceFromForName = (
  zones: VenueZone[],
  name: string,
  title: string
): number => {
  // Match por name exacto, luego por title exacto, luego por title contiene
  const lower = name.toLowerCase()
  const titleLower = title.toLowerCase()
  const byName = zones.find((z) => z.zone.toLowerCase() === lower)
  if (byName) return byName.priceFrom
  const byTitle = zones.find((z) => z.zone.toLowerCase() === titleLower)
  if (byTitle) return byTitle.priceFrom
  const byContains = zones.find((z) =>
    z.zone.toLowerCase().includes(lower)
  )
  return byContains?.priceFrom ?? 0
}

export default function VenuePicker(props: VenuePickerProps) {
  const {
    zones,
    mapImageSrc,
    areas,
    areaOptionsById,
    mapViewBox = DEFAULT_VIEWBOX,
    selectedAreaId,
    onSelect,
    loading
  } = props

  const hasMap = Boolean(mapImageSrc && areas && areas.length > 0)

  if (loading) {
    return (
      <div className='w-full'>
        <div
          className={
            hasMap
              ? 'aspect-[16/12] rounded-glass-lg bg-white/[0.04] border border-white/[0.08] animate-pulse'
              : 'space-y-2'
          }
        >
          {!hasMap &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='h-16 rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
              />
            ))}
        </div>
      </div>
    )
  }

  if (hasMap) {
    return (
      <SvgVenuePicker
        zones={zones}
        areas={areas!}
        mapImageSrc={mapImageSrc!}
        areaOptionsById={areaOptionsById}
        mapViewBox={mapViewBox}
        selectedAreaId={selectedAreaId}
        onSelect={onSelect}
      />
    )
  }

  return <ListVenuePicker zones={zones} onSelect={onSelect} />
}

/* ─────────────── Modo SVG (mapa real del venue) ─────────────── */

interface SvgPickerProps {
  zones: VenueZone[]
  areas: VenueArea[]
  mapImageSrc: string
  areaOptionsById?: Record<string, Options>
  mapViewBox: { width: number; height: number }
  selectedAreaId?: string
  onSelect: (area: SelectedArea) => void
}

/**
 * Carga el SVG como texto y le saca los atributos `width`/`height` del
 * root para que escale al 100% del container. Así renderiza vectorial
 * en cualquier zoom — el `<img>` se vería borroso en mobile cuando el
 * usuario hace pinch-zoom.
 */
const fetchInlineSvg = async (src: string): Promise<string> => {
  const r = await fetch(src)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  let text = await r.text()
  // Sólo aceptamos SVG real — si vino HTML por error caemos a fallback.
  if (!/^\s*<\?xml|^\s*<svg/i.test(text)) {
    throw new Error('Response is not SVG')
  }
  text = text
    .replace(/(<svg\b[^>]*?)\s+width="[^"]*"/i, '$1')
    .replace(/(<svg\b[^>]*?)\s+height="[^"]*"/i, '$1')
  return text
}

const SvgVenuePicker = ({
  zones,
  areas,
  mapImageSrc,
  areaOptionsById,
  mapViewBox,
  selectedAreaId,
  onSelect
}: SvgPickerProps) => {
  const [hover, setHover] = useState<string | null>(null)
  const [inlineSvg, setInlineSvg] = useState<string | null>(null)
  const [svgError, setSvgError] = useState(false)
  const svgHostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    setInlineSvg(null)
    setSvgError(false)
    fetchInlineSvg(mapImageSrc)
      .then((text) => {
        if (!cancelled) setInlineSvg(text)
      })
      .catch(() => {
        if (!cancelled) setSvgError(true)
      })
    return () => {
      cancelled = true
    }
  }, [mapImageSrc])

  // El SVG legacy viene con width/height pixel-fixed (2094×1485). Aunque
  // el regex de stripping intenta sacarlos, lo más robusto es post-inject
  // forzar width/height al 100% y preserveAspectRatio en el `<svg>` raíz
  // — así escala vectorialmente al container del ZoomPanContainer.
  useEffect(() => {
    if (!inlineSvg || !svgHostRef.current) return
    const svg = svgHostRef.current.querySelector('svg')
    if (!svg) return
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    if (!svg.hasAttribute('viewBox')) {
      svg.setAttribute(
        'viewBox',
        `0 0 ${mapViewBox.width} ${mapViewBox.height}`
      )
    }
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    ;(svg as unknown as HTMLElement).style.display = 'block'
  }, [inlineSvg, mapViewBox.width, mapViewBox.height])

  const tierByName = useMemo(() => {
    const tiered: TieredZone[] = zones.map((z) => ({
      ...z,
      tier: tierOfZone(z, zones)
    }))
    const map = new Map<string, Tier>()
    for (const t of tiered) map.set(t.zone.toLowerCase(), t.tier)
    return map
  }, [zones])

  const tierPrices = useMemo(() => {
    const out: Record<Tier, number | null> = {
      front: null,
      orch: null,
      mezz: null,
      bal: null
    }
    for (const z of zones) {
      const t = tierByName.get(z.zone.toLowerCase()) ?? 'orch'
      if (out[t] === null || z.priceFrom < out[t]!) out[t] = z.priceFrom
    }
    return out
  }, [zones, tierByName])

  const handlePick = (area: VenueArea) => {
    const priceFrom = findPriceFromForName(zones, area.name, area.title)
    onSelect({
      id: area.id,
      title: area.title,
      name: area.name,
      priceFrom,
      options: areaOptionsById?.[area.id]
    })
  }

  return (
    <div>
      <div className='rounded-glass-lg bg-white/[0.04] border border-white/[0.10] backdrop-blur-glass p-3 lg:p-4'>
        <div className='text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 font-display pt-1.5'>
          STAGE
        </div>
        <div
          aria-hidden
          className='mt-1.5 mx-8 h-1 rounded-pill'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
          }}
        />

        <ZoomPanContainer
          className='mt-2 h-[380px] sm:h-[480px] lg:h-[640px] xl:h-[720px] rounded-glass-md bg-black/30'
          minScale={0.6}
          maxScale={6}
          initialScale={1}
          ariaLabel='Venue map. Pinch or scroll to zoom, drag to pan.'
        >
          <div
            className='relative w-[min(96vw,1100px)]'
            style={{
              aspectRatio: `${mapViewBox.width} / ${mapViewBox.height}`
            }}
          >
            {inlineSvg ? (
              <div
                ref={svgHostRef}
                className='absolute inset-0 w-full h-full'
                style={{ pointerEvents: 'none' }}
                dangerouslySetInnerHTML={{ __html: inlineSvg }}
              />
            ) : svgError ? (
              <img
                src={mapImageSrc}
                alt='Venue map'
                draggable={false}
                className='absolute inset-0 h-full w-full object-contain select-none'
                style={{ pointerEvents: 'none' }}
              />
            ) : (
              <div className='absolute inset-0 grid place-items-center'>
                <div className='font-display text-[11px] uppercase tracking-[0.18em] text-white/40'>
                  Loading venue map…
                </div>
              </div>
            )}
            <svg
              className='absolute inset-0 h-full w-full'
              viewBox={`0 0 ${mapViewBox.width} ${mapViewBox.height}`}
              preserveAspectRatio='xMidYMid meet'
            >
              {areas.map((area) => {
                const isHover = hover === area.id
                const isSelected = selectedAreaId === area.id
                const tier = tierByName.get(area.name.toLowerCase()) ?? 'orch'
                const tierColor = TIER_COLOR[tier]
                const fillColor = area.fillColor || tierColor
                const points = area.polygon
                  .map(([x, y]) => `${x},${y}`)
                  .join(' ')
                return (
                  <g key={area.id} data-no-pan>
                    <polygon
                      points={points}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePick(area)
                      }}
                      onMouseEnter={() => setHover(area.id)}
                      onMouseLeave={() =>
                        setHover((h) => (h === area.id ? null : h))
                      }
                      role='button'
                      aria-label={`${area.title}${
                        zones.length
                          ? `, from $${Math.round(
                              findPriceFromForName(
                                zones,
                                area.name,
                                area.title
                              )
                            )}`
                          : ''
                      }`}
                      aria-pressed={isSelected}
                      style={{
                        cursor: 'pointer',
                        fill: isSelected
                          ? `${fillColor}DD`
                          : isHover
                            ? `${fillColor}99`
                            : `${fillColor}33`,
                        stroke: isSelected
                          ? '#fff'
                          : isHover
                            ? fillColor
                            : `${fillColor}AA`,
                        strokeWidth: isSelected ? 6 : isHover ? 4 : 2,
                        transition: 'all 0.15s'
                      }}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </ZoomPanContainer>

        <div className='text-center text-[10.5px] text-white/55 font-medium mt-2'>
          Tap a section to view its seats
        </div>
      </div>

      <TierLegend tierPrices={tierPrices} />
    </div>
  )
}

/* ─────────────── Modo lista (sin mapa) ─────────────── */

interface ListPickerProps {
  zones: VenueZone[]
  onSelect: (area: SelectedArea) => void
}

const ListVenuePicker = ({ zones, onSelect }: ListPickerProps) => {
  if (zones.length === 0) {
    return (
      <div className='rounded-glass-md bg-white/[0.04] border border-white/[0.08] p-8 text-center'>
        <div className='font-display text-base font-semibold text-white'>
          No sections available
        </div>
        <p className='mt-2 text-sm text-white/55'>
          Ticket pricing is still being loaded.
        </p>
      </div>
    )
  }

  const tiered = zones.map((z) => ({ ...z, tier: tierOfZone(z, zones) }))

  return (
    <div className='space-y-2'>
      <p className='text-[11px] text-white/55 mb-1 px-1'>
        This venue doesn&apos;t have a published seat map. Pick a section
        below.
      </p>
      {tiered.map((zone) => {
        const color = TIER_COLOR[zone.tier]
        return (
          <button
            key={zone.zone}
            type='button'
            onClick={() =>
              onSelect({
                id: zone.zone,
                title: zone.zone,
                name: zone.zone,
                priceFrom: zone.priceFrom
              })
            }
            className='w-full flex items-center gap-3 rounded-glass-md bg-white/[0.05] border border-white/[0.10] px-4 py-3 hover:bg-white/[0.10] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60'
          >
            <span
              aria-hidden
              className='h-4 w-4 rounded shrink-0'
              style={{ background: color }}
            />
            <div className='flex-1 min-w-0 text-left'>
              <div className='font-display text-sm font-semibold text-white tracking-tight'>
                {zone.zone}
              </div>
              <div className='text-[10.5px] text-white/55 mt-0.5'>
                {TIER_LABEL[zone.tier]}
                {zone.priceFrom > 0 && ` · From $${Math.round(zone.priceFrom)}`}
              </div>
            </div>
            <span aria-hidden className='text-white/40'>
              →
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────── Tier legend ─────────────── */

interface TierLegendProps {
  tierPrices: Record<Tier, number | null>
}

const TierLegend = ({ tierPrices }: TierLegendProps) => {
  const visible = TIER_ORDER.filter((t) => tierPrices[t] !== null)
  if (visible.length === 0) return null

  return (
    <div className='mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2'>
      {visible.map((tier) => (
        <div
          key={tier}
          className='flex items-center gap-2.5 rounded-glass-sm bg-white/[0.04] border border-white/[0.10] px-3 py-2.5'
        >
          <span
            aria-hidden
            className='h-3.5 w-3.5 rounded-sm shrink-0'
            style={{ background: TIER_COLOR[tier] }}
          />
          <div className='min-w-0'>
            <div className='font-display text-[12px] font-semibold text-white tracking-tight truncate'>
              {TIER_LABEL[tier]}
            </div>
            <div className='text-[10px] text-white/55 font-display tabular-nums mt-0.5'>
              {tierPrices[tier]! > 0
                ? `From $${Math.round(tierPrices[tier]!)}`
                : 'TBA'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
