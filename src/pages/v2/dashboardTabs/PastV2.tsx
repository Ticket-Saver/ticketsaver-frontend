import TicketGrid from '../../../components/v2/ticket/TicketGrid'
import { GlassCard, Button } from '../../../components/ui'
import { useUIEvents } from '../../../hooks/useUIEvents'

/**
 * Demo: eventos cuya fecha ya pasó. Banner para "claim collectible"
 * (mint NFT) sobre los pasados — el wiring real con Wagmi se cubre en
 * B8 cuando reskinemos /dashboard/web3.
 */
export default function PastV2() {
  const { all, loading } = useUIEvents()

  if (loading) {
    return (
      <div className='grid gap-3 sm:grid-cols-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='h-32 rounded-glass-md bg-white/[0.04] border border-white/[0.08] animate-pulse'
          />
        ))}
      </div>
    )
  }

  const pastDemo = all.filter((e) => e.expired).slice(0, 6)

  return (
    <div className='space-y-5'>
      <CollectClaimBanner />
      <TicketGrid
        events={pastDemo}
        past
        emptyMessage="You don't have past events yet."
      />
    </div>
  )
}

const CollectClaimBanner = () => (
  <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='min-w-0'>
        <div className='text-[10px] uppercase tracking-[0.16em] font-display font-bold text-brand-hi'>
          Collectibles
        </div>
        <h2 className='mt-1 font-display text-lg lg:text-xl font-semibold text-white tracking-tight'>
          Turn your tickets into lasting memories
        </h2>
        <p className='mt-1 text-[12.5px] text-white/65 max-w-md'>
          Mint your past entries as NFTs on Base. They stay in your wallet
          forever, regardless of where you go next.
        </p>
      </div>
      <div className='flex gap-2 shrink-0'>
        <Button variant='ghost' size='md'>
          Learn more
        </Button>
        <Button variant='primary' size='md'>
          Claim now
        </Button>
      </div>
    </div>
  </GlassCard>
)
