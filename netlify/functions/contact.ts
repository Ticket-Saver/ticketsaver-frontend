import type { Handler } from '@netlify/functions'

/**
 * contact — recibe el formulario de contacto del sitio.
 *
 * Placeholder: valida el payload y responde 200. Para envío real de
 * email, conectar SendGrid / Resend acá usando una API key en las env
 * vars de Netlify (CONTACT_EMAIL_TO, SENDGRID_API_KEY, etc.).
 */

interface ContactBody {
  name?: string
  email?: string
  topic?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let body: ContactBody
  try {
    body = JSON.parse(event.body ?? '{}') as ContactBody
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { name, email, topic, message } = body
  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: 'Missing or invalid fields' })
    }
  }

  // TODO: enviar email real.
  // await sendEmail({ to: process.env.CONTACT_EMAIL_TO, subject: `[${topic}] from ${name}`, text: message, replyTo: email })
  console.log('[contact] new message', { name, email, topic })

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  }
}
