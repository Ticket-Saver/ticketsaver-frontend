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

export type HiImageType = 'EVENT_COVER' | 'EVENT_THUMBNAIL' | 'EVENT_BANNER' | 'EVENT_GALLERY'

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
  // La Location del panel se guarda acá (event_settings), NO en el top-level
  // location_details del evento (ese viene null). Fuente de verdad de venue/ciudad.
  location_details?: HiLocationDetails | null
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
  /** Categoría editorial (Music/Theatre/Comedy/Sports/Family/Other) — custom TicketSaver. */
  category?: string | null
  /** Multi-fecha: id del evento "plantilla" de la serie. null = evento de una sola fecha. */
  series_id?: number | null
  /** Preventa: fecha de inicio (para el cartel). El código NUNCA se expone en público. */
  presale_enabled?: boolean | null
  presale_starts_at?: string | null
  /** true = ventana de preventa abierta ahora (se requiere código para comprar). */
  presale_active?: boolean | null
  /** true = la venta general ya arrancó (compra libre). */
  sales_started?: boolean | null
  /** Inicio de la venta general (ya existía en HiEvents). */
  ticket_sales_start_date?: string | null
  /** Reventa: si el organizador la habilitó para este evento y sus % vigentes. */
  resale_enabled?: boolean | null
  resale_max_price_percent?: number | null
  resale_seller_fee_percent?: number | null
  resale_buyer_fee_percent?: number | null
  /** false = oculto del listado/home; sigue accesible por URL directa. Default true. */
  show_on_web?: boolean | null
  /** Atributos custom PÚBLICos (name/value) — se muestran en "Good to know". */
  attributes?: Array<{ name: string; value: unknown; is_public?: boolean }> | null
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

/** GET /public/events/{id}/tickets?summary=1 — agregados server-side sobre TODOS
 *  los tickets del evento (el listado paginado solo muestra la primera página). */
export interface HiTicketsSummary {
  tickets_count: number
  min_price: number | null
  min_price_including_taxes_and_fees: number | null
  any_available: boolean
  next_sale_start: string | null
  tiers: Array<
    Pick<HiTicketPrice, 'price' | 'price_including_taxes_and_fees' | 'tax_total' | 'fee_total'>
  >
}

export type HiTicketType = 'FREE' | 'PAID' | 'DONATION' | 'TIERED' | 'REGISTRATION'

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
  /** Position crudo del asiento ("balconyright"); `position` viene pisado por seat_number. */
  subZone?: string | null
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

// --- Reventa (marketplace) ---

/** Un listado de reventa propio del vendedor. */
export interface HiResaleListing {
  id: number
  attendee_id: number
  event_id: number
  asking_price: number
  currency: string
  status: 'LISTED' | 'PENDING_PAYMENT' | 'SOLD' | 'CANCELLED' | 'EXPIRED' | string
  created_at?: string
  /** Comisión del vendedor ya calculada por el backend. */
  seller_fee: number
  /** Neto que recibe el vendedor (asking_price - seller_fee). */
  seller_net: number
  /** Estado del payout al vendedor. null = todavía no vendido / no aplica. */
  payout_status: 'PENDING' | 'PAID' | null
}

/** Un listado disponible en el marketplace público de un evento. */
export interface HiResaleMarketListing {
  id: number
  asking_price: number
  buyer_fee: number
  buyer_total: number
  currency: string
  ticket_name: string | null
  seat_label: string | null
}

/** Un evento con reventas activas (marketplace global). */
export interface HiResaleEvent {
  event_id: number
  title: string
  start_date?: string | null
  currency: string
  listing_count: number
  min_price: number
}

/** Porcentajes de reventa vigentes de un evento (para desglose de fees en la UI). */
export interface HiResaleFees {
  resale_enabled: boolean
  seller_fee_percent: number
  buyer_fee_percent: number
  max_price_percent: number
  currency: string
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

/** Curaduría de la Home (GET /public/home-config). */
export interface HiHomeConfig {
  featured_event_ids: number[]
  carousels: Array<{ title: string; event_ids: number[] }>
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
