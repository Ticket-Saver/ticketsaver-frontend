/**
 * contactFormService — envío del formulario de contacto.
 *
 * Hace POST a la Netlify Function `/.netlify/functions/contact`. Esa
 * función reenvía a email (SendGrid / Resend) una vez que el cliente
 * configure las credenciales server-side. En dev (sin functions
 * corriendo) devolvemos un ok simulado para no bloquear la UI.
 */

export interface ContactPayload {
  name: string
  email: string
  topic: string
  message: string
}

export interface ContactResult {
  ok: boolean
  error?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateContact = (
  payload: Partial<ContactPayload>
): string | null => {
  if (!payload.name || payload.name.trim().length < 2)
    return 'Please enter your name.'
  if (!payload.email || !EMAIL_RE.test(payload.email))
    return 'Please enter a valid email.'
  if (!payload.message || payload.message.trim().length < 10)
    return 'Tell us a bit more (at least 10 characters).'
  return null
}

export async function sendContactForm(
  payload: ContactPayload
): Promise<ContactResult> {
  try {
    const response = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      // 404 en dev (function no levantada) → simulamos éxito.
      if (response.status === 404 && import.meta.env.DEV) {
        console.warn(
          '[contactFormService] /.netlify/functions/contact 404 en dev — simulando envío.'
        )
        return { ok: true }
      }
      return { ok: false, error: `Server returned ${response.status}.` }
    }
    return { ok: true }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[contactFormService] network error en dev — simulando envío.', err)
      return { ok: true }
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}
