import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCover from './EventCover'
import { cn } from '../../types/ui'
import type { UIEvent } from '../../types/uiEvent'

interface CoverFlow3DProps {
  events: UIEvent[]
  /** Índice inicial del cover centrado (default: el del medio). */
  initialActive?: number
  className?: string
}

/**
 * Cover-flow 3D estilo iTunes/Apple. Porteado de
 * `Shader wallpapers/ts-home-dark.jsx` (CoverFlow3D). Las cards rotan
 * en perspectiva (perspective: 1100 + transform-style: preserve-3d en el
 * contenedor padre).
 *
 * Interacciones:
 * - Tap en una card no activa: la centra.
 * - Tap en la activa: abre el detalle del evento.
 * - Drag horizontal (mouse o touch): las cards permanecen quietas en
 *   sus posiciones; el delta del drag cambia el `active` y la rotación
 *   3D anima la transición entre cards. NO se desplazan en vivo siguiendo
 *   al puntero — solo "rotan" entre posiciones discretas.
 *
 * Dimensiones responsivas: cards más grandes y separadas en desktop.
 */
export default function CoverFlow3D({ events, initialActive, className }: CoverFlow3DProps) {
  const navigate = useNavigate()

  // Breakpoint desktop (lg = 1024px). Las dimensiones se recalculan
  // automáticamente al cambiar el ancho del viewport.
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const cardW = isDesktop ? 300 : 220
  const cardH = isDesktop ? 420 : 320
  const spacing = isDesktop ? 160 : 100
  const zStep = isDesktop ? 80 : 60

  const safeInitial = useMemo(() => {
    if (events.length === 0) return 0
    const def = Math.floor(events.length / 2)
    return Math.min(Math.max(initialActive ?? def, 0), events.length - 1)
  }, [initialActive, events.length])
  const [active, setActive] = useState(safeInitial)

  // Tracking del drag. NO usamos state para el delta: el drag NO mueve
  // las cards en vivo, solo dispara cambios de `active` al cruzar
  // múltiplos del spacing. Las cards permanecen quietas y rotan entre
  // posiciones gracias a la transición CSS.
  const dragStartXRef = useRef<number | null>(null)
  const dragStartActiveRef = useRef<number>(0)
  const wasDragRef = useRef(false)

  if (events.length === 0) return null

  const idx = Math.min(active, events.length - 1)
  const current = events[idx]
  const DRAG_THRESHOLD = 8
  // Cuánto hay que arrastrar para que cambie 1 step. ~75% del spacing
  // hace que el gesto se sienta natural sin ser hipersensible.
  const STEP_DISTANCE = spacing * 0.75

  const computeSteps = (delta: number) => {
    // Drag a la izquierda (delta negativo) → avanza (active +). A la
    // derecha (positivo) → retrocede.
    return Math.round(-delta / STEP_DISTANCE)
  }

  const updateActiveFromDrag = (clientX: number) => {
    if (dragStartXRef.current === null) return
    const delta = clientX - dragStartXRef.current
    if (Math.abs(delta) > DRAG_THRESHOLD) wasDragRef.current = true
    const steps = computeSteps(delta)
    const next = Math.min(Math.max(dragStartActiveRef.current + steps, 0), events.length - 1)
    if (next !== active) setActive(next)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = e.clientX
    dragStartActiveRef.current = idx
    wasDragRef.current = false
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* algunos browsers no soportan pointerCapture en ciertas condiciones */
    }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return
    updateActiveFromDrag(e.clientX)
  }
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return
    dragStartXRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }

  const handleCardClick = (i: number, e: UIEvent) => {
    // Si el usuario arrastró, no procesamos el click como tap.
    if (wasDragRef.current) {
      wasDragRef.current = false
      return
    }
    if (i !== idx) {
      setActive(i)
    } else {
      navigate(e.detailHref)
    }
  }

  const cardTransition = 'transform .35s cubic-bezier(.3,.7,.3,1), opacity .25s'

  return (
    <section className={cn('relative', className)}>
      <header className='px-5 lg:px-10 mb-5 lg:mb-7'>
        <p className='font-display text-[11px] uppercase tracking-[0.16em] font-semibold text-brand-hi'>
          Closer look
        </p>
        <h2 className='mt-1 font-display text-lg lg:text-2xl font-semibold text-white tracking-tight'>
          Browse covers, tap to open
        </h2>
        <p className='text-[11.5px] lg:text-[13px] text-white/55 mt-1'>
          Drag to flip through · tap a cover to glimpse the venue & seats.
        </p>
      </header>

      <div
        className='relative w-full select-none touch-pan-y'
        style={{
          height: cardH + 96,
          perspective: '1100px',
          cursor: 'grab'
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div
          className='absolute left-1/2 top-6'
          style={{
            height: cardH,
            width: 0,
            transformStyle: 'preserve-3d'
          }}
        >
          {events.map((e, i) => {
            const offset = i - idx
            const abs = Math.abs(offset)
            const tx = offset * spacing
            const rotY = offset * -32
            const scale = abs === 0 ? 1 : 0.85 - Math.min(abs - 1, 1) * 0.06
            const z = -abs * zStep
            const opacity = abs > 2 ? 0 : 1 - abs * 0.18
            const isActive = abs === 0
            return (
              <button
                type='button'
                key={e.id}
                onClick={() => handleCardClick(i, e)}
                aria-label={isActive ? `Open ${e.title}` : `Bring ${e.title} to focus`}
                aria-current={isActive ? 'true' : undefined}
                className='absolute top-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60 rounded-[18px]'
                style={{
                  left: -cardW / 2,
                  width: cardW,
                  height: cardH,
                  transform: `translateX(${tx}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  opacity,
                  transition: cardTransition,
                  zIndex: 10 - abs,
                  pointerEvents: opacity < 0.05 ? 'none' : 'auto'
                }}
                draggable={false}
              >
                <div
                  className='w-full h-full overflow-hidden border border-white/10'
                  style={{
                    borderRadius: 18,
                    boxShadow: isActive
                      ? '0 26px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.18) inset'
                      : '0 14px 36px rgba(0,0,0,0.45)'
                  }}
                >
                  <EventCover event={e} height={cardH} />
                </div>
              </button>
            )
          })}
        </div>

        <div className='absolute left-0 right-0 bottom-0 text-center text-white px-4 pointer-events-none'>
          <div className='font-display text-base lg:text-lg font-semibold tracking-tight'>
            {current.title}
          </div>
          <div className='mt-1 text-[12px] lg:text-[13px] text-white/55'>
            {current.day} {current.date} {current.month}
            {(current.city || current.venueName) && <> · {current.city || current.venueName}</>}
          </div>
        </div>
      </div>
    </section>
  )
}
