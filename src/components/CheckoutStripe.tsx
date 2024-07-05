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

      const { cart, event } = JSON.parse(cartString)

      // Ensure cart is an array
      if (!Array.isArray(cart)) {
        throw new Error('Invalid cart data.')
      }

      const response = await fetch('/api/checkoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart, event })
      })
      if (!response.ok) {
        throw new Error('Failed to create checkout session ok')
      }

      const data = await response.json()
      return data.clientSecret
    } catch (error) {
      console.error('Error al obtener el pago de Stripe .', error)
      throw error
    }
  }, [])

  // Llama fetchClientSecret al montar el componente
  useEffect(() => {
    fetchClientSecret()
      .then((secret) => setClientSecret(secret))
      .catch((error) => {
        console.error('Error al obtener el pago de Stripe.', error)
      })
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
