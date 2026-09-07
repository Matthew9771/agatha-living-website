import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { PROPERTIES, getPropertyBySlug } from '../../../lib/properties';
import styles from '../../../styles/Availability.module.css';

function PropertyGallery({ property }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = property.images?.length ? property.images : [property.image];

  return (
    <div className={styles.gallery} aria-label={`${property.name} photos`}>
      <div className={styles.mainPhoto}>
        <img src={images[activeIndex]} alt={`${property.name} — property photo ${activeIndex + 1}`} />
        <span className={styles.photoCount}>{activeIndex + 1} / {images.length}</span>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className={`${styles.thumbnail} ${index === activeIndex ? styles.selected : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${property.name} photo ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SmoobuBooking({ property }) {
  const embedRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!scriptReady || !embedRef.current) return;

    const container = embedRef.current;
    let bookingFrame;
    const markLoaded = () => setStatus('ready');
    const observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (!iframe || iframe === bookingFrame) return;
      bookingFrame = iframe;
      iframe.title = `Check availability and book ${property.name}`;
      iframe.addEventListener('load', markLoaded, { once: true });
    });
    observer.observe(container, { childList: true, subtree: true });

    try {
      window.BookingToolIframe.initialize({
        url: property.bookingIframe,
        baseUrl: 'https://login.smoobu.com',
        target: `#${property.bookingTarget}`,
      });
    } catch {
      setStatus('error');
    }

    return () => {
      observer.disconnect();
      bookingFrame?.removeEventListener('load', markLoaded);
      bookingFrame?.iFrameResizer?.close();
      container.replaceChildren();
    };
  }, [scriptReady, property.bookingIframe, property.bookingTarget, property.name]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus(current => current === 'loading' ? 'slow' : current);
    }, 20000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        src="https://login.smoobu.com/js/Settings/BookingToolIframe.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setStatus('error')}
      />
      {status !== 'ready' && (
        <p role="status" style={{ marginBottom: '20px' }}>
          {status === 'loading'
            ? 'Loading Smoobu availability…'
            : <>The booking tool is taking longer to load. Please refresh the page or <Link href="/contact">contact us for help</Link>.</>}
        </p>
      )}
      <div id={property.bookingTarget} ref={embedRef} style={{ width: '100%', minHeight: '800px' }} />
    </>
  );
}

export default function Availability({ property }) {
  return (
    <>
      <Head>
        <title>{`Availability | ${property.name} | Agatha Living`}</title>
        <meta name="description" content={`Check available dates and book ${property.name} directly with Agatha Living through Smoobu.`} />
      </Head>
      <main className={styles.page}>
        <Link href={`/properties/${property.slug}`} className={styles.backLink}>
          ← Back to {property.name}
        </Link>
        <section className={styles.propertyIntro} aria-labelledby="stay-heading">
          <PropertyGallery key={property.slug} property={property} />
          <div className={styles.summary}>
            <span className="section-tag">Your Agatha Living stay</span>
            <h1 id="stay-heading">{property.name}</h1>
            <p className={styles.address}>{property.address}</p>
            <div className={styles.facts}>
              <span>{property.type}</span>
              <span>Up to {property.maxGuests} guests</span>
              <span>Check-in from {property.checkInFrom}</span>
            </div>
            <p className={styles.description}>{property.summary}</p>
            <a href="#choose-dates" className="btn-gold">Choose your dates ↓</a>
          </div>
        </section>
        <section id="choose-dates" className={styles.booking} aria-labelledby="dates-heading">
          <div className={styles.bookingHeader}>
            <div>
              <span className="section-tag">Book direct</span>
              <h2 id="dates-heading">Make yourself at home</h2>
              <p>Choose your dates below. Live prices and availability are provided by Smoobu.</p>
            </div>
          </div>
          <SmoobuBooking key={property.bookingTarget} property={property} />
        </section>
      </main>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: PROPERTIES.filter(property => property.bookingIframe).map(property => ({ params: { slug: property.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const property = getPropertyBySlug(params.slug);
  if (!property?.bookingIframe || !property.bookingTarget) {
    return { notFound: true };
  }
  return { props: { property } };
}
