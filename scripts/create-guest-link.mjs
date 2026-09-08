import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { createGuestToken, verifyPaidStay } from '../lib/server/guest-access.mjs';

Object.assign(process.env, parseEnv(readFileSync(new URL('../.env.local', import.meta.url), 'utf8')));
const [reservationId, paymentIntentId] = process.argv.slice(2);
try {
  const stay = await verifyPaidStay(reservationId, paymentIntentId);
  const token = createGuestToken({ reservationId, paymentIntentId, fingerprint: stay.fingerprint });
  console.log(`https://www.agathaliving.co.uk/guest-details#access=${token}`);
} catch {
  console.error('No link created. Check server credentials, full live payment, reservation status, address and Stripe reservation metadata.');
  process.exitCode = 1;
}
