import { createContext, useContext, useEffect, useState } from 'react'
import { cacheService } from '../services/cacheService'
import { fallbackDataService } from '../services/fallbackDataService'

// Define la interfaz para un evento
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

interface EventsData {
  [key: string]: Event
}

interface EventsContextValue {
  events: EventsData | null
}

const EventsContext = createContext<EventsContextValue>({ events: null })

export const EventsProvider = ({ children }: { children: any }) => {
  const [events, setEvents] = useState<EventsData | null>(null)
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events.json`
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Verificar si está en modo emergencia
        if (fallbackDataService.isEmergencyMode()) {
          console.warn('🚨 Modo emergencia: Usando eventos locales')
          const localEvents = await fallbackDataService.getLocalEvents()
          setEvents(localEvents)
          return
        }

        // Usar caché con TTL de 10 minutos para eventos
        const data = await cacheService.fetchWithCache<EventsData>(githubApiUrl, options, {
          ttl: 10 * 60 * 1000, // 10 minutos
          useLocalStorage: true
        })
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events, usando fallback local: ', error)
        // Si falla GitHub, usar datos locales como fallback
        const localEvents = await fallbackDataService.getLocalEvents()
        setEvents(localEvents)
      }
    }
    fetchEvents()
  }, [githubApiUrl, token])

  return <EventsContext.Provider value={{ events }}>{children}</EventsContext.Provider>
}

export function useEvents() {
  return useContext(EventsContext)
}
