import Script from 'next/script';
import { NO_FLASH_SCRIPT } from '@/lib/engines/theme';
import { SITE_URL, SITE_ADI, mutlakUrl } from '@/lib/seo';

const UMAMI_SRC = 'https://istatistik.yetkinweb.com/script.js';
const UMAMI_ID = 'a20811f9-e3f2-4b49-a7a4-a7280eb57e1b';

const CSS = [
  '/assets/_external/fonts.googleapis.com/css2_a685150f.css',
  '/tailwind.css',
];

const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';

const ACIKLAMA =
  'Isparta merkezli veri merkezimizden NVMe hosting, sanal sunucu (VDS), dedicated sunucu ve alan adı hizmetleri. Ücretsiz SSL, günlük yedek, DDoS koruması ve gerçek 7/24 destek.';

const SOSYAL_ADRESLER = [
  'https://facebook.com/sunucumweb',
  'https://x.com/sunucumweb',
  'https://instagram.com/sunucumweb',
  'https://linkedin.com/company/sunucumweb',
  'https://youtube.com/@sunucumweb',
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'SunucumWEB — Güvenilir Hosting ve Sunucu Çözümleri',
  description: ACIKLAMA,
  applicationName: SITE_ADI,
  icons: { icon: '/assets/img/favicon.png' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_ADI,
    url: SITE_URL,
    title: 'SunucumWEB — Güvenilir Hosting ve Sunucu Çözümleri',
    description: ACIKLAMA,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SunucumWEB — Güvenilir Hosting ve Sunucu Çözümleri',
    description: ACIKLAMA,
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

function OrganizasyonSemasi() {
  const veri = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_ADI,
        legalName: 'SunucumWEB Bilişim Teknolojileri',
        url: SITE_URL,
        logo: mutlakUrl('/icon/logo.png'),
        email: 'destek@sunucumweb.com',
        telephone: '+90-850-302-5809',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Hasanbey Mahallesi, Sokullu Sokak No: 16',
          addressLocality: 'Keçiborlu',
          addressRegion: 'Isparta',
          addressCountry: 'TR',
        },
        sameAs: SOSYAL_ADRESLER,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_ADI,
        url: SITE_URL,
        inLanguage: 'tr-TR',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }} />;
}

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
        <OrganizasyonSemasi />
      </head>
      <body>
        {children}
        <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />
      </body>
    </html>
  );
}
