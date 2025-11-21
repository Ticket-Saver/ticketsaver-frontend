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
          // Usar siempre la fecha de inicio del evento para mostrar y para la URL.
          // Si por alguna razón no existe start_date, caemos a end_date.
          // Convertimos usando el timezone del evento para evitar desfases de día (UTC vs hora local).
          const rawDate: string | undefined = event.start_date || event.end_date
          let eventDate = ''

          if (rawDate) {
            const dateObject = new Date(rawDate)
            const timeZone = event.timezone || event.settings?.timezone || 'UTC'

            // 'en-CA' da formato YYYY-MM-DD, ideal para mantener el mismo formato en la URL.
            const formatter = new Intl.DateTimeFormat('en-CA', {
              timeZone,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })

            eventDate = formatter.format(dateObject)
          }

          const locationDetails = event.settings?.location_details || {}
          const venueName = locationDetails.venue_name || event.venue_name || ''

          return {
            eventId: event.id,
            event_name: event.title,
            event_label: event.map || 'general',
            event_date: eventDate,
            event_hour: event.event_hour || '',
            venue_label: 'default_venue',
            event_deleted_at: null,
            sale_starts_at: '',
            tricket_url: '',
            id: event.id,
            images: event.images || [],
            city: locationDetails.city || '-',
            description: event.description?.replace(/<\/?[^>]+(>|$)/g, '') || '',
            venue: {
              venue_name: venueName,
              venue_label: venueName || 'default_venue',
              capacity: 0,
              seatmap: false,
              location: {
                city: locationDetails.city || '-',
                address: locationDetails.address_line_1 || '',
                country: locationDetails.country || '',
                maps_url: event.settings?.maps_url || '',
                zip_code: locationDetails.zip_or_postal_code || ''
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
  }, [token2])

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
    year: 'numeric',
    timeZone: 'UTC'
  }

  return (
    <section className='py-10 md:py-16 bg-base-300'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Select your city!!</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>
            Don't miss out! Buy now before tickets sell out!!
          </p>
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
                const deleteSegment = event.event_deleted_at ? `/${event.event_deleted_at}` : ''
                const encodedName = encodeURIComponent(event.event_name)
                const eventUrl = `/event/${encodedName}/${event.id}/${event.event_date}/${event.event_label}${deleteSegment}`

                return (
                  <Link style={{ width: '100%' }} to={eventUrl}>
                    <EventCard
                      key={index}
                      id={event.eventId}
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
                        .toLocaleDateString('en-GB', optionsDate)
                        .replace(',', '')}
                      city={event.venue?.location.city || event.city}
                      address={[event.venue?.location.address].filter(Boolean).join(', ')}
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
