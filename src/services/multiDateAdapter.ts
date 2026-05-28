import type { UIEvent } from '../types/uiEvent'

/**
 * Agrupa UIEvents por artista para soportar selectores multi-fecha.
 *
 * La heurística actual usa `event_name` normalizado (lowercase + trim) como
 * clave. Eventos del mismo artista en diferentes ciudades/fechas comparten
 * el mismo `event_name` por convención en el schema GitHub.
 *
 * El B3 sólo lee aquí; si el cliente quiere granularidad más fina (tour,
 * leg), podemos enriquecer el schema y la clave acá sin tocar la UI.
 */

export interface DateGroup {
  /** event_name normalizado — sirve como id estable. */
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

const uniqueOrdered = <T,>(arr: T[]): T[] => Array.from(new Set(arr))

export const groupByArtist = (events: UIEvent[]): Map<string, DateGroup> => {
  const map = new Map<string, DateGroup>()

  for (const ev of events) {
    const key = normalizeArtistKey(ev.title)
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

export const getDatesForArtist = (
  events: UIEvent[],
  artistName: string | undefined
): UIEvent[] => {
  if (!artistName) return []
  const key = normalizeArtistKey(artistName)
  const groups = groupByArtist(events)
  return groups.get(key)?.instances ?? []
}

export const getGroupForEvent = (
  events: UIEvent[],
  event: UIEvent
): DateGroup | undefined => {
  const key = normalizeArtistKey(event.title)
  return groupByArtist(events).get(key)
}
