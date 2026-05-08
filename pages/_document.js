import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Agatha Living — Premium serviced accommodation and real estate services in London." />
        <meta property="og:title" content="Agatha Living" />
        <meta property="og:description" content="Premium serviced accommodation and real estate services in London." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
