import { createContext, useContext, useEffect, useState } from 'react'

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
        const response = await fetch(githubApiUrl, options)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: EventsData = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events: ', error)
      }
    }
    fetchEvents()
  }, [githubApiUrl, token])

  return <EventsContext.Provider value={{ events }}>{children}</EventsContext.Provider>
}

export function useEvents() {
  return useContext(EventsContext)
}
