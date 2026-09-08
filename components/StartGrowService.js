import Head from 'next/head';
import Link from 'next/link';
import { START_GROW_CARDS } from '../lib/start-grow';
import ServiceEnquiryForm from './ServiceEnquiryForm';
import styles from '../styles/Services.module.css';

export default function StartGrowService() {
  return (
    <>
      <Head>
        <title>Start &amp; Grow Your SA Business | Coming Soon | Agatha Living</title>
        <meta name="description" content="Explore Agatha Living's planned serviced accommodation feasibility, property sourcing, business setup and launch services. Register your interest or request a free introductory call." />
      </Head>
      <div className="page-hero page-hero-services">
        <div className="page-hero-bg" /><div className="page-hero-overlay" />
        <div className="page-hero-content">
          <Link href="/services" className={styles.detailBackLink}>← Back to services</Link>
          <span className={styles.comingSoonBadge}>Coming Soon</span>
          <h1>Start &amp; Grow Your SA Business</h1>
        </div>
      </div>
      <section className={styles.intro}>
        <h2 className="section-title">From your first idea to your next property.</h2>
        <p className="section-sub">Agatha Living is developing a range of practical services for people looking to start or grow a serviced accommodation business. Our approach combines real operational experience, property market analysis, technology and structured systems to help you make better-informed decisions and build your operation.</p>
        <div className={styles.detailActions}>
          <a href="#register-interest" className="btn-gold">Register Your Interest</a>
          <a href="#free-call" className="btn-outline-dark">Book a Free 10-Minute Call</a>
        </div>
      </section>
      <section className={styles.topicGrid} aria-labelledby="help-heading">
        <span className="section-tag">Planned services</span>
        <h2 id="help-heading" className="section-title">How can we help?</h2>
        <div className={styles.growthCards}>
          {START_GROW_CARDS.map(card => (
            <article key={card.title} className={styles.detailFeatureCard}>
              <span className={styles.comingSoonBadge}>Coming Soon</span>
              <h3>{card.title}</h3>
              <p className={styles.serviceDesc}>{card.description}</p>
              <ul className={styles.featureList}>{card.features.map(feature => <li key={feature}><span className={styles.tick} aria-hidden="true">✓</span>{feature}</li>)}</ul>
              {card.note && <p className={styles.serviceNote}>{card.note}</p>}
            </article>
          ))}
        </div>
      </section>
      <section className={styles.detailCta}>
        <h2 className="section-title">Not sure where to start?</h2>
        <p className="section-sub">Book a free 10-minute introductory call to tell us about your plans and find out which Agatha Living service may be suitable for you.</p>
        <div className={styles.detailActions}><a href="#free-call" className="btn-gold">Book a Free 10-Minute Call</a></div>
      </section>
      <ServiceEnquiryForm kind="call" id="free-call" />
      <ServiceEnquiryForm kind="interest" id="register-interest" />
    </>
  );
}
