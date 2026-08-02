import type { HTMLAttributes, ElementType, ReactNode } from 'react'
import { cn, type GlassDepth } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  depth?: GlassDepth
  hoverable?: boolean
  as?: ElementType
  radius?: 'sm' | 'md' | 'lg' | 'xl'
  children?: ReactNode
}

const DEPTH_CLASS: Record<GlassDepth, string> = {
  sm: glass.glassSm,
  md: glass.glassMd,
  lg: glass.glassLg
}

const RADIUS: Record<NonNullable<GlassCardProps['radius']>, string> = {
  sm: 'rounded-glass-sm',
  md: 'rounded-glass-md',
  lg: 'rounded-glass-lg',
  xl: 'rounded-glass-xl'
}

export default function GlassCard({
  depth = 'md',
  hoverable,
  as: Tag = 'div',
  radius = 'md',
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={cn(DEPTH_CLASS[depth], RADIUS[radius], hoverable && glass.hoverable, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
