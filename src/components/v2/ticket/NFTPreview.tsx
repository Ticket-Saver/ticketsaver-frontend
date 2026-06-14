interface NFTPreviewProps {
  /** Address corta de wallet — ej "0x3f2a...b91d". */
  walletAddress?: string
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
    </div>
  )
}
