import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import EventClaim from '../components/EventsClaim'

interface Event {
  eventId: string
  id: string
  eventName: string
  artistName?: string
  tour?: string
  description: string
  cardImage: string
  venue: string
  date: string
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

      const groupedEvents = Object.entries(data).map(([key, items]) => {
        const firstItem = items[0]

        return {
          eventId: key,
          id: key,
          eventName: firstItem.eventName,
          artistName: firstItem.eventName,
          tour: 'US Tour',
          description:
            'No te pierdas en escena: ¡Victoria Ruffo, Angelica Aragon, Ana Patricia Rojo, Paola Rojas, Maria Patricia Castañeda, Dulce y Lupita Jones! ¡Una obra spectacular!',
          cardImage: 'events/Leonas.jpg',
          venue: firstItem.venue,
          date: firstItem.date,
          city: firstItem.location,
          route: `/dashboard/claimtickets/${firstItem.eventName}/mynftsclaim`,
          ticketDetails: items.map((item) => ({
            ticket: item.Ticket,
            zone: item.Zone,
            price: item.price
          }))
        }
      })

      const filteredEvents = groupedEvents.filter((event) => filterFunction(event.date))

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
      {events.length === 0 ? (
        <p className='text-center text-lg font-semibold'>{noEventsMessage}</p>
      ) : (
        events.map((event) => (
          <EventClaim
            key={event.id}
            eventId={event.eventId}
            id={event.id}
            title={event.eventName}
            description={event.description}
            thumbnailURL={`/${event.cardImage}`}
            venue={event.venue}
            date={event.date}
            route={event.route}
            ticketDetails={event.ticketDetails}
          />
        ))
      )}
    </div>
  )
}

export default EventList
