/**
 * Consentimiento de cookies (banner + panel de configuración). Categorías:
 *  - necessary: siempre activas (sesión de compra, carrito, login). No se pide permiso.
 *  - analytics: analítica propia de TicketSaver (a futuro, GA4).
 *  - marketing: pixeles de tracking (Meta/YouTube) de cada organizador — ver
 *    src/lib/tracking/pixels.ts, que consulta `hasMarketingConsent()` antes de
 *    cargar cualquier script de terceros. Sin consentimiento, esos pixeles NO
 *    se cargan (no solo "se informa después" — se bloquean de verdad).
 *
 * Persistido en localStorage. Pub/sub simple para que el banner y los hooks
 * de tracking reaccionen al mismo cambio sin pasar por contexto de React.
 */

export interface ConsentState {
  analytics: boolean
  marketing: boolean
  /** true una vez que el usuario tomó una decisión (aceptar/rechazar/guardar). */
  decided: boolean
}

const STORAGE_KEY = 'ts_cookie_consent_v1'
const DEFAULT_STATE: ConsentState = { analytics: false, marketing: false, decided: false }

type Listener = (state: ConsentState) => void
const listeners = new Set<Listener>()

const readStored = (): ConsentState => {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      decided: !!parsed.decided
    }
  } catch {
    return DEFAULT_STATE
  }
}

let state: ConsentState = readStored()

const persist = (next: ConsentState): void => {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // localStorage no disponible (modo privado, etc.) — el consentimiento no
    // persiste entre recargas, pero la sesión actual funciona igual.
  }
  listeners.forEach((fn) => fn(state))
}

export const getConsent = (): ConsentState => state

export const hasAnalyticsConsent = (): boolean => state.decided && state.analytics

export const hasMarketingConsent = (): boolean => state.decided && state.marketing

export const subscribeConsent = (fn: Listener): (() => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const acceptAllConsent = (): void =>
  persist({ analytics: true, marketing: true, decided: true })

export const rejectNonEssentialConsent = (): void =>
  persist({ analytics: false, marketing: false, decided: true })

export const saveConsent = (partial: { analytics: boolean; marketing: boolean }): void =>
  persist({ ...partial, decided: true })

// --- Reabrir el panel de configuración (link "Cookies" del footer) ---
const REOPEN_EVENT = 'ts:reopen-cookie-settings'

export const requestReopenCookieSettings = (): void => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(REOPEN_EVENT))
}

export const onReopenCookieSettings = (fn: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(REOPEN_EVENT, fn)
  return () => window.removeEventListener(REOPEN_EVENT, fn)
}
