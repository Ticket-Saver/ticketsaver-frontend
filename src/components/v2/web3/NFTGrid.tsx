import { GlassCard } from '../../ui'
import { getCoverPalette, type CoverKey } from '../../../lib/covers/palettes'

export interface NFTItem {
  id: string
  title: string
  subtitle?: string
  cover: CoverKey
  mintedAt?: string
}

interface NFTGridProps {
  items: NFTItem[]
  emptyMessage?: string
}

/**
 * Grid de NFTs del wallet del usuario. Por ahora `items` se pasa mock
 * desde la page — cuando el backend devuelva la colección onchain real,
 * sólo cambia el data source.
 */
export default function NFTGrid({
  items,
  emptyMessage = 'No NFTs in this wallet yet — buy a ticket to start your collection.'
}: NFTGridProps) {
  if (items.length === 0) {
    return (
      <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
        <div className='font-display text-base font-semibold text-white'>Empty wallet</div>
        <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>{emptyMessage}</p>
      </GlassCard>
    )
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
      {items.map((item) => (
        <NFTTile key={item.id} item={item} />
      ))}
    </div>
  )
}

const NFTTile = ({ item }: { item: NFTItem }) => {
  const palette = getCoverPalette(item.cover)
  const safeId = item.id.replace(/[^a-z0-9]/gi, '')
  return (
    <article
      className='relative aspect-[3/4] rounded-glass-md overflow-hidden border border-white/[0.10]'
      style={{
        background: `linear-gradient(135deg, ${palette.a}, ${palette.b}, ${palette.c})`
      }}
    >
      <div
        aria-hidden
        className='absolute inset-0'
        style={{
          background: `radial-gradient(circle at 30% 30%, ${palette.accent}55, transparent 60%)`
        }}
      />
      <svg
        aria-hidden
        className='absolute inset-0 w-full h-full pointer-events-none'
        style={{ opacity: 0.22, mixBlendMode: 'overlay' }}
      >
        <filter id={`nft-grid-noise-${safeId}`}>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves={2} />
        </filter>
        <rect width='100%' height='100%' filter={`url(#nft-grid-noise-${safeId})`} />
      </svg>
      <div className='absolute left-3 top-3 text-white text-[8.5px] uppercase tracking-[0.16em] font-display font-bold opacity-85'>
        NFT · Base
      </div>
      <div className='absolute left-3 right-3 bottom-3 text-white'>
        <div className='font-display text-[12px] font-semibold tracking-tight truncate'>
          {item.title}
        </div>
        {item.subtitle && (
          <div className='text-[9.5px] opacity-65 mt-0.5 truncate'>{item.subtitle}</div>
        )}
      </div>
    </article>
  )
}
