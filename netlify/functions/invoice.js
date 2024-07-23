import Stripe from 'stripe'
import { findCustomer } from '../utils/customer'
import { TicketsFromInvoices } from '../utils/ticketsFromInvoice'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

exports.handler = async function (event, _context) {
  console.log('Event received:', event)

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  if (event.httpMethod == 'POST') {
    try {
      const { customer } = JSON.parse(event.body)

      console.log('Calling findCustomer with:', customer)

      const customerId = await findCustomer(customer)
      console.log('Customer ID:', customerId)

      if (!customerId) {
        throw new Error('Missing customerId')
      }
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request body' })
      }
    }

    try {
      const invoices = await stripe.invoices.list({
        customer: customerId
      })

      const tickets = TicketsFromInvoices(invoices)

      return {
        statusCode: 200,
        body: JSON.stringify(tickets)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      }
    }
  }
}
