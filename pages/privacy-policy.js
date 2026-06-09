import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Agatha Living</title>
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Legal</span>
          <h1>Privacy <em>Policy</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.card}>
          <p className={styles.updated}>Last updated: 9 June 2026</p>

          <div className={styles.content}>
            <p>
              Agatha Living is committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our website or contact us about our services.
            </p>

            <h2>1. Who We Are</h2>
            <p>
              Agatha Living LTD, company number 16282753, trading as Agatha Living, provides serviced accommodation,
              property management, and real estate-related services. Our trading address is 128 City Road, London,
              EC1V 2NX. If you have any questions about this policy, you can contact us at
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect the following information:</p>
            <ul>
              <li>Your name, email address, phone number, and enquiry details when you complete a contact form.</li>
              <li>Lead and enquiry information submitted through the website, including enquiry type, source page, message, marketing consent preference, and booking enquiry details such as property, dates, guest numbers, nights, and estimated totals where you provide or select them.</li>
              <li>Information you provide when you contact us directly by email or phone.</li>
              <li>Basic technical information such as browser type, device type, and general usage information collected by hosting or analytics tools.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Respond to enquiries and provide requested information.</li>
              <li>Arrange bookings, consultations, or follow-up discussions.</li>
              <li>Improve our website, services, and customer experience.</li>
              <li>Maintain records of communications and legitimate business enquiries.</li>
            </ul>

            <h2>4. Form Submissions</h2>
            <p>
              Website forms submit enquiry information to our secure lead management database hosted by Supabase.
              This helps us receive, store, and manage enquiries from contact forms, booking enquiry forms, and mailing
              list or priority guest list forms. Information submitted through these forms is used for business
              communication, enquiry management, booking follow-up, and marketing communication only where you have
              provided the relevant consent.
            </p>

            <h2>5. Legal Basis for Processing</h2>
            <p>Where applicable, we process personal data on the following bases:</p>
            <ul>
              <li>Your consent when you choose to submit a form or contact us.</li>
              <li>Our legitimate interests in responding to enquiries and operating our business.</li>
              <li>Compliance with legal or regulatory obligations where required.</li>
            </ul>

            <h2>6. Sharing Your Information</h2>
            <p>
              We do not sell your personal information. We may share limited information with trusted service providers
              who help us operate the website, manage enquiries, or deliver our services, but only where reasonably necessary.
              This includes Supabase, which provides database hosting for website enquiries, and may include payment,
              booking, email, hosting, analytics, or professional service providers where needed to respond to your enquiry
              or deliver a requested service.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We keep personal information only for as long as reasonably necessary for enquiry handling, customer
              communication, record keeping, service delivery, marketing preferences, or legal compliance. If you ask us
              to delete or update your information, we will consider and respond to that request in line with applicable
              data protection law and any legitimate record-keeping obligations.
            </p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul>
              <li>Request access to the personal information we hold about you.</li>
              <li>Ask us to correct inaccurate information.</li>
              <li>Request deletion of your information where appropriate.</li>
              <li>Object to or restrict certain types of processing.</li>
            </ul>

            <h2>9. Security</h2>
            <p>
              We take reasonable steps to protect personal information, but no internet transmission or storage method
              can be guaranteed to be completely secure. Access to stored enquiry data is restricted to people and service
              providers who need it for legitimate business purposes.
            </p>

            <h2>10. External Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices
              or content of those sites.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised
              effective date.
            </p>

            <h2>12. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or how your information is handled, please contact
              {' '}<a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a>.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/contact" className="btn-gold">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
