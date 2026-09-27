import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NO_FLASH_SCRIPT } from '@/lib/engines/theme';
import { SITE_URL, SITE_ADI } from '@/lib/seo';
import { firmaSemasi } from '@/lib/semalar';
import Sema from '@/components/site/Sema';
import SiteScripts from '@/components/site/SiteScripts';
import DuyuruBandi from '@/components/site/DuyuruBandi';
import CarkRozeti from '@/components/site/CarkRozeti';
import { DUYURU_ON_BETIK } from '@/lib/duyuru';
import { aktifDuyuru, carkVerisi, siteAyarlari, bultenAyari, istemciMetinleri, metinAl } from '@/lib/cms';
import { SiteAyarlariSaglayici } from '@/components/site/SiteAyarlari';

function cssSurumu() {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'tailwind.css'));
    return crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
  } catch {
    return '1';
  }
}

const CSS = [
  '/assets/_external/fonts.googleapis.com/css2_a685150f.css',
  `/tailwind.css?v=${cssSurumu()}`,
];

const INDEXLENEBILIR = process.env.SITE_INDEXABLE === '1';

export async function generateMetadata() {
  const m = await metinAl();
  const ACIKLAMA = m('seo.aciklama');
  const BASLIK = m('seo.baslik');
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: BASLIK,
      template: '%s | SunucumWEB',
    },
    description: ACIKLAMA,
    applicationName: SITE_ADI,
    verification: { google: 'AAHrMCYsk8_atqd1hP5DnFIb_sF_4LhHfn-EMfA4q8c' },
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
      title: BASLIK,
      description: ACIKLAMA,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: m('seo.og_gorsel_alt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: BASLIK,
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
}

export default async function RootLayout({ children }) {
  const [duyuru, cark, ayar, bulten] = await Promise.all([aktifDuyuru(), carkVerisi(), siteAyarlari(), bultenAyari()]);
  const metinler = await istemciMetinleri(['genel', 'sepet', 'cark', 'durum', 'hata', 'duyuru', ...(bulten ? ['bulten'] : [])]);
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#0f2942" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b1017" />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        {duyuru && <script dangerouslySetInnerHTML={{ __html: DUYURU_ON_BETIK }} />}
        {CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <link rel="preconnect" href="https://storage.sunucumweb.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://istatistik.yetkinweb.com" />
        <link rel="dns-prefetch" href="https://status.sunucumweb.com" />
        <Sema veri={firmaSemasi(ayar)} />
      </head>
      <body>
        <SiteAyarlariSaglayici deger={{ ...ayar, bulten }} metinler={metinler}>
          {duyuru && <DuyuruBandi duyuru={duyuru} />}
          {children}
          {cark && <CarkRozeti cark={cark} />}
        </SiteAyarlariSaglayici>
        <SiteScripts />
      </body>
    </html>
  );
}
