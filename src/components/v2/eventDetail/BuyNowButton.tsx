import { Link } from 'react-router-dom'
import { cn } from '../../../types/ui'
import { getCtaState } from './StickyCTA'
import type { UIEvent } from '../../../types/uiEvent'

interface BuyNowButtonProps {
  event: UIEvent
  priceFrom: number | null
  isSaleActive: boolean
  saleStartsLabel?: string
  presaleActive?: boolean
  /**
   * Mismo gate de preventa que usa StickyCTA: si está definido, se llama en
   * vez de navegar directo (pide el código antes de entrar a /sale).
   */
  onChooseSeats?: () => void
}

/**
 * CTA de compra "Buy now" junto al resumen de fecha/venue, para clientes que
 * no bajan hasta el botón flotante "Choose seats". Misma lógica de
 * disabled/label/destino que StickyCTA (getCtaState) — no duplica el flujo.
 */
export default function BuyNowButton({
  event,
  priceFrom,
  isSaleActive,
  saleStartsLabel,
  presaleActive,
  onChooseSeats
}: BuyNowButtonProps) {
  const { disabled, label, targetHref } = getCtaState(
    event,
    priceFrom,
    isSaleActive,
    saleStartsLabel,
    presaleActive
  )

  const btnClass = cn(
    'shrink-0 inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-pill',
    'font-display font-semibold text-xs tracking-tight transition',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60',
    disabled
      ? 'bg-white/[0.08] text-white/45 cursor-not-allowed border border-white/10'
      : 'bg-gradient-to-br from-brand-hi to-brand-mid text-brand-ink shadow-brand-glow hover:brightness-110 active:brightness-95'
  )

  if (disabled) {
    return (
      <button type='button' disabled className={btnClass}>
        {label}
      </button>
    )
  }

  if (event.isExternal && event.ticketUrl) {
    return (
      <a href={targetHref} target='_blank' rel='noopener noreferrer' className={btnClass}>
        Buy now
      </a>
    )
  }

  if (onChooseSeats && !event.requiresQueue) {
    return (
      <button type='button' onClick={onChooseSeats} className={btnClass}>
        Buy now
      </button>
    )
  }

  return (
    <Link to={targetHref} className={btnClass}>
      Buy now
    </Link>
  )
}
