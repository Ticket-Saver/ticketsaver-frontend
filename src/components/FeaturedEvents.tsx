import { useState, useEffect } from 'react'
import { EventCard } from './EventCard'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useFetchJson, fetchDescription, fetchGitHubImage } from './Utils/FetchDataJson'

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
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [images, setImages] = useState<Record<string, string>>({})
  const [eventsWithVenues, setEventsWithVenues] = useState<EventWithVenue[]>([])

  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events.json`
  const githubApiUrl2 = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const hieventsUrl = `${import.meta.env.VITE_HIEVENTS_API_URL as string}/events?page=1&per_page=20&query=&sort_by=&sort_direction=&eventsStatus=upcoming`
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const token2 = import.meta.env.VITE_TOKEN_HIEVENTS
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }
 
  useEffect(() => {
    const fetchEventsFromAPI = async () => {
      try {
        const response = await fetch(
          `${hieventsUrl}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token2}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
                console.log('Fetched events:', data.data);  // Verifica los datos obtenidos

        const filteredEvents: EventWithVenue[] = data.data.map((event: any) => ({
          id: event.id,
          event_label: event.map, // Reemplaza espacios y guiones
          eventId: event.id,
          event_name: event.title,
          images: event.images ||'',
          city: event.settings?.location_details?.city || '-', // Añadido operador opcional
          event_date: new Date(event.end_date).toISOString().split('T')[0], // Convertir y formatear la fecha
          description: event.description.replace(/<\/?[^>]+(>|$)/g, ''),
          venue_label:'claytonbar_tx',
          venue: {
            venue_name: 'claytonbar_tx',
          }
        }));
// Añadir solo eventos que no estén en el estado previamente
setEvents((prevEvents) => {
  const newEvents = filteredEvents.filter((newEvent) =>
    !prevEvents.some((event) => event.eventId === newEvent.eventId)
  )
  return [...prevEvents, ...newEvents]
})      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEventsFromAPI()
  }, [token])

  const { data } = useFetchJson(githubApiUrl, options)

  useEffect(() => {
    let filteredEvents: Event[] = []

    if (data) {
      const eventsArray = Object.values(data)
      const currentDate = new Date()

      filteredEvents = eventsArray.filter((event) => {
        if (event.event_deleted_at) {
          return false
        }

        const endDate = new Date(event.event_date)
        endDate.setDate(endDate.getDate() + 2)

        return endDate.getTime() > currentDate.getTime()
      })
    }
    setEvents(filteredEvents)
  }, [data])

  const { data: data2 } = useFetchJson(githubApiUrl2, options)

  useEffect(() => {
    let filteredVenue: Venue[] = []

    if (data2) {
      const venuesArray = Object.values(data2)
      filteredVenue = venuesArray
    }

    setVenues(filteredVenue)
  }, [data2])

  useEffect(() => {
    if (events.length > 0 && venues.length > 0) {
      const combinedData = events.map((event) => {
        const venue = venues.find((v) => v.venue_label === event.venue_label)
        return { ...event, venue }
      })
  
   // Evitar duplicados al combinar
   setEventsWithVenues((prevEventsWithVenues) => {
    const uniqueEvents = combinedData.filter((newEvent) =>
      !prevEventsWithVenues.some((event) => event.eventId === newEvent.eventId)
    )
    return [...prevEventsWithVenues, ...uniqueEvents]
  })
}
}, [events, venues])
  useEffect(() => {
   console.log('Events with venues:', eventsWithVenues);
  }, [eventsWithVenues])
  

  useEffect(() => {
    const fetchAllDescriptions = async () => {
      const descriptionsDict: Record<string, string> = {}

      for (const event of events) {
        const description = await fetchDescription(event.event_label, options)
        descriptionsDict[event.event_label] = description.slice(0, 250) + '...'
      }

      setDescriptions(descriptionsDict)
    }

    if (events.length > 0) {
      fetchAllDescriptions()
    }
  }, [events])

  useEffect(() => {
    const fetchAllImages = async () => {
      const imagesDict: Record<string, string> = {}

      for (const event of events) {
        const image = await fetchGitHubImage(event.event_label)
        imagesDict[event.event_label] = image
      }

      setImages(imagesDict)
    }

    if (events.length > 0) {
      fetchAllImages()
    }
  }, [events])

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }

  return (
    <section className='py-10 md:py-16 bg-base-300'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Select your city!</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>
            Don’t miss out! Buy now before tickets sell out!.
          </p>
        </div>
        <div
          className={`grid ${eventsWithVenues.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}
        >
          
          {eventsWithVenues.map((event, index) =>
          
            event.tricket_url ? (
              <a href={event.tricket_url} key={index} target='_blank' rel='noopener noreferrer'   style={{ width: '100%' }}
>
                <EventCard
                  key={index}
                  id={event.eventId}
                  eventId={event.eventId}
                  title={event.event_name}
                  description={descriptions[event.event_label]} // Add description if available
                  thumbnailURL={
                    (event.images && event.images[0]?.url) || images[event.event_label] || "/default.jpg"
                  }                  venue={event.venue?.venue_name || event.venue_label}
                  date={new Date(event.event_date)
                    .toLocaleDateString('en-GB', optionsDate)
                    .replace(',', '')}
                  city={event.venue?.location.city || event.city} // Pass the city property from the venue object
                />
              </a>
            ) : (
              <Link   style={{ width: '100%' }}
             // path='/event/:name/:venue/:date/:label/:delete?'
                to={`/event/${encodeURIComponent(event.event_name)}/${
                  event.id ? event.id : event.venue_label
                }/${event.event_date}/${
                  event.event_label
                }/${event.event_deleted_at}`}
                key={index}
              >
                <EventCard
                  key={index}
                  id={event.eventId}
                  eventId={event.eventId}
                  title={event.event_name}
                  description={descriptions[event.event_label] || event.description ||''} // Add description if available
                  thumbnailURL={
                    (event.images && event.images[0]?.url) || images[event.event_label] || "/default.jpg"
                  }                  venue={event.venue?.venue_name || event.venue_label}
                  date={new Date(event.event_date)
                    .toLocaleDateString('en-GB', optionsDate)
                    .replace(',', '')}
                  city={event.venue?.location.city ||event.city} // Pass the city property from the venue object
                />
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  )
}
