const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, context) => {
  if (req.method == 'POST') {
    try {
      const { cart, event: eventDetails } = JSON.parse(req.body)

      console.log('Creating checkout session for cart:', cart)
      console.log('Event details:', eventDetails)

      const lineItems = cart.map((ticket) => ({
        price_data: {
          currency: 'USD',
          unit_amount: ticket.price * 100, // Stripe expects the amount in cents
          product_data: {
            name: `Ticket ${ticket.ticketId}; PriceType: ${ticket.priceType}; Zone ${ticket.venueZone}`,
            description: `Event: ${eventDetails.name} at ${eventDetails.venue} on ${eventDetails.date}`,
            metadata: {
              event_label: eventDetails.id,
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
              eventName: `${eventDetails.id}`,
              venue: `${eventDetails.venue}`,
              date: `${eventDetails.date}`,
              issuedAt: `${cart.issuedAt}`
            }
          }
        },
        metadata: {
          eventName: eventDetails.name,
          venue: eventDetails.venue,
          date: eventDetails.date
        },
        payment_intent_data: {
          metadata: {
            event_label: `${eventDetails.id}`
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
      const session = await stripe.checkout.sessions.retrieve(req.query.id)

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
