import { Handler } from '@netlify/functions'
import { supabase } from '../utils/supabaseClient'

interface CheckCapacityRequest {
  event_id: string
  seat_type: string
  requested_quantity?: number
}

interface CapacityResponse {
  available: boolean
  sold_seats: number
  max_capacity: number | null
  remaining_seats: number | null
  can_fulfill_request?: boolean
  event_id: string
  seat_type: string
  unlimited?: boolean
}

export const handler: Handler = async (event, _context) => {
  // Permitir preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    }
  }

  try {
    const body: CheckCapacityRequest = JSON.parse(event.body || '{}')
    const { event_id, seat_type, requested_quantity } = body

    if (!event_id || !seat_type) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required parameters: event_id and seat_type are required'
        })
      }
    }

    // Consultar sold_seats y max_capacity directamente desde la DB
    const { data, error } = await supabase
      .from('eventseatstatus')
      .select('sold_seats, max_capacity')
      .eq('event_id', event_id)
      .eq('seat_type', seat_type)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching seat status from Supabase:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error fetching seat availability from database'
        })
      }
    }

    // Si no existe registro para este evento/seat_type, tratar como ilimitado
    if (!data) {
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

    const soldSeats = data.sold_seats || 0
    const maxCapacity = data.max_capacity

    // Si max_capacity es null, tratar como ilimitado
    if (maxCapacity === null || maxCapacity === undefined) {
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
          sold_seats: soldSeats,
          max_capacity: null,
          remaining_seats: null,
          event_id,
          seat_type,
          unlimited: true
        })
      }
    }

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
