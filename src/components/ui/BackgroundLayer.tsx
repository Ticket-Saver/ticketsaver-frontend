import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../types/ui'
import MeshBackground, { type MeshPalette } from './MeshBackground'

interface BackgroundLayerProps {
  seed?: number
  palette?: MeshPalette
  intensity?: number
  paused?: boolean
  /** Opacidad del mesh (default 0.35 — violeta sutil sobre el fondo carbón). */
  meshOpacity?: number
  /**
   * URL de cover blureado encima del mesh (usado por banners full-bleed
   * en B3). Se aplica `blur` fuerte + tinte oscuro para que el contenido
   * siga siendo legible.
   */
  coverImage?: string
  /** Intensidad del blur sobre el cover. Default 60px. */
  coverBlur?: number
  /** Opacidad del cover blureado. Default 0.45. */
  coverOpacity?: number
  /**
   * Si es true (default) la capa es `fixed` y cubre todo el viewport.
   * Si es false, se vuelve `absolute` y depende del padre relativo
   * (útil para banners full-bleed dentro de una página).
   */
  fixed?: boolean
  className?: string
  children?: ReactNode
}

export default function BackgroundLayer({
  seed = 0,
  palette = 'violet',
  intensity = 1,
  paused = false,
  meshOpacity = 0.35,
  coverImage,
  coverBlur = 60,
  coverOpacity = 0.45,
  fixed = true,
  className,
  children
}: BackgroundLayerProps) {
  const layerStyle: CSSProperties = fixed
    ? { position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }
    : { position: 'absolute', inset: 0, pointerEvents: 'none' }

  const coverStyle: CSSProperties | undefined = coverImage
    ? {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${coverImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: `blur(${coverBlur}px) saturate(140%)`,
        transform: 'scale(1.2)',
        opacity: coverOpacity,
        mixBlendMode: 'lighten'
      }
    : undefined

  return (
    <div
      aria-hidden='true'
      className={cn('bg-[#0A0A0C]', className)}
      style={layerStyle}
    >
      <MeshBackground
        seed={seed}
        palette={palette}
        intensity={intensity}
        paused={paused}
        opacity={meshOpacity}
      />
      {coverImage && <div style={coverStyle} />}
      {children}
    </div>
  )
}
