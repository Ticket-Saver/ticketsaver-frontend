import { useEffect, useState } from 'react'
import { cn } from '../../../types/ui'

const TIPS = [
  "Don't refresh — you'll lose your spot.",
  'We hold your spot if your wifi blinks.',
  'Have a payment method ready to be quick at checkout.',
  "You'll have 5 minutes to pick seats once you're in."
] as const

interface TipRotatorProps {
  small?: boolean
  intervalMs?: number
  className?: string
}

export default function TipRotator({
  small,
  intervalMs = 3200,
  className
}: TipRotatorProps) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => {
      setI((x) => (x + 1) % TIPS.length)
    }, intervalMs)
    return () => window.clearInterval(t)
  }, [intervalMs])

  return (
    <div
      className={cn(
        'leading-relaxed text-white/80',
        small ? 'text-[12px]' : 'text-[14px]',
        className
      )}
      aria-live='polite'
    >
      <span className='text-brand-hi font-semibold mr-1'>Tip ·</span>
      {TIPS[i]}
    </div>
  )
}
