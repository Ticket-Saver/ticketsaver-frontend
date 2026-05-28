import { useMemo } from 'react'
import { useEvents } from '../router/eventsContext'
import { useVenues } from '../router/venuesContext'
import { isVisibleEvent, toUIEvents } from '../services/eventAdapter'
import type { Category, CategoryFilter, UIEvent } from '../types/uiEvent'

interface UseUIEventsResult {
  /** True hasta que cargan ambos providers (events + venues). */
  loading: boolean
  /** Todos los UIEvents adaptados (incluye hidden + expired). */
  all: UIEvent[]
  /** Los visibles, ordenados por fecha más próxima. */
  visible: UIEvent[]
  /** Marcados como hero. */
  hero: UIEvent[]
  /** Próximos 7 días — útil para "This week". */
  thisWeek: UIEvent[]
  /** Hoy mismo. */
  tonight: UIEvent[]
  /** Filtrado por categoría. 'All' devuelve todos los visibles. */
  byCategory: (cat: CategoryFilter) => UIEvent[]
  /** Devuelve el UIEvent por su event_label. */
  byLabel: (label: string | undefined) => UIEvent | undefined
  /** Lista de categorías con al menos 1 evento visible (sin 'Other'). */
  availableCategories: Category[]
}

const inNDays = (e: UIEvent, n: number): boolean => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const horizon = startOfToday.getTime() + n * 24 * 60 * 60 * 1000
  return (
    e.startsAt.getTime() >= startOfToday.getTime() &&
    e.startsAt.getTime() < horizon
  )
}

const isToday = (e: UIEvent): boolean => {
  const now = new Date()
  return (
    e.startsAt.getFullYear() === now.getFullYear() &&
    e.startsAt.getMonth() === now.getMonth() &&
    e.startsAt.getDate() === now.getDate()
  )
}

export const useUIEvents = (): UseUIEventsResult => {
  const { events } = useEvents()
  const { venues } = useVenues()

  return useMemo(() => {
    const loading = events === null || venues === null
    const all = toUIEvents(events, venues)

    const visible = all
      .filter(isVisibleEvent)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

    const hero = visible.filter((e) => e.hero)
    const thisWeek = visible.filter((e) => inNDays(e, 7))
    const tonight = visible.filter(isToday)

    const availableCategories = Array.from(
      new Set(visible.map((e) => e.category))
    ).filter((c): c is Category => c !== 'Other')

    const byCategory = (cat: CategoryFilter): UIEvent[] =>
      cat === 'All' ? visible : visible.filter((e) => e.category === cat)

    const byLabel = (label: string | undefined): UIEvent | undefined =>
      label ? all.find((e) => e.id === label) : undefined

    return {
      loading,
      all,
      visible,
      hero,
      thisWeek,
      tonight,
      byCategory,
      byLabel,
      availableCategories
    }
  }, [events, venues])
}
