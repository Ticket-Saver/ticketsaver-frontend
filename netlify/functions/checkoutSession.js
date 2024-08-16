import Stripe from 'stripe'
import { findCustomer } from '../utils/customer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.handler = async function (event, _context) {
  if (event.httpMethod == 'POST') {
    try {
      const { cart, eventInfo, customer } = JSON.parse(event.body)

      const domainUrl = process.env.DOMAIN_URL || ''
      console.log(domainUrl)

      if (!cart || !eventInfo) {
        throw new Error('Missing cart or event details')
      }

      const customerId = await findCustomer(customer)

      const lineItems = cart.map((ticket) => ({
        price_data: {
          currency: 'USD',
          unit_amount: Math.round(ticket.price_final * 100), // Stripe expects the amount in cents
          product_data: {
            name: `Ticket ${ticket.seatLabel}; Zone ${ticket.seatType}; ${ticket.subZone}`,
            description: `Event: ${eventInfo.name} at ${eventInfo.venue} on ${eventInfo.date}`,
            metadata: {
              event_label: eventInfo.id,
              price_type: ticket.priceType,
              ticket_zone: ticket.seatType,
              ticket_id: ticket.seatLabel,
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
        return_url: `${domainUrl}/return?session_id={CHECKOUT_SESSION_ID}`,

        customer: customerId,
        invoice_creation: {
          enabled: true,
          invoice_data: {
            metadata: {
              eventName: eventInfo.name, // event_name
              venue: eventInfo.venue, //venue_name
              date: eventInfo.date, // event_date
              // esos primeros correpsonden a la información necesaria de los eventos pasados.

              priceType: cart.priceType,
              ticketId: cart.ticketId, //generado mediante ticket()
              eventId: eventInfo.id, //event_label
              venueId: eventInfo.venueId, // venue_label
              location: eventInfo.location, //location
              issuedAt: cart.issuedAt, //issuedAt que está relacionada con la función ticket
              numberOfTicket: cart.numberOfTicket || '',

              name: customer?.name,
              email: customer?.email
            }
          }
        },
        payment_intent_data: {
          metadata: {
            event_label: `${eventInfo.id}`
          }
        }
      })

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
  }
}
