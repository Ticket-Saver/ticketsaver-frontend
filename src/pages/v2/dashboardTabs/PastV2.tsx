import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import TicketGrid from '../../../components/v2/ticket/TicketGrid'
import { userTicketsEventToUIEvent } from '../../../services/hiEventsAdapter'
import type { MyTicketsContext } from '../MyTicketsV2'
import { toGridItems, TicketListSkeleton } from './_shared'

/**
 * Tickets pasados del usuario (eventos cuya fecha ya pasó), reales de HiEvents.
 * Variante visual "past" (saturada). Link a la ticketera pública.
 */
export default function PastV2() {
  const { past, loading } = useOutletContext<MyTicketsContext>()

  const items = useMemo(() => toGridItems(past, userTicketsEventToUIEvent), [past])

  if (loading) return <TicketListSkeleton />

  return <TicketGrid items={items} past emptyMessage="You don't have past events yet." />
}
