export const SITE_URL = process.env.SITE_URL || 'https://sunucumweb.com';

export const SITE_ADI = 'SunucumWEB';

export const VARSAYILAN_OG = '/og.png';

export const mutlakUrl = (yol = '/') => `${SITE_URL.replace(/\/$/, '')}${yol.startsWith('/') ? yol : `/${yol}`}`;

export const kanonik = (yol) => ({ canonical: mutlakUrl(yol) });

export function sayfaMeta({ baslik, aciklama, yol = '/', ogGorsel = VARSAYILAN_OG, tip = 'website' }) {
  const url = mutlakUrl(yol);
  const gorsel = mutlakUrl(ogGorsel);
  return {
    title: baslik,
    description: aciklama,
    alternates: { canonical: url },
    openGraph: {
      type: tip,
      locale: 'tr_TR',
      siteName: SITE_ADI,
      url,
      title: baslik,
      description: aciklama,
      images: [{ url: gorsel, width: 1200, height: 630, alt: baslik }],
    },
    twitter: {
      card: 'summary_large_image',
      title: baslik,
      description: aciklama,
      images: [gorsel],
    },
  };
}
