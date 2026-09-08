import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { smoobuGet } from './smoobu.mjs';

const PROPERTY_SLUGS = {
  3491976: 'forest-hill-skyline',
  3493341: 'london-cinema-home',
  3493346: 'private-coach-house',
};
const MAX_LINK_SECONDS = 7 * 24 * 60 * 60;

function signingSecret() {
  const secret = process.env.GUEST_ACCESS_SECRET;
  if (!secret || secret.length < 64) throw new Error('Guest access is not configured');
  return secret;
}

function signature(payload) {
  return createHmac('sha256', signingSecret()).update(`agatha-guest-access-v1:${payload}`).digest('base64url');
}

export function createGuestToken({ reservationId, paymentIntentId, fingerprint }, now = Math.floor(Date.now() / 1000)) {
  const payload = Buffer.from(JSON.stringify({
    reservationId, paymentIntentId, fingerprint,
    issuedAt: now, expiresAt: now + MAX_LINK_SECONDS,
    nonce: randomBytes(16).toString('hex'),
  })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function verifyGuestToken(token, now = Math.floor(Date.now() / 1000)) {
  if (typeof token !== 'string' || token.length > 2048) throw new Error('Invalid access link');
  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) throw new Error('Invalid access link');
  const expected = Buffer.from(signature(parts[0]));
  const actual = Buffer.from(parts[1]);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('Invalid access link');
  const claims = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  if (!Number.isSafeInteger(claims.issuedAt) || !Number.isSafeInteger(claims.expiresAt)
    || claims.issuedAt > now || claims.expiresAt <= now || claims.expiresAt <= claims.issuedAt
    || claims.expiresAt - claims.issuedAt > MAX_LINK_SECONDS
    || !/^\d+$/.test(String(claims.reservationId))
    || !/^pi_[A-Za-z0-9]+$/.test(claims.paymentIntentId)
    || !/^[a-f0-9]{64}$/.test(claims.fingerprint)) throw new Error('Invalid access link');
  return claims;
}

export function bookingFingerprint(booking) {
  return createHash('sha256').update(JSON.stringify([
    booking.id, booking.apartment?.id, booking.email, booking.arrival, booking.departure,
  ])).digest('hex');
}

export function assertPaidReservation(booking, reservationId) {
  const paid = booking['price-paid'] === true || String(booking['price-paid']).toLowerCase() === 'yes';
  if (String(booking.id) !== String(reservationId)
    || !['reservation', 'modification of booking'].includes(booking.type)
    || booking['is-blocked-booking'] !== false || !paid
    || !PROPERTY_SLUGS[booking.apartment?.id]
    || typeof booking.email !== 'string' || !booking.email.trim()
    || !/^\d{4}-\d{2}-\d{2}$/.test(booking.departure)
    || !Number.isFinite(Date.parse(`${booking.departure}T00:00:00Z`))
    || Date.parse(`${booking.departure}T00:00:00Z`) <= Date.now()) {
    throw new Error('Reservation is not eligible for address access');
  }
}

export function assertStripePayment(payment, booking, currency) {
  const price = String(booking.price);
  if (!/^\d+(\.\d{1,2})?$/.test(price) || currency !== 'GBP') throw new Error('Unsupported booking total');
  const amount = Math.round(Number(price) * 100);
  const charge = payment.latest_charge;
  if (!Number.isSafeInteger(amount) || amount <= 0
    || payment.status !== 'succeeded' || payment.livemode !== true
    || payment.currency !== 'gbp' || !Number.isSafeInteger(payment.amount_received) || payment.amount_received < amount
    || payment.metadata?.smoobu_reservation_id !== String(booking.id)
    || !charge || typeof charge !== 'object'
    || charge.paid !== true || charge.captured !== true
    || charge.disputed !== false || charge.refunded !== false
    || charge.amount_refunded !== 0 || !Number.isSafeInteger(charge.amount_captured) || charge.amount_captured < amount
    || charge.currency !== 'gbp') throw new Error('Payment could not be verified');
}

async function stripePayment(paymentIntentId) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe is not configured');
  const response = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}?expand[]=latest_charge`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Stripe verification unavailable');
  return response.json();
}

export async function verifyPaidStay(reservationId, paymentIntentId, fingerprint) {
  if (!/^\d+$/.test(String(reservationId)) || !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) throw new Error('Invalid reservation');
  const booking = await smoobuGet(`/api/reservations/${reservationId}`);
  assertPaidReservation(booking, reservationId);
  if (fingerprint && fingerprint !== bookingFingerprint(booking)) throw new Error('Reservation has changed');
  const apartment = await smoobuGet(`/api/apartments/${booking.apartment.id}`);
  const payment = await stripePayment(paymentIntentId);
  assertStripePayment(payment, booking, apartment.currency);
  const location = apartment.location;
  if (!location?.street || !location.zip || !location.city) throw new Error('Address is not configured');
  return {
    slug: PROPERTY_SLUGS[booking.apartment.id],
    address: [location.street, location.city, location.zip, location.country].filter(Boolean).join(', '),
    arrival: booking.arrival, departure: booking.departure,
    fingerprint: bookingFingerprint(booking),
  };
}
