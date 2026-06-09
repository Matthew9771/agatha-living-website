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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
