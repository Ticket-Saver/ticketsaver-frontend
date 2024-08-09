import {
  useState,
  //ChangeEvent,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SeatchartJS, { CartChangeEvent } from 'seatchart'
import Seatchart from '../components/Seatchart'
import InteractiveMap from '../components/InteractiveMap'
import CalifoniaTheatreMap from '../components/maps/californiatheatre_ca'
import Unioncountry from '../components/maps/unioncounty_nj'
import californiaTheatreSvg from '../assets/maps/californiaTheatre.svg'
import unionCountySvg from '../assets/maps/union_county.svg'
import { v4 as uuidv4 } from 'uuid'
import { fetchGitHubImage } from '../components/Utils/FetchDataJson'

import { ticketId } from '../components/TicketUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { extractLatestPrices, find_price, zoneseatToPrice } from '../components/Utils/priceUtils'

interface Cart {
  price_base: number
  price_final: number
  zoneName: string
  seatLabel: string
  seatType: string
  subZone: string
  coords: { row: number; col: number }
  priceType: string
  ticketId: string
}

export default function TicketSelection() {
  const { name, venue, date, location, label } = useParams()
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`
  const githubApiUrl2 = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const githubApiUrl3 = `${import.meta.env.VITE_GITHUB_API_URL as string}/banners/${label}.png?ref=event-test`

  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await fetchGitHubImage(githubApiUrl3)
        setImageUrl(url)
      } catch (error) {
        console.error('Error loading image:', error)
      }
    }

    loadImage()
  }, [])

  // Remove the unused sessionId variable
  const [, setSessionId] = useState<string>('') // State to store sessionId

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
    // Check if sessionId already exists in cookies
    const existingSessionId = getCookieStart('sessionId')
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

  const [eventSelected, setEventSelected] = useState<string | ''>('las_leonas.02')
  const [priceTagList, setPriceTags] = useState<any>([])
  const [zoneData, setZoneData] = useState<any>([])

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
        console.error('Error fetching zone Data', error)
      }
    }
    fetchData()
  }, [])

  const [venueInfo, setVenue] = useState<any>(null)

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(githubApiUrl2, options)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        const matchingVenue = data[venue!]
        console.log('miremos ', matchingVenue)
        setVenue(matchingVenue)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchVenues()
  }, [])
  console.log('label de esto', venueInfo)
  useEffect(() => {
    if (label) {
      let eventlabel = label.replace(/\./g, '')
      setEventSelected(eventlabel)
    }
  })

  const eventZones: { [key: string]: string[] } = {
    //seatchartCurrentArea.title
    las_leonas03: ['Yellow', 'Orange', 'Purple', 'Coral', 'Green'],
    las_leonas02: ['Pink', 'Aqua', 'Blue', 'Gray', 'Coral']
  }

  const priceTag: { [key: string]: string[] } = {
    las_leonas03: ['P1', 'P2', 'P3', 'P4', 'P5'],
    las_leonas02: ['P1', 'P2', 'P3', 'P4', 'P5']
  }

  const eventZonePrices: { [key: string]: number[] } = {
    las_leonas03: [110, 90, 75, 60, 40],
    las_leonas02: [110, 90, 70, 55, 40]
  }

  const { user } = useAuth0()

  const customer = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone_number
  }

  const [cart, setCart] = useState<Cart[]>([])
  const navigate = useNavigate()

  const totalCost = cart?.reduce((acc, crr) => (acc = acc + crr.price_final), 0) || 0

  const handleCheckout = async () => {
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({
        cart: cart,
        eventInfo: {
          id: label,
          name: name,
          venue: venueInfo.name,
          venueId: venue,
          date: date,
          location: location
        },
        customer: customer
      })
    )
    navigate('/checkout')
  }

  const [seatchartCurrentOptions, setSeatchartCurrentOptions] = useState<any>(null)
  const [seatchartCurrentArea, setSeatchartCurrentArea] = useState<any>(null)

  let seatchartRef = useRef<SeatchartJS>()

  function ArraysplitSeatLabel(seatLabel: string): [string, number] {
    const match = seatLabel.match(/^([A-Za-z🧏♿🚹🦽]+)(\d+)$/)
    if (match) {
      const letters = match[1]
      const numbers = parseInt(match[2], 10)
      return [letters, numbers]
    } else {
      throw new Error('Invalid seat label format')
    }
  }

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

  const [, setIsError] = useState(false)
  const [, setErrorMessage] = useState('')

  const handleOnSeatClick = async (e: CartChangeEvent) => {
    const sessionId = getCookie('sessionId')
    if (e.action === 'add') {
      const globalSeat = ArraysplitSeatLabel(e.seat.label)
      const lockingSeat = {
        Seat: e.seat.label,
        row: e.seat.index.row,
        col: e.seat.index.col,
        subZone: seatchartCurrentArea.title,
        sessionId: sessionId
      }

      try {
        // Wait for the lockSeats to complete
        console.log(lockingSeat)
        await lockSeats(lockingSeat)

        // Proceed only if lockSeats was successful
        if (eventSelected !== '') {
          const cartLength = (cart || []).length

          const issuedAt = Date.now()
          const newTicketId = ticketId(label || '', eventSelected, cartLength + 1, issuedAt)

          const zoneColorType_ = seatchartCurrentArea?.name as string // referente a los nombres de cada zona del mapa

          const zoneColors = eventZones[eventSelected] //referente a las zonas de los mapas( por colores)

          const colorIndex = zoneColors.indexOf(zoneColorType_)

          let price_base: number
          let priceType: string

          if (label == 'las_leonas.02' || label == 'las_leonas.03') {
            ;(priceType = priceTag[eventSelected][colorIndex]),
              (price_base = eventZonePrices[eventSelected][colorIndex])
          } else {
            ;(priceType = zoneseatToPrice(zoneData.zones, seatchartCurrentArea.title, globalSeat)),
              (price_base = find_price(zoneData, seatchartCurrentArea.title, globalSeat))
          }

          setCart((prev: Cart[] | undefined) => {
            const newCart = [
              ...(prev || []),
              {
                price_base: price_base, //
                price_final: priceTagList[priceType].price_final / 100,
                zoneName: eventSelected,
                seatLabel: e.seat.label,
                seatType: zoneColorType_,
                subZone: seatchartCurrentArea.title,
                coords: { row: e.seat.index.row, col: e.seat.index.col },
                priceType: priceType,
                ticketId: newTicketId,
                issuedAt: issuedAt
              }
            ]
            console.log(newCart)
            return newCart
          })
        }
      } catch (error) {
        console.error('Failed to lock seat:', error)
        setErrorMessage('Failed to lock the seat. Please reload map by clicking it.')
        setIsError(true)
        return
      }
    } else if (e.action === 'remove') {
      const lockingSeat = {
        Seat: e.seat.label,
        row: e.seat.index.row,
        col: e.seat.index.col,
        subZone: seatchartCurrentArea.title,
        sessionId: sessionId
      }

      try {
        await lockSeats(lockingSeat)

        setCart((prev) => prev?.filter((cart) => cart.seatLabel !== e.seat.label))
      } catch (error) {
        console.error('Failed to unlock seat:', error)
      }
    }
  }
  const [windowSize, setWindowSize] = useState(0)

  const handleWindowResize = useCallback(() => {
    setWindowSize(window.innerWidth)
  }, [])

  useEffect(() => {
    setWindowSize(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const handleGetAreaSeats = async (areaTitle: any) => {
    try {
      const response = await fetch('/api/fetchTakenSeats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subZone: areaTitle })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      const takenSeats = result.data

      return takenSeats
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const lockSeats = async (seat: any) => {
    try {
      const response = await fetch('/api/lockSeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(seat)
      })

      if (!response.ok) {
        throw new Error('Failed to insert seats')
      }

      const data = await response.json()
      console.log('Data', data)
    } catch (error) {
      throw new Error('error locking seats')
    }
  }

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('local_cart') as string))
  }, [])
  useEffect(() => {
    localStorage.setItem('local_cart', JSON.stringify(cart))
  }, [cart])

  const [selectedSeats, setSelectedSeats] = useState<{ seatLabel: string; seatType: string }[]>([])

  const onTicketClick = (ticket: { seatLabel: string; seatType: string }) => {
    setCart((prev) =>
      prev?.filter(
        (cart) => cart.seatLabel !== ticket.seatLabel && cart.seatType === ticket.seatType
      )
    )

    const newSelectedSeats = selectedSeats.filter(
      (seat) => seat.seatLabel !== ticket.seatLabel || seat.seatType !== ticket.seatType
    )
    setSelectedSeats(newSelectedSeats)

    const newOptions = { ...seatchartCurrentOptions, reservedSeats: newSelectedSeats }
    setSeatchartCurrentOptions(newOptions)
  }

  return (
    <div className='bg-gray-100'>
      <div className='bg-gray-100 relative'>
        {/* Event Header */}
        <div className='absolute inset-0'>
          {/* Cover Image */}
          <div className='relative h-96 bg-gray-500'>
            {/* Event Profile Image */}
            <div className='absolute inset-0 overflow-hidden'>
              <img
                src={imageUrl}
                alt='Event banner'
                className='w-full h-full object-cover overflow-hidden blur-sm object-top'
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
          {/* Event Description */}
          <div className='text-primary-content relative'>
            <h1 className='text-6xl font-bold mb-4 bg-black bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto '>
              {name}
            </h1>
            <div className='block'>
              <h2 className='text-4xl mb-4 bg-black bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
                {venue}, {location}
              </h2>
            </div>
            <div className='ml-auto sm:w-full md:w-96 text-black bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-lg font-bold mb-6'>Ticket Prices</h2>
              {/* Static Table */}
              <table className='w-full gap-y-2'>
                <thead>
                  <tr>
                    <th className='text-left'>Type</th>
                    <th className='text-right'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Static ticket data */}
                  <tr>
                    <th className='text-left font-normal'>Section ticket</th>
                    <th className='text-right font-normal'>
                      Starting prices from
                      <a className='font-bold'> $59 </a>+ <a className='font-bold'>Fee </a>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full py-3'>
        {/* Event Description */}
        <div className='relative justify-center bg-gray-100 text-black'>
          {/* Selection Elements */}
          <div className='md:flex sm:flex-row justify-center w-full'>
            <div className='w-full md:w-1/2 justify-items-center  mr-20'>
              <h2 className='text-4xl font-bold mb-10 text-center '>Choose your tickets</h2>
              {/* Ticket Type */}
              <div className='mb-4'>
                <div className='w-full justify-center items-center'>
                  {
                    <>
                      <div className='mt-4 font-bold text-xl text-center'>
                        Click on the map to select a Zone
                      </div>
                      <div className='items-center flex justify-center'>
                        <InteractiveMap
                          handleClickImageZone={async (area) => {
                            console.log('Area: ', area.title)
                            handleGetAreaSeats(area.title).then((parsedSeats) => {
                              let selectedOptions = area.Options
                              selectedOptions.map.reservedSeats = parsedSeats
                              setSeatchartCurrentOptions(selectedOptions)
                            })
                            setSeatchartCurrentArea(area)
                          }}
                          getDefaultMap={
                            label === 'las_leonas.03'
                              ? CalifoniaTheatreMap
                              : label === 'las_leonas.02'
                                ? Unioncountry
                                : () => ({ name: '', areas: [] }) // Default empty map
                          }
                          width={windowSize < 768 ? (windowSize * 7) / 8 : windowSize / 2}
                          src={
                            label === 'las_leonas.03'
                              ? californiaTheatreSvg
                              : label === 'las_leonas.02'
                                ? unionCountySvg
                                : '' // Default empty string
                          }
                        />
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
            {seatchartCurrentOptions && (
              <div className='mt-4 w-auto'>
                <div className='bg-gray-300 rounded-xl p-4 m-4'>
                  <div className='text-xl font-bold'>Select your seat</div>
                  <Seatchart
                    options={seatchartCurrentOptions}
                    ref={seatchartRef}
                    onSeatClick={handleOnSeatClick}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Receipt */}
          <div className='w-full p-4'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>Summary</h2>
              {cart?.length !== 0 ? (
                <>
                  {cart?.map((ticket, index) => {
                    return (
                      <div
                        key={index}
                        className={`mb-4 pb-4 border-b-2 border-gray flex justify-between flex-row`}
                      >
                        <div>
                          <a className='pr-5'>
                            Ticket {ticket.subZone} -{' '}
                            {ticket.seatLabel.includes('♿')
                              ? `${ticket.seatLabel} - ADA`
                              : ticket.seatLabel.includes('🚹')
                                ? `${ticket.seatLabel} - COMP`
                                : ticket.seatLabel.includes('🦽')
                                  ? `${ticket.seatLabel} - Limited Mobility Seat`
                                  : ticket.seatLabel}{' '}
                          </a>
                          <button
                            className='btn btn-circle bg-red-700 text-white'
                            onClick={() => {
                              const sessionIdCookie = getCookie('sessionId')
                              const lockingSeat = {
                                Seat: ticket.seatLabel,
                                row: ticket.coords.row,
                                col: ticket.coords.col,
                                subZone: seatchartCurrentArea.title,
                                sessionId: sessionIdCookie
                              }
                              lockSeats(lockingSeat)
                              onTicketClick(ticket)
                            }}
                          >
                            {' '}
                            X
                          </button>
                          <p> Fees</p>
                          <p className='font-bold'>Ticket Total</p>
                        </div>
                        <div>
                          <p>${ticket.price_base.toFixed(2)}</p>
                          <p>${(ticket.price_final - ticket.price_base).toFixed(2)}</p>

                          <p className='font-bold'>${ticket.price_final.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}

                  {/* Total Cost */}
                  <div className='mt-8 flex justify-between'>
                    <div>
                      <p className='text-xl font-bold'>Total</p>
                    </div>
                    <div>
                      <p className='text-xl font-bold'>${totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                  {/* Proceed to Checkout Button */}
                  <div className='flex justify-center'>
                    <button
                      className='bg-green-500 w-1/3 hover:bg-green-600 text-white py-2 px-4 rounded mt-4'
                      onClick={() => handleCheckout()}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              ) : (
                <div className='text-red-600 text-xl font-bold'>
                  {' '}
                  You haven't selected any tickets yet!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
