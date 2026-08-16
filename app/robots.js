export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://sunucumweb.com';
export const indexlenebilir = () => process.env.SITE_INDEXABLE === '1';

export default function robots() {
  if (!indexlenebilir()) {

    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
