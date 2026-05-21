import Head from 'next/head';
import Link from 'next/link';
import { useFadeUp } from '../hooks/useFadeUp';
import styles from '../styles/Home.module.css';

export default function Home() {
  const addRef = useFadeUp();

  return (
    <>
      <Head><title>Agatha Living | Serviced Accommodation & Real Estate London</title></Head>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Serviced Accommodation &amp; Real Estate</p>
          <h1 className={styles.heroTitle}>
            Spaces designed<br />for <em>modern living</em>
          </h1>
          <p className={styles.heroSub}>
            Premium serviced accommodation in London for short stays, longer visits, and calm, flexible city living.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/properties" className="btn-gold">View Properties</Link>
            <Link href="/contact" className="btn-outline-white">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {['Serviced Accommodation','Forest Hill London','5-Star Rated','Real Estate Services','Fully Managed','Direct Bookings',
            'Serviced Accommodation','Forest Hill London','5-Star Rated','Real Estate Services','Fully Managed','Direct Bookings'].map((t, i) => (
            <span key={i} className={i % 2 === 1 ? styles.dot : ''}>{i % 2 === 1 ? '◆' : t}</span>
          ))}
        </div>
      </div>

      {/* SERVICES PREVIEW */}
      <section className={styles.services}>
        <div className={styles.servicesIntro}>
          <div ref={addRef} className="fade-up">
            <span className="section-tag">Explore Stays & Services</span>
            <h2 className="section-title">A complete<br />living <em>solution</em></h2>
          </div>
          <p ref={addRef} className={`section-sub fade-up`}>Explore short stays, hosting support, and property guidance designed around comfort, clarity, and convenience.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { num: '01', title: 'Short-Term Stays', desc: 'Fully furnished, hotel-quality apartments available for business travel, relocations, and easy leisure stays.', link: '/services' },
            { num: '02', title: 'Property Management', desc: 'A hands-off hosting service for owners who want guest messaging, cleaning, maintenance, and pricing handled smoothly.', link: '/services' },
            { num: '03', title: 'Real Estate', desc: 'Thoughtful property guidance for buyers, sellers, and investors looking for well-presented opportunities across London.', link: '/services' },
          ].map(s => (
            <div key={s.num} ref={addRef} className={`${styles.serviceCard} fade-up`}>
              <span className={styles.serviceNum}>{s.num}</span>
              <h3 className={styles.serviceName}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
              <Link href={s.link} className={styles.serviceLink}>Learn More →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTY PREVIEW */}
      <section className={styles.propertySection}>
        <div className={styles.propHeader} ref={addRef}>
          <div className="fade-up">
            <span className="section-tag">Featured Stay</span>
            <h2 className="section-title" style={{color:'#fff'}}>Currently <em style={{color:'var(--gold)'}}>available</em></h2>
          </div>
          <Link href="/properties" className="btn-outline-white">View All</Link>
        </div>
        <div ref={addRef} className="fade-up">
          <div className={styles.propCard}>
            <div className={styles.propImg}>
              <span className={styles.propTag}>Short Stay — Available Now</span>
            </div>
            <div className={styles.propInfo}>
              <h3>Greystead Road</h3>
              <p className={styles.propAddress}>62 Greystead Road, Forest Hill, London SE23 3SD</p>
              <div className={styles.propFeatures}>
                <div className={styles.propFeature}><span>🏡</span> Fully Serviced Accommodation</div>
                <div className={styles.propFeature}><span>📍</span> Forest Hill, SE23 — Zone 3</div>
                <div className={styles.propFeature}><span>✨</span> Professionally Cleaned &amp; Managed</div>
                <div className={styles.propFeature}><span>📅</span> Flexible Short-Term Bookings</div>
              </div>
              <hr className={styles.propDivider} />
            <Link href="/contact" className="btn-gold">Check availability</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className={styles.testimonial}>
        <div ref={addRef} className="fade-up">
          <div className={styles.stars}>★★★★★</div>
          <p className={styles.quote}>"An exceptional stay from start to finish. The property was immaculate, beautifully presented, and the team were incredibly attentive."</p>
          <p className={styles.author}>Verified Airbnb Guest</p>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.ctaBanner}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Ready to get started?</span>
          <h2 className="section-title">Let's find your<br /><em>perfect space</em></h2>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn-gold">Enquire Now</Link>
            <Link href="/about" className="btn-outline-dark">Explore Agatha Living</Link>
          </div>
        </div>
      </section>
    </>
  );
}
