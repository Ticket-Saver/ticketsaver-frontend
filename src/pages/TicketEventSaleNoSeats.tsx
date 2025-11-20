import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { extractLatestPrices } from '../components/Utils/priceUtils'
import { Link } from 'react-router-dom'
import { ticketId } from '../components/TicketUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchGitHubImage } from '../components/Utils/FetchDataJson'
import { API_URLS } from '../config/api'
import ApiSeatingMap from '../components/ApiSeatingMap'

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

interface RouteParams {
  name?: string
  venue?: string
  date?: string
  location?: string
  label?: string
  delete?: string
}

interface TicketEventSaleNoSeatsProps {
  routeParams?: RouteParams
}

export default function TicketSelectionNoSeat({ routeParams }: TicketEventSaleNoSeatsProps) {
  // Usar los parámetros de props si están disponibles, sino usar useParams
  const params = useParams()
  const { name, venue, date, location, label } = routeParams || params

  console.log('DEBUG - routeParams recibidos:', routeParams)
  console.log('DEBUG - params de useParams:', params)
  console.log('DEBUG - valores finales:', { name, venue, date, location, label })

  console.log('Parámetros disponibles:', {
    name, // nombre del evento
    venue, // ID o identificador del venue
    date, // fecha del evento
    location, // ubicación
    label // identificador o etiqueta del evento
  })

  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`

  const token = import.meta.env.VITE_GITHUB_TOKEN
  const [cart, setCart] = useState<Cart[]>([])
  const [priceTagList, setPriceTags] = useState<
    Record<string, { price_base: number; price_final: number }>
  >({})
  const [zoneData, setZoneData] = useState<{
    zones?: Record<string, Record<string, { price_base: number; price_final: number }>>
  }>({})
  const [venueInfo] = useState<{ venue_name?: string } | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({})
  const navigate = useNavigate()
  const token2 = import.meta.env.VITE_TOKEN_HIEVENTS
  const hieventsUrl = API_URLS.API

  const [seatingMap, setSeatingMap] = useState<{
    event_id: string | number
    map_type: string
    svg_url: string
  } | null>(null)

  // Detectar si el evento tiene seating map; si existe, usaremos el mapa y no el listado
  useEffect(() => {
    const checkSeatingMap = async () => {
      try {
        if (!venue || venue === 'undefined') return
        const url = `${API_URLS.PUBLIC_EVENTS}${venue}/seating-map`
        const res = await fetch(url, { headers: { Accept: 'application/json' } })
        if (res.ok) {
          const data = await res.json()
          setSeatingMap(data)
        } else {
          setSeatingMap(null)
        }
      } catch (e) {
        setSeatingMap(null)
      }
    }
    checkSeatingMap()
  }, [venue])
  // Cargar la imagen del evento
  useEffect(() => {
    const loadImage = async () => {
      try {
        // Primero intentar con GitHub
        try {
          const url = await fetchGitHubImage(label!)
          setImageUrl(url)
        } catch (error) {
          // Si falla GitHub, intentar con la API local
          const localResponse = await fetch(`${hieventsUrl}events/${venue}/images`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN_HIEVENTS}`,
              'Content-Type': 'application/json'
            }
          })

          if (!localResponse.ok) {
            throw new Error('Error fetching local images')
          }

          const localData = await localResponse.json()
          if (localData.data && localData.data.length > 0) {
            setImageUrl(localData.data[0].url)
          }
        }
      } catch (error) {
        console.error('Error loading image:', error)
      }
    }

    loadImage()
  }, [label, venue, hieventsUrl])

  // Cargar los datos de las zonas y los precios (solo si NO hay seating map)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (seatingMap) return
        console.log('DEBUG - Iniciando fetchData con venue:', venue)
        // Primer intento: Nuevo endpoint de tickets
        const ticketsResponse = await fetch(
          `${hieventsUrl}public/events/${venue}/tickets?page=1&per_page=20&query=&sort_by=order&sort_direction=asc&position=&seat_number=&section=`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token2}`
            }
          }
        )

        console.log('DEBUG - Respuesta de tickets:', ticketsResponse.status, ticketsResponse.ok)

        if (ticketsResponse.ok) {
          const ticketsData = await ticketsResponse.json()
          console.log('Tickets Data:', ticketsData)

          // Formatear los datos de tickets para el formato esperado
          // La API devuelve directamente un array en data, no en data.tickets
          if (ticketsData.data && Array.isArray(ticketsData.data) && ticketsData.data.length > 0) {
            const tickets = ticketsData.data
            const formattedZoneData = {
              zones: tickets.reduce(
                (
                  acc: Record<string, Record<string, { price_base: number; price_final: number }>>,
                  ticket: {
                    id: number
                    title: string
                    price: number
                    prices: Array<{ price_including_taxes_and_fees?: number }>
                  }
                ) => {
                  // Usar el título del ticket como nombre de zona
                  const zoneName = ticket.title || 'General'
                  acc[zoneName] = {
                    [`price_${ticket.id}`]: {
                      price_base: ticket.price * 100,
                      price_final:
                        ticket.prices[0]?.price_including_taxes_and_fees * 100 || ticket.price * 100
                    }
                  }
                  return acc
                },
                {}
              )
            }
            setZoneData(formattedZoneData)

            const formattedPriceTags = tickets.reduce(
              (
                acc: Record<string, { price_base: number; price_final: number }>,
                ticket: {
                  id: number
                  price: number
                  prices: Array<{ price_including_taxes_and_fees?: number }>
                }
              ) => {
                acc[`price_${ticket.id}`] = {
                  price_base: ticket.price * 100,
                  price_final:
                    ticket.prices[0]?.price_including_taxes_and_fees * 100 || ticket.price * 100
                }
                return acc
              },
              {}
            )
            setPriceTags(formattedPriceTags)

            console.log('Formatted Zone Data:', formattedZoneData)
            console.log('Formatted Price Tags:', formattedPriceTags)
          } else {
            console.log('DEBUG - No hay tickets en la respuesta o estructura incorrecta')
          }
        } else {
          console.log(
            'DEBUG - Error en la respuesta de tickets:',
            ticketsResponse.status,
            ticketsResponse.statusText
          )
          throw new Error('Failed to fetch tickets')
        }
      } catch (error) {
        console.error('Error fetching tickets:', error)
        // Fallback a GitHub
        try {
          console.log('DEBUG - Intentando fallback a GitHub con label:', label)
          const response = await fetch(githubApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3.raw'
            }
          })
          if (!response.ok) {
            throw new Error('GitHub response error')
          }
          const zonePriceData = await response.json()
          setZoneData(zonePriceData)
          const zonePriceListData = extractLatestPrices(zonePriceData)
          setPriceTags(zonePriceListData)
        } catch (githubError) {
          console.error('Error fetching from GitHub:', githubError)
        }
      }
    }

    if (!seatingMap && venue && venue !== 'undefined') {
      fetchData()
    } else {
      console.log('DEBUG - No se puede hacer fetchData porque venue es:', venue)
    }
  }, [seatingMap, venue, hieventsUrl, token2, githubApiUrl, token, label])

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

  // Calcular el total de boletos en el carrito
  const totalTicketsInCart = cart.length

  // Calcular el costo total
  const totalCost = cart.reduce((acc, curr) => acc + curr.price_final, 0)

  // Manejar cambios en la cantidad de boletos
  const handleTicketQuantityChange = (
    zoneLabel: string,
    priceType: string,
    newQuantity: number
  ) => {
    // Limitar el número total de boletos en el carrito a 10
    const currentTotalTickets = totalTicketsInCart
    const currentQuantity = cart.filter(
      ticket => ticket.zoneName === zoneLabel && ticket.priceType === priceType
    ).length

    const totalNewTickets = currentTotalTickets - currentQuantity + newQuantity

    if (totalNewTickets <= 10) {
      setTicketQuantities(prev => ({
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
              seatLabel: zoneLabel, // Usar el nombre de la zona como seatLabel para que coincida con el title del API
              seatType: priceType,
              subZone: zoneLabel,
              priceType: priceType,
              ticketId: newTicketId
            }
          }
        )

        setCart(prev => [...prev, ...newTickets])
      } else if (newQuantity < currentQuantity) {
        const ticketsToRemove = cart
          .filter(ticket => ticket.zoneName === zoneLabel && ticket.priceType === priceType)
          .slice(0, currentQuantity - newQuantity)

        setCart(prev => prev.filter(ticket => !ticketsToRemove.includes(ticket)))
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

  // Si existe un seating map, renderizarlo y omitir el listado
  if (seatingMap) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-grow flex flex-col justify-between bg-gray-100">
          <div className="relative">
            <div className="relative h-96">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Event banner"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                <h1 className="text-4xl font-bold mb-4 bg-black bg-opacity-50 rounded-lg px-10 py-2">
                  {name}
                </h1>
                <p className="text-1xl mb-6 bg-black bg-opacity-50 rounded-lg px-10 py-2">{date}</p>
              </div>
            </div>
          </div>
          <div className="flex-grow flex flex-col items-center justify-start p-8 w-full max-w-6xl mx-auto">
            <ApiSeatingMap
              eventId={venue!}
              mapType={seatingMap.map_type}
              onProceed={({ seats, selectionLabel }) => {
                try {
                  console.log('🎫 Received seats from modal:', seats)
                  const builtCart = (seats || []).slice(0, 10).map((s, idx) => {
                    console.log(`🔍 Processing seat ${idx}:`, {
                      row: s.row,
                      seat_number: s.seat_number,
                      id: s.id,
                      title: s.title
                    })
                    const seatLabel = `${(s.row || '').toString().toUpperCase()}${s.seat_number}`
                    console.log(`🏷️ Generated seatLabel: ${seatLabel}`)
                    return {
                      price_base: typeof s.price === 'number' ? s.price : 0,
                      price_final: typeof s.price === 'number' ? s.price : 0,
                      zoneName: selectionLabel || s.section || s.position || 'Selection',
                      seatLabel: seatLabel,
                      seatType: s.price_range || s.section || s.position || 'General',
                      subZone: selectionLabel || s.section || 'Section',
                      priceType: s.price_range || 'price',
                      ticketId: `${seatLabel}-${idx}`,
                      seatId: s.id // Agregar el ID real del asiento
                    }
                  })

                  localStorage.setItem(
                    'cart_checkout',
                    JSON.stringify({
                      cart: builtCart,
                      eventInfo: {
                        id: label,
                        name,
                        venue: '',
                        venueId: venue,
                        date,
                        location
                      },
                      customer
                    })
                  )
                  navigate('/checkout')
                } catch (e) {
                  console.error('Error building cart from selection:', e)
                }
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow flex flex-col justify-between bg-gray-100">
        <div className="relative">
          <div className="relative h-96">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Event banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Event Information */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
              <h1 className="text-4xl font-bold mb-4 bg-black bg-opacity-50 rounded-lg px-10 py-2">
                {name}
              </h1>
              {venueInfo && (
                <h2 className="text-2xl mb-4 bg-black bg-opacity-50 rounded-lg px-10 py-2">
                  {venueInfo.venue_name}, {location}
                </h2>
              )}
              <p className="text-1xl mb-6 bg-black bg-opacity-50 rounded-lg px-10 py-2">{date}</p>
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-start p-8">
          {/* Sección de precios y selección de boletos */}
          {(() => {
            console.log('DEBUG - zoneData actual:', zoneData)
            return null
          })()}
          {zoneData.zones && Object.keys(zoneData.zones).length > 0 ? (
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-300">
              <h2 className="text-2xl font-bold mb-6 text-black">Precios de Tickets</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-black border-b-2 border-gray-300 pb-2">Tipo</th>
                    <th className="text-right text-black border-b-2 border-gray-300 pb-2">
                      Precio
                    </th>
                    <th className="text-right text-black border-b-2 border-gray-300 pb-2">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(zoneData.zones || {}).map(([zoneName, priceTypes]) =>
                    Object.entries(priceTypes).map(([priceType]) => {
                      const priceFinal = priceTagList[priceType]?.price_final / 100
                      return (
                        <tr key={`${zoneName}-${priceType}`} className="hover:bg-gray-100">
                          <td className="text-left font-normal text-black py-2 border-b border-gray-300">
                            {zoneName}
                          </td>
                          <td className="text-right font-normal text-black py-2 border-b border-gray-300">
                            <p className="font-bold">${priceFinal?.toFixed(2)}</p>
                          </td>
                          <td className="text-right py-2 border-b border-gray-300">
                            <select
                              value={ticketQuantities[`${zoneName}-${priceType}`] || 0}
                              onChange={e => {
                                const value = Math.min(
                                  10,
                                  Math.max(0, parseInt(e.target.value, 10))
                                )
                                handleTicketQuantityChange(zoneName, priceType, value)
                              }}
                              className="w-24 border rounded-md p-2 text-lg bg-white text-black"
                            >
                              {Array.from({ length: 2 }, (_, i) => (
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
            <p>Cargando zonas y precios...</p>
          )}

          {/* Botón de Checkout */}
          {cart.length > 0 && (
            <div className="flex flex-col items-center mt-8 w-full max-w-4xl">
              {/* Total Cost aligned to the left */}
              <div className="center mb-4 ">
                <p className="text-xl font-bold text-black">Total: ${totalCost.toFixed(2)}</p>
              </div>

              {/* Checkout Button centered */}
              <div className="text-right">
                <Link to="/checkout">
                  <button
                    className="bg-green-600 text-white mt-6 font-bold py-3 px-6 rounded-md hover:bg-green-700 transition duration-300"
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
