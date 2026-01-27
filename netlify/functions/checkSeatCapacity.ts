import { Handler } from '@netlify/functions'
import { supabase } from '../utils/supabaseClient'

/**
 * Capacidades máximas por evento y sección
 * Estructura: { event_id: { seat_type: max_capacity } }
 */
const EVENT_CAPACITIES: Record<string, Record<string, number>> = {
  'steve_aoki.01': {
    'General Admission': 400
  },
  'shoreline_mafia.01': {
    'General Admission': 100,
    vip: 100
  },
  'chief-keef.01': {
    'General Admission': 500,
    vip: 200
  },
  'offset_nardowick.01': {
    'General Admission': 100,
    vip: 100
  },
  'destroy_lonely.01': {
    'General Admission': 100,
    vip: 100
  }
}

interface CheckCapacityRequest {
  event_id: string
  seat_type: string
  requested_quantity?: number
}

interface CapacityResponse {
  available: boolean
  sold_seats: number
  max_capacity: number
  remaining_seats: number
  can_fulfill_request?: boolean
  event_id: string
  seat_type: string
}

export const handler: Handler = async (event, _context) => {
  // Solo permitir POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    }
  }

  try {
    const body: CheckCapacityRequest = JSON.parse(event.body || '{}')
    const { event_id, seat_type, requested_quantity } = body

    // Validar parámetros requeridos
    if (!event_id || !seat_type) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required parameters: event_id and seat_type are required'
        })
      }
    }

    // Verificar si el evento existe en las capacidades configuradas
    // Si no existe, significa que no tiene límite establecido
    if (!EVENT_CAPACITIES[event_id]) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          available: true,
          sold_seats: 0,
          max_capacity: null,
          remaining_seats: null,
          event_id,
          seat_type,
          unlimited: true
        })
      }
    }

    // Verificar si el seat_type existe para este evento
    const maxCapacity = EVENT_CAPACITIES[event_id][seat_type]
    if (maxCapacity === undefined) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          available: true,
          sold_seats: 0,
          max_capacity: null,
          remaining_seats: null,
          event_id,
          seat_type,
          unlimited: true
        })
      }
    }

    // Consultar los asientos vendidos actuales desde Supabase
    const { data, error } = await supabase
      .from('eventseatstatus')
      .select('sold_seats')
      .eq('event_id', event_id)
      .eq('seat_type', seat_type)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 es el código cuando no se encuentra registro
      console.error('Error fetching seat status from Supabase:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error fetching seat availability from database'
        })
      }
    }

    // Si no hay datos, asumir que no se han vendido asientos aún
    const soldSeats = data?.sold_seats || 0
    const remainingSeats = maxCapacity - soldSeats
    const available = remainingSeats > 0

    const response: CapacityResponse = {
      available,
      sold_seats: soldSeats,
      max_capacity: maxCapacity,
      remaining_seats: remainingSeats,
      event_id,
      seat_type
    }

    // Si se proporcionó requested_quantity, verificar si se puede cumplir
    if (requested_quantity !== undefined) {
      response.can_fulfill_request = remainingSeats >= requested_quantity
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(response)
    }
  } catch (err) {
    console.error('Error in checkSeatCapacity function:', err)
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal server error: ${message}` })
    }
  }
}
