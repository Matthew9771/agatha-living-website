import { createHash, createHmac, randomUUID } from 'node:crypto';

export async function smoobuGet(path) {
  const key = process.env.SMOOBU_API_KEY;
  const secret = process.env.SMOOBU_API_SECRET;
  if (!key || !secret) throw new Error('Smoobu is not configured');
  if (!/^\/api\/(reservations|apartments)\/\d+$/.test(path)) throw new Error('Unsupported Smoobu request');
  const timestamp = new Date().toISOString();
  const nonce = randomUUID();
  const bodyHash = createHash('sha256').update('').digest('hex');
  const canonical = ['GET', path, '', timestamp, nonce, bodyHash, key].join('\n');
  const signature = createHmac('sha256', secret).update(canonical).digest('base64');
  const response = await fetch(`https://login.smoobu.com${path}`, {
    headers: { 'X-API-Key': key, 'X-Timestamp': timestamp, 'X-Nonce': nonce, 'X-Signature': signature },
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Smoobu verification unavailable');
  return response.json();
}
