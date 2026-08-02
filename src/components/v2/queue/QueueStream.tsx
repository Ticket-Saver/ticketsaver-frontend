import { cn } from '../../../types/ui'
import styles from '../../../styles/effects/queue.module.css'

interface QueueStreamProps {
  pct: number
  color: string
  compact?: boolean
  className?: string
}

/**
 * Visualización lineal de dots con un marker "YOU" centrado en `pct`.
 * Mantiene el viz del rediseño — el dot del usuario crece y pulsa
 * mientras los vecinos se atenúan en función de la distancia.
 */
export default function QueueStream({
  pct,
  color,
  compact,
  className
}: QueueStreamProps) {
  const total = compact ? 28 : 44
  const youIdx = Math.max(1, Math.min(total - 2, Math.round(pct * total)))

  return (
    <div
      className={cn(
        'flex items-center justify-center px-1 select-none',
        compact ? 'gap-1.5' : 'gap-2',
        className
      )}
      aria-hidden
      style={{ ['--queue-color' as string]: color } as React.CSSProperties}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isYou = i === youIdx
        const dist = Math.abs(i - youIdx)
        const opacity = isYou ? 1 : Math.max(0.18, 0.7 - dist * 0.025)
        const size = isYou ? (compact ? 14 : 18) : compact ? 5 : 7
        return (
          <div
            key={i}
            className={cn(styles.streamDot, isYou && styles.youDot)}
            style={{
              width: size,
              height: size,
              opacity
            }}
          >
            {isYou && (
              <span
                className={styles.youLabel}
                style={{
                  top: compact ? -14 : -18,
                  fontSize: compact ? 8 : 9
                }}
              >
                YOU
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
