import { useState } from 'react'
import { BlueCreateWalletButton } from '../../components/mintWagmi/SmartWalletButton/walletButton'
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
}

export default function PastEvent() {
  const eventYuridia: Event = {
    eventId: '238191a6-0a65-45f2-81a6-4a29357cf8f6',
    id: 'Buildathon',
    eventName: 'Hackathon Buildathon',
    artistName: 'Buildathon',
    tour: 'Hackathon Tour',
    description:
      'Join us for a weekend of hacking, learning, and fun! Buildathon is a 36-hour hackathon where students from all over the world come together to turn their ideas into reality. Whether you are a beginner or a seasoned hacker, Buildathon is the place to be!',
    cardImage: 'events/Buildathon.jpeg',
    venue: 'The Ritz Theatre',
    date: 'June 06, 2024',
    city: 'Elizabeth, NJ',
    route: `/dashboard/claimtickets/${'Buildathon'}/mynftsclaim`
  }

  const eventLeonasSJ: Event = {
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

  const [events, _setEvents] = useState<Event[]>([eventYuridia, eventLeonasSJ])

  return (
    <div className='space-y-5'>
      <div className='w-full bg-neutral rounded-xl flex flex-col justify-between p-4 py-2 sm:py-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='text-xl sm:text-3xl font-semibold text-center sm:text-left'>Claim your collectible tickets</div>
          <div className='flex flex-row sm:flex-row space-y-0 sm:space-y-0 space-x-2 sm:space-x-5'>
            <a>
              <BlueCreateWalletButton />
            </a>
            <a>
              <button className='btn btn-primary btn-outline px-4 sm:px-10'>learn more</button>
            </a>
          </div>
        </div>
        <div className='w-full h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551] my-4'></div>
        <div className='text-base sm:text-xl pb-4 text-center sm:text-left'>Turn your tickets into lasting memories!!!</div>
        <div className='text-xs sm:text-sm w-full sm:w-2/3'>
          Don’t let them get lost in a PDF file. Now, you can transform your tickets into
          collectible items and store them forever in your digital wallet. Create your wallet and
          start collecting today.
        </div>
      </div>
      <div className='space-y-5'>
        {events.map((event: Event) => (
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
            />
          </div>
        ))}
      </div>
    </div>
  )
}
