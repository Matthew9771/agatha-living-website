import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const fadeRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 120);
      }), { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

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
            Premium serviced accommodation and expert real estate services — whether you're looking for a short stay or your next investment property.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/properties" className="btn-gold">View Properties</Link>
            <Link href="/contact" className="btn-outline-white">Get in Touch</Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <div className={styles.scrollLine} />
          <span>Scroll</span>
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
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">A complete<br />living <em>solution</em></h2>
          </div>
          <p ref={addRef} className={`section-sub fade-up`}>From short-term stays to long-term investment, Agatha Living handles every detail.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { num: '01', title: 'Short-Term Stays', desc: 'Fully furnished, hotel-quality apartments on Airbnb and direct booking. Perfect for business travellers, relocations, and leisure stays.', link: '/services' },
            { num: '02', title: 'Property Management', desc: 'We handle everything — guest communications, cleaning, maintenance, and pricing optimisation — so you earn more with zero hassle.', link: '/services' },
            { num: '03', title: 'Real Estate', desc: 'Expert guidance for buyers, sellers, and investors. We source high-yield properties and support you end-to-end.', link: '/services' },
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
            <span className="section-tag">Our Property</span>
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
              <Link href="/contact" className="btn-gold">Book / Enquire</Link>
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
            <Link href="/about" className="btn-outline-dark">Learn About Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
