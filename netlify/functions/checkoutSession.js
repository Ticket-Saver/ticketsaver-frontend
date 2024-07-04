import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, context) => {
  if (req.method == 'POST') {
    try {
      const { cart, event } = req.body

      if (!cart || !event) {
        throw new Error('Missing cart or event details')
      }

      console.log('Creating checkout session for cart:', cart)
      console.log('Event details:', event)

      const lineItems = cart.map((ticket) => ({
        price_data: {
          currency: 'USD',
          unit_amount: ticket.price * 100, // Stripe expects the amount in cents
          product_data: {
            name: `Ticket ${ticket.ticketId}; PriceType: ${ticket.priceType}; Zone ${ticket.venueZone}`,
            description: `Event: ${event.name} at ${event.venue} on ${event.date}`,
            metadata: {
              event_label: event.id,
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
        return_url: `${process.env.YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        invoice_creation: {
          enabled: true,
          invoice_data: {
            metadata: {
              ticketId: `${cart.ticketId}`,
              eventName: `${event.id}`,
              venue: `${event.venue}`,
              date: `${event.date}`,
              issuedAt: `${cart.issuedAt}`
            }
          }
        },
        metadata: {
          eventName: event.name,
          venue: event.venue,
          date: event.date
        },
        payment_intent_data: {
          metadata: {
            event_label: `${event.id}`
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
  } else if (req.method === 'GET') {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query)

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
