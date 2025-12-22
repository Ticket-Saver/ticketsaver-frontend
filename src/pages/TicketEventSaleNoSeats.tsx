import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { extractLatestPrices } from '../components/Utils/priceUtils'
import { ticketId } from '../components/TicketUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchGitHubImage } from '../components/Utils/FetchDataJson'
import parseLocalDate from '../components/Utils/dateUtils'
import { useVenues } from '../router/venuesContext'
import { cacheService } from '../services/cacheService'
import { fallbackDataService } from '../services/fallbackDataService'

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
  const navigate = useNavigate()
  const token = import.meta.env.VITE_GITHUB_TOKEN

  // Memoriza el objeto options para evitar recrearlo en cada render
  const options = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }),
    [token]
  )

  // Memoriza la URL del endpoint para zone prices (solo cambia si label cambia)
  const githubApiUrl = useMemo(
    () => `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`,
    [label]
  )

  // Estados locales para datos específicos
  const [cart, setCart] = useState<Cart[]>([])
  const [priceTagList, setPriceTags] = useState<any>([])
  const [zoneData, setZoneData] = useState<any>({})
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({})
  const [seatCapacities, setSeatCapacities] = useState<{
    [key: string]: {
      available: boolean
      remaining_seats: number | null
      max_capacity: number | null
      unlimited?: boolean
    }
  }>({})

  // Usar el contexto para obtener la información de venues de forma centralizada
  const { venues: contextVenues } = useVenues()
  const venueInfo = contextVenues ? contextVenues[venue!] : null

  const eventsWithFees = [
    'ice_spice.01',
    'bossman_dlow.01',
    'bigxthaplug.01',
    'geazy_claytons.01',
    'deorro_claytons.01',
    'deebaby_zro.01',
    'nestor_420.01',
    'steve_aoki.01',
    'las_alucines.01'
  ]

  // Cargar la imagen del evento solo cuando label cambie
  useEffect(() => {
    if (!label) return
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

  // Cargar los datos de zone prices una sola vez cuando label cambie
  useEffect(() => {
    if (!label) return
    const fetchData = async () => {
      try {
        // Check emergency mode first
        if (fallbackDataService.isEmergencyMode()) {
          const localZonePrice = await fallbackDataService.getLocalZonePrice(label)
          setZoneData(localZonePrice)
          const zonePriceListData = extractLatestPrices(localZonePrice)
          setPriceTags(zonePriceListData)
          return
        }

        // Try cache first, then GitHub
        const zonePriceData = await cacheService.fetchWithCache(githubApiUrl, options, {
          ttl: 5 * 60 * 1000 // 5 minutes cache
        })
        setZoneData(zonePriceData)
        const zonePriceListData = extractLatestPrices(zonePriceData)
        setPriceTags(zonePriceListData)
      } catch (error) {
        console.error('Error fetching zone data, using fallback', error)
        // Fallback to local data
        try {
          const localZonePrice = await fallbackDataService.getLocalZonePrice(label)
          setZoneData(localZonePrice)
          const zonePriceListData = extractLatestPrices(localZonePrice)
          setPriceTags(zonePriceListData)
        } catch (fallbackError) {
          console.error('Error loading fallback zone data', fallbackError)
        }
      }
    }
    fetchData()
  }, [githubApiUrl, options, label])

  // Cargar las capacidades de asientos para cada zona
  useEffect(() => {
    if (!label || !zoneData.zones || Object.keys(zoneData.zones).length === 0) return

    const fetchCapacities = async () => {
      const capacities: {
        [key: string]: {
          available: boolean
          remaining_seats: number | null
          max_capacity: number | null
          unlimited?: boolean
        }
      } = {}

      for (const [zoneLabel, priceTypes] of Object.entries(zoneData.zones)) {
        for (const priceType of Object.keys(priceTypes as any)) {
          try {
            const response = await fetch('/.netlify/functions/checkSeatCapacity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                event_id: label,
                seat_type: zoneLabel
              })
            })

            if (response.ok) {
              const data = await response.json()
              capacities[`${zoneLabel}-${priceType}`] = {
                available: data.available,
                remaining_seats: data.remaining_seats,
                max_capacity: data.max_capacity,
                unlimited: data.unlimited
              }
            } else {
              // Si la función falla, asumir que no hay límite
              console.log(`No capacity limit configured for ${zoneLabel}`)
            }
          } catch (error) {
            console.error(`Error fetching capacity for ${zoneLabel}:`, error)
          }
        }
      }

      setSeatCapacities(capacities)
    }

    fetchCapacities()
  }, [label, zoneData])

  // Limpiar datos del carrito en localStorage solo una vez al montar el componente
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

  // Formatea la fecha del parámetro `date` usando el util parseLocalDate.
  // Este util interpreta fechas tipo "YYYY-MM-DD" como locales para evitar
  // desplazamientos por zona horaria.
  const formattedDate = useMemo(() => {
    if (!date) return ''
    const parsedDate = parseLocalDate(date)
    if (!parsedDate) return date
    return parsedDate.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }, [date])

  // Calcular el total de boletos y costo total
  const totalTicketsInCart = cart.length
  const totalCost = cart.reduce((acc, curr) => acc + curr.price_final, 0)

  // Manejar cambios en la cantidad de boletos
  const handleTicketQuantityChange = (
    zoneLabel: string,
    priceType: string,
    newQuantity: number
  ) => {
    const currentTotalTickets = totalTicketsInCart
    const currentQuantity = cart.filter(
      (ticket) => ticket.zoneName === zoneLabel && ticket.priceType === priceType
    ).length
    const totalNewTickets = currentTotalTickets - currentQuantity + newQuantity

    // Verificar límite de 10 boletos por compra
    if (totalNewTickets > 10) {
      alert('You can only purchase up to 10 tickets per transaction.')
      return
    }

    // Verificar disponibilidad de asientos solo si hay un límite configurado
    const capacityKey = `${zoneLabel}-${priceType}`
    const capacity = seatCapacities[capacityKey]
    if (capacity && !capacity.unlimited && capacity.remaining_seats !== null) {
      if (newQuantity > capacity.remaining_seats) {
        alert(
          `Only ${capacity.remaining_seats} tickets available for ${zoneLabel}. This section is almost sold out!`
        )
        return
      }
    }

    if (totalNewTickets <= 10) {
      setTicketQuantities((prev) => ({
        ...prev,
        [`${zoneLabel}-${priceType}`]: newQuantity
      }))

      if (newQuantity > currentQuantity) {
        const issuedAt = Date.now()
        const newTickets: Cart[] = Array.from(
          { length: newQuantity - currentQuantity },
          (_, index) => {
            const newTicketId = ticketId(label || '', zoneLabel, cart.length + index + 1, issuedAt)
            return {
              price_base: priceTagList[priceType]?.price_base / 100,
              price_final: priceTagList[priceType]?.price_final / 100,
              zoneName: zoneLabel,
              seatLabel: newTicketId,
              seatType: priceType,
              subZone: zoneLabel,
              priceType: priceType,
              ticketId: newTicketId
            }
          }
        )
        setCart((prev) => [...prev, ...newTickets])
      } else if (newQuantity < currentQuantity) {
        const ticketsToRemove = cart
          .filter((ticket) => ticket.zoneName === zoneLabel && ticket.priceType === priceType)
          .slice(0, currentQuantity - newQuantity)
        setCart((prev) => prev.filter((ticket) => !ticketsToRemove.includes(ticket)))
      }
    }
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

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='flex-grow flex flex-col justify-between bg-gray-100'>
        <div className='relative'>
          <div className='relative h-96'>
            {imageUrl && (
              <img
                src={imageUrl}
                alt='Event banner'
                className='absolute inset-0 w-full h-full object-cover'
              />
            )}
            <div className='absolute inset-0 bg-black opacity-50'></div>
            {/* Event Information */}
            <div className='absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4'>
              <h1 className='text-4xl font-bold mb-4 bg-black bg-opacity-50 rounded-lg px-10 py-2'>
                {name}
              </h1>
              {venueInfo && (
                <h2 className='text-2xl mb-4 bg-black bg-opacity-50 rounded-lg px-10 py-2'>
                  {venueInfo.venue_name}, {location}
                </h2>
              )}
              <p className='text-1xl mb-6 bg-black bg-opacity-50 rounded-lg px-10 py-2'>
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
        <div className='flex-grow flex flex-col items-center justify-start p-8'>
          {zoneData.zones && Object.keys(zoneData.zones).length > 0 ? (
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-300'>
              <h2 className='text-2xl font-bold mb-6 text-black'>Ticket Prices</h2>
              <table className='w-full'>
                <thead>
                  <tr>
                    <th className='text-left text-black border-b-2 border-gray-300 pb-2'>Zone</th>
                    <th className='text-right text-black border-b-2 border-gray-300 pb-2'>Price</th>
                    <th className='text-right text-black border-b-2 border-gray-300 pb-2'>
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(zoneData.zones).map(([zoneLabel, priceTypes]) =>
                    Object.entries(priceTypes as any[]).map(([priceType]) => {
                      const priceFinal = priceTagList[priceType]?.price_final / 100
                      const priceBase = priceTagList[priceType]?.price_base / 100
                      const capacityKey = `${zoneLabel}-${priceType}`
                      const capacity = seatCapacities[capacityKey]
                      // Solo marcar como no disponible si hay un límite y está agotado
                      const isAvailable = capacity?.unlimited ? true : (capacity?.available ?? true)
                      const remainingSeats = capacity?.remaining_seats ?? null

                      return (
                        <tr
                          key={`${zoneLabel}-${priceType}`}
                          className={`hover:bg-gray-100 ${!isAvailable ? 'opacity-50' : ''}`}
                        >
                          <td className='text-left font-normal text-black py-2 border-b border-gray-300'>
                            {zoneLabel}
                            {capacity && !capacity.unlimited && remainingSeats !== null && remainingSeats <= 10 && remainingSeats > 0 && (
                              <span className='ml-2 text-xs text-orange-600 font-semibold'>
                                ({remainingSeats} left)
                              </span>
                            )}
                            {!isAvailable && !capacity?.unlimited && (
                              <span className='ml-2 text-xs text-red-600 font-bold'>
                                (SOLD OUT)
                              </span>
                            )}
                          </td>
                          <td className='text-right font-normal text-black py-2 border-b border-gray-300'>
                            <p className='font-bold'>
                              {eventsWithFees.includes(label!)
                                ? `$${priceBase?.toFixed(2)} + fees`
                                : `$${priceFinal?.toFixed(2)}`}
                            </p>
                          </td>
                          <td className='text-right py-2 border-b border-gray-300'>
                            <select
                              value={ticketQuantities[`${zoneLabel}-${priceType}`] || 0}
                              onChange={(e) => {
                                const value = Math.min(
                                  10,
                                  Math.max(0, parseInt(e.target.value, 10))
                                )
                                handleTicketQuantityChange(zoneLabel, priceType, value)
                              }}
                              disabled={!isAvailable}
                              className={`w-24 border rounded-md p-2 text-lg ${
                                !isAvailable
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-white text-black'
                              }`}
                            >
                              {Array.from({ length: 11 }, (_, i) => (
                                <option key={i} value={i}>
                                  {i}
                                </option>
                              ))}
                            </select>
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

          {cart.length > 0 && (
            <div className='flex flex-col items-center mt-8 w-full max-w-4xl'>
              <div className='center mb-4 '>
                <p className='text-xl font-bold text-black'>Total: ${totalCost.toFixed(2)}</p>
              </div>
              <div className='text-right'>
                <Link to='/checkout'>
                  <button
                    className='bg-green-600 text-white mt-6 font-bold py-3 px-6 rounded-md hover:bg-green-700 transition duration-300'
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
