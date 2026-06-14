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
  HiAttendee,
  HiResource,
  HiPaginated,
  HiEventsListParams
} from '../types/hievents'

/** Precio + impuestos de un asiento, traído on-demand vía /tickets/by-seat-ids. */
export interface HiSeatPricing {
  id: number
  price: number
  price_including_taxes_and_fees: number | null
  tax_total: number | null
  fee_total: number | null
  /** Price tiers del asiento — el primero es el price_id que usa la orden. */
  prices?: Array<{ id: number; price: number }>
}

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
    // SIN group: el backend pagina y `data` es un ARRAY → concatenamos páginas.
    // CON ?group=: el backend devuelve los asientos AGRUPADOS POR FILA y sin paginar
    // (`data` = { "E": [...], "F": [...] }) → hay que aplanar ese objeto. (Sin esto,
    // hacer spread de un objeto rompía la carga por sección — ni hover ni click.)
    const all: HiSeat[] = []
    let page = 1
    let lastPage = 1
    do {
      const path = `/public/events/${eventId}/seats${toQuery({ group, per_page: 1000, page })}`
      const body = await getJson<HiPaginated<HiSeat> | HiSeat[]>(path, signal)
      if (Array.isArray(body)) {
        all.push(...body)
        break
      }
      const data = body.data as unknown
      if (Array.isArray(data)) {
        all.push(...(data as HiSeat[]))
      } else if (data && typeof data === 'object') {
        // Respuesta agrupada por fila (?group=): aplanar y no paginar.
        for (const rowSeats of Object.values(data as Record<string, HiSeat[]>)) {
          if (Array.isArray(rowSeats)) all.push(...rowSeats)
        }
        break
      }
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

  /**
   * Precio + impuestos de asientos específicos (los de una sección / los seleccionados).
   * El mapa masivo (/seats) NO trae el precio por performance; este endpoint lo calcula
   * solo para los pocos asientos que importan (~150 de una sección en <0.6s). Devuelve
   * [] si no hay ids.
   */
  async getTicketsBySeatIds(
    eventId: string | number,
    seatIds: number[],
    signal?: AbortSignal
  ): Promise<HiSeatPricing[]> {
    if (seatIds.length === 0) return []
    const body = await request<{ tickets?: HiSeatPricing[] }>(
      'POST',
      HIEVENTS_CONFIG.endpoints.ticketsBySeatIds(eventId),
      { seat_ids: seatIds },
      signal
    )
    return body.tickets ?? []
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

  /** Attendee emitido por public_id — para la ticketera pública (QR real). */
  async getAttendee(eventId: string | number, publicId: string, signal?: AbortSignal): Promise<HiAttendee> {
    const body = await getJson<HiResource<HiAttendee>>(
      HIEVENTS_CONFIG.endpoints.attendee(eventId, publicId),
      signal
    )
    return body.data
  },

  async getUserTickets(signal?: AbortSignal): Promise<unknown> {
    return getJson(HIEVENTS_CONFIG.endpoints.userTickets(), signal)
  }
}

export default hiEventsService
