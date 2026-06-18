import type { CoverKey } from '../lib/covers/palettes'
import type { Event } from '../router/eventsContext'
import type { Venue } from '../router/venuesContext'

export type Availability = 'available' | 'few-left' | 'selling-fast' | 'sold-out'

export type Category = 'Music' | 'Theatre' | 'Comedy' | 'Sports' | 'Family' | 'Other'

export type CategoryFilter = 'All' | Category

export interface UIEvent {
  /** event_label — identificador canónico y stable para hash/cover. */
  id: string
  eventId: string
  title: string
  /** "Brooklyn Steel · Brooklyn" — usado debajo del título. */
  subtitle: string
  category: Category

  // Date breakdown derivado del ISO `event_date` + `event_hour`
  /** ISO `YYYY-MM-DD`. */
  isoDate: string
  /** "Mon" */
  day: string
  /** 1–31 */
  date: number
  /** "Jun" */
  month: string
  year: number
  /** "8:00 PM" */
  time: string
  /** Date completo (event_date + event_hour) — usado para ordenar/filtrar. */
  startsAt: Date

  // Venue
  venueLabel: string
  venueName: string
  city: string
  country: string
  mapsUrl?: string

  /** Hash determinista del event_label → paleta nebula/inferno/aqua/etc. */
  cover: CoverKey
  /** URL de la imagen real del evento (HiEvents). Si existe, se usa en vez del cover procedural. */
  imageUrl?: string

  /** Precio mínimo en USD; null si aún no se cargó zonePriceList. */
  priceFrom: number | null
  availability: Availability

  /** Tags computados ("Tonight", "Weekend", "Late night", etc.). */
  tags: string[]
  /** Marcado como featured en el hero carousel. */
  hero: boolean
  /** Primera frase de descripción — el B3 la usa en el detalle. */
  vibe?: string

  /** Si el evento tiene `tricket_url`, se abre en una pestaña nueva. */
  ticketUrl?: string
  isExternal: boolean
  /** Marcado en el legacy hiddenEventLabels (se filtra en la UI). */
  hidden: boolean
  /** Pasado o cancelado (no se muestra en listings). */
  expired: boolean
  /** Evento high-demand: el flujo pasa por /queue antes de /sale. */
  requiresQueue: boolean
  /** Mapa de asientos de HiEvents ('map1'|'map2'). Presente ⇒ evento enumerado (asientos); ausente/null ⇒ general. */
  map?: string | null

  /**
   * Multi-fecha: id del evento "plantilla" de la serie. Todas las funciones del
   * mismo evento comparten este valor. null/undefined ⇒ evento de una sola fecha.
   * Se usa para agrupar fechas en el selector (en vez de la heurística por título).
   */
  seriesId?: number | null

  /**
   * Preventa con código de acceso. El código nunca llega al front; solo el estado.
   * - active: ventana de preventa abierta ahora → al comprar se exige el código.
   * - salesStarted: la venta general ya arrancó → compra libre.
   */
  presale?: {
    enabled: boolean
    startsAt: string | null
    active: boolean
    salesStarted: boolean
    generalSaleAt: string | null
  }

  /** Ruta interna a la página de detalle (B3 la reemplazará). */
  detailHref: string

  /** Referencias originales por si un componente las necesita. */
  raw: Event
  rawVenue?: Venue
}
