import EventClaim from '../../components/EventsClaim';
import { BlueCreateWalletButton } from '../../components/mintWagmi/SmartWalletButton/walletButton';
import { MintNFT } from '../../components/mintWagmi/mint-nft';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Event {
  eventId: string;
  id: string;
  eventName: string;
  artistName?: string;
  tour?: string;
  description: string;
  cardImage: string;
  venue: string;
  date: string;
  city: string;
  route?: string;
  ticketDetails?: {
    ticket: string;
    zone: string;
    price: string;
  }[];
}

interface Ticket {
  Ticket: string;
  Zone: string;
  price: string;
  eventName: string;
  venue: string;
  venueId: string;
  date: string;
  location: string;
}

interface EventData {
  [key: string]: Ticket[];
}

const isPastEvent = (eventDate: string): boolean => {
  const eventDateObj = new Date(eventDate);
  const currentDate = new Date();
  return eventDateObj < currentDate;
};

export default function PastEvent() {
  const { isConnected } = useAccount();
  const { user } = useAuth0();
  const [events, setEvents] = useState<Event[]>([]);
  
  const customer = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone_number
  };

  async function fetchTickets(customer: {
    name: string | undefined;
    email: string | undefined;
    phone: string | undefined;
  }) {
    try {
      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customer })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: EventData = await response.json();
      console.log('Tickets:', data);

      // Agrupar eventos por eventId
      const groupedEvents = Object.entries(data).map(([key, items]) => {
        const firstItem = items[0];

        return {
          eventId: key,
          id: key,
          eventName: firstItem.eventName,
          artistName: firstItem.eventName,
          tour: 'US Tour',
          description: 'No te pierdas en escena: ¡Victoria Ruffo, Angelica Aragon, Ana Patricia Rojo, Paola Rojas, Maria Patricia Castañeda, Dulce y Lupita Jones! ¡Una obra spectacular!',
          cardImage: 'events/Leonas.jpg',
          venue: firstItem.venue,
          date: firstItem.date,
          city: firstItem.location,
          route: `/dashboard/claimtickets/${firstItem.eventName}/mynftsclaim`,
          ticketDetails: items.map(item => ({
            ticket: item.Ticket,
            zone: item.Zone,
            price: item.price
          }))
        };
      });

      // Filtrar eventos pasados
      const pastEvents = groupedEvents.filter(event => isPastEvent(event.date));

      setEvents(pastEvents);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  }

  useEffect(() => {
    if (customer.name && customer.email) {
      fetchTickets(customer);
    }
  }, []);

  return (
    <>
      <div className="space-y-5">
        <div className="w-full h-56 bg-neutral rounded-xl flex flex-col justify-between p-4 py-8">
          <div className="flex justify-between items-center">
            <div className='text-3xl font-semibold'>
              Claim your collectible tickets
            </div>
            <div className="flex space-x-4">
              {!isConnected ? (
                <a>
                  <BlueCreateWalletButton />
                </a>
              ) : (
                <a>
                  <MintNFT />
                </a>
              )}
              <a>
                <button className='btn btn-primary btn-outline px-10'>
                  learn more
                </button>
              </a>
            </div>
          </div>
          <div className="w-2/5 h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551]"></div>
          <div className='text-xl pb-4'>
            Turn your tickets into lasting memories!!!
          </div>
          <div className='text-sm w-2/3'>
            Don’t let them get lost in a PDF file. Now, you can transform your tickets into collectible items and store them forever in your digital wallet. Create your wallet and start collecting today.
          </div>
        </div>
      </div>
      {events.length === 0 ? (
        <p className='text-center text-lg font-semibold'>You don't have any past events.</p>
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
    </>
  );
}
