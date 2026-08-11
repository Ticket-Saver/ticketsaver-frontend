import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import TicketGrid from '../../../components/v2/ticket/TicketGrid'
import { userTicketsEventToUIEvent } from '../../../services/hiEventsAdapter'
import { hiEventsService } from '../../../services/hiEventsService'
import type { MyTicketsContext } from '../MyTicketsV2'
import { toGridItems, TicketListSkeleton } from './_shared'

/**
 * Tickets próximos del usuario (eventos con fecha futura), reales de HiEvents.
 * Una card por ASIENTO; cada link lleva a la ticketera pública de ese QR.
 *
 * Con `?event=<id>&order=<shortId>` (link de los mails de compra) filtramos a
 * los tickets de esa orden: resolvemos la orden y cruzamos sus `public_id` con
 * los `ticketId` del usuario.
 */
export default function UpcomingV2() {
  const { upcoming, loading } = useOutletContext<MyTicketsContext>()
  const [params] = useSearchParams()
  const orderShortId = params.get('order')
  const eventId = params.get('event')

  const [orderTicketIds, setOrderTicketIds] = useState<Set<string> | null>(null)
  const [orderLoading, setOrderLoading] = useState(false)
  useEffect(() => {
    if (!orderShortId || !eventId) {
      setOrderTicketIds(null)
      return
    }
    const controller = new AbortController()
    setOrderLoading(true)
    hiEventsService
      .getOrder(eventId, orderShortId, controller.signal)
      .then((ord) => {
        const ids = (ord?.attendees ?? []).map((a) => a.public_id).filter(Boolean)
        setOrderTicketIds(new Set(ids))
      })
      .catch(() => {
        if (!controller.signal.aborted) setOrderTicketIds(new Set()) // orden no hallada → vacío
      })
      .finally(() => {
        if (!controller.signal.aborted) setOrderLoading(false)
      })
    return () => controller.abort()
  }, [orderShortId, eventId])

  const filtered = useMemo(() => {
    if (!orderTicketIds) return upcoming
    return upcoming
      .map((e) => ({ ...e, tickets: e.tickets.filter((t) => orderTicketIds.has(t.ticketId)) }))
      .filter((e) => e.tickets.length > 0)
  }, [upcoming, orderTicketIds])

  const items = useMemo(() => toGridItems(filtered, userTicketsEventToUIEvent), [filtered])

  if (loading || orderLoading) return <TicketListSkeleton />

  return (
    <TicketGrid
      items={items}
      emptyMessage={
        orderTicketIds
          ? 'No encontramos los tickets de esta compra.'
          : "You don't have any upcoming events yet — browse and grab some."
      }
    />
  )
}
