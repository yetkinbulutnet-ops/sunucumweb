/**
 * robots.txt
 *
 * DEMO/STAGING sunucusunda site ARAMA MOTORLARINA KAPALI olmalidir; aksi halde
 * demo icerik Google'a dusip asil siteyle "kopya icerik" cakismasi yaratir.
 *
 * Kontrol: .env icindeki SITE_INDEXABLE
 *   SITE_INDEXABLE=0  (veya tanimsiz) -> her sey engellenir  [DEMO]
 *   SITE_INDEXABLE=1                  -> normal indexlemeye acilir  [CANLI]
 *
 * Canliya gecerken TEK yapilacak: SITE_INDEXABLE=1 + yeniden build.
 */

export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://sunucumweb.com';
export const indexlenebilir = () => process.env.SITE_INDEXABLE === '1';

export default function robots() {
  if (!indexlenebilir()) {
    // DEMO: tum botlara tam kapali
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  // CANLI
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
