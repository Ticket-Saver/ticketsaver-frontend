import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { hiEventsService } from '../services/hiEventsService'
import type { HiUserTicketsEvent } from '../types/hievents'

export interface UseUserTicketsResult {
  loading: boolean
  error: string | null
  /** true si hay un customer logueado (login obligatorio para tener tickets). */
  authenticated: boolean
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
 * useUserTickets — tickets emitidos del usuario logueado, desde HiEvents
 * (GET /customer-auth/my-tickets, Bearer del customer), agrupados por evento.
 */
export function useUserTickets(): UseUserTicketsResult {
  const { status } = useAuth()
  const authenticated = status === 'authenticated'

  const [events, setEvents] = useState<HiUserTicketsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (status === 'loading') return
    if (!authenticated) {
      setEvents([])
      setLoading(false)
      setError(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    hiEventsService
      .getMyTickets(controller.signal)
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
  }, [authenticated, status, nonce])

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
      authenticated,
      events,
      upcoming,
      past,
      totalEvents: events.length,
      totalTickets,
      refresh
    }
  }, [events, loading, error, authenticated, refresh])
}
