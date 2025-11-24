import { supabase } from '../utils/supabaseClient'

/**
 * Endpoint para validar si un asiento aún está bloqueado por la sesión actual
 *
 * Verifica en la BD si:
 * 1. El asiento existe
 * 2. Está bloqueado (LockedStatus = true)
 * 3. Está bloqueado por esta sesión (LockedBy = sessionId)
 * 4. No ha sido vendido (isTaken = false)
 *
 * Retorna: { isValid: boolean, reason?: string }
 */

exports.handler = async function (event, _context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const { Seat, row, col, subZone, sessionId, Event } = JSON.parse(event.body)

  // Validar que todos los parámetros estén presentes
  if (
    !Seat ||
    typeof row !== 'number' ||
    typeof col !== 'number' ||
    !subZone ||
    !sessionId ||
    !Event
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid request format',
        isValid: false,
        reason: 'Missing required fields'
      })
    }
  }

  try {
    // Consultar el asiento en la base de datos
    const { data: seatData, error: seatError } = await supabase
      .from('YuridiaSeatMap')
      .select('LockedBy, LockedStatus, isTaken, lockedAt')
      .eq('Seat', Seat)
      .eq('subZone', subZone)
      .eq('row', row)
      .eq('col', col)
      .eq('Event', Event)
      .single()

    if (seatError) {
      console.error('Error querying seat:', seatError)
      return {
        statusCode: 200,
        body: JSON.stringify({
          isValid: false,
          reason: 'Seat not found in database'
        })
      }
    }

    // Verificar si el asiento fue vendido
    if (seatData.isTaken) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          isValid: false,
          reason: 'Seat was already sold'
        })
      }
    }

    // Verificar si el asiento está bloqueado por esta sesión
    if (seatData.LockedStatus && seatData.LockedBy === sessionId) {
      // ⏱️ NUEVO: Verificar si el bloqueo expiró (10 minutos)
      if (seatData.lockedAt) {
        const lockedAtDate = new Date(seatData.lockedAt)
        const now = new Date()
        const minutesSinceLocked = (now.getTime() - lockedAtDate.getTime()) / (1000 * 60)

        if (minutesSinceLocked > 10) {
          // Bloqueo expirado
          return {
            statusCode: 200,
            body: JSON.stringify({
              isValid: false,
              reason: 'Lock expired (more than 10 minutes)'
            })
          }
        }
      }

      // Bloqueo válido y no expirado
      return {
        statusCode: 200,
        body: JSON.stringify({
          isValid: true,
          reason: 'Seat is still locked by this session'
        })
      }
    }

    // Si no está bloqueado o está bloqueado por otra sesión
    return {
      statusCode: 200,
      body: JSON.stringify({
        isValid: false,
        reason: seatData.LockedStatus ? 'Seat is locked by another session' : 'Seat was unlocked'
      })
    }
  } catch (error) {
    console.error('Validation error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        isValid: false,
        reason: 'Server error during validation'
      })
    }
  }
}
