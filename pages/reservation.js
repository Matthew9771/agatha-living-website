import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Legal.module.css';

function formatDate(value) {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTotal(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ReservationPage() {
  const { query } = useRouter();
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');

    const formData = new FormData(event.target);

    try {
      const response = await fetch('https://formspree.io/f/xldbdwzq', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Unable to send enquiry');
      }

      setStatus('success');
      event.target.reset();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <Head><title>Booking Enquiry | Agatha Living</title></Head>

      <div className="page-hero page-hero-contact">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Booking Enquiry</span>
          <h1>Review your <em>stay</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.title}>{query.property || 'Your booking enquiry'}</h2>
          <p className={styles.copy}>Review the selected stay below, then send the enquiry directly with the dates already included.</p>

          <div className={styles.metaGrid}>
            <div><strong>Check-in</strong><p>{formatDate(query.checkIn)}</p></div>
            <div><strong>Check-out</strong><p>{formatDate(query.checkOut)}</p></div>
            <div><strong>Guests</strong><p>{query.guests || '-'}</p></div>
            <div><strong>Nights</strong><p>{query.nights || '-'}</p></div>
            <div><strong>Total</strong><p>{formatTotal(query.total) || '-'}</p></div>
          </div>

          {status === 'success' ? (
            <div className={styles.successState}>
              <h3>Enquiry received</h3>
              <p>Thank you. The stay enquiry has been received, and a confirmation with the next steps will be sent shortly.</p>
              <div className={styles.actions}>
                <Link href="/properties" className="btn-outline-dark">Back to properties</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.enquiryForm}>
              <input type="hidden" name="_subject" value={`Booking enquiry — ${query.property || 'Agatha Living stay'}`} />
              <input type="hidden" name="property" value={query.property || ''} />
              <input type="hidden" name="check_in" value={formatDate(query.checkIn)} />
              <input type="hidden" name="check_out" value={formatDate(query.checkOut)} />
              <input type="hidden" name="guests" value={query.guests || ''} />
              <input type="hidden" name="nights" value={query.nights || ''} />
              <input type="hidden" name="total" value={formatTotal(query.total) || ''} />

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="first_name">First name</label>
                  <input id="first_name" type="text" name="first_name" placeholder="Jane" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="last_name">Last name</label>
                  <input id="last_name" type="text" name="last_name" placeholder="Smith" required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email address</label>
                  <input id="email" type="email" name="email" placeholder="jane@example.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone number</label>
                  <input id="phone" type="tel" name="phone" placeholder="07700 000000" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Add any arrival notes or questions here…"
                  defaultValue={`Stay requested: ${query.property || 'Agatha Living stay'}
Check-in: ${formatDate(query.checkIn) || '-'}
Check-out: ${formatDate(query.checkOut) || '-'}
Guests: ${query.guests || '-'}
Nights: ${query.nights || '-'}
Total: ${formatTotal(query.total) || '-'}`}
                />
              </div>

              {status === 'error' ? (
                <p className={styles.formError}>Something went wrong while sending the enquiry. Please try again.</p>
              ) : null}

              <div className={styles.actions}>
                <button type="submit" className="btn-gold" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send booking enquiry'}
                </button>
                <Link href="/properties" className="btn-outline-dark">Back to properties</Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
