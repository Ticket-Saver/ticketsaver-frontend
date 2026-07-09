import type { Event } from '../router/eventsContext'
import type { Venue } from '../router/venuesContext'
import type { Availability, Category, UIEvent } from '../types/uiEvent'
import { coverHash } from '../lib/covers/coverHash'

/**
 * Lista negra heredada del legacy EventPage.tsx — labels que vienen del
 * schema pero no se muestran al usuario. Cuando el cliente quiera
 * controlarlo desde back, esto debería venir de una flag remota.
 */
/**
 * Eventos high-demand que pasan por la sala de espera virtual antes de
 * llegar al seat picker. Hasta que el cliente nos pase un flag desde el
 * schema, mantenemos esta lista hardcoded — al menos un demo (`demo_v2.01`)
 * para que el flujo se pueda verificar en local.
 */
const HIGH_DEMAND_LABELS: ReadonlySet<string> = new Set([
  'demo_v2.01'
])

const HIDDEN_EVENT_LABELS: ReadonlySet<string> = new Set([
  'ice_spice.01',
  'bossman_dlow.01',
  'bigxthaplug.01',
  'geazy_claytons.01',
  'deorro_claytons.01',
  'deebaby_zro.01',
  'insane_clown_posse.01',
  // 'steve_aoki.01' — visible para verificar flow General Admission v2 en B4b.
  'chief_keef.01',
  'shoreline_mafia.01',
  'offset_nardowick.01',
  'destroy_lonely.01'
])

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

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

const inferCategory = (event: Event): Category => {
  const haystack = `${event.event_name} ${event.event_label}`
  for (const { kw, cat } of CATEGORY_KEYWORDS) {
    if (kw.test(haystack)) return cat
  }
  return 'Music'
}

const inferAvailability = (label: string): Availability => {
  // Heurística determinista por label hasta que B3 conecte zone_price real.
  const bucket = djb2(label) % 100
  if (bucket < 60) return 'available'
  if (bucket < 80) return 'few-left'
  if (bucket < 95) return 'selling-fast'
  return 'sold-out'
}

const formatTime = (rawHour: string | undefined): string => {
  if (!rawHour) return ''
  const trimmed = rawHour.trim()
  const m = trimmed.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return trimmed
  const hh = Number(m[1])
  const mm = m[2]
  const period = hh >= 12 ? 'PM' : 'AM'
  const display = hh % 12 === 0 ? 12 : hh % 12
  return `${display}:${mm} ${period}`
}

const parseStartsAt = (rawDate: string, rawHour?: string): Date => {
  // event_date llega en ISO "YYYY-MM-DD". event_hour en "HH:mm" 24h.
  if (!rawDate) return new Date(NaN)
  if (!rawHour) return new Date(`${rawDate}T00:00:00`)
  const cleanHour = rawHour.length === 4 ? `0${rawHour}` : rawHour
  return new Date(`${rawDate}T${cleanHour}:00`)
}

const inferTags = (startsAt: Date, category: Category): string[] => {
  if (Number.isNaN(startsAt.getTime())) return [category]

  const tags: string[] = []
  const now = new Date()
  const dayMs = 24 * 60 * 60 * 1000
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventStartOfDay = new Date(
    startsAt.getFullYear(),
    startsAt.getMonth(),
    startsAt.getDate()
  )
  const diffDays = Math.round(
    (eventStartOfDay.getTime() - startOfDay.getTime()) / dayMs
  )

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

const HERO_LIMIT = 5

/**
 * Construye el subtitle "Venue · City" — si falta venue, fallback al label
 * crudo para no romper el render.
 */
const buildSubtitle = (event: Event, venue?: Venue): string => {
  const venueName = venue?.venue_name ?? event.venue_label
  const city = venue?.location?.city
  return city ? `${venueName} · ${city}` : venueName
}

/** Construye la ruta legacy /event/:name/:venue/:date/:label/:delete? */
const buildDetailHref = (event: Event): string => {
  const safe = (s: string) => encodeURIComponent(s)
  return `/event/${safe(event.event_name)}/${safe(event.venue_label)}/${safe(event.event_date)}/${safe(event.event_label)}/${safe(event.event_deleted_at ?? 'null')}`
}

/**
 * Convierte un Event + Venue del schema GitHub en un UIEvent para la nueva
 * UI v2. NO hace fetch de precio ni descripción — eso se carga lazily en
 * los componentes que lo necesiten para no bloquear el render principal.
 */
export const toUIEvent = (
  event: Event,
  venue: Venue | undefined,
  context: { hero?: boolean } = {}
): UIEvent => {
  const startsAt = parseStartsAt(event.event_date, event.event_hour)
  const validDate = !Number.isNaN(startsAt.getTime())
  const category = inferCategory(event)
  const expired = (() => {
    if (!validDate) return false
    const buffer = 2 * 24 * 60 * 60 * 1000 // 2 días de gracia
    return startsAt.getTime() + buffer < Date.now()
  })()

  return {
    id: event.event_label,
    eventId: event.eventId,
    title: event.event_name,
    subtitle: buildSubtitle(event, venue),
    category,

    isoDate: event.event_date,
    day: validDate ? DAY_NAMES[startsAt.getDay()] : '',
    date: validDate ? startsAt.getDate() : 0,
    month: validDate ? MONTH_NAMES[startsAt.getMonth()] : '',
    year: validDate ? startsAt.getFullYear() : 0,
    time: formatTime(event.event_hour),
    startsAt,

    venueLabel: event.venue_label,
    venueName: venue?.venue_name ?? event.venue_label,
    city: venue?.location?.city ?? '',
    country: venue?.location?.country ?? '',
    mapsUrl: venue?.location?.maps_url,

    cover: coverHash(event.event_label),

    priceFrom: null,
    availability: inferAvailability(event.event_label),

    tags: inferTags(startsAt, category),
    hero: context.hero ?? false,
    vibe: undefined,

    ticketUrl: event.tricket_url || undefined,
    isExternal: Boolean(event.tricket_url),
    hidden: HIDDEN_EVENT_LABELS.has(event.event_label),
    expired: expired || Boolean(event.event_deleted_at),
    requiresQueue: HIGH_DEMAND_LABELS.has(event.event_label),

    detailHref: buildDetailHref(event),

    raw: event,
    rawVenue: venue
  }
}

/**
 * Adapta toda la colección. El parámetro `markHero` recibe la lista ya
 * filtrada y elige los N próximos como hero. Esto es una heurística — el
 * cliente puede sobreescribir agregando una flag `featured` al schema.
 */
export const toUIEvents = (
  eventsMap: Record<string, Event> | null,
  venuesMap: Record<string, Venue> | null
): UIEvent[] => {
  if (!eventsMap) return []

  const events = Object.values(eventsMap)
  const venues = venuesMap ?? {}

  const adapted = events.map((ev) => toUIEvent(ev, venues[ev.venue_label]))

  // Hero = primeros 5 visibles ordenados por fecha próxima.
  const heroCandidates = adapted
    .filter((e) => !e.hidden && !e.expired)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    .slice(0, HERO_LIMIT)
  const heroIds = new Set(heroCandidates.map((e) => e.id))

  return adapted.map((e) => (heroIds.has(e.id) ? { ...e, hero: true } : e))
}

export const isVisibleEvent = (e: UIEvent): boolean =>
  !e.hidden && !e.expired

export { HIDDEN_EVENT_LABELS }

// Re-export del adapter de multi-fecha — el plan B3 expone helpers de
// agrupación por artista desde este módulo.
export {
  getDatesForArtist,
  groupByArtist,
  getGroupForEvent
} from './multiDateAdapter'
export type { DateGroup } from './multiDateAdapter'
