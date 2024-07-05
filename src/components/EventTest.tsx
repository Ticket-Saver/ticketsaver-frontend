import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import { ticketId } from './TicketUtils'

interface Cart {
  ticketId: string
  priceType: string
  eventId: string
  price: number
  venueZone: string
  issuedAt: number
}

export default function TicketSelection() {
  const [_sessionId, setSessionId] = useState<string>('') // State to store sessionId
  const [cart, setCart] = useState<Cart[]>([])
  const getCookieStart = (name: string) => {
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
    const existingSessionId = getCookieStart('sessionId')
    if (!existingSessionId) {
      const newSessionId = uuidv4()
      setSessionId(newSessionId)
      document.cookie = `sessionId=${newSessionId}; path=/`
    } else {
      setSessionId(existingSessionId)
    }
  }, [])

  const eventDetails = {
    id: 'las_leonas.03',
    name: 'Las Leonas',
    venue: 'California Theatre - San Jose, CA',
    date: 'October 18th, 2024'
  }

  const ticketDetails = {
    priceType: 'P1',
    price: 131.15,
    venueZone: 'General Admission' //
  }

  const handleBuyTicket = () => {
    const issuedAt = Date.now() // Obtener el timestamp actual
    const newTicketId = ticketId(
      eventDetails.name,
      ticketDetails.venueZone,
      cart.length + 1,
      issuedAt
    )

    setCart((prevCart) => [
      ...prevCart,
      {
        ticketId: newTicketId,
        priceType: ticketDetails.priceType,
        eventId: eventDetails.id,
        price: ticketDetails.price,
        venueZone: ticketDetails.venueZone,
        issuedAt: issuedAt
      }
    ])
  }

  const ticketCost = cart.reduce((acc, crr) => acc + crr.price, 0)

  const handleCheckout = async () => {
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({
        cart: cart,
        eventInfo: eventDetails
      })
    )
  }

  return (
    <div className='bg-gray-100'>
      <div className='bg-gray-100 relative'>
        <div className='absolute inset-0'>
          <div className='relative h-96 bg-gray-500'>
            <div className='absolute inset-0 overflow-hidden'>
              <img
                src='public/events/Leonas.jpg'
                alt='Event Profile'
                className='w-full h-full object-cover overflow-hidden blur-sm object-top'
              />
            </div>
          </div>
        </div>
        <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
          <div className='text-black relative'>
            <h1 className='text-6xl font-bold mb-4 bg-white bg-opacity-70 text-black rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
              Leonas
            </h1>
            <div className='block'>
              <h2 className='text-4xl mb-4 bg-white bg-opacity-70 text-black rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
                California Theatre - San Jose, CA
              </h2>
            </div>
            <div className='ml-auto sm:w-full md:w-96 text-black bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-lg font-bold mb-6'>Ticket Prices</h2>
              <table className='w-full gap-y-2'>
                <thead>
                  <tr>
                    <th className='text-left'>Type</th>
                    <th className='text-right'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='text-left font-normal'>Orchestra</td>
                    <td className='text-right font-normal'>
                      Starting prices from <span className='font-bold'>$100</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full py-3'>
        <div className='relative justify-center bg-gray-100 text-black'>
          <div className='w-full p-4'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>Add Ticket</h2>
              <div className='flex justify-center mb-4'>
                <button
                  className='bg-blue-500 text-white text-2xl font-bold py-4 px-6 rounded-md mx-2'
                  onClick={handleBuyTicket}
                >
                  Buy Ticket
                </button>
              </div>
              {cart.length !== 0 ? (
                <>
                  {cart.map((ticket, index) => (
                    <div
                      key={index}
                      className='mb-4 pb-4 border-b-2 border-gray-200 flex justify-between flex-row'
                    >
                      <div>
                        <span className='pr-5'>Ticket - {ticket.venueZone}</span>
                        <p className='font-bold'>Ticket Total</p>
                      </div>
                      <div>
                        <p>${ticket.price.toFixed(2)}</p>
                        <p className='font-bold'>${ticket.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div className='mt-8 flex justify-between'>
                    <div>
                      <p className='text-xl font-bold'>Total</p>
                    </div>
                    <div>
                      <p className='text-xl font-bold'>${ticketCost.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className='flex justify-center'>
                    <Link to='/checkout'>
                      <button
                        className='bg-green-500 text-white text-2xl font-bold py-4 px-6 rounded-md mt-4'
                        onClick={handleCheckout}
                      >
                        Continue to checkout
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className='flex justify-center'>
                  <p className='text-xl'>No tickets selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
