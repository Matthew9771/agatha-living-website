import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/BlogPost.module.css';
import { posts } from './index';

// The content for each post — add your full article text here
const postContent = {
  'why-serviced-accommodation': {
    body: `
      <p>When visiting London for business or leisure, most people default to booking a hotel. It feels safe and familiar. But for stays of more than a couple of nights, serviced accommodation is almost always the better option, and more visitors are beginning to see why.</p>
      <h3>More space, less cost</h3>
      <p>A serviced apartment gives you a full kitchen, a living room, and often a separate bedroom — all for a comparable price to a cramped hotel room. For families or groups, the saving is even more significant.</p>
      <h3>The freedom to live like a local</h3>
      <p>Being able to cook your own meals, do laundry, and come and go as you please makes a genuine difference to how relaxed you feel during a trip. It is the difference between being a tourist and feeling at home.</p>
      <h3>What to look for</h3>
      <p>Look for properties that are professionally managed, have recent five-star reviews, and include all bills in the price. Those basics often make the difference between a functional stay and a genuinely relaxing one.</p>
    `,
  },
  'investing-in-se23': {
    body: `
      <p>Forest Hill in SE23 has quietly become one of South East London's most appealing postcodes for property investors. Here is why the area stands out and why more buyers have started paying closer attention.</p>
      <h3>Transport links</h3>
      <p>Forest Hill station sits on the London Overground, giving direct connections to Shoreditch, Dalston, and Canary Wharf without changing. Journey times to central London are competitive with many Zone 2 locations.</p>
      <h3>A strong community</h3>
      <p>The area has a well-established mix of independent shops, cafes, and restaurants around the Devonshire Road strip. This makes it genuinely attractive to guests and long-term tenants alike.</p>
      <h3>Value relative to neighbours</h3>
      <p>Compared to Dulwich, Herne Hill, and Peckham, SE23 still offers relative value — but the gap has been closing. Investors who moved early have seen strong capital growth alongside solid rental yields.</p>
    `,
  },
  'property-management-tips': {
    body: `
      <p>After many five-star stays, certain details stand out again and again in guest feedback. These are the touches that people actually notice, remember, and mention in reviews.</p>
      <h3>1. Invest in your linen</h3>
      <p>Guests notice sheets immediately. White, high thread-count duvet covers that are freshly laundered signal quality instantly. It is one of the highest-return investments a host can make.</p>
      <h3>2. Create a proper welcome</h3>
      <p>A short, warm, personalised welcome message — not a PDF of house rules — sets the tone. Tell guests one or two things you genuinely love about the area.</p>
      <h3>3. Stock the basics generously</h3>
      <p>Coffee, tea, milk, washing up liquid, bin bags, toilet rolls. Running out of these mid-stay is one of the most common complaints. Always leave more than you think they need.</p>
      <h3>4. Respond within the hour</h3>
      <p>Airbnb tracks your response time and guests remember it. Even if you cannot solve a problem immediately, acknowledging it quickly builds enormous goodwill.</p>
      <h3>5. Ask for the review</h3>
      <p>On check-out day, send a brief, warm message thanking the guest and gently mentioning that a review would mean a lot. Most happy guests simply forget — a reminder converts them.</p>
    `,
  },
};

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const post = posts.find(p => p.slug === slug);
  const content = postContent[slug];

  if (!post || !content) return null;

  return (
    <>
      <Head>
        <title>{post.title} | Agatha Living Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | Agatha Living`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:section" content={post.category} />
      </Head>

      <div className="page-hero page-hero-article">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">{post.category}</span>
          <h1 style={{maxWidth:'700px'}}>{post.title}</h1>
        </div>
      </div>

      <section className={styles.article}>
        <div className={styles.meta}>
          <span className={styles.date}>{post.date}</span>
          <span className={styles.sep}>·</span>
          <span className={styles.cat}>{post.category}</span>
        </div>
        <div className={styles.body} dangerouslySetInnerHTML={{__html: content.body}} />
        <div className={styles.back}>
          <Link href="/blog" className="btn-outline-dark">← Back to Journal</Link>
        </div>
      </section>

      <section className={styles.cta}>
        <span className="section-tag">Get in Touch</span>
        <h2 className="section-title">Have a question?<br /><em>Get in touch</em></h2>
        <Link href="/contact" className="btn-gold" style={{marginTop:'28px'}}>Contact Us</Link>
      </section>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: {} };
}
