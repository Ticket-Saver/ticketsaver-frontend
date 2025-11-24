import { supabase } from '../utils/supabaseClient'

/**
 * Función de limpieza de bloqueos expirados
 *
 * Libera automáticamente asientos bloqueados hace más de 10 minutos
 *
 * Uso:
 * - Puede ser llamada manualmente
 * - Puede ser programada con Netlify Scheduled Functions
 * - Puede ser ejecutada por un cron job externo
 *
 * Endpoint: /.netlify/functions/cleanupExpiredLocks
 * Method: POST
 * Body: { Event?: string } (opcional - si no se proporciona, limpia todos los eventos)
 */

exports.handler = async function (event, _context) {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parsear body si existe
    let eventFilter = null
    if (event.body) {
      try {
        const body = JSON.parse(event.body)
        eventFilter = body.Event
      } catch {
        // Ignorar si no hay body válido
      }
    }

    // Calcular timestamp de hace 10 minutos
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    console.log('🧹 Limpiando bloqueos expirados antes de:', tenMinutesAgo)

    // Construir query
    let query = supabase
      .from('YuridiaSeatMap')
      .update({
        LockedStatus: false,
        LockedBy: null,
        lockedAt: null
      })
      .eq('LockedStatus', true)
      .eq('isTaken', false)
      .lt('lockedAt', tenMinutesAgo)

    // Filtrar por evento si se especificó
    if (eventFilter) {
      query = query.eq('Event', eventFilter)
      console.log('📍 Limpiando solo evento:', eventFilter)
    } else {
      console.log('📍 Limpiando todos los eventos')
    }

    const { data, error, count } = await query.select()

    if (error) {
      console.error('Error limpiando bloqueos expirados:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to cleanup expired locks',
          details: error.message
        })
      }
    }

    const releasedCount = data ? data.length : 0

    console.log(`✅ ${releasedCount} asientos liberados`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        releasedSeats: releasedCount,
        message: `Successfully released ${releasedCount} expired seat locks`,
        event: eventFilter || 'all events',
        cutoffTime: tenMinutesAgo
      })
    }
  } catch (error) {
    console.error('Server error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    }
  }
}
