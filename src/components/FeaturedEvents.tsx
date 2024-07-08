import { useState, useEffect } from 'react'
import { EventCard } from './EventCard'
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'

interface Event {
  eventId: string;
  event_date: string;
  event_hour: string;
  event_name: string;
  venue_label: string;
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  /*useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('base de datos'); // ruta de la base de datos
      const data = await response.json();
      const eventsArray: Event[] = Object.entries(data).map(([key, value]) => ({
        eventId: key,
        ...value,
      }));
      setEvents(eventsArray);
    };

    fetchEvents();
  }, []);*/

  useEffect(() => {
    const staticData = {
      "los_esquivel.01": {
        "event_date": "2024-05-10",
        "event_hour": "22:00",
        "event_name": "Los Esquivel",
        "venue_label": "noxxnightclub_tx"
      },
      "india_yuridia.01": {
        "event_date": "2024-09-08",
        "event_hour": "19:00",
        "event_name": "La India Yuridia",
        "venue_label": "ritztheatre_nj"
      },
      "india_yuridia.02": {
        "event_date": "2024-11-17",
        "event_hour": "20:00",
        "event_name": "La India Yuridia",
        "venue_label": "sanjose_ca"
      },
      "las_leonas.01": {
        "event_date": "2024-09-01",
        "event_hour": "19:00",
        "event_name": "Las Leonas",
        "venue_label": "manuelartime_fl"
      },
      "las_leonas.02": {
        "event_date": "2024-09-05",
        "event_hour": "20:30",
        "event_name": "Las Leonas",
        "venue_label": "unioncounty_nj"
      },
      "las_leonas.03": {
        "event_date": "2024-10-18",
        "event_hour": "21:00",
        "event_name": "Las Leonas",
        "venue_label": "californiatheatre_ca"
      }
    };
  
    const eventsArray: Event[] = Object.entries(staticData).map(([key, value]) => ({
      eventId: key,
      ...value,
    }));
    setEvents(eventsArray);
  }, []);

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
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Featured Events</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>Available for sale at TicketSaver.</p>
        </div>
        <div className={`grid ${events.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}>
          {events.map((event, index) => (
            <Link to={`/events/${event.eventId}`} key={index}>
            <EventCard
              key={index}
              id={event.eventId} 
              eventId={event.eventId}
              title={event.event_name}
              description={'Este evento presenta a algunos de los artistas más destacados del momento, ofreciendo una experiencia inolvidable llena de música, arte y cultura.'} // Add description if available
              thumbnailURL={'https://via.placeholder.com/150'} // Add thumbnail URL if available
              venue={event.venue_label}
              date={event.event_date}
              city={'Columbus, Ohaio'} // Add city if available
            />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
