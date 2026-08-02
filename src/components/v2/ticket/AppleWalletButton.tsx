import { useState } from 'react'
import { useToast } from '../../ui'
import { cn } from '../../../types/ui'
import {
  APPLE_WALLET_ENABLED,
  requestWalletPass,
  type WalletPassPayload
} from '../../../services/walletPassService'

interface AppleWalletButtonProps {
  payload: WalletPassPayload
  className?: string
}

export default function AppleWalletButton({ payload, className }: AppleWalletButtonProps) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const enabled = APPLE_WALLET_ENABLED

  const handleClick = async () => {
    if (!enabled) {
      toast.show({
        variant: 'info',
        title: 'Coming soon',
        message: 'Apple Wallet passes will be available once the issuer cert is in place.'
      })
      return
    }
    setLoading(true)
    const result = await requestWalletPass(payload)
    setLoading(false)
    if (!result.ok || !result.passUrl) {
      toast.show({
        variant: 'error',
        title: 'Wallet pass failed',
        message: result.error ?? 'Try again in a moment.'
      })
      return
    }
    // En iOS abre Wallet; en otros, descarga el .pkpass.
    window.location.assign(result.passUrl)
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={loading}
      aria-disabled={loading || undefined}
      className={cn(
        'w-full inline-flex items-center justify-center gap-2.5 rounded-glass-md font-display font-semibold text-[13px] transition',
        'h-12 px-4',
        'bg-black text-white border border-white/15 hover:brightness-110 active:brightness-95',
        'disabled:opacity-60 disabled:cursor-wait',
        !enabled && 'opacity-85',
        className
      )}
    >
      <AppleLogo />
      <span className='flex flex-col items-start leading-tight'>
        <span className='text-[8.5px] uppercase tracking-[0.18em] text-white/70 font-bold'>
          Add to
        </span>
        <span className='text-[14px] font-bold tracking-tight'>Apple Wallet</span>
      </span>
      {!enabled && (
        <span className='text-[9px] uppercase tracking-[0.12em] text-white/55 ml-2'>Soon</span>
      )}
    </button>
  )
}

const AppleLogo = () => (
  <svg width='16' height='20' viewBox='0 0 13 16' fill='currentColor' aria-hidden>
    <path d='M10.7 8.5c0-1.6 1.3-2.4 1.3-2.4-.7-1-1.8-1.2-2.2-1.2-1-.1-1.9.6-2.4.6-.5 0-1.2-.6-2-.6-1 0-2 .6-2.5 1.5-1.1 1.8-.3 4.6.7 6.1.5.7 1.1 1.6 1.9 1.5.7 0 1-.5 2-.5.9 0 1.2.5 2 .5.8 0 1.3-.7 1.8-1.5.6-.8.8-1.6.8-1.7 0 0-1.4-.5-1.4-2.3zM9 3.8c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.7-.8z' />
  </svg>
)
