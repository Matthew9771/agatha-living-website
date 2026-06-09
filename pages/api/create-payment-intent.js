import Stripe from 'stripe';
import { calculateBookingCharge } from '../../lib/booking';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Payment service is not configured.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const booking = calculateBookingCharge(req.body);
  if (booking.error) {
    return res.status(400).json({ error: booking.error });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.chargeAmount * 100), // convert pounds to pence
      currency: 'gbp',
      metadata: {
        property: booking.property,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        guests: String(booking.guests),
        nights: String(booking.nights),
        total: String(booking.total),
        payment_mode: booking.paymentMode,
      },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      booking: {
        property: booking.property,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights: booking.nights,
        total: booking.total,
        paymentMode: booking.paymentMode,
        chargeAmount: booking.chargeAmount,
      },
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Unable to create payment. Please try again.' });
  }
}
