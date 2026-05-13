import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function CompanyDetails() {
  return (
    <>
      <Head>
        <title>Company Details | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Company</span>
          <h1>Company <em>Details</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 13 May 2026</p>

          <div className={styles.content}>
            <p>
              This page provides the main business details currently used for guest and service enquiries relating to Agatha Living.
            </p>

            <h2>1. Registered Company Name</h2>
            <p>Agatha Living LTD</p>

            <h2>2. Company Number</h2>
            <p>16282753</p>

            <h2>3. Trading Name</h2>
            <p>Agatha Living</p>

            <h2>4. Trading Address</h2>
            <p>128 City Road, London, EC1V 2NX</p>

            <h2>5. Date of Incorporation</h2>
            <p>28 February 2025</p>

            <h2>6. Services</h2>
            <p>Serviced accommodation, booking enquiries, property management, and property-related support.</p>

            <h2>7. Service Area</h2>
            <p>London, England, including serviced stays and related property support.</p>

            <h2>8. Enquiry Email</h2>
            <p><a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a></p>

            <h2>9. Enquiry Telephone</h2>
            <p><a href="tel:+447405803252">07405 803 252</a></p>

            <h2>10. Website</h2>
            <p>agathaliving.co.uk</p>

            <h2>11. Additional Business Information</h2>
            <p>
              If any additional invoicing or business documentation is required for a confirmed stay or service,
              it can be provided at the appropriate stage on request.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/contact-details" className="btn-gold">Contact Details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
