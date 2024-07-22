import { useState, useEffect } from 'react'
import { EventCard } from './EventCard'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

interface Event {
  eventId: string
  event_date: string
  event_hour: string
  event_name: string
  venue_label: string
  event_label: string
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events.json`
      const token = import.meta.env.VITE_GITHUB_TOKEN
      const storedEvents = localStorage.getItem('events')

      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents)
        const filteredEvents = parsedEvents.filter(
          (event: Event) =>
            event.event_label === 'las_leonas.02' || event.event_label === 'las_leonas.03'
        )
        setEvents(filteredEvents)
        console.log('Filtered events', filteredEvents)
      } else {
        try {
          const response = await fetch(githubApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3.raw'
            }
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data: Record<string, Event> = await response.json()
          console.log(data)
          const filteredEvents = Object.values(data).filter(
            (event: Event) =>
              event.event_label === 'las_leonas.02' || event.event_label === 'las_leonas.03'
          )
          setEvents(filteredEvents)
          localStorage.setItem('events', JSON.stringify(filteredEvents))
        } catch (error) {
          console.error('Error al obtener eventos:', error)
        }
      }
    }
    fetchEvents()
  }, [])


  const setSessionId = useState<string>('')[1]; // State to store sessionId

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
    // Check if sessionId already exists in cookies
    const existingSessionId = getCookie('sessionId')

    // If sessionId doesn't exist, generate a new one and store it as a cookie
    if (!existingSessionId) {
      const newSessionId = uuidv4()
      setSessionId(newSessionId)
      document.cookie = `sessionId=${newSessionId}; path=/` // Set the cookie with name 'sessionId'
    } else {
      // Use existing sessionId if it exists
      setSessionId(existingSessionId)
    }
  }, [])

  return (
    <section className='py-10 md:py-16 bg-base-300'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Featured Events</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>Available for sale at TicketSaver.</p>
        </div>
        <div
          className={`grid ${events.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}
        >
          {events.map((event, index) => (
            <Link
              to={`/events/${event.event_name}/${event.venue_label}/${event.event_date}`}
              key={index}
            >
              <EventCard
                key={index}
                id={event.eventId}
                eventId={event.eventId}
                title={event.event_name}
                description={
                  'Este evento presenta a algunos de los artistas más destacados del momento, ofreciendo una experiencia inolvidable llena de música, arte y cultura.'
                } // Add description if available
                thumbnailURL={'https://via.placeholder.com/150'}
                venue={event.venue_label}
                date={event.event_date}
                city={'Columbus, Ohaio'}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
