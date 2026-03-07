import Stripe from 'stripe'
import { Handler } from '@netlify/functions'
import { supabase } from '../utils/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
const endpointSecret = process.env.ENDPOINT_STRIPE_SECRET || ''

interface Metadata {
  date: string
  eventName: string
  event_label: string
  venue_label: string
  client_email: string
  venue: string
  location: string
  client_name: string
}

/**
 * Libera asientos reservados cuando una sesión de checkout expira o el pago falla.
 */
async function releaseReservedSeats(eventLabel: string, reservedSeatsJson: string) {
  try {
    const reservedSeats: { [zone: string]: number } = JSON.parse(reservedSeatsJson)
    for (const [zone, quantity] of Object.entries(reservedSeats)) {
      const { data, error } = await supabase.rpc('release_seats', {
        p_event_id: eventLabel,
        p_seat_type: zone,
        p_quantity: quantity
      })
      if (error) {
        console.error(`Error releasing seats for zone ${zone}:`, error)
      } else {
        console.log(`Released ${quantity} seats for zone ${zone}, event ${eventLabel}:`, data)
      }
    }
  } catch (err) {
    console.error('Error parsing reserved_seats metadata:', err)
  }
}

export const handler: Handler = async (event, _context) => {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      event.headers['stripe-signature']!,
      endpointSecret
    )

    if (stripeEvent.type === 'invoice.payment_succeeded') {
      const eventObject = stripeEvent.data.object
      const items = eventObject.lines.data
      const metadata = eventObject.metadata

      const event_label = metadata!.event_label
      const customer_email = metadata!.client_email
      const purchaseDate = new Date(eventObject.created * 1000).toISOString()
      console.log(`event label: ${event_label}`)

      for (const item of items) {
        const description = item.description
        console.log('ticket: ', description)
        const [seatPart, zonePart, subZone] = description!.split(';').map((part) => part.trim())

        const seatMatch = seatPart.match(/Ticket (\w+)/)
        const seat = seatMatch ? seatMatch[1].trim() : null

        console.log(`seat: ${seat} and subZone:${subZone}`)

        if (seat && subZone) {
          const { data, error } = await supabase
            .from('YuridiaSeatMap')
            .update({
              LockedStatus: true,
              isTaken: true,
              LockedBy: customer_email,
              takenDate: purchaseDate
            })
            .eq('Seat', seat)
            .eq('subZone', subZone)
            .eq('Event', event_label)
          console.log(data)
          if (error) {
            console.error('Error en la actualización de Supabase:', error)
            return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Error en la actualización de Supabase' })
            }
          }
        }
      }

      // sold_seats ya fue incrementado atómicamente en checkoutSession via reserve_seats RPC.
      // No necesitamos incrementar aquí.

      return { statusCode: 200, body: JSON.stringify({ message: 'Webhook handled successfully' }) }
    } else if (stripeEvent.type === 'checkout.session.expired') {
      // La sesión de checkout expiró sin pago — liberar los asientos reservados
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const eventLabel = session.metadata?.event_label
      const reservedSeats = session.metadata?.reserved_seats

      if (eventLabel && reservedSeats) {
        console.log(`Checkout session expired for event ${eventLabel}, releasing reserved seats`)
        await releaseReservedSeats(eventLabel, reservedSeats)
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Expired session handled, seats released' })
      }
    } else if (stripeEvent.type === 'payment_intent.payment_failed') {
      // El pago falló — liberar los asientos reservados
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
      const eventLabel = paymentIntent.metadata?.event_label
      const reservedSeats = paymentIntent.metadata?.reserved_seats

      if (eventLabel && reservedSeats) {
        console.log(`Payment failed for event ${eventLabel}, releasing reserved seats`)
        await releaseReservedSeats(eventLabel, reservedSeats)
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Failed payment handled, seats released' })
      }
    } else {
      return { statusCode: 400, body: 'Event type not handled' }
    }
  } catch (err) {
    console.error('Error en el manejo del webhook:', err)
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)
    return { statusCode: 400, body: `Webhook Error: ${message}` }
  }
}
