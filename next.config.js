/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/services/investor-support', destination: '/services/start-grow-sa-business', permanent: true },
      { source: '/properties/greystead-road/:path*', destination: '/properties/forest-hill-skyline/:path*', permanent: true },
      { source: '/properties/70-thornbury-road/:path*', destination: '/properties/london-cinema-home/:path*', permanent: true },
      { source: '/properties/the-coach-house/:path*', destination: '/properties/private-coach-house/:path*', permanent: true },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

module.exports = nextConfig;
