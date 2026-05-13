import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Refund Policy | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Policy</span>
          <h1>Refund <em>Policy</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 13 May 2026</p>

          <div className={styles.content}>
            <p>
              This Refund Policy explains how refunds are handled for direct bookings made with Agatha Living.
            </p>

            <h2>1. Enquiries vs Confirmed Bookings</h2>
            <p>
              A booking enquiry does not create a payment obligation by itself. Refunds only become relevant once a
              stay has been confirmed and payment has been made.
            </p>

            <h2>2. When Refunds May Be Available</h2>
            <ul>
              <li>Where a confirmed cancellation qualifies under the Cancellation Policy.</li>
              <li>Where Agatha Living cannot honour a confirmed stay and no suitable alternative is agreed.</li>
              <li>Where a refund is required by law.</li>
            </ul>

            <h2>3. Non-Refundable Situations</h2>
            <ul>
              <li>Late cancellations outside the refundable window.</li>
              <li>No-shows.</li>
              <li>Early departures after check-in, unless required by law or otherwise agreed in writing.</li>
              <li>Issues caused by guest actions, breaches of house rules, or incomplete guest information.</li>
            </ul>

            <h2>4. Processing Times</h2>
            <p>
              Where a refund is approved, it will normally be processed back to the original payment method within
              5 to 10 working days. Timing may vary depending on the payment provider or bank.
            </p>

            <h2>5. Partial Refunds</h2>
            <p>
              If only part of a stay, service, or charge is refundable, the amount returned will be confirmed in
              writing before processing.
            </p>

            <h2>6. Third-Party Platforms</h2>
            <p>
              If a stay was booked through a third-party platform, refunds must be handled through that platform and
              are subject to its rules and processes.
            </p>

            <h2>7. Contact</h2>
            <p>
              For refund enquiries, please contact
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/cancellation-policy" className="btn-outline-dark">Cancellation Policy</Link>
            <Link href="/contact-details" className="btn-gold">Contact Details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
