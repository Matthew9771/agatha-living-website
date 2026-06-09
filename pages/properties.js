import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useFadeUp } from '../hooks/useFadeUp';
import { PROPERTIES } from '../lib/properties';
import styles from '../styles/Properties.module.css';

function PropertyCardGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = images.length;

  const showPrevious = () => {
    setActiveIndex(current => (current - 1 + imageCount) % imageCount);
  };

  const showNext = () => {
    setActiveIndex(current => (current + 1) % imageCount);
  };

  return (
    <div className={styles.cardImg}>
      <div className={styles.cardGalleryNav}>
        <button type="button" className={styles.cardGalleryButton} onClick={showPrevious} aria-label="Previous image">‹</button>
        <button type="button" className={styles.cardGalleryButton} onClick={showNext} aria-label="Next image">›</button>
      </div>
      <div className={styles.cardGallery} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={`${name}-${index}`} className={styles.cardGalleryItem}>
            <img src={image} alt={`${name} photo ${index + 1}`} className={styles.cardGalleryImage} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Properties() {
  const addRef = useFadeUp();

  return (
    <>
      <Head>
        <title>Properties | Agatha Living</title>
        <meta
          name="description"
          content="Browse serviced accommodation in Forest Hill, London. View property profiles, amenities, and book direct with Agatha Living."
        />
      </Head>

      <div className="page-hero page-hero-properties">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Listings</span>
          <h1>Our <em>properties</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Available stays</span>
          <h2 className="section-title">Browse available properties<br /><em>and choose your perfect stay</em></h2>
          <p className="section-sub">Select a property to view the full profile, read the details, and check dates for available stays.</p>
        </div>

        <div className={styles.grid}>
          {PROPERTIES.map(property => (
            <article key={property.slug} ref={addRef} className={`${styles.card} fade-up`}>
              <PropertyCardGallery images={property.images ?? [property.image]} name={property.name} />
              <span className={`${styles.cardTag} ${property.available ? styles.available : styles.unavailable}`}>
                {property.available ? 'Available now' : 'Currently unavailable'}
              </span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{property.name}</h3>
                <p className={styles.cardAddress}>📍 {property.address}</p>
                <div className={styles.cardFeatures}>
                  {property.features.map(feature => (
                    <span key={feature} className={styles.cardFeature}>{feature}</span>
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>{property.price}</span>
                  <div className={styles.cardActions}>
                    <Link href={`/properties/${property.slug}`} className="btn-gold">View profile</Link>
                    <Link href={`/properties/${property.slug}#availability`} className="btn-outline-dark">Check dates</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={addRef} className={`${styles.comingSoon} fade-up`}>
          <span className="section-tag">More stays</span>
          <h3 className={styles.comingSoonTitle}>More London stays coming soon</h3>
          <p className={styles.comingSoonSub}>New stays will appear here as soon as dates open up. Get in touch to receive availability updates.</p>
          <Link href="/contact" className="btn-outline-dark" style={{ marginTop: '28px' }}>Get availability updates</Link>
        </div>
      </section>
    </>
  );
}
