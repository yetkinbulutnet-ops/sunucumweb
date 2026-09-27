const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';
const dusukCpu = process.env.BUILD_CPUS ? { cpus: Number(process.env.BUILD_CPUS) } : {};

const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  output: 'standalone',
  poweredByHeader: false,
  experimental: { ...dusukCpu },

  async redirects() {
    return [
      { source: '/sozlesmeler', destination: '/legal/kullanim-kosullari', permanent: true },
      { source: '/ticari-bilgiler', destination: '/legal', permanent: true },
      { source: '/whois', destination: '/araclar/whois', permanent: true },
      { source: '/kullanim-kosullari', destination: '/legal/kullanim-kosullari', permanent: true },
      { source: '/gizlilik-sozlesmesi', destination: '/legal/gizlilik-sozlesmesi', permanent: true },
      { source: '/iade-politikasi', destination: '/legal/iade-politikasi', permanent: true },
      { source: '/kullanim-politikasi', destination: '/legal/kullanim-kosullari', permanent: true },
    ];
  },

  async headers() {
    const guvenlik = [
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
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
