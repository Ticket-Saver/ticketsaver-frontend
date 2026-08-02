import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { cn } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

export type ToastVariant = 'info' | 'success' | 'warn' | 'error'

export interface ToastInput {
  variant?: ToastVariant
  title?: string
  message: string
  /** ms hasta auto-dismiss. 0 = manual. Default 4500. */
  duration?: number
}

interface ToastItem extends Required<Omit<ToastInput, 'title'>> {
  id: string
  title?: string
}

interface ToastContextValue {
  show: (input: ToastInput) => string
  dismiss: (id: string) => void
  clear: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let counter = 0
const nextId = () => `t-${Date.now()}-${++counter}`

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([])
  const timeouts = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
    const t = timeouts.current.get(id)
    if (t !== undefined) {
      window.clearTimeout(t)
      timeouts.current.delete(id)
    }
  }, [])

  const show = useCallback(
    (input: ToastInput): string => {
      const id = nextId()
      const item: ToastItem = {
        id,
        variant: input.variant ?? 'info',
        title: input.title,
        message: input.message,
        duration: input.duration ?? 4500
      }
      setItems((prev) => [...prev, item])
      if (item.duration > 0) {
        const handle = window.setTimeout(() => dismiss(id), item.duration)
        timeouts.current.set(id, handle)
      }
      return id
    },
    [dismiss]
  )

  const clear = useCallback(() => {
    timeouts.current.forEach((t) => window.clearTimeout(t))
    timeouts.current.clear()
    setItems([])
  }, [])

  useEffect(() => {
    const map = timeouts.current
    return () => {
      map.forEach((t) => window.clearTimeout(t))
      map.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ show, dismiss, clear }),
    [show, dismiss, clear]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Permitimos llamadas fuera del provider (por ejemplo, durante render
    // SSR) devolviendo no-ops para evitar throws en código defensive.
    return {
      show: () => '',
      dismiss: () => {},
      clear: () => {}
    }
  }
  return ctx
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  info: 'border-brand-hi/40 text-white',
  success: 'border-accent-mint/40 text-white',
  warn: 'border-accent-coral/40 text-white',
  error: 'border-red-400/50 text-white'
}

const VARIANT_DOT: Record<ToastVariant, string> = {
  info: 'bg-brand-hi',
  success: 'bg-accent-mint',
  warn: 'bg-accent-coral',
  error: 'bg-red-400'
}

const VARIANT_LABEL: Record<ToastVariant, string> = {
  info: 'Info',
  success: 'Success',
  warn: 'Warning',
  error: 'Error'
}

const ToastViewport = ({
  items,
  onDismiss
}: {
  items: ToastItem[]
  onDismiss: (id: string) => void
}) => {
  if (items.length === 0) return null

  return (
    <div
      role='region'
      aria-label='Notifications'
      className='fixed inset-x-0 bottom-4 z-toast flex flex-col items-center gap-2 px-3 pointer-events-none'
      style={{
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          role={t.variant === 'error' ? 'alert' : 'status'}
          aria-live={t.variant === 'error' ? 'assertive' : 'polite'}
          className={cn(
            glass.glassLg,
            VARIANT_CLASS[t.variant],
            'pointer-events-auto rounded-glass-md px-3.5 py-2.5 max-w-sm w-full sm:w-auto sm:min-w-[280px]',
            'flex items-start gap-2.5 shadow-glass-deep'
          )}
        >
          <span
            aria-hidden
            className={cn(
              'mt-1 h-2 w-2 shrink-0 rounded-full',
              VARIANT_DOT[t.variant]
            )}
          />
          <div className='min-w-0 flex-1'>
            <div className='font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white/55'>
              {t.title ?? VARIANT_LABEL[t.variant]}
            </div>
            <div className='mt-0.5 text-[12.5px] text-white/90 leading-snug'>
              {t.message}
            </div>
          </div>
          <button
            type='button'
            aria-label='Dismiss notification'
            onClick={() => onDismiss(t.id)}
            className='shrink-0 -mr-0.5 grid h-6 w-6 place-items-center rounded-glass-sm text-white/55 hover:bg-white/[0.08] hover:text-white transition'
          >
            <svg width='10' height='10' viewBox='0 0 12 12' aria-hidden>
              <path
                d='m3 3 6 6m0-6-6 6'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
