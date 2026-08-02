/**
 * Proxy a la API de HiEvents (evita CORS y centraliza el origen del upstream).
 * Portado de `origin/new-version` (front de producción).
 *
 * IMPORTANTE: en DESARROLLO local NO se usa — el front apunta directo a
 * `VITE_API_BASE_URL=http://localhost:1234`. Este proxy es para el DEPLOY:
 * normaliza el path (antepone /api si falta) y reenvía a TICKETSAVER_API_ORIGIN.
 *
 * Aún NO está cableado en netlify.toml (eso se hace en el paso de deploy, junto
 * con el retiro de las funciones Supabase de compra), para no romper las
 * funciones actuales.
 */

// En Netlify (Node 18+) `fetch` es global; evitamos dependencias extra.
const fetch = globalThis.fetch

// Upstream configurable. Default: panel de producción.
const API_ORIGIN = process.env.TICKETSAVER_API_ORIGIN || 'https://panel.ticketsaver.net'

// Token de organizador: solo server-side (nunca en el bundle del front). Setear
// HIEVENTS_ORGANIZER_TOKEN en las env vars de Netlify.
const ORGANIZER_TOKEN = process.env.HIEVENTS_ORGANIZER_TOKEN || ''

// Verificación TLS ACTIVA por defecto (seguro). Solo si el certificado del
// upstream estuviera expirado se puede setear PROXY_INSECURE_TLS=true (NO
// recomendado; saltea la verificación TLS a nivel de proceso para este fetch).
const INSECURE_TLS = String(process.env.PROXY_INSECURE_TLS || '').toLowerCase() === 'true'
const SHOULD_DISABLE_TLS_VERIFY = INSECURE_TLS && API_ORIGIN.startsWith('https://')

exports.handler = async (event) => {
  if (typeof fetch !== 'function') {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Fetch no disponible en el runtime',
        message: 'Asegúrate de usar Node 18+ en Netlify.'
      })
    }
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  // Path tras la función + normalización: soporta /api/... y /events/... (antepone /api si falta).
  const path = event.path.replace('/.netlify/functions/proxy-api', '')
  const queryString = event.rawQuery ? `?${event.rawQuery}` : ''
  const normalizedPath = (() => {
    const p = path && path.startsWith('/') ? path : `/${path || ''}`
    if (p === '/' || p === '') return '/api/'
    if (p.startsWith('/api/')) return p
    return `/api${p}`
  })()
  const url = `${API_ORIGIN}${normalizedPath}${queryString}`

  try {
    const headers = { 'Content-Type': 'application/json' }
    if (event.headers.authorization) {
      // JWT de Supabase del cliente (endpoints /public/... con auth:customer).
      headers['Authorization'] = event.headers.authorization
    } else if (normalizedPath === '/api/events' && ORGANIZER_TOKEN) {
      // ponytail: el token de organizador solo se inyecta en el único endpoint
      // privado que lo necesita (listado /api/events). Inyectarlo en todos haría
      // que endpoints públicos vieran una sesión de organizador (p.ej.
      // /public/user/tickets deriva el email del token si no viene por query).
      headers['Authorization'] = `Bearer ${ORGANIZER_TOKEN}`
    }

    const fetchOptions = { method: event.httpMethod, headers }
    if (event.body && event.httpMethod !== 'GET') fetchOptions.body = event.body

    const prevTlsEnv = process.env.NODE_TLS_REJECT_UNAUTHORIZED
    if (SHOULD_DISABLE_TLS_VERIFY) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const response = await fetch(url, fetchOptions)
    if (SHOULD_DISABLE_TLS_VERIFY) {
      if (typeof prevTlsEnv === 'undefined') delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
      else process.env.NODE_TLS_REJECT_UNAUTHORIZED = prevTlsEnv
    }

    const data = await response.text()
    let responseBody
    try {
      responseBody = JSON.parse(data)
    } catch (e) {
      responseBody = data
    }

    return {
      statusCode: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
    }
  } catch (error) {
    const causeCode = error?.cause?.code
    const isCertExpired =
      causeCode === 'CERT_HAS_EXPIRED' || /certificate has expired/i.test(error?.cause?.message || '')

    return {
      statusCode: isCertExpired ? 502 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Error al conectar con la API',
        message: error.message,
        ...(isCertExpired
          ? {
              details:
                'El certificado TLS del upstream está expirado. Renueva el certificado o, como medida temporal, setea PROXY_INSECURE_TLS=true (no recomendado).',
              causeCode
            }
          : { causeCode })
      })
    }
  }
}
