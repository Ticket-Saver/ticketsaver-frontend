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

import { ticketId } from '../components/TicketUtils'
import { useAuth0 } from '@auth0/auth0-react'

interface Cart {
  price: number
  serviceFee: number
  ffFee: number
  creditCardFee: number
  seat: { row: string; col: string }
  zoneName: string
  zoneId: string
  seatLabel: string
  seatType: string
  subZone: string
  coords: { row: number; col: number }
  priceTag: string
  priceType: string
  venueZone: string
  ticketId: string
}

export default function TicketSelection() {
  const { name, venuesName,date, location, label } = useParams()
  console.log(label)
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

  const [eventZoneSelected] = useState<'orchestra' | 'loge' | ''>('orchestra')

  const eventZones: { [key: string]: string[] } = {
    orchestra: ['Yellow', 'Orange', 'Purple', 'Coral', 'Green'],
    loge: ['Red', 'Blue', 'Green', 'Purple', 'Yellow']
  }
  const priceTag = {
    orchestra: ['P1', 'P2', 'P3', 'P4', 'P5'],
    loge: ['P1', 'P2', 'P3', 'P4', 'P5']
  }

  const eventZonePrices: { [key: string]: number[] } = {
    orchestra: [110, 90, 75, 60, 40],
    loge: [100, 80, 65, 50, 30]
  }
  const FFFFees = {
    orchestra: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5],
    loge: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5]
  }
  const ServiceFees = {
    orchestra: [13.2, 10.8, 9.0, 7.2, 4.8],
    loge: [13.2, 10.8, 9.0, 7.2, 4.8]
  }
  const CreditCardFees = {
    orchestra: [4.45, 3.66, 3.01, 2.48, 1.7],
    loge: [4.45, 3.66, 3.01, 2.48, 1.7]
  }
  const { user } = useAuth0()

  const customer = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone_number
  }

  const [cart, setCart] = useState<Cart[]>([])
  const navigate = useNavigate()

  /*const handleEventZoneSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "orchestra") {
      setEventZoneSelected(event.target.value);
    }
  };*/

  // Calculate total cost based on selected tickets
  const ticketCost = cart?.reduce((acc, crr) => (acc = acc + crr.price), 0) || 0

  // Assuming a fixed service fee of $5
  const serviceFee = cart?.reduce((acc, crr) => (acc = acc + crr.serviceFee), 0) || 0
  const ffFee = cart?.reduce((acc, crr) => (acc = acc + crr.ffFee), 0) || 0
  const creditCardFee = cart?.reduce((acc, crr) => (acc = acc + crr.creditCardFee), 0) || 0

  const totalCost = ffFee + creditCardFee + serviceFee + ticketCost

  const handleCheckout = async () => {
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({
        cart: cart,
        eventInfo: {
          id: label,
          name: name,
          venue: venuesName,
          date: date
        },
        customer: customer
      })
    )
    navigate('/checkout')
  }

  const [seatchartCurrentOptions, setSeatchartCurrentOptions] = useState<any>(null)
  const [seatchartCurrentArea, setSeatchartCurrentArea] = useState<any>(null)

  let seatchartRef = useRef<SeatchartJS>()

  function splitSeatLabel(seatLabel: string): {
    letters: string
    numbers: string
  } {
    const match = seatLabel.match(/^([A-Za-z🧏♿🚹🦽]+)(\d+)$/)
    if (match) {
      return { letters: match[1], numbers: match[2] }
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
      const globalSeat = splitSeatLabel(e.seat.label)
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
        if (eventZoneSelected !== '') {
          const cartLength = (cart || []).length
          const newTicketId = ticketId(
            label || "" ,
            eventZoneSelected,
            cartLength + 1,
            Date.now()
          )

          const zoneColorType_ = seatchartCurrentArea?.name as string
          const zoneColors = eventZones[eventZoneSelected]
          const colorIndex = zoneColors.indexOf(zoneColorType_)

          console.log(zoneColorType_)
          console.log(zoneColors)
          console.log(colorIndex)
          console.log('-----------------------------------')
          console.log('eventZonePrices:', eventZonePrices)
          console.log('eventZoneSelected:', eventZoneSelected)
          console.log('colorIndex:', colorIndex)
          console.log('ServiceFees:', ServiceFees)
          console.log('FFFFees:', FFFFees)
          console.log('CreditCardFees:', CreditCardFees)
          console.log('globalSeat:', globalSeat)
          console.log('e.seat.label:', e.seat.label)
          console.log('zoneColorType_:', zoneColorType_)
          console.log('seatchartCurrentArea.title:', seatchartCurrentArea.title)
          console.log('priceTag:', priceTag)
          console.log('newTicketId:', newTicketId)

          if (
            !eventZonePrices[eventZoneSelected] ||
            !ServiceFees[eventZoneSelected] ||
            !FFFFees[eventZoneSelected] ||
            !CreditCardFees[eventZoneSelected] ||
            !globalSeat ||
            !priceTag[eventZoneSelected] ||
            colorIndex === -1
          ) {
            throw new Error('One or more required values are missing or invalid')
          }
          setCart((prev: Cart[] | undefined) => {
            const newCart = [
              ...(prev || []),
              {
                price: eventZonePrices[eventZoneSelected][colorIndex],
                serviceFee: ServiceFees[eventZoneSelected][colorIndex],
                ffFee: FFFFees[eventZoneSelected][colorIndex],
                creditCardFee: CreditCardFees[eventZoneSelected][colorIndex],
                seat: { row: globalSeat.letters, col: globalSeat.numbers },
                zoneName: eventZoneSelected,
                zoneId: 'Yuridia',
                seatLabel: e.seat.label,
                seatType: zoneColorType_,
                subZone: seatchartCurrentArea.title,
                coords: { row: e.seat.index.row, col: e.seat.index.col },
                priceTag: priceTag[eventZoneSelected][colorIndex],
                priceType: priceTag[eventZoneSelected][colorIndex],
                venueZone: eventZoneSelected,
                ticketId: newTicketId
              }
            ]
            console.log(newCart)
            return newCart
          })
        }
      } catch (error) {
        console.error('Failed to lock seat:', error)
        setErrorMessage('Failed to lock the seat. Please reload map by clicking it.') // Customize error message as needed
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
      console.log(result)
      const takenSeats = result.data
      console.log(takenSeats)

      return takenSeats // Process the taken seats as needed
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

  /*const handleClickImageZone = useCallback(
    (area) => {
      handleGetAreaSeats(area.title).then((parsedSeats) => {
        let selectedOptions = area.Options;
        selectedOptions.map.reservedSeats = parsedSeats;
        setSeatchartCurrentOptions(selectedOptions);
      });
      setSeatchartCurrentArea(area);
    },
    [setSeatchartCurrentOptions, setSeatchartCurrentArea]
  );*/

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
                src='/events/Leonas.jpg' // Replace with a default image
                alt='Event Profile'
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
                {venuesName}, {location}
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
                          <p>FF Fee</p>
                          <p>Processing Fee</p>
                          <p>Credit Card Fee</p>
                          <p className='font-bold'>Ticket Total</p>
                        </div>
                        <div>
                          <p>${ticket.price.toFixed(2)}</p>
                          <p>${ticket.ffFee.toFixed(2)}</p>
                          <p>${ticket.serviceFee.toFixed(2)}</p>
                          <p>${ticket.creditCardFee.toFixed(2)}</p>
                          <p className='font-bold'>
                            $
                            {(
                              ticket.price +
                              ticket.ffFee +
                              ticket.serviceFee +
                              ticket.creditCardFee
                            ).toFixed(2)}
                          </p>
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
