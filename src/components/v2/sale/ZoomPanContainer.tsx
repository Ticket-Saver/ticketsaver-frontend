import type { ReactNode } from 'react'
import { useZoomPan, type UseZoomPanOptions } from '../../../hooks/useZoomPan'
import { cn } from '../../../types/ui'

interface ZoomPanContainerProps extends UseZoomPanOptions {
  children: ReactNode
  showControls?: boolean
  className?: string
  contentClassName?: string
  /**
   * Etiqueta para accessibility — leída por SR cuando el user enfoca el
   * contenedor.
   */
  ariaLabel?: string
}

export default function ZoomPanContainer({
  children,
  showControls = true,
  className,
  contentClassName,
  ariaLabel = 'Zoomable map',
  ...options
}: ZoomPanContainerProps) {
  const { containerRef, state, reset, zoomIn, zoomOut } = useZoomPan(options)

  return (
    <div
      ref={containerRef}
      role='region'
      aria-label={ariaLabel}
      className={cn(
        'relative overflow-hidden touch-none select-none cursor-grab',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 grid place-items-center',
          contentClassName
        )}
      >
        <div
          style={{
            transform: `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`,
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        >
          {children}
        </div>
      </div>

      {showControls && (
        <div className='absolute bottom-3 right-3 flex flex-col gap-1.5 z-10'>
          <ZoomButton label='Zoom in' onClick={zoomIn}>
            <PlusIcon />
          </ZoomButton>
          <ZoomButton label='Zoom out' onClick={zoomOut}>
            <MinusIcon />
          </ZoomButton>
          <ZoomButton label='Reset zoom' onClick={reset}>
            <ResetIcon />
          </ZoomButton>
        </div>
      )}

      {state.scale !== 1 && (
        <div
          className='absolute top-3 left-3 z-10 px-2 py-0.5 rounded-pill bg-black/50 border border-white/15 text-white text-[10px] font-display tabular-nums backdrop-blur-glass'
          aria-live='polite'
        >
          {(state.scale * 100).toFixed(0)}%
        </div>
      )}
    </div>
  )
}

interface ZoomButtonProps {
  label: string
  onClick: () => void
  children: ReactNode
}

const ZoomButton = ({ label, onClick, children }: ZoomButtonProps) => (
  <button
    type='button'
    aria-label={label}
    data-no-pan
    onClick={onClick}
    className='grid h-8 w-8 place-items-center rounded-glass-sm border border-white/15 text-white hover:bg-white/[0.18] transition backdrop-blur-glass'
    style={{ background: 'rgba(10,10,12,0.55)' }}
  >
    {children}
  </button>
)

const PlusIcon = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path d='M6 2v8M2 6h8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
  </svg>
)

const MinusIcon = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path d='M2 6h8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
  </svg>
)

const ResetIcon = () => (
  <svg width='12' height='12' viewBox='0 0 14 14' fill='none' aria-hidden>
    <path
      d='M2 7a5 5 0 1 0 1.5-3.5L2 5M2 2v3h3'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </svg>
)
