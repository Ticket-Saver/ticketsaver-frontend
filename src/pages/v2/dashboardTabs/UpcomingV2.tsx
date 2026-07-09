import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import TicketGrid from '../../../components/v2/ticket/TicketGrid'
import { userTicketsEventToUIEvent } from '../../../services/hiEventsAdapter'
import type { MyTicketsContext } from '../MyTicketsV2'
import { ticketHref, TicketListSkeleton } from './_shared'

/**
 * Tickets próximos del usuario (eventos con fecha futura), reales de HiEvents.
 * Una card por evento; el link lleva a su ticketera pública (QR real).
 */
export default function UpcomingV2() {
  const { upcoming, loading } = useOutletContext<MyTicketsContext>()

  const events = useMemo(() => upcoming.map(userTicketsEventToUIEvent), [upcoming])
  const hrefBySlug = useMemo(
    () => new Map(upcoming.map((e) => [e.eventId, ticketHref(e)])),
    [upcoming]
  )

  if (loading) return <TicketListSkeleton />

  return (
    <TicketGrid
      events={events}
      hrefFor={(e) => hrefBySlug.get(e.id)}
      emptyMessage="You don't have any upcoming events yet — browse and grab some."
    />
  )
}
