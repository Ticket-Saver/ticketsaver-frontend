import { useParams } from 'react-router-dom'
import TicketSelectionSeat from './TicketEventSale'
import TicketSelectionNoSeat from './TicketEventSaleNoSeats'
import { useVenues } from '../router/venuesContext'

export default function SalePage() {
  const { venue } = useParams<{ venue: string }>()
  const { venues } = useVenues()

  if (!venues) {
    return <div>Loading venues...</div>
  }

  const matchingVenue = venues[venue!]

  return <>{matchingVenue?.seatmap ? <TicketSelectionSeat /> : <TicketSelectionNoSeat />}</>
}
