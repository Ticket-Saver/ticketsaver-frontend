import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.handler = async function (event, context) {
  if (event.httpMethod == 'POST') {
    try {
      const { cart, events } = JSON.parse(event.body)

      if (!cart || !events) {
        throw new Error('Missing cart or event details')
      }

      console.log('Creating checkout session for cart:', cart)
      console.log('Event details:', events)

      const lineItems = cart.map((ticket) => ({
        price_data: {
          currency: 'USD',
          unit_amount: ticket.price * 100, // Stripe expects the amount in cents
          product_data: {
            name: `Ticket ${ticket.ticketId}; PriceType: ${ticket.priceType}; Zone ${ticket.venueZone}`,
            description: `Event: ${events.name} at ${events.venue} on ${events.date}`,
            metadata: {
              event_label: events.id,
              price_type: ticket.priceType,
              ticket_zone: ticket.venueZone,
              ticket_id: ticket.ticketId,
              issuedAt: ticket.issuedAt,
              is_seat: true
            }
          }
        },
        quantity: 1
      }))

      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        return_url: 'https://ticketsaver-test.netlify.app/',
        invoice_creation: {
          enabled: true,
          invoice_data: {
            metadata: {
              ticketId: `${cart.ticketId}`,
              eventName: `${events.id}`,
              venue: `${events.venue}`,
              date: `${events.date}`,
              issuedAt: `${cart.issuedAt}`
            }
          }
        },
        metadata: {
          eventName: events.name,
          venue: events.venue,
          date: events.date
        },
        payment_intent_data: {
          metadata: {
            event_label: `${events.id}`
          }
        }
      })

      console.log('Checkout session created successfully:', session)
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: session.client_secret })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error.message)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create checkout session' })
      }
    }
  } else if (event.httpMethod === 'GET') {
    try {
      const session = await stripe.checkout.sessions.retrieve(event.query.session_id)

      return {
        statusCode: 200,
        body: JSON.stringify({
          status: session.payment_status,
          customer_email: session.customer_email
        })
      }
    } catch (error) {
      console.error('Error retrieving checkout session:', error.message)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve checkout session' })
      }
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }
}
