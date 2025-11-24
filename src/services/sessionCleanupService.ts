/**
 * Servicio de limpieza de sesión
 *
 * Funciones:
 * 1. Libera asientos bloqueados cuando el usuario cierra el navegador
 * 2. Valida que los asientos en localStorage aún pertenezcan a la sesión actual
 * 3. Limpia localStorage si la sesión expiró
 */

/**
 * Obtiene el sessionId de las cookies
 */
export function getSessionId(): string | null {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName.trim() === 'sessionId') {
      return cookieValue
    }
  }
  return null
}

/**
 * Libera todos los asientos bloqueados por la sesión actual
 */
export async function releaseAllSeatsForSession(
  sessionId: string,
  eventLabel: string
): Promise<void> {
  try {
    const localCart = localStorage.getItem('local_cart')
    if (!localCart) return

    const cart = JSON.parse(localCart)
    if (!Array.isArray(cart) || cart.length === 0) return

    if (import.meta.env.DEV) {
      console.log('🧹 Liberando asientos de la sesión:', sessionId)
    }

    // Liberar cada asiento en el carrito
    const unlockPromises = cart.map(async (ticket: any) => {
      const seat = {
        Seat: ticket.seatLabel,
        row: ticket.coords.row,
        col: ticket.coords.col,
        subZone: ticket.subZone,
        sessionId: sessionId,
        Event: eventLabel
      }

      try {
        await fetch('/api/lockSeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seat)
        })
      } catch (error) {
        console.error('Error liberando asiento:', ticket.seatLabel, error)
      }
    })

    await Promise.all(unlockPromises)

    if (import.meta.env.DEV) {
      console.log('✅ Asientos liberados exitosamente')
    }
  } catch (error) {
    console.error('Error en releaseAllSeatsForSession:', error)
  }
}

/**
 * Valida que los asientos en localStorage aún estén bloqueados por esta sesión
 * Retorna solo los asientos válidos
 */
export async function validateLocalCart(sessionId: string, eventLabel: string): Promise<any[]> {
  try {
    const localCart = localStorage.getItem('local_cart')
    if (!localCart) return []

    const cart = JSON.parse(localCart)
    if (!Array.isArray(cart) || cart.length === 0) return []

    if (import.meta.env.DEV) {
      console.log('🔍 Validando', cart.length, 'asientos en localStorage...')
    }

    // Verificar cada asiento en la base de datos
    const validationPromises = cart.map(async (ticket: any) => {
      try {
        const response = await fetch('/api/validateSeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Seat: ticket.seatLabel,
            row: ticket.coords.row,
            col: ticket.coords.col,
            subZone: ticket.subZone,
            sessionId: sessionId,
            Event: eventLabel
          })
        })

        if (!response.ok) {
          if (import.meta.env.DEV) {
            console.warn('❌ Asiento no válido:', ticket.seatLabel)
          }
          return null // Asiento no válido
        }

        const data = await response.json()

        // Verificar que el asiento aún esté bloqueado por esta sesión
        if (data.isValid) {
          return ticket // Asiento válido
        } else {
          if (import.meta.env.DEV) {
            console.warn('❌ Asiento ya no pertenece a esta sesión:', ticket.seatLabel)
          }
          return null
        }
      } catch (error) {
        console.error('Error validando asiento:', ticket.seatLabel, error)
        return null
      }
    })

    const results = await Promise.all(validationPromises)
    const validSeats = results.filter((seat) => seat !== null)

    if (import.meta.env.DEV) {
      console.log(`✅ ${validSeats.length}/${cart.length} asientos válidos`)
    }

    // Si hubo cambios, actualizar localStorage
    if (validSeats.length !== cart.length) {
      localStorage.setItem('local_cart', JSON.stringify(validSeats))

      if (validSeats.length === 0) {
        localStorage.removeItem('local_cart')
      }
    }

    return validSeats
  } catch (error) {
    console.error('Error en validateLocalCart:', error)
    return []
  }
}

/**
 * Limpia completamente la sesión (localStorage + DB)
 */
export async function cleanupSession(sessionId: string, eventLabel: string): Promise<void> {
  try {
    // Liberar asientos en la base de datos
    await releaseAllSeatsForSession(sessionId, eventLabel)

    // Limpiar localStorage
    localStorage.removeItem('local_cart')
    localStorage.removeItem('cart_checkout')

    if (import.meta.env.DEV) {
      console.log('🧹 Sesión limpiada completamente')
    }
  } catch (error) {
    console.error('Error en cleanupSession:', error)
  }
}

/**
 * Registra listeners para detectar cuando el usuario cierra el navegador
 */
export function setupSessionCleanupListeners(sessionId: string, eventLabel: string): () => void {
  const handleBeforeUnload = () => {
    // Usar sendBeacon para enviar la petición incluso si la página se cierra
    const localCart = localStorage.getItem('local_cart')
    if (localCart) {
      const cart = JSON.parse(localCart)

      // Liberar cada asiento usando sendBeacon (más confiable que fetch al cerrar)
      cart.forEach((ticket: any) => {
        const seat = {
          Seat: ticket.seatLabel,
          row: ticket.coords.row,
          col: ticket.coords.col,
          subZone: ticket.subZone,
          sessionId: sessionId,
          Event: eventLabel
        }

        // sendBeacon garantiza que la petición se envíe incluso si la página se cierra
        navigator.sendBeacon(
          '/api/lockSeat',
          new Blob([JSON.stringify(seat)], { type: 'application/json' })
        )
      })

      // Limpiar localStorage
      localStorage.removeItem('local_cart')
      localStorage.removeItem('cart_checkout')
    }
  }

  // Detectar cuando el usuario se va de la página
  window.addEventListener('beforeunload', handleBeforeUnload)

  // Detectar cuando la página se oculta (mobile/cambio de pestaña)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Usuario cambió de pestaña o minimizó - guardar estado
      // NO liberar asientos todavía (puede volver)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Retornar función de limpieza
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

/**
 * Hook para usar en componentes React
 * Uso: const cleanup = useSessionCleanup(eventLabel)
 */
export function initializeSessionCleanup(eventLabel: string): () => void {
  const sessionId = getSessionId()
  if (!sessionId) {
    console.warn('⚠️ No se encontró sessionId')
    return () => {}
  }

  // Validar localStorage al iniciar
  validateLocalCart(sessionId, eventLabel).catch(console.error)

  // Configurar listeners de limpieza
  const cleanup = setupSessionCleanupListeners(sessionId, eventLabel)

  return cleanup
}
