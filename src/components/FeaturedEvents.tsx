import { useState, useEffect, useMemo } from 'react'
import { EventCard } from './EventCard'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { fetchDescription, fetchGitHubImage } from './Utils/FetchDataJson'
import { useEvents } from '../router/eventsContext'
import { useVenues } from '../router/venuesContext'

interface Event {
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

interface Location {
  address: string
  city: string
  country: string
  maps_url: string
  zip_code: string
}

interface Venue {
  capacity: number
  venue_label: string
  location: Location
  venue_name: string
  seatmap: boolean
}

interface EventWithVenue extends Event {
  venue: Venue | undefined
}

export default function FeaturedEvents() {
  // Obtenemos los datos desde los contextos
  const { events: contextEvents } = useEvents()
  const { venues: contextVenues } = useVenues()

  // Estados locales para trabajar con los datos filtrados y combinados
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [eventsWithVenues, setEventsWithVenues] = useState<EventWithVenue[]>([])
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [images, setImages] = useState<Record<string, string>>({})

  // Definir options con token (usamos useMemo para que sea estable)
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }),
    [token]
  )

  // Filtrar eventos: descartamos los eliminados y aquellos cuya fecha haya expirado (más 2 días)
  useEffect(() => {
    if (contextEvents) {
      const eventsArray: Event[] = Object.values(contextEvents)
      const currentDate = new Date()
      const filteredEvents = eventsArray.filter((event) => {
        if (event.event_deleted_at) return false
        const endDate = new Date(event.event_date)
        endDate.setDate(endDate.getDate() + 2)
        return endDate.getTime() > currentDate.getTime()
      })
      setEvents(filteredEvents)
    }
  }, [contextEvents])

  // Convertir venues del contexto a array
  useEffect(() => {
    if (contextVenues) {
      const venuesArray: Venue[] = Object.values(contextVenues)
      setVenues(venuesArray)
    }
  }, [contextVenues])

  // Combinar cada evento con su venue correspondiente
  useEffect(() => {
    const combinedData = events.map((event) => {
      const venue = venues.find((v) => v.venue_label === event.venue_label)
      return { ...event, venue }
    })
    setEventsWithVenues(combinedData)
  }, [events, venues])

  // Obtener las descripciones de cada evento usando las options
  useEffect(() => {
    const fetchAllDescriptions = async () => {
      const descriptionsDict: Record<string, string> = {}
      for (const event of events) {
        const desc = await fetchDescription(event.event_label, options)
        descriptionsDict[event.event_label] = desc.slice(0, 250) + '...'
      }
      setDescriptions(descriptionsDict)
    }
    if (events.length > 0) {
      fetchAllDescriptions()
    }
  }, [events, options])

  // Obtener las imágenes de cada evento usando las options
  useEffect(() => {
    const fetchAllImages = async () => {
      const imagesDict: Record<string, string> = {}
      for (const event of events) {
        const img = await fetchGitHubImage(event.event_label)
        imagesDict[event.event_label] = img
      }
      setImages(imagesDict)
    }
    if (events.length > 0) {
      fetchAllImages()
    }
  }, [events, options])

  // Generación o lectura del sessionId (para tracking u otro fin)
  const setSessionId = useState<string>('')[1]
  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=')
      if (cookieName.trim() === name) {
        return cookieValue
      }
    }
    return null
  }
  useEffect(() => {
    const existingSessionId = getCookie('sessionId')
    if (!existingSessionId) {
      const newSessionId = uuidv4()
      setSessionId(newSessionId)
      document.cookie = `sessionId=${newSessionId}; path=/`
    } else {
      setSessionId(existingSessionId)
    }
  }, [])

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }

  // Lista de eventos que queremos ocultar
  const hiddenEventLabels = [
    'ice_spice.01',
    'bossman_dlow.01',
    'bigxthaplug.01',
    'geazy_claytons.01',
    'deorro_claytons.01',
    'deebaby_zro.01',
    'insane_clown_posse.01',
    'steve_aoki.01',
    "shoreline_mafia.01"
  ]

  return (
    <section className='min-h-screen flex flex-col justify-center py-10 md:py-16 bg-base-300'>
      <div className='container mx-auto'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Select your city!</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>
            Don’t miss out! Buy now before tickets sell out!.
          </p>
        </div>
        <div
          className={`grid ${
            eventsWithVenues.length === 1
              ? 'grid-cols-1 place-items-center'
              : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'
          } gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}
        >
          {eventsWithVenues.map((event, index) =>
            !hiddenEventLabels.includes(event.event_label) ? (
              event.tricket_url ? (
                <a href={event.tricket_url} key={index} target='_blank' rel='noopener noreferrer'>
                  <EventCard
                    id={event.eventId}
                    eventId={event.eventId}
                    title={event.event_name}
                    description={descriptions[event.event_label]}
                    thumbnailURL={images[event.event_label]}
                    venue={event.venue?.venue_name || event.venue_label}
                    date={new Date(event.event_date)
                      .toLocaleDateString('en-GB', optionsDate)
                      .replace(',', '')}
                    city={event.venue?.location.city}
                  />
                </a>
              ) : (
                <Link
                  to={`/event/${event.event_name}/${event.venue_label}/${event.event_date}/${event.event_label}/${event.event_deleted_at}`}
                  key={index}
                >
                  <EventCard
                    id={event.eventId}
                    eventId={event.eventId}
                    title={event.event_name}
                    description={descriptions[event.event_label]}
                    thumbnailURL={images[event.event_label]}
                    venue={event.venue?.venue_name || event.venue_label}
                    date={new Date(event.event_date)
                      .toLocaleDateString('en-GB', optionsDate)
                      .replace(',', '')}
                    city={event.venue?.location.city}
                  />
                </Link>
              )
            ) : null
          )}
        </div>
      </div>
    </section>
  )
}
