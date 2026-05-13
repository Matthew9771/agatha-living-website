import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function CancellationPolicy() {
  return (
    <>
      <Head>
        <title>Cancellation Policy | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Policy</span>
          <h1>Cancellation <em>Policy</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 13 May 2026</p>

          <div className={styles.content}>
            <p>
              This Cancellation Policy explains how booking enquiries, confirmed stays, and date changes are handled
              for direct bookings made with Agatha Living.
            </p>

            <h2>1. Booking Enquiries</h2>
            <p>
              An enquiry submitted through the website is not a confirmed booking. A stay is only treated as confirmed
              once dates, guest details, and any required payment arrangements have been agreed in writing.
            </p>

            <h2>2. How to Cancel</h2>
            <p>
              Cancellation requests should be sent as soon as possible by email to
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
              The date and time the cancellation request is received will be used when applying this policy.
            </p>

            <h2>3. Standard Direct Booking Cancellation Terms</h2>
            <ul>
              <li>More than 14 days before arrival: amounts paid are generally refundable in full unless a confirmed booking states otherwise.</li>
              <li>7 to 14 days before arrival: up to 50% of amounts paid may be retained.</li>
              <li>Less than 7 days before arrival: amounts paid are generally non-refundable.</li>
              <li>No-shows and same-day cancellations are generally non-refundable.</li>
            </ul>

            <h2>4. Changes to Dates</h2>
            <p>
              Requests to move a stay to new dates are subject to availability and current pricing. A date change is
              not guaranteed until confirmed in writing.
            </p>

            <h2>5. Third-Party Bookings</h2>
            <p>
              If a stay is booked through a third-party platform such as Airbnb or another booking partner, the
              cancellation terms of that platform will apply instead of this policy.
            </p>

            <h2>6. Exceptional Circumstances</h2>
            <p>
              In limited cases involving serious emergencies or events outside a guest&apos;s reasonable control,
              Agatha Living may review a cancellation request at its discretion. Supporting information may be requested.
            </p>

            <h2>7. Contact</h2>
            <p>
              For cancellation questions, please contact
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/refund-policy" className="btn-outline-dark">Refund Policy</Link>
            <Link href="/contact-details" className="btn-gold">Contact Details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
