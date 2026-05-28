import { useEffect, useRef, useState } from 'react'
import {
  getPosition,
  joinQueue,
  leaveQueue,
  type QueueSnapshot
} from '../services/queueService'

export interface UseQueuePositionResult {
  loading: boolean
  snapshot: QueueSnapshot | null
  ticketId: string | null
  error: string | null
}

const POLL_INTERVAL_MS = 1500

/**
 * Hook que se conecta a la cola virtual para un evento. Joinea al
 * montar, hace polling de la posición y devuelve un snapshot reactivo.
 * El polling se detiene cuando se libera al usuario (state === 'released').
 *
 * Limpieza: al desmontar libera el spot (best effort). El hook tolera
 * desmontes intermitentes — el queueService reusa el ticketId si vuelve
 * a joinear el mismo evento.
 */
export function useQueuePosition(
  eventLabel: string | undefined
): UseQueuePositionResult {
  const [snapshot, setSnapshot] = useState<QueueSnapshot | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const stoppedRef = useRef(false)

  useEffect(() => {
    if (!eventLabel) return
    let cancelled = false
    stoppedRef.current = false

    const start = async () => {
      try {
        const result = await joinQueue(eventLabel)
        if (cancelled) return
        setTicketId(result.ticketId)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      }
    }

    start()

    return () => {
      cancelled = true
      stoppedRef.current = true
    }
  }, [eventLabel])

  useEffect(() => {
    if (!eventLabel || !ticketId) return
    let interval: number | null = null
    let cancelled = false

    const tick = async () => {
      try {
        const snap = await getPosition(eventLabel, ticketId)
        if (cancelled) return
        setSnapshot(snap)
        setLoading(false)
        if (snap.state === 'released' && interval !== null) {
          window.clearInterval(interval)
          interval = null
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      }
    }

    tick()
    interval = window.setInterval(tick, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      if (interval !== null) window.clearInterval(interval)
    }
  }, [eventLabel, ticketId])

  // Limpieza al desmontar el hook entero (no en cada effect cleanup).
  useEffect(() => {
    return () => {
      if (ticketId && stoppedRef.current) {
        leaveQueue(ticketId).catch(() => {})
      }
    }
  }, [ticketId])

  return { loading, snapshot, ticketId, error }
}
