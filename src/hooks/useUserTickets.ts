import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { hiEventsService } from '../services/hiEventsService'
import type { HiUserTicketsEvent } from '../types/hievents'

export interface UseUserTicketsResult {
  loading: boolean
  error: string | null
  /** Email con el que se consultó (Auth0 hoy; null si no se pudo resolver). */
  email: string | null
  /** Todos los eventos con tickets del usuario. */
  events: HiUserTicketsEvent[]
  /** Eventos futuros (fecha >= ahora) ordenados por fecha ascendente. */
  upcoming: HiUserTicketsEvent[]
  /** Eventos pasados (fecha < ahora) ordenados por fecha descendente. */
  past: HiUserTicketsEvent[]
  totalEvents: number
  totalTickets: number
  /** Re-consulta el endpoint. */
  refresh: () => void
}

const dateMs = (e: HiUserTicketsEvent): number => {
  const t = e.date ? Date.parse(e.date) : NaN
  return Number.isNaN(t) ? 0 : t
}

/**
 * useUserTickets — tickets emitidos del usuario, desde HiEvents
 * (GET /public/user/tickets), agrupados por evento.
 *
 * ⚠️ AUTH0 (TEMPORAL): identificamos al usuario por su email de Auth0. Esto se
 * reemplazará por el LOGIN CUSTOM — cuando eso pase, el ÚNICO cambio acá es de
 * dónde sale `email`; todo lo demás es agnóstico de la fuente. El backend
 * (`/user/tickets`) acepta el email por query param o un Bearer del usuario
 * (que hoy no tenemos). Ver memoria `auth0-login-custom`.
 *
 * En DEV no hay Auth0 (sin `VITE_AUTH0_DOMAIN`) → se usa `VITE_DEV_USER_EMAIL`
 * del `.env` (gitignored) para poder probar con un comprador real local.
 */
export function useUserTickets(): UseUserTicketsResult {
  const { user } = useAuth0()

  const devEmail = import.meta.env.DEV
    ? (import.meta.env.VITE_DEV_USER_EMAIL as string | undefined)
    : undefined
  const email = user?.email ?? devEmail ?? null

  const [events, setEvents] = useState<HiUserTicketsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (!email) {
      setEvents([])
      setLoading(false)
      setError(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    hiEventsService
      .getUserTickets({ email }, controller.signal)
      .then((res) => {
        setEvents(res.data ?? [])
      })
      .catch((e) => {
        if (controller.signal.aborted) return
        setError(e instanceof Error ? e.message : 'No pudimos cargar tus tickets.')
        setEvents([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [email, nonce])

  return useMemo(() => {
    const now = Date.now()
    const upcoming = events
      .filter((e) => dateMs(e) >= now)
      .sort((a, b) => dateMs(a) - dateMs(b))
    const past = events
      .filter((e) => dateMs(e) < now)
      .sort((a, b) => dateMs(b) - dateMs(a))
    const totalTickets = events.reduce((acc, e) => acc + (e.tickets?.length ?? 0), 0)

    return {
      loading,
      error,
      email,
      events,
      upcoming,
      past,
      totalEvents: events.length,
      totalTickets,
      refresh
    }
  }, [events, loading, error, email, refresh])
}
