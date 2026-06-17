import Head from 'next/head';
import { SITE_URL } from '../lib/config';
import { addDays, formatLongDate, parseDateKey, toDateKey } from '../lib/utils';
import styles from '../styles/Payment.module.css';

const PROPERTY_NAME = 'Forest Hill – Elegant South London 2-Bed';
const DEFAULT_GUESTY_ICAL_URL = 'https://app.guesty.com/api/public/icalendar-dashboard-api/export/e68f4444-d5e2-4b22-ba51-883cd80cac30';
const DEFAULT_STRIPE_PAYMENT_LINK = 'https://book.stripe.com/3cIeVfdiKcK852Kd3yaAw00';

function formatAmount(amount) {
  if (!amount) return '£[AMOUNT]';
  return amount.trim().startsWith('£') ? amount.trim() : `£${amount.trim()}`;
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function parseIcalDate(value) {
  if (!value || !/^\d{8}$/.test(value)) return null;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function parseIcalEvents(calendarText) {
  if (!calendarText) return [];

  return calendarText
    .split('BEGIN:VEVENT')
    .slice(1)
    .map((block) => {
      const summary = block.match(/\nSUMMARY:(.+)\r?\n/)?.[1]?.trim() || '';
      const start = parseIcalDate(block.match(/\nDTSTART(?:;VALUE=DATE)?:([0-9]{8})/)?.[1]);
      const end = parseIcalDate(block.match(/\nDTEND(?:;VALUE=DATE)?:([0-9]{8})/)?.[1]);
      return { summary, start, end };
    })
    .filter((event) => event.start && event.end)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function findAdditionalNight(events, reservationId) {
  const todayKey = toDateKey(new Date());
  const reservationEvents = events.filter((event) => event.summary.toLowerCase().includes('reservation'));

  if (reservationId) {
    const matchingEvent = reservationEvents.find((event) => event.summary.includes(reservationId));
    return matchingEvent?.end || null;
  }

  for (let index = 0; index < reservationEvents.length; index += 1) {
    const current = reservationEvents[index];
    const next = reservationEvents[index + 1];

    if (current.end < todayKey) continue;
    if (next && current.end >= next.start) continue;

    return current.end;
  }

  return null;
}

function findAdditionalNightByStayDate(events, stayDate) {
  if (!parseDateKey(stayDate)) return null;

  const reservationEvents = events.filter((event) => event.summary.toLowerCase().includes('reservation'));
  const matchingEvent = reservationEvents.find((event) => event.start <= stayDate && stayDate < event.end);

  return matchingEvent?.end || null;
}

async function fetchGuestyAdditionalNight(reservationId, stayDate) {
  const calendarUrl = process.env.FOREST_HILL_EXTRA_NIGHT_GUESTY_ICAL_URL
    || process.env.GUESTY_ICAL_URL
    || DEFAULT_GUESTY_ICAL_URL;

  try {
    const response = await fetch(calendarUrl, { headers: { Accept: 'text/calendar,text/plain,*/*' } });
    if (!response.ok) return null;

    const calendarText = await response.text();
    const events = parseIcalEvents(calendarText);

    if (stayDate) {
      return findAdditionalNightByStayDate(events, stayDate);
    }

    return findAdditionalNight(events, reservationId);
  } catch {
    return null;
  }
}

function formatStripeAmount(amount, currency = 'gbp') {
  if (!Number.isFinite(amount)) return '';

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return formatAmount(String(amount / 100));
  }
}

async function stripeRequest(path) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

async function fetchStripePaymentLinkAmount(paymentLinkUrl) {
  if (!paymentLinkUrl || !process.env.STRIPE_SECRET_KEY) return '';

  try {
    const paymentLinks = await stripeRequest('payment_links?limit=100');
    const paymentLink = paymentLinks?.data?.find((item) => item.url === paymentLinkUrl);
    if (!paymentLink?.id) return '';

    const lineItems = await stripeRequest(`payment_links/${paymentLink.id}/line_items?limit=10`);
    const totalAmount = lineItems?.data?.reduce((total, item) => {
      const quantity = item.quantity || 1;
      const unitAmount = item.price?.unit_amount || 0;
      return total + (unitAmount * quantity);
    }, 0);
    const currency = lineItems?.data?.[0]?.currency || lineItems?.data?.[0]?.price?.currency || 'gbp';

    return totalAmount ? formatStripeAmount(totalAmount, currency) : '';
  } catch {
    return '';
  }
}

export default function ForestHillExtraNight({ additionalNight, newCheckout, amountDue, paymentLink }) {
  const hasPaymentLink = Boolean(paymentLink);

  return (
    <>
      <Head>
        <title>Forest Hill Stay Extension | Agatha Living</title>
        <meta
          name="description"
          content="Secure payment for your additional night at our Forest Hill property."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href={`${SITE_URL}/forest-hill-extra-night`} />
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Secure Payment</span>
          <h1>Forest Hill Stay <em>Extension</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <div className={styles.intro}>
            <span className="section-tag">Booking Details</span>
            <h2>Forest Hill Stay Extension</h2>
            <p>
              Secure payment for your additional night at our Forest Hill property.
            </p>
          </div>

          <dl className={styles.details}>
            <div>
              <dt>Property</dt>
              <dd>{PROPERTY_NAME}</dd>
            </div>
            <div>
              <dt>Additional night</dt>
              <dd>Night of {formatLongDate(additionalNight)}</dd>
            </div>
            <div>
              <dt>New checkout</dt>
              <dd>{formatLongDate(newCheckout)}</dd>
            </div>
            <div className={styles.amountRow}>
              <dt>Amount due</dt>
              <dd>{amountDue}</dd>
            </div>
          </dl>

          <a
            className={`btn-gold ${styles.payButton} ${!hasPaymentLink ? styles.disabledButton : ''}`}
            href={hasPaymentLink ? paymentLink : '#'}
            target={hasPaymentLink ? '_blank' : undefined}
            rel={hasPaymentLink ? 'noopener noreferrer' : undefined}
            aria-disabled={!hasPaymentLink}
          >
            Pay Securely by Card
          </a>

          <p className={styles.note}>
            Once payment is complete, your stay extension will be confirmed and our calendar will be updated.
          </p>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const expectedToken = process.env.FOREST_HILL_EXTRA_NIGHT_ACCESS_TOKEN || '';
  const suppliedToken = getQueryValue(query.token) || '';

  if (expectedToken && suppliedToken !== expectedToken) {
    return { notFound: true };
  }

  const paymentLink = process.env.FOREST_HILL_EXTRA_NIGHT_PAYMENT_LINK || DEFAULT_STRIPE_PAYMENT_LINK;
  const queryDate = getQueryValue(query.date);
  const queryAmount = getQueryValue(query.amount);
  const reservationId = getQueryValue(query.reservation) || process.env.FOREST_HILL_EXTRA_NIGHT_RESERVATION_ID || '';
  const stayDate = getQueryValue(query.stayDate) || '';
  const guestyNight = queryDate || process.env.FOREST_HILL_EXTRA_NIGHT_DATE || await fetchGuestyAdditionalNight(reservationId, stayDate);
  const stripeAmount = queryAmount || process.env.FOREST_HILL_EXTRA_NIGHT_AMOUNT || await fetchStripePaymentLinkAmount(paymentLink);
  const parsedNight = parseDateKey(guestyNight);
  const additionalNight = parsedNight ? toDateKey(parsedNight) : '[DATE]';
  const newCheckout = parsedNight ? toDateKey(addDays(parsedNight, 1)) : '[DATE]';
  const amountDue = stripeAmount ? formatAmount(stripeAmount) : 'Shown on Stripe checkout';

  return {
    props: {
      additionalNight,
      newCheckout,
      amountDue,
      paymentLink,
    },
  };
}
