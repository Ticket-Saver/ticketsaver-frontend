import { useState, ChangeEvent, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom';
import SeatchartJS, { CartChangeEvent } from 'seatchart'
import Seatchart from '../InteractiveMap'
import InteractiveMap from '../InteractiveMap';
import UnionCountryMap from '@/components/assets/UnionCountyMap'
import { v4 as uuidv4 } from 'uuid'

import { ticketId } from '../TicketUtils'

import { useAuth0 } from '@auth0/auth0-react';

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
}

export default function TicketSelection() {
  const [sessionId, setSessionId] = useState<string>('') // State to store sessionId

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

  const { user } = useAuth0()

  const customer = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone_number
  }

  const [eventZoneSelected, setEventZoneSelected] = useState<'orchestra' | 'loge' | ''>('orchestra')

  const eventZones = {
    orchestra: ['Pink', 'Aqua', 'Blue', 'Gray', 'Coral']
  }
  const priceTag = {
    orchestra: ['P1', 'P2', 'P3', 'P4', 'P5']
  }

  const eventZonePrices = {
    orchestra: [110, 90, 70, 55, 40]
  }
  const FFFFees = {
    orchestra: [3.5, 3.5, 3.5, 3.5, 3.5]
  }
  const ServiceFees = {
    orchestra: [13.2, 10.8, 8.4, 6.6, 4.8] //revisar precios y fees
  }
  const CreditCardFees = {
    orchestra: [4.45, 3.66, 2.87, 2.28, 1.7]
  }

  const [cart, setCart] = useState<Cart[]>([])

  const handleEventZoneSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'orchestra') {
      setEventZoneSelected(event.target.value)
    }
  }

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
          id: 'las_leonas.02',
          name: 'las Leonas',
          venue: 'Union County Performing Arts Center',
          date: 'September 1st, 2024'
        },
        customer: customer
      })
    )
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

  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
        await lockSeats(lockingSeat)

        // Proceed only if lockSeats was successful
        if (eventZoneSelected !== '') {
          const zoneColorType_ = seatchartCurrentArea?.name as string
          const zoneColors = eventZones[eventZoneSelected]
          const colorIndex = zoneColors.indexOf(zoneColorType_)
          setCart((prev: Cart[] | undefined) => [
            ...(prev || []),
            {
              price: eventZonePrices[eventZoneSelected][colorIndex],
              serviceFee: ServiceFees[eventZoneSelected][colorIndex],
              ffFee: FFFFees[eventZoneSelected][colorIndex],
              creditCardFee: CreditCardFees[eventZoneSelected][colorIndex],
              seat: { row: globalSeat.letters, col: globalSeat.numbers },
              zoneName: eventZoneSelected,
              zoneId: 'Yuridia', //????
              seatLabel: e.seat.label,
              seatType: zoneColorType_,
              subZone: seatchartCurrentArea.title,
              coords: { row: e.seat.index.row, col: e.seat.index.col },
              priceTag: priceTag[eventZoneSelected][colorIndex]
            }
          ])
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

      const takenSeats = await response.json()
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
      throw new Error('error locking seats', error)
    }
  }

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('local_cart')))
  }, [])
  useEffect(() => {
    localStorage.setItem('local_cart', JSON.stringify(cart))
  }, [cart])

  const handleClickImageZone = useCallback(
    (area) => {
      handleGetAreaSeats(area.title).then((parsedSeats) => {
        let selectedOptions = area.Options
        selectedOptions.map.reservedSeats = parsedSeats
        setSeatchartCurrentOptions(selectedOptions)
      })
      setSeatchartCurrentArea(area)
    },
    [setSeatchartCurrentOptions, setSeatchartCurrentArea]
  )

  const [selectedSeats, setSelectedSeats] = useState([])

  const onTicketClick = (ticket) => {
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
                src='/Leonas.jpg' // Replace with a default image
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
            <h1 className='text-6xl font-bold mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto '>
              Las Leonas
            </h1>
            <div className='block'>
              <h2 className='text-4xl mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
                Union County Performing Arts Center
              </h2>
            </div>
            <div className='ml-auto sm:w-full md:w-96 text-primary-content bg-white rounded-lg shadow-sm p-6'>
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
                      <a className='font-bold'> $40 </a>+ <a className='font-bold'>Fee </a>
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
        <div className='relative justify-center bg-gray-100 text-primary-content'>
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
                          getDefaultMap={UnionCountryMap}
                          width={windowSize > 768 ? (windowSize * 1) / 2 : (windowSize * 1) / 2}
                          src={'/maps/UnionCountry.svg'}
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
                    const totalOfTicketByZone = cart?.filter(
                      (c) => c.zoneId === ticket.zoneId
                    ).length
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
                    <Link to='/checkout'>
                      <button
                        className='bg-green-500 w-1/3 hover:bg-green-600 text-white py-2 px-4 rounded mt-4'
                        onClick={() => handleCheckout()}
                        >
                        Proceed to Checkout
                      </button>
                    </Link>
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
