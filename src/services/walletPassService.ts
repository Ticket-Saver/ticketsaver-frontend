/**
 * walletPassService — cliente del endpoint que genera el .pkpass de
 * Apple Wallet.
 *
 * El backend hiEvents (`POST /api/apple-pass`) firma el .pkpass con el cert del
 * Pass Type ID de Apple. Mientras no esté deployado/configurado, la feature
 * queda detrás del flag `APPLE_WALLET_ENABLED` y el botón muestra "Coming soon".
 *
 * El env var se setea por entorno:
 *   VITE_APPLE_WALLET_ENABLED=true
 */

import { buildApiUrl } from '../config/api'

export const APPLE_WALLET_ENABLED =
  import.meta.env.VITE_APPLE_WALLET_ENABLED === 'true'

export interface WalletPassPayload {
  ticketId: string
  eventLabel: string
  eventName: string
  venueName: string
  date: string
  time?: string
  seatInfo?: {
    section?: string
    row?: string
    seat?: string
  }
}

export interface WalletPassResult {
  ok: boolean
  passUrl?: string
  error?: string
}

/**
 * Solicita un .pkpass al backend y devuelve una blob URL lista para
 * `window.location.assign()` o un `<a download>`.
 *
 * En iOS Safari, navegar a una URL .pkpass abre la app Wallet con el
 * preview del pase. En otros browsers el archivo se descarga.
 */
export async function requestWalletPass(
  payload: WalletPassPayload
): Promise<WalletPassResult> {
  if (!APPLE_WALLET_ENABLED) {
    return {
      ok: false,
      error: 'Apple Wallet is not enabled in this environment.'
    }
  }
  try {
    const response = await fetch(buildApiUrl('/apple-pass'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      return {
        ok: false,
        error: `Pass server returned ${response.status}.`
      }
    }
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/vnd.apple.pkpass')) {
      // Backend devuelve JSON con `passUrl` listo, o el blob crudo.
      const json = (await response.json()) as { passUrl?: string }
      if (json.passUrl) return { ok: true, passUrl: json.passUrl }
      return { ok: false, error: 'Server response did not include a pass.' }
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return { ok: true, passUrl: url }
  } catch (err) {
    if (import.meta.env.DEV) console.error('[walletPassService]', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}

/**
 * Google Wallet (Android). Análogo a Apple: el backend (`/api/googlePass`)
 * necesita una service account de Google Wallet API server-side. Mientras no
 * esté, queda detrás del flag `GOOGLE_WALLET_ENABLED` y el botón muestra
 * "Coming soon".
 *
 *   VITE_GOOGLE_WALLET_ENABLED=true
 */
export const GOOGLE_WALLET_ENABLED =
  import.meta.env.VITE_GOOGLE_WALLET_ENABLED === 'true'

/**
 * Solicita un pase de Google Wallet y devuelve el "Save" link
 * (https://pay.google.com/gp/v/save/...) para navegar/abrir.
 */
export async function requestGoogleWalletPass(
  payload: WalletPassPayload
): Promise<WalletPassResult> {
  if (!GOOGLE_WALLET_ENABLED) {
    return {
      ok: false,
      error: 'Google Wallet is not enabled in this environment.'
    }
  }
  try {
    const response = await fetch('/api/googlePass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      return { ok: false, error: `Pass server returned ${response.status}.` }
    }
    const json = (await response.json()) as { passUrl?: string; saveUrl?: string }
    const url = json.saveUrl ?? json.passUrl
    if (url) return { ok: true, passUrl: url }
    return { ok: false, error: 'Server response did not include a pass.' }
  } catch (err) {
    if (import.meta.env.DEV) console.error('[walletPassService:google]', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}
