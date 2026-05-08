import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from '../styles/Properties.module.css';

// When you add more properties, just add to this array
const properties = [
  {
    id: 1,
    name: 'Greystead Road',
    address: '62 Greystead Road, Forest Hill, London SE23 3SD',
    type: 'Short Stay',
    zone: 'Zone 3',
    area: 'Forest Hill, SE23',
    price: 'Contact for pricing',
    available: true,
    image: '/foresthill.jpg',
    features: ['Fully Serviced', 'Professionally Cleaned', 'Flexible Bookings', 'All Bills Included'],
  },
];

export default function Properties() {
  const fadeRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 120);
      }), { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <>
      <Head><title>Properties | Agatha Living</title></Head>

      <div className="page-hero page-hero-properties">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Available Now</span>
          <h1>Our <em>properties</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Listings</span>
          <h2 className="section-title">Find your<br /><em>perfect stay</em></h2>
          <p className="section-sub">All properties are fully managed, professionally cleaned, and available for flexible short-term bookings.</p>
        </div>

        <div className={styles.grid}>
          {properties.map(p => (
            <div key={p.id} ref={addRef} className={`${styles.card} fade-up`}>
              <div className={styles.cardImg} style={{backgroundImage:`url('${p.image}')`}}>
                <span className={`${styles.cardTag} ${p.available ? styles.available : styles.unavailable}`}>
                  {p.available ? p.type + ' — Available' : 'Currently Unavailable'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <p className={styles.cardAddress}>📍 {p.address}</p>
                <div className={styles.cardFeatures}>
                  {p.features.map(f => <span key={f} className={styles.cardFeature}>{f}</span>)}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>{p.price}</span>
                  <Link href="/contact" className="btn-gold">Enquire</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More properties coming */}
        <div ref={addRef} className={`${styles.comingSoon} fade-up`}>
          <span className="section-tag">Coming Soon</span>
          <h3 className={styles.comingSoonTitle}>More properties are on the way</h3>
          <p className={styles.comingSoonSub}>We are constantly growing our portfolio. Get in touch to be notified when new properties become available.</p>
          <Link href="/contact" className="btn-outline-dark" style={{marginTop:'28px'}}>Join the Waiting List</Link>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section className={styles.booking}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Book a Viewing</span>
          <h2 className="section-title">Schedule a <em>call with us</em></h2>
          <p className="section-sub" style={{marginBottom:'48px'}}>Book a free 15-minute call to discuss availability, pricing, and any questions you have.</p>
          {/* CALENDLY EMBED — Replace the URL below with your own Calendly link */}
          <div className={styles.calendlyWrapper}>
            <iframe
              src="https://calendly.com/YOUR-CALENDLY-LINK"
              width="100%"
              height="700px"
              frameBorder="0"
              title="Book a call with Agatha Living"
            />
          </div>
          <p className={styles.calendlyNote}>
            Don't have time right now? <Link href="/contact">Send us a message instead →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
