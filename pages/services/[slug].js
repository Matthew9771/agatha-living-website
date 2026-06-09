import Head from 'next/head';
import Link from 'next/link';
import { SERVICES, getServiceBySlug } from '../../lib/services';
import styles from '../../styles/Services.module.css';

export default function ServiceDetail({ service }) {
  return (
    <>
      <Head>
        <title>{`${service.title} | Agatha Living`}</title>
        <meta name="description" content={`${service.title} from Agatha Living. Read more about what is included, how it works, and enquire directly.`} />
      </Head>

      <div className="page-hero page-hero-services">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <Link href="/services" className={styles.detailBackLink}>← Back to services</Link>
          <span className="section-tag">Service detail</span>
          <h1>{service.title}</h1>
        </div>
      </div>

      <section className={styles.detailIntro}>
        <div className={styles.detailIntroContent}>
          <span className={styles.serviceNum}>{service.num}</span>
          <div className={styles.serviceIcon}>{service.icon}</div>
          <p className={styles.detailLead}>{service.detailIntro}</p>
          <div className={styles.detailActions}>
            <Link href="/contact" className="btn-gold">Enquire now</Link>
            {service.slug === 'short-term-stays' ? (
              <Link href="/properties" className="btn-outline-dark">View properties</Link>
            ) : (
              <Link href="/services" className="btn-outline-dark">View all services</Link>
            )}
          </div>
        </div>
        <div className={styles.detailFeatureCard}>
          <h2>What this covers</h2>
          <ul className={styles.featureList}>
            {service.features.map(feature => (
              <li key={feature}><span className={styles.tick}>✓</span>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.detailBody}>
        {service.detailSections.map(section => (
          <article key={section.title} className={styles.detailArticle}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className={styles.topicGrid}>
        <span className="section-tag">Key Topics</span>
        <h2 className="section-title">Read the essentials</h2>
        <div className={styles.topicCards}>
          {service.panels.map(panel => (
            <article key={panel.key} className={styles.topicCard}>
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.detailCta}>
        <span className="section-tag">Enquire</span>
        <h2 className="section-title">Want to discuss<br /><em>{service.title.toLowerCase()}?</em></h2>
        <p className="section-sub">Send a short enquiry and Agatha Living can respond with the most relevant next steps.</p>
        <Link href="/contact" className="btn-gold">Enquire now</Link>
      </section>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: SERVICES.map(service => ({ params: { slug: service.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return { notFound: true };
  }
  return { props: { service } };
}
