import { useState } from 'react'
import { useToast } from '../../ui'
import { cn } from '../../../types/ui'
import {
  shareTicket,
  type ShareTicketInput
} from '../../../services/ticketShareService'

interface ShareSheetProps {
  input: ShareTicketInput
  className?: string
  label?: string
}

export default function ShareSheet({
  input,
  className,
  label = 'Share · Save image'
}: ShareSheetProps) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const result = await shareTicket(input)
    setLoading(false)
    if (!result.ok) {
      toast.show({
        variant: 'error',
        title: 'Share failed',
        message: result.error ?? 'Could not generate the image.'
      })
      return
    }
    if (result.downloaded) {
      toast.show({
        variant: 'success',
        title: 'Image saved',
        message: 'Your ticket image was downloaded.'
      })
    } else if (result.shared) {
      toast.show({
        variant: 'success',
        title: 'Shared',
        message: 'Your ticket is on its way.'
      })
    }
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'w-full inline-flex items-center justify-center gap-2.5 rounded-glass-md font-display font-semibold text-[13px] h-12 px-4 transition',
        'bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white/[0.10]',
        'disabled:opacity-60 disabled:cursor-wait',
        className
      )}
    >
      <ShareIcon />
      {loading ? 'Rendering…' : label}
    </button>
  )
}

const ShareIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
    <path
      d='M8 2v8M5 5l3-3 3 3M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
