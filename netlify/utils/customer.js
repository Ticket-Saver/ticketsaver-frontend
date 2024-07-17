import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const findCustomer = async (user) => {
  try {
    // Buscar clientes por email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      // Si encontramos un cliente, devolvemos su ID
      return customers.data[0].id;
    } else {
      // Si no existe, crear uno nuevo
      const newCustomer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
      return newCustomer.id;
    }
  } catch (error) {
    console.error('Error al encontrar o crear cliente:', error);
    throw new Error('Error al encontrar o crear cliente en Stripe');
  }
};
export {findCustomer}