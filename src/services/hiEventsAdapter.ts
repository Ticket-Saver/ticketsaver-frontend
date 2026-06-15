/**
 * Adapter HiEvents → UIEvent.
 *
 * Produce EXACTAMENTE el mismo `UIEvent` que `eventAdapter.ts` (el de GitHub),
 * para que la UI v2, las rutas y todos los consumidores de `event.raw` /
 * `event.venueLabel` sigan funcionando sin cambios. La clave es que `raw` se
 * rellena con un `Event` sintético (schema viejo) construido desde HiEvents.
 *
 * Diferencias respecto al adapter de GitHub:
 *  - `id` = slug de HiEvents (identificador canónico para routing/cover/lookup).
 *  - `eventId` = id numérico de HiEvents en string (lo necesita C3+ para la API).
 *  - venue/subtitle salen de `location_details` (HiEvents no tiene venues aparte).
 *  - `vibe` ← `description_preview` real (antes quedaba undefined).
 *
 * Heurísticas que se MANTIENEN (HiEvents no las provee): category, tags, hero,
 * cover, availability (el listado no trae availability ni precio).
 */

import type { Event } from '../router/eventsContext'
import type { Availability, Category, UIEvent } from '../types/uiEvent'
import type { HiEventPublic, HiImage, HiUserTicketsEvent } from '../types/hievents'
import { coverHash } from '../lib/covers/coverHash'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
const HERO_LIMIT = 5

const djb2 = (input: string): number => {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const CATEGORY_KEYWORDS: ReadonlyArray<{ kw: RegExp; cat: Category }> = [
  { kw: /comedy|standup|stand-up|laugh/i, cat: 'Comedy' },
  { kw: /theatre|theater|broadway|musical|opera|ballet/i, cat: 'Theatre' },
  { kw: /sports?|game|nba|nfl|mlb|soccer|f[uú]tbol|boxing|ufc|hockey/i, cat: 'Sports' },
  { kw: /family|kids|child|disney|nick/i, cat: 'Family' }
]

const inferCategory = (title: string): Category => {
  for (const { kw, cat } of CATEGORY_KEYWORDS) {
    if (kw.test(title)) return cat
  }
  return 'Music'
}

const VALID_CATEGORIES: readonly Category[] = [
  'Music', 'Theatre', 'Comedy', 'Sports', 'Family', 'Other'
]

/**
 * Categoría REAL de HiEvents (Fase 6.2) si viene y es válida; si no, cae a la
 * heurística por título. Así el organizador la controla desde el admin y deja
 * de inventarse en el front.
 */
const resolveCategory = (raw: string | null | undefined, title: string): Category =>
  raw && (VALID_CATEGORIES as readonly string[]).includes(raw)
    ? (raw as Category)
    : inferCategory(title)

const inferAvailability = (key: string): Availability => {
  // El listado de HiEvents no trae disponibilidad; heurística determinista por
  // slug hasta que el detalle (C2) la traiga real desde availability/tickets.
  const bucket = djb2(key) % 100
  if (bucket < 60) return 'available'
  if (bucket < 80) return 'few-left'
  if (bucket < 95) return 'selling-fast'
  return 'sold-out'
}

const inferTags = (startsAt: Date, category: Category): string[] => {
  if (Number.isNaN(startsAt.getTime())) return [category]
  const tags: string[] = []
  const now = new Date()
  const dayMs = 24 * 60 * 60 * 1000
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventStartOfDay = new Date(startsAt.getFullYear(), startsAt.getMonth(), startsAt.getDate())
  const diffDays = Math.round((eventStartOfDay.getTime() - startOfDay.getTime()) / dayMs)
  if (diffDays === 0) tags.push('Tonight')
  else if (diffDays === 1) tags.push('Tomorrow')
  else if (diffDays > 1 && diffDays <= 7) tags.push('This week')
  const day = startsAt.getDay()
  if (day === 0 || day === 6) tags.push('Weekend')
  const hour = startsAt.getHours()
  if (hour >= 22 || hour < 4) tags.push('Late night')
  tags.push(category)
  return Array.from(new Set(tags))
}

/** slug simple para venue_label sintético (estable por nombre de venue). */
const slugify = (s: string): string =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Imagen para las cards: thumbnail > cover > banner > primera disponible. */
const pickCardImage = (images: HiImage[]): string | undefined => {
  const byType = (t: string) => images.find((i) => i.type === t)?.url
  return (
    byType('EVENT_THUMBNAIL') ||
    byType('EVENT_COVER') ||
    byType('EVENT_BANNER') ||
    images[0]?.url
  )
}

interface DateParts {
  isoDate: string
  day: string
  date: number
  month: string
  year: number
  time: string
  hour24: string
  startsAt: Date
}

/**
 * Convierte el `start_date` (ISO UTC) a los componentes de fecha/hora en la
 * timezone del evento, usando Intl. `startsAt` queda como instante (para ordenar).
 */
const toDateParts = (startDate: string, timezone: string): DateParts => {
  const startsAt = new Date(startDate)
  if (Number.isNaN(startsAt.getTime())) {
    return { isoDate: '', day: '', date: 0, month: '', year: 0, time: '', hour24: '', startsAt }
  }
  const tz = timezone || 'UTC'
  const get = (opts: Intl.DateTimeFormatOptions): Record<string, string> => {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).formatToParts(startsAt)
    const out: Record<string, string> = {}
    for (const p of parts) out[p.type] = p.value
    return out
  }
  const d = get({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const t12 = get({ hour: 'numeric', minute: '2-digit', hour12: true })
  const t24 = get({ hour: '2-digit', minute: '2-digit', hour12: false })
  const monthIdx = MONTH_NAMES.indexOf(d.month)
  const yearNum = Number(d.year)
  const dateNum = Number(d.day)
  const isoMonth = String(monthIdx + 1).padStart(2, '0')
  const isoDay = String(dateNum).padStart(2, '0')
  const hh = (t24.hour === '24' ? '00' : t24.hour) ?? '00'
  return {
    isoDate: `${yearNum}-${isoMonth}-${isoDay}`,
    day: d.weekday,
    date: dateNum,
    month: d.month,
    year: yearNum,
    time: `${t12.hour}:${t12.minute} ${(t12.dayPeriod || '').toUpperCase()}`.trim(),
    hour24: `${hh}:${t24.minute}`,
    startsAt
  }
}

/** Construye un Event (schema viejo) sintético desde HiEvents, para `raw`. */
const buildSyntheticRaw = (hi: HiEventPublic, parts: DateParts, venueLabel: string): Event => ({
  eventId: String(hi.id),
  event_date: parts.isoDate,
  event_hour: parts.hour24,
  event_name: hi.title,
  venue_label: venueLabel,
  event_label: hi.slug,
  event_deleted_at: null,
  sale_starts_at: '',
  tricket_url: ''
})

const buildDetailHref = (hi: HiEventPublic): string =>
  // Ruta nueva: id numérico (para fetch directo / deep-link robusto) + slug legible.
  `/event/${hi.id}/${encodeURIComponent(hi.slug)}`

export const hiEventToUIEvent = (
  hi: HiEventPublic,
  context: { hero?: boolean } = {}
): UIEvent => {
  const parts = toDateParts(hi.start_date, hi.timezone)
  const category = resolveCategory(hi.category, hi.title)
  const venueName = hi.location_details?.venue_name ?? ''
  const city = hi.location_details?.city ?? ''
  const country = hi.location_details?.country ?? ''
  const venueLabel = venueName ? slugify(venueName) : hi.slug
  const subtitle = city && venueName ? `${venueName} · ${city}` : venueName || city || hi.title

  const expired = hi.status !== 'LIVE' || hi.lifecycle_status === 'ENDED'

  return {
    id: hi.slug,
    eventId: String(hi.id),
    title: hi.title,
    subtitle,
    category,

    isoDate: parts.isoDate,
    day: parts.day,
    date: parts.date,
    month: parts.month,
    year: parts.year,
    time: parts.time,
    startsAt: parts.startsAt,

    venueLabel,
    venueName: venueName || venueLabel,
    city,
    country,
    mapsUrl: hi.settings?.maps_url ?? undefined,

    cover: coverHash(hi.slug),
    imageUrl: pickCardImage(hi.images ?? []),

    priceFrom: null,
    availability: inferAvailability(hi.slug),

    tags: inferTags(parts.startsAt, category),
    hero: context.hero ?? false,
    vibe: hi.description_preview ?? undefined,

    ticketUrl: undefined,
    isExternal: false,
    hidden: false,
    expired,
    requiresQueue: false,
    map: hi.map ?? null,

    detailHref: buildDetailHref(hi),

    raw: buildSyntheticRaw(hi, parts, venueLabel),
    rawVenue: undefined
  }
}

/**
 * Adapta un evento de `/user/tickets` (Mis Tickets) a UIEvent, para reusar las
 * cards (TicketGrid/TicketCard) con el mismo formato de fecha + cover que el
 * resto de la app. `id` = slug; `eventId` = id numérico (para el link al QR
 * público y el lookup). `expired` se deriva de la fecha (pasó o no).
 */
export const userTicketsEventToUIEvent = (e: HiUserTicketsEvent): UIEvent => {
  const parts = toDateParts(e.date ?? '', e.timezone ?? 'UTC')
  const category = inferCategory(e.eventName)
  const venueName = e.venue ?? e.locationDetails?.venue_name ?? ''
  const city = e.locationDetails?.city ?? ''
  const country = e.locationDetails?.country ?? ''
  const venueLabel = venueName ? slugify(venueName) : e.eventId
  const subtitle = city && venueName ? `${venueName} · ${city}` : venueName || city || e.eventName
  const expired = parts.startsAt.getTime() ? parts.startsAt.getTime() < Date.now() : false

  return {
    id: e.eventId,
    eventId: String(e.eventIdNumber),
    title: e.eventName,
    subtitle,
    category,

    isoDate: parts.isoDate,
    day: parts.day,
    date: parts.date,
    month: parts.month,
    year: parts.year,
    time: parts.time,
    startsAt: parts.startsAt,

    venueLabel,
    venueName: venueName || venueLabel,
    city,
    country,

    cover: coverHash(e.eventId),
    imageUrl: e.imageUrl ?? undefined,

    priceFrom: null,
    availability: 'available',

    tags: inferTags(parts.startsAt, category),
    hero: false,
    vibe: e.description ?? undefined,

    isExternal: false,
    hidden: false,
    expired,
    requiresQueue: false,
    map: null,

    detailHref: `/event/${e.eventIdNumber}/${encodeURIComponent(e.eventId)}`,

    raw: {
      eventId: String(e.eventIdNumber),
      event_date: parts.isoDate,
      event_hour: parts.hour24,
      event_name: e.eventName,
      venue_label: venueLabel,
      event_label: e.eventId,
      event_deleted_at: null,
      sale_starts_at: '',
      tricket_url: ''
    },
    rawVenue: undefined
  }
}

/** Adapta toda la lista del listado de HiEvents y marca hero los próximos N visibles. */
export const hiEventsToUIEvents = (hiEvents: HiEventPublic[] | null): UIEvent[] => {
  if (!hiEvents) return []
  const adapted = hiEvents.map((hi) => hiEventToUIEvent(hi))
  const heroCandidates = adapted
    .filter((e) => !e.hidden && !e.expired)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    .slice(0, HERO_LIMIT)
  const heroIds = new Set(heroCandidates.map((e) => e.id))
  return adapted.map((e) => (heroIds.has(e.id) ? { ...e, hero: true } : e))
}
