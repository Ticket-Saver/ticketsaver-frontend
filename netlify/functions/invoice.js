import Stripe from 'stripe'
import { findCustomer } from '../utils/customer'
import {
  TicketsFromInvoices,
  TicketsByEvent,
  DescriptionsByEvent
} from '../utils/ticketsFromInvoice'

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
      console.log('Tickets Agrupados por evento:', tickets)
      console.log(' solamente descripciones', DescriptionsByEvent(info))

      return {
        statusCode: 200,
        body: JSON.stringify(info) // Aqui se puede cambiar.
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
