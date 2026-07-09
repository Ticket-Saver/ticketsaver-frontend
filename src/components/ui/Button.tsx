import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn, type ButtonVariant, type Size } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: Size
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  fullWidth?: boolean
}

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-base'
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'tsv-btn-primary bg-gradient-to-br from-brand-hi to-brand-mid text-brand-ink ' +
    'shadow-brand-glow hover:brightness-110 active:brightness-95',
  ghost:
    'tsv-btn-ghost bg-transparent text-white border border-white/15 hover:bg-white/[0.08]',
  glass: 'tsv-btn-glass text-white hover:bg-white/[0.12]',
  danger:
    'tsv-btn-danger bg-red-500/20 text-red-200 border border-red-400/40 hover:bg-red-500/30'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    fullWidth,
    className,
    children,
    disabled,
    ...rest
  },
  ref
) {
  const baseGlass = variant === 'glass' ? glass.glassMd : ''
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-display',
        'font-semibold tracking-tight transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        SIZE[size],
        VARIANT[variant],
        baseGlass,
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})

export default Button
