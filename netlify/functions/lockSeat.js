import {supabase} from '../utils/supabase'
/*
interface SeatUpdateRequest {
  Seat: string;
  subZone: string;
  row: number;
  col: number;
  sessionId: string;
}
  */

exports.handler = async function handler(event, _context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const seat = JSON.parse(event.body)
  console.log(seat)

  // Validate the request body
  if (
    typeof seat.subZone !== 'string' ||
    typeof seat.row !== 'number' ||
    typeof seat.col !== 'number' ||
    typeof seat.sessionId !== 'string'
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request format' })
    }
  }

  const { data: seatData, error: seatError } = await supabase
    .from('YuridiaSeatMap')
    .select('LockedBy')
    .eq('Seat', seat.Seat)
    .eq('subZone', seat.subZone)
    .eq('row', seat.row)
    .eq('col', seat.col)
    .single()

  if (seatError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch seat data' })
    }
  }

  // Check if the seat can be updated by this session
  if (!seatData || (seatData.LockedBy && seatData.LockedBy !== seat.sessionId)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: Seat locked by another session' })
    }
  }

  const newLockedStatus = !seatData.LockedBy

  if (seatData && (!seatData.LockedBy || seatData.LockedBy === seat.sessionId)) {
    // Update the seat
    const { data, error } = await supabase
      .from('YuridiaSeatMap')
      .update({ LockedStatus: newLockedStatus, LockedBy: newLockedStatus ? seat.sessionId : null })
      .eq('Seat', seat.Seat)
      .eq('subZone', seat.subZone)
      .eq('row', seat.row)
      .eq('col', seat.col)
    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update seat' })
      }
    }

    const action = newLockedStatus ? 'locked' : 'unlocked'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Seat successfully ${action}`, data })
    }
  }
}
