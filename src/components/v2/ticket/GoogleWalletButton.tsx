import { useState } from 'react'
import { useToast } from '../../ui'
import { cn } from '../../../types/ui'
import {
  GOOGLE_WALLET_ENABLED,
  requestGoogleWalletPass,
  type WalletPassPayload
} from '../../../services/walletPassService'

interface GoogleWalletButtonProps {
  payload: WalletPassPayload
  className?: string
}

/**
 * Botón "Add to Google Wallet" (Android). Espejo de AppleWalletButton:
 * detrás del flag GOOGLE_WALLET_ENABLED; en off muestra "Soon" + toast.
 */
export default function GoogleWalletButton({ payload, className }: GoogleWalletButtonProps) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const enabled = GOOGLE_WALLET_ENABLED

  const handleClick = async () => {
    if (!enabled) {
      toast.show({
        variant: 'info',
        title: 'Coming soon',
        message: 'Google Wallet passes will be available once the issuer account is set up.'
      })
      return
    }
    setLoading(true)
    const result = await requestGoogleWalletPass(payload)
    setLoading(false)
    if (!result.ok || !result.passUrl) {
      toast.show({
        variant: 'error',
        title: 'Wallet pass failed',
        message: result.error ?? 'Try again in a moment.'
      })
      return
    }
    // Navega al "Save to Google Wallet" link.
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
      <GoogleLogo />
      <span className='flex flex-col items-start leading-tight'>
        <span className='text-[8.5px] uppercase tracking-[0.18em] text-white/70 font-bold'>
          Add to
        </span>
        <span className='text-[14px] font-bold tracking-tight'>Google Wallet</span>
      </span>
      {!enabled && (
        <span className='text-[9px] uppercase tracking-[0.12em] text-white/55 ml-2'>Soon</span>
      )}
    </button>
  )
}

const GoogleLogo = () => (
  <svg width='17' height='17' viewBox='0 0 24 24' fill='none' aria-hidden>
    <path
      d='M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.16c-.27 1.43-1.07 2.64-2.28 3.45v2.87h3.69C21.72 18.66 23 15.77 23 12.27z'
      fill='#4285F4'
    />
    <path
      d='M12 24c3.08 0 5.66-1.02 7.55-2.76l-3.69-2.87c-1.02.69-2.33 1.1-3.86 1.1-2.97 0-5.48-2.01-6.38-4.71H1.7v2.96C3.58 21.45 7.49 24 12 24z'
      fill='#34A853'
    />
    <path
      d='M5.62 14.76A7.18 7.18 0 0 1 5.26 12.5c0-.78.13-1.53.36-2.26V7.28H1.7A11.98 11.98 0 0 0 .5 12.5c0 1.94.46 3.77 1.2 5.22l3.92-2.96z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.53c1.68 0 3.18.58 4.36 1.71l3.27-3.27C17.66 2.09 15.08 1 12 1 7.49 1 3.58 3.55 1.7 7.28l3.92 2.96C6.52 7.54 9.03 5.53 12 5.53z'
      fill='#EA4335'
    />
  </svg>
)
