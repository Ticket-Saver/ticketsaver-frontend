import { useEffect, useMemo, useRef, useState } from 'react'
import {
  TSMesh,
  DARK_VIOLET_PALETTE,
  VIVID_VIOLET_PALETTE,
  CHARCOAL_PALETTE,
  type RGB
} from '../../lib/mesh/tsMesh'

export type MeshPalette = 'violet' | 'vivid' | 'charcoal' | RGB[]

interface MeshBackgroundProps {
  seed?: number
  intensity?: number
  /**
   * 'violet' (default): dark ambient violet — brand.ink dominates.
   * 'vivid': original bright aurora — for hero/drama moments only.
   * 'charcoal': monochrome grayscale variant.
   */
  palette?: MeshPalette
  paused?: boolean
  /** 0–1 multiplier applied to the canvas. Default 0.7 so the dark
   *  surface underneath shows through and the page feels dark-first. */
  opacity?: number
  className?: string
  fallbackClassName?: string
}

type FallbackKey = 'violet' | 'vivid' | 'charcoal'

const FALLBACK_GRADIENT: Record<FallbackKey, string> = {
  violet:
    'radial-gradient(120% 80% at 25% 25%, #3D2566 0%, transparent 65%),' +
    'radial-gradient(120% 80% at 75% 80%, #5B3A8C 0%, transparent 65%),' +
    'linear-gradient(180deg, #1A0F33 0%, #0E0820 100%)',
  vivid:
    'radial-gradient(120% 80% at 20% 20%, #3D2566 0%, transparent 60%),' +
    'radial-gradient(120% 80% at 80% 20%, #5B3A8C 0%, transparent 60%),' +
    'radial-gradient(120% 80% at 80% 80%, #8A5BC7 0%, transparent 60%),' +
    'radial-gradient(120% 80% at 20% 80%, #B57BE8 0%, transparent 60%),' +
    'linear-gradient(180deg, #1A0F33 0%, #0E0820 100%)',
  charcoal:
    'radial-gradient(120% 80% at 50% 50%, #2E2E36 0%, transparent 60%),' +
    'linear-gradient(180deg, #15151A 0%, #0A0A0C 100%)'
}

const resolvePalette = (
  palette: MeshPalette | undefined
): { rgb: RGB[]; key: FallbackKey } => {
  if (palette === 'charcoal') return { rgb: CHARCOAL_PALETTE, key: 'charcoal' }
  if (palette === 'vivid') return { rgb: VIVID_VIOLET_PALETTE, key: 'vivid' }
  if (Array.isArray(palette) && palette.length === 6)
    return { rgb: palette, key: 'violet' }
  return { rgb: DARK_VIOLET_PALETTE, key: 'violet' }
}

export default function MeshBackground({
  seed = 0,
  intensity = 1,
  palette,
  paused = false,
  opacity = 0.7,
  className,
  fallbackClassName
}: MeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const meshRef = useRef<TSMesh | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [supported, setSupported] = useState<boolean>(true)
  const [reducedMotion, setReducedMotion] = useState<boolean>(false)

  const resolved = useMemo(() => resolvePalette(palette), [palette])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReducedMotion(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return

    const mesh = new TSMesh(canvasRef.current, {
      seed,
      intensity,
      palette: resolved.rgb
    })

    if (!mesh.isSupported()) {
      setSupported(false)
      mesh.destroy()
      return
    }

    meshRef.current = mesh

    let inView = true
    const io =
      typeof IntersectionObserver !== 'undefined' && wrapRef.current
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) inView = e.isIntersecting
              if (inView && !paused && !document.hidden) mesh.start()
              else mesh.stop()
            },
            { threshold: 0 }
          )
        : null
    if (io && wrapRef.current) io.observe(wrapRef.current)

    const onVis = () => {
      if (document.hidden || paused || !inView) mesh.stop()
      else mesh.start()
    }
    document.addEventListener('visibilitychange', onVis)

    if (!paused) mesh.start()

    return () => {
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      mesh.destroy()
      meshRef.current = null
    }
  }, [seed, reducedMotion, resolved.rgb, paused, intensity])

  useEffect(() => {
    if (!meshRef.current) return
    if (paused) meshRef.current.stop()
    else meshRef.current.start()
  }, [paused])

  const showFallback = reducedMotion || !supported

  return (
    <div
      ref={wrapRef}
      aria-hidden='true'
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#0E0820',
        pointerEvents: 'none'
      }}
    >
      {showFallback ? (
        <div
          className={fallbackClassName}
          style={{
            position: 'absolute',
            inset: 0,
            background: FALLBACK_GRADIENT[resolved.key],
            opacity
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            opacity
          }}
        />
      )}
    </div>
  )
}
