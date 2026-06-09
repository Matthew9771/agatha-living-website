import Head from 'next/head';
import Link from 'next/link';
import { AIRBNB_FOREST_HILL_URL, BOOKING_FOREST_HILL_URL, SITE_URL } from '../lib/config';
import styles from '../styles/Links.module.css';

const primaryLinks = [
  {
    label: 'Book the Forest Hill stay',
    text: 'View availability and direct enquiry options',
    href: '/properties',
    type: 'internal',
  },
  {
    label: 'Send an enquiry',
    text: 'Short stays, property management, or real estate guidance',
    href: '/contact',
    type: 'internal',
  },
  {
    label: 'Explore our services',
    text: 'Accommodation, hosting support, and real estate',
    href: '/services',
    type: 'internal',
  },
];

const bookingLinks = [
  {
    label: 'View on Airbnb',
    href: AIRBNB_FOREST_HILL_URL,
  },
  {
    label: 'View on Booking.com',
    href: BOOKING_FOREST_HILL_URL,
  },
];

const contactLinks = [
  {
    label: 'Call 07405 803 252',
    href: 'tel:+447405803252',
  },
  {
    label: 'Email support@agathaliving.co.uk',
    href: 'mailto:support@agathaliving.co.uk',
  },
];

export default function Links() {
  return (
    <>
      <Head>
        <title>Links | Agatha Living</title>
        <meta
          name="description"
          content="Quick links for Agatha Living serviced accommodation, property management, bookings, and enquiries."
        />
        <link rel="canonical" href={`${SITE_URL}/links`} />
      </Head>

      <section className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.intro}>
            <Link href="/" className={styles.logo} aria-label="Agatha Living homepage">
              Agatha <span>Living</span>
            </Link>
            <p className="section-tag">Quick Links</p>
            <h1>Serviced accommodation and property support in London.</h1>
            <p className={styles.sub}>
              Book a stay, ask about availability, or speak to the team about property management and real estate services.
            </p>
          </div>

          <div className={styles.links} aria-label="Main links">
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.linkCard}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.text}</small>
                </span>
                <span className={styles.arrow}>-&gt;</span>
              </Link>
            ))}
          </div>

          <div className={styles.group}>
            <h2>Booking platforms</h2>
            <div className={styles.compactLinks}>
              {bookingLinks.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <h2>Contact directly</h2>
            <div className={styles.compactLinks}>
              {contactLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <p className={styles.footerNote}>Forest Hill, London SE23</p>
        </div>
      </section>
    </>
  );
}
