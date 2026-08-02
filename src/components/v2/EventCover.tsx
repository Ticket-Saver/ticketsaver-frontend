import { useId } from 'react'
import { cn } from '../../types/ui'
import { getCoverPalette } from '../../lib/covers/palettes'
import type { UIEvent } from '../../types/uiEvent'

/**
 * Datos mínimos que necesita el cover. Aceptamos un UIEvent completo o un
 * subset (útil cuando una página crea un evento "ficticio" — placeholder
 * de loading, demo de paleta, etc.).
 */
export type EventCoverData = Pick<
  UIEvent,
  'id' | 'title' | 'subtitle' | 'category' | 'cover' | 'month' | 'date' | 'imageUrl'
>

interface EventCoverProps {
  event: EventCoverData
  /** Alto del cover. El ancho es 100% del contenedor. */
  height?: number
  /** Render más grande del title (32–36px) — para hero. */
  big?: boolean
  /** Oculta la chip de categoría (top-left). */
  hideCategory?: boolean
  /** Oculta la badge de fecha (top-right). */
  hideDate?: boolean
  /** Oculta el title — útil para covers decorativos detrás de otra capa. */
  hideTitle?: boolean
  className?: string
}

const TITLE_THRESHOLD = 14

export default function EventCover({
  event,
  height = 200,
  big = false,
  hideCategory = false,
  hideDate = false,
  hideTitle = false,
  className
}: EventCoverProps) {
  const c = getCoverPalette(event.cover)
  const reactId = useId().replace(/[^a-z0-9]/gi, '')
  const filterId = `cover-noise-${reactId}`
  const titleSize = big ? 36 : event.title.length > TITLE_THRESHOLD ? 18 : 22

  return (
    <div
      className={cn('relative w-full overflow-hidden', className)}
      style={{
        height,
        background: `linear-gradient(135deg, ${c.a} 0%, ${c.b} 60%, ${c.c} 100%)`,
        borderRadius: 'inherit'
      }}
      aria-label={event.title}
    >
      {event.imageUrl ? (
        <>
          <img
            src={event.imageUrl}
            alt=''
            aria-hidden
            className='absolute inset-0 h-full w-full object-cover'
          />
          {/* Velo para legibilidad de los chips/título sobre la foto. */}
          <div
            aria-hidden
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(to top, rgba(8,3,20,0.72) 0%, rgba(8,3,20,0.06) 45%, rgba(8,3,20,0.30) 100%)'
            }}
          />
        </>
      ) : (
        <>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: '80%',
              height: '80%',
              left: '-20%',
              top: '20%',
              background: `radial-gradient(circle, ${c.accent}80 0%, transparent 60%)`,
              filter: 'blur(30px)'
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: '60%',
              height: '60%',
              right: '-10%',
              top: '-15%',
              background: `radial-gradient(circle, ${c.b}cc 0%, transparent 60%)`,
              filter: 'blur(24px)',
              mixBlendMode: 'screen'
            }}
          />

          <svg
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0.22,
              mixBlendMode: 'overlay',
              pointerEvents: 'none'
            }}
          >
            <filter id={filterId}>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0.9'
                numOctaves={2}
                stitchTiles='stitch'
              />
              <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0' />
            </filter>
            <rect width='100%' height='100%' filter={`url(#${filterId})`} />
          </svg>
        </>
      )}

      {!hideCategory && (
        <div
          className='absolute top-3 left-3 px-2.5 py-1 rounded-pill font-display text-[9.5px] font-medium uppercase tracking-[0.12em] text-white border border-white/20'
          style={{
            background: 'rgba(0,0,0,0.32)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          {event.category}
        </div>
      )}

      {!hideTitle && (
        <div
          className='absolute left-4 right-4 text-white font-display font-bold tracking-tight'
          style={{
            bottom: big ? 22 : 12,
            lineHeight: 0.95,
            textShadow: '0 2px 16px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ fontSize: titleSize }}>{event.title}</div>
          {big && event.subtitle && (
            <div className='mt-1.5 font-body text-xs font-normal opacity-85 tracking-[0.04em]'>
              {event.subtitle}
            </div>
          )}
        </div>
      )}

      {!hideDate && event.month && event.date > 0 && (
        <div
          className='absolute top-2.5 right-2.5 rounded-glass-sm text-center font-display leading-none'
          style={{
            background: 'rgba(255,255,255,0.95)',
            color: '#180826',
            padding: '5px 8px',
            minWidth: 38
          }}
        >
          <div className='text-[8.5px] font-semibold tracking-[0.1em] opacity-70'>
            {event.month.toUpperCase()}
          </div>
          <div className='mt-0.5 text-base font-bold'>
            {String(event.date).padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  )
}
