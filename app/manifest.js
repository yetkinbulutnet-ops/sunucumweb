import { SITE_ADI } from '@/lib/seo';
import { metinAl } from '@/lib/cms';

export const dynamic = 'force-static';

export default async function manifest() {
  const m = await metinAl();
  return {
    name: m('seo.manifest_ad'),
    short_name: SITE_ADI,
    description: m('seo.manifest_aciklama'),
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'tr',
    dir: 'ltr',
    background_color: '#0b1017',
    theme_color: '#0f2942',
    categories: ['business', 'utilities'],
    icons: [
      { src: '/icon/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon/android-chrome-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
