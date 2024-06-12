import { useState, useEffect } from "react";
import { EventCard } from "./EventCard";

import { v4 as uuidv4 } from 'uuid';

export default function FeaturedEvents() {
  const eventYuridia = {
    eventId:'238191a6-0a65-45f2-81a6-4a29357cf8f6',
    id: 'IndiaYuridia',
    eventName: 'La India Yuridia',
    artistName: 'India Yuridia',
    tour: 'Por que Asi Soy',
    description: '¡Llega por primera vez a New Jersey la comediante femenina #1 de América Latina! ¡La India Yuridia!',
    cardImage: 'IndiaYuridia.png',
    venue: "The Ritz Theatre",
    date: "September 08, 2024",
    city: "Elizabeth, NJ"
  }
  const eventYuridiaSJ = {
    eventId:'india_yuridia.02',
    id: 'IndiaYuridiaSJ',
    eventName: 'La India Yuridia',
    artistName: 'India Yuridia',
    tour: 'Por que Asi Soy',
    description: '¡Regresa a San José CA, la comediante femenina #1 de América Latina! ¡La India Yuridia!',
    cardImage: 'IndiaYuridia.png',
    venue: "San José, CA",
    date: "November 17, 2024",
    city: "San José"
  }
  
  /*const eventEsquivel = {
    eventId: '004x',
    id: 'los_esquivel.01',
    eventName: 'Los Esquivel',
    artistName: 'Los Esquivel',
    tour: '',
    description: '¿Listos para una noche de fiesta? No te pierdas el concierto de Los Esquivel en Noxx Nightclub este próximo 10 de Mayo. Prepárate para cantar todos sus hits. ¡Compra tus boletos antes de que se agoten!',
    cardImage: 'poster-los_esquivel.01.png',
    venue: 'NOXX Nightclub',
    date: 'May 10, 2024',
    city: 'McAllen, TX'
  }/*/


  const [events, setEvents] = useState<any>([eventYuridia, eventYuridiaSJ ]);
  const [sessionId, setSessionId] = useState<string>(''); // State to store sessionId

  // Function to get cookie by name
  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  };
  useEffect(() => {
    // Check if sessionId already exists in cookies
    const existingSessionId = getCookie('sessionId');
    console.log("chance existe", existingSessionId)

    // If sessionId doesn't exist, generate a new one and store it as a cookie
    if (!existingSessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      document.cookie = `sessionId=${newSessionId}; path=/`; // Set the cookie with name 'sessionId'
    } else {
      // Use existing sessionId if it exists
      setSessionId(existingSessionId);
    }
  }, []);


  return (
    <section className="py-10 md:py-16 bg-base-300">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Featured Events
          </h2>
          <p className="text-lg sm:text-2xl mb-6 md:mb-14">
            Available for sale at TicketSaver.
          </p>
        </div>

        <div className={`grid ${events && events.length === 1 ? 'grid-cols-1 place-items-center' : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'} gap-6 lg:gap-8 xl:gap-10 place-items-center items-center`}>

          {/* Events go here*/}

          {events? (events.map((_:any, index:any) => (
            <a
              key={ index}
              //onClick={()=>router.push(`events/${_.id}`)} 
            >
            {
                _.cardImage && ( 
                  <>
                  <EventCard eventId={_.eventId} key={index} id={_.id} title={_.eventName} description={_.description} thumbnailURL={`/${_.cardImage}`} venue={_.venue} date={_.date} city={_.city}/>
                  </> 
                  ) 
              }
            </a>
          ))): null}
        </div>
      </div>
    </section>
  );
}