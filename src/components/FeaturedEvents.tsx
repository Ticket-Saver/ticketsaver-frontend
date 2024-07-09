import { useState, useEffect } from 'react'
import { EventCard } from './EventCard'

import { v4 as uuidv4 } from 'uuid'

export default function FeaturedEvents() {
  const buildathon = {
    eventId: '238191a6-0a65-45f2-81a6-4a29357cf8f6',
    id: 'Buildathon',
    eventName: 'Hackathon Buildathon',
    artistName: 'Buildathon',
    tour: 'Hackathon Tour',
    description:
      'Join us for a weekend of hacking, learning, and fun! Buildathon is a 36-hour hackathon where students from all over the world come together to turn their ideas into reality.',
    cardImage: 'events/Buildathon.jpeg',
    venue: 'The Ritz Theatre',
    date: 'June 06, 2024',
    city: 'Elizabeth, NJ',
    route: `/dashboard/claimtickets/${'Buildathon'}/mynftsclaim`
  }

  const eventLeonasSJ = {
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
    route: `/dashboard/claimtickets/${'Las leonas'}/mynftsclaim`
  }

  const [events, _setEvents] = useState<any>([buildathon, eventLeonasSJ])
  const [_sessionId, setSessionId] = useState<string>('') // State to store sessionId

  // Function to get cookie by name
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
    console.log('chance existe', existingSessionId)

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
      <h2>
        ENV Variable Example: {import.meta.env.VITE_APP_EXAMPLE_NETLIFY}
      </h2>
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Featured Events</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>Available for sale at TicketSaver.</p>
        </div>

        <div
          className={`grid ${events && events.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}
        >
          {/* Events go here*/}

          {events
            ? events.map((_: any, index: any) => (
                <a
                  key={index}
                  //onClick={()=>router.push(`events/${_.id}`)}
                >
                  {_.cardImage && (
                    <>
                      <EventCard
                        eventId={_.eventId}
                        key={index}
                        id={_.id}
                        title={_.eventName}
                        description={_.description}
                        thumbnailURL={`/${_.cardImage}`}
                        venue={_.venue}
                        date={_.date}
                        city={_.city}
                      />
                    </>
                  )}
                </a>
              ))
            : null}
        </div>
      </div>
    </section>
  )
}
