import { useEffect, useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`);

const CheckoutStripe = () => {
  const [clientSecret, setClientSecret] = useState('');

  // Define fetchClientSecret using useCallback
  const fetchClientSecret = useCallback(async () => {
    const cart = localStorage.getItem("cart_checkout");
    if (!cart) {
      throw new Error("No sale to make payment for.");
    }

    // Ensure you're sending a properly formatted JSON string and setting Content-Type header
    const response = await fetch("/api/route", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: cart, // Assuming cart is already a JSON string
    });

    const data = await response.json();
    return data.clientSecret;
  }, []);

  useEffect(() => {
    fetchClientSecret().then(setClientSecret).catch((error) => {
      console.error("Failed to fetch Stripe payment.", error);
    });
  }, [fetchClientSecret]);

  return (
    <div id="checkout">
      {
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      }
    </div>
  );
};

export default CheckoutStripe;
