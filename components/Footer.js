import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>Agatha <span>Living</span></Link>
          <p>Premium serviced accommodation and real estate services — built on quality, driven by care.</p>
        </div>
        <div className={styles.col}>
          <h5>Services</h5>
          <ul>
            <li><Link href="/services">Short-Term Stays</Link></li>
            <li><Link href="/services">Property Management</Link></li>
            <li><Link href="/services">Real Estate</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h5>Company</h5>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/properties">Properties</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h5>Contact</h5>
          <ul>
            <li><a href="mailto:support@agathaliving.co.uk">support@agathaliving.co.uk</a></li>
            <li><a href="tel:+447405803252">07405 803 252</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Agatha Living. All rights reserved.</p>
        <p className={styles.legalLinks}>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        </p>
      </div>
    </footer>
  );
}
