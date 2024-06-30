import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';

interface Cart {
    ticketId: string;
    priceType: string;
    eventId: string;
    price: number;
    seatLabel: string;
}

export default function TicketSelection() {
  const [sessionId, setSessionId] = useState<string>(''); // State to store sessionId

  const getCookieStart = (name: string) => {
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
    const existingSessionId = getCookieStart('sessionId');
    if (!existingSessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      document.cookie = `sessionId=${newSessionId}; path=/`;
    } else {
      setSessionId(existingSessionId);
    }
  }, []);

  const [cart, setCart] = useState<Cart[]>([]);
  const router = useRouter();

  const eventDetails = {
    id: "leonas.01",
    name: "Las Leonas",
    venue: "California Theatre - San Jose, CA",
    date: "October 18th, 2024"
  };

  const ticketDetails = {
    priceType: "P1",
    price: 1,
    seatLabel: "General Admission"
  };

  const handleBuyTicket = () => {
    setCart(prevCart => [
      ...prevCart,
      {
        ticketId: uuidv4(),
        priceType: ticketDetails.priceType,
        eventId: eventDetails.id,
        price: ticketDetails.price,
        seatLabel: ticketDetails.seatLabel,
      },
    ]);
  };

  const ticketCost = cart.reduce((acc, crr) => acc + crr.price, 0);

  const handleCheckout = async () => {
    localStorage.setItem("cart_checkout", JSON.stringify({
      cart: cart,
      event: eventDetails,
    }));
    router.push("/checkout");
  };

  return (
    <div className="bg-gray-100">
      <div className="bg-gray-100 relative">
        {/* Event Header */}
        <div className="absolute inset-0">
          {/* Cover Image */}
          <div className="relative h-96 bg-gray-500">
            {/* Event Profile Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/IndiaYuridia.png"
                alt="Event Profile"
                className="w-full h-full object-cover overflow-hidden blur-sm object-top"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Event Description */}
          <div className="text-primary-content relative">
            <h1 className="text-6xl font-bold mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto ">
              La India Yuridia
            </h1>
            <div className="block">
              <h2 className="text-4xl mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto">
                The Ritz Theatre, New Jersey
              </h2>
            </div>
            <div className="ml-auto sm:w-full md:w-96 text-primary-content bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Ticket Prices</h2>
              {/* Static Table */}
              <table className="w-full gap-y-2">
                <thead>
                  <tr>
                    <th className="text-left">Type</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-left font-normal">Orchestra</th>
                    <th className="text-right font-normal">
                      Starting prices from
                      <a className="font-bold"> $100</a>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-3">
        <div className="relative justify-center bg-gray-100 text-primary-content">
          <div className="w-full p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Buy Ticket</h2>
              <div className="flex justify-center mb-4">
                <button
                  className="bg-blue-500 text-white text-2xl font-bold py-4 px-6 rounded-md mx-2"
                  onClick={handleBuyTicket}
                >
                  Buy Orchestra Ticket
                </button>
              </div>
              {cart.length !== 0 ? (
                <>
                  {cart.map((ticket, index) => (
                    <div key={index} className="mb-4 pb-4 border-b-2 border-gray flex justify-between flex-row">
                      <div>
                        <a className="pr-5">
                          Ticket - {ticket.seatLabel}
                        </a>
                        <p className="font-bold">Ticket Total</p>
                      </div>
                      <div>
                        <p>${ticket.price.toFixed(2)}</p>
                        <p className="font-bold">
                          ${ticket.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 flex justify-between">
                    <div>
                      <p className="text-xl font-bold">Total</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">
                        ${ticketCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-green-500 text-white text-2xl font-bold py-4 px-6 rounded-md mt-4"
                      onClick={handleCheckout}
                    >
                      Continue to checkout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <p className="text-xl">No tickets selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
