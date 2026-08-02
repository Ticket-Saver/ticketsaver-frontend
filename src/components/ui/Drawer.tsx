import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../types/ui'

export type DrawerSide = 'right' | 'left' | 'bottom'

interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  children: ReactNode
  /** Override del className del panel (el wrapper interior). */
  panelClassName?: string
  /** Etiqueta para screen readers. */
  ariaLabel?: string
  /** Si es false, el click en el backdrop no cierra. Default true. */
  closeOnBackdrop?: boolean
}

const SIDE_BASE: Record<DrawerSide, string> = {
  right: 'top-0 right-0 bottom-0 max-w-md w-full',
  left: 'top-0 left-0 bottom-0 max-w-md w-full',
  bottom: 'left-0 right-0 bottom-0 max-h-[88vh] w-full rounded-t-glass-lg'
}

const SIDE_ANIM: Record<DrawerSide, string> = {
  right: 'animate-drawer-slide-right',
  left: 'animate-drawer-slide-left',
  bottom: 'animate-drawer-slide-up'
}

/**
 * Drawer primitive — overlay + panel slide-in con portal a `body`.
 *
 * Body scroll lock al abrir, `Escape` cierra, click en backdrop cierra
 * (configurable), focus trap básico hacia el primer elemento focusable
 * del panel al abrir y restauración del focus previo al cerrar.
 */
export default function Drawer({
  open,
  onClose,
  side = 'right',
  children,
  panelClassName,
  ariaLabel,
  closeOnBackdrop = true
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus inicial — primer elemento focusable dentro del panel.
    const focusFirst = window.requestAnimationFrame(() => {
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.cancelAnimationFrame(focusFirst)
      lastFocusedRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className='fixed inset-0 z-modal' role='dialog' aria-modal='true' aria-label={ariaLabel}>
      <div
        aria-hidden
        onClick={() => {
          if (closeOnBackdrop) onClose()
        }}
        className='absolute inset-0 bg-black/55 backdrop-blur-sm animate-drawer-fade-in'
      />
      <div
        ref={panelRef}
        className={cn('absolute', SIDE_BASE[side], SIDE_ANIM[side], panelClassName)}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
