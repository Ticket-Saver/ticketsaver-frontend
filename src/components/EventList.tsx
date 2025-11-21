import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import EventClaim from '../components/EventsClaim'
import { fetchGitHubImage, fetchDescription } from './Utils/FetchDataJson'
import { API_URLS } from '../config/api'

interface Event {
  eventId: string
  id: string
  eventName: string
  artistName?: string
  tour?: string
  description: string
  cardImage: string
  venue: string
  /**
   * Fecha "cruda" que viene de Stripe (normalmente YYYY-MM-DD sin hora).
   * Se usa para la lógica (upcoming/past).
   */
  date: string
  /**
   * Fecha amigable para mostrar al usuario, ya formateada usando
   * el timezone real del evento cuando es posible.
   */
  displayDate?: string
  /**
   * Fecha/hora real de inicio del evento (start_date de la API pública)
   */
  eventStartDate?: string
  /**
   * Timezone oficial del evento (por ejemplo "America/Chicago")
   */
  eventTimeZone?: string
  city: string
  route?: string
  ticketDetails?: {
    ticket: string
    zone: string
    price: string
  }[]
}

interface Ticket {
  Ticket: string
  Zone: string
  price: string
  eventName: string
  venue: string
  venueId: string
  date: string
  location: string
}

interface EventData {
  [key: string]: Ticket[]
}

const token = import.meta.env.VITE_GITHUB_TOKEN
const hieventsToken = import.meta.env.VITE_TOKEN_HIEVENTS

const options = {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3.raw'
  }
}

export const isUpcomingEvent = (eventDate: string): boolean => {
  const eventDateObj = new Date(eventDate)
  const currentDate = new Date()
  return eventDateObj > currentDate
}

export const isPastEvent = (eventDate: string): boolean => {
  const eventDateObj = new Date(eventDate)
  const currentDate = new Date()
  return eventDateObj < currentDate
}

interface EventListProps {
  filterFunction: (eventDate: string) => boolean
  noEventsMessage: string
}

const EventList: React.FC<EventListProps> = ({ filterFunction, noEventsMessage }) => {
  const [Images, setImages] = useState<any>({})
  const [Descriptions, setDescriptions] = useState<any>({})

  const { user } = useAuth0()
  const [events, setEvents] = useState<Event[]>([])

  const customer = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone_number
  }

  async function fetchTickets(customer: {
    name: string | undefined
    email: string | undefined
    phone: string | undefined
  }) {
    try {
      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customer })
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data: EventData = await response.json()
      console.log('Tickets:', data)
      const [images, descriptions] = await Promise.all([
        imagesFromGithub(data),
        descriptionsFromGithub(data)
      ])

      setImages(images)
      setDescriptions(descriptions)

      const groupedEvents: Event[] = Object.entries(data).map(([key, items]) => {
        const firstItem = items[0]

        return {
          eventId: key,
          id: key,
          eventName: firstItem.eventName,
          artistName: firstItem.eventName,
          tour: 'US Tour',
          description: descriptions[key],
          cardImage: images[key],

          venue: firstItem.venue,
          date: firstItem.date,
          displayDate: firstItem.date,
          city: firstItem.location,
          route: `/dashboard/claimtickets/${firstItem.eventName}/mynftsclaim`,
          ticketDetails: items.map((item) => ({
            ticket: item.Ticket,
            zone: item.Zone,
            price: item.price
          }))
        }
      })

      // Enriquecer cada evento con la fecha/hora real desde la API pública
      const enrichedEvents: Event[] = await Promise.all(
        groupedEvents.map(async (event) => {
          // Si no tenemos token de la API, devolvemos el evento tal cual
          if (!hieventsToken) {
            return event
          }

          try {
            const publicEventUrl = API_URLS.getPublicEvent(event.eventId)
            const response = await fetch(publicEventUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${hieventsToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
              }
            })

            if (!response.ok) {
              console.warn(
                `No se pudo obtener datos públicos del evento ${event.eventId}:`,
                response.status
              )
              return event
            }

            const result = await response.json()
            const eventData = result.data || result

            const timeZone: string =
              (eventData && (eventData.timezone || eventData.settings?.timezone)) || 'UTC'
            const startDate: string | undefined = eventData.start_date

            if (!startDate) {
              return {
                ...event,
                eventTimeZone: timeZone
              }
            }

            const dateTime = new Date(startDate)

            // Formato de fecha similar a otras pantallas (ej. página de evento)
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone
            }).format(dateTime)

            const formattedTime = new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone
            }).format(dateTime)

            const displayDate = `${formattedDate} at ${formattedTime}`

            return {
              ...event,
              displayDate,
              eventStartDate: startDate,
              eventTimeZone: timeZone
            }
          } catch (err) {
            console.error('Error enriqueciendo evento con timezone:', err)
            return event
          }
        })
      )

      const filteredEvents = enrichedEvents.filter((event) =>
        filterFunction(event.eventStartDate || event.date)
      )

      setEvents(filteredEvents)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  useEffect(() => {
    if (customer.name && customer.email) {
      fetchTickets(customer)
    }
  }, [])

  return (
    <div className='space-y-5'>
      {!events || events.length === 0 ? (
        <p className='text-center text-lg font-semibold'>{noEventsMessage}</p>
      ) : (
        events.map((event) => (
          <EventClaim
            key={event.id}
            eventId={event.eventId}
            id={event.id}
            title={event.eventName}
            description={Descriptions[event.id]}
            thumbnailURL={Images[event.id]}
            venue={event.venue}
            // Usamos la fecha amigable con timezone si está disponible; si no, la cruda.
            date={event.displayDate || event.date}
            route={event.route}
            ticketDetails={event.ticketDetails}
          />
        ))
      )}
    </div>
  )
}

async function imagesFromGithub(data: EventData) {
  const Images: { [key: string]: string } = {}

  for (const eventId of Object.keys(data)) {
    const imageUrl = await fetchGitHubImage(eventId)

    Images[eventId] = imageUrl
  }

  return Images
}

async function descriptionsFromGithub(data: EventData) {
  const descriptions: { [key: string]: string } = {}

  for (const eventId of Object.keys(data)) {
    const description = await fetchDescription(eventId!, options)

    descriptions[eventId] = description
  }

  return descriptions
}

export default EventList
