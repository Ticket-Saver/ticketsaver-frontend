import TicketGrid from '../../../components/v2/ticket/TicketGrid'
import { useUIEvents } from '../../../hooks/useUIEvents'

/**
 * Demo: muestra los próximos 3 eventos visibles del schema como si
 * fueran las entradas del usuario. Cuando exista `/api/userTickets`,
 * acá filtramos por el wallet del usuario autenticado.
 */
export default function UpcomingV2() {
  const { visible, loading } = useUIEvents()

  if (loading) {
    return (
      <div className='grid gap-3 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='h-32 rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
          />
        ))}
      </div>
    )
  }

  const upcomingDemo = visible.slice(0, 3)

  return (
    <TicketGrid
      events={upcomingDemo}
      hrefFor={(e) => e.detailHref}
      emptyMessage="You don't have any upcoming events yet — browse and grab some."
    />
  )
}
