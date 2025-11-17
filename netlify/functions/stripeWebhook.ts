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
      const purchaseDate = new Date(eventObject.created * 1000).toISOString() // Convierte la fecha a ISO formato
      console.log(`event label: ${event_label}`)

      let totalSeatsSoldBySubZone: { [key: string]: number } = {} // Para llevar el total vendido por cada subZone

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
        const quantity = item.quantity || 1
        totalSeatsSoldBySubZone[subZone] = (totalSeatsSoldBySubZone[subZone] || 0) + quantity
      }

      for (const [subZone, seatsSold] of Object.entries(totalSeatsSoldBySubZone)) {
        const { data: currentData, error } = await supabase
          .from('eventseatstatus')
          .select('sold_seats')
          .eq('event_id', event_label)
          .eq('seat_type', subZone)
          .single()

        if (error) {
          console.error(`Error al obtener sold_seats para subZone ${subZone}:`, error)
          return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error fetching sold_seats for subZone ${subZone}` })
          }
        }

        const newSoldSeats = (currentData?.sold_seats || 0) + seatsSold

        const { error: statusError } = await supabase
          .from('eventseatstatus')
          .update({
            sold_seats: newSoldSeats,
            updated_at: new Date().toISOString()
          })
          .eq('event_id', event_label)
          .eq('seat_type', subZone)

        if (statusError) {
          console.error(
            `Error en la actualización de EventSeatStatus para subZone ${subZone}:`,
            statusError
          )
          return {
            statusCode: 500,
            body: JSON.stringify({
              error: `Error en la actualización de EventSeatStatus para subZone ${subZone}`
            })
          }
        }

        console.log(
          `EventSeatStatus actualizado: ${seatsSold} asientos vendidos para el evento ${event_label}, subZone ${subZone}`
        )
      }

      return { statusCode: 200, body: JSON.stringify({ message: 'Webhook handled successfully' }) }
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
