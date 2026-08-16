import Script from 'next/script';
import GlobalScripts from '@/components/GlobalScripts';
import { NO_FLASH_SCRIPT } from '@/lib/engines/theme';

// Orijinal <head>'deki font/ikon kaynaklari (public/'e kopyalandi, root-relative)
const VENDOR_CSS = [
  '/assets/_external/cdn-uicons.flaticon.com/uicons-solid-straight/css/uicons-solid-straight.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-regular-straight/css/uicons-regular-straight.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-bold-straight/css/uicons-bold-straight.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-thin-straight/css/uicons-thin-straight.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-thin-rounded/css/uicons-thin-rounded.css',
  '/assets/_external/cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css',
  '/assets/_external/cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  '/assets/_external/fonts.googleapis.com/css2_a685150f.css',
  '/assets/_external/fonts.googleapis.com/css2_496c6991.css',
  '/assets/_external/fonts.googleapis.com/css2_876777e7.css',
  '/assets/_external/fonts.cdnfonts.com/css/euclid-circular-b.css',
  '/assets/css/style.css', // orijinal custom CSS (browser toleransli parse eder)
  '/inline-styles.css', // orijinal inline <style> bloklari
  '/tailwind.css', // Tailwind build EN SON -> orijinaldeki Play CDN sirasini birebir verir
];

/* DEMO'da arama motorlarina kapali (bkz. app/robots.js).
   Canliya gecerken .env icinde SITE_INDEXABLE=1 yapip yeniden build alin. */
const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';

export const metadata = {
  icons: { icon: '/assets/img/favicon.png' },
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
        {/* Tema, ilk boyamadan ONCE ayarlanir -> koyu modda beyaz parlama olmaz */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {VENDOR_CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>
        {children}
        {/* Lucide ikon kutuphanesi + orijinal davranis scripti (tum sayfalarda) */}
        <Script src="/assets/_external/unpkg.com/lucide_latest.js" strategy="afterInteractive" />
        <GlobalScripts />
      </body>
    </html>
  );
}
