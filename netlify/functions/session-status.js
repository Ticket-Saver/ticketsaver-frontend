import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.handler = async function (event, _context) {

  const sessionId = event.queryStringParameters?.session_id

  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Session ID is required' })
    }
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customer = session.customer_details


    return {
      statusCode: 200,
      body: JSON.stringify({
        status: session.status,
        customer_email: customer.email || '',
        customer_name: customer.name || ''
      })
    }
  } catch (error) {
    console.error('Error retrieving session status:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve session status' })
    }
  }
}
