import { useEffect, useState, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const CheckoutStripe = () => {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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

      if (response.status === 409) {
        const data = await response.json()
        setError(data.error || 'Not enough seats available. Please go back and try again.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Error al obtener el pago de Stripe.', error)
      setError('An error occurred while creating the checkout session. Please try again.')
    }
  }, [])
  useEffect(() => {
    fetchClientSecret()
  }, [fetchClientSecret])

  if (error) {
    return (
      <div id='checkout' className='flex flex-col items-center justify-center min-h-[400px] p-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center'>
          <p className='text-red-700 font-semibold text-lg mb-4'>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className='bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition duration-300'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

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
