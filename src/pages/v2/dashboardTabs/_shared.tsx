import type { HiUserTicketsEvent } from '../../../types/hievents'
import type { UIEvent } from '../../../types/uiEvent'

/** Una card por ASIENTO (antes era una por evento y solo linkeaba al primer
 *  ticket — un comprador con 2 asientos veía "un solo boleto"). */
export interface TicketEntry {
  key: string
  href?: string
  seatLabel?: string
}

/** Entradas por ticket de un evento del usuario. Excluye CANCELLED. En el
 *  endpoint de my-tickets `zone` es el position crudo y `section` es la FILA
 *  (mapeo histórico del backend). */
export const ticketEntries = (e: HiUserTicketsEvent): TicketEntry[] => {
  const active = (e.tickets ?? []).filter((t) => t.status !== 'CANCELLED')
  return active.map((t, i) => {
    const seat = [
      t.zone && `Zona ${t.zone}`,
      t.section && `Fila ${t.section}`,
      t.seatNumber && `Asiento ${t.seatNumber}`
    ]
      .filter(Boolean)
      .join(' · ')
    return {
      key: t.ticketId,
      href: `/ticket/${e.eventIdNumber}/${encodeURIComponent(t.ticketId)}`,
      seatLabel: seat || (active.length > 1 ? `Ticket ${i + 1} de ${active.length}` : undefined)
    }
  })
}

/** Aplana eventos del usuario a items del grid: una card por asiento. */
export const toGridItems = (
  events: HiUserTicketsEvent[],
  toUIEvent: (e: HiUserTicketsEvent) => UIEvent
): Array<TicketEntry & { event: UIEvent }> =>
  events.flatMap((e) => {
    const ui = toUIEvent(e)
    return ticketEntries(e).map((t) => ({ ...t, event: ui }))
  })

/** Skeleton de la lista de tickets mientras carga el endpoint. */
export const TicketListSkeleton = () => (
  <div className='grid gap-3 sm:grid-cols-2'>
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className='h-[88px] rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
      />
    ))}
  </div>
)
