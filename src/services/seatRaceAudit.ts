/**
 * seatRaceAudit — wrapper alrededor de POST /api/lockSeat que clasifica
 * el error y deja un trail listo para enviar a un toast del cliente.
 *
 * Sustituye al `confirm()` / `alert()` del legacy `TicketEventSale.tsx`.
 * El componente que llama (SeatGrid v2) decide el mensaje visible al
 * usuario; este módulo sólo:
 *   1. hace la llamada,
 *   2. clasifica race conditions (409/423/500),
 *   3. loggea en DEV con suficiente contexto para diagnosticar
 *      colisiones cuando dos pestañas pelean por el mismo asiento.
 */

export interface LockSeatPayload {
  Seat: string
  row: number
  col: number
  subZone: string
  sessionId: string | null
  Event: string | undefined
}

export type LockSeatAction = 'lock' | 'unlock'

export interface LockSeatResult {
  ok: boolean
  /** El servidor rechazó porque otro sessionId ya tiene el asiento. */
  raceDetected: boolean
  /** HTTP status code (cuando se obtuvo respuesta del server). */
  status?: number
  /** Mensaje plano para mostrar al usuario. */
  userMessage?: string
  /** Detalle técnico para logging. */
  error?: string
}

const RACE_STATUSES: ReadonlySet<number> = new Set([409, 423])

const buildUserMessage = (
  action: LockSeatAction,
  raceDetected: boolean,
  status?: number
): string => {
  if (raceDetected) {
    return action === 'lock'
      ? 'That seat was just taken by someone else. Pick another one.'
      : 'Couldn’t release the seat — it may have already changed hands.'
  }
  if (status && status >= 500) {
    return 'Our seat service hiccuped. Tap the seat again to retry.'
  }
  return action === 'lock'
    ? 'Could not hold that seat — check your connection and try again.'
    : 'Could not release that seat — please refresh the map.'
}

const log = (level: 'log' | 'warn' | 'error', ...args: unknown[]) => {
  if (!import.meta.env.DEV) return
  // eslint-disable-next-line no-console
  console[level]('[seatRaceAudit]', ...args)
}

export async function auditedSeatRequest(
  payload: LockSeatPayload,
  action: LockSeatAction
): Promise<LockSeatResult> {
  const startedAt = performance.now()

  try {
    const response = await fetch('/api/lockSeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const elapsed = Math.round(performance.now() - startedAt)

    if (response.ok) {
      log('log', `${action} OK`, {
        seat: payload.Seat,
        ms: elapsed,
        session: payload.sessionId
      })
      return { ok: true, raceDetected: false, status: response.status }
    }

    const status = response.status
    const raceDetected = RACE_STATUSES.has(status)
    const userMessage = buildUserMessage(action, raceDetected, status)

    log('warn', `${action} FAILED`, {
      seat: payload.Seat,
      status,
      raceDetected,
      ms: elapsed,
      session: payload.sessionId,
      subZone: payload.subZone
    })

    return {
      ok: false,
      raceDetected,
      status,
      userMessage,
      error: `HTTP ${status}`
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    log('error', `${action} NETWORK ERROR`, {
      seat: payload.Seat,
      session: payload.sessionId,
      err: message
    })
    return {
      ok: false,
      raceDetected: false,
      userMessage: buildUserMessage(action, false),
      error: message
    }
  }
}

/** Conveniencia: equivalente al lockSeats(seat) del legacy. */
export const lockSeatAudited = (payload: LockSeatPayload) =>
  auditedSeatRequest(payload, 'lock')

/** Conveniencia: idéntica al lock pero con clasificación pensada para unlock. */
export const unlockSeatAudited = (payload: LockSeatPayload) =>
  auditedSeatRequest(payload, 'unlock')
