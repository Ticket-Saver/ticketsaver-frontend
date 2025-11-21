import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { API_URLS } from '../config/api'

interface TicketInfo {
  public_id: string
  first_name: string
  last_name: string
  email: string
  status: string
  ticket: {
    title: string
    event_id: number
  }
  order: {
    short_id: string
    status: string
    payment_status: string
  }
}

const TicketValidation = () => {
  const { ticketId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get('order')
  const eventId = searchParams.get('event')

  useEffect(() => {
    const validateTicket = async () => {
      try {
        if (!ticketId || !orderId || !eventId) {
          throw new Error('Información de ticket incompleta')
        }

        const apiUrl = API_URLS.API
        const token = import.meta.env.VITE_TOKEN_HIEVENTS

        // Obtener información del ticket y orden
        const response = await fetch(`${apiUrl}public/events/${eventId}/order/${orderId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('No se pudo validar el ticket')
        }

        const orderData = await response.json()
        const data = orderData.data || orderData

        // Buscar el asistente específico en la orden
        const attendee = data.attendees?.find(
          (att: { public_id: string }) => att.public_id === ticketId
        )

        if (!attendee) {
          throw new Error('Ticket no encontrado en esta orden')
        }

        setTicketInfo({
          public_id: attendee.public_id,
          first_name: attendee.first_name,
          last_name: attendee.last_name,
          email: attendee.email,
          status: attendee.status,
          ticket: {
            title: attendee.ticket.title,
            event_id: attendee.ticket.event_id
          },
          order: {
            short_id: data.short_id,
            status: data.status,
            payment_status: data.payment_status
          }
        })
      } catch (err) {
        console.error('Error validando ticket:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    validateTicket()
  }, [ticketId, orderId, eventId])

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Validando ticket...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
          <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-10 h-10 text-red-600'
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
          <h1 className='text-2xl font-bold text-red-600 mb-4'>Ticket No Válido</h1>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={() => navigate('/')}
            className='bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700'
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    )
  }

  if (!ticketInfo) {
    return null
  }

  const isValidTicket =
    ticketInfo.status === 'ACTIVE' &&
    ticketInfo.order.status === 'COMPLETED' &&
    ticketInfo.order.payment_status === 'PAYMENT_RECEIVED'

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full'>
        <div className='text-center mb-6'>
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isValidTicket ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {isValidTicket ? (
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
            ) : (
              <svg
                className='w-10 h-10 text-red-600'
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
            )}
          </div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isValidTicket ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isValidTicket ? '✅ Ticket Válido' : '❌ Ticket No Válido'}
          </h1>
        </div>

        <div className='space-y-4'>
          <div className='bg-gray-50 rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-3'>Información del Ticket</h2>
            <div className='space-y-2 text-sm'>
              <p>
                <strong>Asistente:</strong> {ticketInfo.first_name} {ticketInfo.last_name}
              </p>
              <p>
                <strong>Email:</strong> {ticketInfo.email}
              </p>
              <p>
                <strong>Asiento:</strong> {ticketInfo.ticket.title}
              </p>
              <p>
                <strong>Ticket ID:</strong> {ticketInfo.public_id}
              </p>
              <p>
                <strong>Estado:</strong>
                <span
                  className={`ml-1 font-semibold ${
                    ticketInfo.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {ticketInfo.status}
                </span>
              </p>
            </div>
          </div>

          <div className='bg-gray-50 rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-3'>Estado de la Orden</h2>
            <div className='space-y-2 text-sm'>
              <p>
                <strong>Orden ID:</strong> {ticketInfo.order.short_id}
              </p>
              <p>
                <strong>Estado de Orden:</strong>
                <span
                  className={`ml-1 font-semibold ${
                    ticketInfo.order.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {ticketInfo.order.status}
                </span>
              </p>
              <p>
                <strong>Estado de Pago:</strong>
                <span
                  className={`ml-1 font-semibold ${
                    ticketInfo.order.payment_status === 'PAYMENT_RECEIVED'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {ticketInfo.order.payment_status}
                </span>
              </p>
            </div>
          </div>

          {isValidTicket && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <p className='text-green-800 text-center font-semibold'>
                🎫 Este ticket es válido para el evento
              </p>
            </div>
          )}

          {!isValidTicket && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-red-800 text-center font-semibold'>
                ⚠️ Este ticket no es válido o ya fue usado
              </p>
            </div>
          )}
        </div>

        <div className='mt-6 text-center space-y-2'>
          <button
            onClick={() => navigate('/')}
            className='bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 w-full'
          >
            Ir al Inicio
          </button>
          <p className='text-xs text-gray-500'>
            Validación realizada el {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TicketValidation
