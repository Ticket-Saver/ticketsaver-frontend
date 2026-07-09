import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import WalletConnect from '../../components/v2/web3/WalletConnect'
import NFTGrid, {
  type NFTItem
} from '../../components/v2/web3/NFTGrid'
import { GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import gradients from '../../styles/effects/gradients.module.css'

/**
 * Web3V2 — la pestaña Wallet del dashboard.
 *
 * Si no hay wallet conectada: muestra `WalletConnect` con CTA grande.
 * Si conectada: muestra dirección + grid de NFTs (mock por ahora —
 * cuando exista `/api/userNFTs`, se reemplaza el mapping de demo por
 * la respuesta real onchain).
 */
export default function Web3V2() {
  const { isConnected } = useAccount()
  const { all } = useUIEvents()

  // Mock: NFTs derivados de eventos pasados — placeholder hasta backend.
  const mockNfts = useMemo<NFTItem[]>(() => {
    return all
      .filter((e) => e.expired)
      .slice(0, 6)
      .map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: `${e.month} ${e.date} · ${e.year}`,
        cover: e.cover,
        mintedAt: e.raw.event_date
      }))
  }, [all])

  return (
    <div className='space-y-6'>
      <header>
        <p className='text-[11px] text-white/55 uppercase tracking-[0.16em] font-display font-bold'>
          Web3
        </p>
        <h1
          className={`mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${gradients.textBrandSoft}`}
        >
          Wallet & collectibles
        </h1>
        <p className='mt-2 text-sm text-white/55 max-w-xl'>
          Connect your wallet to claim past events as NFTs and view your
          collection.
        </p>
      </header>

      <WalletConnect />

      <section>
        <header className='flex items-baseline justify-between mb-3'>
          <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight'>
            Your collection
          </h2>
          <span className='text-[11px] text-white/55 font-display tabular-nums'>
            {isConnected ? `${mockNfts.length} items` : 'Connect to view'}
          </span>
        </header>
        {isConnected ? (
          <NFTGrid items={mockNfts} />
        ) : (
          <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
            <div className='font-display text-base font-semibold text-white'>
              Wallet not connected
            </div>
            <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>
              Once you connect, your past events will appear here as
              collectible NFTs on Base.
            </p>
          </GlassCard>
        )}
      </section>
    </div>
  )
}
