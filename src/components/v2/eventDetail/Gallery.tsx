import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import { COVER_KEYS, getCoverPalette, type CoverKey } from '../../../lib/covers/palettes'
import type { UIEvent } from '../../../types/uiEvent'
import type { HiImage } from '../../../types/hievents'

interface GalleryProps {
  /** Si se pasa, se generan paletas alrededor del cover de event para mantener cohesión visual. */
  event?: UIEvent
  /** Imágenes reales (HiEvents). Si hay, se muestran (foco que escala + abrir en pantalla completa). */
  images?: HiImage[]
  /** Override explícito de paletas. Default: 5 derivadas. */
  paletteKeys?: CoverKey[]
  /** Label superpuesto sobre la tile en foco. */
  featuredLabel?: { eyebrow: string; title: string }
}

const ACTIVE_SIZE = 210
const INACTIVE_SIZE = 132
const PROC_BIG = 210
const PROC_SMALL = 140

const pickPalettes = (event?: UIEvent): CoverKey[] => {
  if (!event) return COVER_KEYS.slice(0, 5)
  const start = COVER_KEYS.indexOf(event.cover)
  const wrap = (i: number) => COVER_KEYS[(i + COVER_KEYS.length) % COVER_KEYS.length]
  return [wrap(start), wrap(start + 2), wrap(start - 1), wrap(start + 4), wrap(start - 3)]
}

export default function Gallery({
  event,
  images,
  paletteKeys,
  featuredLabel
}: GalleryProps) {
  const keys = useMemo(
    () => paletteKeys ?? pickPalettes(event),
    [event, paletteKeys]
  )
  const reactId = useId().replace(/[^a-z0-9]/gi, '')

  const realImages = useMemo(
    () => (images ?? []).filter((i) => Boolean(i.url)).slice(0, 8),
    [images]
  )
  const useReal = realImages.length > 0

  // Tile en foco (la grande). Cambiar el foco hace crecer la nueva y achicar la anterior.
  const [activeIndex, setActiveIndex] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const fallbackLabel = event
    ? { eyebrow: `Live · ${event.year || ''}`, title: event.venueName }
    : { eyebrow: 'Live archive', title: 'Behind the scenes' }
  const label = featuredLabel ?? fallbackLabel

  return (
    <>
      <div
        className='flex items-center gap-2.5 overflow-x-auto snap-x snap-mandatory px-5 lg:px-10 pb-2 no-scrollbar'
        role='list'
        aria-label='Gallery'
        style={{ minHeight: ACTIVE_SIZE + 8 }}
      >
        {useReal
          ? realImages.map((img, i) => (
              <GalleryTile
                key={img.id}
                paletteKey={keys[i % keys.length]}
                imageUrl={img.url}
                size={i === activeIndex ? ACTIVE_SIZE : INACTIVE_SIZE}
                active={i === activeIndex}
                idSuffix={`${reactId}-${i}`}
                label={i === activeIndex ? label : undefined}
                onActivate={() => setActiveIndex(i)}
                onOpen={() => setOpenIndex(i)}
              />
            ))
          : keys.map((k, i) => (
              <GalleryTile
                key={`${k}-${i}`}
                paletteKey={k}
                size={i === 0 ? PROC_BIG : PROC_SMALL}
                active={i === 0}
                idSuffix={`${reactId}-${i}`}
                label={i === 0 ? label : undefined}
                showPlay={i === 0}
              />
            ))}
      </div>

      {useReal && openIndex !== null && (
        <Lightbox
          images={realImages.map((i) => i.url)}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  )
}

interface GalleryTileProps {
  paletteKey: CoverKey
  size: number
  active: boolean
  idSuffix: string
  imageUrl?: string
  label?: { eyebrow: string; title: string }
  showPlay?: boolean
  onActivate?: () => void
  onOpen?: () => void
}

const GalleryTile = ({
  paletteKey,
  size,
  active,
  idSuffix,
  imageUrl,
  label,
  showPlay,
  onActivate,
  onOpen
}: GalleryTileProps) => {
  const p = getCoverPalette(paletteKey)
  const filterId = `gallery-noise-${idSuffix}`
  const isReal = Boolean(imageUrl)

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (!isReal) return
    if (active) {
      onOpen?.()
    } else {
      // Trae la tile al centro y la enfoca (crece); la anterior se achica.
      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      onActivate?.()
    }
  }

  return (
    <button
      type='button'
      role='listitem'
      onClick={handleClick}
      aria-label={isReal ? (active ? 'Open image' : 'Focus image') : undefined}
      className={`group snap-center shrink-0 relative rounded-glass-md overflow-hidden border transition-all duration-[350ms] ease-out ${
        active ? 'border-white/25' : 'border-white/[0.12]'
      } ${isReal ? 'cursor-pointer' : 'cursor-default'} ${
        isReal && !active ? 'opacity-70 hover:opacity-90' : 'opacity-100'
      }`}
      style={{
        width: size,
        height: size,
        transitionProperty: 'width, height, opacity, border-color',
        background: `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})`
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=''
          aria-hidden
          className='absolute inset-0 h-full w-full object-cover'
        />
      ) : (
        <>
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
        </>
      )}

      {/* En la tile en foco: hint de "ampliar" (tap abre pantalla completa). */}
      {isReal && active && (
        <div
          aria-hidden
          className='absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-pill text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <ExpandIcon />
        </div>
      )}

      {label && (
        <div className='absolute left-3 bottom-2.5 text-white z-10 text-left'>
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
    </button>
  )
}

/** Visor a pantalla completa con navegación (flechas, teclado, swipe) y animación. */
const Lightbox = ({
  images,
  index,
  onClose,
  onIndexChange
}: {
  images: string[]
  index: number
  onClose: () => void
  onIndexChange: (i: number) => void
}) => {
  const [show, setShow] = useState(false)
  const multiple = images.length > 1

  const go = useCallback(
    (dir: number) => {
      onIndexChange((index + dir + images.length) % images.length)
    },
    [index, images.length, onIndexChange]
  )

  useEffect(() => {
    setShow(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [go, onClose])

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX === null) return
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    setTouchStartX(null)
  }

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center px-4'
      onClick={onClose}
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
      style={{
        background: 'rgba(5,2,12,0.92)',
        backdropFilter: 'blur(10px)',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.25s ease'
      }}
    >
      <button
        type='button'
        aria-label='Close'
        onClick={onClose}
        className='absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-glass-sm border border-white/20 text-white hover:bg-white/10 transition'
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <CloseIcon />
      </button>

      {multiple && (
        <button
          type='button'
          aria-label='Previous'
          onClick={(e) => {
            e.stopPropagation()
            go(-1)
          }}
          className='absolute left-3 lg:left-6 grid h-12 w-12 place-items-center rounded-pill border border-white/20 text-white hover:bg-white/10 transition'
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <ChevronIcon dir='left' />
        </button>
      )}

      <img
        key={index}
        src={images[index]}
        alt=''
        onClick={(e) => e.stopPropagation()}
        className='rounded-glass-md object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]'
        style={{
          maxHeight: '86vh',
          maxWidth: '92vw',
          transform: show ? 'scale(1)' : 'scale(0.96)',
          transition: 'transform 0.25s ease'
        }}
      />

      {multiple && (
        <button
          type='button'
          aria-label='Next'
          onClick={(e) => {
            e.stopPropagation()
            go(1)
          }}
          className='absolute right-3 lg:right-6 grid h-12 w-12 place-items-center rounded-pill border border-white/20 text-white hover:bg-white/10 transition'
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <ChevronIcon dir='right' />
        </button>
      )}

      {multiple && (
        <div
          className='absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-pill text-white font-display text-[11px] tabular-nums border border-white/15'
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

const ExpandIcon = () => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill='none' aria-hidden>
    <path
      d='M6 2H2v4M10 2h4v4M10 14h4v-4M6 14H2v-4'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const CloseIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
    <path d='M4 4l8 8M12 4l-8 8' stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' />
  </svg>
)

const ChevronIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
    <path
      d={dir === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
