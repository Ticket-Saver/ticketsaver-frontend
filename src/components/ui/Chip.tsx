import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  selected?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  size?: 'sm' | 'md'
}

export default function Chip({
  selected,
  leading,
  trailing,
  size = 'md',
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill font-display tracking-tight',
        'transition',
        size === 'sm' ? 'px-2.5 py-1 text-[10.5px]' : 'px-3 py-1.5 text-xs',
        selected
          ? 'bg-brand-hi text-brand-ink border border-transparent shadow-cover-glow'
          : `${glass.glassChip} text-white hover:bg-white/[0.12]`,
        className
      )}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </span>
  )
}
