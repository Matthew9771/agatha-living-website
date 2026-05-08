import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from '../styles/About.module.css';

export default function About() {
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
      <Head><title>About | Agatha Living</title></Head>

      {/* PAGE HERO */}
      <div className="page-hero page-hero-about">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Our Story</span>
          <h1>Built on care,<br /><em>driven by quality</em></h1>
        </div>
      </div>

      {/* STORY */}
      <section className={styles.story}>
        <div ref={addRef} className={`${styles.storyText} fade-up`}>
          <span className="section-tag">Who We Are</span>
          <h2 className="section-title">About <em>Agatha Living</em></h2>
          <p className={styles.lead}>Agatha Living was founded on a simple belief: that every guest deserves a home away from home, and every property owner deserves a partner they can truly trust.</p>
          <p className={styles.body}>We started with a single property on Airbnb and a commitment to excellence. Every detail — from the quality of the linen to the speed of our guest communications — was carefully considered. That commitment earned us five-star reviews and the confidence to grow.</p>
          <p className={styles.body}>Today we are expanding into real estate, bringing the same care and precision to helping clients buy, sell, and invest in property across London.</p>
        </div>
        <div ref={addRef} className={`${styles.storyImages} fade-up`}>
          <div className={styles.imgMain} />
          <div className={styles.imgAccent} />
          <div className={styles.badge}>
            <span className={styles.badgeNum}>5★</span>
            <span className={styles.badgeText}>Guest Rated</span>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className={styles.values}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Our Values</span>
          <h2 className="section-title">What we <em>stand for</em></h2>
        </div>
        <div className={styles.valuesGrid}>
          {[
            { icon: '🏡', title: 'Quality First', desc: 'Every property we manage is held to hotel standards. We never compromise on cleanliness, presentation, or comfort.' },
            { icon: '🤝', title: 'Trust & Transparency', desc: 'No hidden fees, no surprises. We give property owners full visibility and regular performance reports.' },
            { icon: '⚡', title: 'Responsive Service', desc: 'Guests and owners alike get fast, attentive support. We are always available when it matters most.' },
            { icon: '📈', title: 'Growth Focused', desc: 'We actively manage pricing and occupancy to maximise returns for our property owners.' },
          ].map(v => (
            <div key={v.title} ref={addRef} className={`${styles.valueCard} fade-up`}>
              <div className={styles.valueIcon}>{v.icon}</div>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Work With Us</span>
          <h2 className="section-title">Ready to get <em>started?</em></h2>
          <p className="section-sub" style={{marginBottom:'40px'}}>Whether you're looking to stay, invest, or have your property managed, we'd love to hear from you.</p>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn-gold">Get in Touch</Link>
            <Link href="/services" className="btn-outline-dark">Our Services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
