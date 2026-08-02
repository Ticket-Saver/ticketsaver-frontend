import type { HTMLAttributes, ReactNode } from 'react'
import { cn, type PillState, type Size } from '../../types/ui'
import pill from '../../styles/effects/pill.module.css'

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  state?: PillState
  size?: Size
  leadingDot?: boolean
  dotPulse?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

const SIZE_CLASS: Record<Size, string> = {
  sm: pill.sm,
  md: pill.md,
  lg: pill.lg
}

const STATE_CLASS: Record<PillState, string> = {
  normal: pill.normal,
  warn: pill.warn,
  critical: pill.critical,
  expired: pill.expired
}

export default function Pill({
  state = 'normal',
  size = 'md',
  leadingDot,
  dotPulse,
  leading,
  trailing,
  className,
  children,
  ...rest
}: PillProps) {
  return (
    <span
      className={cn(pill.base, SIZE_CLASS[size], STATE_CLASS[state], 'font-display', className)}
      {...rest}
    >
      {leadingDot && <span className={cn(pill.dot, dotPulse && pill.dotPulse)} aria-hidden />}
      {leading}
      {children}
      {trailing}
    </span>
  )
}
