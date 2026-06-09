import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabase';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function recordPayment(metadata, amount, intentId) {
  const { property, check_in, check_out, guests, nights } = metadata;

  const record = {
    stripe_intent_id: intentId,
    property: property || null,
    check_in: check_in || null,
    check_out: check_out || null,
    guests: guests || null,
    nights: nights || null,
    amount: amount ?? null,
    status: 'succeeded',
  };

  const { error } = await supabaseAdmin.from('payments').insert([record]);
  if (error) {
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret || !stripeSecret) {
    return res.status(500).send('Stripe webhook is not configured.');
  }

  const stripe = new Stripe(stripeSecret);
  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    try {
      await recordPayment(intent.metadata, intent.amount, intent.id);
      console.log(`Booking payment recorded: ${intent.id} — ${intent.metadata?.property} ${intent.metadata?.check_in} → ${intent.metadata?.check_out}`);
    } catch (error) {
      console.error('Failed to save payment to Supabase:', error.message || error);
      return res.status(500).send('Failed to save payment record.');
    }
  }

  res.status(200).json({ received: true });
}
