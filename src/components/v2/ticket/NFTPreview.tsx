interface NFTPreviewProps {
  /** Address corta de wallet — ej "0x3f2a...b91d". */
  walletAddress?: string
  /** URL al explorador (Zora). Si no, no muestra el link. */
  explorerUrl?: string
  /** Texto override del label superior. */
  label?: string
}

const shortenAddress = (addr?: string): string => {
  if (!addr) return ''
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export default function NFTPreview({
  walletAddress,
  explorerUrl,
  label = 'Minted on Base'
}: NFTPreviewProps) {
  return (
    <div
      className='flex items-center gap-2.5 rounded-glass-md border border-white/[0.10] px-3 py-2.5 backdrop-blur-glass'
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className='h-7 w-7 shrink-0 rounded-glass-sm grid place-items-center font-display text-[11px] font-bold text-white'
        style={{
          background: 'linear-gradient(135deg, #0052FF, #6E8FFF)'
        }}
        aria-hidden
      >
        B
      </div>
      <div className='min-w-0 flex-1'>
        <div className='text-[11.5px] text-white font-medium'>{label}</div>
        {walletAddress && (
          <div className='text-[10px] text-white/55 font-display tabular-nums mt-0.5 truncate'>
            {shortenAddress(walletAddress)}
          </div>
        )}
      </div>
      {explorerUrl && (
        <a
          href={explorerUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='shrink-0 inline-flex items-center gap-1 text-[10.5px] text-brand-hi font-display font-semibold hover:text-white transition'
        >
          View on Zora
          <svg
            width='9'
            height='9'
            viewBox='0 0 10 10'
            fill='none'
            aria-hidden
          >
            <path
              d='M3 7 7 3M7 3H4M7 3v3'
              stroke='currentColor'
              strokeWidth='1.4'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </a>
      )}
    </div>
  )
}
