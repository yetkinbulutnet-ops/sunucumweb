import { SITE_URL } from '@/lib/seo';

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'd4b1422e63f042dca85515407e7fbc7d';

const API_UCU = 'https://api.indexnow.org/indexnow';

export const anahtarKonumu = (host) => `https://${host}/${INDEXNOW_KEY}.txt`;

export async function siteHaritasiUrlleri() {
  const port = process.env.PORT || '3000';
  const kaynaklar = [
    `http://127.0.0.1:${port}/sitemap.xml`,
    `${SITE_URL.replace(/\/$/, '')}/sitemap.xml`,
  ];
  for (const kaynak of kaynaklar) {
    try {
      const yanit = await fetch(kaynak, { cache: 'no-store' });
      if (!yanit.ok) continue;
      const xml = await yanit.text();
      const urller = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => m[1].trim())
        .filter(Boolean);
      if (urller.length) return urller;
    } catch {}
  }
  return [];
}

export async function indexNowGonder(urlListesi) {
  const host = new URL(SITE_URL).host;
  const urller = [...new Set((urlListesi || []).map((u) => String(u).trim()).filter(Boolean))].filter(
    (u) => {
      try {
        return new URL(u).host === host;
      } catch {
        return false;
      }
    },
  );
  if (!urller.length) return { ok: false, gonderilen: 0, sebep: 'url-yok' };
  const yanit = await fetch(API_UCU, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: anahtarKonumu(host),
      urlList: urller,
    }),
  });
  return { ok: yanit.ok, durum: yanit.status, gonderilen: urller.length, host };
}
