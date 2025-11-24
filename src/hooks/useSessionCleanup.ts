import { useEffect, useState } from 'react'
import {
  initializeSessionCleanup,
  validateLocalCart,
  getSessionId
} from '../services/sessionCleanupService'

interface UseSessionCleanupReturn {
  validatedCart: any[] | null
  isValidating: boolean
  sessionId: string | null
}

export function useSessionCleanup(eventLabel: string | undefined): UseSessionCleanupReturn {
  const [validatedCart, setValidatedCart] = useState<any[] | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!eventLabel) {
      setIsValidating(false)
      return
    }

    const sessionId = getSessionId()
    setSessionId(sessionId)

    if (!sessionId) {
      console.warn('⚠️ No se encontró sessionId, no se puede validar el carrito')
      setIsValidating(false)
      return
    }

    // Validar el carrito al montar el componente
    const validateAndInitialize = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('🔄 Inicializando limpieza de sesión para evento:', eventLabel)
        }

        // Validar asientos en localStorage
        const validSeats = await validateLocalCart(sessionId, eventLabel)
        setValidatedCart(validSeats)

        if (import.meta.env.DEV) {
          console.log('✅ Carrito validado:', validSeats.length, 'asientos')
        }
      } catch (error) {
        console.error('Error validando carrito:', error)
        setValidatedCart([])
      } finally {
        setIsValidating(false)
      }
    }

    validateAndInitialize()

    // Configurar limpieza automática al cerrar navegador
    const cleanup = initializeSessionCleanup(eventLabel)

    // Cleanup al desmontar el componente
    return () => {
      cleanup()
    }
  }, [eventLabel])

  return { validatedCart, isValidating, sessionId }
}
