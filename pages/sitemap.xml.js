import { SITE_URL } from '../lib/config';
import { SERVICES } from '../lib/services';
import { posts } from './blog/index';

const pages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/properties', priority: '0.9', changefreq: 'daily' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/links', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
];

const blogPages = posts.map(post => ({
  path: `/blog/${post.slug}`,
  priority: '0.6',
  changefreq: 'monthly',
}));

const servicePages = SERVICES.map(service => ({
  path: `/services/${service.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

function generateSitemap() {
  const allPages = [...pages, ...servicePages, ...blogPages];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export default function Sitemap() {
  return null;
}

export function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(generateSitemap());
  res.end();
  return { props: {} };
}
