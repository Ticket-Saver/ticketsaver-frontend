import TicketsClaim from "../../components/TicketsClaim";
import { BlueCreateWalletButton } from '../../components/mintWagmi/SmartWalletButton/walletButton'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../../components/mintWagmi/wagmi'
import { WagmiProvider } from 'wagmi';
import { useState } from 'react';

const queryClient = new QueryClient();

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
  }

export default function PastEvent() {
    const eventYuridia: Event = {
        eventId: '238191a6-0a65-45f2-81a6-4a29357cf8f6',
        id: 'Builddhaton',
        eventName: 'Buildhaton 2024',
        artistName: 'buildhaton',
        tour: 'hackathon buildhaton 2024',
        description:
            'Buildhaton is a hackathon that brings together developers, designers, and entrepreneurs to build blockchain applications and compete for cash prizes. The event is open to all developers, designers, and entrepreneurs who are interested in building blockchain applications.',
        cardImage: 'events/Buildathon.jpeg',
        venue: 'The Ritz Theatre',
        date: 'June 30, 2024',
        city: 'Elizabeth, NJ'
    }

    const eventLeonasSJ = {
        eventId: 'las_leonas.03',
        id: 'leonas_SJ',
        eventName: 'Las Leonas',
        artistName: 'Las Leonas',
        tour: 'US Tour',
        description: 'No te pierdas en escena: ¡Victoria Ruffo, Angelica Aragon, Ana Patricia Rojo, Paola Rojas, Maria Patricia Castañeda, Dulce y Lupita Jones! ¡Una obra spectacular!',
        cardImage: 'events/Leonas.jpg',
        venue: 'California Theater',
        date: 'October 18, 2024',
        city: 'San Jose, CA'
      }

    const [events, _setEvents] = useState<any>([eventYuridia, eventLeonasSJ])

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <div className="space-y-5">
                    <div className="w-full h-56 bg-neutral rounded-xl flex flex-col justify-between p-4 py-8">
                        <div className="flex justify-between items-center">
                            <div className='text-3xl font-semibold'>
                                Claim your collectible tickets
                            </div>
                            <div className="flex space-x-4">
                                <a>
                                    <BlueCreateWalletButton />
                                </a>
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
                    {events.map((event: Event) => (
                        <div key={event.eventId}>
                            <TicketsClaim
                                eventId={event.eventId}
                                id={event.id}
                                title={event.eventName}
                                description={event.description}
                                thumbnailURL={`/${event.cardImage}`}
                                venue={event.venue}
                                date={event.date}
                                city={event.city}
                            />
                        </div>
                    ))}
                </div>
            </QueryClientProvider>
        </WagmiProvider>
    );
}