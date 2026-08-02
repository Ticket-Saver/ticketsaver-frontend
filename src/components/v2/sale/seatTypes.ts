/**
 * Tipos compartidos del seat-picker (C3a). El asiento es el shape que devuelve
 * `GET /public/events/{id}/seats` (TicketSeatResourcePublic) — incluye, desde C3a,
 * el precio con impuestos y el desglose tax/fee (mismos que cobra Stripe).
 */

export interface SeatItem {
  id: number
  event_id: number
  title: string
  position: string
  section: string | null
  row: string
  seat_number: string | number
  price_range: string
  /** Precio NETO del asiento. `null` en el listado masivo del mapa (se trae on-demand). */
  price: number | null
  /** Precio final con impuestos/cargos (lo que cobra Stripe). Solo on-demand (by-seat-ids). */
  price_including_taxes_and_fees?: number | null
  tax_total?: number | null
  fee_total?: number | null
  is_available: boolean
  is_sold_out: boolean
  seat_key: string
  seat_key_alt: string
  status: string
}

/** Payload que el mapa entrega al confirmar la selección de una sección. */
export type ProceedArgs = {
  seats: SeatItem[]
  selectionLabel: string
  row?: string | null
}
