import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Contact.module.css';

const AIRBNB_FOREST_HILL_URL = 'https://www.airbnb.co.uk/rooms/1394775661627058327?check_in=2026-05-18&check_out=2026-05-20&search_mode=regular_search&source_impression_id=p3_1778713075_P3WfSwqM7tELVXet&previous_page_section_name=1000&federated_search_id=5d1eb801-72ef-4bac-bc47-6f465788be97';
const BOOKING_FOREST_HILL_URL = 'https://www.booking.com/hotel/gb/stylish-2br-fast-wifi-with-balcony.en-gb.html?label=gen173nr-10CAEoggI46AdIM1gEaFCIAQGYATO4AQfIAQ3YAQPoAQH4AQGIAgGoAgG4ArqIlNAGwAIB0gIkNTQwY2VlYTgtZjBiMi00YjgyLWI2M2YtNzU3NDgzMTRiMTky2AIB4AIB&aid=304142&ucfs=1&checkin=2026-05-18&checkout=2026-05-20&dest_id=80&dest_type=district&group_adults=2&no_rooms=1&group_children=0&srpvid=34d4a2a5f0490c01&srepoch=1778713696&matching_block_id=1395371401_411943997_2_0_0&atlas_src=sr_iw_title';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const fadeRefs = useRef([]);

  const openAirbnbListing = () => {
    if (typeof window === 'undefined') return;
    window.location.assign(AIRBNB_FOREST_HILL_URL);
  };

  const openBookingListing = () => {
    if (typeof window === 'undefined') return;
    window.location.assign(BOOKING_FOREST_HILL_URL);
  };

  useEffect(() => {
    const revealAll = () => {
      fadeRefs.current.forEach(el => el && el.classList.add('visible'));
    };

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 120);
      }), { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    const fallbackTimer = window.setTimeout(revealAll, 900);
    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);
  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const data = new FormData(e.target);
    // Replace YOUR_FORM_ID with your Formspree ID from formspree.io/new
    const res = await fetch('https://formspree.io/f/xldbdwzq', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      setStatus('success');
      e.target.reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <>
      <Head><title>Contact | Agatha Living</title></Head>

      <div className="page-hero page-hero-contact">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Get in Touch</span>
          <h1>Let's talk about<br /><em>your next move</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.grid}>
          {/* Contact info */}
          <div ref={addRef} className={`${styles.info} fade-up`}>
            <span className="section-tag">Contact Details</span>
          <h2 className="section-title">Here to help with <em>your plans</em></h2>
            <p className="section-sub" style={{marginBottom:'48px'}}>Whether the enquiry is about a stay, hosting support, or property guidance, a reply will be sent promptly.</p>

            <div className={styles.details}>
              {[
                { label: 'Email', value: 'support@agathaliving.co.uk', href: 'mailto:support@agathaliving.co.uk' },
                { label: 'Phone', value: '07405 803 252', href: 'tel:+447405803252' },
                { label: 'Hours', value: 'Mon–Fri: 9am–6pm\nSat: 10am–4pm', href: null },
              ].map(d => (
                <div key={d.label} className={styles.detailItem}>
                  <span className={styles.detailLabel}>{d.label}</span>
                  <div className={styles.detailDivider} />
                  {d.href
                    ? <a href={d.href} className={styles.detailValue}>{d.value}</a>
                    : <p className={styles.detailValue} style={{whiteSpace:'pre-line'}}>{d.value}</p>}
                </div>
              ))}
            </div>

            <div className={styles.social}>
              <span className={styles.detailLabel}>Find Us</span>
              <div className={styles.detailDivider} />
              <div className={styles.socialLinks}>
                <a href="#">Instagram</a>
                <a href="#">LinkedIn</a>
                <button type="button" onClick={openAirbnbListing}>Airbnb</button>
                <button type="button" onClick={openBookingListing}>Booking.com</button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div ref={addRef} className={`${styles.formWrap} fade-up`}>
            {status === 'success' ? (
              <div className={styles.successMsg}>
                <span className={styles.successIcon}>✓</span>
                <h3>Message received!</h3>
                <p>Thank you for getting in touch. A reply will be sent within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <input type="hidden" name="_subject" value="New enquiry — Agatha Living" />
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input type="text" name="first_name" placeholder="Jane" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input type="text" name="last_name" placeholder="Smith" required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="jane@example.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="tel" name="phone" placeholder="07700 000000" />
                </div>
                <div className={styles.formGroup}>
                  <label>I'm interested in</label>
                  <select name="interest">
                    <option>Short-term accommodation</option>
                    <option>Property management</option>
                    <option>Buying / selling property</option>
                    <option>General enquiry</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea name="message" rows={5} placeholder="Tell us a bit more about what you're looking for…" />
                </div>
                {status === 'error' && <p className={styles.errorMsg}>Something went wrong. Please try again or email us directly.</p>}
                <button type="submit" className={`btn-gold ${styles.submitBtn}`} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
