import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

type Data = {
  clientSecret?: string;
  status?: string;
  customer_email?: string;
  message?: string;
};

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  switch (req.method) {
    case "POST":
      try {
        const lineItems = req.body.cart.map((ticket:any) => ({
          price_data: {
            currency: 'USD',
            tax_behavior:'exclusive',
              unit_amount: ticket.price *100, // Stripe expects the amount in cents
              product_data: {
                name: `Ticket ${ticket.seatLabel}; Type ${ticket.seatType} ;Event: ${req.body.event.name}`,
                description: `Event: ${req.body.event.name} at ${req.body.event.venue} on ${req.body.event.date}`,
                metadata: {
                    event_label: `${req.body.event.id}`,
                    price_type:`${ticket.priceTag}`,
                    ticket_zone:`${ticket.seatType}`,
                    ticket_id:`${ticket.seatLabel}`,
                    is_seat:true,
                },
            },
          },
          quantity:1,
        }));

        const session = await stripe.checkout.sessions.create({
          ui_mode: 'embedded',
          line_items: lineItems,
          mode: 'payment',
          return_url: 'https://ticketsaver-frontend.netlify.app/',
          invoice_creation: {
            enabled: true,
            invoice_data: {
                metadata:{
                    eventName: `${req.body.event.id}`,
                    venue:`${req.body.event.venue}`,
                    date:`${req.body.event.date}`,
                  }
            }
          },
          payment_intent_data: {
            metadata: {
              event_label:`${req.body.event.id}`,
            }
          },
        });

        res.status(200).json({ clientSecret: session.client_secret || '' });
      } catch (err: any) {
        res.status(err.statusCode || 500).json({ message: err.message });
      }
      break;
    case "GET":
      try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);

        res.status(200).json({
          status: session.status || '200',
          customer_email: session.customer_details?.email || '',
        });
      } catch (err: any) {
        res.status(err.statusCode || 500).json({ message: err.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
