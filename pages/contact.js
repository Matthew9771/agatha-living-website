import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const fadeRefs = useRef([]);

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
                <a href="#">Airbnb</a>
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
