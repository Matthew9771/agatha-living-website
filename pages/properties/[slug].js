import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import GuestyBookingWidget from '../../components/GuestyBookingWidget';
import { PROPERTIES, getPropertyBySlug } from '../../lib/properties';
import styles from '../../styles/Properties.module.css';

export default function PropertyProfile({ property }) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const galleryImages = Array.isArray(property.images) && property.images.length ? property.images : [property.image];
  const hasMultipleImages = galleryImages.length > 1;
  const showPreviousImage = () => setActiveGalleryIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);
  const showNextImage = () => setActiveGalleryIndex(i => (i + 1) % galleryImages.length);

  return (
    <>
      <Head>
        <title>{`${property.name} | Agatha Living`}</title>
        <meta
          name="description"
          content={`Discover ${property.name} in Forest Hill. View the property profile, amenity details, and check availability for direct booking.`}
        />
      </Head>

      <div className={styles.propertyHero}>
        <div className={styles.propertyHeroOverlay} />
        <div className={styles.propertyHeroContent}>
          <Link href="/properties" className={styles.propertyBackLink}>← Back to listings</Link>
          <span className="section-tag">Property profile</span>
          <h1 className={styles.propertyTitle}>{property.name}</h1>
          <p className={styles.propertySubtitle}>{property.address}</p>
          <div className={styles.propertyMeta}>
            <span>{property.type}</span>
            <span>{property.area}</span>
            <span>{property.zone}</span>
          </div>
        </div>
      </div>

      <section className={`${styles.section} ${styles.propertyDetailSection}`}>
        <div className={styles.propertyGallery}>
          <p className="section-tag">Photo tour</p>
          <h2 className="section-title">See the property in detail</h2>
          <div className={styles.gallerySingle}>
            <div className={styles.galleryItemSingle}>
              <button
                type="button"
                className={styles.galleryImageButton}
                onClick={hasMultipleImages ? showNextImage : undefined}
                aria-label={hasMultipleImages ? 'Next photo' : 'Property photo'}
              >
                <img
                  src={galleryImages[activeGalleryIndex]}
                  alt={`${property.name} image ${activeGalleryIndex + 1}`}
                  className={styles.galleryImage}
                />
              </button>

              {hasMultipleImages ? (
                <div className={styles.cardGalleryNav}>
                  <button type="button" className={styles.cardGalleryButton} onClick={showPreviousImage} aria-label="Previous photo">‹</button>
                  <button type="button" className={styles.cardGalleryButton} onClick={showNextImage} aria-label="Next photo">›</button>
                </div>
              ) : null}
            </div>

            {hasMultipleImages ? (
              <div className={styles.galleryPager}>
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.galleryPagerDot} ${index === activeGalleryIndex ? styles.galleryPagerDotActive : ''}`}
                    onClick={() => setActiveGalleryIndex(index)}
                    aria-label={`View photo ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.propertySplit}>
          <div className={styles.propertyDetails}>
            <div className={styles.detailSection}>
              <h2>About this stay</h2>
              <p className={styles.propertyDescription}>{property.description}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Highlights</h3>
              <div className={styles.detailFeatureList}>
                {property.highlights.map(item => (
                  <div key={item} className={styles.detailFeature}>{item}</div>
                ))}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>What’s included</h3>
              <ul className={styles.detailList}>
                {property.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className={styles.detailSection}>
              <h3>Property details</h3>
              <div className={styles.detailInfoGrid}>
                {property.details.map(detail => (
                  <div key={detail.title} className={styles.detailInfoItem}>
                    <strong>{detail.title}</strong>
                    <p>{detail.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <section id="availability" className={styles.directBookingSection} aria-labelledby="book-direct-heading">
              <div className={styles.directBookingIntro}>
                <p className="section-tag">Direct booking</p>
                <h2 id="book-direct-heading" className={styles.directBookingTitle}>Book Direct with Agatha Living</h2>
                <p className={styles.directBookingText}>
                  Check live availability and book securely online through our Guesty direct booking portal. Your reservation goes straight to Agatha Living, with card payments handled securely by Stripe.
                </p>
              </div>

              <div className={styles.directBookingCard}>
                <div className={styles.directBookingCardHeader}>
                  <span>Secure online booking</span>
                  <strong>Choose your dates, guests, and complete your booking below.</strong>
                </div>
                <div className={styles.directBookingWidget}>
                  <GuestyBookingWidget />
                </div>
              </div>
            </section>
          </div>
        </div>

      </section>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: PROPERTIES.map((property) => ({ params: { slug: property.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const property = getPropertyBySlug(params.slug);
  if (!property) {
    return { notFound: true };
  }
  return { props: { property } };
}
