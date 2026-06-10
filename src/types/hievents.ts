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

export interface HiOrder {
  id: number
  short_id: string
  status: string
  payment_status: string
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
