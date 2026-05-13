import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function DamagePolicy() {
  return (
    <>
      <Head>
        <title>Damage Policy | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Policy</span>
          <h1>Damage <em>Policy</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 13 May 2026</p>

          <div className={styles.content}>
            <p>
              This Damage Policy explains guest responsibility for damage, loss, additional cleaning, and misuse of a property during a stay.
            </p>

            <h2>1. Guest Responsibility</h2>
            <p>
              Guests are expected to leave the property in a clean, secure, and reasonable condition and are responsible
              for any damage caused by themselves or members of their party.
            </p>

            <h2>2. What May Be Charged</h2>
            <ul>
              <li>Damage to furniture, fixtures, linen, keys, locks, appliances, or décor.</li>
              <li>Missing items from the property.</li>
              <li>Excessive cleaning required beyond normal turnover standards.</li>
              <li>Odour removal, smoking-related cleaning, or stain treatment.</li>
              <li>Call-out costs caused by guest misuse, lockouts, or avoidable maintenance issues.</li>
            </ul>

            <h2>3. Reporting Damage</h2>
            <p>
              Guests should report accidental damage as soon as possible so that the issue can be resolved quickly and
              fairly. Prompt reporting is always preferred to unreported damage discovered after check-out.
            </p>

            <h2>4. Assessment and Charges</h2>
            <p>
              Where damage or loss is identified, Agatha Living may seek reimbursement for reasonable repair,
              replacement, cleaning, administration, or contractor costs.
            </p>

            <h2>5. Unauthorised Events and Misuse</h2>
            <p>
              Unauthorised parties, smoking where prohibited, illegal activity, or misuse of the property may lead to
              immediate termination of the stay and additional charges where permitted by law.
            </p>

            <h2>6. Third-Party Bookings</h2>
            <p>
              If a stay was booked through a third-party platform, damage claims may also be handled through that
              platform&apos;s resolution process where applicable.
            </p>

            <h2>7. Contact</h2>
            <p>
              For damage-related questions, please contact
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/terms-and-conditions" className="btn-outline-dark">Terms &amp; Conditions</Link>
            <Link href="/contact-details" className="btn-gold">Contact Details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
