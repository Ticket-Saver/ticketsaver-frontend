import type { UIEvent } from '../types/uiEvent'

/**
 * Agrupa UIEvents en series multi-fecha para el selector de fechas.
 *
 * Clave de agrupación (Fase 6.5):
 *  1. `seriesId` real de HiEvents si existe → todas las funciones del mismo
 *     evento comparten ese id (cabecera = evento "plantilla"). Es la fuente
 *     fiable: distingue dos artistas homónimos y no depende del texto.
 *  2. Fallback al `event_name` normalizado (lowercase + trim) para eventos sin
 *     `seriesId` (sueltos, schema viejo de GitHub, datos previos a la migración).
 *
 * La UI sólo lee de acá; cambiar la heurística no toca componentes.
 */

export interface DateGroup {
  /** Clave estable del grupo (series:<id> o title:<slug>). */
  artistKey: string
  /** Nombre original (del primer match). */
  artistName: string
  /** Instances ordenadas por fecha ascendente. */
  instances: UIEvent[]
  /** Ciudades únicas (orden de aparición). */
  cities: string[]
}

const normalizeArtistKey = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

/** Clave de serie: prioriza `seriesId`; si no, cae al título normalizado. */
const keyForEvent = (ev: UIEvent): string =>
  ev.seriesId != null
    ? `series:${ev.seriesId}`
    : `title:${normalizeArtistKey(ev.title)}`

const uniqueOrdered = <T,>(arr: T[]): T[] => Array.from(new Set(arr))

export const groupByArtist = (events: UIEvent[]): Map<string, DateGroup> => {
  const map = new Map<string, DateGroup>()

  for (const ev of events) {
    const key = keyForEvent(ev)
    const existing = map.get(key)
    if (existing) {
      existing.instances.push(ev)
      if (ev.city && !existing.cities.includes(ev.city)) {
        existing.cities.push(ev.city)
      }
    } else {
      map.set(key, {
        artistKey: key,
        artistName: ev.title,
        instances: [ev],
        cities: ev.city ? [ev.city] : []
      })
    }
  }

  // Ordenamos cada grupo por fecha
  for (const group of map.values()) {
    group.instances.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    group.cities = uniqueOrdered(group.cities)
  }

  return map
}

/**
 * Fechas de la serie a la que pertenece `event`. Agrupa por `seriesId` real y,
 * para eventos sueltos sin serie, cae al título. Es el reemplazo series-aware de
 * `getDatesForArtist` y el que debe usar el detalle.
 */
export const getDatesForEvent = (
  events: UIEvent[],
  event: UIEvent | null | undefined
): UIEvent[] => {
  if (!event) return []
  const key = keyForEvent(event)
  return groupByArtist(events).get(key)?.instances ?? []
}

/**
 * Variante legacy basada sólo en el nombre del artista (sin contexto de serie).
 * Se mantiene para llamadores que no tienen el UIEvent completo; cuando puedas,
 * preferí `getDatesForEvent`.
 */
export const getDatesForArtist = (
  events: UIEvent[],
  artistName: string | undefined
): UIEvent[] => {
  if (!artistName) return []
  const key = normalizeArtistKey(artistName)
  return events.filter((ev) => normalizeArtistKey(ev.title) === key)
}

export const getGroupForEvent = (
  events: UIEvent[],
  event: UIEvent
): DateGroup | undefined => {
  return groupByArtist(events).get(keyForEvent(event))
}
