import { NO_FLASH_SCRIPT } from '@/lib/engines/theme';

const CSS = [
  '/assets/_external/fonts.googleapis.com/css2_a685150f.css',
  '/tailwind.css',
];

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
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        {CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
