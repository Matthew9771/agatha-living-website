import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | Agatha Living</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="page-hero page-hero-contact">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">404 Error</span>
          <h1>Page not <em>found</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card} style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <h2 className={styles.title} style={{ marginBottom: 16 }}>This page doesn't exist</h2>
          <p className={styles.copy} style={{ marginBottom: 40 }}>
            The page you're looking for may have moved or been removed. Head back to the homepage or get in touch and we'll help you find what you need.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-gold">Go to homepage</Link>
            <Link href="/contact" className="btn-outline-dark">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
