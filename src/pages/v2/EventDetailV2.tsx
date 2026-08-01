import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import Banner from '../../components/v2/eventDetail/Banner'
import MultiDateSelector from '../../components/v2/eventDetail/MultiDateSelector'
import TagList from '../../components/v2/eventDetail/TagList'
import Gallery from '../../components/v2/eventDetail/Gallery'
import VenueMap from '../../components/v2/eventDetail/VenueMap'
import StickyCTA, { buildSaleHref } from '../../components/v2/eventDetail/StickyCTA'
import EventResaleSection from '../../components/v2/resale/EventResaleSection'
import { GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { getDatesForEvent } from '../../services/multiDateAdapter'
import { hiEventsService } from '../../services/hiEventsService'
import type { HiQueueSettingsPublic } from '../../services/hiEventsService'
import { hiEventToUIEvent } from '../../services/hiEventsAdapter'
import { coverSeed } from '../../lib/covers/coverHash'
import type { Availability, UIEvent } from '../../types/uiEvent'
import type { HiAvailability, HiEventPublic, HiTicketPublic, HiLocationDetails } from '../../types/hievents'

const SALE_DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

/** Deriva el estado de disponibilidad visual desde el availability real de HiEvents. */
const deriveAvailability = (av: HiAvailability | null | undefined): Availability | null => {
  if (!av || av.total <= 0) return null
  if (av.available <= 0) return 'sold-out'
  const ratio = av.available / av.total
  if (ratio <= 0.1) return 'few-left'
  if (ratio <= 0.3) return 'selling-fast'
  return 'available'
}

/** Hora de un ISO en la timezone del evento, formato "8:00 PM". */
const fmtTimeInTz = (iso: string | null | undefined, tz: string | null | undefined): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz || 'UTC',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d)
}

/** Cola activa: habilitada y (sin rango, o dentro del rango starts_at/ends_at). */
const isQueueActiveNow = (q: HiQueueSettingsPublic | null): boolean => {
  if (!q?.is_enabled) return false
  const now = Date.now()
  if (q.starts_at && now < new Date(q.starts_at).getTime()) return false
  if (q.ends_at && now > new Date(q.ends_at).getTime()) return false
  return true
}

/** Une location_details en una dirección legible (sin venue ni país). */
const formatAddress = (loc: HiLocationDetails | null | undefined): string => {
  if (!loc) return ''
  return [
    loc.address_line_1,
    loc.address_line_2,
    loc.city,
    loc.state_or_region,
    loc.zip_or_postal_code
  ]
    .filter(Boolean)
    .join(', ')
}

export default function EventDetailV2() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, byId, visible } = useUIEvents()

  const eventFromList = byId(id)

  const [detail, setDetail] = useState<HiEventPublic | null>(null)
  const [tickets, setTickets] = useState<HiTicketPublic[]>([])
  const [queueSettings, setQueueSettings] = useState<HiQueueSettingsPublic | null>(null)
  const [detailError, setDetailError] = useState(false)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  // Detalle rico + tickets + queue-settings desde HiEvents. Sirve también de
  // deep-link: si el evento no está en la lista cargada, igual se resuelve por su id.
  useEffect(() => {
    if (!id) return
    let cancelled = false
    setDetail(null)
    setTickets([])
    setQueueSettings(null)
    setDetailError(false)
    ;(async () => {
      try {
        const [d, t, q] = await Promise.all([
          hiEventsService.getEvent(id),
          hiEventsService.getTickets(id).catch(() => [] as HiTicketPublic[]),
          hiEventsService.getQueueSettings(id).catch(() => null)
        ])
        if (cancelled) return
        setDetail(d)
        setTickets(t)
        setQueueSettings(q)
      } catch {
        if (!cancelled) setDetailError(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  // Evento base: de la lista (rápido) o construido desde el detalle (deep-link).
  const baseEvent: UIEvent | null =
    eventFromList ?? (detail ? hiEventToUIEvent(detail) : null)

  // priceFrom real: mínimo con impuestos de los tickets.
  const priceFrom = useMemo(() => {
    const all = tickets.flatMap((t) =>
      t.prices.map((p) => p.price_including_taxes_and_fees ?? p.price)
    )
    return all.length > 0 ? Math.min(...all) : null
  }, [tickets])

  // Countdown: si ningún ticket está en venta y hay una fecha de apertura futura,
  // mostramos "On sale {fecha}" (la más temprana) y se deshabilita la compra.
  const { isSaleActive, saleStartsLabel, saleStartsAt } = useMemo(() => {
    const active = {
      isSaleActive: true,
      saleStartsLabel: undefined as string | undefined,
      saleStartsAt: null as Date | null
    }
    if (tickets.length === 0) return active
    if (tickets.some((t) => t.is_available)) return active
    const upcoming = tickets
      .map((t) => t.sale_start_date)
      .filter((s): s is string => Boolean(s))
      .map((s) => new Date(s))
      .filter((d) => !Number.isNaN(d.getTime()) && d.getTime() > Date.now())
      .sort((a, b) => a.getTime() - b.getTime())
    if (upcoming.length > 0) {
      return {
        isSaleActive: false,
        saleStartsLabel: `On sale ${SALE_DATE_FMT.format(upcoming[0])}`,
        saleStartsAt: upcoming[0]
      }
    }
    return active
  }, [tickets])

  // Evento enriquecido con datos reales del detalle (precio, disponibilidad,
  // vibe), sin tocar los subcomponentes que ya consumen UIEvent.
  const event: UIEvent | null = useMemo(() => {
    if (!baseEvent) return null
    const realAvailability = deriveAvailability(detail?.availability)
    return {
      ...baseEvent,
      requiresQueue: queueSettings ? isQueueActiveNow(queueSettings) : baseEvent.requiresQueue,
      priceFrom: priceFrom ?? baseEvent.priceFrom,
      // Si la venta aún no abrió, no mostramos "sold-out" (0 disponibles ≠ agotado).
      availability: !isSaleActive ? 'available' : realAvailability ?? baseEvent.availability,
      vibe: detail?.description_preview ?? baseEvent.vibe,
      // Preventa del DETALLE (fresca): el listado no trae presale_active/sales_started
      // (campos computados que solo expone EventResourcePublic). Sin esto, el gate del
      // código y la agenda de venta no reflejarían el estado real.
      presale: detail
        ? {
            enabled: detail.presale_enabled ?? false,
            startsAt: detail.presale_starts_at ?? null,
            active: detail.presale_active ?? false,
            salesStarted: detail.sales_started ?? true,
            generalSaleAt: detail.ticket_sales_start_date ?? null
          }
        : baseEvent.presale
    }
  }, [baseEvent, priceFrom, detail, isSaleActive, queueSettings])

  const description = detail?.description ?? ''
  // Solo mostramos la hora de fin si es posterior al inicio (evita "9:54 – 9:54").
  const endTime =
    detail?.end_date &&
    detail?.start_date &&
    new Date(detail.end_date).getTime() > new Date(detail.start_date).getTime()
      ? fmtTimeInTz(detail.end_date, detail.timezone)
      : ''
  const address = formatAddress(detail?.location_details)
  const organizerName = detail?.organizer?.name

  const dates = useMemo(
    () => getDatesForEvent(visible, event),
    [visible, event]
  )
  const datesForArtist = dates.length > 0 ? dates : event ? [event] : []

  // Si no se encuentra ni en la lista ni en HiEvents → a /events.
  useEffect(() => {
    if (!loading && !eventFromList && detailError) {
      navigate('/events', { replace: true })
    }
  }, [loading, eventFromList, detailError, navigate])

  const handleDateChange = (newEvent: UIEvent) => {
    // Distinguir por eventId (único): en multifecha el slug se repite entre fechas.
    if (newEvent.eventId === event?.eventId) return
    navigate(newEvent.detailHref, { replace: true })
  }

  // Gate de preventa: si la ventana está abierta y la venta general no arrancó,
  // al tocar "Choose seats" se pide el código antes de entrar a /sale.
  const presaleGateActive = !!event?.presale?.active && !event?.presale?.salesStarted
  const [presaleModalOpen, setPresaleModalOpen] = useState(false)
  const [presaleCode, setPresaleCode] = useState('')
  const [presaleError, setPresaleError] = useState('')
  const [presaleChecking, setPresaleChecking] = useState(false)

  const handleChooseSeats = () => {
    if (!event) return
    if (presaleGateActive) {
      setPresaleError('')
      setPresaleCode('')
      setPresaleModalOpen(true)
    } else {
      navigate(buildSaleHref(event))
    }
  }

  const submitPresaleCode = async () => {
    if (!event) return
    const code = presaleCode.trim()
    if (!code) {
      setPresaleError('Ingresá el código de preventa.')
      return
    }
    setPresaleChecking(true)
    setPresaleError('')
    try {
      const res = await hiEventsService.validatePresaleCode(event.eventId, code)
      if (res.valid) {
        // Se guarda para que el flujo de compra lo mande al crear la orden.
        sessionStorage.setItem(`presale_code_${event.eventId}`, code.toUpperCase())
        navigate(buildSaleHref(event))
      } else {
        setPresaleError('Código inválido o vencido.')
      }
    } catch {
      setPresaleError('No se pudo validar el código. Intentá de nuevo.')
    } finally {
      setPresaleChecking(false)
    }
  }

  if (!event) {
    return (
      <LayoutV2 hideMobileTabBar hideFooter meshSeed={1}>
        <LoadingState />
      </LayoutV2>
    )
  }

  return (
    <LayoutV2 hideFooter meshSeed={(coverSeed(event.id) % 8) + 1}>
      <Banner event={event} images={detail?.images} />

      <div className='mt-8 lg:mt-10 px-5 lg:px-10 max-w-7xl mx-auto'>
        <TitleBlock event={event} organizer={organizerName} />
        {event.tags.length > 0 && (
          <div className='mt-4'>
            <TagList tags={event.tags} />
          </div>
        )}
      </div>

      <div className='mt-6 max-w-7xl mx-auto'>
        <MultiDateSelector
          dates={datesForArtist}
          selectedEventId={event.eventId}
          onSelect={handleDateChange}
        />
      </div>

      <div className='mt-6 px-5 lg:px-10 max-w-7xl mx-auto'>
        <SelectedDateHighlight event={event} endTime={endTime} />
      </div>

      <SaleSchedule event={event} />
      {!event.presale && !isSaleActive && saleStartsAt && (
        <div className='mt-5 px-5 lg:px-10 max-w-7xl mx-auto'>
          <CountdownBanner date={saleStartsAt} />
        </div>
      )}

      <Section title='About the show'>
        <Description
          text={description}
          expanded={descriptionExpanded}
          onToggle={() => setDescriptionExpanded((s) => !s)}
        />
      </Section>

      <section className='mt-8 max-w-7xl mx-auto'>
        <div className='px-5 lg:px-10 pb-3'>
          <SectionLabel>Gallery</SectionLabel>
        </div>
        <Gallery event={event} images={detail?.gallery ?? detail?.images} />
      </section>

      <Section title='Location'>
        <VenueMap
          venueName={event.venueName}
          city={event.city}
          address={address}
          mapsUrl={event.mapsUrl}
        />
        {(detail?.settings?.website_url || detail?.settings?.support_email) && (
          <div className='mt-3 space-y-1 text-[12.5px] text-white/65'>
            {detail?.settings?.website_url && (
              <a
                href={detail.settings.website_url}
                target='_blank'
                rel='noreferrer'
                className='inline-block text-brand-hi hover:text-white transition'
              >
                Event website ↗
              </a>
            )}
            {detail?.settings?.support_email && (
              <p>
                Contact:{' '}
                <a
                  href={`mailto:${detail.settings.support_email}`}
                  className='text-brand-hi hover:text-white transition'
                >
                  {detail.settings.support_email}
                </a>
              </p>
            )}
          </div>
        )}
      </Section>

      <Section title='Good to know'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
          <FactPill label='Doors' value={event.time || 'TBA'} />
          {/* Campos custom públicos cargados desde el admin (attributes). */}
          {(detail?.attributes ?? []).map((attr) => (
            <FactPill
              key={attr.name}
              label={attr.name}
              value={String(attr.value ?? '')}
            />
          ))}
        </div>
      </Section>

      <TicketPricesPanel tickets={tickets} />

      {detail?.id && (
        <Section title='Resale'>
          <EventResaleSection eventId={detail.id} />
        </Section>
      )}

      <div className='h-32 lg:h-24' />

      <StickyCTA
        event={event}
        priceFrom={priceFrom}
        isSaleActive={isSaleActive}
        saleStartsLabel={saleStartsLabel}
        presaleActive={presaleGateActive}
        onChooseSeats={handleChooseSeats}
      />

      {presaleModalOpen && (
        <PresaleGateModal
          code={presaleCode}
          error={presaleError}
          checking={presaleChecking}
          onChange={setPresaleCode}
          onSubmit={submitPresaleCode}
          onClose={() => setPresaleModalOpen(false)}
        />
      )}
    </LayoutV2>
  )
}

const PresaleGateModal = ({
  code,
  error,
  checking,
  onChange,
  onSubmit,
  onClose
}: {
  code: string
  error: string
  checking: boolean
  onChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
}) => (
  <div
    className='fixed inset-0 z-50 flex items-center justify-center p-5'
    style={{ background: 'rgba(10,10,12,0.7)' }}
    onClick={onClose}
  >
    <GlassCard
      className='w-full max-w-sm p-6'
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <h3 className='font-display text-lg font-bold text-white'>Acceso a preventa</h3>
      <p className='mt-1.5 text-[13px] text-white/65'>
        Esta función está en preventa. Ingresá tu código de acceso para continuar.
      </p>
      <input
        autoFocus
        value={code}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder='CÓDIGO'
        maxLength={12}
        className='mt-4 w-full px-4 py-3 rounded-glass-md bg-white/[0.06] border border-white/15 text-white text-center font-display text-lg tracking-[0.2em] uppercase placeholder:text-white/30 focus:outline-none focus:border-brand-hi/60'
      />
      {error && <p className='mt-2 text-[12.5px] text-accent-coral'>{error}</p>}
      <div className='mt-5 flex gap-2'>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 px-4 py-3 rounded-glass-md border border-white/15 text-white/75 font-display text-sm hover:bg-white/5 transition'
        >
          Cancelar
        </button>
        <button
          type='button'
          onClick={onSubmit}
          disabled={checking}
          className='flex-1 px-4 py-3 rounded-glass-md bg-gradient-to-b from-white to-white/85 text-brand-ink font-display font-semibold text-sm hover:brightness-95 transition disabled:opacity-60'
        >
          {checking ? 'Validando…' : 'Continuar'}
        </button>
      </div>
    </GlassCard>
  </div>
)

const TitleBlock = ({ event, organizer }: { event: UIEvent; organizer?: string }) => (
  <div className='min-w-0'>
    <div className='text-[10.5px] uppercase tracking-[0.16em] font-display font-semibold text-brand-hi'>
      {event.category}
    </div>
    <h1 className='mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.05]'>
      {event.title}
    </h1>
    <p className='mt-3 text-sm lg:text-base text-white/70'>
      {event.subtitle}
    </p>
    {organizer && (
      <p className='mt-1.5 text-[12.5px] text-white/55'>
        Presented by <span className='text-white/75'>{organizer}</span>
      </p>
    )}
  </div>
)

const SelectedDateHighlight = ({ event, endTime }: { event: UIEvent; endTime?: string }) => (
  <div
    className='flex items-center gap-3 p-3.5 rounded-glass-md border border-brand-hi/30 backdrop-blur-glass-strong'
    style={{ background: 'rgba(212,168,240,0.12)' }}
  >
    <div className='h-[52px] w-[52px] shrink-0 rounded-glass-sm bg-white text-brand-ink flex flex-col items-center justify-center font-display'>
      <div className='text-[8.5px] font-bold uppercase tracking-[0.16em] opacity-70'>
        {event.month}
      </div>
      <div className='text-[22px] font-bold leading-none mt-0.5'>
        {String(event.date).padStart(2, '0')}
      </div>
    </div>
    <div className='flex-1 min-w-0'>
      <div className='font-display text-[13.5px] font-semibold text-white tracking-tight'>
        {event.day}, {event.month} {event.date}
        {event.time && ` · ${event.time}`}
        {event.time && endTime && ` – ${endTime}`}
      </div>
      <div className='text-[11.5px] text-white/65 mt-0.5 flex items-center gap-1.5'>
        <PinIcon />
        <span className='truncate'>
          {event.venueName}
          {event.city && `, ${event.city}`}
        </span>
      </div>
    </div>
    <span className='shrink-0 px-2 py-1 rounded-glass-sm bg-accent-coral/20 text-accent-coral font-display text-[9.5px] font-bold uppercase tracking-[0.10em]'>
      {event.presale?.active && !event.presale?.salesStarted
        ? 'presale'
        : event.availability.replace('-', ' ')}
    </span>
  </div>
)

interface DescriptionProps {
  text: string
  expanded: boolean
  onToggle: () => void
}

const Description = ({ text, expanded, onToggle }: DescriptionProps) => {
  if (!text)
    return (
      <p className='text-[13px] text-white/45 italic leading-relaxed'>
        Description coming soon.
      </p>
    )

  // `text` es HTML ya purificado por el backend (HTMLPurifier). Se renderiza como
  // HTML real (antes se mostraban los tags <p> literales). El truncado es por CSS
  // (line-clamp): no se puede cortar HTML por caracteres sin romper los tags.
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const isLong = plain.length > 320

  return (
    <div>
      <div
        className='text-[13px] leading-[1.55] text-white/78 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-brand-hi [&_a]:underline [&_strong]:text-white [&_b]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1'
        style={
          !expanded && isLong
            ? {
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }
            : undefined
        }
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {isLong && (
        <button
          type='button'
          onClick={onToggle}
          className='mt-2 text-[11px] font-medium text-brand-hi hover:text-white transition'
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

/**
 * Panel de precios del detalle. Para eventos generales muestra los tipos de
 * ticket de HiEvents con su precio (ya con impuestos). Para enumerados, los
 * precios reales viven en los asientos (se afina en C3/C4); si llegan muchos
 * tickets (probable enumerado), se omite el listado para no saturar.
 */
const TicketPricesPanel = ({ tickets }: { tickets: HiTicketPublic[] }) => {
  if (tickets.length === 0 || tickets.length > 12) return null
  return (
    <Section title='Tickets'>
      <GlassCard depth='sm' radius='md' className='divide-y divide-white/[0.08]'>
        {tickets.map((ticket) => {
          const prices = ticket.prices.map(
            (p) => p.price_including_taxes_and_fees ?? p.price
          )
          const min = prices.length > 0 ? Math.min(...prices) : 0
          return (
            <div
              key={ticket.id}
              className='flex items-center justify-between px-4 py-3'
            >
              <div>
                <div className='font-display text-sm font-semibold text-white'>
                  {ticket.title}
                </div>
                <div className='text-[10.5px] text-white/45 uppercase tracking-[0.14em] mt-0.5 font-display'>
                  {ticket.is_sold_out ? 'Sold out' : 'Starting from'}
                </div>
              </div>
              <div className='font-display text-sm font-semibold text-white tabular-nums'>
                ${min.toFixed(0)} USD
              </div>
            </div>
          )
        })}
      </GlassCard>
    </Section>
  )
}

const Section = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className='mt-8 px-5 lg:px-10 max-w-7xl mx-auto'>
    <SectionLabel>{title}</SectionLabel>
    {children}
  </section>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight mb-3'>
    {children}
  </h2>
)

const FactPill = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-glass-sm bg-white/[0.05] border border-white/[0.10] px-3 py-2.5'>
    <div className='text-[9px] uppercase tracking-[0.14em] text-white/50 font-display font-semibold'>
      {label}
    </div>
    <div className='mt-1 text-[12.5px] text-white font-medium tracking-tight'>
      {value}
    </div>
  </div>
)

// Formato corto para fechas de venta: "vie 18 jul, 20:00".
const SALE_SCHED_FMT = new Intl.DateTimeFormat('es-AR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
})
const fmtSaleDate = (iso: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : SALE_SCHED_FMT.format(d)
}

/**
 * Agenda de venta del evento. Muestra hasta dos filas claras y separadas:
 *  - Preventa (solo si hay código): "Abierta ahora" o la fecha de apertura.
 *  - Venta general ("para todo el público"): la fecha en que salen las entradas.
 * Caso clave: evento publicado pero con la venta anunciada para otro día → aunque
 * NO haya preventa, se muestra "Entradas a la venta el [día]".
 */
const SaleSchedule = ({ event }: { event: UIEvent }) => {
  const ps = event.presale
  if (!ps) return null

  type Row = {
    key: string
    label: string
    value: string
    note?: string
    tone: 'presale' | 'general'
    live?: boolean
  }
  const rows: Row[] = []

  if (ps.enabled) {
    rows.push({
      key: 'presale',
      label: 'Preventa',
      tone: 'presale',
      value: ps.active ? 'Abierta ahora' : fmtSaleDate(ps.startsAt) || 'Próximamente',
      note: 'Acceso con código',
      live: ps.active
    })
  }

  if (ps.salesStarted) {
    // Venta general abierta: solo se anuncia si NO hay nada más que mostrar arriba.
    if (!ps.enabled) return null
    rows.push({
      key: 'general',
      label: 'Venta general',
      tone: 'general',
      value: 'A la venta ahora',
      note: 'Para todo el público',
      live: true
    })
  } else if (ps.generalSaleAt) {
    rows.push({
      key: 'general',
      label: ps.enabled ? 'Venta general' : 'Entradas a la venta',
      tone: 'general',
      value: fmtSaleDate(ps.generalSaleAt),
      note: 'Para todo el público'
    })
  }

  if (rows.length === 0) return null

  return (
    <div className='mt-5 px-5 lg:px-10 max-w-7xl mx-auto'>
      <div className='rounded-glass-md border border-white/[0.08] bg-white/[0.03] backdrop-blur-glass divide-y divide-white/[0.06]'>
        {rows.map((r) => (
          <div key={r.key} className='flex items-center gap-3 px-4 py-3'>
            <span
              className={
                'h-2 w-2 rounded-full shrink-0 ' +
                (r.tone === 'presale' ? 'bg-brand-hi' : 'bg-accent-mint') +
                (r.live ? ' animate-pulse' : '')
              }
            />
            <div className='flex-1 min-w-0'>
              <div className='font-display text-[12.5px] font-semibold text-white'>
                {r.label}
              </div>
              {r.note && <div className='text-[10.5px] text-white/50'>{r.note}</div>}
            </div>
            <div
              className={
                'font-display text-[12.5px] font-semibold tabular-nums text-right ' +
                (r.live ? 'text-accent-mint' : 'text-white/85')
              }
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CountdownBanner = ({ date }: { date: Date }) => {
  const days = Math.max(
    0,
    Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  )
  const dateLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
  return (
    <div
      className='relative overflow-hidden rounded-glass-md border border-brand-hi/40 px-4 py-4 flex items-center gap-4'
      style={{
        background:
          'linear-gradient(110deg, rgba(181,123,232,0.22), rgba(255,94,158,0.16))'
      }}
    >
      <div className='shrink-0 grid place-items-center h-12 w-12 rounded-glass-sm bg-white/10 border border-white/15 text-white/85'>
        <ClockIcon />
      </div>
      <div className='min-w-0 flex-1'>
        <div className='font-display text-[10px] uppercase tracking-[0.16em] font-semibold text-brand-hi'>
          Tickets on sale
        </div>
        <div className='font-display text-sm lg:text-base font-bold text-white tracking-tight mt-0.5'>
          {dateLabel}
        </div>
      </div>
      <div className='shrink-0 text-right'>
        <div className='font-display text-2xl font-bold text-white leading-none tabular-nums'>
          {days}
        </div>
        <div className='text-[9.5px] uppercase tracking-[0.14em] text-white/60 font-display mt-1'>
          {days === 1 ? 'day to go' : 'days to go'}
        </div>
      </div>
    </div>
  )
}

const ClockIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' aria-hidden>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.6' />
    <path
      d='M12 7.5V12l3 1.8'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const PinIcon = () => (
  <svg width='10' height='10' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='M6 1.5C4 1.5 2.5 3 2.5 5c0 2.5 3.5 5.5 3.5 5.5S9.5 7.5 9.5 5c0-2-1.5-3.5-3.5-3.5Z'
      stroke='currentColor'
      strokeWidth='1.2'
    />
    <circle cx='6' cy='5' r='1.3' fill='currentColor' />
  </svg>
)

const LoadingState = () => (
  <div className='px-5 lg:px-10 max-w-3xl mx-auto pt-10 space-y-6'>
    <div className='h-72 rounded-glass-lg bg-white/[0.04] border border-white/[0.08] animate-pulse' />
    <div className='h-12 rounded-glass-md bg-white/[0.04] animate-pulse w-2/3' />
    <div className='h-32 rounded-glass-md bg-white/[0.04] animate-pulse' />
  </div>
)
