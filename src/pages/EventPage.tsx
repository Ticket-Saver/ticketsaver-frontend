import { useState, useEffect } from 'react'
import { EventCard } from '../components/EventCard'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useFetchJson, fetchDescription, fetchGitHubImage } from '../components/Utils/FetchDataJson'

interface Event {
  eventId: string
  event_date: string
  event_hour: string
  event_name: string
  venue_label: string
  event_label: string
  event_deleted_at: string | null
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
  label: string
  location: Location
  name: string
  seatmap: boolean
}

interface EventWithVenue extends Event {
  venue: Venue | undefined
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [images, setImages] = useState<Record<string, string>>({})

  const [eventsWithVenues, setEventsWithVenues] = useState<EventWithVenue[]>([])
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events.json`
  const githubApiUrl2 = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const token = import.meta.env.VITE_GITHUB_TOKEN


  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }

  const { data } = useFetchJson(githubApiUrl, options)

  console.log('data', data)

  useEffect(() => {
    let filteredEvents: Event[] = []

    if (data) {
      const eventsArray = Object.values(data)
      const currentDate = new Date()

      console.log('currentDate', currentDate)

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
    const combinedData = events.map((event) => {
      const venue = venues.find((v) => v.label === event.venue_label)
      return { ...event, venue }
    })
    setEventsWithVenues(combinedData)
  }, [events, venues])

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

  const setSessionId = useState<string>('')[1] // State to store sessionId

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
          className={`grid ${eventsWithVenues.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}
        >
          {eventsWithVenues.map((event, index) => (
            <Link
              to={`/event/${event.event_name}/${event.venue_label}/${event.event_date}/${event.event_label}/${event.event_deleted_at}`}
              key={index}
            >
              <EventCard
                key={index}
                id={event.eventId}
                eventId={event.eventId}
                title={event.event_name}
                description={descriptions[event.event_label]} // Add description if available
                thumbnailURL={images[event.event_label]}
                venue={event.venue?.name || event.venue_label}
                date={event.event_date}
                city={event.venue?.location.city} // Pass the city property from the venue object
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
