import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn, type Size } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size
  variant?: 'glass' | 'ghost' | 'solid'
  label: string
  children: ReactNode
}

const SIZE: Record<Size, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
}

const VARIANT: Record<NonNullable<IconButtonProps['variant']>, string> = {
  glass: '',
  ghost: 'bg-transparent hover:bg-white/[0.08]',
  solid: 'bg-brand-mid hover:bg-brand-hi text-brand-ink'
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { size = 'md', variant = 'glass', label, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type='button'
      aria-label={label}
      disabled={disabled}
      className={cn(
        'inline-grid place-items-center rounded-glass-sm text-white transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        SIZE[size],
        variant === 'glass' ? glass.glassMd : VARIANT[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
})

export default IconButton
