/**
 * Configuración de acceso a la API de HiEvents (panel admin).
 *
 * `VITE_API_BASE_URL` define la base sin el segmento de ruta:
 *   - DEV local:  http://localhost:1234       → `${base}/events`, `${base}/public/events/1`
 *   - PROD:       /.netlify/functions/proxy-api → el proxy normaliza agregando
 *                 /api → panel.ticketsaver.net/api/events, .../api/public/events/1
 *
 * Así la construcción de rutas es idéntica en ambos entornos; solo cambia la base.
 * El listado (`/events`) es PRIVADO y requiere `VITE_TOKEN_HIEVENTS` (token de
 * organizador). Los endpoints `/public/...` NO requieren token.
 */

const RAW_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined
const API_BASE_URL = (RAW_BASE && RAW_BASE.trim() ? RAW_BASE : 'http://localhost:1234').replace(/\/+$/, '')

const RAW_TOKEN = import.meta.env.VITE_TOKEN_HIEVENTS as string | undefined
const API_TOKEN = RAW_TOKEN && RAW_TOKEN.trim() ? RAW_TOKEN.trim() : undefined

export const HIEVENTS_CONFIG = {
  baseUrl: API_BASE_URL,
  /** Bearer token. Requerido por el listado privado `/events`. */
  token: API_TOKEN,
  endpoints: {
    // --- Catálogo ---
    /** Listado privado de eventos (requiere token). */
    events: () => `/events`,
    /** Detalle público de un evento. */
    publicEvent: (eventId: string | number) => `/public/events/${eventId}`,
    /** Valida un código de preventa (público). */
    presaleValidate: (eventId: string | number, code: string) =>
      `/public/events/${eventId}/presale/${encodeURIComponent(code)}`,
    eventTickets: (eventId: string | number) => `/public/events/${eventId}/tickets`,

    // --- Mapa de asientos (C3) ---
    seatingMap: (eventId: string | number) => `/public/events/${eventId}/seating-map`,
    seats: (eventId: string | number, group?: string) =>
      `/public/events/${eventId}/seats${group ? `?group=${encodeURIComponent(group)}` : ''}`,
    seatsAvailabilityGroup: (eventId: string | number, group: string) =>
      `/public/events/${eventId}/seats/availability/group?group=${encodeURIComponent(group)}`,

    // --- Órdenes / checkout (C5) ---
    order: (eventId: string | number) => `/public/events/${eventId}/order`,
    orderByShortId: (eventId: string | number, shortId: string) =>
      `/public/events/${eventId}/order/${shortId}`,
    ticketsBySeatIds: (eventId: string | number) =>
      `/public/events/${eventId}/tickets/by-seat-ids`,
    stripeCheckoutSession: (eventId: string | number, shortId: string) =>
      `/public/events/${eventId}/order/${shortId}/stripe/checkout_session`,
    confirmPayment: (eventId: string | number, shortId: string) =>
      `/public/events/${eventId}/order/${shortId}/confirm_payment`,

    // --- Attendee / ticketera pública ---
    /** Attendee público por public_id (el backend busca por PUBLIC_ID pese al nombre del param de ruta). */
    attendee: (eventId: string | number, publicId: string) =>
      `/public/events/${eventId}/attendees/${publicId}`,

    // --- Usuario ---
    userTickets: () => `/public/user/tickets`,

    // --- Curaduría de la Home (Admin TicketSaver) ---
    homeConfig: () => `/public/home-config`
  }
}

/** Construye la URL absoluta a partir de un path que empieza con `/`. */
export const buildApiUrl = (path: string): string =>
  `${HIEVENTS_CONFIG.baseUrl}${path.startsWith('/') ? path : `/${path}`}`

/** Serializa un objeto a query string, omitiendo undefined/null/''. */
export const toQuery = (params: Record<string, unknown>): string => {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue
    usp.append(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ''
}

export default HIEVENTS_CONFIG
