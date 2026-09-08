import { verifyGuestToken, verifyPaidStay } from '../../lib/server/guest-access.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const claims = verifyGuestToken(req.body?.token);
    const stay = await verifyPaidStay(claims.reservationId, claims.paymentIntentId, claims.fingerprint);
    return res.status(200).json({ slug: stay.slug, address: stay.address, arrival: stay.arrival, departure: stay.departure });
  } catch {
    return res.status(403).json({ error: 'We could not verify access. Please contact Agatha Living for help with your booking.' });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '4kb' } } };
