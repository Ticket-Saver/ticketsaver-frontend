import Stripe from 'stripe'
import { findCustomer } from '../utils/customer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.handler = async function (event, _context) {
  if (event.httpMethod == 'POST') {
    try {
      const { cart, eventInfo, user } = JSON.parse(event.body)

      console.log('Event body:', event.body)
      console.log('Creating checkout session for cart:', cart)
      console.log('Event details:', eventInfo)
      console.log('user:',user)
      if (!cart || !eventInfo) {
        throw new Error('Missing cart or event details')
      }

      const customerId = await findCustomer(user);


      const lineItems = cart.map((ticket) => ({
        price_data: {
          currency: 'USD',
          unit_amount: ticket.price * 100, // Stripe expects the amount in cents
          product_data: {
            name: `Ticket ${ticket.ticketId}; PriceType: ${ticket.priceType}; Zone ${ticket.venueZone}`,
            description: `Event: ${eventInfo.name} at ${eventInfo.venue} on ${eventInfo.date}`,
            metadata: {
              event_label: eventInfo.id,
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
        return_url:`$https://ticketsaver-test.netlify.app/return?session_id={CHECKOUT_SESSION_ID}`,
        customer_email: user?.email,
        phone_number_collection: {
          enabled: true
        },
        customer:customerId,
        invoice_creation: {
          enabled: true,
          invoice_data: {
            metadata: {
              ticketId: `${cart.ticketId}`,
              eventName: `${eventInfo.id}`,
              venue: `${eventInfo.venue}`,
              date: `${eventInfo.date}`,
              issuedAt: `${cart.issuedAt}`,
              name: user?.name,
              email: user?.email
            }
          }
        },
        metadata: {
          eventName: eventInfo.name,
          venue: eventInfo.venue,
          date: eventInfo.date,
          name: user?.name,
          email: user?.email
        },
        payment_intent_data: {
          metadata: {
            event_label: `${eventInfo.id}`
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
      const sessionId = event.queryStringParameters.session_id

      console.log('Retrieving session with ID:', sessionId)

      const session = await stripe.checkout.sessions.retrieve(sessionId)

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
