import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function ContactDetails() {
  return (
    <>
      <Head>
        <title>Contact Details | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Contact</span>
          <h1>Contact <em>Details</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 13 May 2026</p>

          <div className={styles.content}>
            <p>
              For stay enquiries, booking questions, or general support, please use the contact details below.
            </p>

            <h2>1. Email</h2>
            <p><a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a></p>

            <h2>2. Phone</h2>
            <p><a href="tel:+447405803252">07405 803 252</a></p>

            <h2>3. Enquiry Hours</h2>
            <p>Monday to Friday: 9:00am to 6:00pm</p>
            <p>Saturday: 10:00am to 4:00pm</p>

            <h2>4. Trading Address</h2>
            <p>128 City Road, London, EC1V 2NX</p>

            <h2>5. Booking Enquiries</h2>
            <p>
              The quickest way to enquire about available dates is through the website booking enquiry form on the
              properties page.
            </p>

            <h2>6. Response Times</h2>
            <p>
              Agatha Living aims to respond to most enquiries within 24 hours, although response times may vary during busy periods.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/contact" className="btn-gold">Contact Page</Link>
            <Link href="/company-details" className="btn-outline-dark">Company Details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
