import supabase from '../utils/supabase'

exports.handler = async function handler(event, _context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const { subZone } = event.body

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
