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

/**
 * Reserva asientos atómicamente usando la función RPC de Supabase.
 * Agrupa los tickets del carrito por subZone y llama a reserve_seats para cada grupo.
 * Retorna un objeto de error si la reserva falla, o null si todo está bien.
 * También retorna la lista de reservas exitosas para poder hacer rollback si falla a medio camino.
 */
async function reserveSeats(cart, eventInfo) {
  // Agrupar tickets por subZone
  const seatsByZone = {}
  for (const ticket of cart) {
    const zone = ticket.subZone
    seatsByZone[zone] = (seatsByZone[zone] || 0) + 1
  }

  console.log(
    `[reserveSeats] event_id="${eventInfo.id}", seatsByZone:`,
    JSON.stringify(seatsByZone)
  )

  const successfulReservations = []

  for (const [zone, quantity] of Object.entries(seatsByZone)) {
    console.log(
      `[reserveSeats] Calling reserve_seats RPC — event_id="${eventInfo.id}", seat_type="${zone}", quantity=${quantity}`
    )

    const { data, error } = await supabase.rpc('reserve_seats', {
      p_event_id: eventInfo.id,
      p_seat_type: zone,
      p_quantity: quantity
    })

    console.log(
      `[reserveSeats] RPC response for zone "${zone}" — data:`,
      JSON.stringify(data),
      'error:',
      error ? JSON.stringify(error) : 'none'
    )

    if (error) {
      console.error(
        `[reserveSeats] RPC error reserving seats for zone ${zone}:`,
        error.message,
        error.details,
        error.hint
      )
      // Rollback reservas exitosas anteriores
      await rollbackReservations(successfulReservations, eventInfo.id)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Error reserving seats for zone ${zone}` })
      }
    }

    if (data && !data.success && !data.unlimited) {
      console.log(
        `[reserveSeats] Not enough seats for zone "${zone}" — remaining: ${data.remaining}, requested: ${quantity}`
      )
      // No hay suficientes asientos — rollback reservas exitosas anteriores
      await rollbackReservations(successfulReservations, eventInfo.id)
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: `Not enough seats available for ${zone}. Only ${data.remaining} remaining.`,
          remaining: data.remaining,
          zone
        })
      }
    }

    // Registrar reserva exitosa para posible rollback
    if (data && data.success && !data.unlimited) {
      console.log(
        `[reserveSeats] Successfully reserved ${quantity} seats for zone "${zone}" — new sold_seats: ${data.sold_seats}, remaining: ${data.remaining}`
      )
      successfulReservations.push({ zone, quantity })
    }

    if (data && data.unlimited) {
      console.log(`[reserveSeats] Zone "${zone}" is unlimited, no reservation needed`)
    }
  }

  console.log(
    `[reserveSeats] All reservations complete. Total reserved zones:`,
    successfulReservations.length
  )
  return null // Todas las reservas exitosas
}

/**
 * Rollback: libera asientos que fueron reservados exitosamente antes de un fallo.
 */
async function rollbackReservations(reservations, eventId) {
  console.log(
    `[rollbackReservations] Rolling back ${reservations.length} reservations for event_id="${eventId}"`
  )
  for (const { zone, quantity } of reservations) {
    try {
      const { data, error } = await supabase.rpc('release_seats', {
        p_event_id: eventId,
        p_seat_type: zone,
        p_quantity: quantity
      })
      console.log(
        `[rollbackReservations] Released zone "${zone}" qty=${quantity} — data:`,
        JSON.stringify(data),
        'error:',
        error ? JSON.stringify(error) : 'none'
      )
    } catch (err) {
      console.error(`[rollbackReservations] Error rolling back reservation for zone ${zone}:`, err)
    }
  }
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

      console.log(
        `[checkoutSession] Starting seat reservation for event "${eventInfo.id}", cart size: ${cart.length}`
      )

      // Reservar asientos atómicamente ANTES de crear la sesión de Stripe
      const reserveError = await reserveSeats(cart, eventInfo)
      if (reserveError) {
        console.log(`[checkoutSession] Reservation failed, returning error`)
        return reserveError
      }

      console.log(`[checkoutSession] Reservation successful, creating Stripe session`)

      const EventMetadata = cart.map((ticket) => ({
        seat: ticket.seatLabel,
        price_type: ticket.priceType,
        basePriceMajorUnits: ticket.price_base,
        comp: false
      }))

      const serializedTicketMetadata = serializeTicketMetadata(EventMetadata)

      // Serializar las zonas reservadas para poder liberar si expira la sesión
      const seatsByZone = {}
      for (const ticket of cart) {
        const zone = ticket.subZone
        seatsByZone[zone] = (seatsByZone[zone] || 0) + 1
      }
      const serializedReservations = JSON.stringify(seatsByZone)

      console.log(`[checkoutSession] serializedReservations:`, serializedReservations)

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
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expira en 30 min

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
            tm: serializedTicketMetadata,
            reserved_seats: serializedReservations
          }
        },
        metadata: {
          event_label: eventInfo.id,
          reserved_seats: serializedReservations
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

//función para normalizar los reportes en metadata
function serializeTicketMetadata(ticketMetadataList) {
  return ticketMetadataList
    .map(
      (ticketMetadata) =>
        `${ticketMetadata.seat},${ticketMetadata.price_type},${ticketMetadata.basePriceMajorUnits},${ticketMetadata.comp ? 1 : 0}`
    )
    .join(';')
}
