import supabase from '../components/supabaseClient'

/**
 * queueService — Sala de espera virtual (Supabase Postgres + Realtime).
 *
 * Cada join() inserta una fila nueva en `queue_entries` — salir de la cola
 * y reentrar SIEMPRE da una posición nueva (anti-gaming, requisito explícito).
 * La posición y el paso a "admitted" llegan por Realtime, con polling de
 * respaldo (ver useQueuePosition) por si el websocket se cae.
 *
 * La policy de UPDATE de `queue_entries` fue eliminada: los cambios de
 * estado pasan por RPCs (queue_heartbeat, queue_leave) en vez de update directo.
 */

export type QueueStateKind = 'far' | 'close' | 'next' | 'released'

export interface QueueSnapshot {
  state: QueueStateKind
  /** Posición actual del usuario en la cola. 0 = puerta. */
  position: number
  /** Total de personas esperando en la cola. */
  total: number
  /** Estimación humana del tiempo de espera. */
  eta: string
  /** Progreso 0–1 (1 == released). */
  pct: number
}

export interface JoinQueueResult {
  entryId: string
  admissionToken: string | null
}

export type QueueEntryRow = {
  id: string
  status: 'waiting' | 'admitted' | 'abandoned'
  admission_token: string | null
}

const HEARTBEAT_INTERVAL_MS = 10_000

// El backend ahora expone admission_rate_per_minute en el endpoint público
// de queue-settings. Si no viene (o falla el fetch), usamos esta tasa asumida.
const FALLBACK_RATE_PER_MINUTE = 100

const formatEta = (position: number, ratePerMinute?: number): string => {
  if (position <= 0) return 'Go!'
  const rate = ratePerMinute ?? FALLBACK_RATE_PER_MINUTE
  const secs = Math.round((position / rate) * 60)
  if (secs < 30) return '< 30 s'
  if (secs < 120) return `~${Math.round(secs / 10) * 10} s`
  const mins = Math.round(secs / 60)
  return `~${mins} min`
}

const classifyState = (position: number, initialPosition: number): QueueStateKind => {
  if (position <= 0) return 'released'
  if (position <= 5) return 'next'
  const remainingPct = position / Math.max(initialPosition, 1)
  if (remainingPct <= 0.3) return 'close'
  return 'far'
}

export const buildSnapshot = (
  position: number,
  total: number,
  initialPosition: number,
  ratePerMinute?: number
): QueueSnapshot => {
  const state = classifyState(position, initialPosition)
  const pct = state === 'released' ? 1 : Math.max(0, Math.min(0.99, 1 - position / Math.max(initialPosition, 1)))
  return { state, position, total, eta: formatEta(position, ratePerMinute), pct }
}

/* ─────────────── Public API ─────────────── */

export const joinQueue = async (eventId: number): Promise<JoinQueueResult> => {
  if (!supabase) throw new Error('Supabase no está configurado')

  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('Se requiere sesión para unirse a la cola')

  const { data, error } = await supabase
    .from('queue_entries')
    .insert({ event_id: eventId, user_id: userId })
    .select('id, status, admission_token')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'No se pudo unir a la cola')

  return { entryId: data.id, admissionToken: data.admission_token }
}

export const getPosition = async (
  eventId: number,
  entryId: string
): Promise<{ position: number; total: number } | null> => {
  if (!supabase) return null

  // El total se contaba antes client-side con .select('id', {count:'exact'}),
  // pero RLS sólo deja ver las filas propias del usuario: el count siempre
  // daba ~1. Ahora usa la RPC get_queue_total, que corre con permisos elevados.
  const [{ data: position }, { data: total }] = await Promise.all([
    supabase.rpc('get_queue_position', { p_event_id: eventId, p_entry_id: entryId }),
    supabase.rpc('get_queue_total', { p_event_id: eventId })
  ])

  if (position === null || position === undefined) return null
  return { position, total: total ?? 0 }
}

export const getEntry = async (entryId: string): Promise<QueueEntryRow | null> => {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('queue_entries')
    .select('id, status, admission_token')
    .eq('id', entryId)
    .maybeSingle()
  if (error || !data) return null
  return data
}

export const leaveQueue = async (entryId: string): Promise<void> => {
  if (!supabase) return
  await supabase.rpc('queue_leave', { p_entry_id: entryId })
}

export const sendHeartbeat = async (entryId: string): Promise<void> => {
  if (!supabase) return
  await supabase.rpc('queue_heartbeat', { p_entry_id: entryId })
}

export const startHeartbeat = (entryId: string): (() => void) => {
  const interval = window.setInterval(() => {
    sendHeartbeat(entryId).catch(() => {})
  }, HEARTBEAT_INTERVAL_MS)
  return () => window.clearInterval(interval)
}

/**
 * Suscripción Realtime a la propia fila en `queue_entries`. Llama a
 * onUpdate en cada cambio de status/admission_token (RLS ya limita a
 * las filas del propio usuario).
 */
export const subscribeToEntry = (
  entryId: string,
  onUpdate: (row: QueueEntryRow) => void
): (() => void) => {
  if (!supabase) return () => {}

  const channel = supabase
    .channel(`queue_entry:${entryId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'queue_entries', filter: `id=eq.${entryId}` },
      (payload) => onUpdate(payload.new as QueueEntryRow)
    )
    .subscribe()

  return () => {
    void supabase!.removeChannel(channel)
  }
}
