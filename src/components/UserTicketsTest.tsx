import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { UserTicketsService, UserEvent } from '../services/userTicketsService'

// Función para traducir zonas del español al inglés
function translateZone(zone: string): string {
  const zoneTranslations: { [key: string]: string } = {
    centro: 'center',
    izquierda: 'left',
    derecha: 'right',
    vip: 'vip',
    general: 'general',
    premium: 'premium'
  }

  return zoneTranslations[zone.toLowerCase()] || zone
}

export default function UserTicketsTest() {
  const { user } = useAuth0()
  const [tickets, setTickets] = useState<UserEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserTickets = async () => {
    if (!user?.email) {
      setError('Email del usuario no disponible')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await UserTicketsService.getUserTickets(user.email)
      setTickets(response.data)
      console.log('Tickets obtenidos:', response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error al obtener tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchUserTickets()
    }
  }, [user?.email])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Cargando tickets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={fetchUserTickets}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Mis Tickets (Prueba del Endpoint)</h2>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-600">No tienes tickets comprados.</div>
      ) : (
        <div className="space-y-6">
          {tickets.map(event => (
            <div key={event.eventId} className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p>
                    <strong>Venue:</strong> {event.venue}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {event.location}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total de tickets:</strong> {event.tickets.length}
                  </p>
                  <p>
                    <strong>Event ID:</strong> {event.eventId}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Detalles de Tickets:</h4>
                <div className="space-y-2">
                  {event.tickets.map((ticket, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p>
                        <strong>Ticket ID:</strong> {ticket.ticketId}
                      </p>
                      <p>
                        <strong>Zone:</strong> {translateZone(ticket.zone)} - <strong>Seat:</strong>{' '}
                        {ticket.section}
                        {ticket.seatNumber}
                      </p>
                      <p>
                        <strong>Precio:</strong> ${ticket.price}
                      </p>
                      <p>
                        <strong>Estado:</strong> {ticket.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={fetchUserTickets}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Actualizar Tickets
        </button>
      </div>
    </div>
  )
}
