import EventList from '../../components/EventList'
import { isUpcomingEvent } from '../../components/EventList'

export default function UpcomingEvent() {
  return (
    <EventList
      filterFunction={isUpcomingEvent}
      noEventsMessage="You don't have any upcoming events."
    />
  )
}
