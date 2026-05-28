import { CollectionGrid } from '../../../components/v2/ticket/TicketGrid'
import { useUIEvents } from '../../../hooks/useUIEvents'

/**
 * Demo: vista "vitrina" con cards verticales tipo coleccionable.
 * Por ahora reusa los eventos pasados (los que ya viviste). En backend
 * real vendrían de la wallet onchain del usuario.
 */
export default function CollectiblesV2() {
  const { all, loading } = useUIEvents()

  if (loading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='aspect-[3/4] rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
          />
        ))}
      </div>
    )
  }

  const collectiblesDemo = all.filter((e) => e.expired).slice(0, 12)

  return <CollectionGrid events={collectiblesDemo} />
}
