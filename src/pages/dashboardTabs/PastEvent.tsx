import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import EveClaim from '../../components/EventsClaim'

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
  description2?: string
}

export default function PastEvent() {
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

      const data = await response.json()
      console.log('Tickets:', data)
      const fetchedEvents = data.map((item: any) => ({
        eventId: 'las_leonas.03',
        id: 'leonas_SJ',
        eventName: 'Las Leonas',
        artistName: 'Las Leonas',
        tour: 'US Tour',
        description:
          'No te pierdas en escena: ¡Victoria Ruffo, Angelica Aragon, Ana Patricia Rojo, Paola Rojas, Maria Patricia Castañeda, Dulce y Lupita Jones! ¡Una obra spectacular!',
        cardImage: 'events/Leonas.jpg',
        venue: 'California Theater',
        date: 'October 18, 2024',
        city: 'San Jose, CA',
        route: `/dashboard/claimtickets/${'Las leonas'}/mynftsclaim`,
        description2: item.description
      }))

      setEvents(fetchedEvents)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  useEffect(() => {
    fetchTickets(customer)
  }, [])

  return (
    <div className='space-y-5'>
      {/* Resto del componente */}
      <div className='space-y-5'>
        {events.map((event) => (
          <div key={event.eventId}>
            <EveClaim
              eventId={event.eventId}
              id={event.id}
              title={event.eventName}
              description={event.description}
              thumbnailURL={`/${event.cardImage}`}
              venue={event.venue}
              date={event.date}
              city={event.city}
              route={event.route}
              description2={event.description2}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
