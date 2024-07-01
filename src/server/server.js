import express from "express";
import Stripe from "stripe";
import cors from "cors"

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: 'http://localhost:5173'}))

app.listen(3003, () =>{
    console.log("server on port 3003")
})

const stripe = new Stripe(import.meta.env.VITE_STRIPE_PRIVATE_KEY);

const YOUR_DOMAIN = 'http://localhost:5173'


app.use(express.json());
app.use(cors());

app.post('/api/checkout', async (req, res) => {
  try {
    const { cart, event } = req.body;

    console.log('Creating checkout session for cart:', cart);
    console.log('Event details:', event);

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
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: {
            eventName: `${event.id}`,
            venue: `${event.venue}`,
            date: `${event.date}`,
          }
        },
      },
      metadata: {
        eventName: event.name,
        venue: event.venue,
        date: event.date,
      },
      payment_intent_data: {
        metadata: {
          event_label: `${event.id}`
        }
      }
    
    });

    console.log('Checkout session created successfully:', session);
    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.get('/session-status', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  
      res.send({
        status: session.payment_status,
        customer_email: session.customer_email,
      });
    } catch (error) {
      console.error('Error retrieving checkout session:', error.message);
      res.status(500).json({ error: 'Failed to retrieve checkout session' });
    }
  });


app.get('/retrieve-checkout-session', async (req, res) => {
  try {
    const { sessionId } = req.query;

    console.log('Retrieving checkout session for sessionId:', sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Checkout session retrieved successfully:', session);

    res.status(200).json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error.message);
    res.status(500).json({ error: 'Failed to retrieve checkout session' });
  }
});

app.listen( () => {
  console.log(`Servidor backend corriendo en el puerto 3003`);
});

