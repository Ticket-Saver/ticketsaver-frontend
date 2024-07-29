import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const findCustomer = async (customer) => {
  if (!customer || !customer.email) {
    console.error('El objeto customer está vacío o no tiene email.')
    throw new Error('El objeto customer está vacío o no tiene email.')
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY no está definida en las variables de entorno.')
  }
  console.log('Iniciando la búsqueda o creación del cliente:', customer)
  try {
    // Buscar clientes por email
    const customers = await stripe.customers.list({
      email: customer.email,
      limit: 1
    })
    console.log('Respuesta de búsqueda:', customers)

    if (customers.data.length > 0) {
      // Si encontramos un cliente, devolvemos su ID
      return customers.data[0].id
    } else {
      console.log('Cliente no encontrado, creando nuevo cliente con datos:', customer)
      const newCustomer = await stripe.customers.create({
        name: customer.name,
        email: customer.email,
        phone: customer?.phone
      })
      console.log('Nuevo cliente creado:', newCustomer)
      return newCustomer.id
    }
  } catch (error) {
    console.error('Error al encontrar o crear cliente:', error)
    throw new Error('Error al encontrar o crear cliente en Stripe')
  }
}
export { findCustomer }
