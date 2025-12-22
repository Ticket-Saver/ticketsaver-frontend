import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { API_URLS } from '../config/api'

const MAX_RETRIES = 6
const BASE_DELAY_MS = 700

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface TaxOrFee {
  name: string
  rate: number
  type: string
  value: number
}

interface TaxesAndFeesRollup {
  fees: TaxOrFee[]
  taxes: TaxOrFee[]
}

interface OrderData {
  id: number
  short_id: string
  status: string
  payment_status: string
  total_before_additions: number
  total_tax: number
  total_fee: number
  total_gross: number
  currency: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  public_id: string
  taxes_and_fees_rollup?: TaxesAndFeesRollup
  order_items: Array<{
    item_name: string
    quantity: number
    price: number
  }>
  attendees: Array<{
    public_id: string
    ticket_id: string
    email: string
    status: string
    first_name: string
    last_name: string
    created_at: string
    ticket: {
      id: number
      title: string
      type: string
      event_id: number
      seat_label?: string
      prices: Array<{
        id: number
        label?: string
        price: number
        price_including_taxes_and_fees: number
        price_before_discount?: number
        is_discounted: boolean
        tax_total: number
        fee_total?: number
      }>
    }
  }>
}

const SuccessCheckout = () => {
  const navigate = useNavigate()
  const { venueId, orderShortId } = useParams()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmingPayment, setConfirmingPayment] = useState(false)

  useEffect(() => {
    const confirmPaymentAndFetchOrder = async () => {
      try {
        setLoading(true)

        // Obtener session_id de la URL
        // Manejar URLs malformadas donde puede haber múltiples ?
        const fullUrl = window.location.href
        console.log('Full URL:', fullUrl)

        // Extraer todos los posibles session_id de la URL
        const sessionIdMatches = fullUrl.match(/session_id=([^&?#]+)/g)
        console.log('Session ID matches:', sessionIdMatches)

        let sessionId: string | null = null

        if (sessionIdMatches && sessionIdMatches.length > 0) {
          // Buscar el session_id real (que comienza con cs_)
          for (const match of sessionIdMatches) {
            const value = match.replace('session_id=', '')
            // Filtrar el placeholder {CHECKOUT_SESSION_ID} y buscar el valor real
            if (
              value &&
              !value.includes('CHECKOUT_SESSION_ID') &&
              !value.includes('%7B') &&
              !value.includes('%7D')
            ) {
              sessionId = decodeURIComponent(value)
              break
            }
          }
        }

        // Fallback al método tradicional
        if (!sessionId) {
          const urlParams = new URLSearchParams(window.location.search)
          sessionId = urlParams.get('session_id')
        }

        console.log('Extracted session_id:', sessionId)

        if (!sessionId || sessionId.includes('CHECKOUT_SESSION_ID')) {
          throw new Error('No se encontró session_id válido en la URL')
        }

        if (!venueId || !orderShortId) {
          throw new Error('Parámetros de URL faltantes')
        }

        console.log('Confirmando pago:', { venueId, orderShortId, sessionId })

        const apiUrl = API_URLS.API
        const token = import.meta.env.VITE_TOKEN_HIEVENTS

        if (!apiUrl || !token) {
          throw new Error('Configuración de API incompleta')
        }

        setConfirmingPayment(true)

        // Confirmar el pago manualmente con reintentos exponenciales
        let confirmSucceeded = false
        let lastConfirmError: Error | null = null
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            const confirmResponse = await fetch(
              `${apiUrl}public/events/${venueId}/order/${orderShortId}/confirm_payment`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  session_id: sessionId
                })
              }
            )
            if (confirmResponse.ok) {
              const confirmData = await confirmResponse.json().catch(() => ({}))
              console.log('Pago confirmado:', confirmData)
              confirmSucceeded = true
              break
            } else {
              const errorData = await confirmResponse.json().catch(() => ({}))
              lastConfirmError = new Error(errorData.message || 'Error confirmando el pago')
            }
          } catch (err) {
            lastConfirmError =
              err instanceof Error ? err : new Error('Error de red confirmando el pago')
          }
          const waitMs = Math.round(BASE_DELAY_MS * Math.pow(1.7, attempt))
          console.log(`Reintentando confirmación de pago en ${waitMs}ms (intento ${attempt + 1})`)
          await delay(waitMs)
        }
        if (!confirmSucceeded) {
          throw lastConfirmError || new Error('No se pudo confirmar el pago')
        }

        setConfirmingPayment(false)

        // Obtener detalles de la orden con reintentos (propagación eventual)
        let orderDetails: any | null = null
        let lastOrderError: Error | null = null
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            const orderResponse = await fetch(
              `${apiUrl}public/events/${venueId}/order/${orderShortId}`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`
                }
              }
            )
            if (orderResponse.ok) {
              orderDetails = await orderResponse.json()
              console.log('Detalles de la orden:', orderDetails)
              break
            } else {
              const errorData = await orderResponse.json().catch(() => ({}))
              lastOrderError = new Error(
                errorData.message || 'Error obteniendo detalles de la orden'
              )
            }
          } catch (err) {
            lastOrderError =
              err instanceof Error ? err : new Error('Error de red obteniendo la orden')
          }
          const waitMs = Math.round(BASE_DELAY_MS * Math.pow(1.7, attempt))
          console.log(`Reintentando obtención de orden en ${waitMs}ms (intento ${attempt + 1})`)
          await delay(waitMs)
        }
        if (!orderDetails) {
          throw lastOrderError || new Error('No se pudo obtener detalles de la orden')
        }

        // Adaptar los datos al formato esperado
        const data = orderDetails.data || orderDetails
        setOrderData({
          id: data.id || 0,
          short_id: data.short_id || '',
          status: data.status || 'completed',
          payment_status: data.payment_status || 'paid',
          total_before_additions: data.total_before_additions || 0,
          total_tax: data.total_tax || 0,
          total_fee: data.total_fee || 0,
          total_gross: data.total_gross || 0,
          currency: data.currency || 'USD',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          created_at: data.created_at || new Date().toISOString(),
          public_id: data.public_id || data.short_id,
          taxes_and_fees_rollup: data.taxes_and_fees_rollup,
          order_items: data.order_items || [],
          attendees: data.attendees || []
        })

        // Limpiar localStorage
        localStorage.removeItem('cart_checkout')
        localStorage.removeItem('attendees_data')
      } catch (err) {
        console.error('Error en el proceso:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
        setConfirmingPayment(false)
      }
    }

    confirmPaymentAndFetchOrder()
  }, [venueId, orderShortId])

  if (loading || confirmingPayment) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold mb-2'>
              {confirmingPayment ? 'Confirmando tu pago...' : 'Procesando tu orden...'}
            </h2>
            <p className='text-gray-600'>
              {confirmingPayment
                ? 'Verificando el pago con Stripe y enviando tus tickets...'
                : 'Por favor espera mientras confirmamos tu compra.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-red-600 mb-2'>Error en el Proceso</h2>
            <p className='text-gray-600 mb-4'>{error}</p>
            <div className='space-y-2'>
              <button
                onClick={() => navigate('/events')}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
              >
                Volver a Eventos
              </button>
              <button
                onClick={() => window.location.reload()}
                className='w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400'
              >
                Intentar de Nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold mb-2'>No se encontraron datos de la orden</h2>
            <button
              onClick={() => navigate('/events')}
              className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
            >
              Volver a Eventos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header de éxito */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='text-center'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-10 h-10 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h1 className='text-3xl font-bold text-green-600 mb-2'>¡Pago Exitoso!</h1>
            <p className='text-xl text-gray-600 mb-4'>Tu compra ha sido procesada correctamente</p>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <p className='text-green-800'>
                <strong>📧 Tickets enviados por email</strong>
                <br />
                Hemos enviado tus tickets a <strong>{orderData.email}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Detalles de la orden */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-bold mb-6'>Detalles de tu Orden</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <h3 className='text-lg font-semibold mb-3'>Información de la Orden</h3>
              <div className='space-y-2 text-sm'>
                <p>
                  <strong>ID de Orden:</strong> {orderData.short_id}
                </p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className='text-green-600 font-semibold'>{orderData.status}</span>
                </p>
                <p>
                  <strong>Estado de Pago:</strong>{' '}
                  <span className='text-green-600 font-semibold'>{orderData.payment_status}</span>
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(orderData.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-3'>Información del Comprador</h3>
              <div className='space-y-2 text-sm'>
                <p>
                  <strong>Nombre:</strong>{' '}
                  {orderData.attendees && orderData.attendees.length > 0
                    ? `${orderData.attendees[0].first_name} ${orderData.attendees[0].last_name}`
                    : `${orderData.first_name} ${orderData.last_name}`}
                </p>
                <p>
                  <strong>Email:</strong> {orderData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Desglose de Precio */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold mb-4'>Desglose del Pago</h3>
            <div className='space-y-2 bg-gray-50 rounded-lg p-4'>
              <div className='flex justify-between text-sm'>
                <span>Subtotal (Tickets):</span>
                <span className='font-medium'>
                  ${orderData.total_before_additions.toFixed(2)} {orderData.currency}
                </span>
              </div>

              {/* Mostrar Fees */}
              {orderData.taxes_and_fees_rollup?.fees &&
                orderData.taxes_and_fees_rollup.fees.length > 0 && (
                  <>
                    {orderData.taxes_and_fees_rollup.fees.map((fee, index) => (
                      <div
                        key={`fee-${index}`}
                        className='flex justify-between text-sm text-gray-600'
                      >
                        <span>
                          {fee.name} ({fee.rate}%):
                        </span>
                        <span>${fee.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

              {/* Mostrar Taxes */}
              {orderData.taxes_and_fees_rollup?.taxes &&
                orderData.taxes_and_fees_rollup.taxes.length > 0 && (
                  <>
                    {orderData.taxes_and_fees_rollup.taxes.map((tax, index) => (
                      <div
                        key={`tax-${index}`}
                        className='flex justify-between text-sm text-gray-600'
                      >
                        <span>
                          {tax.name} ({tax.rate}%):
                        </span>
                        <span>${tax.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

              <div className='border-t pt-2 mt-2 flex justify-between font-bold text-lg'>
                <span>Total:</span>
                <span className='text-green-600'>
                  ${orderData.total_gross.toFixed(2)} {orderData.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Items de la orden */}
          {orderData.order_items && orderData.order_items.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-lg font-semibold mb-3'>Items Comprados</h3>
              <div className='space-y-2'>
                {orderData.order_items.map((item, index) => (
                  <div key={index} className='flex justify-between items-center py-2 border-b'>
                    <div>
                      <p className='font-medium'>{item.item_name}</p>
                      <p className='text-sm text-gray-600'>Cantidad: {item.quantity}</p>
                    </div>
                    <p className='font-semibold'>${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tickets con QR Codes */}
        {orderData.attendees && orderData.attendees.length > 0 && (
          <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
            <h2 className='text-2xl font-bold mb-6'>Tus Tickets</h2>
            <p className='text-gray-600 mb-6'>
              {orderData.attendees.length === 1
                ? 'Tu ticket ha sido enviado por email. También puedes usar este código QR:'
                : 'Cada asistente recibirá su ticket individual por email. También puedes usar estos códigos QR:'}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {orderData.attendees.map((attendee, index) => (
                <div key={index} className='border rounded-lg p-6 text-center'>
                  <h4 className='text-lg font-semibold mb-4'>
                    {attendee.first_name} {attendee.last_name}
                  </h4>

                  <QRCodeSVG
                    // value={`${import.meta.env.VITE_HIEVENTS_API_URL}ticket/${attendee.ticket.event_id}/${attendee.public_id}`}
                    value={`https://localhost:8443/ticket/${attendee.ticket.event_id}/${attendee.public_id}`}
                    size={200}
                    level='H'
                    includeMargin={true}
                    className='mx-auto mb-4'
                  />

                  <div className='space-y-1 text-sm text-gray-600'>
                    <p>
                      <strong>Ticket ID:</strong> {attendee.public_id}
                    </p>
                    <p>
                      <strong>Email:</strong> {attendee.email}
                    </p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      <span className='text-green-600 font-semibold'>{attendee.status}</span>
                    </p>
                    <p>
                      <strong>Tipo:</strong> {attendee.ticket.title}
                    </p>
                    <p>
                      <strong>Precio:</strong> $
                      {attendee.ticket.prices && attendee.ticket.prices.length > 0
                        ? attendee.ticket.prices[0].price_including_taxes_and_fees?.toFixed(2) ||
                          attendee.ticket.prices[0].price?.toFixed(2) ||
                          '0.00'
                        : '0.00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay attendees individuales (general admission) */}
        {(!orderData.attendees || orderData.attendees.length === 0) && (
          <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
            <h2 className='text-2xl font-bold mb-6'>Confirmación de Compra</h2>
            <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-center'>
              <svg
                className='w-16 h-16 text-green-600 mx-auto mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='text-xl font-semibold text-green-800 mb-2'>¡Compra Confirmada!</h3>
              <p className='text-green-700'>
                Tus tickets han sido enviados a <strong>{orderData.email}</strong>
              </p>
              <p className='text-green-600 text-sm mt-2'>
                Por favor revisa tu bandeja de entrada y spam.
              </p>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
          <h3 className='text-lg font-semibold text-blue-800 mb-3'>Información Importante</h3>
          <div className='space-y-2 text-blue-700'>
            <p>• Guarda este email de confirmación para tus registros</p>
            <p>• Presenta tu ticket (email o código QR) en el evento</p>
            <p>• Los tickets son válidos únicamente para la fecha y hora especificadas</p>
            <p>• Para cualquier consulta, contacta al organizador del evento</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className='text-center space-y-4'>
          <button
            onClick={() => navigate('/dashboard/tickets/upcomingevent')}
            className='bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-semibold'
          >
            Ver Mis Tickets
          </button>

          <div className='space-x-4'>
            <button
              onClick={() => navigate('/events')}
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Ver Más Eventos
            </button>
            <button
              onClick={() => navigate('/')}
              className='text-gray-600 hover:text-gray-800 font-medium'
            >
              Ir al Inicio
            </button>
          </div>
        </div>

        {/* Información de contacto */}
        <div className='text-center mt-8 text-sm text-gray-600'>
          <p>
            ¿Tienes preguntas? Contáctanos en{' '}
            <a href='mailto:ticketing@ticketsaver.net' className='text-blue-600 hover:underline'>
              ticketing@ticketsaver.net
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SuccessCheckout
