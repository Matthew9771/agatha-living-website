import Head from 'next/head';
import { useRouter } from 'next/router';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from '../components/Layout';
import { SITE_URL } from '../lib/config';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonicalPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
  const description = 'Agatha Living - Premium serviced accommodation and real estate services in London.';
  const imageUrl = `${SITE_URL}/foresthill.jpg`;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={description} />
        <meta property="og:title" content="Agatha Living" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agatha Living" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <SpeedInsights route={router.pathname} />
    </>
  );
}
