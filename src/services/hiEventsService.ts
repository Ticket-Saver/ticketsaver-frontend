/**
 * Cliente de la API de HiEvents.
 *
 * Capa fina sobre fetch: arma las URLs con `buildApiUrl`, agrega el token
 * Bearer si está configurado, parsea JSON y normaliza errores en
 * `HiEventsApiError`. No contiene lógica de UI ni de adaptación a UIEvent
 * (eso vive en el adapter de C1).
 *
 * - Catálogo y detalle se usan desde C1/C2.
 * - Mapa/asientos desde C3. Órdenes/checkout desde C5.
 */

import { HIEVENTS_CONFIG, buildApiUrl, toQuery } from '../config/api'
import type {
  HiEventPublic,
  HiTicketPublic,
  HiSeatingMap,
  HiSeat,
  HiOrder,
  HiResource,
  HiPaginated,
  HiEventsListParams
} from '../types/hievents'

export class HiEventsApiError extends Error {
  readonly status: number
  readonly path: string
  constructor(status: number, path: string, message?: string) {
    super(message ?? `HiEvents API respondió ${status} en ${path}`)
    this.name = 'HiEventsApiError'
    this.status = status
    this.path = path
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const buildHeaders = (hasBody: boolean): Record<string, string> => {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (hasBody) headers['Content-Type'] = 'application/json'
  if (HIEVENTS_CONFIG.token) headers.Authorization = `Bearer ${HIEVENTS_CONFIG.token}`
  return headers
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  let res: Response
  try {
    res = await fetch(buildApiUrl(path), {
      method,
      headers: buildHeaders(body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal
    })
  } catch (err) {
    // Error de red / CORS / DNS — no llegó respuesta.
    throw new HiEventsApiError(0, path, `Fallo de red hacia HiEvents en ${path}: ${(err as Error).message}`)
  }
  if (!res.ok) {
    throw new HiEventsApiError(res.status, path)
  }
  // 204 / cuerpos vacíos
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

const getJson = <T>(path: string, signal?: AbortSignal) => request<T>('GET', path, undefined, signal)

export const hiEventsService = {
  // --- Catálogo (C1) ---

  /** Listado de eventos (privado, requiere token). Devuelve los eventos LIVE upcoming por defecto. */
  async listEvents(params: HiEventsListParams = {}, signal?: AbortSignal): Promise<HiEventPublic[]> {
    const query = toQuery({
      page: params.page ?? 1,
      per_page: params.per_page ?? 50,
      query: params.query ?? '',
      eventsStatus: params.eventsStatus ?? 'upcoming',
      only_live: params.only_live ?? true
    })
    const body = await getJson<HiPaginated<HiEventPublic>>(`${HIEVENTS_CONFIG.endpoints.events()}${query}`, signal)
    return body.data
  },

  /** Detalle público de un evento (sin tickets inline). */
  async getEvent(eventId: string | number, signal?: AbortSignal): Promise<HiEventPublic> {
    const body = await getJson<HiResource<HiEventPublic>>(
      HIEVENTS_CONFIG.endpoints.publicEvent(eventId),
      signal
    )
    return body.data
  },

  /**
   * Tickets y precios de un evento. Pide hasta 100 por página (un general puede
   * tener muchos tipos). No pagina de más a propósito: en un enumerado los asientos
   * también son "tickets" y traerlos todos acá sería pesado (el detalle solo necesita
   * una muestra para el "desde $"). Si un general supera 100 tipos, ver deuda técnica.
   */
  async getTickets(eventId: string | number, signal?: AbortSignal): Promise<HiTicketPublic[]> {
    const body = await getJson<HiPaginated<HiTicketPublic>>(
      `${HIEVENTS_CONFIG.endpoints.eventTickets(eventId)}${toQuery({ per_page: 100 })}`,
      signal
    )
    return body.data
  },

  // --- Mapa de asientos (C3) ---

  async getSeatingMap(eventId: string | number, signal?: AbortSignal): Promise<HiSeatingMap> {
    const body = await getJson<HiResource<HiSeatingMap> | HiSeatingMap>(
      HIEVENTS_CONFIG.endpoints.seatingMap(eventId),
      signal
    )
    return (body as HiResource<HiSeatingMap>).data ?? (body as HiSeatingMap)
  },

  async getSeats(eventId: string | number, group?: string, signal?: AbortSignal): Promise<HiSeat[]> {
    // El backend pagina /seats (per_page máx 100). El mapa necesita TODOS los
    // asientos, así que iteramos las páginas y las concatenamos.
    const all: HiSeat[] = []
    let page = 1
    let lastPage = 1
    do {
      const path = `/public/events/${eventId}/seats${toQuery({ group, per_page: 100, page })}`
      const body = await getJson<HiPaginated<HiSeat> | HiSeat[]>(path, signal)
      if (Array.isArray(body)) {
        all.push(...body)
        break
      }
      all.push(...(body.data ?? []))
      const meta = body.meta as { last_page?: number } | undefined
      lastPage = meta?.last_page ?? 1
      page++
    } while (page <= lastPage)
    return all
  },

  async getSeatsAvailabilityGroup(
    eventId: string | number,
    group: string,
    signal?: AbortSignal
  ): Promise<{ total: number; available: number; price?: number }> {
    return getJson(HIEVENTS_CONFIG.endpoints.seatsAvailabilityGroup(eventId, group), signal)
  },

  // --- Órdenes / checkout (C5; firmas listas, payloads se refinan al portar el checkout) ---

  async createOrder(eventId: string | number, payload: unknown): Promise<HiOrder> {
    const body = await request<HiResource<HiOrder>>('POST', HIEVENTS_CONFIG.endpoints.order(eventId), payload)
    return body.data
  },

  async getTicketsBySeatIds(eventId: string | number, seatIds: number[]): Promise<unknown> {
    return request('POST', HIEVENTS_CONFIG.endpoints.ticketsBySeatIds(eventId), { seat_ids: seatIds })
  },

  async updateOrder(eventId: string | number, shortId: string, payload: unknown): Promise<HiOrder> {
    const body = await request<HiResource<HiOrder>>('PUT', HIEVENTS_CONFIG.endpoints.orderByShortId(eventId, shortId), payload)
    return body.data
  },

  async createStripeCheckoutSession(
    eventId: string | number,
    shortId: string,
    payload: unknown
  ): Promise<{ checkout_url?: string; client_secret?: string; [key: string]: unknown }> {
    const body = await request<HiResource<{ checkout_url?: string; client_secret?: string }>>(
      'POST',
      HIEVENTS_CONFIG.endpoints.stripeCheckoutSession(eventId, shortId),
      payload
    )
    return body.data
  },

  async confirmPayment(eventId: string | number, shortId: string, sessionId: string): Promise<HiOrder> {
    const body = await request<HiResource<HiOrder>>(
      'POST',
      HIEVENTS_CONFIG.endpoints.confirmPayment(eventId, shortId),
      { session_id: sessionId }
    )
    return body.data
  },

  async getOrder(eventId: string | number, shortId: string, signal?: AbortSignal): Promise<HiOrder> {
    const body = await getJson<HiResource<HiOrder>>(HIEVENTS_CONFIG.endpoints.orderByShortId(eventId, shortId), signal)
    return body.data
  },

  async getUserTickets(signal?: AbortSignal): Promise<unknown> {
    return getJson(HIEVENTS_CONFIG.endpoints.userTickets(), signal)
  }
}

export default hiEventsService
