// server.js
const express = require('express');
const stripe = require('stripe')(import.meta.env.VITE_STRIPE_TEST_KEY);
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, event } = req.body;

    const lineItems = cart.map((ticket) => ({
      price_data: {
        currency: 'USD',
        unit_amount: ticket.price * 100, // Stripe expects the amount in cents
        product_data: {
          name: `Ticket ${ticket.seatLabel}; Type ${ticket.priceType}; Event: ${event.name}`,
          description: `Event: ${event.name} at ${event.venue} on ${event.date}`,
          metadata: {
            event_label: event.id,
            price_type: ticket.priceType,
            ticket_zone: ticket.seatType,
            ticket_id: ticket.seatLabel,
            is_seat: true,
          },
        },
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173',
      cancel_url: 'http://localhost:5173',
      metadata: {
        eventName: event.name,
        venue: event.venue,
        date: event.date,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.get('/retrieve-checkout-session', async (req, res) => {
  try {
    const { sessionId } = req.query;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error.message);
    res.status(500).json({ error: 'Failed to retrieve checkout session' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
