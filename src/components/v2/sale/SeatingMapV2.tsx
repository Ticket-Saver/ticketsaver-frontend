/**
 * SeatingMapV2 — seat-picker portado de producción (origin/new-version
 * `ApiSeatingMap.tsx`) con piel v2 y dos adaptaciones aprobadas:
 *  1. El SVG y el ranges.json llegan por props (assets del front, vía registry),
 *     no se fetchean de una URL → sin dependencia de red para algo estático.
 *  2. Los asientos vienen de HiEvents (`hiEventsService.getSeats`); el hover,
 *     el modal y la contigüidad se resuelven localmente desde esa lista + ranges.
 * La lógica de mapeo SVG↔asiento (frágil) se conserva idéntica a producción.
 */
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { hiEventsService } from '../../../services/hiEventsService'
import type { RangesRaw } from '../../../lib/seatmaps/registry'
import ZoomPanContainer from './ZoomPanContainer'
import type { SeatItem } from './seatTypes'
import type { SelectedSection } from './SeatPickerV2'

interface SeatingMapV2Props {
  /** id numérico del evento HiEvents (string). */
  eventId: string
  /** SVG del mapa (selector de secciones) desde el registry de assets. */
  svg: string
  /** ranges.json crudo del mapa desde el registry de assets. */
  rangesRaw: RangesRaw
  /** Se invoca al elegir una sección con asientos (pasa al paso 2). */
  onSelectSection: (section: SelectedSection) => void
}

export default function SeatingMapV2({
  eventId,
  svg,
  rangesRaw,
  onSelectSection
}: SeatingMapV2Props) {
  // map metadata is fetched but not stored to avoid unused state
  const [svgContent, setSvgContent] = useState<string>('')
  // `seats` queda vacío: el mapa ya no carga la lista global (lazy por grupo). Se
  // conserva para las funciones legacy de map1/map2 que aún lo referencian.
  const [seats] = useState<SeatItem[]>([])
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
    price?: number
    isSeatLevel?: boolean
    isLoadingGroup?: boolean
  } | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  // Precio "desde $X" por rango (traído on-demand; el mapa masivo no trae precio).
  const [priceByRange, setPriceByRange] = useState<Record<string, number>>({})
  // Leyenda: TODOS los colores del mapa (instantáneo, del ranges) + "desde $X" por color.
  const [legend, setLegend] = useState<Array<{ color: string; name: string; price?: number }>>([])
  // La carga del grupo es síncrona (cálculo local), así que siempre es false.
  const isLoadingGroup = false
  const lastFetchedGroupRef = useRef<string | null>(null)
  const availabilityCacheRef = useRef<
    Record<string, { total: number; available: number; price?: number }>
  >({})
  const pendingClickRef = useRef<boolean>(false)
  // Cache de asientos por grupo (lazy): el mapa no trae los ~1876 de una; cada sección
  // se trae al hacer hover/click sobre ella, vía /seats?group= (~100 asientos, <0.7s).
  const groupSeatsCacheRef = useRef<Map<string, SeatItem[]>>(new Map())
  const loadGroupSeats = useCallback(
    async (groupKey: string, signal?: AbortSignal): Promise<SeatItem[]> => {
      const cached = groupSeatsCacheRef.current.get(groupKey)
      if (cached) return cached
      const list = (await hiEventsService.getSeats(
        eventId,
        groupKey,
        signal
      )) as unknown as SeatItem[]
      groupSeatsCacheRef.current.set(groupKey, list)
      // Alimentar el "desde $X" por rango con el precio base de estos asientos.
      setPriceByRange((prev) => {
        const next = { ...prev }
        for (const s of list) {
          if (s.price_range && typeof s.price === 'number' && next[s.price_range] === undefined) {
            next[s.price_range] = s.price
          }
        }
        return next
      })
      return list
    },
    [eventId]
  )

  const toTitleCaseFromKebab = (value: string): string => {
    return value
      .split('-')
      .filter(Boolean)
      .map((w) => {
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

        // SVG y ranges vienen como assets del front (props del registry); no se fetchean.
        if (!isMounted) return
        setSvgContent(svg)

        // Parsear ranges (mismo parser que producción) sobre el asset.
        {
          const rangesJson = rangesRaw as Record<string, string>

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
          const knownPositions = new Set(['left', 'right', 'center', 'leftcenter', 'rightcenter'])
          const knownColors = new Set([
            'orange',
            'cyan',
            'red',
            'green',
            'purple',
            'blue',
            'yellow',
            'pink',
            'brown'
          ])
          for (const [label, value] of Object.entries(rangesJson)) {
            // Skip non-string values (map1/map2 no usan metadata especial)
            if (typeof value !== 'string') {
              continue
            }

            // value can be like "1-16 | 101-122"
            const subranges = value
              .split('|')
              .map((v) => v.trim())
              .filter(Boolean)
              .map((v) => {
                const [a, b] = v.split('-').map((s) => parseInt(s.trim(), 10))
                return { start: Math.min(a, b), end: Math.max(a, b) }
              })
              .filter((r) => Number.isFinite(r.start) && Number.isFinite(r.end))

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
              const tokens = parts.map((token, idx) => ({
                original: token,
                lower: token.toLowerCase(),
                index: idx
              }))

              const zoneEntry = tokens.find((t) => ['balcony', 'loge'].includes(t.lower))
              if (zoneEntry) {
                zone = zoneEntry.lower
              }

              const colorEntry = tokens.find((t) => knownColors.has(t.lower))
              if (colorEntry) {
                color = colorEntry.original
              }

              let positionEntry = tokens.find((t) => knownPositions.has(t.lower))
              if (!positionEntry) {
                // Find custom section (e.g., '314', 'VIP') that is not color, zone, or a row letter
                const potential = tokens.filter(
                  (t) =>
                    !knownColors.has(t.lower) &&
                    !['balcony', 'loge'].includes(t.lower) &&
                    !/^[A-Za-z]{1,2}$/.test(t.original)
                )
                if (potential.length > 0) {
                  positionEntry = potential[0]
                }
              }

              if (positionEntry) {
                position = positionEntry.original
              }

              const consumedIndexes = new Set<number>()
              if (zoneEntry) consumedIndexes.add(zoneEntry.index)
              if (positionEntry) consumedIndexes.add(positionEntry.index)
              if (colorEntry) consumedIndexes.add(colorEntry.index)

              const leftoverTokens = tokens
                .filter((t) => !consumedIndexes.has(t.index))
                .map((t) => t.original)

              if (
                leftoverTokens.length === 0 &&
                positionEntry &&
                /^[A-Za-z]{1,2}$/.test(tokens[0].original)
              ) {
                rows = [tokens[0].original.toUpperCase()]
              } else if (leftoverTokens.length > 0) {
                rows = parseRowsSpec(leftoverTokens.join('-')).map((r) => r.toUpperCase())
              }

              if (!rows.length && /^[A-Za-z]{1,2}$/.test(tokens[0].original)) {
                rows = [tokens[0].original.toUpperCase()]
              }

              if (!position && knownPositions.has(tokens[1]?.lower || '')) {
                position = tokens[1].original
              }
              if (!color && knownColors.has(tokens[2]?.lower || '')) {
                color = tokens[2].original
              }
            } else if (parts.length === 2) {
              // Treat as row-color, no section
              const rowPart = parts[0]
              color = parts[1]
              rows = [rowPart.toUpperCase()]
            } else if (parts.length === 1) {
              rows = parseRowsSpec(parts[0])
            }

            const normalizedLabel = label.toLowerCase()
            if (!zone && normalizedLabel.includes('balcony')) {
              zone = 'balcony'
            }
            parsed[label] = { ranges: subranges, rows, position, color, zone }
          }
          if (isMounted) setRanges(parsed)
        }

        // El mapa NO carga los ~1876 asientos (eso lo volvía lento). Se pinta solo con
        // el SVG (selector de secciones). Los asientos de cada sección se traen
        // on-demand al hacer hover/click, vía /seats?group= (~100 asientos, <0.7s).
        if (!isMounted) return
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
  }, [eventId, svg, rangesRaw])

  // Leyenda de rangos: TODOS los colores del mapa salen del ranges (asset) → aparece al
  // instante y completa. El "desde $X" se completa cargando 1 grupo representativo por
  // color en paralelo (rápido, ~100 asientos c/u). Se listan todos los colores aunque el
  // precio se repita — es la referencia color → zona.
  useEffect(() => {
    const defs = Object.values(ranges)
    if (defs.length === 0) return
    let mounted = true
    const byColor = new Map<string, string>() // color → groupKey representativo
    for (const def of defs) {
      if (def.color && def.position && !byColor.has(def.color)) {
        byColor.set(def.color, `${def.position}-${def.color}`)
      }
    }
    // Mostrar los colores ya (sin precio); completar el precio en paralelo.
    setLegend([...byColor.keys()].map((color) => ({ color, name: COLOR_LABELS[color] || color })))
    Promise.all(
      [...byColor.entries()].map(async ([color, groupKey]) => {
        try {
          const gs = await loadGroupSeats(groupKey)
          const withPrice = gs.find((s) => typeof s.price === 'number')
          return {
            color,
            name: withPrice?.price_range || COLOR_LABELS[color] || color,
            price: withPrice?.price ?? undefined
          }
        } catch {
          return { color, name: COLOR_LABELS[color] || color, price: undefined }
        }
      })
    ).then((rows) => {
      if (!mounted) return
      rows.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      setLegend(rows)
    })
    return () => {
      mounted = false
    }
  }, [ranges, loadGroupSeats])

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

  const rowZoneMap = useMemo(() => {
    const map: Record<string, string> = {}
    seats.forEach((seat) => {
      const row = (seat.row || '').toString().toUpperCase()
      if (!row) return
      const section = (seat.section || '').toLowerCase()
      const position = (seat.position || '').toLowerCase()
      if (section.includes('balcony') || position.includes('balcony')) {
        map[row] = 'balcony'
      } else if (!map[row] && (section.includes('loge') || position.includes('loge'))) {
        map[row] = 'loge'
      }
    })
    return map
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
        const inAnyRange = def.ranges.some((r) => seatNum >= r.start && seatNum <= r.end)
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
      return seats.filter((s) => {
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        const row = (s.row || '').toString().toUpperCase()
        const inAnyRange = def.ranges.some((r) => seatNum >= r.start && seatNum <= r.end)
        return (
          s.is_available === true &&
          s.is_sold_out !== true &&
          rowsToCount.includes(row) &&
          inAnyRange
        )
      })
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

    const getGroupPrice = (gKey: string) => {
      const rKeys = groupKeyToRangeKeys[gKey]
      if (!rKeys || rKeys.length === 0) return undefined
      for (const s of seats) {
        const row = (s.row || '').toString().toUpperCase()
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        const match = rKeys.some((k) => {
          const def = ranges[k]
          return (
            def &&
            def.rows.includes(row) &&
            def.ranges.some((r) => seatNum >= r.start && seatNum <= r.end)
          )
        })
        if (match) return priceByRange[s.price_range]
      }
      return undefined
    }

    const getSectionPrice = (secKey: string) => {
      const match = seats.find(
        (s) =>
          s.section === secKey ||
          s.position === secKey ||
          s.seat_key === secKey ||
          s.seat_key_alt === secKey
      )
      return match ? priceByRange[match.price_range] : undefined
    }

    const getRangePrice = (rangeKey: string, rowCandidate?: string) => {
      const def = ranges[rangeKey]
      if (!def) return undefined
      for (const s of seats) {
        const row = (s.row || '').toString().toUpperCase()
        if (rowCandidate && row !== rowCandidate.toUpperCase()) continue
        if (!def.rows.includes(row)) continue
        const seatNum =
          typeof s.seat_number === 'string' ? parseInt(s.seat_number, 10) : s.seat_number || 0
        if (def.ranges.some((r) => seatNum >= r.start && seatNum <= r.end)) {
          return priceByRange[s.price_range]
        }
      }
      return undefined
    }

    const formatGroupLabel = (key: string) => {
      const parts = key.split('-')
      const position = parts[0]
      let isBalcony = parts.includes('balcony')
      let isLoge = parts.includes('loge')
      let posFormatted = position
      if (/^\d+$/.test(position)) {
        posFormatted = `Section ${position}`
      } else {
        if (position === 'leftcenter') posFormatted = 'Left Center'
        else if (position === 'rightcenter') posFormatted = 'Right Center'
        else posFormatted = position.charAt(0).toUpperCase() + position.slice(1)
        if (
          !posFormatted.toLowerCase().includes('section') &&
          posFormatted !== 'Balcony' &&
          posFormatted !== 'Loge'
        ) {
          posFormatted = `Section ${posFormatted}`
        }
      }
      if (isBalcony && !posFormatted.toLowerCase().includes('balcony')) {
        return `${posFormatted} Balcony`
      }
      if (isLoge && !posFormatted.toLowerCase().includes('loge')) {
        return `${posFormatted} Loge`
      }
      return posFormatted
    }

    // Nueva función para obtener disponibilidad en tiempo real (con deduplicación de promesas)
    // Disponibilidad calculada localmente desde los asientos ya cargados. El
    // endpoint /seats/availability/group no aporta agregados fiables (en prod
    // terminaba cayendo a este mismo cálculo local); mejorarlo = bloque A.
    const fetchRealtimeAvailability = async (groupKey: string, _fallbackGroupKey?: string) => {
      const cached = availabilityCacheRef.current[groupKey]
      if (cached) return cached
      // Traer los asientos de la sección (/seats?group=) y contar disponibilidad real.
      const groupSeats = await loadGroupSeats(groupKey)
      const seen = new Set<string>()
      let total = 0
      let available = 0
      let price: number | undefined
      for (const s of groupSeats) {
        const dk = s.id ? s.id.toString() : `${s.row}-${s.seat_number}`
        if (seen.has(dk)) continue
        seen.add(dk)
        total += 1
        if (s.is_available === true && s.is_sold_out !== true) available += 1
        if (price === undefined && typeof s.price === 'number') price = s.price
      }
      const stats = { total, available, price }
      availabilityCacheRef.current[groupKey] = stats
      return stats
    }

    const getLastNonNumericToken = (tokens: string[]): string | undefined => {
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (!/^\d+$/.test(tokens[i])) return tokens[i]
      }
      return undefined
    }

    const getElementZoneFromAncestors = (element?: Element | null): string | undefined => {
      let current: Element | null | undefined = element
      const seen = new Set<Element>()
      while (current && !seen.has(current)) {
        seen.add(current)
        const classList = (current as HTMLElement).classList
        if (classList) {
          for (const cls of classList) {
            const lower = cls.toLowerCase()
            if (lower.includes('balcony')) {
              return 'balcony'
            }
            if (lower.includes('loge')) {
              return 'loge'
            }
          }
        }
        const id = (current as HTMLElement).id || ''
        if (id.toLowerCase().includes('balcony')) return 'balcony'
        if (id.toLowerCase().includes('loge')) return 'loge'
        current = current.parentElement
      }
      return undefined
    }

    const parseElementId = (
      rawId: string,
      element?: Element
    ): {
      rangeKeyGuess?: string
      row?: string
      seatNumber?: number
      mode: 'section' | 'row' | 'unknown'
      zone?: string
    } => {
      const id = rawId.trim()
      if (!id) return { mode: 'unknown' }
      const parts = id.split('-').filter(Boolean)
      const extraTokens: string[] = []
      if (element) {
        const classList = (element as HTMLElement).classList
        if (classList) {
          classList.forEach((cls) => {
            cls
              .split('-')
              .filter(Boolean)
              .forEach((token) => extraTokens.push(token))
          })
        }
      }
      const allTokens = [...parts, ...extraTokens]
      const hasBalcony = allTokens.some((token) => token.toLowerCase() === 'balcony')
      const numericTokens = parts.filter((p) => /^\d+$/.test(p))
      const seatNumber =
        numericTokens.length > 0 ? parseInt(numericTokens[numericTokens.length - 1], 10) : undefined

      // Heuristic: if first token looks like a row (<=2 letters), treat as row mode
      const looksLikeRowToken = /^[A-Za-z]{1,2}$/.test(parts[0] || '')

      if (parts.length >= 3 && !looksLikeRowToken) {
        // section-color-row(-seat?)
        const rowToken = getLastNonNumericToken(parts.slice(2)) || parts[2]
        const rangeKeyGuess = [parts[0], parts[1], rowToken].join('-')
        return {
          rangeKeyGuess,
          row: rowToken.toUpperCase(),
          seatNumber,
          mode: 'section',
          zone: hasBalcony ? 'balcony' : undefined
        }
      }

      if (parts.length >= 2 && looksLikeRowToken) {
        // row-color(-seat?)
        const rowToken = parts[0]
        const rangeKeyGuess = [parts[0], parts[1]].join('-')
        return {
          rangeKeyGuess,
          row: rowToken.toUpperCase(),
          seatNumber,
          mode: 'row',
          zone: hasBalcony ? 'balcony' : undefined
        }
      }

      if (parts.length === 1 && looksLikeRowToken) {
        return {
          rangeKeyGuess: parts[0],
          row: parts[0].toUpperCase(),
          seatNumber,
          mode: 'row',
          zone: hasBalcony ? 'balcony' : undefined
        }
      }
      return { mode: 'unknown', zone: hasBalcony ? 'balcony' : undefined }
    }

    const handleEnter = (key: string, ev?: MouseEvent, elForFallback?: Element) => {
      // Derive details from event/element id
      const targetId = (
        (ev?.target as HTMLElement)?.id ||
        (elForFallback as HTMLElement | undefined)?.id ||
        ''
      ).toString()
      const parsed = parseElementId(targetId, (ev?.target as Element) || elForFallback || undefined)

      // Seat-level hover: show A1 available / no available
      if (parsed.mode !== 'unknown' && parsed.row && typeof parsed.seatNumber === 'number') {
        const seat = seats.find((s) => {
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
      const groupKeyBase = rangeKeyToGroupKey[key]
      if (groupKeyBase) {
        // Mostrar tooltip inmediatamente en la posición actual del puntero
        if (ev && container) {
          const rect = container.getBoundingClientRect()
          setTooltipPos({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
          setTooltipVisible(true)
        }

        const rowZoneHint = parsed.row ? rowZoneMap[parsed.row] : undefined
        const ancestorZone = getElementZoneFromAncestors(
          (ev?.target as Element) || elForFallback || undefined
        )
        const zoneHint =
          parsed.zone ||
          rowZoneHint ||
          ancestorZone ||
          (key.toLowerCase().includes('balcony') ? 'balcony' : undefined)

        const effectiveGroupKey =
          zoneHint && !groupKeyBase.endsWith(`-${zoneHint}`)
            ? `${groupKeyBase}-${zoneHint}`
            : groupKeyBase

        const cached = availabilityCacheRef.current[effectiveGroupKey]
        const groupPrice = getGroupPrice(groupKeyBase)
        const formattedLabel = formatGroupLabel(effectiveGroupKey)

        if (cached) {
          // Si ya tenemos datos del endpoint (o fallback) en caché, los usamos siempre.
          setHoverInfo({
            label: formattedLabel,
            total: cached.total,
            available: cached.available,
            price: cached.price ?? groupPrice,
            isLoadingGroup: false
          })
        } else {
          // Si todavía no tenemos datos, mostrar estado "loading" en el tooltip.
          setHoverInfo({
            label: formattedLabel,
            total: 0,
            available: 0,
            price: groupPrice,
            isLoadingGroup: true
          })
        }

        // Llamar al endpoint solo si el grupo ha cambiado y aún no tenemos datos cacheados.
        if (!cached && effectiveGroupKey !== lastFetchedGroupRef.current) {
          if (lastFetchedGroupRef.current && lastFetchedGroupRef.current !== effectiveGroupKey) {
          }
          lastFetchedGroupRef.current = effectiveGroupKey

          fetchRealtimeAvailability(effectiveGroupKey, groupKeyBase)
            .then((realtimeStats) => {
              if (realtimeStats) {
                availabilityCacheRef.current[effectiveGroupKey] = realtimeStats
                setHoverInfo({
                  label: formattedLabel,
                  total: realtimeStats.total,
                  available: realtimeStats.available,
                  price: realtimeStats.price ?? groupPrice,
                  isLoadingGroup: false
                })
              }
            })
            .catch(() => {})
        }

        return
      }

      // Prefer ranges mapping when available; allow row-specific aggregation
      const rowCandidate = parsed.row
      const rangeStats = computeStatsForRangeKey(key, rowCandidate)
      if (rangeStats) {
        const displayLabel = rowCandidate || key
        setHoverInfo({
          label: formatGroupLabel(displayLabel),
          total: rangeStats.total,
          available: rangeStats.available,
          price: getRangePrice(key, rowCandidate)
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
        setHoverInfo({
          label: formatGroupLabel(displayLabel),
          total: stats.total,
          available: stats.available,
          price: getSectionPrice(key)
        })
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
      root.querySelectorAll(`[data-range-key="${key}"]`).forEach((el) => matches.push(el))
      root.querySelectorAll(`[data-section="${key}"]`).forEach((el) => matches.push(el))
      // Exact id match
      root.querySelectorAll(`#${CSS.escape(key)}`).forEach((el) => matches.push(el))
      // Exact class match
      try {
        root.querySelectorAll(`.${CSS.escape(key)}`).forEach((el) => matches.push(el))
      } catch (_) {
        // ignore CSS.escape issues
      }
      // Prefix id match (for seat-level nodes like B-lgreen-101)
      try {
        root.querySelectorAll(`[id^="${key}-"]`).forEach((el) => matches.push(el))
      } catch (_) {
        // ignore CSS.escape issues on some environments
        root.querySelectorAll('[id]').forEach((el) => {
          const id = ((el as HTMLElement).id || '').toLowerCase()
          if (id.startsWith(`${key.toLowerCase()}-`)) matches.push(el)
        })
      }
      // Prefix class token match (e.g., left-purple-H-41 where class contains left-purple-H)
      root.querySelectorAll('[class]').forEach((el) => {
        const tokens = Array.from((el as HTMLElement).classList || [])
        const lowerTokens = tokens.map((t) => t.toLowerCase())
        const kLower = key.toLowerCase()
        if (lowerTokens.some((t) => t === kLower || t.startsWith(`${kLower}-`))) {
          matches.push(el)
        }
      })
      if (matches.length > 0) return matches
      // Case-insensitive id fallback
      const lower = key.toLowerCase()
      root.querySelectorAll('[id]').forEach((el) => {
        const id = (el as HTMLElement).id || ''
        if (id && id.toLowerCase() === lower) matches.push(el)
      })
      return matches
    }

    // Build a local index to map position-color-[-zone]-row => range key
    const rowKeyIndex: Record<string, string> = {}
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      const pos = (def.position || '').toLowerCase()
      const color = (def.color || '').toLowerCase()
      const zone = (def.zone || '').toLowerCase()
      def.rows.forEach((r) => {
        const row = r.toLowerCase()
        // Incluir zona en el índice si existe para diferenciar balcony de main floor
        const idx = [pos, color, zone, row].filter(Boolean).join('-')
        rowKeyIndex[idx] = rangeKey
      })
    })

    // First, add direct matches
    for (const key of keys) {
      const matches = findElementsForKey(key)
      if (matches.length > 0) sectionSelectors.push([key, matches])
    }

    const dynamicPositions = new Set(
      Object.values(ranges)
        .map((r) => r.position?.toLowerCase())
        .filter(Boolean)
    )
    new Set(['left', 'right', 'center', 'leftcenter', 'rightcenter']).forEach((p) =>
      dynamicPositions.add(p)
    )
    const positions = dynamicPositions
    const colors = new Set([
      'orange',
      'cyan',
      'red',
      'green',
      'purple',
      'blue',
      'yellow',
      'pink',
      'brown'
    ])

    // Then, map id patterns like left-purple-N to a ranges key using rowKeyIndex
    let idPatternBindings = 0
    root.querySelectorAll('[id]').forEach((el) => {
      const id = (el as HTMLElement).id
      if (!id) return
      const lower = id.toLowerCase()
      if ((keys as Set<string>).has(lower)) return
      const parts = lower.split('-')

      if (parts.length >= 3) {
        // Caso 1: row-position-color-zone (ej: A-center-orange-balcony)
        const rowToken = parts[0]
        const posToken = parts[1]
        const colorToken = parts[2]
        const zoneToken = parts.includes('balcony') ? 'balcony' : undefined

        if (/^[a-z]{1,2}$/.test(rowToken) && positions.has(posToken) && colors.has(colorToken)) {
          const rowLetter = rowToken
          // Intentar con zona primero, luego sin zona
          const keyWithZone = [posToken, colorToken, zoneToken, rowLetter].filter(Boolean).join('-')
          const keyWithoutZone = [posToken, colorToken, rowLetter].join('-')
          const mapped = rowKeyIndex[keyWithZone] || rowKeyIndex[keyWithoutZone]
          if (mapped) {
            sectionSelectors.push([mapped, [el]])
            idPatternBindings += 1
          }
        } else {
          // Caso 2: position-color-... (ej: center-orange-H o center-orange-balcony-H)
          const pos = parts[0]
          const color = parts[1]
          if (positions.has(pos) && colors.has(color)) {
            const zoneToken2 = parts.includes('balcony') ? 'balcony' : undefined
            // tomar la última parte NO numérica como fila (maneja ...-H-41)
            const nonNumericFromRest = (() => {
              for (let i = parts.length - 1; i >= 2; i--) {
                if (!/^\d+$/.test(parts[i]) && parts[i] !== 'balcony') return parts[i]
              }
              return parts[2]
            })()
            const rowLetter = nonNumericFromRest
            // Intentar con zona primero, luego sin zona
            const keyWithZone = [pos, color, zoneToken2, rowLetter].filter(Boolean).join('-')
            const keyWithoutZone = [pos, color, rowLetter].join('-')
            const mapped = rowKeyIndex[keyWithZone] || rowKeyIndex[keyWithoutZone]
            if (mapped) {
              sectionSelectors.push([mapped, [el]])
              idPatternBindings += 1
            }
          }
        }
      }
      // NUEVO: id en formato row-color(-seat): MM-yellow-1
      if (parts.length >= 2) {
        const rowToken = parts[0]
        const colorToken = parts[1]
        if (/^[a-z]{1,2}$/.test(rowToken)) {
          const candidate = `${rowToken.toUpperCase()}-${colorToken}`
          if (ranges[candidate]) {
            sectionSelectors.push([candidate, [el]])
            idPatternBindings += 1
          }
        }
      }

      // Caso Grupo (sin fila): color-pos[-zone] o pos-color[-zone]
      if (parts.length >= 2) {
        const posToken = parts.find((p) => positions.has(p))
        const colorToken = parts.find((p) => colors.has(p))
        const zoneToken = parts.find((p) => ['balcony', 'loge'].includes(p))
        if (posToken && colorToken) {
          const gkWithZone = `${posToken}-${colorToken}${zoneToken ? `-${zoneToken}` : ''}`
          const gkWithoutZone = `${posToken}-${colorToken}`
          let gk = groupKeyToRangeKeys[gkWithZone]
            ? gkWithZone
            : groupKeyToRangeKeys[gkWithoutZone]
              ? gkWithoutZone
              : undefined
          if (!gk) {
            gk = Object.keys(groupKeyToRangeKeys).find((k) =>
              k.startsWith(`${posToken}-${colorToken}`)
            )
          }
          if (gk) {
            sectionSelectors.push([groupKeyToRangeKeys[gk][0], [el]])
            idPatternBindings += 1
          }
        }
      }
    })

    // Map class token patterns like left-purple(-balcony)-N to a ranges key
    let classPatternBindings = 0
    root.querySelectorAll('[class]').forEach((el) => {
      const classList = Array.from((el as HTMLElement).classList || [])
      for (const cls of classList) {
        const lower = (cls || '').toLowerCase()
        if (!lower) continue
        const parts = lower.split('-')
        if (parts.length >= 3) {
          // 1) Caso original: position-color-(-zone)-row
          {
            const pos = parts[0]
            const color = parts[1]
            const zoneToken = parts.includes('balcony') ? 'balcony' : undefined
            // soportar posible zona intermedia (p. ej., balcony)
            let startIdx = 2
            if (parts[2] === 'balcony') {
              startIdx = 3
            }
            const nonNumericFromRest = (() => {
              for (let i = parts.length - 1; i >= startIdx; i--) {
                if (!/^\d+$/.test(parts[i]) && parts[i] !== 'balcony') return parts[i]
              }
              return parts[startIdx]
            })()
            const rowLetter = nonNumericFromRest
            // Intentar con zona primero, luego sin zona
            const keyWithZone = [pos, color, zoneToken, rowLetter].filter(Boolean).join('-')
            const keyWithoutZone = [pos, color, rowLetter].join('-')
            const mapped = rowKeyIndex[keyWithZone] || rowKeyIndex[keyWithoutZone]
            if (mapped) {
              sectionSelectors.push([mapped, [el]])
              classPatternBindings += 1
              break
            }
          }

          // 2) Nuevo: row-color-position(-zone) (ej.: L-cyan-rightcenter, A-orange-center-balcony)
          {
            const rowToken = parts.find((p) => /^[a-z]{1,2}$/.test(p))
            const colorToken = parts.find((p) => colors.has(p))
            const positionToken = parts.find((p) => positions.has(p))
            const zoneToken = parts.find((p) => p === 'balcony')
            if (rowToken && colorToken && positionToken) {
              // Intentar con zona primero, luego sin zona
              const keyWithZone = [positionToken, colorToken, zoneToken, rowToken]
                .filter(Boolean)
                .join('-')
              const keyWithoutZone = [positionToken, colorToken, rowToken].join('-')
              const mapped = rowKeyIndex[keyWithZone] || rowKeyIndex[keyWithoutZone]
              if (mapped) {
                sectionSelectors.push([mapped, [el]])
                classPatternBindings += 1
                break
              } else {
              }
            }
          }
        }

        // 3) Caso Grupo (sin fila): color-pos[-zone] o pos-color[-zone] (ej. red-303 o 314-green-balcony)
        if (parts.length >= 2) {
          const posToken = parts.find((p) => positions.has(p))
          const colorToken = parts.find((p) => colors.has(p))
          const zoneToken = parts.find((p) => ['balcony', 'loge'].includes(p))

          if (posToken && colorToken) {
            const gkWithZone = `${posToken}-${colorToken}${zoneToken ? `-${zoneToken}` : ''}`
            const gkWithoutZone = `${posToken}-${colorToken}`
            let gk = groupKeyToRangeKeys[gkWithZone]
              ? gkWithZone
              : groupKeyToRangeKeys[gkWithoutZone]
                ? gkWithoutZone
                : undefined
            if (!gk) {
              gk = Object.keys(groupKeyToRangeKeys).find((k) =>
                k.startsWith(`${posToken}-${colorToken}`)
              )
            }
            if (gk) {
              sectionSelectors.push([groupKeyToRangeKeys[gk][0], [el]])
              classPatternBindings += 1
              continue // Skip to next class loop iteration implicitly since we're inside a for-of loop and using break/continue
            }
          }
        }
      }
    })

    // Fallback robusto: combinar tokens sueltos de classList (pos, color, zone, row)
    // Útil cuando las clases vienen separadas por espacios y no por guiones
    let classTokenBindings = 0
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      if (!def.position || !def.color) return
      const posTok = def.position.toLowerCase()
      const colorTok = def.color.toLowerCase()
      const zoneTok = def.zone ? def.zone.toLowerCase() : undefined
      def.rows.forEach((r) => {
        const rowTok = r.toLowerCase()
        root.querySelectorAll('[class]').forEach((el) => {
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

    // Additional mapping for row-color prefixes (e.g., B-lgreen-101)
    Object.entries(ranges).forEach(([rangeKey, def]) => {
      if (!def.color || def.position) return
      def.rows.forEach((r) => {
        const prefix = `${r.toLowerCase()}-${def.color!.toLowerCase()}-`
        root.querySelectorAll('[id]').forEach((el) => {
          const id = (el as HTMLElement).id || ''
          if (id.toLowerCase().startsWith(prefix)) {
            sectionSelectors.push([rangeKey, [el]])
          }
        })
      })
    })

    // Build indices to find elements by key and group
    const keyToEls = new Map<string, Element[]>()
    for (const [k, els] of sectionSelectors) {
      const acc = keyToEls.get(k) || []
      els.forEach((el) => {
        if (!acc.includes(el)) acc.push(el)
      })
      keyToEls.set(k, acc)
    }
    const groupKeyToEls = new Map<string, Element[]>()
    Object.entries(groupKeyToRangeKeys).forEach(([gk, rks]) => {
      const acc: Element[] = []
      rks.forEach((rk) => {
        const els = keyToEls.get(rk) || []
        els.forEach((el) => {
          if (!acc.includes(el)) acc.push(el)
        })
      })
      groupKeyToEls.set(gk, acc)
    })

    const listeners: Array<() => void> = []
    for (const [key, elements] of sectionSelectors) {
      for (const el of elements) {
        // Fix inner paths that might have fill="none" overriding transparent fills, and collect target shapes
        const targets: SVGElement[] = []
        const fixShape = (shape: Element) => {
          const sEl = shape as SVGElement
          sEl.setAttribute('pointer-events', 'bounding-box')
          if ((shape as HTMLElement).style) {
            ;(shape as HTMLElement).style.pointerEvents = 'bounding-box'
            ;(shape as HTMLElement).style.cursor = 'pointer'
          }
          const currentFill = sEl.getAttribute('fill')
          if (!currentFill || currentFill === 'none') {
            sEl.setAttribute('fill', 'transparent')
          }
          targets.push(sEl)
        }

        // Apply bounding-box to the container element itself (especially for <g> groups)
        el.setAttribute('pointer-events', 'bounding-box')
        if ((el as HTMLElement).style) {
          ;(el as HTMLElement).style.pointerEvents = 'bounding-box'
          ;(el as HTMLElement).style.cursor = 'pointer'
        }

        if (['path', 'rect', 'circle', 'polygon', 'polyline'].includes(el.tagName.toLowerCase())) {
          fixShape(el)
        }
        el.querySelectorAll('path, rect, circle, polygon, polyline').forEach(fixShape)

        // If no recognizable shapes, just use the element itself as fallback
        if (targets.length === 0) targets.push(el as SVGElement)

        // Track highlighted elements for group hover to restore on leave
        let groupApplied: Array<{
          el: SVGElement
          prevOpacity: string
          prevStroke: string
          prevStrokeWidth: string
        }> = []

        const enter = (ev: MouseEvent) => {
          // Apply visual hover (opacity or stroke change)
          targets.forEach((t) => {
            if (t.getAttribute('data-ts-selected') === 'true') return
            groupApplied.push({
              el: t,
              prevOpacity: t.getAttribute('opacity') || '',
              prevStroke: t.getAttribute('stroke') || '',
              prevStrokeWidth: t.getAttribute('stroke-width') || ''
            })
            t.setAttribute('opacity', '0.6')
            // Si quieres añadir un borde extra en hover:
            // t.setAttribute('stroke', '#ffffff')
            // t.setAttribute('stroke-width', '2')
          })

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

          if (groupApplied.length > 0) {
            groupApplied.forEach(
              ({ el: gEl, prevOpacity: pO, prevStroke: pS, prevStrokeWidth: pW }) => {
                if (gEl.getAttribute('data-ts-selected') === 'true') return

                pO ? gEl.setAttribute('opacity', pO) : gEl.removeAttribute('opacity')
                pS ? gEl.setAttribute('stroke', pS) : gEl.removeAttribute('stroke')
                pW ? gEl.setAttribute('stroke-width', pW) : gEl.removeAttribute('stroke-width')
              }
            )
            groupApplied = []
          }
        }
        const doClick = async (ev: MouseEvent) => {
          const targetId = (
            (el as HTMLElement).id ||
            (ev.target as HTMLElement)?.id ||
            ''
          ).toString()
          const parsed = parseElementId(targetId)
          const groupKey = rangeKeyToGroupKey[key]

          if (!groupKey) {
            // Rango suelto sin grupo (poco común en map1/map2).
            const list = computeSeatsForRangeKey(key, parsed.row || undefined)
            if (list.length > 0) {
              onSelectSection({ label: toTitleCaseFromKebab(key), seats: list, groupId: key })
            }
            return
          }

          // Asientos de la sección on-demand (/seats?group=), no de una lista global.
          const groupSeats = await loadGroupSeats(groupKey)
          if (groupSeats.length === 0) return
          onSelectSection({
            label: toTitleCaseFromKebab(groupKey),
            seats: groupSeats,
            groupId: groupKey
          })
        }

        const click = async (ev: MouseEvent) => {
          if (isLoadingGroup || pendingClickRef.current) {
            return
          }
          pendingClickRef.current = true
          try {
            await doClick(ev)
          } finally {
            pendingClickRef.current = false
          }
        }

        el.addEventListener('mouseenter', enter as EventListener)
        el.addEventListener('mousemove', move as EventListener)
        el.addEventListener('mouseleave', leave)
        el.addEventListener('click', click as unknown as EventListener)
        listeners.push(() => {
          el.removeEventListener('mouseenter', enter as EventListener)
          el.removeEventListener('mousemove', move as EventListener)
          el.removeEventListener('mouseleave', leave)
          el.removeEventListener('click', click as unknown as EventListener)
          const elHTMLElement = el as HTMLElement
          elHTMLElement.style.pointerEvents = ''
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
      listeners.forEach((off) => off())
    }
    // priceByRange NO va en deps: cambia al abrir cada sección y re-montaría todos los
    // listeners (hover errático). El precio del tooltip ya llega por fetchRealtimeAvailability.
  }, [svgContent, sectionStats, ranges, seats, eventId, rowZoneMap, loadGroupSeats])

  if (loading) {
    return (
      <div className='w-full flex items-center justify-center py-16'>
        <span className='h-8 w-8 rounded-full border-2 border-white/15 border-t-brand-hi animate-spin' />
      </div>
    )
  }
  if (error) {
    return (
      <div className='mx-auto max-w-md rounded-glass-md border border-accent-coral/30 bg-[rgba(255,177,200,0.08)] px-4 py-3 text-center text-[12.5px] text-white/80'>
        We couldn&apos;t load the seat map. {error}
      </div>
    )
  }

  return (
    <div>
      <div className='rounded-glass-lg border border-white/[0.10] bg-white/[0.04] p-3 backdrop-blur-glass lg:p-4'>
        <div className='pt-1.5 text-center font-display text-[10px] font-bold uppercase tracking-[0.22em] text-white/55'>
          STAGE
        </div>
        <div
          aria-hidden
          className='mx-8 mt-1.5 h-1 rounded-pill'
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
          }}
        />

        {/* El id va en el wrapper exterior (sin transform) para que el tooltip se
            posicione bien; el SVG se inyecta dentro del ZoomPanContainer. */}
        <div id='inline-seating-svg-container' className='relative mt-2'>
          <ZoomPanContainer
            className='h-[380px] rounded-glass-md bg-black/30 sm:h-[480px] lg:h-[620px]'
            minScale={0.6}
            maxScale={6}
            initialScale={1}
            ariaLabel='Venue map. Scroll or pinch to zoom, drag to pan. Click a section to view its seats.'
          >
            <div
              className='w-[min(94vw,1000px)]'
              dangerouslySetInnerHTML={{
                __html: svgContent
                  .replace(/<title[\s\S]*?<\/title>/gi, '')
                  .replace(/<desc[\s\S]*?<\/desc>/gi, '')
                  .replace(/\s+title="[^"]*"/gi, '')
                  .replace(
                    /<svg([^>]*)>/gi,
                    '<svg$1 style="width: 100%; height: auto; max-width: 100%; user-select: none; -webkit-user-select: none;" class="w-full h-auto" preserveAspectRatio="xMidYMid meet">'
                  )
              }}
            />
          </ZoomPanContainer>

          {tooltipVisible && hoverInfo && tooltipPos && (
            <div
              className='pointer-events-none absolute z-20 rounded-glass-sm border border-white/12 bg-[#140a24]/95 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-glass-md backdrop-blur-glass'
              style={{ left: tooltipPos.x + 12, top: tooltipPos.y + 12 }}
            >
              {hoverInfo.isSeatLevel
                ? `${hoverInfo.label} · ${hoverInfo.available === 1 ? 'available' : 'taken'}`
                : hoverInfo.isLoadingGroup
                  ? `${hoverInfo.label}: …`
                  : `${hoverInfo.label} · ${hoverInfo.available}/${hoverInfo.total} available`}
            </div>
          )}
        </div>

        <div className='mt-2 text-center text-[10.5px] font-medium text-white/55'>
          Tap a section to view its seats
        </div>
      </div>

      <PriceRangeLegend legend={legend} />
    </div>
  )
}

// Tonos tomados del propio SVG del Copernicus para que la leyenda COINCIDA con el mapa.
const RANGE_COLORS: Record<string, string> = {
  celeste: '#93cddc',
  cyan: '#93cddc',
  rojo: '#ea0a0a',
  red: '#ea0a0a',
  verde: '#c2d69b',
  green: '#c2d69b',
  morado: '#b2a1c7',
  purple: '#b2a1c7',
  anaranjado: '#b97034',
  orange: '#b97034',
  // otros rangos (map1/map2) — se afinan al validar esos mapas
  amarillo: '#F6C84A',
  yellow: '#F6C84A',
  rosa: '#ED3689',
  pink: '#ED3689',
  azul: '#3B82F6',
  blue: '#3B82F6'
}

/** Nombre legible por color (mientras no llegó el price_range real del backend). */
const COLOR_LABELS: Record<string, string> = {
  cyan: 'Celeste',
  red: 'Rojo',
  green: 'Verde',
  purple: 'Morado',
  orange: 'Anaranjado',
  celeste: 'Celeste',
  rojo: 'Rojo',
  verde: 'Verde',
  morado: 'Morado',
  anaranjado: 'Anaranjado'
}

/** Leyenda de rangos de precio (color → "desde $X"), derivada de los asientos. */
function PriceRangeLegend({
  legend
}: {
  legend: Array<{ color: string; name: string; price?: number }>
}) {
  if (legend.length === 0) return null

  return (
    <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3'>
      {legend.map(({ color, name, price }) => (
        <div
          key={color}
          className='flex items-center gap-2.5 rounded-glass-sm border border-white/[0.10] bg-white/[0.04] px-3 py-2.5'
        >
          <span
            aria-hidden
            className='h-3.5 w-3.5 shrink-0 rounded-sm'
            style={{ background: RANGE_COLORS[color.toLowerCase()] || '#B57BE8' }}
          />
          <div className='min-w-0'>
            <div className='truncate font-display text-[12px] font-semibold capitalize tracking-tight text-white'>
              {name}
            </div>
            <div className='mt-0.5 font-display text-[10px] tabular-nums text-white/55'>
              {typeof price === 'number' ? `From $${price.toFixed(2)}` : '…'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
