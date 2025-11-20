import UserTicketsList from '../../components/UserTicketsList'
import { isUpcomingEvent } from '../../components/EventList'

export default function UpcomingEvent() {
  return (
    <UserTicketsList
      filterFunction={isUpcomingEvent}
      noEventsMessage="You don't have any upcoming events."
    />
  )
}
