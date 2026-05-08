import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from '../../styles/Blog.module.css';

// To add a new blog post, just add an object to this array
// and create a matching file in pages/blog/[your-slug].js
export const posts = [
  {
    slug: 'why-serviced-accommodation',
    title: 'Why Serviced Accommodation is the Smart Choice for London Visitors',
    excerpt: 'Hotels are expensive and inflexible. Serviced apartments offer more space, more comfort, and better value — here is why travellers are making the switch.',
    date: 'March 2026',
    category: 'Accommodation',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80',
  },
  {
    slug: 'investing-in-se23',
    title: 'Why Forest Hill SE23 is One of London\'s Best Investment Postcodes',
    excerpt: 'Good transport links, a strong community, and rising property values make Forest Hill an area savvy investors are watching closely.',
    date: 'February 2026',
    category: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
  },
  {
    slug: 'property-management-tips',
    title: '5 Things Every Airbnb Host Should Do to Maximise Their Rating',
    excerpt: 'Small details make a huge difference to guest satisfaction. Here are the five things we do at every Agatha Living property to consistently earn five stars.',
    date: 'January 2026',
    category: 'Property Tips',
    image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=700&q=80',
  },
];

export default function Blog() {
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
      <Head><title>Blog | Agatha Living</title></Head>

      <div className="page-hero page-hero-blog">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Insights & News</span>
          <h1>The Agatha<br /><em>Living Journal</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Latest Articles</span>
          <h2 className="section-title">Property insights,<br /><em>tips & news</em></h2>
          <p className="section-sub" style={{marginBottom:'64px'}}>
            Advice on serviced accommodation, real estate investment, and property management from the Agatha Living team.
          </p>
        </div>

        <div className={styles.grid}>
          {posts.map((post, i) => (
            <article key={post.slug} ref={addRef} className={`${styles.card} ${i === 0 ? styles.featured : ''} fade-up`}>
              <Link href={`/blog/${post.slug}`} className={styles.cardImgLink}>
                <div className={styles.cardImg} style={{backgroundImage:`url('${post.image}')`}}>
                  <span className={styles.cardCategory}>{post.category}</span>
                </div>
              </Link>
              <div className={styles.cardBody}>
                <p className={styles.cardDate}>{post.date}</p>
                <h2 className={styles.cardTitle}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>Read Article →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
