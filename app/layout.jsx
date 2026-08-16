import { NO_FLASH_SCRIPT } from '@/lib/engines/theme';

/**
 * ESKI SITENIN CSS/JS'I KALDIRILDI (2026-08-16).
 *
 * Onceden burada orijinal siteden kalan 173 KB'lik style.css, inline-styles.css,
 * 9 adet flaticon seti, font-awesome, 3 farkli Google Fonts dosyasi, euclid fontu,
 * lucide ve eski script.js yukleniyordu. 23 sayfanin tamami yeni sablonlara
 * gectigi icin hicbirine ihtiyac kalmadi ve bunlar yeni tasarimin uzerine binip
 * bozuyordu (hero'nun bos gorunmesi, beklenmeyen "Kurumsal" kartlari, font
 * uyumsuzluklari, koyu modda kirik renkler).
 *
 * Simdi SADECE: Poppins fontu + Tailwind ciktisi.
 * Eski dosyalar public/ altinda duruyor ama artik hicbir sayfa yuklemiyor.
 */
const CSS = [
  '/assets/_external/fonts.googleapis.com/css2_a685150f.css', // Poppins (yerel, dis istek yok)
  '/tailwind.css',
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
        {CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
