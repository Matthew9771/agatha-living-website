import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
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
            { num: '01', title: 'Short-Term Stays', desc: 'Fully furnished, hotel-quality apartments available for business travel, relocations, and easy leisure stays.', link: '/services/short-term-stays' },
            { num: '02', title: 'Property Management', desc: 'A hands-off hosting service for owners who want guest messaging, cleaning, maintenance, and pricing handled smoothly.', link: '/services/property-management' },
            { num: '03', title: 'Investor Support', desc: 'Practical support for landlords and investors exploring serviced accommodation, rent-to-rent, and short-term rental opportunities across London.', link: '/services/investor-support' },
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
        <div className={`${styles.propHeader} fade-up`} ref={addRef}>
          <div>
            <span className="section-tag">Featured Stay</span>
            <h2 className="section-title" style={{color:'#fff'}}>Curated <em style={{color:'var(--gold)'}}>Stays</em></h2>
          </div>
          <Link href="/properties" className="btn-outline-white">View All</Link>
        </div>
        <div ref={addRef} className="fade-up">
          <div className={styles.propCard}>
            <div className={styles.propImg}>
              <span className={styles.propTag}>Curated stay</span>
            </div>
            <div className={styles.propInfo}>
              <h3>Greystead Road</h3>
              <p className={styles.propAddress}>Greystead Road, Forest Hill, London SE23</p>
              <div className={styles.propFeatures}>
                <div className={styles.propFeature}><span>🏡</span> Fully Serviced Accommodation</div>
                <div className={styles.propFeature}><span>📍</span> Forest Hill, SE23 — Zone 3</div>
                <div className={styles.propFeature}><span>✨</span> Professionally Cleaned &amp; Managed</div>
                <div className={styles.propFeature}><span>📅</span> Flexible Short-Term Bookings</div>
              </div>
              <hr className={styles.propDivider} />
            </div>
          </div>
          <div className={styles.propNoteBlock}>
            <h3 className={styles.propNoteTitle}>Two more curated units are joining our <span>London stay collection</span> soon.</h3>
            <Link href="/properties" className="btn-gold">View properties</Link>
          </div>
        </div>
      </section>

      <section className={styles.priorityListSection}>
        <div className={styles.priorityListCard}>
          <div className={styles.priorityIntro}>
            <span className="section-tag">Priority access</span>
            <h2 className="section-title">Join the Priority Guest List</h2>
            <p className="section-sub">Be the first to hear about new Agatha Living properties, exclusive launch offers, direct booking discounts, and availability updates before they are publicly promoted.</p>
            <ul className={styles.priorityBenefits}>
              {[
                'Early access to new properties',
                'Exclusive launch offers',
                'Direct booking discounts',
                'Last-minute availability alerts',
                'Agatha Living updates',
              ].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <PriorityGuestForm />
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

function PriorityGuestForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    const formData = new FormData(event.target);
    const payload = {
      first_name: formData.get('first_name'),
      email: formData.get('email'),
      marketing_consent: formData.get('marketing_consent') === 'on',
      enquiry_type: 'Priority Guest List',
      source_page: 'Homepage',
      message: 'Priority Guest List signup',
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus('success');
      event.target.reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <div className={styles.priorityFormWrap}>
      {status === 'success' ? (
        <div className={styles.prioritySuccess}>
          <span className={styles.successIcon}>✓</span>
          <h3>Thank you for joining the Agatha Living Priority Guest List.</h3>
          <p>You’ll be the first to hear about new properties, offers, and availability updates.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.priorityForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="priority-first-name">First Name</label>
              <input id="priority-first-name" name="first_name" type="text" placeholder="Jane" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="priority-email">Email Address</label>
              <input id="priority-email" name="email" type="email" placeholder="jane@example.com" required />
            </div>
          </div>

          <div className={styles.formGroupCheckbox}>
            <input id="priority-consent" name="marketing_consent" type="checkbox" required />
            <label htmlFor="priority-consent">I agree to receive occasional emails from Agatha Living. I can unsubscribe at any time.</label>
          </div>

          {status === 'error' && <p className={styles.formError}>Something went wrong. Please try again or email us directly.</p>}

          <button type="submit" className="btn-gold" disabled={status === 'sending'}>
            {status === 'sending' ? 'Joining…' : 'Join the Priority List'}
          </button>
        </form>
      )}
    </div>
  );
}
