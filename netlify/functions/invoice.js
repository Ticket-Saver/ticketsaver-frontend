import Stripe from 'stripe'
import { findCustomer } from '../utils/customer'
import {
  TicketsFromInvoices,
  TicketsByEvent,
  DescriptionsByEvent
} from '../utils/ticketsFromInvoice'
import { cons } from 'effect/List'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

exports.handler = async function (event, _context) {
  let customerId // Declara customerId aquí para asegurarte de que esté disponible en toda la función

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    }
  }

  if (event.httpMethod == 'POST') {
    try {
      const { customer } = JSON.parse(event.body)

      console.log('Llamando a findCustomer con:', customer)

      customerId = await findCustomer(customer) // Ahora asignando a la variable ya declarada
      console.log('ID del cliente:', customerId)

      if (!customerId) {
        throw new Error('Falta customerId')
      }
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Cuerpo de solicitud inválido' })
      }
    }

    try {
      const invoices = await stripe.invoices.list({
        customer: customerId
      })

      const info = await TicketsFromInvoices(invoices)

      const tickets = TicketsByEvent(info)
      const descriptions = DescriptionsByEvent(info)

      console.log('Tickets Agrupados por evento:', tickets)
      console.log(' solamente descripciones', descriptions)

      return {
        statusCode: 200,
        body: JSON.stringify(
          Object.entries(tickets).reduce((acc, [eventId, ticketInfo]) => {
            if (!acc[eventId]) {
              acc[eventId] = []
            }
            acc[eventId].push(
              ticketInfo.map((ticket) => ({
                ...ticket,
                Ticket: ticket.Ticket,
                Zone: ticket.Zone,
                Section: ticket.Section,
                price: ticket.price,
                eventName:
                  (ticket.eventName && ticket.eventName.length > 0 && ticket.eventName) ??
                  ticket.venue,
                venue: ticket.venue,
                venueId: ticket.venueId ?? ticket.venue.replace(/\s/g, '_').toLowerCase(),
                date: ticket.date,
                location: ticket.location ?? ticket.venue
              }))
            )
            return acc
          }, {})
        ) // Aqui se puede cambiar.
      }
    } catch (error) {
      console.error('Error al buscar facturas:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error interno del servidor' })
      }
    }
  }
}
