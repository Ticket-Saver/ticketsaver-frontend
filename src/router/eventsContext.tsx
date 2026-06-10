import { createContext, useContext, useEffect, useState } from 'react'
import { hiEventsService } from '../services/hiEventsService'
import type { HiEventPublic } from '../types/hievents'

/**
 * Schema viejo (GitHub). Se CONSERVA aunque la fuente ahora sea HiEvents:
 * `hiEventsAdapter` lo usa para rellenar `UIEvent.raw` (Event sintético), y lo
 * importan `eventAdapter`/`uiEvent`. No eliminar sin migrar esos consumidores.
 */
export interface Event {
  eventId: string
  event_date: string
  event_hour: string
  event_name: string
  venue_label: string
  event_label: string
  event_deleted_at: string | null
  sale_starts_at: string
  tricket_url: string
}

interface EventsContextValue {
  /** Eventos crudos del listado de HiEvents (LIVE, upcoming). */
  events: HiEventPublic[] | null
}

const EventsContext = createContext<EventsContextValue>({ events: null })

export const EventsProvider = ({ children }: { children: any }) => {
  const [events, setEvents] = useState<HiEventPublic[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetchEvents = async () => {
      try {
        // Listado de producción: HiEvents /events (LIVE, upcoming). Requiere token.
        const list = await hiEventsService.listEvents({ eventsStatus: 'upcoming', only_live: true })
        if (!cancelled) setEvents(list)
      } catch (error) {
        console.error('Error listando eventos de HiEvents:', error)
        if (!cancelled) setEvents([])
      }
    }
    fetchEvents()
    return () => {
      cancelled = true
    }
  }, [])

  return <EventsContext.Provider value={{ events }}>{children}</EventsContext.Provider>
}

export function useEvents() {
  return useContext(EventsContext)
}
