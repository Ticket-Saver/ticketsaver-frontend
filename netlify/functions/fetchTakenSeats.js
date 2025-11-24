import { supabase } from '../utils/supabaseClient'

exports.handler = async function (event, _context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }
  console.log(event.body)
  const { subZone, Event } = JSON.parse(event.body)
  console.log(subZone)
  console.log(Event)
  // Validate subZone is provided and is a string
  if (typeof subZone !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid request format: subZone is required and must be a string.'
      })
    }
  }

  try {
    // 🧹 PASO 1: Limpiar bloqueos expirados (lazy cleanup)
    // Liberar asientos bloqueados hace más de 10 minutos
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    const { error: cleanupError } = await supabase
      .from('YuridiaSeatMap')
      .update({
        LockedStatus: false,
        LockedBy: null,
        lockedAt: null
      })
      .eq('Event', Event)
      .eq('subZone', subZone)
      .eq('LockedStatus', true)
      .eq('isTaken', false)
      .lt('lockedAt', tenMinutesAgo)

    if (cleanupError) {
      console.error('Error cleaning up expired locks:', cleanupError)
      // Continuar aunque falle la limpieza
    }

    // 📍 PASO 2: Obtener asientos ocupados (vendidos o bloqueados válidos)
    const { data, error } = await supabase
      .from('YuridiaSeatMap')
      .select('row, col')
      .eq('subZone', subZone)
      .eq('Event', Event)
      .or('isTaken.eq.true,LockedStatus.eq.true')

    console.log(JSON.stringify({ data }))
    console.log(JSON.parse(JSON.stringify({ data })))
    if (error) throw error

    return {
      statusCode: 200,
      body: JSON.stringify({ data })
    }
  } catch (error) {
    console.error('Supabase error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to query taken seats' })
    }
  }
}
