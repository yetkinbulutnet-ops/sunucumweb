import { yasalBelgeleriGetir, ticariBilgiler } from './cms';

export const YASAL_KOK = '/yasal-belgeler';

export const ESKI_SLUG = { 'gizlilik-sozlesmesi': 'gizlilik-ve-guvenlik', 'iade-politikasi': 'iptal-ve-iade-kosullari' };

export const belgeYolu = (slug) => `${YASAL_KOK}/${slug}`;

export const pdfYolu = (slug) => `${YASAL_KOK}/pdf/${slug}.pdf`;

export const tarihKisa = (d) => (d ? new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }) : '');

export const tumBelgeler = async () => {
  const [t, liste] = await Promise.all([ticariBilgiler(), yasalBelgeleriGetir()]);
  return [t.belge, ...liste];
};

export const belgeBul = async (slug) => {
  if (!/^[a-z0-9-]{1,80}$/.test(String(slug || ''))) return null;
  return (await tumBelgeler()).find((b) => b.slug === slug) || null;
};

export const eskiBelge = async (slug) => {
  const hedef = ESKI_SLUG[slug];
  return hedef && (await belgeBul(hedef)) ? hedef : null;
};
