import { useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import EventClaim from './EventsClaim'
import { useUpcomingTickets } from '../hooks/useUserTickets'

interface UserTicketsListProps {
  filterFunction: (eventDate: string) => boolean
  noEventsMessage: string
}

const formatEventDateTime = (dateStr: string, timezone?: string) => {
  if (!dateStr) return ''

  try {
    const date = new Date(dateStr)
    const tz = timezone || 'UTC'

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: tz
    }).format(date)

    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: tz
    }).format(date)

    return `${formattedDate} at ${formattedTime}`
  } catch {
    // Si algo falla, devolvemos la cadena original para no romper la UI
    return dateStr
  }
}

const UserTicketsList: React.FC<UserTicketsListProps> = ({ filterFunction, noEventsMessage }) => {
  const { user } = useAuth0()
  const { tickets, loading, error } = useUpcomingTickets(user?.email || '')

  // Filter events based on the provided filter function
  const filteredEvents = useMemo(() => {
    if (!tickets) return []
    const result = tickets.filter(event => filterFunction(event.date))
    // Sort by date descending (most recent first)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [tickets, filterFunction])

  const mapVenueName = (venueId?: string, fallback?: string) => {
    if (!venueId) return fallback || ''
    switch (venueId) {
      case '1':
        return 'Ritz Theatre'
      case '2':
        return 'California Theatre'
      default:
        return fallback || ''
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Cargando tickets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error al cargar tickets</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {!filteredEvents || filteredEvents.length === 0 ? (
        <p className="text-center text-lg font-semibold">{noEventsMessage}</p>
      ) : (
        filteredEvents.map(event => (
          <EventClaim
            key={event.eventId}
            eventId={event.eventId}
            id={event.eventId}
            title={event.eventName}
            description={event.description || ''}
            thumbnailURL={event.imageUrl || '/default.jpg'}
            venue={mapVenueName(event.venueId, event.venue)}
            // Mostramos una fecha amigable usando el timezone del evento
            date={formatEventDateTime(event.date, event.timezone)}
            route={`/dashboard/claimtickets/${event.eventName}/mynftsclaim`}
            ticketDetails={event.tickets.map(ticket => ({
              ticket: ticket.ticketId,
              zone: ticket.zone,
              section: ticket.section,
              seatNumber: ticket.seatNumber,
              price: ticket.price
            }))}
          />
        ))
      )}
    </div>
  )
}

export default UserTicketsList
