import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { API_URLS } from '../config/api'

interface RouteParams {
  name?: string
  venue?: string
  date?: string
  location?: string
  label?: string
  delete?: string
  displayDate?: string
  bannerImageUrl?: string
}

interface GeneralAdmissionTicketsProps {
  routeParams?: RouteParams
  preloadedTickets?: Ticket[]
}

interface TicketPrice {
  id: number
  label: string | null
  price: number
  price_including_taxes_and_fees: number
  tax_total: number
  fee_total: number
  sale_start_date: string | null
  sale_end_date: string | null
  initial_quantity_available?: number
  quantity_sold?: number
  is_available: boolean
  is_sold_out: boolean
}

interface Ticket {
  id: number
  title: string
  description: string | null
  type: string
  prices: TicketPrice[]
  quantity_available: number
  quantity_sold: number
  is_sold_out: boolean
  is_available: boolean
}

interface ValidationItem {
  ticket_id: number
  ticket_title: string
  requested_quantity: number
  is_available: boolean
  error?: string
}

export default function GeneralAdmissionTickets({
  routeParams,
  preloadedTickets
}: GeneralAdmissionTicketsProps) {
  const params = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()
  const { name, venue, date, location, label, displayDate } = routeParams || params

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({})

  const token = import.meta.env.TOKEN_HIEVENTS

  // Fecha amigable a mostrar: priorizar la que viene formateada desde SalePage / API
  const effectiveDate =
    (displayDate as string | undefined) ||
    (date
      ? new Date(date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : '')

  useEffect(() => {
    const fetchTickets = async () => {
      // Si ya tenemos tickets precargados, usarlos directamente
      if (preloadedTickets && preloadedTickets.length > 0) {
        console.log('✅ Using preloaded tickets:', preloadedTickets)
        const availableTickets = preloadedTickets.filter((ticket: Ticket) => ticket.is_available)
        setTickets(availableTickets)

        // Inicializar cantidades seleccionadas
        const initialQuantities: { [key: number]: number } = {}
        availableTickets.forEach((ticket: Ticket) => {
          initialQuantities[ticket.id] = 0
        })
        setSelectedQuantities(initialQuantities)
        setIsLoading(false)
        return
      }

      // Fallback: buscar tickets del endpoint si no vienen precargados
      if (!venue) return

      setIsLoading(true)
      setError(null)

      try {
        const publicEventUrl = `${API_URLS.PUBLIC_EVENTS}${venue}/`
        console.log('🎫 Fetching event with tickets from:', publicEventUrl)

        const response = await fetch(publicEventUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`)
        }

        const result = await response.json()
        console.log('📦 Event data:', result)

        const eventData = result.data || result
        const ticketsArray = eventData.tickets || []

        // Filtrar solo tickets disponibles
        const availableTickets = ticketsArray.filter((ticket: Ticket) => ticket.is_available)
        setTickets(availableTickets)

        // Inicializar cantidades seleccionadas
        const initialQuantities: { [key: number]: number } = {}
        availableTickets.forEach((ticket: Ticket) => {
          initialQuantities[ticket.id] = 0
        })
        setSelectedQuantities(initialQuantities)
      } catch (err) {
        console.error('❌ Error loading tickets:', err)
        setError('Failed to load tickets. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [venue, token, preloadedTickets])

  const handleQuantityChange = (ticketId: number, quantity: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [ticketId]: quantity
    }))
    // Limpiar error de validación cuando el usuario cambia la cantidad
    if (validationErrors[ticketId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[ticketId]
        return newErrors
      })
    }
  }

  const validateAvailability = async (selectedTickets: Ticket[]) => {
    try {
      const validationPayload = {
        tickets: selectedTickets.map((ticket) => ({
          ticket_id: ticket.id,
          quantity: selectedQuantities[ticket.id]
        }))
      }

      console.log('🔍 Validating availability:', validationPayload)

      const apiUrl = API_URLS.API
      const response = await fetch(
        `${apiUrl}public/events/${venue}/tickets/validate-availability`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(validationPayload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error validating availability')
      }

      const validationResult = await response.json()
      console.log('✅ Validation result:', validationResult)

      if (!validationResult.is_available) {
        // Procesar errores de validación
        const errors: { [key: number]: string } = {}
        const validationItems = validationResult.validation as ValidationItem[]
        validationItems?.forEach((item) => {
          if (!item.is_available && item.error) {
            errors[item.ticket_id] = item.error
          }
        })
        setValidationErrors(errors)
        return false
      }

      // Limpiar errores si todo está disponible
      setValidationErrors({})
      return true
    } catch (err) {
      console.error('❌ Error validating availability:', err)
      throw err
    }
  }

  const handleCheckout = async () => {
    // Verificar autenticación
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
        authorizationParams: {
          screen_hint: 'signup'
        }
      })
      return
    }

    // Filtrar tickets con cantidad > 0
    const selectedTickets = tickets.filter((ticket) => selectedQuantities[ticket.id] > 0)

    if (selectedTickets.length === 0) {
      alert('Please select at least one ticket')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Validar disponibilidad primero
      const isAvailable = await validateAvailability(selectedTickets)

      if (!isAvailable) {
        setIsProcessing(false)
        // Los errores ya están configurados en validationErrors
        alert(
          'Some tickets are not available. Please check the errors below and adjust your selection.'
        )
        return
      }

      // 2. Construir el array de tickets según el formato de la API
      const ticketsPayload = selectedTickets.map((ticket) => {
        const price = ticket.prices[0] // Usar el primer precio disponible
        return {
          ticket_id: ticket.id,
          quantities: [
            {
              price_id: price.id,
              quantity: selectedQuantities[ticket.id]
            }
          ]
        }
      })

      console.log('🛒 Creating order with tickets:', ticketsPayload)

      // Crear la orden en el backend
      const apiUrl = API_URLS.API
      const orderResponse = await fetch(`${apiUrl}public/events/${venue}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tickets: ticketsPayload
        })
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error creating order')
      }

      const orderData = await orderResponse.json()
      const order = orderData.data

      console.log('✅ Order created:', order)

      // 2b. Enviar attendees básicos con los datos del comprador antes de crear la sesión de pago
      const buyerEmail = user?.email || ''
      const fullName = user?.name || ''

      if (!buyerEmail) {
        throw new Error('No se encontró email del comprador para asignar a los asistentes')
      }

      let buyerFirstName = fullName || ''
      let buyerLastName = ''

      if (fullName && fullName.includes(' ')) {
        const parts = fullName.split(' ')
        buyerFirstName = parts[0]
        buyerLastName = parts.slice(1).join(' ')
      }

      if (!buyerFirstName) {
        buyerFirstName = 'Guest'
      }

      if (!buyerLastName) {
        buyerLastName = buyerFirstName
      }

      // Construir arreglo de attendees: mismo comprador repetido según cantidad de tickets
      const attendeesPayload: {
        first_name: string
        last_name: string
        email: string
        ticket_price_id: number
      }[] = []

      selectedTickets.forEach((ticket) => {
        const quantity = selectedQuantities[ticket.id] || 0
        const price = ticket.prices[0]
        if (!price) return

        for (let i = 0; i < quantity; i++) {
          attendeesPayload.push({
            first_name: buyerFirstName,
            last_name: buyerLastName,
            email: buyerEmail,
            ticket_price_id: price.id
          })
        }
      })

      if (attendeesPayload.length === 0) {
        throw new Error('No se pudo construir la lista de asistentes para la orden')
      }

      console.log('👥 Enviando attendees para orden general:', attendeesPayload)

      const updateOrderResponse = await fetch(
        `${apiUrl}public/events/${venue}/order/${order.short_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            order: {
              first_name: buyerFirstName,
              last_name: buyerLastName,
              email: buyerEmail
            },
            attendees: attendeesPayload
          })
        }
      )

      if (!updateOrderResponse.ok) {
        const errorData = await updateOrderResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error updating order attendees')
      }

      console.log(
        '✅ Order attendees updated for general admission:',
        await updateOrderResponse.json()
      )

      // 3. Iniciar el checkout de Stripe usando el mismo endpoint que eventos numerados
      const successUrl = `${window.location.origin}/checkout/${venue}/${order.short_id}/success`

      // Construir cancel_url con componentes codificados correctamente
      const encodedName = encodeURIComponent(name || '')
      const encodedLocation = encodeURIComponent(location || 'unknown')
      const cancelUrl = `${window.location.origin}/sale/${encodedName}/${venue}/${encodedLocation}/${date}/${label}/null`

      console.log('🔗 URLs:', { successUrl, cancelUrl })

      const paymentResponse = await fetch(
        `${apiUrl}public/events/${venue}/order/${order.short_id}/stripe/checkout_session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            success_url: successUrl,
            cancel_url: cancelUrl
          })
        }
      )

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error creating payment session')
      }

      const checkoutData = await paymentResponse.json()
      console.log('💳 Stripe checkout session created:', checkoutData)

      // Redirigir a Stripe Checkout
      if (checkoutData.data?.checkout_url) {
        window.location.href = checkoutData.data.checkout_url
      } else {
        throw new Error('No checkout URL returned from API')
      }
    } catch (err) {
      console.error('❌ Error in checkout:', err)
      alert(
        `Error processing checkout: ${err instanceof Error ? err.message : 'Please try again.'}`
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateTotal = () => {
    return tickets.reduce((total, ticket) => {
      const quantity = selectedQuantities[ticket.id] || 0
      const price = ticket.prices[0]?.price_including_taxes_and_fees || 0
      return total + quantity * price
    }, 0)
  }

  const getTotalTickets = () => {
    return Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading tickets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600'>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>No tickets available for this event.</p>
          <button
            onClick={() => navigate(-1)}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-gray-600 hover:text-gray-900 mb-4'
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Event
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>{name}</h1>
          <p className='text-gray-600 mt-2'>{effectiveDate}</p>
        </div>

        {/* Tickets List */}
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Select Your Tickets</h2>

          {tickets.map((ticket) => {
            const price = ticket.prices[0]
            const hasError = validationErrors[ticket.id]

            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
                  hasError ? 'border-2 border-red-500' : ''
                }`}
              >
                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                  <div className='flex-1 mb-4 md:mb-0'>
                    <h3 className='text-xl font-semibold text-gray-900'>{ticket.title}</h3>
                    {ticket.description && (
                      <p className='text-gray-600 mt-1'>{ticket.description}</p>
                    )}
                    <div className='mt-2'>
                      <p className='text-2xl font-bold text-blue-600'>
                        ${price.price_including_taxes_and_fees.toFixed(2)}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Base: ${price.price.toFixed(2)} + Taxes: ${price.tax_total.toFixed(2)} +
                        Fees: ${price.fee_total.toFixed(2)}
                      </p>
                    </div>

                    {/* Mostrar error de validación si existe */}
                    {hasError && (
                      <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded'>
                        <p className='text-sm text-red-600 font-medium'>⚠️ {hasError}</p>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='flex flex-col'>
                      <label
                        htmlFor={`quantity-${ticket.id}`}
                        className='text-sm text-gray-600 mb-1'
                      >
                        Quantity
                      </label>
                      <select
                        id={`quantity-${ticket.id}`}
                        value={selectedQuantities[ticket.id] || 0}
                        onChange={(e) => handleQuantityChange(ticket.id, parseInt(e.target.value))}
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          hasError
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        disabled={ticket.is_sold_out}
                      >
                        <option value={0}>0</option>
                        {/* Permitir seleccionar de 1 a 10 sin límite de disponibilidad */}
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedQuantities[ticket.id] > 0 && (
                      <div className='text-right'>
                        <p className='text-sm text-gray-600'>Subtotal</p>
                        <p className='text-xl font-bold text-gray-900'>
                          $
                          {(
                            selectedQuantities[ticket.id] * price.price_including_taxes_and_fees
                          ).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Checkout Summary */}
        {getTotalTickets() > 0 && (
          <div className='sticky bottom-0 mt-8 bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
              <div>
                <p className='text-gray-600'>
                  {getTotalTickets()} ticket{getTotalTickets() > 1 ? 's' : ''} selected
                </p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`mt-4 md:mt-0 w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Continue to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
