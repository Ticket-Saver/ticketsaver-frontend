import { useId, useMemo } from 'react'
import { COVER_KEYS, getCoverPalette, type CoverKey } from '../../../lib/covers/palettes'
import type { UIEvent } from '../../../types/uiEvent'

interface GalleryProps {
  /** Si se pasa, se generan paletas alrededor del cover de event para mantener cohesión visual. */
  event?: UIEvent
  /** Override explícito de paletas. Default: 5 derivadas. */
  paletteKeys?: CoverKey[]
  /** Label superpuesto sobre la primera tile. */
  featuredLabel?: { eyebrow: string; title: string }
}

/**
 * Selecciona 5 paletas que rotan alrededor del cover del evento. Esto
 * mantiene la galería visualmente cohesionada con el banner.
 */
const pickPalettes = (event?: UIEvent): CoverKey[] => {
  if (!event) return COVER_KEYS.slice(0, 5)
  const start = COVER_KEYS.indexOf(event.cover)
  const wrap = (i: number) => COVER_KEYS[(i + COVER_KEYS.length) % COVER_KEYS.length]
  return [wrap(start), wrap(start + 2), wrap(start - 1), wrap(start + 4), wrap(start - 3)]
}

export default function Gallery({
  event,
  paletteKeys,
  featuredLabel
}: GalleryProps) {
  const keys = useMemo(
    () => paletteKeys ?? pickPalettes(event),
    [event, paletteKeys]
  )
  const reactId = useId().replace(/[^a-z0-9]/gi, '')

  const fallbackLabel = event
    ? { eyebrow: `Live · ${event.year || ''}`, title: event.venueName }
    : { eyebrow: 'Live archive', title: 'Behind the scenes' }
  const label = featuredLabel ?? fallbackLabel

  return (
    <div
      className='flex gap-2.5 overflow-x-auto snap-x snap-mandatory px-5 lg:px-10 pb-2 no-scrollbar'
      role='list'
      aria-label='Gallery'
    >
      {keys.map((k, i) => (
        <GalleryTile
          key={`${k}-${i}`}
          paletteKey={k}
          big={i === 0}
          idSuffix={`${reactId}-${i}`}
          label={i === 0 ? label : undefined}
          showPlay={i === 0}
        />
      ))}
    </div>
  )
}

interface GalleryTileProps {
  paletteKey: CoverKey
  big: boolean
  idSuffix: string
  label?: { eyebrow: string; title: string }
  showPlay?: boolean
}

const GalleryTile = ({
  paletteKey,
  big,
  idSuffix,
  label,
  showPlay
}: GalleryTileProps) => {
  const p = getCoverPalette(paletteKey)
  const filterId = `gallery-noise-${idSuffix}`
  const size = big ? 210 : 140

  return (
    <div
      role='listitem'
      className='snap-start shrink-0 relative rounded-glass-md overflow-hidden border border-white/[0.12]'
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})`
      }}
    >
      <div
        aria-hidden
        className='absolute inset-0'
        style={{
          background: `radial-gradient(circle at 30% 70%, ${p.accent}66 0%, transparent 60%)`
        }}
      />
      <svg
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.25,
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }}
      >
        <filter id={filterId}>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves={2} />
          <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0' />
        </filter>
        <rect width='100%' height='100%' filter={`url(#${filterId})`} />
      </svg>

      {label && (
        <div className='absolute left-3 bottom-2.5 text-white'>
          <div className='font-display text-[9px] uppercase tracking-[0.16em] opacity-85 font-semibold'>
            {label.eyebrow}
          </div>
          <div className='font-display text-sm font-semibold mt-1 tracking-tight'>
            {label.title}
          </div>
        </div>
      )}

      {showPlay && (
        <div
          className='absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-pill text-white'
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <svg width='10' height='10' viewBox='0 0 12 12' aria-hidden>
            <path d='M3 2v8l7-4z' fill='currentColor' />
          </svg>
        </div>
      )}
    </div>
  )
}
