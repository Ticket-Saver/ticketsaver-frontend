import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import StepHeader, { type SaleStep } from '../../components/v2/sale/StepHeader'
import SeatingMapV2 from '../../components/v2/sale/SeatingMapV2'
import SeatPickerV2, { type SelectedSection } from '../../components/v2/sale/SeatPickerV2'
import SaleNoSeatsV2 from './SaleNoSeatsV2'
import { GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { getSeatMapAsset, getSeatMapLayout } from '../../lib/seatmaps/registry'
import { coverSeed } from '../../lib/covers/coverHash'

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

  const [step, setStep] = useState<SaleStep>('venue')
  const [section, setSection] = useState<SelectedSection | null>(null)

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

const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <div className='mx-auto max-w-md px-4 py-16 text-center'>
    <GlassCard depth='md' radius='lg' className='p-8'>
      <div className='font-display text-lg font-semibold text-white'>{title}</div>
      <p className='mt-2 text-sm text-white/55'>{message}</p>
    </GlassCard>
  </div>
)
