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

const ESKI_SAYFALAR = {
  'abd-sunucu-detay': '/abd-sunucu',
  'abd-sunucu-paketleri': '/abd-sunucu',
  'abd-sunucu-teknoloji': '/abd-sunucu',
  'hosting-kampanya': '/kampanyalar',
  'vds-kampanya': '/kampanyalar',
  'kurumsal-vds': '/sanal-sunucu',
  'premium-vds': '/sanal-sunucu',
  'residential-vds': '/sanal-sunucu',
  'vds-paketleri': '/sanal-sunucu',
  'vds-teknoloji': '/sanal-sunucu',
  'web-hosting-teknoloji': '/web-hosting',
  'wisecp-ip-paketleri': '/ip-kiralama',
  'ryzen-sunucu': '/dedicated-sunucu',
};
const HTML_HEDEF = {
  'gizlilik-sozlesmesi': '/legal/gizlilik-sozlesmesi',
  'iade-politikasi': '/legal/iade-politikasi',
  'kullanim-kosullari': '/legal/kullanim-kosullari',
  'ticari-bilgiler': '/legal',
  whois: '/araclar/whois',
};
const ESKI_HTML = [
  ...Object.keys(ESKI_SAYFALAR),
  ...Object.keys(HTML_HEDEF),
  'abd-sunucu', 'alan-adi', 'dedicated-sunucu', 'gpu-sunucu', 'hakkimizda', 'iletisim', 'ip-kiralama', 'isp-sunucu', 'kurumsal-hosting',
  'premium-sunucu', 'reseller-hosting', 'sanal-sunucu', 'sunucu-barindirma', 'transfer', 'web-hosting', 'wordpress-hosting',
];

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
      { source: '/kullanim-politikas%C4%B1', destination: '/legal/kullanim-kosullari', permanent: true },
      { source: '/bilgi/:yol*', destination: 'https://my.sunucumweb.com/bilgi/:yol*', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      ...Object.entries(ESKI_SAYFALAR).map(([eski, yeni]) => ({ source: `/${eski}`, destination: yeni, permanent: true })),
      ...ESKI_HTML.map((ad) => ({ source: `/${ad}.html`, destination: HTML_HEDEF[ad] || ESKI_SAYFALAR[ad] || `/${ad}`, permanent: true })),
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
