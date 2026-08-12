import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import StepHeader, { type SaleStep } from '../../components/v2/sale/StepHeader'
import SeatingMapV2 from '../../components/v2/sale/SeatingMapV2'
import SeatPickerV2, { type SelectedSection } from '../../components/v2/sale/SeatPickerV2'
import SaleNoSeatsV2 from './SaleNoSeatsV2'
import { GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { hiEventsService } from '../../services/hiEventsService'
import { getSeatMapAsset, getSeatMapLayout } from '../../lib/seatmaps/registry'
import { coverSeed } from '../../lib/covers/coverHash'

/** Mismo formato que el "On sale {fecha}" del detalle, con la hora de apertura. */
const SALE_GATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

interface SaleV2Props {
  /** event_label (slug) del evento. */
  eventLabel: string
  /** eventId numérico (único por fecha). Si viene, manda sobre el slug — clave
   *  para multifecha, donde varias fechas comparten el mismo slug. */
  eventId?: string
}

/**
 * Pantalla de venta (C3a) — flujo de DOS pasos con la línea de diseño v2:
 *  1. Selector de sección sobre el mapa real de HiEvents (SeatingMapV2).
 *  2. Selección de asientos de la sección con sidebar de carrito (SeatPickerV2).
 *
 * Decide enumerado/general por `event.map`: con mapa → asientos; sin mapa →
 * entradas generales (SaleNoSeatsV2). El SVG/ranges salen del registry de assets;
 * los asientos (con precio + tax/fee reales) de HiEvents.
 */
export default function SaleV2({ eventLabel, eventId }: SaleV2Props) {
  const { loading: eventsLoading, byLabel, byId } = useUIEvents()
  const navigate = useNavigate()

  // Prioriza eventId (único por fecha); cae al slug por compatibilidad.
  const event = (eventId ? byId(eventId) : undefined) ?? byLabel(eventLabel)
  const mapAsset = useMemo(() => (event ? getSeatMapAsset(event.map) : null), [event])
  const mapLayout = useMemo(() => (event ? getSeatMapLayout(event.map) : null), [event])
  // Escenario + secciones invertidas salen del ranges.json (metadata).
  const mapMeta = useMemo(() => {
    const m = (mapAsset?.ranges?.metadata ?? {}) as {
      stage_direction?: 'north' | 'south' | 'east' | 'west'
      reversed_sections?: string[]
      seat_types?: Record<string, string[]>
    }
    return {
      stageDirection: m.stage_direction ?? 'north',
      reversedSections: m.reversed_sections ?? [],
      seatTypes: m.seat_types ?? {}
    }
  }, [mapAsset])

  const [step, setStep] = useState<SaleStep>('venue')
  const [section, setSection] = useState<SelectedSection | null>(null)

  // Gate de venta para el deep-link: a /sale se llega por URL directa, así que el
  // `disabled` del CTA del detalle es puramente cosmético. Replica lo que valida
  // el backend al crear la orden (areTicketSalesStarted + código de preventa).
  const numericId = event?.eventId
  const [saleGate, setSaleGate] = useState<'checking' | 'open' | 'blocked'>('checking')
  const [saleStartsAt, setSaleStartsAt] = useState<string | null>(null)

  useEffect(() => {
    if (!numericId) return
    let cancelled = false
    setSaleGate('checking')
    ;(async () => {
      try {
        const d = await hiEventsService.getEvent(numericId)
        if (cancelled) return
        // Con la preventa abierta, el código validado en el detalle es el pase.
        const presaleOk =
          !!d.presale_active && !!sessionStorage.getItem(`presale_code_${numericId}`)
        setSaleStartsAt(d.ticket_sales_start_date ?? null)
        setSaleGate(d.sales_started !== false || presaleOk ? 'open' : 'blocked')
      } catch {
        // Si el detalle no responde no cerramos la venta: el backend rechaza
        // igual al crear la orden, y bloquear acá dejaría el flujo caído por un
        // hipo de la API.
        if (!cancelled) setSaleGate('open')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [numericId])

  if (eventsLoading) {
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <LoadingState />
      </LayoutV2>
    )
  }

  if (!event) {
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <ErrorState title='Event not found' message='That event is not currently available.' />
      </LayoutV2>
    )
  }

  // Venta todavía cerrada → se corta antes del mapa y del flujo general.
  if (saleGate === 'checking') {
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <LoadingState />
      </LayoutV2>
    )
  }

  if (saleGate === 'blocked') {
    const start = saleStartsAt ? new Date(saleStartsAt) : null
    const when = start && !Number.isNaN(start.getTime()) ? SALE_GATE_FMT.format(start) : null
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <ErrorState
          title='Tickets not on sale yet'
          message={
            when
              ? `Tickets for this event go on sale on ${when}.`
              : 'Ticket sales for this event have not started yet.'
          }
          action={{ label: 'Back to event', to: event.detailHref }}
        />
      </LayoutV2>
    )
  }

  // General admission (sin mapa) → flujo de entradas sin asiento.
  if (!event.map) {
    return <SaleNoSeatsV2 event={event} />
  }

  // Enumerado, pero el mapa no está en el registry del front.
  if (!mapAsset) {
    return (
      <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={2}>
        <ErrorState
          title='Seat map unavailable'
          message='This event uses a seat map that is not available yet. Please try again in a moment.'
        />
      </LayoutV2>
    )
  }

  const subtitle = `${event.day}, ${event.month} ${event.date}${event.time ? ` · ${event.time}` : ''} · ${event.venueName}`

  const onSeats = step === 'seats' && section !== null

  return (
    <LayoutV2 hideHeader hideFooter hideMobileTabBar meshSeed={(coverSeed(event.id) % 8) + 2}>
      <StepHeader
        step={onSeats ? 'seats' : 'venue'}
        title={event.title}
        subtitle={subtitle}
        onBack={onSeats ? () => setStep('venue') : () => navigate(event.detailHref)}
        eventLabel={event.id}
      />
      <main className='mx-auto max-w-5xl px-4 py-5 lg:px-8 lg:py-8'>
        {onSeats && section ? (
          <SeatPickerV2
            event={event}
            section={section}
            sectionLayout={mapLayout && section.groupId ? mapLayout[section.groupId] : undefined}
            stageDirection={mapMeta.stageDirection}
            seatTypes={mapMeta.seatTypes}
            reversed={
              !!section.groupId &&
              mapMeta.reversedSections.some(
                (r) => section.groupId === r || section.groupId!.startsWith(`${r}-`)
              )
            }
            onBack={() => setStep('venue')}
          />
        ) : (
          <>
            <HoldBanner />
            <div className='mt-4'>
              <SeatingMapV2
                eventId={event.eventId}
                svg={mapAsset.svg}
                rangesRaw={mapAsset.ranges}
                onSelectSection={(sel) => {
                  setSection(sel)
                  setStep('seats')
                }}
              />
            </div>
            <ShortcutHints />
          </>
        )}
      </main>
    </LayoutV2>
  )
}

const HoldBanner = () => (
  <div
    className='flex items-center gap-2.5 rounded-glass-md border border-brand-hi/22 px-3 py-2.5 backdrop-blur-glass-strong'
    style={{ background: 'rgba(212,168,240,0.10)' }}
  >
    <span
      aria-hidden
      className='h-1.5 w-1.5 rounded-full bg-accent-coral shadow-[0_0_8px_var(--accent-coral)]'
    />
    <span className='text-[11.5px] text-white/75'>
      <strong className='font-semibold text-white'>Pick a section</strong> to see its seats. The
      hold timer starts once you select your first seat.
    </span>
  </div>
)

const ShortcutHints = () => (
  <div className='mt-3 hidden items-center justify-center gap-3 font-display text-[10.5px] text-white/40 md:flex'>
    <Shortcut keys={['Scroll']} desc='zoom' />
    <Shortcut keys={['Drag']} desc='pan' />
    <Shortcut keys={['Click']} desc='open a section' />
  </div>
)

const Shortcut = ({ keys, desc }: { keys: string[]; desc: string }) => (
  <span className='inline-flex items-center gap-1.5'>
    {keys.map((k) => (
      <kbd
        key={k}
        className='inline-block rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] uppercase tracking-wider'
      >
        {k}
      </kbd>
    ))}
    <span>{desc}</span>
  </span>
)

const LoadingState = () => (
  <div className='mx-auto max-w-3xl space-y-4 px-4 py-10'>
    <div className='h-14 animate-pulse rounded-glass-md bg-white/[0.04]' />
    <div className='h-[340px] animate-pulse rounded-glass-lg bg-white/[0.04]' />
  </div>
)

const ErrorState = ({
  title,
  message,
  action
}: {
  title: string
  message: string
  action?: { label: string; to: string }
}) => (
  <div className='mx-auto max-w-md px-4 py-16 text-center'>
    <GlassCard depth='md' radius='lg' className='p-8'>
      <div className='font-display text-lg font-semibold text-white'>{title}</div>
      <p className='mt-2 text-sm text-white/55'>{message}</p>
      {action && (
        <Link
          to={action.to}
          className='mt-5 inline-flex h-10 items-center justify-center rounded-pill bg-gradient-to-br from-brand-hi to-brand-mid px-5 font-display text-xs font-semibold tracking-tight text-brand-ink transition hover:brightness-110'
        >
          {action.label}
        </Link>
      )}
    </GlassCard>
  </div>
)
