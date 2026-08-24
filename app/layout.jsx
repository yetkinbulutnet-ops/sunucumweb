import Script from 'next/script';
import { NO_FLASH_SCRIPT } from '@/lib/engines/theme';
import { SITE_URL, SITE_ADI } from '@/lib/seo';
import { firmaSemasi } from '@/lib/semalar';
import Sema from '@/components/site/Sema';

const UMAMI_SRC = 'https://istatistik.yetkinweb.com/script.js';
const UMAMI_ID = 'e2253ba7-0a0f-4696-8d27-e77254cc845d';

const TAWK_SRC = 'https://embed.tawk.to/66b732520cca4f8a7a742f23/1i4tpp5dm';

const CSS = [
  '/assets/_external/fonts.googleapis.com/css2_a685150f.css',
  '/tailwind.css',
];

const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';

const ACIKLAMA =
  'Isparta merkezli veri merkezimizden NVMe hosting, sanal sunucu (VDS), dedicated sunucu ve alan adı hizmetleri. Ücretsiz SSL, günlük yedek, DDoS koruması ve gerçek 7/24 destek.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SunucumWEB — Güvenilir Hosting ve Sunucu Çözümleri',
    template: '%s | SunucumWEB',
  },
  description: ACIKLAMA,
  applicationName: SITE_ADI,
  icons: {
    icon: [
      { url: '/icon/favicon.png', sizes: '256x256', type: 'image/png' },
      { url: '/icon/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon/android-chrome-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_ADI,
    url: SITE_URL,
    title: 'SunucumWEB — Güvenilir Hosting ve Sunucu Çözümleri',
    description: ACIKLAMA,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SunucumWEB — Hosting ve Sunucu Çözümleri' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SunucumWEB — Güvenilir Hosting ve Sunucu Çözümleri',
    description: ACIKLAMA,
    images: ['/og.png'],
  },
  robots: INDEXLENEBILIR
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#0f2942" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b1017" />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        {CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://istatistik.yetkinweb.com" />
        <link rel="dns-prefetch" href="https://status.sunucumweb.com" />
        <Sema veri={firmaSemasi()} />
      </head>
      <body>
        {children}
        <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />
        <Script id="tawkto" strategy="afterInteractive">
          {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src="${TAWK_SRC}";s1.charset="UTF-8";s1.setAttribute("crossorigin","*");s0.parentNode.insertBefore(s1,s0);})();`}
        </Script>
      </body>
    </html>
  );
}
