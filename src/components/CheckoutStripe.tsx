import { useEffect, useState, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const CheckoutStripe = () => {
  const [clientSecret, setClientSecret] = useState(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const cartString = localStorage.getItem('cart_checkout')
      if (!cartString) {
        throw new Error('No sale to make payment for.')
      }

      const { cart, eventInfo, customer } = JSON.parse(cartString)

      // Ensure cart is an array
      if (!Array.isArray(cart)) {
        throw new Error('Invalid cart data.')
      }
      console.log(customer)
      console.log(cart)
      console.log(eventInfo)

      const response = await fetch('/api/checkoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart, eventInfo, customer })
      })
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Error al obtener el pago de Stripe.', error)
      throw error
    }
  }, [])
  useEffect(() => {
    fetchClientSecret()
  }, [fetchClientSecret])
  // Renderiza el EmbeddedCheckoutProvider si tienes el clientSecret
  return (
    <div id='checkout'>
      {clientSecret && (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}

export default CheckoutStripe
