import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getPropertyBySlug } from '../lib/properties';
import styles from '../styles/Availability.module.css';

export default function GuestDetails() {
  const [stay, setStay] = useState(null);
  const tokenRef = useRef(null);
  const [message, setMessage] = useState('Verifying your booking and full payment…');

  useEffect(() => {
    const token = tokenRef.current || new URLSearchParams(window.location.hash.slice(1)).get('access');
    tokenRef.current = token;
    window.history.replaceState(null, '', window.location.pathname);
    if (!token) {
      setMessage('Please open the private access link sent with your confirmed booking.');
      return;
    }
    let active = true;
    fetch('/api/guest-details', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }), cache: 'no-store',
    }).then(async response => {
      if (!response.ok) throw new Error('Access not verified');
      const details = await response.json();
      if (active) setStay(details);
    }).catch(() => {
      if (active) setMessage('We could not verify access. Please contact us for help with your booking.');
    });
    return () => { active = false; };
  }, []);

  const property = stay && getPropertyBySlug(stay.slug);
  return (
    <>
      <Head>
        <title>Your stay | Agatha Living</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <main className={styles.page}>
        <section className={styles.booking}>
          <span className="section-tag">Your private stay details</span>
          <h1>{property ? property.name : 'Welcome to Agatha Living'}</h1>
          {property ? (
            <>
              <p>Booking and full payment verified.</p>
              <h2>Property address</h2>
              <p>{stay.address}</p>
              <p>Arrival: {stay.arrival} · Departure: {stay.departure}</p>
              <p>Check-in from {property.checkInFrom}.</p>
            </>
          ) : <p role="status">{message}</p>}
          <Link href="/contact" className="btn-outline-dark">Contact Agatha Living</Link>
        </section>
      </main>
    </>
  );
}

export function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return { props: {} };
}
