import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLISHABLE_KEY, DEPOSIT_PERCENT } from '../lib/config';
import { formatLongDate, formatCurrency } from '../lib/utils';
import styles from '../styles/Checkout.module.css';

let stripePromise;
function getStripe() {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

function getQueryValue(value, fallback = '') {
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function CheckoutForm({ booking, paymentMode, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?confirmed=true`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.stripeWrap}>
        <PaymentElement />
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button
        type="submit"
        className={`btn-gold ${styles.submitBtn}`}
        disabled={!stripe || loading}
      >
        {loading
          ? 'Processing…'
          : `Pay ${paymentMode === 'deposit' ? 'deposit' : 'in full'} now`}
      </button>
      <p className={styles.secureNote}>
        <span>🔒</span> Payments are secured by Stripe. Your card details are never stored.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { query } = useRouter();
  const [paymentMode, setPaymentMode] = useState('deposit');
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState('');
  const [paid, setPaid] = useState(false);
  const [returnMessage, setReturnMessage] = useState('');

  const returnedClientSecret = getQueryValue(query.payment_intent_client_secret);

  const booking = useMemo(() => ({
    property: getQueryValue(query.property, 'Greystead Road'),
    checkIn: getQueryValue(query.checkIn),
    checkOut: getQueryValue(query.checkOut),
    guests: getQueryValue(query.guests, '2'),
    nights: getQueryValue(query.nights),
    total: Number(getQueryValue(query.total, '0')),
  }), [query]);

  const depositAmount = Math.round(booking.total * DEPOSIT_PERCENT / 100);

  useEffect(() => {
    if (!booking.total || booking.total < 1) return;
    if (returnedClientSecret) return;

    setLoadingIntent(true);
    setClientSecret('');
    setIntentError('');

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property: booking.property,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        paymentMode,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setIntentError(data.error || 'Unable to initialise payment.');
        }
      })
      .catch(() => setIntentError('Unable to connect to payment service.'))
      .finally(() => setLoadingIntent(false));
  }, [booking.property, booking.checkIn, booking.checkOut, booking.guests, booking.total, paymentMode, returnedClientSecret]);

  useEffect(() => {
    if (!returnedClientSecret) return;

    let isMounted = true;
    setLoadingIntent(true);
    setIntentError('');
    setReturnMessage('Checking your payment status...');

    const stripeLoader = getStripe();
    if (!stripeLoader) {
      setIntentError('Payment service is not configured.');
      setLoadingIntent(false);
      return;
    }

    stripeLoader
      .then(stripe => stripe.retrievePaymentIntent(returnedClientSecret))
      .then(result => {
        if (!isMounted) return;
        const status = result?.paymentIntent?.status;
        if (status === 'succeeded') {
          setPaid(true);
        } else if (status === 'processing') {
          setReturnMessage('Your payment is processing. We will confirm as soon as Stripe completes it.');
        } else {
          setIntentError('Payment was not completed. Please try again or contact us.');
        }
      })
      .catch(() => {
        if (isMounted) setIntentError('Unable to verify payment status. Please contact us if money has left your account.');
      })
      .finally(() => {
        if (isMounted) setLoadingIntent(false);
      });

    return () => { isMounted = false; };
  }, [returnedClientSecret]);

  const stripeOptions = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: '#c9a96e',
        colorBackground: '#ffffff',
        colorText: '#181613',
        colorDanger: '#8b3a2e',
        borderRadius: '16px',
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      },
    },
  }), [clientSecret]);

  if (paid) {
    return (
      <>
        <Head><title>Booking Confirmed | Agatha Living</title></Head>
        <div className="page-hero page-hero-contact">
          <div className="page-hero-bg" />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <span className="section-tag">Booking Confirmed</span>
            <h1>You're all <em>set</em></h1>
          </div>
        </div>
        <section className={styles.section}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <div className={styles.successIcon}>✓</div>
            <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 12 }}>
              Payment received
            </h3>
            <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.7, marginBottom: 32 }}>
              Thank you for booking {booking.property || 'your stay'}. A confirmation email will be sent shortly with your stay details and next steps.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-gold">Back to homepage</Link>
              <Link href="/contact" className="btn-outline-dark">Contact us</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Secure Checkout | Agatha Living</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="page-hero page-hero-contact">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Secure Checkout</span>
          <h1>Complete your <em>booking</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.layout}>

          {/* Booking summary */}
          <div className={styles.summary}>
            <p className={styles.summaryProperty}>Agatha Living</p>
            <h2 className={styles.summaryTitle}>{booking.property}</h2>
            <div className={styles.summaryRows}>
              {booking.checkIn ? (
                <div className={styles.summaryRow}>
                  <span>Check-in</span>
                  <strong>{formatLongDate(booking.checkIn)}</strong>
                </div>
              ) : null}
              {booking.checkOut ? (
                <div className={styles.summaryRow}>
                  <span>Check-out</span>
                  <strong>{formatLongDate(booking.checkOut)}</strong>
                </div>
              ) : null}
              {booking.guests ? (
                <div className={styles.summaryRow}>
                  <span>Guests</span>
                  <strong>{booking.guests}</strong>
                </div>
              ) : null}
              {booking.nights ? (
                <div className={styles.summaryRow}>
                  <span>Nights</span>
                  <strong>{booking.nights}</strong>
                </div>
              ) : null}
            </div>
            {booking.total > 0 ? (
              <div className={styles.summaryTotal}>
                <span>Stay total</span>
                <strong>{formatCurrency(booking.total)}</strong>
              </div>
            ) : null}
            {paymentMode === 'deposit' ? (
              <p className={styles.summaryNote}>
                A {DEPOSIT_PERCENT}% deposit of {formatCurrency(depositAmount)} is due now. The remaining balance of {formatCurrency(booking.total - depositAmount)} is collected before check-in.
              </p>
            ) : (
              <p className={styles.summaryNote}>
                You are paying the full stay amount of {formatCurrency(booking.total)} now.
              </p>
            )}
          </div>

          {/* Payment form */}
          <div className={styles.paymentPanel}>
            <h2 className={styles.paymentTitle}>Payment</h2>
            <p className={styles.paymentSub}>Choose how much to pay today.</p>

            <div className={styles.toggleRow}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${paymentMode === 'deposit' ? styles.active : ''}`}
                onClick={() => setPaymentMode('deposit')}
              >
                <span className={styles.toggleLabel}>Deposit ({DEPOSIT_PERCENT}%)</span>
                <span className={styles.toggleAmount}>{formatCurrency(depositAmount)}</span>
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${paymentMode === 'full' ? styles.active : ''}`}
                onClick={() => setPaymentMode('full')}
              >
                <span className={styles.toggleLabel}>Pay in full</span>
                <span className={styles.toggleAmount}>{formatCurrency(booking.total)}</span>
              </button>
            </div>

            {!booking.total ? (
              <p className={styles.error}>No booking details found. Please go back and select your dates.</p>
            ) : !STRIPE_PUBLISHABLE_KEY ? (
              <p className={styles.error}>Payment service is not configured.</p>
            ) : returnMessage ? (
              <div className={styles.processing}>{returnMessage}</div>
            ) : intentError ? (
              <p className={styles.error}>{intentError}</p>
            ) : loadingIntent || !clientSecret ? (
              <div className={styles.processing}>Loading secure payment…</div>
            ) : (
              <Elements stripe={getStripe()} options={stripeOptions} key={clientSecret}>
                <CheckoutForm
                  booking={booking}
                  paymentMode={paymentMode}
                  onSuccess={() => setPaid(true)}
                />
              </Elements>
            )}

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Link href="/properties" className={styles.backLink}>← Back to properties</Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
