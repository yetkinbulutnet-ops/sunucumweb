import { SITE_ADI } from '@/lib/seo';

export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: 'SunucumWEB — Hosting ve Sunucu Çözümleri',
    short_name: SITE_ADI,
    description:
      'Isparta merkezli veri merkezimizden NVMe hosting, sanal sunucu (VDS), dedicated sunucu ve alan adı hizmetleri.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'tr',
    dir: 'ltr',
    background_color: '#0b1017',
    theme_color: '#0f2942',
    categories: ['business', 'utilities'],
    icons: [
      { src: '/icon/favicon.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
      { src: '/icon/favicon.png', sizes: '256x256', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
