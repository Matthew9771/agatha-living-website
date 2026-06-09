import Head from 'next/head';
import Link from 'next/link';
import { useFadeUp } from '../hooks/useFadeUp';
import styles from '../styles/About.module.css';

export default function About() {
  const addRef = useFadeUp();

  return (
    <>
      <Head><title>About | Agatha Living</title></Head>

      {/* PAGE HERO */}
      <div className="page-hero page-hero-about">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">The Agatha Living Approach</span>
          <h1>Built on care,<br /><em>driven by quality</em></h1>
        </div>
      </div>

      {/* STORY */}
      <section className={styles.story}>
        <div ref={addRef} className={`${styles.storyText} fade-up`}>
          <span className="section-tag">Designed Around the Stay</span>
          <h2 className="section-title">About <em>Agatha Living</em></h2>
          <p className={styles.lead}>Agatha Living creates better living across London with premium short-term stays, specialist property management, and practical investment support.</p>
          <p className={styles.body}>We help guests find calm, comfortable stay options, while also giving landlords and councils dependable solutions for housing, maintenance, and guaranteed income.</p>
          <p className={styles.body}>From council partnerships and guaranteed rent packages to guest-ready homes, maintenance-backed property management and direct booking services, Agatha Living is built around every side of the home experience.</p>
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
          <span className="section-tag">What Matters Most</span>
          <h2 className="section-title">What every stay and partnership should <em>feel like</em></h2>
        </div>
        <div className={styles.valuesGrid}>
          {[
            { icon: '🏡', title: 'Quality First', desc: 'Every stay is prepared to hotel standards, with a strong focus on cleanliness, presentation, and comfort.' },
            { icon: '🤝', title: 'Clear & Reassuring', desc: 'Straightforward information, thoughtful details, and no surprises before or during the stay.' },
            { icon: '⚙️', title: 'Landlord & Council Care', desc: 'Guaranteed rent packages, maintenance-backed management, and compliant housing partnerships for owners and councils.' },
            { icon: '✨', title: 'Calm by Design', desc: 'Spaces are styled to feel settled, polished, and easy to relax into from the moment of arrival.' },
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
          <span className="section-tag">Plan the Next Step</span>
          <h2 className="section-title">Ready to explore your <em>next stay?</em></h2>
          <p className="section-sub" style={{marginBottom:'40px'}}>Browse the current stay, ask a question, or explore the service that fits best.</p>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn-gold">Get in Touch</Link>
            <Link href="/services" className="btn-outline-dark">View Services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
