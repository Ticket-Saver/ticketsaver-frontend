import Stripe from 'stripe'
import { findCustomer } from '../utils/customer'
import { supabase } from '../utils/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Checks if the seats in the cart are already taken for a given event.
 *
 * @param {Array} cart - The cart containing the seats to be checked.
 * @returns {Object|undefined} - Returns an object with the status code and error message if the seat is already taken, or undefined if all seats are available.
 */
async function checkForTakenSeats(cart, eventInfo) {
  for (const cartItem of cart) {
    const seat = cartItem.seatLabel
    const subZone = cartItem.subZone
    const event_label = eventInfo.id
    const r = await supabase
      .from('YuridiaEvents')
      .select('id, seat, subZone')
      .eq('Seat', seat)
      .eq('subZone', subZone)
      .eq('Event', event_label)

    if (r.data && r.data.length > 0) {
      if (r.data.length > 1) {
        console.warn(
          `Multiple seats found for seat ${seat} and subZone ${subZone} in event ${event_label}`
        )
      }
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Seat ${r.data.at(0)?.id} already taken` })
      }
    }
  }
  return null
}

exports.handler = async function (event, _context) {
  if (event.httpMethod == 'POST') {
    try {
      const { cart, eventInfo, customer } = JSON.parse(event.body)

      const domainUrl = process.env.DOMAIN_URL || ''

      if (!cart || !eventInfo) {
        throw new Error('Missing cart or event details')
      }

      const check = await checkForTakenSeats(cart, eventInfo)
      if (check) return check

      const EventMetadata = cart.map((ticket) => ({
        seat: ticket.seatLabel,
        price_type: ticket.priceType,
        basePriceMajorUnits: ticket.price_base,
        comp: false
      }))

      const serializedTicketMetadata = serializeTicketMetadata(EventMetadata)

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

              location: eventInfo.location, //location
              issuedAt: cart.issuedAt, //issuedAt que está relacionada con la función ticket

              client_name: customer.name,
              client_email: customer.email,
              event_label: eventInfo.id,
              venue_label: eventInfo.venueId
            }
          }
        },
        payment_intent_data: {
          metadata: {
            event_label: eventInfo.id,
            tm: serializedTicketMetadata
          }
        }
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: session.client_secret })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create checkout session' })
      }
    }
  }
}

//función para normalizar los reportes en metadata
function serializeTicketMetadata(ticketMetadataList) {
  return ticketMetadataList
    .map(
      (ticketMetadata) =>
        `${ticketMetadata.seat},${ticketMetadata.price_type},${ticketMetadata.basePriceMajorUnits},${ticketMetadata.comp ? 1 : 0}`
    )
    .join(';')
}
