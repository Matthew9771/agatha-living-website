import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function sendBookingNotification(metadata, amount) {
  const { property, check_in, check_out, guests, nights } = metadata;
  const depositNote = amount ? `\nAmount paid: £${(amount / 100).toFixed(2)}` : '';

  const body = new URLSearchParams({
    _subject: `💳 New payment received — ${property || 'Agatha Living booking'}`,
    property: property || '-',
    check_in: check_in || '-',
    check_out: check_out || '-',
    guests: guests || '-',
    nights: nights || '-',
    amount_paid: amount ? `£${(amount / 100).toFixed(2)}` : '-',
    message: `A guest has paid for a booking. Please log in to Guesty and block these dates immediately.\n\nProperty: ${property}\nCheck-in: ${check_in}\nCheck-out: ${check_out}\nGuests: ${guests}\nNights: ${nights}${depositNote}\n\nGuesty: https://app.guesty.com`,
  });

  try {
    await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
  } catch (err) {
    console.error('Notification email failed:', err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;

  if (webhookSecret) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Without the secret, parse the body directly (dev/testing only)
    try {
      event = JSON.parse(rawBody.toString());
    } catch {
      return res.status(400).send('Invalid payload');
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    await sendBookingNotification(intent.metadata, intent.amount);
    console.log(`Payment succeeded: ${intent.id} — ${intent.metadata?.property} ${intent.metadata?.check_in} → ${intent.metadata?.check_out}`);
  }

  res.status(200).json({ received: true });
}
