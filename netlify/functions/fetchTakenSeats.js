<<<<<<< HEAD
import {supabase} from '../utils/supabaseClientClient'
=======
import { supabase } from '../utils/supabase'
>>>>>>> 2d95a7a16ef42de48bcc5357c074003b11122942

exports.handler = async function handler(event, _context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }
  console.log(event.body)
  const { subZone } = JSON.parse(event.body)
  console.log(subZone)

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
    const { data, error } = await supabase
      .from('YuridiaSeatMap')
      .select('row, col')
      .eq('subZone', subZone)
      .or('isTaken.eq.true,LockedStatus.eq.true')
    console.log(data)
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
