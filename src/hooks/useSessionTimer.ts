import { useState, useEffect, useCallback } from 'react'

/**
 * Hook para manejar el timer de sesión de compra
 *
 * Características:
 * - Timer de X minutos desde que se selecciona el primer asiento
 * - Muestra cuenta regresiva
 * - Libera asientos automáticamente al expirar
 * - Bloquea checkout si el tiempo se agotó
 * - Advertencias visuales cuando queda poco tiempo
 *
 * @param eventLabel - ID del evento
 * @param timeoutMinutes - Minutos antes de expirar (default: 10)
 * @returns Estado del timer
 */

export interface SessionTimerState {
  timeRemaining: number // Segundos restantes
  isExpired: boolean // Si la sesión expiró
  isWarning: boolean // Si quedan menos de 3 minutos
  isCritical: boolean // Si queda menos de 1 minuto
  hasStarted: boolean // Si el timer inició (primer asiento seleccionado)
  formattedTime: string // Tiempo formateado "MM:SS"
  startTimer: () => void // Iniciar el timer manualmente
  resetTimer: () => void // Reiniciar el timer
  extendTimer: (minutes: number) => void // Extender tiempo
  /** Ata el contador a un vencimiento absoluto del servidor (reserved_until de la orden). */
  syncToServerExpiry: (expiresAtMs: number) => void
}

/**
 * Custom event que se dispara cuando una instancia del hook escribe en
 * localStorage. Permite que otras instancias (e.g. el CountdownPill del
 * Header y el SeatGrid del paso 2) se mantengan sincronizadas dentro de
 * la misma pestaña — el evento `storage` nativo sólo cross-tab.
 */
const SYNC_EVENT = 'tsv:session-timer:update'

const broadcastSync = (storageKey: string) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { storageKey } }))
}

export function useSessionTimer(
  eventLabel: string | undefined,
  timeoutMinutes: number = 10
): SessionTimerState {
  const STORAGE_KEY = `session_timer_${eventLabel}`
  const TIMEOUT_MS = timeoutMinutes * 60 * 1000 // Convertir a milisegundos

  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(timeoutMinutes * 60)
  const [isExpired, setIsExpired] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  // Calcular estados derivados
  const isWarning = timeRemaining <= 180 && timeRemaining > 60 // < 3 min
  const isCritical = timeRemaining <= 60 && timeRemaining > 0 // < 1 min

  // Formatear tiempo como "MM:SS"
  const formattedTime = `${Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`

  /**
   * Iniciar el timer
   */
  const startTimer = useCallback(() => {
    const now = Date.now()
    const newExpiresAt = now + TIMEOUT_MS

    setExpiresAt(newExpiresAt)
    setHasStarted(true)
    setIsExpired(false)

    // Guardar en localStorage para persistir entre recargas
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        expiresAt: newExpiresAt,
        startedAt: now
      })
    )

    if (import.meta.env.DEV) {
      console.log('⏱️ Timer iniciado:', timeoutMinutes, 'minutos')
    }

    broadcastSync(STORAGE_KEY)
  }, [STORAGE_KEY, TIMEOUT_MS, timeoutMinutes])

  /**
   * Reiniciar el timer (limpiar todo)
   */
  const resetTimer = useCallback(() => {
    setExpiresAt(null)
    setHasStarted(false)
    setIsExpired(false)
    setTimeRemaining(timeoutMinutes * 60)
    localStorage.removeItem(STORAGE_KEY)

    if (import.meta.env.DEV) {
      console.log('🔄 Timer reiniciado')
    }

    broadcastSync(STORAGE_KEY)
  }, [STORAGE_KEY, timeoutMinutes])

  /**
   * Extender el timer X minutos adicionales
   */
  const extendTimer = useCallback(
    (minutes: number) => {
      if (!expiresAt) return

      const extension = minutes * 60 * 1000
      const newExpiresAt = expiresAt + extension

      setExpiresAt(newExpiresAt)

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          expiresAt: newExpiresAt,
          startedAt: Date.now() - TIMEOUT_MS
        })
      )

      if (import.meta.env.DEV) {
        console.log('⏱️ Timer extendido:', minutes, 'minutos')
      }

      broadcastSync(STORAGE_KEY)
    },
    [expiresAt, STORAGE_KEY, TIMEOUT_MS]
  )

  /**
   * Ata el contador al vencimiento REAL de la reserva en HiEvents (reserved_until).
   * Se llama al crear la orden (hold al confirmar): el reloj que ve el usuario pasa
   * a reflejar los minutos reales que tiene para pagar, no el contador local.
   */
  const syncToServerExpiry = useCallback(
    (expiresAtMs: number) => {
      if (!expiresAtMs || Number.isNaN(expiresAtMs)) return
      const now = Date.now()
      setExpiresAt(expiresAtMs)
      setHasStarted(true)
      setIsExpired(expiresAtMs <= now)
      setTimeRemaining(Math.max(0, Math.floor((expiresAtMs - now) / 1000)))
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiresAt: expiresAtMs, startedAt: now }))
      broadcastSync(STORAGE_KEY)
    },
    [STORAGE_KEY]
  )

  /**
   * Recuperar timer de localStorage al montar — y re-hidratar cuando
   * otra instancia del hook (misma pestaña) o cambios externos
   * (cross-tab) modifican la clave.
   */
  useEffect(() => {
    if (!eventLabel) return

    const hydrateFromStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        // Otra instancia limpió el timer → reseteamos nuestro estado.
        setExpiresAt(null)
        setHasStarted(false)
        setIsExpired(false)
        setTimeRemaining(timeoutMinutes * 60)
        return
      }
      try {
        const { expiresAt: storedExpiresAt } = JSON.parse(stored)
        const now = Date.now()

        if (storedExpiresAt > now) {
          setExpiresAt(storedExpiresAt)
          setHasStarted(true)
          setIsExpired(false)
        } else {
          setIsExpired(true)
          setHasStarted(true)
          setTimeRemaining(0)
        }
      } catch (error) {
        console.error('Error recuperando timer:', error)
      }
    }

    hydrateFromStorage()

    const onCustomSync = (e: Event) => {
      const detail = (e as CustomEvent<{ storageKey: string }>).detail
      if (!detail || detail.storageKey === STORAGE_KEY) hydrateFromStorage()
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === STORAGE_KEY) hydrateFromStorage()
    }

    window.addEventListener(SYNC_EVENT, onCustomSync)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(SYNC_EVENT, onCustomSync)
      window.removeEventListener('storage', onStorage)
    }
  }, [eventLabel, STORAGE_KEY, timeoutMinutes])

  /**
   * Actualizar cuenta regresiva cada segundo
   */
  useEffect(() => {
    if (!hasStarted || !expiresAt || isExpired) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))

      setTimeRemaining(remaining)

      if (remaining === 0) {
        setIsExpired(true)
        clearInterval(interval)
        // La liberación real del asiento la hace el backend: HiEvents cancela la
        // orden RESERVED vencida con su cron (cada minuto) y devuelve el asiento
        // al pool. El front sólo marca la expiración; el cartContext limpia el
        // carrito local al detectar isExpired. (Antes esto pegaba al sistema de
        // locks Supabase, que ya no existe.)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [hasStarted, expiresAt, isExpired, eventLabel])

  /**
   * Advertencias en console según tiempo restante
   */
  useEffect(() => {
    if (!import.meta.env.DEV) return

    if (isCritical && timeRemaining === 60) {
      console.warn('⚠️ ADVERTENCIA: Queda 1 minuto para completar tu compra!')
    } else if (isWarning && timeRemaining === 180) {
      console.warn('⚠️ Quedan 3 minutos para completar tu compra')
    }
  }, [isCritical, isWarning, timeRemaining])

  return {
    timeRemaining,
    isExpired,
    isWarning,
    isCritical,
    hasStarted,
    formattedTime,
    startTimer,
    resetTimer,
    extendTimer,
    syncToServerExpiry
  }
}
