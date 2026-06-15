/**
 * Tipos del schema de HiEvents (panel admin, Laravel).
 * Reflejan las respuestas reales de:
 *   - GET /events                        → { data: HiEventPublic[], meta } (listado, privado con token)
 *   - GET /public/events/{id}            → { data: HiEventPublic }
 *   - GET /public/events/{id}/tickets    → { data: HiTicketPublic[], links, meta }
 *   - GET /public/events/{id}/seating-map
 *   - GET /public/events/{id}/seats
 *
 * En producción estas rutas van bajo /api (vía nginx); en local van directas
 * a localhost:1234 sin prefijo. La diferencia se maneja con VITE_API_BASE_URL.
 */

export interface HiLocationDetails {
  venue_name: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state_or_region: string | null
  zip_or_postal_code: string | null
  country: string | null
}

export interface HiAvailability {
  total: number
  available: number
  sold_out: number
}

export type HiImageType =
  | 'EVENT_COVER'
  | 'EVENT_THUMBNAIL'
  | 'EVENT_BANNER'
  | 'EVENT_GALLERY'

export interface HiImage {
  id: number
  url: string
  size?: number
  file_name?: string
  mime_type?: string
  type: HiImageType
}

export interface HiOrganizer {
  id: number
  name: string
  website: string | null
  description: string | null
}

/**
 * Subconjunto relevante de event.settings. HiEvents expone muchos más campos
 * (homepage colors, SEO, etc.); se mantienen accesibles vía index signature.
 */
export interface HiEventSettings {
  order_timeout_in_minutes: number | null
  price_display_mode: string | null
  support_email: string | null
  website_url: string | null
  maps_url: string | null
  is_online_event: boolean
  [key: string]: unknown
}

export type HiEventStatus = 'DRAFT' | 'LIVE' | 'ARCHIVED'
export type HiLifecycleStatus = 'UPCOMING' | 'ONGOING' | 'ENDED' | string

/**
 * Evento de HiEvents. Sirve tanto para el listado (`GET /events`) como para
 * el detalle público (`GET /public/events/{id}`). Algunos campos solo vienen
 * en uno u otro, por eso están marcados opcionales:
 *   - `availability`, `description_preview`, `gallery` → solo en el detalle público.
 *   - `tipoticket` → solo en el listado privado (custom TicketSaver).
 */
export interface HiEventPublic {
  id: number
  title: string
  description: string | null
  description_preview?: string | null
  /** ISO 8601 en UTC, p.ej. "2026-07-16T01:00:00.000000Z". */
  start_date: string
  end_date: string | null
  currency: string
  slug: string
  status: HiEventStatus
  lifecycle_status: HiLifecycleStatus
  timezone: string
  /** Mapa de asientos: 'map1' | 'map2' | null (custom TicketSaver). */
  map: string | null
  /** 'general' | 'enumerado' (custom TicketSaver, presente en el listado). */
  tipoticket?: string | null
  location_details: HiLocationDetails | null
  availability?: HiAvailability | null
  settings: HiEventSettings | null
  images: HiImage[]
  gallery?: HiImage[]
  organizer: HiOrganizer | null
}

/** Un precio/tier dentro de un ticket. */
export interface HiTicketPrice {
  id: number
  label: string | null
  price: number
  sale_start_date: string | null
  sale_end_date: string | null
  price_including_taxes_and_fees: number
  price_before_discount: number | null
  is_discounted: boolean
  tax_total: number
  fee_total: number
  is_available: boolean
  is_sold_out: boolean
  quantity_remaining: number | null
}

export type HiTicketType =
  | 'FREE'
  | 'PAID'
  | 'DONATION'
  | 'TIERED'
  | 'REGISTRATION'

/** Item de `data` en GET /public/events/{id}/tickets. */
export interface HiTicketPublic {
  id: number
  title: string
  type: HiTicketType
  description: string | null
  max_per_order: number | null
  min_per_order: number | null
  sale_start_date: string | null
  sale_end_date: string | null
  event_id: number
  /** Precio mínimo ya resuelto por la API. */
  price: number
  prices: HiTicketPrice[]
  taxes: unknown[]
  is_available: boolean
  is_sold_out: boolean
}

// --- Seating (se consume en C3) ---

export interface HiSeatingMap {
  event_id: number
  map_type: string | null
  svg_url: string | null
  ranges_url: string | null
  seat_key_format: string | null
}

export interface HiSeat {
  id: number
  event_id: number
  title: string | null
  position: string | null
  section: string | null
  row: string | null
  seat_number: string | null
  price_range: string | null
  /** Precio NETO del asiento (sin impuestos/cargos). */
  price: number | null
  /** Precio final con impuestos/cargos. Expuesto en C3a (TicketSeatResourcePublic). */
  price_including_taxes_and_fees?: number | null
  tax_total?: number | null
  fee_total?: number | null
  is_available: boolean
  is_sold_out: boolean
  seat_key: string | null
  seat_key_alt: string | null
  status: string | null
}

// --- Órdenes (se consumen en C5; tipado mínimo, se refina al portar el checkout) ---

/** Ticket anidado en un attendee (TicketMinimalResourcePublic): trae el asiento. */
export interface HiAttendeeTicket {
  id: number
  title: string | null
  type?: string | null
  event_id?: number
  section?: string | null
  row?: string | null
  seat_number?: string | null
  position?: string | null
  price_range?: string | null
}

/** Asistente emitido (AttendeeResourcePublic). El `public_id` es lo que codifica el QR de check-in. */
export interface HiAttendee {
  id: number
  public_id: string
  short_id?: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  status?: string | null
  ticket_id?: number
  ticket?: HiAttendeeTicket | null
}

export interface HiOrder {
  id: number
  short_id: string
  status: string
  payment_status: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  total_gross?: number
  currency?: string
  reserved_until?: string | null
  is_expired?: boolean
  attendees?: HiAttendee[]
  order_items?: Array<{ item_name?: string; quantity?: number; price?: number }>
  [key: string]: unknown
}

// --- Sobres genéricos de respuesta ---

/** Respuesta { data: T }. */
export interface HiResource<T> {
  data: T
}

/** Respuesta paginada { data: T[], links?, meta? }. */
export interface HiPaginated<T> {
  data: T[]
  links?: unknown
  meta?: unknown
}

/** Parámetros del listado de eventos (GET /events). */
export interface HiEventsListParams {
  page?: number
  per_page?: number
  query?: string
  eventsStatus?: 'upcoming' | 'past' | 'ended' | string
  only_live?: boolean
}

// --- Tickets del usuario (GET /public/user/tickets) ---

export type HiUserTicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED' | string

/** Un ticket emitido del usuario. `ticketId` es el `public_id` (QR + ruta pública). */
export interface HiUserTicket {
  ticketId: string
  zone?: string | null
  section?: string | null
  seatNumber?: string | null
  price?: string | null
  priceType?: string | null
  status: HiUserTicketStatus
}

/** Un evento del usuario con todos sus tickets. `eventIdNumber` es el id numérico de HiEvents. */
export interface HiUserTicketsEvent {
  eventId: string
  eventName: string
  venue?: string | null
  venueId?: string | null
  date?: string | null
  endDate?: string | null
  location?: string | null
  locationDetails?: HiLocationDetails | null
  description?: string | null
  imageUrl?: string | null
  currency?: string | null
  timezone?: string | null
  status?: string | null
  organizer?: HiOrganizer | null
  publicId?: string | null
  eventIdNumber: number
  tickets: HiUserTicket[]
}

/** Respuesta de GET /public/user/tickets (tickets agrupados por evento). */
export interface HiUserTicketsResponse {
  success: boolean
  page?: number
  per_page?: number
  totalEvents: number
  totalTickets: number
  data: HiUserTicketsEvent[]
}

/** Parámetros del endpoint de tickets del usuario. `email` requerido si no hay token. */
export interface HiUserTicketsParams {
  email: string
  status?: HiUserTicketStatus
  from?: string
  to?: string
  venueId?: string
  page?: number
  per_page?: number
}
