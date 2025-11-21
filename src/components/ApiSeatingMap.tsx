/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState, useRef } from 'react'
import { API_URLS } from '../config/api'
import SeatSelectionModal from './SeatSelectionModal'

interface SeatingMapResponse {
  event_id: string | number
  map_type: string
  svg_url: string
  ranges_url?: string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
interface SeatItem {
  id: number
  event_id: number
  title: string
  position: string
  section: string | null
  row: string
  seat_number: string | number
  price_range: string
  price: number
  is_available: boolean
  is_sold_out: boolean
  seat_key: string
  seat_key_alt: string
  status: string
}

type ProceedArgs = {
  seats: SeatItem[]
  selectionLabel: string
  row?: string | null
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ProceedCallback = (args: ProceedArgs) => void

interface ApiSeatingMapProps {
  eventId: string
  mapType?: string | null
  filters?: Partial<{
    position: string
    section: string
    price_range: string
    row: string
    seat_number: string
  }>
  onProceed?: ProceedCallback
}
/* eslint-enable @typescript-eslint/no-unused-vars */

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}

export default function ApiSeatingMap({
  eventId,
  mapType,
  filters,
  onProceed
}: ApiSeatingMapProps) {
  // map metadata is fetched but not stored to avoid unused state
  const [svgContent, setSvgContent] = useState<string>('')
  const [seats, setSeats] = useState<SeatItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [ranges, setRanges] = useState<
    Record<
      string,
      {
        ranges: Array<{ start: number; end: number }>
        rows: string[]
        position?: string
        color?: string
        zone?: string
      }
    >
  >({})
  const [hoverInfo, setHoverInfo] = useState<{
    label: string
    total: number
    available: number
    isSeatLevel?: boolean
    isLoadingGroup?: boolean
  } | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<SeatItem[]>([])
  const [selectedSeatIds, setSelectedSeatIds] = useState<Record<string, boolean>>({})
  const [showSeatModal, setShowSeatModal] = useState<boolean>(false)
  const [seatsByRow, setSeatsByRow] = useState<Record<string, SeatItem[]>>({})
  const [stageDirection, setStageDirection] = useState<'north' | 'south' | 'east' | 'west'>('north')
  const lastFetchedGroupRef = useRef<string | null>(null)
  const availabilityCacheRef = useRef<Record<string, { total: number; available: number }>>({})

  const toTitleCaseFromKebab = (value: string): string => {
    return value
      .split('-')
      .filter(Boolean)
      .map(w => {
        if (w.length === 0) return w
        // Manejar casos especiales como "rightcenter" -> "Right Center"
        if (w === 'rightcenter') return 'Right Center'
        if (w === 'leftcenter') return 'Left Center'
        if (w === 'center') return 'Center'
        if (w === 'left') return 'Left'
        if (w === 'right') return 'Right'
        // Para colores
        if (w === 'orange') return 'Orange'
        if (w === 'blue') return 'Blue'
        if (w === 'green') return 'Green'
        if (w === 'red') return 'Red'
        // Caso general: capitalizar primera letra
        return w[0].toUpperCase() + w.slice(1)
      })
      .join(' ')
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const seatingMapUrl = `${API_URLS.PUBLIC_EVENTS}${eventId}/seating-map` // GET seating map meta
        const map = await fetchJson<SeatingMapResponse>(seatingMapUrl, {
          headers: {
            Accept: 'application/json'
          }
        })
        if (!isMounted) return

        // Fetch SVG as text so we can inline it and attach events
        // In dev, route through Vite proxy to avoid CORS
        const makeProxiedUrl = (raw: string) => {
          try {
            const u = new URL(raw, window.location.href)
            if (import.meta.env.DEV && (u.hostname === '127.0.0.1' || u.hostname === 'localhost')) {
              return `/api${u.pathname}${u.search}`
            }
            // if (u.hostname === 'ticketsaverapi.strangled.net') {
            //   // Remove /api prefix if it exists to avoid double prefixing
            //   const cleanPath = u.pathname.startsWith('/api') ? u.pathname.substring(4) : u.pathname
            //   return `/api${cleanPath}${u.search}`
            // }
            return raw
          } catch {
            return raw
          }
        }
        const svgUrl = makeProxiedUrl(map.svg_url)
        const svgRes = await fetch(svgUrl)
        if (!svgRes.ok) throw new Error('Failed to fetch SVG')
        const svgText = await svgRes.text()
        if (!isMounted) return
        setSvgContent(svgText)

        // Fetch ranges if provided
        if (map.ranges_url) {
          const rangesUrl = makeProxiedUrl(map.ranges_url)
          const rangesRes = await fetch(rangesUrl, { headers: { Accept: 'application/json' } })
          if (!rangesRes.ok) throw new Error('Failed to fetch ranges json')
          const rangesJson = (await rangesRes.json()) as Record<string, string>

          const parseRowsSpec = (spec: string): string[] => {
            // spec may be like "B-C" or "H-J-K-L-M"
            const parts = spec.split('-').filter(Boolean)
            if (parts.length === 2 && parts[0].length === 1 && parts[1].length === 1) {
              const start = parts[0].charCodeAt(0)
              const end = parts[1].charCodeAt(0)
              const rows: string[] = []
              for (let c = Math.min(start, end); c <= Math.max(start, end); c++)
                rows.push(String.fromCharCode(c))
              return rows
            }
            return parts
          }

          const parsed: Record<
            string,
            {
              ranges: Array<{ start: number; end: number }>
              rows: string[]
              position?: string
              color?: string
              zone?: string
            }
          > = {}
          for (const [label, value] of Object.entries(rangesJson)) {
            // Handle metadata object
            if (label === 'metadata' && typeof value === 'object' && value !== null) {
              const metadata = value as { stage_direction?: string }
              if (
                metadata.stage_direction &&
                ['north', 'south', 'east', 'west'].includes(metadata.stage_direction)
              ) {
                setStageDirection(metadata.stage_direction as 'north' | 'south' | 'east' | 'west')
              }
              continue
            }

            // Skip non-string values
            if (typeof value !== 'string') {
              continue
            }

            // value can be like "1-16 | 101-122"
            const subranges = value
              .split('|')
              .map(v => v.trim())
              .filter(Boolean)
              .map(v => {
                const [a, b] = v.split('-').map(s => parseInt(s.trim(), 10))
                return { start: Math.min(a, b), end: Math.max(a, b) }
              })
              .filter(r => Number.isFinite(r.start) && Number.isFinite(r.end))

            // label patterns:
            // - section-color-row (e.g., center-orange-H)
            // - row-color (e.g., B-lgreen)
            // - row only (e.g., B)
            const parts = label.split('-').filter(Boolean)
            let position: string | undefined
            let color: string | undefined
            let rows: string[] = []
            let zone: string | undefined
            if (parts.length >= 3) {
              position = parts[0]
              color = parts[1]
              // soportar etiquetas con sub-sección, p. ej.: left-purple-balcony-H
              let rest = parts.slice(2)
              // detectar y extraer "balcony" como zona, no como fila
              const balconyIdx = rest.findIndex(p => p.toLowerCase() === 'balcony')
              if (balconyIdx !== -1) {
                zone = 'balcony'
                rest = rest.filter((_, i) => i !== balconyIdx)
              }
              rows = parseRowsSpec(rest.join('-'))
            } else if (parts.length === 2) {
              // Treat as row-color, no section
              const rowPart = parts[0]
              color = parts[1]
              rows = [rowPart.toUpperCase()]
            } else if (parts.length === 1) {
              rows = parseRowsSpec(parts[0])
            }

            parsed[label] = { ranges: subranges, rows, position, color, zone }
          }
          if (isMounted) setRanges(parsed)
        }

        // Fetch seats (paginated could be added later; for now assume server supports per_page big or we filter client-side)
        const qs = new URLSearchParams()
        if (filters?.position) qs.set('position', filters.position)
        if (filters?.section) qs.set('section', filters.section)
        if (filters?.price_range) qs.set('price_range', filters.price_range)
        if (filters?.row) qs.set('row', filters.row)
        if (filters?.seat_number) qs.set('seat_number', filters.seat_number)
        const seatsUrl = `${API_URLS.PUBLIC_EVENTS}${eventId}/seats${qs.toString() ? `?${qs.toString()}` : ''}`
        const seatsData = await fetchJson<{
          data?: SeatItem[]
          results?: SeatItem[]
          items?: SeatItem[]
        }>(seatsUrl, {
          headers: {
            Accept: 'application/json'
          }
        })
        if (!isMounted) return
        const list = (seatsData.data || seatsData.results || seatsData.items || []) as SeatItem[]
        setSeats(list)
      } catch (e: unknown) {
        if (!isMounted) return
        const message = e instanceof Error ? e.message : 'Error loading seating map'
        setError(message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [
    eventId,
    mapType,
    filters?.position,
    filters?.section,
    filters?.price_range,
    filters?.row,
    filters?.seat_number
  ])

  const sectionStats = useMemo(() => {
    const bySection: Record<string, { total: number; available: number; position?: string }> = {}
    for (const s of seats) {
      const sectionKey = s.section || s.position || 'unknown'
      if (!bySection[sectionKey])
        bySection[sectionKey] = { total: 0, available: 0, position: s.position }
      bySection[sectionKey].total += 1
      if (s.is_available === true && s.is_sold_out !== true) bySection[sectionKey].available += 1
    }
    return bySection
  }, [seats])

  // Attach hover listeners after SVG is injected
  useEffect(() => {
    if (!svgContent) return
    const container = document.getElementById('inline-seating-svg-container')
    if (!container) return

    // naive mapping: look for elements with data-section or id as section key
    const root = container.querySelector('svg')
    if (!root) return

    // Asegurar que el SVG completo sea visible: si no hay viewBox, calcularlo
    try {
      const svgRoot = root as SVGSVGElement
      if (!svgRoot.getAttribute('viewBox')) {
        const bbox = svgRoot.getBBox()
        if (
          bbox &&
          isFinite(bbox.width) &&
          isFinite(bbox.height) &&
          bbox.width > 0 &&
          bbox.height > 0
        ) {
          svgRoot.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
        }
      }
      svgRoot.style.overflow = 'visible'
    } catch (_) {
      // ignorar errores de getBBox en algunos SVGs
    }

    const computeStatsForRangeKey = (key: string, rowOnly?: string) => {
      const def = ranges[key]
      if (!def) return null
      const rowsToCount = rowOnly && def.rows.includes(rowOnly) ? [rowOnly] : def.rows
      const totalPerRow = def.ranges.reduce((sum, r) => sum + (r.end - r.start + 1), 0)
      const total = totalPerRow * rowsToCount.length
      const available = seats.reduce((acc, s) => {
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        const row = (s.row || '').toString().toUpperCase()
        if (!rowsToCount.includes(row)) return acc
        const inAnyRange = def.ranges.some(r => seatNum >= r.start && seatNum <= r.end)
        if (inAnyRange) {
          return acc + (s.is_available === true && s.is_sold_out !== true ? 1 : 0)
        }
        return acc
      }, 0)
      return { total, available }
    }

    const computeSeatsForRangeKey = (key: string, rowOnly?: string) => {
      const def = ranges[key]
      if (!def) return []
      const rowsToCount = rowOnly && def.rows.includes(rowOnly) ? [rowOnly] : def.rows
      return seats.filter(s => {
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        const row = (s.row || '').toString().toUpperCase()
        const inAnyRange = def.ranges.some(r => seatNum >= r.start && seatNum <= r.end)
        return (
          s.is_available === true &&
          s.is_sold_out !== true &&
          rowsToCount.includes(row) &&
          inAnyRange
        )
      })
    }

    // Map para recordar estilos originales de elementos seleccionados
    const selectedVisuals = new WeakMap<
      SVGElement,
      {
        prevStroke: string
        prevStrokeWidth: string
        prevOpacity: string
        prevFilter?: string
        prevStrokeLinecap?: string
        prevStrokeLinejoin?: string
        prevFill?: string
        prevFillOpacity?: string
      }
    >()

    // Overlays de check para asientos seleccionados
    const selectedOverlays = new WeakMap<SVGElement, SVGElement>()

    const ensureOverlayLayer = (): SVGGElement | null => {
      try {
        const svgRoot = root as SVGSVGElement
        let layer = svgRoot.querySelector('#ts-selection-overlays') as SVGGElement | null
        if (!layer) {
          layer = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement
          layer.setAttribute('id', 'ts-selection-overlays')
          layer.setAttribute('pointer-events', 'none')
          svgRoot.appendChild(layer)
        }
        return layer
      } catch (_) {
        return null
      }
    }

    // Group by position-color (e.g., center-orange)
    const rangeKeyToGroupKey: Record<string, string> = {}
    const groupKeyToRangeKeys: Record<string, string[]> = {}
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      if (def.position && def.color) {
        const gk = `${def.position}-${def.color}${def.zone ? `-${def.zone}` : ''}`
        rangeKeyToGroupKey[rangeKey] = gk
        if (!groupKeyToRangeKeys[gk]) groupKeyToRangeKeys[gk] = []
        groupKeyToRangeKeys[gk].push(rangeKey)
      }
    })

    const computeStatsForGroupKey = (groupKey: string) => {
      console.debug('Compute stats for group key', {
        groupKey,
        mappedRangeKeys: groupKeyToRangeKeys[groupKey]
      })
      const rKeys = groupKeyToRangeKeys[groupKey]
      if (!rKeys || rKeys.length === 0) return null
      // total seats is the sum across all range definitions in this group
      let total = 0
      for (const k of rKeys) {
        const def = ranges[k]
        if (!def) continue
        const totalPerRow = def.ranges.reduce((sum, r) => sum + (r.end - r.start + 1), 0)
        total += totalPerRow * def.rows.length
      }
      // available seats: unique seats that match any range in the group
      const seen = new Set<string>()
      let available = 0
      for (const s of seats) {
        if (!(s.is_available === true && s.is_sold_out !== true)) continue
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        const row = (s.row || '').toString().toUpperCase()
        for (const k of rKeys) {
          const def = ranges[k]
          if (!def) continue
          if (!def.rows.includes(row)) continue
          const inAnyRange = def.ranges.some(r => seatNum >= r.start && seatNum <= r.end)
          if (inAnyRange) {
            const id = `${row}-${seatNum}`
            if (!seen.has(id)) {
              available += 1
              seen.add(id)
            }
            break
          }
        }
      }

      const seatsInGroup = seats.filter(s => {
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        const row = (s.row || '').toString().toUpperCase()
        return rKeys.some(k => {
          const def = ranges[k]
          if (!def) return false
          if (!def.rows.includes(row)) return false
          return def.ranges.some(r => seatNum >= r.start && seatNum <= r.end)
        })
      })

      console.log('Local calculation for', groupKey, ':', {
        rKeys,
        total,
        available,
        seatsInGroup: seatsInGroup.length,
        allSeats: seats.length,
        seatsInGroupDetails: seatsInGroup.map(s => ({
          row: s.row,
          seat_number: s.seat_number,
          is_available: s.is_available,
          is_sold_out: s.is_sold_out
        }))
      })

      return { total, available }
    }

    // Nueva función para obtener disponibilidad en tiempo real
    const fetchRealtimeAvailability = async (groupKey: string) => {
      try {
        const availabilityUrl = API_URLS.getSeatsAvailability(eventId, groupKey)
        const response = await fetch(availabilityUrl, {
          headers: {
            Accept: 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Realtime availability data:', data)
          const stats = {
            total: data.total || 0,
            available: data.available || 0
          }
          availabilityCacheRef.current[groupKey] = stats
          return stats
        }
      } catch (error) {
        console.warn('Error fetching realtime availability:', error)
      }

      // Fallback a cálculo local si falla la API
      const fallback = computeStatsForGroupKey(groupKey)
      if (fallback) {
        availabilityCacheRef.current[groupKey] = fallback
      }
      return fallback
    }

    const getLastNonNumericToken = (tokens: string[]): string | undefined => {
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (!/^\d+$/.test(tokens[i])) return tokens[i]
      }
      return undefined
    }

    const parseElementId = (
      rawId: string
    ): {
      rangeKeyGuess?: string
      row?: string
      seatNumber?: number
      mode: 'section' | 'row' | 'unknown'
    } => {
      const id = rawId.trim()
      if (!id) return { mode: 'unknown' }
      const parts = id.split('-').filter(Boolean)
      const numericTokens = parts.filter(p => /^\d+$/.test(p))
      const seatNumber =
        numericTokens.length > 0 ? parseInt(numericTokens[numericTokens.length - 1], 10) : undefined

      // Heuristic: if first token looks like a row (<=2 letters), treat as row mode
      const looksLikeRowToken = /^[A-Za-z]{1,2}$/.test(parts[0] || '')

      if (parts.length >= 3 && !looksLikeRowToken) {
        // section-color-row(-seat?)
        const rowToken = getLastNonNumericToken(parts.slice(2)) || parts[2]
        const rangeKeyGuess = [parts[0], parts[1], rowToken].join('-')
        return { rangeKeyGuess, row: rowToken.toUpperCase(), seatNumber, mode: 'section' }
      }

      if (parts.length >= 2 && looksLikeRowToken) {
        // row-color(-seat?)
        const rowToken = parts[0]
        const rangeKeyGuess = [parts[0], parts[1]].join('-')
        return { rangeKeyGuess, row: rowToken.toUpperCase(), seatNumber, mode: 'row' }
      }

      if (parts.length === 1 && looksLikeRowToken) {
        return { rangeKeyGuess: parts[0], row: parts[0].toUpperCase(), seatNumber, mode: 'row' }
      }
      return { mode: 'unknown' }
    }

    const handleEnter = (key: string, ev?: MouseEvent, elForFallback?: Element) => {
      // Derive details from event/element id
      const targetId = (
        (ev?.target as HTMLElement)?.id ||
        (elForFallback as HTMLElement | undefined)?.id ||
        ''
      ).toString()
      const parsed = parseElementId(targetId)
      console.debug('Parsed element id for hover', { targetId, parsed, key })

      // Seat-level hover: show A1 available / no available
      if (parsed.mode !== 'unknown' && parsed.row && typeof parsed.seatNumber === 'number') {
        const seat = seats.find(s => {
          const num =
            typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number
          const row = (s.row || '').toString().toUpperCase()
          return row === parsed.row && num === parsed.seatNumber
        })
        const isAvailable = !!(seat && seat.is_available === true && seat.is_sold_out !== true)
        setHoverInfo({
          label: `${parsed.row}${parsed.seatNumber}`,
          total: 1,
          available: isAvailable ? 1 : 0,
          isSeatLevel: true
        })
        if (ev && container) {
          const rect = container.getBoundingClientRect()
          setTooltipPos({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
          setTooltipVisible(true)
        }
        return
      }

      // Group-level hover: if this key belongs to a position-color group, show aggregated stats
      const groupKey = rangeKeyToGroupKey[key]
      console.log(
        'Hover key:',
        key,
        'Group key:',
        groupKey,
        'Last fetched:',
        lastFetchedGroupRef.current
      )
      if (groupKey) {
        // Mostrar tooltip inmediatamente en la posición actual del puntero
        if (ev && container) {
          const rect = container.getBoundingClientRect()
          setTooltipPos({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
          setTooltipVisible(true)
        }

        const cached = availabilityCacheRef.current[groupKey]

        if (cached) {
          // Si ya tenemos datos del endpoint (o fallback) en caché, los usamos siempre.
          setHoverInfo({
            label: toTitleCaseFromKebab(groupKey),
            total: cached.total,
            available: cached.available,
            isLoadingGroup: false
          })
        } else {
          // Si todavía no tenemos datos, mostrar estado "loading" en el tooltip.
          setHoverInfo({
            label: toTitleCaseFromKebab(groupKey),
            total: 0,
            available: 0,
            isLoadingGroup: true
          })
        }

        // Llamar al endpoint solo si el grupo ha cambiado y aún no tenemos datos cacheados.
        if (!cached && groupKey !== lastFetchedGroupRef.current) {
          if (lastFetchedGroupRef.current && lastFetchedGroupRef.current !== groupKey) {
            console.log('Group changed from', lastFetchedGroupRef.current, 'to', groupKey)
          }
          lastFetchedGroupRef.current = groupKey
          console.log('Fetching realtime data for new group:', groupKey)

          fetchRealtimeAvailability(groupKey)
            .then(realtimeStats => {
              if (realtimeStats) {
                setHoverInfo({
                  label: toTitleCaseFromKebab(groupKey),
                  total: realtimeStats.total,
                  available: realtimeStats.available,
                  isLoadingGroup: false
                })
              }
            })
            .catch(error => {
              console.warn('Error updating realtime availability:', error)
            })
        } else if (cached) {
          console.log('Using cached availability for group:', groupKey, cached)
        } else {
          console.log('Same group, skipping API call:', groupKey)
        }

        return
      }

      // Prefer ranges mapping when available; allow row-specific aggregation
      const rowCandidate = parsed.row
      const rangeStats = computeStatsForRangeKey(key, rowCandidate)
      if (rangeStats) {
        const displayLabel = rowCandidate || key
        setHoverInfo({
          label: displayLabel,
          total: rangeStats.total,
          available: rangeStats.available
        })
        if (ev && container) {
          const rect = container.getBoundingClientRect()
          setTooltipPos({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
          setTooltipVisible(true)
        }
        return
      }
      const stats = sectionStats[key]
      if (stats) {
        const displayLabel = rowCandidate || key
        setHoverInfo({ label: displayLabel, total: stats.total, available: stats.available })
        if (ev && container) {
          const rect = container.getBoundingClientRect()
          setTooltipPos({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
          setTooltipVisible(true)
        }
      }
    }

    const sectionSelectors: Array<[string, Element[]]> = []
    const keys = new Set<string>([...Object.keys(sectionStats), ...Object.keys(ranges)])

    const findElementsForKey = (key: string): Element[] => {
      const matches: Element[] = []
      // Prefer explicit data attributes when present
      root.querySelectorAll(`[data-range-key="${key}"]`).forEach(el => matches.push(el))
      root.querySelectorAll(`[data-section="${key}"]`).forEach(el => matches.push(el))
      // Exact id match
      root.querySelectorAll(`#${CSS.escape(key)}`).forEach(el => matches.push(el))
      // Exact class match
      try {
        root.querySelectorAll(`.${CSS.escape(key)}`).forEach(el => matches.push(el))
      } catch (_) {
        // ignore CSS.escape issues
      }
      // Prefix id match (for seat-level nodes like B-lgreen-101)
      try {
        root.querySelectorAll(`[id^="${key}-"]`).forEach(el => matches.push(el))
      } catch (_) {
        // ignore CSS.escape issues on some environments
        root.querySelectorAll('[id]').forEach(el => {
          const id = ((el as HTMLElement).id || '').toLowerCase()
          if (id.startsWith(`${key.toLowerCase()}-`)) matches.push(el)
        })
      }
      // Prefix class token match (e.g., left-purple-H-41 where class contains left-purple-H)
      root.querySelectorAll('[class]').forEach(el => {
        const tokens = Array.from((el as HTMLElement).classList || [])
        const lowerTokens = tokens.map(t => t.toLowerCase())
        const kLower = key.toLowerCase()
        if (lowerTokens.some(t => t === kLower || t.startsWith(`${kLower}-`))) {
          matches.push(el)
        }
      })
      if (matches.length > 0) return matches
      // Case-insensitive id fallback
      const lower = key.toLowerCase()
      root.querySelectorAll('[id]').forEach(el => {
        const id = (el as HTMLElement).id || ''
        if (id && id.toLowerCase() === lower) matches.push(el)
      })
      return matches
    }

    // Build a local index to map position-color-row => range key
    const rowKeyIndex: Record<string, string> = {}
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      const pos = (def.position || '').toLowerCase()
      const color = (def.color || '').toLowerCase()
      def.rows.forEach(r => {
        const idx = [pos, color, r.toLowerCase()].filter(Boolean).join('-')
        rowKeyIndex[idx] = rangeKey
      })
    })

    // First, add direct matches
    for (const key of keys) {
      const matches = findElementsForKey(key)
      if (matches.length > 0) sectionSelectors.push([key, matches])
    }

    // Then, map id patterns like left-purple-N to a ranges key using rowKeyIndex
    let idPatternBindings = 0
    root.querySelectorAll('[id]').forEach(el => {
      const id = (el as HTMLElement).id
      if (!id) return
      const lower = id.toLowerCase()
      if ((keys as Set<string>).has(lower)) return
      const parts = lower.split('-')
      if (parts.length >= 3) {
        const pos = parts[0]
        const color = parts[1]
        // tomar la última parte NO numérica como fila (maneja ...-H-41)
        const nonNumericFromRest = (() => {
          for (let i = parts.length - 1; i >= 2; i--) {
            if (!/^\d+$/.test(parts[i])) return parts[i]
          }
          return parts[2]
        })()
        const rowLetter = nonNumericFromRest
        const keyPrefix = [pos, color, rowLetter].join('-')
        const mapped = rowKeyIndex[keyPrefix]
        if (mapped) sectionSelectors.push([mapped, [el]])
        if (mapped) idPatternBindings += 1
      }
      // NUEVO: id en formato row-color(-seat): MM-yellow-1
      if (parts.length >= 2) {
        const rowToken = parts[0]
        const colorToken = parts[1]
        if (/^[a-z]{1,2}$/.test(rowToken)) {
          const candidate = `${rowToken.toUpperCase()}-${colorToken}`
          if (ranges[candidate]) {
            console.debug('ID mapping (row-color[-seat]) matched', { id, candidate })
            sectionSelectors.push([candidate, [el]])
            idPatternBindings += 1
          }
        }
      }
    })
    console.debug('SeatingMap: id-pattern bindings added', { count: idPatternBindings })

    // Map class token patterns like left-purple(-balcony)-N to a ranges key
    let classPatternBindings = 0
    root.querySelectorAll('[class]').forEach(el => {
      const classList = Array.from((el as HTMLElement).classList || [])
      for (const cls of classList) {
        const lower = (cls || '').toLowerCase()
        if (!lower) continue
        const parts = lower.split('-')
        if (parts.length >= 3) {
          const positions = new Set(['left', 'right', 'center', 'leftcenter', 'rightcenter'])
          const colors = new Set(['orange', 'cyan', 'red', 'green', 'purple', 'blue'])

          // 1) Caso original: position-color-(-zone)-row
          {
            const pos = parts[0]
            const color = parts[1]
            // soportar posible zona intermedia (p. ej., balcony)
            let startIdx = 2
            if (parts[2] === 'balcony') {
              startIdx = 3
            }
            const nonNumericFromRest = (() => {
              for (let i = parts.length - 1; i >= startIdx; i--) {
                if (!/^\d+$/.test(parts[i])) return parts[i]
              }
              return parts[startIdx]
            })()
            const rowLetter = nonNumericFromRest
            const keyPrefix = [pos, color, rowLetter].join('-')
            const mapped = rowKeyIndex[keyPrefix]
            if (mapped) {
              console.debug('Class mapping (pos-color-row) matched', { cls, keyPrefix, mapped })
              sectionSelectors.push([mapped, [el]])
              classPatternBindings += 1
              break
            }
          }

          // 2) Nuevo: row-color-position (ej.: L-cyan-rightcenter)
          {
            const rowToken = parts.find(p => /^[a-z]{1,2}$/.test(p))
            const colorToken = parts.find(p => colors.has(p))
            const positionToken = parts.find(p => positions.has(p))
            if (rowToken && colorToken && positionToken) {
              const keyPrefix = [positionToken, colorToken, rowToken].join('-')
              const mapped = rowKeyIndex[keyPrefix]
              if (mapped) {
                console.debug('Class mapping (row-color-position) matched', {
                  cls,
                  keyPrefix,
                  mapped
                })
                sectionSelectors.push([mapped, [el]])
                classPatternBindings += 1
                break
              } else {
                console.debug('Class mapping (row-color-position) not found in index', {
                  cls,
                  keyPrefix
                })
              }
            }
          }
        }
      }
    })
    console.debug('SeatingMap: class-pattern bindings added', { count: classPatternBindings })

    // Fallback robusto: combinar tokens sueltos de classList (pos, color, zone, row)
    // Útil cuando las clases vienen separadas por espacios y no por guiones
    let classTokenBindings = 0
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      if (!def.position || !def.color) return
      const posTok = def.position.toLowerCase()
      const colorTok = def.color.toLowerCase()
      const zoneTok = def.zone ? def.zone.toLowerCase() : undefined
      def.rows.forEach(r => {
        const rowTok = r.toLowerCase()
        root.querySelectorAll('[class]').forEach(el => {
          const cl = (el as HTMLElement).classList
          if (!cl) return
          const hasPos = cl.contains(posTok)
          const hasColor = cl.contains(colorTok)
          const hasZone = zoneTok ? cl.contains(zoneTok) : true
          const hasRow = cl.contains(rowTok)
          if (hasPos && hasColor && hasZone && hasRow) {
            sectionSelectors.push([rangeKey, [el]])
            classTokenBindings += 1
          }
        })
      })
    })
    console.debug('SeatingMap: class-token bindings added', { count: classTokenBindings })

    // Additional mapping for row-color prefixes (e.g., B-lgreen-101)
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      if (!def.color || def.position) return
      def.rows.forEach(r => {
        const prefix = `${r.toLowerCase()}-${def.color!.toLowerCase()}-`
        root.querySelectorAll('[id]').forEach(el => {
          const id = (el as HTMLElement).id || ''
          if (id.toLowerCase().startsWith(prefix)) {
            sectionSelectors.push([rangeKey, [el]])
          }
        })
      })
    })

    // Build indices to find elements by key and group
    console.debug('SeatingMap: total sectionSelectors before dedupe', {
      count: sectionSelectors.length
    })
    const keyToEls = new Map<string, Element[]>()
    for (const [k, els] of sectionSelectors) {
      const acc = keyToEls.get(k) || []
      els.forEach(el => {
        if (!acc.includes(el)) acc.push(el)
      })
      keyToEls.set(k, acc)
    }
    console.log('SeatingMap: keyToEls built', {
      keys: keyToEls.size,
      totalBindings: sectionSelectors.length
    })
    const groupKeyToEls = new Map<string, Element[]>()
    Object.entries(groupKeyToRangeKeys).forEach(([gk, rks]) => {
      const acc: Element[] = []
      rks.forEach(rk => {
        const els = keyToEls.get(rk) || []
        els.forEach(el => {
          if (!acc.includes(el)) acc.push(el)
        })
      })
      groupKeyToEls.set(gk, acc)
    })
    console.log('SeatingMap: groupKeyToEls built', {
      groups: groupKeyToEls.size
    })

    const listeners: Array<() => void> = []
    for (const [key, elements] of sectionSelectors) {
      for (const el of elements) {
        // Ensure the element actually receives pointer events
        const prevPointer = (el as HTMLElement).style.pointerEvents
        if (!(el as HTMLElement).style.pointerEvents)
          (el as HTMLElement).style.pointerEvents = 'all'

        // Save current visuals and use a local svg element ref
        const svgEl = el as SVGElement
        const prevStroke = svgEl.getAttribute('stroke') || ''
        const prevStrokeWidth = svgEl.getAttribute('stroke-width') || ''
        const prevOpacity = svgEl.getAttribute('opacity') || ''

        console.debug('Binding listeners on element', {
          key,
          elId: (el as HTMLElement).id,
          classes: Array.from((el as HTMLElement).classList || [])
        })

        // Track highlighted elements for group hover to restore on leave
        let groupApplied: Array<{
          el: SVGElement
          prevStroke: string
          prevStrokeWidth: string
          prevOpacity: string
          prevFilter: string
        }> = []

        const enter = (ev: MouseEvent) => {
          console.debug('Hover enter on element', {
            elId: (el as HTMLElement).id,
            classes: Array.from((el as HTMLElement).classList || []),
            key,
            groupKey: rangeKeyToGroupKey[key]
          })
          // No aplicar cambios visuales en hover, solo tooltip
          handleEnter(key, ev, el)
        }
        const move = (ev: MouseEvent) => {
          if (!container) return
          const rect = container.getBoundingClientRect()
          setTooltipPos({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
        }
        const leave = () => {
          setHoverInfo(null)
          setTooltipVisible(false)
          // NO resetear lastFetchedGroup aquí - solo resetear cuando realmente cambie de grupo
          if (groupApplied.length > 0) {
            groupApplied.forEach(
              ({
                el: gEl,
                prevStroke: pS,
                prevStrokeWidth: pW,
                prevOpacity: pO,
                prevFilter: pF
              }) => {
                // Si está seleccionado, no restaurar hover: mantener estilo de selección
                if (gEl.getAttribute('data-ts-selected') === 'true') return
                gEl.setAttribute('stroke', pS)
                pW ? gEl.setAttribute('stroke-width', pW) : gEl.removeAttribute('stroke-width')
                pO ? gEl.setAttribute('opacity', pO) : gEl.removeAttribute('opacity')
                pF ? gEl.setAttribute('filter', pF) : gEl.removeAttribute('filter')
              }
            )
            groupApplied = []
          } else {
            if (svgEl.getAttribute('data-ts-selected') !== 'true') {
              svgEl.setAttribute('stroke', prevStroke)
              prevStrokeWidth
                ? svgEl.setAttribute('stroke-width', prevStrokeWidth)
                : svgEl.removeAttribute('stroke-width')
              prevOpacity
                ? svgEl.setAttribute('opacity', prevOpacity)
                : svgEl.removeAttribute('opacity')
              svgEl.removeAttribute('filter')
            }
          }
        }
        const click = async (ev: MouseEvent) => {
          // Determine row from id and set selection
          const targetId = (
            (ev.target as HTMLElement)?.id ||
            (el as HTMLElement).id ||
            ''
          ).toString()
          console.debug('Click on element', {
            targetId,
            classes: Array.from((el as HTMLElement).classList || []),
            key,
            groupKey: rangeKeyToGroupKey[key]
          })
          const parsed = parseElementId(targetId)
          const rowCandidate = parsed.row
          // Selección a nivel de asiento (toggle en lugar de abrir modal del grupo)
          if (parsed.mode !== 'unknown' && parsed.row && typeof parsed.seatNumber === 'number') {
            let seat = seats.find(s => {
              const num =
                typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number
              const row = (s.row || '').toString().toUpperCase()
              return row === parsed.row && num === parsed.seatNumber
            })
            if (!seat) {
              console.debug('Seat not found locally, fetching from API...', {
                row: parsed.row,
                seat: parsed.seatNumber
              })
              try {
                const qs = new URLSearchParams()
                qs.set('row', parsed.row)
                qs.set('seat_number', String(parsed.seatNumber))
                const url = `${API_URLS.PUBLIC_EVENTS}${eventId}/seats?${qs.toString()}`
                const seatsData = await fetchJson<{
                  data?: SeatItem[]
                  results?: SeatItem[]
                  items?: SeatItem[]
                }>(url, { headers: { Accept: 'application/json' } })
                const list = (seatsData.data ||
                  seatsData.results ||
                  seatsData.items ||
                  []) as SeatItem[]
                seat = list[0]
                if (!seat)
                  console.warn('Seat not found in API response', { url, listLen: list.length })
              } catch (err) {
                console.warn('Error fetching seat by row/number', err)
              }
            }
            if (seat) {
              const targetSvg = (ev.target as SVGElement) || svgEl
              setSelectedSeatIds(prev => {
                const next = { ...prev }
                const idStr = seat!.id.toString()
                if (next[idStr]) {
                  delete next[idStr]
                  console.debug('Seat deselected', { id: idStr, total: Object.keys(next).length })
                  // Restaurar visuales si estaban guardados
                  if (targetSvg) {
                    targetSvg.removeAttribute('data-ts-selected')
                    const saved = selectedVisuals.get(targetSvg)
                    if (saved) {
                      targetSvg.setAttribute('stroke', saved.prevStroke)
                      saved.prevStrokeWidth
                        ? targetSvg.setAttribute('stroke-width', saved.prevStrokeWidth)
                        : targetSvg.removeAttribute('stroke-width')
                      saved.prevOpacity
                        ? targetSvg.setAttribute('opacity', saved.prevOpacity)
                        : targetSvg.removeAttribute('opacity')
                      if (saved.prevFilter !== undefined) {
                        if (saved.prevFilter) targetSvg.setAttribute('filter', saved.prevFilter)
                        else targetSvg.removeAttribute('filter')
                      }
                      if (saved.prevStrokeLinecap !== undefined) {
                        if (saved.prevStrokeLinecap)
                          targetSvg.setAttribute('stroke-linecap', saved.prevStrokeLinecap)
                        else targetSvg.removeAttribute('stroke-linecap')
                      }
                      if (saved.prevStrokeLinejoin !== undefined) {
                        if (saved.prevStrokeLinejoin)
                          targetSvg.setAttribute('stroke-linejoin', saved.prevStrokeLinejoin)
                        else targetSvg.removeAttribute('stroke-linejoin')
                      }
                      if (saved.prevFill !== undefined) {
                        if (saved.prevFill) targetSvg.setAttribute('fill', saved.prevFill)
                        else targetSvg.removeAttribute('fill')
                      }
                      if (saved.prevFillOpacity !== undefined) {
                        if (saved.prevFillOpacity)
                          targetSvg.setAttribute('fill-opacity', saved.prevFillOpacity)
                        else targetSvg.removeAttribute('fill-opacity')
                      }
                      selectedVisuals.delete(targetSvg)
                    } else {
                      // Fallback
                      targetSvg.removeAttribute('stroke-width')
                    }
                    // Remover overlay si existe
                    const overlay = selectedOverlays.get(targetSvg)
                    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
                    selectedOverlays.delete(targetSvg)
                  }
                } else {
                  next[idStr] = true
                  console.debug('Seat selected', { id: idStr, total: Object.keys(next).length })
                  // Aplicar visual de selección persistente
                  if (targetSvg) {
                    const pS = targetSvg.getAttribute('stroke') || ''
                    const pW = targetSvg.getAttribute('stroke-width') || ''
                    const pO = targetSvg.getAttribute('opacity') || ''
                    const pF = targetSvg.getAttribute('filter') || ''
                    const pLC = targetSvg.getAttribute('stroke-linecap') || ''
                    const pLJ = targetSvg.getAttribute('stroke-linejoin') || ''
                    const pFill = targetSvg.getAttribute('fill') || ''
                    const pFillO = targetSvg.getAttribute('fill-opacity') || ''
                    selectedVisuals.set(targetSvg, {
                      prevStroke: pS,
                      prevStrokeWidth: pW,
                      prevOpacity: pO,
                      prevFilter: pF,
                      prevStrokeLinecap: pLC,
                      prevStrokeLinejoin: pLJ,
                      prevFill: pFill,
                      prevFillOpacity: pFillO
                    })
                    targetSvg.setAttribute('data-ts-selected', 'true')
                    targetSvg.setAttribute('stroke', '#1D4ED8')
                    targetSvg.setAttribute('stroke-width', '6')
                    targetSvg.setAttribute('stroke-linecap', 'round')
                    targetSvg.setAttribute('stroke-linejoin', 'round')
                    targetSvg.setAttribute('filter', 'drop-shadow(0 0 8px rgba(29,78,216,0.75))')
                    // colorear el asiento seleccionado
                    targetSvg.setAttribute('fill', '#1D4ED8')
                    targetSvg.setAttribute('fill-opacity', '0.75')
                    // si no tiene fill, aumentar opacidad para destacarlo
                    if (!targetSvg.getAttribute('fill')) {
                      targetSvg.setAttribute('opacity', '0.95')
                    }
                    // Añadir overlay con check centrado
                    const layer = ensureOverlayLayer()
                    const graphicsEl = targetSvg as unknown as SVGGraphicsElement
                    if (layer && typeof graphicsEl.getBBox === 'function') {
                      try {
                        const bbox = graphicsEl.getBBox()
                        const cx = bbox.x + bbox.width / 2
                        const cy = bbox.y + bbox.height / 2
                        const size = Math.max(10, Math.min(bbox.width, bbox.height) * 0.8)
                        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
                        text.setAttribute('x', String(cx))
                        text.setAttribute('y', String(cy))
                        text.setAttribute('text-anchor', 'middle')
                        text.setAttribute('dominant-baseline', 'middle')
                        text.setAttribute('font-size', String(size))
                        text.setAttribute('font-weight', '700')
                        text.setAttribute('fill', '#ffffff')
                        text.setAttribute('stroke', '#1D4ED8')
                        text.setAttribute('stroke-width', '1.5')
                        text.setAttribute('paint-order', 'stroke')
                        text.setAttribute('filter', 'drop-shadow(0 0 6px rgba(29,78,216,0.85))')
                        text.textContent = '✓'
                        layer.appendChild(text)
                        selectedOverlays.set(targetSvg, text)
                        console.debug('Overlay check added', { bbox, cx, cy, size })
                      } catch (e) {
                        console.warn('Failed to add overlay check', e)
                      }
                    }
                  }
                }
                return next
              })
              setSelectedSeats(prev => {
                const exists = prev.some(s => s.id === seat!.id)
                const updated = exists ? prev.filter(s => s.id !== seat!.id) : [...prev, seat!]
                console.debug('Selected seats list updated', { count: updated.length })
                return updated
              })
            } else {
              console.debug('Seat could not be resolved; no toggle applied', {
                row: parsed.row,
                seat: parsed.seatNumber
              })
            }
            return
          }
          const groupKey = rangeKeyToGroupKey[key]
          setSelectedSeatIds({})
          if (groupKey) {
            // Fetch seats for the whole group (position-color), optionally restricted by row
            try {
              setSelectedKey(toTitleCaseFromKebab(groupKey))
              setSelectedRow(rowCandidate || null)
              const qs = new URLSearchParams()
              qs.set('group', groupKey)
              qs.set('available_only', 'false')
              qs.set('sort', 'row,seat_number')
              // No enviar row cuando se usa group - obtener TODOS los asientos del grupo
              const url = `${API_URLS.PUBLIC_EVENTS}${eventId}/seats?${qs.toString()}`
              const seatsData = await fetchJson<{
                group?: string
                data?: Record<string, SeatItem[]>
                results?: SeatItem[]
                items?: SeatItem[]
              }>(url, { headers: { Accept: 'application/json' } })

              // Manejar respuesta agrupada por fila
              let list: SeatItem[] = []
              let groupedSeats: Record<string, SeatItem[]> = {}

              if (
                seatsData.data &&
                typeof seatsData.data === 'object' &&
                !Array.isArray(seatsData.data)
              ) {
                // Respuesta agrupada por fila: { "B": [...], "C": [...] }
                groupedSeats = seatsData.data
                list = Object.values(seatsData.data).flat()
              } else {
                // Respuesta plana (fallback) - agrupar por fila
                list = (seatsData.data || seatsData.results || seatsData.items || []) as SeatItem[]
                groupedSeats = list.reduce(
                  (acc, seat) => {
                    const row = seat.row || 'unknown'
                    if (!acc[row]) acc[row] = []
                    acc[row].push(seat)
                    return acc
                  },
                  {} as Record<string, SeatItem[]>
                )
              }

              setSelectedSeats(list)
              setSeatsByRow(groupedSeats)
              setShowSeatModal(true)
            } catch (_e) {
              setSelectedSeats([])
            }
          } else {
            // Fallback: compute from ranges locally
            setSelectedKey(key)
            setSelectedRow(rowCandidate || null)
            const list = computeSeatsForRangeKey(key, rowCandidate)
            setSelectedSeats(list)
          }
        }
        el.addEventListener('mouseover', enter)
        el.addEventListener('mousemove', move)
        el.addEventListener('mouseout', leave)
        el.addEventListener('click', click)
        listeners.push(() => {
          el.removeEventListener('mouseover', enter)
          el.removeEventListener('mousemove', move)
          el.removeEventListener('mouseout', leave)
          el.removeEventListener('click', click)
          const elHTMLElement = el as HTMLElement
          elHTMLElement.style.pointerEvents = prevPointer
        })
      }
    }

    // Agregar listener al contenedor para detectar salida completa del mapa
    const containerLeave = () => {
      lastFetchedGroupRef.current = null // Reset solo cuando salgas completamente del mapa
    }

    if (container) {
      container.addEventListener('mouseleave', containerLeave)
      listeners.push(() => {
        container.removeEventListener('mouseleave', containerLeave)
      })
    }

    return () => {
      listeners.forEach(off => off())
    }
  }, [svgContent, sectionStats, ranges, seats, eventId])

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }
  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  return (
    <div className="w-full">
      <div className="relative flex justify-center items-center overflow-auto p-2 sm:p-4">
        <div
          id="inline-seating-svg-container"
          className="inline-block max-w-full h-auto"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto'
          }}
          dangerouslySetInnerHTML={{
            __html: svgContent
              // Quitar títulos y descripciones internas del SVG para que
              // el navegador no muestre los nombres de las capas como tooltip nativo.
              .replace(/<title[\s\S]*?<\/title>/gi, '')
              .replace(/<desc[\s\S]*?<\/desc>/gi, '')
              // Quitar atributos title="..." en elementos individuales.
              .replace(/\s+title="[^"]*"/gi, '')
              // Forzar estilos responsivos y desactivar selección de texto
              // para que no se pueda seleccionar/copiar el texto del mapa.
              .replace(
                /<svg([^>]*)>/gi,
                '<svg$1 style="width: 100%; height: auto; max-width: 100%; min-width: 320px; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;" class="w-full h-auto max-w-full" preserveAspectRatio="xMidYMid meet">'
              )
          }}
        />
        {tooltipVisible && hoverInfo && tooltipPos && (
          <div
            className="absolute bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
            style={{ left: tooltipPos.x + 12, top: tooltipPos.y + 12, zIndex: 10 }}
          >
            {hoverInfo.isSeatLevel
              ? `${hoverInfo.label} ${hoverInfo.available === 1 ? 'available' : 'no available'}`
              : hoverInfo.isLoadingGroup
              ? `${hoverInfo.label}: loading...`
              : `${hoverInfo.label}: ${hoverInfo.available}/${hoverInfo.total} available`}
          </div>
        )}
        {Object.keys(selectedSeatIds).length > 0 && (
          <div className="absolute right-3 bottom-3 z-20 bg-white/95 text-gray-800 backdrop-blur rounded-md shadow-lg border border-gray-200 p-2 flex items-center gap-2">
            <span className="text-sm font-medium">
              {Object.keys(selectedSeatIds).length} seleccionados
            </span>
            <button
              type="button"
              className="btn btn-xs btn-outline"
              onClick={() => {
                const grouped = (selectedSeats || []).reduce(
                  (acc, seat) => {
                    const row = seat.row || 'unknown'
                    if (!acc[row]) acc[row] = []
                    acc[row].push(seat)
                    return acc
                  },
                  {} as Record<string, SeatItem[]>
                )
                setSeatsByRow(grouped)
                setSelectedKey('Selección manual')
                setSelectedRow(null)
                setShowSeatModal(true)
              }}
            >
              Revisar selección
            </button>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => {
                setSelectedSeatIds({})
                setSelectedSeats([])
                setSeatsByRow({})
                // limpiar estilos visuales de seleccion en el SVG
                try {
                  const rootSvg = document
                    .getElementById('inline-seating-svg-container')
                    ?.querySelector('svg') as SVGSVGElement | null
                  if (rootSvg) {
                    // limpiar overlays de checks
                    const overlayLayer = rootSvg.querySelector(
                      '#ts-selection-overlays'
                    ) as SVGGElement | null
                    if (overlayLayer) overlayLayer.innerHTML = ''
                    rootSvg.querySelectorAll('[data-ts-selected="true"]').forEach(el => {
                      const svgEl = el as SVGElement
                      svgEl.removeAttribute('data-ts-selected')
                      svgEl.removeAttribute('stroke-width')
                      svgEl.removeAttribute('stroke-linecap')
                      svgEl.removeAttribute('stroke-linejoin')
                      svgEl.removeAttribute('filter')
                      if (svgEl.getAttribute('fill') === '#1D4ED8') {
                        svgEl.removeAttribute('fill')
                      }
                      svgEl.removeAttribute('fill-opacity')
                    })
                  }
                } catch (err) {
                  console.warn('Error clearing selected visuals', err)
                }
              }}
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Modal de selección de asientos */}
      <SeatSelectionModal
        eventId={eventId}
        isOpen={showSeatModal}
        onClose={() => {
          setShowSeatModal(false)
          setSelectedKey(null)
          setSelectedRow(null)
          setSelectedSeats([])
          setSeatsByRow({})
          setSelectedSeatIds({})
        }}
        seatsByRow={seatsByRow}
        selectedSeats={selectedSeatIds}
        onSeatToggle={seatKey => {
          setSelectedSeatIds(prev => {
            const next = { ...prev }
            if (next[seatKey]) {
              delete next[seatKey]
              console.log('🚫 Seat deselected:', seatKey)
            } else {
              next[seatKey] = true
              console.log('✅ Seat selected:', seatKey)
            }
            console.log('📋 Current selected seats:', Object.keys(next))
            return next
          })
        }}
        onProceed={() => {
          if (!onProceed) return
          const chosen = selectedSeats
            .filter(s => {
              const id = s.id.toString() // Usar ID único del asiento
              return !!selectedSeatIds[id]
            })
            .slice(0, 10)

          console.log(
            '🎫 Final seats to send:',
            chosen.map(s => ({
              id: s.id,
              seat_key: s.seat_key,
              row: s.row,
              seat_number: s.seat_number,
              position: s.position,
              section: s.section
            }))
          )
          console.log('📤 Sending to endpoint:', {
            seats: chosen,
            selectionLabel: selectedKey || '',
            row: selectedRow
          })

          console.log(
            '🎫 Sending seats to parent component:',
            chosen.map(s => ({
              id: s.id,
              row: s.row,
              seat_number: s.seat_number,
              seat_key: s.seat_key,
              title: s.title
            }))
          )

          onProceed({
            seats: chosen,
            selectionLabel: selectedKey || '',
            row: selectedRow
          })
          setShowSeatModal(false)
          setSelectedKey(null)
          setSelectedRow(null)
          setSelectedSeats([])
          setSeatsByRow({})
          setSelectedSeatIds({})
        }}
        sectionName={selectedKey || ''}
        stageDirection={stageDirection}
      />
    </div>
  )
}
