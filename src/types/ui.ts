export type Size = 'sm' | 'md' | 'lg'

export type ButtonVariant = 'primary' | 'ghost' | 'glass' | 'danger'

export type PillState = 'normal' | 'warn' | 'critical' | 'expired'

export type GlassDepth = 'sm' | 'md' | 'lg'

export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')
