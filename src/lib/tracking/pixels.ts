/**
 * Pixeles de marketing POR EVENTO (Meta/YouTube) que cargan los organizadores.
 * No confundir con analítica propia de TicketSaver (fuera de este alcance).
 *
 * Cada evento comercial trae su propio meta_pixel_id/youtube_pixel_id (ver
 * hiEventsAdapter). Estas funciones son no-op si el evento no tiene pixel
 * configurado, así que es seguro llamarlas siempre.
 *
 * CONSENTIMIENTO: ningún script de terceros se carga sin consentimiento de
 * "marketing" (ver src/lib/consent/cookieConsent.ts) — no es solo informar
 * después, el script ni siquiera se inyecta en el DOM hasta que el usuario
 * acepta. Sin decisión tomada, o con "rechazar", estas funciones no hacen nada.
 */
import { hasMarketingConsent } from '../consent/cookieConsent'

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] }
    _fbq?: unknown
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let metaLoaderInjected = false

const ensureMetaPixelLoader = (): void => {
  if (metaLoaderInjected || typeof window === 'undefined') return
  metaLoaderInjected = true
  if (window.fbq) return
  const n: Window['fbq'] = Object.assign(
    function (...args: unknown[]) {
      const self = window.fbq as unknown as {
        callMethod?: (...a: unknown[]) => void
        queue: unknown[][]
      }
      if (self.callMethod) self.callMethod(...args)
      else self.queue.push(args)
    },
    { queue: [] as unknown[][], loaded: true, version: '2.0' }
  )
  window.fbq = n
  window._fbq = n
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(script, first)
}

/** Dispara un evento de Meta Pixel para el `pixelId` del evento. No-op si no hay id. */
export const trackMetaPixel = (
  pixelId: string | null | undefined,
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (!pixelId || typeof window === 'undefined' || !hasMarketingConsent()) return
  ensureMetaPixelLoader()
  window.fbq?.('init', pixelId)
  if (params) window.fbq?.('track', eventName, params)
  else window.fbq?.('track', eventName)
}

const gtagLoadedIds = new Set<string>()

const ensureGtagLoader = (trackingId: string): void => {
  if (typeof window === 'undefined' || gtagLoadedIds.has(trackingId)) return
  gtagLoadedIds.add(trackingId)
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer?.push(args)
    }
  window.gtag('js', new Date())
  // send_page_view en false: el `page_view` inicial se manda explícitamente
  // desde trackGooglePixel, igual que las demás páginas de esta SPA.
  window.gtag('config', trackingId, { send_page_view: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`
  document.head.appendChild(script)
}

/** Dispara un evento de Google/YouTube Ads para el `trackingId` del evento. No-op si no hay id. */
export const trackGooglePixel = (
  trackingId: string | null | undefined,
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (!trackingId || typeof window === 'undefined' || !hasMarketingConsent()) return
  ensureGtagLoader(trackingId)
  window.gtag?.('event', eventName, params ?? {})
}
