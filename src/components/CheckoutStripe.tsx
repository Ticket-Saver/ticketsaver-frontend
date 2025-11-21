import { useEffect, useState, useRef, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { API_URLS } from '../config/api'

// Tipos de datos
interface CartItem {
  price_base: number
  price_final: number
  zoneName: string
  seatLabel: string
  seatType: string
  subZone: string
  priceType: string
  ticketId: string
  seatId: number // ID real del asiento
}

interface FeeItem {
  name: string
  rate?: number
  type?: string
  value: number
}

interface TaxesAndFeesRollup {
  fees?: FeeItem[]
  taxes?: FeeItem[]
}

interface OrderItem {
  id: number
  order_id: number
  total_before_additions: number
  total_before_discount: number
  price: number
  price_before_discount: number | null
  quantity: number
  ticket_id: number
  ticket_price_id: number
  item_name: string
  total_service_fee: number
  total_tax: number
  total_gross: number
  taxes_and_fees_rollup?: TaxesAndFeesRollup
}

interface EventInfo {
  id: string
  name: string
  venue: string
  venueId: string
  date: string
  location: string
}

interface Attendee {
  firstName: string
  lastName: string
  email: string
}

interface OrderData {
  id: number
  short_id: string
  status: string
  payment_status: string
  reserved_until: string
  total_before_additions?: number
  total_tax?: number
  total_fee?: number
  total_gross: number
  currency: string
  taxes_and_fees_rollup?: TaxesAndFeesRollup
  order_items?: OrderItem[]
}

interface TicketMapping {
  seatLabel: string
  ticketId: number
  priceId: number
}

const CheckoutStripe = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [ticketMappings, setTicketMappings] = useState<TicketMapping[]>([]) // Guardar mapeo de IDs
  const [sessionIdentifier, setSessionIdentifier] = useState<string>('') // Guardar session_identifier

  // Ref para evitar múltiples llamadas en React StrictMode
  const hasInitialized = useRef(false)

  const createInitialOrder = useCallback(
    async (cart: CartItem[], eventInfo: EventInfo) => {
      try {
        // Verificar si ya existe una orden o ya estamos creando una
        if (orderData || isCreatingOrder) {
          console.log('Orden ya existe o en proceso, saltando creación')
          return
        }

        // Verificar si ya existe una orden en localStorage para este carrito
        const existingOrderKey = `order_${eventInfo.venueId}_${cart.length}`
        const existingOrder = localStorage.getItem(existingOrderKey)
        if (existingOrder) {
          try {
            const parsedOrder = JSON.parse(existingOrder)
            console.log('Orden existente encontrada en localStorage:', parsedOrder)

            // Validar que el carrito actual coincide con la orden almacenada (firma por seatIds)
            const currentSignature = computeCartSignature(cart)
            const storedSignature = parsedOrder.cart_signature || ''

            if (storedSignature && currentSignature && storedSignature === currentSignature) {
              // Aceptar orden existente
              if (parsedOrder.session_identifier) {
                setSessionIdentifier(parsedOrder.session_identifier)
                const orderData = { ...parsedOrder }
                delete orderData.session_identifier
                setOrderData(orderData)
              } else {
                setOrderData(parsedOrder)
              }
              if (
                Array.isArray(parsedOrder.ticket_mappings) &&
                parsedOrder.ticket_mappings.length
              ) {
                setTicketMappings(parsedOrder.ticket_mappings)
              }
              return
            } else {
              // El carrito cambió (asientos distintos) → descartar orden previa y continuar creando una nueva
              console.warn(
                'Orden en localStorage no coincide con el carrito actual. Se descartará.'
              )
              localStorage.removeItem(existingOrderKey)
            }
          } catch (e) {
            // Si hay error parseando, continuar creando nueva orden
            localStorage.removeItem(existingOrderKey)
          }
        }

        // Marcar que estamos creando la orden
        setIsCreatingOrder(true)

        const apiUrl = API_URLS.API
        const token = import.meta.env.VITE_TOKEN_HIEVENTS

        if (!apiUrl || !token) {
          throw new Error('Configuración de API incompleta')
        }

        console.log('Creando orden inicial...')
        console.log('Cart data:', cart) // Para debug

        // Extraer IDs reales de asientos del carrito
        const seatIds = cart.map((item) => {
          console.log(`🔍 Using real seat ID: ${item.seatId}`)
          return item.seatId
        })

        console.log('🎫 Seat IDs to fetch:', seatIds)

        // Obtener tickets específicos por IDs de asientos
        const eventTickets = await getEventTicketsData(eventInfo.venueId, seatIds)
        console.log('Event tickets from API:', eventTickets) // Para debug

        // ✅ NUEVO: Mapeo directo usando el endpoint específico
        const mappings: TicketMapping[] = []
        const tickets = cart.map((item, index) => {
          // El nuevo endpoint retorna tickets en el mismo orden que los seatIds
          const matchingTicket = eventTickets[index]

          if (!matchingTicket) {
            throw new Error(`No ticket found for seat ${item.seatLabel} at index ${index}`)
          }

          const ticketId = matchingTicket.id
          const priceId =
            matchingTicket.prices && matchingTicket.prices.length > 0
              ? matchingTicket.prices[0].id
              : matchingTicket.id

          console.log(
            `✅ Direct mapping for seat ${item.seatLabel}: Ticket ID ${ticketId}, Price ID ${priceId}`
          )

          // Guardar el mapeo para usar en updateOrderWithAttendees
          mappings.push({
            seatLabel: item.seatLabel,
            ticketId: ticketId,
            priceId: priceId
          })

          return {
            ticket_id: ticketId,
            quantities: [
              {
                price_id: priceId,
                quantity: 1
              }
            ]
          }
        })

        // Guardar los mapeos para usar después
        setTicketMappings(mappings)

        console.log('Tickets preparados para enviar:', tickets) // Para debug

        // Generar session_identifier y guardarlo para reutilizar
        const newSessionIdentifier = generateUniqueSessionId()
        setSessionIdentifier(newSessionIdentifier)

        const response = await fetch(`${apiUrl}public/events/${eventInfo.venueId}/order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            tickets,
            session_identifier: newSessionIdentifier
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Error response:', errorData) // Para debug
          throw new Error(errorData.message || 'Error creando la orden')
        }

        const orderResponse = await response.json()
        setOrderData(orderResponse.data)

        // Guardar la orden y session_identifier en localStorage para evitar duplicados
        const orderKey = `order_${eventInfo.venueId}_${cart.length}`
        const orderWithSession = {
          ...orderResponse.data,
          session_identifier: newSessionIdentifier,
          // Guardar también los mapeos para poder reconstruir UI tras reload
          ticket_mappings: mappings,
          cart_signature: computeCartSignature(cart)
        }
        localStorage.setItem(orderKey, JSON.stringify(orderWithSession))

        console.log('Orden creada:', orderResponse.data)
      } catch (err) {
        console.error('Error creando orden:', err)
        setError('Error creando la orden inicial')
      } finally {
        setIsCreatingOrder(false)
      }
    },
    [orderData, isCreatingOrder]
  )

  // Cargar datos del carrito
  useEffect(() => {
    // Evitar múltiples inicializaciones en React StrictMode
    if (hasInitialized.current) {
      console.log('Ya inicializado, saltando...')
      return
    }

    const initializeCheckout = async () => {
      try {
        hasInitialized.current = true

        const cartString = localStorage.getItem('cart_checkout')
        if (!cartString) {
          setError('No se encontraron datos del carrito')
          return
        }

        const { cart, eventInfo, customer } = JSON.parse(cartString)

        if (!Array.isArray(cart) || cart.length === 0) {
          setError('Carrito vacío o inválido')
          return
        }

        // Inicializar formularios de asistentes
        const initialAttendees = cart.map(() => ({
          firstName: '',
          lastName: '',
          email: customer?.email || ''
        }))

        setAttendees(initialAttendees)
        setLoading(false)

        // Crear orden inicial solo si no existe ya una orden
        if (!orderData && !isCreatingOrder) {
          await createInitialOrder(cart, eventInfo)
        }
      } catch (err) {
        console.error('Error cargando datos:', err)
        setError('Error cargando los datos del checkout')
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [createInitialOrder, isCreatingOrder, orderData]) // Dependencias necesarias

  const getEventTicketsData = async (venueId: string, seatIds?: number[]) => {
    try {
      const apiUrl = API_URLS.API
      const token = import.meta.env.VITE_TOKEN_HIEVENTS

      let url: string
      let method: string = 'GET'
      let body: string | undefined

      if (seatIds && seatIds.length > 0) {
        // Usar el nuevo endpoint específico para IDs de asientos
        url = `${apiUrl}public/events/${venueId}/tickets/by-seat-ids`
        method = 'POST'
        body = JSON.stringify({ seat_ids: seatIds })
        console.log('🎫 Fetching specific tickets by seat IDs:', seatIds)
      } else {
        // Fallback al endpoint general (para compatibilidad)
        url = `${apiUrl}public/events/${venueId}/tickets?page=1&per_page=200&sort_by=order&sort_direction=asc`
        console.log('📋 Fetching all tickets (fallback)')
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
      if (token) headers.Authorization = `Bearer ${token}`

      console.log('Fetching tickets URL:', url)
      const response = await fetch(url, { method, headers, body })

      if (!response.ok) {
        throw new Error(`Error obteniendo tickets del evento: ${response.status}`)
      }

      const eventData = await response.json()

      if (seatIds && seatIds.length > 0) {
        // Nuevo endpoint retorna { tickets: Ticket[] }
        return Array.isArray(eventData?.tickets) ? eventData.tickets : []
      } else {
        // Endpoint general retorna { data: Ticket[] }
        return Array.isArray(eventData?.data) ? eventData.data : []
      }
    } catch (err) {
      console.error('Error obteniendo tickets del evento:', err)
      return []
    }
  }

  const generateUniqueSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const computeCartSignature = (cart: CartItem[]) => {
    try {
      const ids = cart
        .map((item) => Number(item.seatId))
        .filter(Boolean)
        .sort((a, b) => a - b)
      return ids.join('-')
    } catch {
      return ''
    }
  }

  const clearTemporaryOrder = () => {
    // Limpiar orden temporal cuando ya no se necesite
    const cartString = localStorage.getItem('cart_checkout')
    if (cartString) {
      try {
        const { cart, eventInfo } = JSON.parse(cartString)
        const orderKey = `order_${eventInfo.venueId}_${cart.length}`
        localStorage.removeItem(orderKey)
      } catch (e) {
        // Ignorar errores de parsing
      }
    }
  }

  const handleAttendeeChange = (index: number, field: string, value: string) => {
    const newAttendees = [...attendees]
    newAttendees[index] = { ...newAttendees[index], [field]: value }
    setAttendees(newAttendees)
  }

  const validateAttendees = () => {
    return attendees.every(
      (attendee) =>
        attendee.firstName.trim() &&
        attendee.lastName.trim() &&
        attendee.email.trim() &&
        attendee.email.includes('@')
    )
  }

  const updateOrderWithAttendees = async () => {
    try {
      if (!orderData) {
        throw new Error('No hay orden creada')
      }

      const cartString = localStorage.getItem('cart_checkout')
      if (!cartString) {
        throw new Error('No se encontraron datos del carrito')
      }

      const { cart, eventInfo, customer } = JSON.parse(cartString)
      const apiUrl = API_URLS.API
      const token = import.meta.env.VITE_TOKEN_HIEVENTS

      // Usar los mapeos guardados durante la creación de la orden
      // Esto asegura que los ticket_price_id coincidan exactamente con los usados en la orden
      const attendeesData = attendees.map((attendee, index) => {
        const cartItem = cart[index]

        // Buscar el mapeo correspondiente por seatLabel
        const mapping = ticketMappings.find((m) => m.seatLabel === cartItem.seatLabel)

        if (!mapping) {
          throw new Error(
            `No se encontró mapeo para el asiento ${cartItem.seatLabel}. Esto indica un problema en la creación de la orden.`
          )
        }

        console.log(
          `Asistente ${index + 1} (${cartItem.seatLabel}): Usando Price ID ${mapping.priceId} (guardado de la orden)`
        ) // Para debug

        return {
          first_name: attendee.firstName,
          last_name: attendee.lastName,
          email: attendee.email,
          ticket_price_id: mapping.priceId // Usar el MISMO price_id que se usó al crear la orden
        }
      })

      const response = await fetch(
        `${apiUrl}public/events/${eventInfo.venueId}/order/${orderData.short_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            order: {
              first_name: customer?.name?.split(' ')[0] || attendees[0]?.firstName || '',
              last_name: customer?.name?.split(' ')[1] || attendees[0]?.lastName || '',
              email: customer?.email || attendees[0]?.email || ''
            },
            attendees: attendeesData
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error actualizando la orden')
      }

      return await response.json()
    } catch (err) {
      console.error('Error actualizando orden:', err)
      throw err
    }
  }

  const createStripeCheckoutSession = async () => {
    try {
      if (!orderData) {
        throw new Error('No hay orden creada')
      }

      if (!sessionIdentifier) {
        throw new Error(
          'Session identifier no disponible. Por favor, recarga la página y vuelve a intentar.'
        )
      }

      const cartString = localStorage.getItem('cart_checkout')
      if (!cartString) {
        throw new Error('No se encontraron datos del carrito')
      }

      const { eventInfo } = JSON.parse(cartString)
      const apiUrl = API_URLS.API
      const token = import.meta.env.VITE_TOKEN_HIEVENTS

      // No usar placeholder - Stripe añadirá automáticamente ?session_id=... al redirigir
      // Esto evita problemas de validación de URL en el backend
      const successUrl = `${window.location.origin}/checkout/${eventInfo.venueId}/${orderData.short_id}/success`

      const response = await fetch(
        `${apiUrl}public/events/${eventInfo.venueId}/order/${orderData.short_id}/stripe/checkout_session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            success_url: successUrl,
            cancel_url: `${window.location.origin}/checkout`,
            session_identifier: sessionIdentifier // Enviar el mismo session_identifier usado al crear la orden
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error creando sesión de pago')
      }

      const checkoutData = await response.json()

      // Redirigir a Stripe Checkout
      window.location.href = checkoutData.data.checkout_url
    } catch (err) {
      console.error('Error creando sesión de Stripe:', err)
      throw err
    }
  }

  const handleProceedToPayment = async () => {
    try {
      setError(null)

      // Requerir login justo antes del pago
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { returnTo: '/checkout' }
        })
        return
      }

      setIsProcessing(true)

      // Validar datos de asistentes
      if (!validateAttendees()) {
        throw new Error(
          'Por favor complete todos los campos de los asistentes con información válida'
        )
      }

      // Actualizar orden con información de asistentes
      await updateOrderWithAttendees()

      // Crear sesión de Stripe Checkout y redirigir
      await createStripeCheckoutSession()

      // Limpiar orden temporal ya que se procederá al pago
      clearTemporaryOrder()
    } catch (err) {
      console.error('Error procesando pago:', err)
      setError(err instanceof Error ? err.message : 'Error procesando el pago')
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto p-6'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p>Cargando checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-2xl mx-auto p-6'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <p className='font-bold'>Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/events')}
          className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
        >
          Volver a eventos
        </button>
      </div>
    )
  }

  const cartData = JSON.parse(localStorage.getItem('cart_checkout') || '{}')
  const { cart = [], eventInfo = {} } = cartData
  console.log('cartData', cartData)

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>

      {/* Resumen del evento */}
      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Resumen del Evento</h2>
        <p>
          <strong>Evento:</strong> {eventInfo.name}
        </p>
        <p>
          <strong>Lugar:</strong> {eventInfo.venue}
        </p>
        <p>
          <strong>Fecha:</strong> {eventInfo.date}
        </p>
        <p>
          <strong>Ubicación:</strong> {eventInfo.location}
        </p>
      </div>

      {/* Resumen de tickets */}
      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Tickets Seleccionados</h2>
        {cart.map((ticket: CartItem, index: number) => (
          <div
            key={index}
            className='flex justify-between items-center py-2 border-b last:border-b-0'
          >
            <div className='flex-1'>
              <p className='font-medium'>{ticket.seatLabel}</p>
              {orderData?.order_items && (
                <>
                  {(() => {
                    const mapping = ticketMappings.find((m) => m.seatLabel === ticket.seatLabel)
                    let oi = mapping
                      ? orderData.order_items?.find((it) => it.ticket_id === mapping.ticketId)
                      : undefined
                    if (!oi && orderData.order_items?.length === cart.length) {
                      oi = orderData.order_items[index]
                    }
                    return oi ? (
                      (() => {
                        const parts: string[] = [`Precio: $${oi.price.toFixed(2)}`]
                        if (Number(oi.total_service_fee) > 0) {
                          parts.push(`Fee: $${oi.total_service_fee.toFixed(2)}`)
                        }
                        if (Number(oi.total_tax) > 0) {
                          parts.push(`Impuesto: $${oi.total_tax.toFixed(2)}`)
                        }
                        return <p className='text-xs text-gray-600'>{parts.join(' • ')}</p>
                      })()
                    ) : (
                      <p className='text-xs text-gray-600'>
                        Precio: ${ticket.price_base.toFixed(2)} • Total estimado: $
                        {ticket.price_final.toFixed(2)}
                      </p>
                    )
                  })()}
                </>
              )}
            </div>
            <p className='font-semibold'>
              {orderData?.order_items
                ? (() => {
                    const mapping = ticketMappings.find((m) => m.seatLabel === ticket.seatLabel)
                    let oi = mapping
                      ? orderData.order_items?.find((it) => it.ticket_id === mapping.ticketId)
                      : undefined
                    if (!oi && orderData.order_items?.length === cart.length) {
                      oi = orderData.order_items[index]
                    }
                    return oi
                      ? `$${oi.total_gross.toFixed(2)}`
                      : `$${ticket.price_final.toFixed(2)}`
                  })()
                : `$${ticket.price_final.toFixed(2)}`}
            </p>
          </div>
        ))}
        <div className='flex justify-between items-center pt-2 mt-2 border-t font-bold'>
          <p>Total:</p>
          <p>
            $
            {orderData?.total_gross !== undefined
              ? Number(orderData.total_gross).toFixed(2)
              : cart
                  .reduce((sum: number, ticket: CartItem) => sum + ticket.price_final, 0)
                  .toFixed(2)}
          </p>
        </div>

        {/* Desglose de costos (si hay datos de la orden) */}
        {orderData && (
          <div className='mt-4 border-t pt-4 space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Subtotal</span>
              <span className='font-medium'>
                ${Number(orderData.total_before_additions ?? 0).toFixed(2)}
              </span>
            </div>
            {Number(orderData.total_fee ?? 0) > 0 && (
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Fees</span>
                <span className='font-medium'>${Number(orderData.total_fee ?? 0).toFixed(2)}</span>
              </div>
            )}
            {Number(orderData.total_tax ?? 0) > 0 && (
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Impuestos</span>
                <span className='font-medium'>${Number(orderData.total_tax ?? 0).toFixed(2)}</span>
              </div>
            )}
            <div className='flex justify-between text-base font-semibold pt-2 border-t'>
              <span>Total</span>
              <span>
                ${Number(orderData.total_gross ?? 0).toFixed(2)} {orderData.currency}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Información de estado de orden */}
      {orderData && (
        <div className='bg-blue-50 p-4 rounded-lg mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Estado de la Orden</h2>
          <p>
            <strong>ID de Orden:</strong> {orderData.short_id}
          </p>
          <p>
            <strong>Estado:</strong> {orderData.status}
          </p>
          <p>
            <strong>Estado de Pago:</strong> {orderData.payment_status}
          </p>
          {orderData.reserved_until && (
            <p>
              <strong>Reservado hasta:</strong>{' '}
              {new Date(orderData.reserved_until).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Formularios de asistentes */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>Información de los Asistentes</h2>
        {attendees.map((attendee, index) => (
          <div key={index} className='border rounded-lg p-4 mb-4 space-y-4'>
            <h3 className='text-lg font-semibold'>Asistente {index + 1}</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Nombre *</label>
                <input
                  type='text'
                  required
                  value={attendee.firstName}
                  onChange={(e) => handleAttendeeChange(index, 'firstName', e.target.value)}
                  className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Ingrese el nombre'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Apellido *</label>
                <input
                  type='text'
                  required
                  value={attendee.lastName}
                  onChange={(e) => handleAttendeeChange(index, 'lastName', e.target.value)}
                  className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Ingrese el apellido'
                />
              </div>

              <div className='col-span-2'>
                <label className='block text-sm font-medium mb-2'>Email *</label>
                <input
                  type='email'
                  required
                  value={attendee.email}
                  onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                  className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                  placeholder='ejemplo@correo.com'
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de proceder al pago */}
      <button
        onClick={handleProceedToPayment}
        disabled={isProcessing || !orderData}
        className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
          isProcessing || !orderData
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? 'Procesando...' : 'Proceder al Pago con Stripe'}
      </button>

      <p className='text-sm text-gray-600 text-center mt-4'>
        Serás redirigido a la página segura de Stripe para completar tu pago
      </p>
    </div>
  )
}

export default CheckoutStripe
