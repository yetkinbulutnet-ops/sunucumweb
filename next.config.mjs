/** @type {import('next').NextConfig} */

// DEMO/staging'de arama motorlarina kapali. Canlida: SITE_INDEXABLE=1
const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';

const nextConfig = {
  reactStrictMode: false, // orijinal vanilla script'ler cift-init olmasin
  eslint: { ignoreDuringBuilds: true },
  // Play-CDN gorsellerini optimize etmeye calismasin; hepsi /public'ten statik
  images: { unoptimized: true },

  // Tasima icin: node_modules'a ihtiyac duymayan, kendi kendine yeten sunucu uretir
  // (.next/standalone). Hem Docker hem cPanel Node.js icin dogru cikti bicimi.
  output: 'standalone',

  async redirects() {
    // Sozlesmeler + ticari bilgiler tek sayfada birlestirildi: /legal
    return [
      { source: '/sozlesmeler', destination: '/legal', permanent: true },
      { source: '/ticari-bilgiler', destination: '/legal', permanent: true },
    ];
  },

  async headers() {
    // Meta etiketi + robots.txt'e EK olarak HTTP basligi.
    // Uc katman birden: bot hangisini okursa okusun demo indexlenmez.
    if (INDEXLENEBILIR) return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' }],
      },
    ];
  },
};

export default nextConfig;
