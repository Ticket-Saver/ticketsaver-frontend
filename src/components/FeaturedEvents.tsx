import { useState, useEffect } from 'react'
import { EventCard } from './EventCard'
import { Link } from 'react-router-dom'
import { useFetchJson } from './Utils/FetchDataJson'
import { API_CONFIG } from '../config/api'

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
  images: { url: string; type: string }[]
  city: string
  id: string
  description: string
  ticket_sales_start_date: string | null
  timezone: string
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState<EventWithVenue[]>([])
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})

  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events.json`
  const hieventsUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS}?page=1&per_page=20&query=&sort_by=&sort_direction=&eventsStatus=upcoming&only_live=true`
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const token2 = import.meta.env.VITE_TOKEN_HIEVENTS

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }

  // Fetch de eventos de la API
  useEffect(() => {
    const fetchEventsFromAPI = async () => {
      try {
        const response = await fetch(hieventsUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token2}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched events:', data.data)

        const formattedEvents: EventWithVenue[] = data.data.map((event: any) => {
          const locationDetails = event.settings?.location_details || {}
          const venueName = locationDetails.venue_name || event.venue_name || ''

          return {
            eventId: event.id,
            event_name: event.title,
            event_label: event.map || 'general',
            event_date: event.start_date,
            event_hour: event.event_hour || '',
            venue_label: 'default_venue',
            event_deleted_at: null,
            sale_starts_at: '',
            tricket_url: '',
            id: event.id,
            images: event.images || [],
            city: locationDetails.city || '-',
            description: event.description?.replace(/<\/?[^>]+(>|$)/g, '') || '',
            ticket_sales_start_date: event.ticket_sales_start_date || null,
            timezone: event.timezone || event.settings?.timezone || 'UTC',
            venue: {
              venue_name: venueName || 'Default Venue',
              venue_label: venueName || 'default_venue',
              capacity: 0,
              seatmap: false,
              location: {
                city: locationDetails.city || '-',
                address: '',
                country: '',
                maps_url: '',
                zip_code: ''
              }
            }
          }
        })

        setEvents(formattedEvents)
        //  console.log(formattedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEventsFromAPI()
  }, [token2, hieventsUrl])

  // Fetch de descripciones desde GitHub
  const { data: githubData } = useFetchJson(githubApiUrl, options)

  useEffect(() => {
    if (githubData) {
      const descriptionsDict: Record<string, string> = {}
      Object.values(githubData).forEach((event: any) => {
        if (event.description) {
          descriptionsDict[event.event_label] = event.description.slice(0, 250) + '...'
        }
      })
      setDescriptions(descriptionsDict)
    }
  }, [githubData])

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }

  const hasUpcomingEvents = events.some(
    (event) => event.ticket_sales_start_date && new Date(event.ticket_sales_start_date) > new Date()
  )

  return (
    <section className='py-10 md:py-16 bg-base-300'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Select your city!!</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>
            Don't miss out! Buy now before tickets sell out!!
          </p>
          {/* {hasUpcomingEvents && (
            <div className='inline-flex items-center gap-2 bg-warning/20 border border-warning text-warning-content px-6 py-3 rounded-2xl mb-8 animate-bounce transition-all duration-300 shadow-sm'>
              <span className='relative flex h-3 w-3'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75'></span>
                <span className='relative inline-flex rounded-full h-3 w-3 bg-warning'></span>
              </span>
              <p className='text-sm sm:text-lg font-bold uppercase tracking-wider'>
                Some tickets are not on sale yet – Stay tuned!
              </p>
            </div>
          )} */}
        </div>
        <div
          className={`grid ${events.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}
        >
          {events.map((event, index) => (
            <div key={index}>
              {/*
                Si event_deleted_at es null, evitar añadir "null" como string al final de la URL.
                El último segmento es opcional en el route (/event/:name/:venue/:date/:label/:delete?),
                por lo que solo lo incluimos cuando realmente existe un valor.
              */}
              {(() => {
                const encodedName = encodeURIComponent(event.event_name)
                const eventUrl = `/event/${encodedName}/${event.id}/${event.event_date}/${event.event_label}/${event.event_deleted_at}`

                console.log(
                  `Rendering EventCard for ${event.event_name}. Sales start: ${event.ticket_sales_start_date}`
                )

                return (
                  <Link style={{ width: '100%' }} to={eventUrl}>
                    <EventCard
                      key={index}
                      id={event.id}
                      eventId={event.eventId}
                      title={event.event_name}
                      description={descriptions[event.event_label] || event.description}
                      thumbnailURL={
                        event.images.find((img) => img.type === 'EVENT_THUMBNAIL')?.url ||
                        event.images[0]?.url ||
                        '/default.jpg'
                      }
                      venue={event.venue?.venue_name || event.venue_label}
                      date={new Date(event.event_date)
                        .toLocaleDateString('en-GB', { ...optionsDate, timeZone: event.timezone })
                        .replace(',', '')}
                      city={event.venue?.location.city || event.city}
                      ticketSalesStartDate={event.ticket_sales_start_date}
                      timezone={event.timezone}
                    />
                  </Link>
                )
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
