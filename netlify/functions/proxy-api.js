/**
 * Función proxy para evitar problemas de CORS con la API externa
 * Redirige todas las peticiones a la API de ticketsaver
 */

// Intentar usar fetch nativo o importar node-fetch
let fetch
try {
  fetch = globalThis.fetch || require('node-fetch')
} catch (e) {
  // En Node 18+ fetch es global
  fetch = globalThis.fetch
}

// Configuración del upstream:
// - TICKETSAVER_API_ORIGIN: ej. https://ticketsaverapi.strangled.net
// - PROXY_INSECURE_TLS: 'true' para saltar verificación TLS (SOLO emergencia; deshabilitado por defecto)
const API_ORIGIN = process.env.TICKETSAVER_API_ORIGIN || 'https://ticketsaverapi.strangled.net'
const INSECURE_TLS = String(process.env.PROXY_INSECURE_TLS || '').toLowerCase() === 'true'

// Helpers: dispatcher/agent para TLS inseguro (cuando el upstream tiene cert expirado)
let insecureDispatcher
let insecureHttpsAgent
if (INSECURE_TLS && API_ORIGIN.startsWith('https://')) {
  try {
    // undici: usado por fetch nativo de Node 18+
    const { Agent } = require('undici')
    insecureDispatcher = new Agent({ connect: { rejectUnauthorized: false } })
  } catch (e) {
    // no-op
  }
  try {
    // node-fetch: usa https.Agent
    const https = require('https')
    insecureHttpsAgent = new https.Agent({ rejectUnauthorized: false })
  } catch (e) {
    // no-op
  }
}

exports.handler = async (event, context) => {
  // Headers CORS comunes
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    }
  }

  // Extraer la ruta y parámetros de la petición
  const path = event.path.replace('/.netlify/functions/proxy-api', '')
  const queryString = event.rawQuery ? `?${event.rawQuery}` : ''
  // Normalizar path: soporta llamadas tanto a /api/... como a /events/... (se prefija /api si falta)
  const normalizedPath = (() => {
    const p = path && path.startsWith('/') ? path : `/${path || ''}`
    if (p === '/' || p === '') return '/api/'
    if (p.startsWith('/api/')) return p
    return `/api${p}`
  })()
  const url = `${API_ORIGIN}${normalizedPath}${queryString}`

  console.log('Proxy request:', {
    method: event.httpMethod,
    path,
    url,
    headers: event.headers
  })

  try {
    // Preparar headers para la petición
    const headers = {
      'Content-Type': 'application/json'
    }

    // Si hay token de autenticación, pasarlo
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization
    }

    // Preparar opciones para fetch
    const fetchOptions = {
      method: event.httpMethod,
      headers: headers
    }

    // Si hay body en la petición, agregarlo
    if (event.body && event.httpMethod !== 'GET') {
      fetchOptions.body = event.body
    }

    // TLS inseguro (SOLO si PROXY_INSECURE_TLS=true)
    // - fetch nativo (undici) usa "dispatcher"
    // - node-fetch usa "agent"
    if (INSECURE_TLS) {
      if (insecureDispatcher) fetchOptions.dispatcher = insecureDispatcher
      if (insecureHttpsAgent) fetchOptions.agent = insecureHttpsAgent
    }

    // Hacer la petición a la API externa
    const response = await fetch(url, fetchOptions)
    const data = await response.text()

    // Intentar parsear como JSON
    let responseBody
    try {
      responseBody = JSON.parse(data)
    } catch (e) {
      responseBody = data
    }

    console.log('Proxy response:', {
      status: response.status,
      ok: response.ok
    })

    // Devolver la respuesta con headers CORS apropiados
    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
    }
  } catch (error) {
    console.error('Proxy error:', error)

    const causeCode = error?.cause?.code
    const isCertExpired = causeCode === 'CERT_HAS_EXPIRED' || /certificate has expired/i.test(error?.cause?.message || '')

    return {
      statusCode: isCertExpired ? 502 : 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Error al conectar con la API',
        message: error.message,
        ...(isCertExpired
          ? {
              details:
                'El certificado TLS del upstream está expirado. Renueva el certificado del dominio del API o configura TICKETSAVER_API_ORIGIN a un dominio con certificado válido. Como medida temporal, puedes setear PROXY_INSECURE_TLS=true (no recomendado).',
              causeCode
            }
          : { causeCode })
      })
    }
  }
}
