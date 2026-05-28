/**
 * walletPassService — cliente del endpoint que genera el .pkpass de
 * Apple Wallet.
 *
 * El backend (Netlify Function `/api/applePass`) requiere certificado
 * Apple Developer + Pass Type ID configurado server-side. Mientras el
 * cliente no provea esas credenciales, mantenemos la feature detrás del
 * flag `APPLE_WALLET_ENABLED` y mostramos "Coming soon" en el botón.
 *
 * El env var se setea por entorno:
 *   VITE_APPLE_WALLET_ENABLED=true
 */

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
    const response = await fetch('/api/applePass', {
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
