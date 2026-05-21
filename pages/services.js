import Head from 'next/head';
import Link from 'next/link';
import { useFadeUp } from '../hooks/useFadeUp';
import styles from '../styles/Services.module.css';

const services = [
  {
    num: '01', icon: '🏠', title: 'Short-Term Stays',
    desc: 'Fully furnished, hotel-quality apartments available on Airbnb and direct booking. Each property is professionally styled, spotlessly clean, and stocked with everything guests need for a comfortable stay.',
    features: ['Professional photography', 'Hotel-grade linen & toiletries', 'Keyless entry & digital guidebook', '24/7 guest support', 'Weekly cleaning included'],
  },
  {
    num: '02', icon: '🔑', title: 'Property Management',
    desc: 'A fully managed hosting service for owners who want listing optimisation, guest communication, cleaning coordination, and maintenance handled smoothly.',
    features: ['Dynamic pricing strategy', 'Guest screening & communications', 'Professional cleaning between stays', 'Maintenance coordination', 'Monthly performance reports'],
  },
  {
    num: '03', icon: '🏢', title: 'Real Estate',
    desc: 'Thoughtful property guidance for buyers, sellers, and investors looking for clear support from search through to completion.',
    features: ['Property search & sourcing', 'Investment yield analysis', 'Viewing & negotiation support', 'Solicitor & surveyor referrals', 'Post-purchase management'],
  },
];

export default function Services() {
  const addRef = useFadeUp();

  return (
    <>
      <Head><title>Services | Agatha Living</title></Head>

      <div className="page-hero page-hero-services">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Services</span>
          <h1>A complete<br /><em>living solution</em></h1>
        </div>
      </div>

      <section className={styles.intro}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Explore Services</span>
          <h2 className="section-title">Everything you need,<br /><em>all in one place</em></h2>
          <p className="section-sub">From premium short-term stays to hosting support and property guidance, each service is designed to feel clear, polished, and easy to navigate.</p>
        </div>
      </section>

      {services.map((s, idx) => (
        <section key={s.num} className={`${styles.serviceRow} ${idx % 2 === 1 ? styles.reversed : ''}`}>
          <div
            ref={addRef}
            className={`${styles.serviceImg} ${styles[`serviceImg${idx + 1}`]} fade-up`}
          />
          <div ref={addRef} className={`${styles.serviceContent} fade-up`}>
            <span className={styles.serviceNum}>{s.num}</span>
            <div className={styles.serviceIcon}>{s.icon}</div>
            <h2 className="section-title">{s.title}</h2>
            <p className={styles.serviceDesc}>{s.desc}</p>
            <ul className={styles.featureList}>
              {s.features.map(f => <li key={f}><span className={styles.tick}>✓</span>{f}</li>)}
            </ul>
            <Link href="/contact" className="btn-gold" style={{marginTop:'32px'}}>Enquire About This</Link>
          </div>
        </section>
      ))}

      <section className={styles.cta}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Get Started</span>
          <h2 className="section-title">Not sure which<br /><em>service you need?</em></h2>
          <p className="section-sub" style={{marginBottom:'40px'}}>Share what you're looking for and the right option can be mapped out from there.</p>
          <Link href="/contact" className="btn-gold">Send an enquiry</Link>
        </div>
      </section>
    </>
  );
}
