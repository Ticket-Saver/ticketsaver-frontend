import type { HiUserTicketsEvent } from '../../../types/hievents'

/**
 * Link a la ticketera pública (QR real) de un evento. Toma el primer ticket
 * ACTIVE (o el primero que haya) → `/ticket/:eventIdNumber/:publicId`.
 *
 * Nota (deuda): un evento puede tener varios tickets (varios asientos), cada
 * uno con su propio QR. Por ahora la card del evento linkea al primero; mostrar
 * todos los QR de una compra es una mejora futura.
 */
export const ticketHref = (e: HiUserTicketsEvent): string | undefined => {
  const t = e.tickets?.find((x) => x.status === 'ACTIVE') ?? e.tickets?.[0]
  if (!t) return undefined
  return `/ticket/${e.eventIdNumber}/${encodeURIComponent(t.ticketId)}`
}

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
