import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, property, checkIn, checkOut, guests, nights } = req.body;

  if (!amount || typeof amount !== 'number' || amount < 100) {
    return res.status(400).json({ error: 'Invalid payment amount.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert £ to pence
      currency: 'gbp',
      metadata: {
        property: property || '',
        check_in: checkIn || '',
        check_out: checkOut || '',
        guests: String(guests || ''),
        nights: String(nights || ''),
      },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Unable to create payment. Please try again.' });
  }
}
