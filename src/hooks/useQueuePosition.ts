import { useEffect, useRef, useState } from 'react'
import {
  buildSnapshot,
  getEntry,
  getPosition,
  joinQueue,
  sendHeartbeat,
  startHeartbeat,
  subscribeToEntry,
  type JoinQueueResult,
  type QueueEntryRow,
  type QueueSnapshot
} from '../services/queueService'
import { hiEventsService } from '../services/hiEventsService'

export interface UseQueuePositionResult {
  loading: boolean
  snapshot: QueueSnapshot | null
  entryId: string | null
  admissionToken: string | null
  error: string | null
  rejoin: () => void
}

const POLL_INTERVAL_MS = 5_000
const sessionKey = (eventId: number) => `queue_entry:${eventId}`

/**
 * Hook que se conecta a la cola virtual para un evento vía Supabase.
 * Join al montar (o reusa una entrada persistida en sessionStorage tras un
 * F5), heartbeat cada 10s, posición vía Realtime + polling de respaldo cada
 * 5s (Realtime es aceleración, no la única fuente: si el websocket se cae
 * el polling igual avanza).
 *
 * No abandona la cola al desmontar: con el entryId persistido y el umbral
 * de 90s de expiración por heartbeat en el servidor, un remount de
 * StrictMode o un F5 ya no tiran la posición del usuario.
 */
export function useQueuePosition(eventId: number | undefined): UseQueuePositionResult {
  const [snapshot, setSnapshot] = useState<QueueSnapshot | null>(null)
  const [entryId, setEntryId] = useState<string | null>(null)
  const [admissionToken, setAdmissionToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const initialPositionRef = useRef<number | null>(null)
  const rateRef = useRef<number | undefined>(undefined)
  const joinRef = useRef<{ eventId: number; promise: Promise<JoinQueueResult> } | null>(null)

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    let stopHeartbeat: (() => void) | null = null
    let unsubscribe: (() => void) | null = null
    let pollInterval: number | null = null

    const stopAll = () => {
      stopHeartbeat?.()
      unsubscribe?.()
      if (pollInterval !== null) window.clearInterval(pollInterval)
    }

    const handleAbandoned = () => {
      sessionStorage.removeItem(sessionKey(eventId))
      stopAll()
      setError('Your spot expired due to inactivity.')
      setLoading(false)
    }

    // Mantiene la MISMA identidad de objeto si ya estaba released: sin esa
    // guarda cada poll creaba un snapshot nuevo, el effect de redirect de
    // QueueV2 se reiniciaba cada 5s y su timer de gracia nunca vencía.
    // Y si todavía no había snapshot (posición nunca resuelta) construye uno,
    // porque un `prev ? ... : prev` dejaba al admitido colgado para siempre.
    const markReleased = () => {
      setSnapshot((prev) =>
        prev?.state === 'released'
          ? prev
          : { state: 'released', position: 0, total: prev?.total ?? 0, eta: 'Go!', pct: 1 }
      )
      setLoading(false)
    }

    const refreshSnapshot = async (id: string) => {
      const pos = await getPosition(eventId, id)
      if (cancelled || !pos) return
      if (initialPositionRef.current === null) initialPositionRef.current = pos.position
      setSnapshot(buildSnapshot(pos.position, pos.total, initialPositionRef.current, rateRef.current))
      setLoading(false)
    }

    // Polling de respaldo: relee la propia fila por si Realtime se perdió
    // un evento (websocket caído, reconexión, tab en background, etc.).
    const poll = async (id: string) => {
      const row = await getEntry(id)
      if (cancelled || !row) return
      if (row.admission_token) setAdmissionToken(row.admission_token)
      if (row.status === 'admitted') {
        markReleased()
        return
      }
      if (row.status === 'abandoned') {
        handleAbandoned()
        return
      }
      refreshSnapshot(id).catch(() => {})
    }

    // Los navegadores throttlean los timers en pestañas de fondo: al volver
    // a foco forzamos un heartbeat + poll inmediato en vez de esperar al timer.
    const makeVisibilityHandler = (id: string) => () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat(id).catch(() => {})
        poll(id).catch(() => {})
      }
    }
    let onVisibilityChange: (() => void) | null = null

    const start = async () => {
      try {
        // Tasa de admisión real para el ETA (D12). Si falla, seguimos con
        // el fallback del servicio — nunca romper la cola por esto.
        hiEventsService
          .getQueueSettings(eventId)
          .then((settings) => {
            // El tipo público no declara admission_rate_per_minute (es un campo
            // nuevo del backend); accedemos con un cast local acotado.
            const rate = (settings as { admission_rate_per_minute?: number }).admission_rate_per_minute
            if (typeof rate === 'number') rateRef.current = rate
          })
          .catch(() => {})

        // Reuso de entrada tras F5: sin esto, recargar la página manda al
        // usuario al final de la cola con una fila nueva.
        const key = sessionKey(eventId)
        const savedId = sessionStorage.getItem(key)
        let result: { entryId: string; admissionToken: string | null } | null = null
        let reusedAdmitted = false

        if (savedId) {
          const row = await getEntry(savedId)
          if (row && (row.status === 'waiting' || row.status === 'admitted')) {
            result = { entryId: row.id, admissionToken: row.admission_token }
            reusedAdmitted = row.status === 'admitted'
          } else {
            sessionStorage.removeItem(key)
          }
        }

        if (!result) {
          // StrictMode monta dos veces y el segundo montaje arranca antes de que
          // resuelva el primer joinQueue: sin este guard se insertan DOS filas y
          // la huérfana queda 'waiting' delante del usuario inflando su posición.
          // El ref sobrevive al remonte de StrictMode (misma instancia).
          if (joinRef.current?.eventId !== eventId) {
            joinRef.current = { eventId, promise: joinQueue(eventId) }
          }
          result = await joinRef.current.promise
          sessionStorage.setItem(key, result.entryId)
        }

        if (cancelled) return
        setEntryId(result.entryId)
        if (result.admissionToken) setAdmissionToken(result.admissionToken)

        stopHeartbeat = startHeartbeat(result.entryId)
        unsubscribe = subscribeToEntry(result.entryId, (row: QueueEntryRow) => {
          if (row.admission_token) setAdmissionToken(row.admission_token)
          if (row.status === 'admitted') {
            markReleased()
            return
          }
          if (row.status === 'abandoned') {
            handleAbandoned()
            return
          }
          refreshSnapshot(result!.entryId).catch(() => {})
        })

        pollInterval = window.setInterval(() => poll(result!.entryId), POLL_INTERVAL_MS)
        onVisibilityChange = makeVisibilityHandler(result.entryId)
        document.addEventListener('visibilitychange', onVisibilityChange)

        // Si la entrada reusada (F5 estando ya admitido) venía 'admitted', un
        // refreshSnapshot la pintaría con posición de cola durante 5s hasta el
        // primer poll, y QueueV2 no redirigiría en ese hueco.
        if (reusedAdmitted) markReleased()
        else await refreshSnapshot(result.entryId)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      }
    }

    start()

    return () => {
      cancelled = true
      stopAll()
      if (onVisibilityChange) document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  const rejoin = () => {
    // ponytail: reload en vez de re-ejecutar el effect; es una acción del
    // usuario, no vale la complejidad de resetear todo el estado a mano.
    if (eventId) sessionStorage.removeItem(sessionKey(eventId))
    window.location.reload()
  }

  return { loading, snapshot, entryId, admissionToken, error, rejoin }
}
