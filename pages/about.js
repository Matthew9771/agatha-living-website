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
          <p className={styles.lead}>Agatha Living is built around calm, well-prepared stays and thoughtful property experiences from the moment a visit begins.</p>
          <p className={styles.body}>Every detail is shaped around comfort, presentation, and fast, helpful communication, so each stay feels polished, easy, and welcoming.</p>
          <p className={styles.body}>That same level of care carries through every part of the brand, from short stays to property services across London.</p>
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
          <h2 className="section-title">What every stay should <em>feel like</em></h2>
        </div>
        <div className={styles.valuesGrid}>
          {[
            { icon: '🏡', title: 'Quality First', desc: 'Every stay is prepared to hotel standards, with a strong focus on cleanliness, presentation, and comfort.' },
            { icon: '🤝', title: 'Clear & Reassuring', desc: 'Straightforward information, thoughtful details, and no surprises before or during the stay.' },
            { icon: '⚡', title: 'Responsive Service', desc: 'Questions, arrival details, and stay support are handled quickly when they matter most.' },
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
