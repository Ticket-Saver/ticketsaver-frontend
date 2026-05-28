import { useState, useEffect, useRef } from 'react'
import LayoutV2 from '../../layouts/LayoutV2'
import { Button, GlassCard, Pill } from '../../components/ui'
import gradients from '../../styles/effects/gradients.module.css'
import type { PillState } from '../../types/ui'

const DEMO_LABEL = '_layout_check_demo'
const DEMO_STORAGE_KEY = `session_timer_${DEMO_LABEL}`

type SimulatedState = 'off' | 'normal' | 'warn' | 'critical' | 'expired'

const STATE_LABEL: Record<Exclude<SimulatedState, 'off'>, string> = {
  normal: '09:42',
  warn: '02:14',
  critical: '00:38',
  expired: '00:00'
}

export default function LayoutCheck() {
  const [simulated, setSimulated] = useState<SimulatedState>('off')
  const [realSession, setRealSession] = useState<boolean>(false)
  const tickRef = useRef<number | null>(null)

  // Sesión "real": escribimos en localStorage la entrada que `useSessionTimer`
  // lee al montar y dejamos que el CountdownPill del Header haga el countdown
  // legítimo.
  useEffect(() => {
    if (!realSession) {
      localStorage.removeItem(DEMO_STORAGE_KEY)
      return
    }
    const now = Date.now()
    const expiresAt = now + 9 * 60 * 1000 + 42 * 1000
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ expiresAt, startedAt: now })
    )
    return () => {
      localStorage.removeItem(DEMO_STORAGE_KEY)
    }
  }, [realSession])

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current)
  }, [])

  const mockCountdown =
    simulated === 'off'
      ? undefined
      : { state: simulated as PillState, label: STATE_LABEL[simulated as Exclude<SimulatedState, 'off'>] }

  return (
    <LayoutV2
      meshSeed={2}
      forcedSessionLabel={realSession ? DEMO_LABEL : undefined}
      mockCountdown={mockCountdown}
    >
      <div className='mx-auto max-w-4xl px-5 sm:px-6 lg:px-10 py-10 lg:py-16 space-y-12'>
        <header className='space-y-3'>
          <p className='font-display text-xs uppercase tracking-[0.22em] text-brand-hi'>
            TicketSaver v2 · Block 1
          </p>
          <h1
            className={`font-display text-4xl sm:text-5xl font-bold tracking-tight ${gradients.textBrand}`}
          >
            Layout check
          </h1>
          <p className='max-w-xl text-sm leading-relaxed text-white/65'>
            Verifica que el LayoutV2 esté correcto: Header sticky glass, Footer
            de 4 columnas + newsletter, MeshBackground animado en el fondo,
            MobileTabBar visible en &lt;768px y CountdownPill funcionando en sus
            3 estados. Esta ruta es temporal — eliminar antes de producción.
          </p>
        </header>

        <section className='space-y-3'>
          <SectionTitle>Countdown pill · mock</SectionTitle>
          <p className='text-xs text-white/55 max-w-xl'>
            Forza el estado visual del pill del Header sin tocar el timer real.
            Útil para revisar colores, animaciones y contraste en cada estado.
          </p>
          <div className='flex flex-wrap gap-2'>
            {(['off', 'normal', 'warn', 'critical', 'expired'] as const).map(
              (s) => (
                <Button
                  key={s}
                  variant={simulated === s ? 'primary' : 'ghost'}
                  size='sm'
                  onClick={() => setSimulated(s)}
                >
                  {s}
                </Button>
              )
            )}
          </div>
          <div className='flex items-center gap-3 pt-2'>
            <span className='text-[11px] uppercase tracking-[0.16em] text-white/45 font-display'>
              Preview inline:
            </span>
            {simulated === 'off' ? (
              <span className='text-xs text-white/40'>hidden</span>
            ) : (
              <Pill
                state={simulated as PillState}
                leadingDot
                dotPulse={simulated === 'warn' || simulated === 'critical'}
              >
                {STATE_LABEL[simulated as Exclude<SimulatedState, 'off'>]}
              </Pill>
            )}
          </div>
        </section>

        <section className='space-y-3'>
          <SectionTitle>Countdown pill · sesión real</SectionTitle>
          <p className='text-xs text-white/55 max-w-xl'>
            Activa un timer real (9:42) usando <code>useSessionTimer</code>{' '}
            sobre un label demo (<code>{DEMO_LABEL}</code>). El pill del Header
            descontará en vivo y, al cruzar 03:00 / 01:00, cambiará a{' '}
            <code>warn</code> / <code>critical</code> automáticamente.
          </p>
          <Button
            variant={realSession ? 'danger' : 'primary'}
            size='sm'
            onClick={() => setRealSession((s) => !s)}
          >
            {realSession ? 'Stop session' : 'Start 9:42 session'}
          </Button>
        </section>

        <section className='space-y-3'>
          <SectionTitle>Long content (scroll para probar sticky header)</SectionTitle>
          <div className='grid gap-3 sm:grid-cols-2'>
            {Array.from({ length: 14 }).map((_, i) => (
              <GlassCard
                key={i}
                depth={i % 2 === 0 ? 'sm' : 'md'}
                radius='md'
                className='p-5'
                hoverable
              >
                <div className='text-[10px] uppercase tracking-[0.16em] text-white/40 font-display'>
                  Card #{String(i + 1).padStart(2, '0')}
                </div>
                <div className='mt-2 font-display text-base font-semibold text-white'>
                  Glassmorphism over mesh
                </div>
                <p className='mt-1 text-xs text-white/65 leading-relaxed'>
                  El blur, la saturación y el borde semitransparente deberían
                  mantenerse legibles incluso con el mesh animándose detrás.
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className='pt-6 pb-12 space-y-2'>
          <SectionTitle>Footer abajo</SectionTitle>
          <p className='text-xs text-white/55'>
            Scrolleá hasta el final para ver el Footer de 4 columnas + brand +
            newsletter + badges. En &lt;640px las columnas se apilan en 2.
          </p>
        </section>
      </div>
    </LayoutV2>
  )
}

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className='font-display text-sm uppercase tracking-[0.18em] text-white/55'>
    {children}
  </h2>
)
