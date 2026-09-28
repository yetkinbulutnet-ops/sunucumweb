const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';
const CSP_KIP = process.env.CSP_KIP || 'zorla';
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com https://istatistik.yetkinweb.com",
  "style-src 'self' 'unsafe-inline' https://*.tawk.to https://fonts.googleapis.com",
  "font-src 'self' data: https://*.tawk.to https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https://storage.sunucumweb.com https://*.tawk.to",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.tawk.to wss://*.tawk.to https://istatistik.yetkinweb.com https://cloudflareinsights.com https://challenges.cloudflare.com https://status.sunucumweb.com https://storage.sunucumweb.com",
  "frame-src https://challenges.cloudflare.com https://*.tawk.to https://www.googletagmanager.com https://player.mediadelivery.net https://iframe.mediadelivery.net",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');
const dusukCpu = process.env.BUILD_CPUS ? { cpus: Number(process.env.BUILD_CPUS) } : {};

const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  ...(process.env.DOCKER_BUILD ? { output: 'standalone' } : {}),
  poweredByHeader: false,
  experimental: { ...dusukCpu, staleTimes: { dynamic: 0, static: 30 } },

  async redirects() {
    return [
      { source: '/sozlesmeler', destination: '/legal/kullanim-kosullari', permanent: true },
      { source: '/ticari-bilgiler', destination: '/legal', permanent: true },
      { source: '/whois', destination: '/araclar/whois', permanent: true },
      { source: '/kullanim-kosullari', destination: '/legal/kullanim-kosullari', permanent: true },
      { source: '/gizlilik-sozlesmesi', destination: '/legal/gizlilik-sozlesmesi', permanent: true },
      { source: '/iade-politikasi', destination: '/legal/iade-politikasi', permanent: true },
      { source: '/kullanim-politikasi', destination: '/legal/kullanim-kosullari', permanent: true },
      { source: '/hazir-yazilim/ajans-yaziliim', destination: '/hazir-yazilim/ajans-yazilimi', permanent: true },
    ];
  },

  async headers() {
    const guvenlik = [
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
      { key: CSP_KIP === 'rapor' ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy', value: CSP },
    ];
    if (INDEXLENEBILIR) {
      return [{ source: '/:path*', headers: [...guvenlik, { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] }];
    }
    return [
      {
        source: '/:path*',
        headers: [...guvenlik, { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' }],
      },
    ];
  },
};

export default nextConfig;
