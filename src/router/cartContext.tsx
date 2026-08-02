import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { useSessionTimer } from '../hooks/useSessionTimer'
import { type PricingBreakdown } from '../lib/pricing'

/**
 * CartContext — versión Bloque 5.
 *
 * Single source of truth para los tickets que el usuario tiene en su
 * orden. Cualquier vista (SeatGrid sidebar/sheet, CartDrawer global,
 * Header badge, CheckoutV2) lee y muta desde acá. La persistencia sigue
 * pasando por `local_cart` (compatibilidad con `sessionCleanupService`).
 *
 * Integra `useSessionTimer` con el `eventLabel` activo del carrito:
 * arranca al primer item, limpia el cart al expirar.
 */

export interface CartItem {
  /** id único — usado para dedupe y para remove. */
  ticketId: string
  /** Label visible: seat ("K-7") o id corto para GA. */
  seatLabel: string
  /** Coords del seatmap. `undefined` para tickets General Admission. */
  coords?: { row: number; col: number }
  /** Área física (mapConfig area.title) o nombre de zona GA. */
  subZone: string
  /** event_label — usado para timer + persistencia. */
  zoneName: string
  /** Tier de precio del schema ("P1", "VIP1"). */
  priceType: string
  /** Nombre del tier de color (mapConfig area.name). */
  seatType: string
  /** Net del asiento en USD. */
  price_base: number
  /** Final del asiento en USD (== base hasta que el cliente declare fees por tier). */
  price_final: number
  /** Timestamp de emisión. */
  issuedAt: number
  /** Metadata extra (compat con legacy / Stripe). */
  [key: string]: unknown
}

interface CartContextValue {
  // Datos
  items: CartItem[]
  count: number
  eventLabel: string | null
  subtotal: number
  pricing: PricingBreakdown

  // UI state del drawer global
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void

  // Mutations
  /** Agrega un item. Es no-op si ya existe un item con el mismo ticketId. */
  addItem: (item: CartItem) => void
  /** Remueve por ticketId (más estable que por seatLabel). */
  removeItem: (ticketId: string) => void
  /** Reemplaza el cart entero — útil para hidratar desde validatedCart. */
  setItems: (items: CartItem[]) => void
  /** Limpia cart + cart_checkout + timer. */
  clear: () => void
  /** Re-lee de localStorage (cuando código legacy escribe directo). */
  reloadFromStorage: () => void
}

const STORAGE_KEY = 'local_cart'
const EVENT_LABEL_KEY = 'cart_event_label'

const noop = () => {}

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  eventLabel: null,
  subtotal: 0,
  pricing: { subtotal: 0, serviceFee: 0, taxes: 0, total: 0 },
  isOpen: false,
  openDrawer: noop,
  closeDrawer: noop,
  toggleDrawer: noop,
  addItem: noop,
  removeItem: noop,
  setItems: noop,
  clear: noop,
  reloadFromStorage: noop
})

const readItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

const readEventLabel = (): string | null => {
  try {
    return localStorage.getItem(EVENT_LABEL_KEY)
  } catch {
    return null
  }
}

const writeItems = (items: CartItem[]) => {
  try {
    if (items.length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    if (import.meta.env.DEV) console.warn('CartContext: writeItems failed', err)
  }
}

const writeEventLabel = (label: string | null) => {
  try {
    if (!label) localStorage.removeItem(EVENT_LABEL_KEY)
    else localStorage.setItem(EVENT_LABEL_KEY, label)
  } catch {}
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItemsState] = useState<CartItem[]>(() => readItems())
  const [eventLabel, setEventLabel] = useState<string | null>(() =>
    readEventLabel()
  )
  const [isOpen, setIsOpen] = useState(false)

  // Timer atado al eventLabel actual. Si no hay eventLabel, el hook no
  // hace nada útil (storage key vacía); cuando aparece un primer item con
  // eventLabel, el `useEffect` de abajo arranca el countdown.
  const timer = useSessionTimer(eventLabel ?? undefined, 10)
  // Desestructuramos para usar referencias estables en los useEffects —
  // pasar `timer` entero como dep dispara re-runs en cada tick del
  // setInterval interno, lo que cascadea re-renders en TODOS los
  // consumers del cartContext.
  const {
    hasStarted: timerHasStarted,
    isExpired: timerIsExpired,
    startTimer: timerStartTimer,
    resetTimer: timerResetTimer
  } = timer

  const reloadFromStorage = useCallback(() => {
    setItemsState(readItems())
    setEventLabel(readEventLabel())
  }, [])

  // Cross-tab sync via storage event.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === EVENT_LABEL_KEY || e.key === null) {
        reloadFromStorage()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [reloadFromStorage])

  // Arrancar timer cuando aparece el primer item.
  useEffect(() => {
    if (items.length > 0 && eventLabel && !timerHasStarted) {
      timerStartTimer()
    }
  }, [items.length, eventLabel, timerHasStarted, timerStartTimer])

  // Limpieza automática cuando el timer expira.
  const clear = useCallback(() => {
    setItemsState([])
    setEventLabel(null)
    writeItems([])
    writeEventLabel(null)
    try {
      localStorage.removeItem('cart_checkout')
    } catch {}
    timerResetTimer()
    setIsOpen(false)
  }, [timerResetTimer])

  useEffect(() => {
    if (timerIsExpired && items.length > 0) {
      clear()
    }
  }, [timerIsExpired, items.length, clear])

  const addItem = useCallback(
    (item: CartItem) => {
      setItemsState((prev) => {
        if (prev.some((p) => p.ticketId === item.ticketId)) return prev
        const next = [...prev, item]
        writeItems(next)
        return next
      })
      const nextLabel = item.zoneName
      if (nextLabel && nextLabel !== eventLabel) {
        setEventLabel(nextLabel)
        writeEventLabel(nextLabel)
      }
    },
    [eventLabel]
  )

  const removeItem = useCallback((ticketId: string) => {
    setItemsState((prev) => {
      const next = prev.filter((p) => p.ticketId !== ticketId)
      writeItems(next)
      return next
    })
  }, [])

  const setItems = useCallback((newItems: CartItem[]) => {
    setItemsState(newItems)
    writeItems(newItems)
    const first = newItems[0]
    if (first?.zoneName) {
      setEventLabel(first.zoneName)
      writeEventLabel(first.zoneName)
    } else if (newItems.length === 0) {
      setEventLabel(null)
      writeEventLabel(null)
    }
  }, [])

  const openDrawer = useCallback(() => setIsOpen(true), [])
  const closeDrawer = useCallback(() => setIsOpen(false), [])
  const toggleDrawer = useCallback(() => setIsOpen((s) => !s), [])

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (it.price_base ?? it.price_final ?? 0), 0),
    [items]
  )

  // Pricing REAL de HiEvents: cada item ya trae su fee/tax (de C3). Nada hardcodeado.
  const pricing = useMemo<PricingBreakdown>(() => {
    let sub = 0
    let serviceFee = 0
    let taxes = 0
    for (const it of items) {
      sub += it.price_base ?? it.price_final ?? 0
      serviceFee += Number(it.fee) || 0
      taxes += Number(it.tax) || 0
    }
    const r = (n: number) => Math.round(n * 100) / 100
    return {
      subtotal: r(sub),
      serviceFee: r(serviceFee),
      taxes: r(taxes),
      total: r(sub + serviceFee + taxes)
    }
  }, [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      eventLabel,
      subtotal,
      pricing,
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addItem,
      removeItem,
      setItems,
      clear,
      reloadFromStorage
    }),
    [
      items,
      eventLabel,
      subtotal,
      pricing,
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addItem,
      removeItem,
      setItems,
      clear,
      reloadFromStorage
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextValue => useContext(CartContext)
