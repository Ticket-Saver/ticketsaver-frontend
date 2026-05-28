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

  /** Ruta interna a la página de detalle (B3 la reemplazará). */
  detailHref: string

  /** Referencias originales por si un componente las necesita. */
  raw: Event
  rawVenue?: Venue
}
