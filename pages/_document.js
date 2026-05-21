import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL = 'https://www.agathaliving.co.uk';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Agatha Living',
  url: SITE_URL,
  description: 'Premium serviced accommodation and real estate services in London.',
  telephone: '+447405803252',
  email: 'support@agathaliving.co.uk',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '62 Greystead Road',
    addressLocality: 'Forest Hill',
    addressRegion: 'London',
    postalCode: 'SE23 3SD',
    addressCountry: 'GB',
  },
  areaServed: 'London',
  priceRange: '££',
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Agatha Living — Premium serviced accommodation and real estate services in London." />
        <meta property="og:title" content="Agatha Living" />
        <meta property="og:description" content="Premium serviced accommodation and real estate services in London." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agatha Living" />
        <meta name="twitter:description" content="Premium serviced accommodation and real estate services in London." />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
