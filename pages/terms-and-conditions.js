import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Legal</span>
          <h1>Terms &amp; <em>Conditions</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 13 May 2026</p>

          <div className={styles.content}>
            <p>
              These Terms &amp; Conditions govern your use of the Agatha Living website and any enquiries or services
              requested through it. By using this website, you agree to these terms.
            </p>

            <h2>1. About This Website</h2>
            <p>
              This website is provided by Agatha Living LTD, company number 16282753, trading as Agatha Living,
              for general information about our serviced accommodation, property management, and real estate-related services.
            </p>

            <h2>2. Website Use</h2>
            <p>You agree not to misuse the website, including by:</p>
            <ul>
              <li>Using the site for unlawful, fraudulent, or harmful purposes.</li>
              <li>Attempting to interfere with the security or operation of the website.</li>
              <li>Submitting false, misleading, or abusive enquiries.</li>
            </ul>

            <h2>3. Enquiries and Availability</h2>
            <p>
              Any enquiry submitted through this website does not create a booking, contract, or formal client relationship
              until confirmed separately by Agatha Living in writing.
            </p>

            <h2>4. Property and Service Information</h2>
            <p>
              We aim to ensure all information on the website is accurate and up to date. However, property availability,
              pricing, features, service scope, and other details may change at any time without notice.
            </p>

            <h2>5. No Guarantee of Results</h2>
            <p>
              Information relating to property, management, bookings, or investment is provided for general guidance only
              and should not be treated as legal, financial, or professional advice.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All website content, including branding, text, layout, graphics, and original materials, belongs to
              Agatha Living unless otherwise stated. You may not copy, reproduce, or republish website content without permission.
            </p>

            <h2>7. Third-Party Services and Links</h2>
            <p>
              This website may include links to third-party platforms or services. We are not responsible for the content,
              availability, or practices of external websites.
            </p>

            <h2>8. Liability</h2>
            <p>
              To the fullest extent permitted by law, Agatha Living is not liable for any indirect, incidental, or consequential
              loss arising from use of this website or reliance on its content.
            </p>

            <h2>9. Privacy</h2>
            <p>
              Your use of this website is also governed by our Privacy Policy, which explains how personal information is collected and used.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. Any updated version will be posted on this page.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms shall be governed by and interpreted in accordance with the laws of England and Wales,
              unless otherwise required by applicable law.
            </p>

            <h2>12. Contact</h2>
            <p>
              For questions about these Terms &amp; Conditions, please contact
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/privacy-policy" className="btn-outline-dark">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </>
  );
}
