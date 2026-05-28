import supabase from '../components/supabaseClient'

/**
 * queueService — Sala de espera virtual.
 *
 * En B7 corremos una **simulación in-memory** porque el cliente todavía
 * no expuso las tablas de queue en Supabase. La API pública del módulo
 * coincide con lo que la versión real necesitará (joinQueue / getPosition),
 * así que cuando enchufemos Supabase real basta con reemplazar la
 * implementación interna sin tocar al consumer.
 *
 * URL params para testing:
 *   ?queueSpeed=300   → 300 personas por segundo (más rápido).
 *   ?queueStart=200   → arranca con esa posición.
 *   ?queueTotal=5000  → total de la cola.
 *   ?queueForce=next  → fuerza el state.
 */

export type QueueStateKind = 'far' | 'close' | 'next' | 'released'

export interface QueueSnapshot {
  state: QueueStateKind
  /** Posición actual del usuario en la cola. 0 = puerta. */
  position: number
  /** Total de personas en la cola (incluye al usuario). */
  total: number
  /** Estimación humana del tiempo de espera. */
  eta: string
  /** Progreso 0–1 (1 == released). */
  pct: number
}

export interface JoinQueueResult {
  ticketId: string
  joinedAt: number
  initialPosition: number
  total: number
}

interface QueueRecord {
  ticketId: string
  joinedAt: number
  initialPosition: number
  total: number
  eventLabel: string
  /** Override del state para testing. */
  forcedState?: QueueStateKind
}

const records = new Map<string, QueueRecord>()

const DEFAULT_SPEED = 180 // personas por segundo
const DEFAULT_START = 3800
const DEFAULT_TOTAL = 12500

const getQueueParams = () => {
  if (typeof window === 'undefined') {
    return {
      speed: DEFAULT_SPEED,
      start: DEFAULT_START,
      total: DEFAULT_TOTAL,
      force: undefined as QueueStateKind | undefined
    }
  }
  const sp = new URLSearchParams(window.location.search)
  const speed = Number(sp.get('queueSpeed')) || DEFAULT_SPEED
  const start = Number(sp.get('queueStart')) || DEFAULT_START
  const total = Number(sp.get('queueTotal')) || DEFAULT_TOTAL
  const force = sp.get('queueForce') as QueueStateKind | null
  return {
    speed,
    start,
    total,
    force:
      force === 'far' || force === 'close' || force === 'next' || force === 'released'
        ? force
        : undefined
  }
}

const formatEta = (position: number, speed: number): string => {
  if (position <= 0) return 'Go!'
  const secs = Math.round(position / speed)
  if (secs < 30) return '< 30 s'
  if (secs < 120) return `~${Math.round(secs / 10) * 10} s`
  const mins = Math.round(secs / 60)
  return `~${mins} min`
}

const classifyState = (
  position: number,
  initialPosition: number
): QueueStateKind => {
  if (position <= 0) return 'released'
  if (position <= 5) return 'next'
  const remainingPct = position / initialPosition
  if (remainingPct <= 0.3) return 'close'
  return 'far'
}

const computeSnapshotForRecord = (record: QueueRecord): QueueSnapshot => {
  const { speed, force } = getQueueParams()
  const elapsed = (Date.now() - record.joinedAt) / 1000
  const rawPosition = record.initialPosition - elapsed * speed
  const position = Math.max(0, Math.floor(rawPosition))
  const baseState = classifyState(position, record.initialPosition)
  const finalState: QueueStateKind = record.forcedState ?? force ?? baseState

  const adjustedPosition =
    finalState === 'released'
      ? 0
      : finalState === 'next'
        ? Math.min(position, 3)
        : finalState === 'close'
          ? Math.max(position, Math.round(record.initialPosition * 0.05))
          : position

  const pct =
    finalState === 'released'
      ? 1
      : Math.max(
          0,
          Math.min(0.99, 1 - adjustedPosition / record.initialPosition)
        )

  return {
    state: finalState,
    position: adjustedPosition,
    total: record.total,
    eta: formatEta(adjustedPosition, speed),
    pct
  }
}

/* ─────────────── Public API ─────────────── */

export const joinQueue = async (
  eventLabel: string
): Promise<JoinQueueResult> => {
  // Reusamos un ticketId existente si el usuario ya joineó esta cola
  // recientemente (evita re-shuffle al re-mount del hook).
  for (const r of records.values()) {
    if (r.eventLabel === eventLabel) {
      return {
        ticketId: r.ticketId,
        joinedAt: r.joinedAt,
        initialPosition: r.initialPosition,
        total: r.total
      }
    }
  }

  const { start, total } = getQueueParams()
  const ticketId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const record: QueueRecord = {
    ticketId,
    joinedAt: Date.now(),
    initialPosition: start,
    total,
    eventLabel
  }
  records.set(ticketId, record)
  if (import.meta.env.DEV) {
    console.log('[queueService] joined', { ticketId, eventLabel, start, total })
  }
  return {
    ticketId,
    joinedAt: record.joinedAt,
    initialPosition: start,
    total
  }
}

export const getPosition = async (
  _eventLabel: string,
  ticketId: string
): Promise<QueueSnapshot> => {
  const record = records.get(ticketId)
  if (!record) {
    return {
      state: 'released',
      position: 0,
      total: 0,
      eta: '—',
      pct: 1
    }
  }
  return computeSnapshotForRecord(record)
}

export const leaveQueue = async (ticketId: string): Promise<void> => {
  records.delete(ticketId)
}

/* ─────────────── Supabase wiring (TODO real) ─────────────── */

/**
 * Suscripción al canal `queue:{eventLabel}` cuando exista server real.
 * Por ahora retorna un noop unsubscribe — el polling del hook cubre la
 * actualización.
 */
export const subscribeToQueue = (
  eventLabel: string,
  onUpdate: (snapshot: QueueSnapshot) => void
): (() => void) => {
  if (!supabase || typeof supabase.channel !== 'function') {
    void eventLabel
    void onUpdate
    return () => {}
  }
  // const channel = supabase
  //   .channel(`queue:${eventLabel}`)
  //   .on('broadcast', { event: 'position' }, ({ payload }) => onUpdate(payload as QueueSnapshot))
  //   .subscribe()
  // return () => { void supabase.removeChannel(channel) }
  void eventLabel
  void onUpdate
  return () => {}
}
