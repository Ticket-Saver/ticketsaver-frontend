import { useSearchParams } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import SaleV2 from './SaleV2'
import { GlassCard, Button } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import gradients from '../../styles/effects/gradients.module.css'

/**
 * Ruta de verificación temporal para el Bloque 4a — previsualiza el
 * VenuePicker + zoom/pan sin tocar el flujo /sale/... legacy.
 *
 * Acepta `?label=...` para cargar zone_price real de cualquier evento
 * del schema. Sin label, muestra un selector con los eventos visibles.
 */
export default function SaleCheck() {
  const [params, setParams] = useSearchParams()
  const label = params.get('label')

  if (label) return <SaleV2 eventLabel={label} />

  return (
    <LayoutV2 meshSeed={4} hideFooter>
      <div className='mx-auto max-w-3xl px-5 lg:px-10 py-10 lg:py-16 space-y-8'>
        <header className='space-y-2'>
          <p className='font-display text-xs uppercase tracking-[0.22em] text-brand-hi'>
            TicketSaver v2 · Block 4a
          </p>
          <h1
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${gradients.textBrand}`}
          >
            Sale check
          </h1>
          <p className='text-sm text-white/65 max-w-xl leading-relaxed'>
            Previsualiza el VenuePicker (paso 1 del flujo de compra) con datos reales de zonas.
            Elegí un evento abajo y verificá zoom (wheel/pinch), pan (drag) y selección de sección.
            El paso 2 (SeatGrid v2) llega en el Bloque 4b.
          </p>
        </header>

        <EventPicker onPick={(id) => setParams({ label: id })} />

        <ChecklistCard />
      </div>
    </LayoutV2>
  )
}

const EventPicker = ({ onPick }: { onPick: (label: string) => void }) => {
  const { loading, visible } = useUIEvents()

  if (loading) {
    return (
      <GlassCard depth='md' radius='lg' className='p-6'>
        <div className='h-16 rounded-glass-sm bg-white/[0.04] animate-pulse' />
      </GlassCard>
    )
  }

  if (visible.length === 0) {
    return (
      <GlassCard depth='md' radius='lg' className='p-6 text-center'>
        <div className='font-display text-sm font-semibold text-white'>No visible events</div>
        <p className='mt-2 text-xs text-white/55'>
          The schema returned no events with future dates.
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard depth='md' radius='lg' className='p-5'>
      <div className='text-[10px] uppercase tracking-[0.16em] font-display font-bold text-white/55'>
        Choose an event
      </div>
      <div className='mt-3 grid gap-2 sm:grid-cols-2'>
        {visible.slice(0, 10).map((ev) => (
          <Button
            key={ev.id}
            variant='ghost'
            size='md'
            onClick={() => onPick(ev.id)}
            className='justify-start text-left'
          >
            <span className='min-w-0 flex flex-col items-start'>
              <span className='truncate w-full font-semibold'>{ev.title}</span>
              <span className='text-[10px] font-normal text-white/55 truncate w-full'>
                {ev.month} {ev.date} · {ev.venueName}
              </span>
            </span>
          </Button>
        ))}
      </div>
    </GlassCard>
  )
}

const ChecklistCard = () => (
  <GlassCard depth='sm' radius='md' className='p-5'>
    <div className='text-[10px] uppercase tracking-[0.16em] font-display font-bold text-white/55'>
      Verification checklist
    </div>
    <ul className='mt-3 space-y-2 text-[12.5px] text-white/75 leading-relaxed'>
      <li>· StepHeader sticky con back · 1/2 indicator · CountdownPill.</li>
      <li>· Hold banner glassy purple debajo del header.</li>
      <li>· VenuePicker SVG con secciones en arco por tier (precio).</li>
      <li>· Zoom: scroll wheel (desktop) · pinch 2 dedos (touch).</li>
      <li>· Pan: drag con mouse · drag 1 dedo (touch).</li>
      <li>· Controles +/-/reset en esquina inferior derecha.</li>
      <li>· Click en sección → step 2 (placeholder hasta 4b).</li>
      <li>· Tier legend abajo con &quot;From $X&quot;.</li>
    </ul>
  </GlassCard>
)
