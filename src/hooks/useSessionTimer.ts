import { useState, useEffect, useCallback } from 'react'
import { releaseAllSeatsForSession, getSessionId } from '../services/sessionCleanupService'

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
    },
    [expiresAt, STORAGE_KEY, TIMEOUT_MS]
  )

  /**
   * Recuperar timer de localStorage al montar
   */
  useEffect(() => {
    if (!eventLabel) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const { expiresAt: storedExpiresAt } = JSON.parse(stored)
        const now = Date.now()

        if (storedExpiresAt > now) {
          // Timer aún válido
          setExpiresAt(storedExpiresAt)
          setHasStarted(true)
          setIsExpired(false)

          if (import.meta.env.DEV) {
            console.log('✅ Timer recuperado de localStorage')
          }
        } else {
          // Timer expiró mientras estaba fuera
          setIsExpired(true)
          setHasStarted(true)
          setTimeRemaining(0)

          if (import.meta.env.DEV) {
            console.log('⏰ Timer expiró mientras estabas fuera')
          }
        }
      } catch (error) {
        console.error('Error recuperando timer:', error)
      }
    }
  }, [eventLabel, STORAGE_KEY])

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

        // Liberar asientos automáticamente
        const sessionId = getSessionId()
        if (sessionId && eventLabel) {
          if (import.meta.env.DEV) {
            console.log('⏰ Sesión expirada, liberando asientos...')
          }

          releaseAllSeatsForSession(sessionId, eventLabel)
            .then(() => {
              if (import.meta.env.DEV) {
                console.log('✅ Asientos liberados por expiración')
              }
            })
            .catch((error) => {
              console.error('Error liberando asientos:', error)
            })
        }
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
    extendTimer
  }
}
