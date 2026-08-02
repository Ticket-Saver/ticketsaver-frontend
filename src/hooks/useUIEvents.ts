import { useMemo } from 'react'
import { useEvents } from '../router/eventsContext'
import { isVisibleEvent } from '../services/eventAdapter'
import { hiEventsToUIEvents } from '../services/hiEventsAdapter'
import type { Category, CategoryFilter, UIEvent } from '../types/uiEvent'

interface UseUIEventsResult {
  /** True hasta que carga el listado de eventos. */
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
  /** Devuelve el UIEvent por su id (slug). */
  byLabel: (label: string | undefined) => UIEvent | undefined
  /** Devuelve el UIEvent por su id numérico de HiEvents (eventId). */
  byId: (id: string | undefined) => UIEvent | undefined
  /** Lista de categorías con al menos 1 evento visible (sin 'Other'). */
  availableCategories: Category[]
}

const inNDays = (e: UIEvent, n: number): boolean => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const horizon = startOfToday.getTime() + n * 24 * 60 * 60 * 1000
  return e.startsAt.getTime() >= startOfToday.getTime() && e.startsAt.getTime() < horizon
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

  return useMemo(() => {
    const loading = events === null
    const all = hiEventsToUIEvents(events)

    const visible = all
      .filter(isVisibleEvent)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

    const hero = visible.filter((e) => e.hero)
    const thisWeek = visible.filter((e) => inNDays(e, 7))
    const tonight = visible.filter(isToday)

    const availableCategories = Array.from(new Set(visible.map((e) => e.category))).filter(
      (c): c is Category => c !== 'Other'
    )

    const byCategory = (cat: CategoryFilter): UIEvent[] =>
      cat === 'All' ? visible : visible.filter((e) => e.category === cat)

    const byLabel = (label: string | undefined): UIEvent | undefined =>
      label ? all.find((e) => e.id === label) : undefined

    const byId = (id: string | undefined): UIEvent | undefined =>
      id ? all.find((e) => e.eventId === id) : undefined

    return {
      loading,
      all,
      visible,
      hero,
      thisWeek,
      tonight,
      byCategory,
      byLabel,
      byId,
      availableCategories
    }
  }, [events])
}
