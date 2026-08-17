export const SITE_URL = process.env.SITE_URL || 'https://sunucumweb.com';

export const SITE_ADI = 'SunucumWEB';

export const mutlakUrl = (yol = '/') => `${SITE_URL.replace(/\/$/, '')}${yol.startsWith('/') ? yol : `/${yol}`}`;

export const kanonik = (yol) => ({ canonical: mutlakUrl(yol) });
