import { useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import Pill from './Pill'
import { useSessionTimer } from '../../hooks/useSessionTimer'
import type { PillState, Size } from '../../types/ui'

/**
 * CountdownPill — pill que muestra el timer de 10 min de sesión de compra.
 *
 * Conecta `useSessionTimer` con el primitive `Pill`. Maneja 3 estados
 * activos (normal · warn < 3min · critical < 1min) y un cuarto `expired`
 * que se muestra brevemente antes de que el flujo redirija.
 *
 * - Sin `eventLabel` ni mock: detecta el label de la URL automáticamente
 *   (rutas /event, /sale y /queue) y, si no encuentra ninguno, no
 *   renderiza nada.
 * - Con `eventLabel`: lo usa explícitamente (útil para CTAs externos).
 * - Con `mock`: bypassea el hook (útil para /_layout-check).
 */

const ROUTE_PATTERNS = [
  '/event/:name/:venue/:date/:label/:delete?',
  '/sale/:name/:venue/:location/:date/:label/:delete?',
  '/queue/:label'
]

const detectEventLabel = (pathname: string): string | undefined => {
  for (const pattern of ROUTE_PATTERNS) {
    const match = matchPath(pattern, pathname)
    const label = match?.params?.label
    if (label) return label
  }
  return undefined
}

interface CountdownPillProps {
  /** Override explícito del label. Si no se pasa, se detecta de la URL. */
  eventLabel?: string
  /** Minutos totales del timer. Default 10. */
  timeoutMinutes?: number
  size?: Size
  /** Render mock — bypassea el hook (sólo para verificación). */
  mock?: { state: PillState; label: string }
  className?: string
}

export default function CountdownPill({
  eventLabel,
  timeoutMinutes = 10,
  size = 'md',
  mock,
  className
}: CountdownPillProps) {
  const { pathname } = useLocation()

  const resolvedLabel = useMemo(
    () => eventLabel ?? detectEventLabel(pathname),
    [eventLabel, pathname]
  )

  const timer = useSessionTimer(resolvedLabel, timeoutMinutes)

  if (mock) {
    return (
      <Pill
        state={mock.state}
        size={size}
        leadingDot
        dotPulse={mock.state === 'warn' || mock.state === 'critical'}
        className={className}
        aria-label={`Session time mock: ${mock.label}`}
      >
        {mock.label}
      </Pill>
    )
  }

  // Sin label en la URL ni explícito: nada que mostrar
  if (!resolvedLabel) return null

  // Timer no inició aún (usuario no seleccionó asiento): no se muestra
  if (!timer.hasStarted) return null

  const state: PillState = timer.isExpired
    ? 'expired'
    : timer.isCritical
      ? 'critical'
      : timer.isWarning
        ? 'warn'
        : 'normal'

  const isPulsing = state === 'warn' || state === 'critical'

  return (
    <Pill
      state={state}
      size={size}
      leadingDot
      dotPulse={isPulsing}
      className={className}
      aria-live={isPulsing ? 'polite' : 'off'}
      aria-label={`Tiempo restante: ${timer.formattedTime}`}
    >
      {timer.formattedTime}
    </Pill>
  )
}
