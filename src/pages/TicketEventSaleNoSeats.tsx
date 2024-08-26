import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { extractLatestPrices } from '../components/Utils/priceUtils'
import { Link } from 'react-router-dom'
import { ticketId } from '../components/TicketUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchGitHubImage } from '../components/Utils/FetchDataJson'

interface Cart {
  price_base: number
  price_final: number
  zoneName: string
  seatLabel: string
  seatType: string
  subZone: string
  priceType: string
  ticketId: string
}

export default function TicketSelectionNoSeat() {
  const { name, venue, date, location, label } = useParams()
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`
  const githubApiUrl2 = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`

  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }
  const [cart, setCart] = useState<Cart[]>([])
  const [priceTagList, setPriceTags] = useState<any>([])
  const [zoneData, setZoneData] = useState<any>({})
  const [venueInfo, setVenue] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await fetchGitHubImage(label!)
        setImageUrl(url)
      } catch (error) {
        console.error('Error loading image:', error)
      }
    }

    loadImage()
  }, [label])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(githubApiUrl, options)
        if (!response.ok) {
          throw new Error('response error')
        }
        const zonePriceData = await response.json()
        setZoneData(zonePriceData)

        const zonePriceListData = extractLatestPrices(zonePriceData)
        setPriceTags(zonePriceListData)
      } catch (error) {
        console.error('Error fetching zone data', error)
      }
    }
    const fetchVenues = async () => {
      const storedVenues = localStorage.getItem('Venues')
      localStorage.removeItem('Venues')

      if (storedVenues) {
        setVenue(JSON.parse(storedVenues))
      } else {
        try {
          const response = await fetch(githubApiUrl2, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3.raw'
            }
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          const matchingVenue = data[venue!]
          setVenue(matchingVenue)
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }
    }

    fetchData()
    fetchVenues()
  }, [githubApiUrl, githubApiUrl2, token, venue])

  useEffect(() => {
    localStorage.removeItem('local_cart')
    localStorage.removeItem('cart_checkout')
  }, [])

  const { user } = useAuth0()

  const customer = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone_number
  }

  const totalCost = cart.reduce((acc, curr) => acc + curr.price_final, 0)

  const handleBuyTicket = (zoneLabel: string, priceType: string) => {
    const issuedAt = Date.now()
    const cartLength = cart.length
    const price_base = priceTagList[priceType]?.price_base / 100
    if (!price_base) return

    const newTicketId = ticketId(label || '', zoneLabel, cartLength + 1, issuedAt)

    setCart((prev: Cart[] | undefined) => [
      ...(prev || []),
      {
        price_base: price_base,
        price_final: priceTagList[priceType].price_final / 100,
        zoneName: zoneLabel,
        seatLabel: newTicketId,
        seatType: priceType,
        subZone: zoneLabel,
        priceType: priceType,
        ticketId: newTicketId,
        issuedAt: issuedAt,
        numberOfTicket: cartLength + 1
      }
    ])
  }

  const handleCheckout = () => {
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({
        cart,
        eventInfo: {
          id: label,
          name,
          venue: venueInfo?.venue_name,
          venueId: venue,
          date,
          location
        },
        customer
      })
    )
    navigate('/checkout')
  }

  const handleRemoveTicket = (ticketId: string) => {
    // Elimina solo el ticket específico basado en su `ticketId`
    const updatedCart = cart.filter((ticket) => ticket.ticketId !== ticketId)

    // Actualiza el carrito
    setCart(updatedCart)
  }

  return (
    <div className='bg-white'>
      <div className='relative bg-gray-100'>
        {/* Event Header */}
        <div className='absolute inset-0'>
          {/* Cover Image */}
          <div className='relative h-96'>
            {/* Event Profile Image */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt='Event banner'
                className='absolute inset-0 w-full h-full object-cover'
              />
            )}
            {/* Overlay for blur effect */}
            <div className='absolute inset-0 bg-black opacity-50'></div>
          </div>
        </div>
        <div className='relative z-10 p-8'>
          {/* Sección de la tabla de precios */}
          {zoneData.zones && Object.keys(zoneData.zones).length > 0 ? (
            <div className='bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-300'>
              <h2 className='text-2xl font-bold mb-6 text-black'>Ticket Prices</h2>
              <table className='w-full'>
                <thead>
                  <tr>
                    <th className='text-left text-black border-b-2 border-gray-300 pb-2'>Zone</th>
                    <th className='text-right text-black border-b-2 border-gray-300 pb-2'>Price</th>
                    <th className='text-right text-black border-b-2 border-gray-300 pb-2'>Add</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(zoneData.zones).map(([zoneLabel, priceTypes]) =>
                    Object.entries(priceTypes as any[]).map(([priceType]) => {

                      const priceFinal = priceTagList[priceType]?.price_final / 100

                      return (
                        <tr key={`${zoneLabel}-${priceType}`} className='hover:bg-gray-100'>
                          <td className='text-left font-normal text-black py-2 border-b border-gray-300'>
                            {zoneLabel}
                          </td>
                          <td className='text-right font-normal text-black py-2 border-b border-gray-300'>
                            <p className='font-bold'>${priceFinal?.toFixed(2)}</p>

                          </td>
                          <td className='text-right py-2 border-b border-gray-300'>
                            <button
                              className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mr-2'
                              onClick={() => handleBuyTicket(zoneLabel, priceType)}
                            >
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading zones and prices...</p>
          )}

          {/* Sección del carrito */}
          {cart.length > 0 && (
            <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-300'>
              <h2 className='text-2xl font-bold mb-6 text-black'>Cart</h2>
              {cart.map((ticket) => (
                <div
                  key={ticket.ticketId} // Usa ticketId como key
                  className='mb-4 pb-4 border-b-2 border-gray-300 flex justify-between text-black'
                >
                  <div>
                    <span className='font-semibold'>Ticket - {ticket.zoneName}</span>
                    <p> Price: ${ticket.price_final.toFixed(2)}</p>

                  </div>
                  <div className='flex items-center'>
                    <button
                      className='bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300'
                      onClick={() => handleRemoveTicket(ticket.ticketId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className='mt-8 flex justify-between'>
                <div>
                  <p className='text-xl font-bold text-black'>Total</p>
                </div>
                <div>
                  <p className='text-xl font-bold text-black'>${totalCost.toFixed(2)}</p>
                </div>
              </div>
              <div className='flex justify-center mt-8'>
                <Link to='/checkout'>
                  <button
                    className='bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition duration-300'
                    onClick={handleCheckout}
                  >
                    Continue to Checkout
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
