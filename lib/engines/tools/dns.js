import { fetchJson } from '../core/http';

export const TIPLER = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  PTR: 12,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  SRV: 33,
  DS: 43,
  DNSKEY: 48,
  CAA: 257,
};

const TIP_ADI = Object.fromEntries(Object.entries(TIPLER).map(([ad, no]) => [no, ad]));

export const COZUMLEYICILER = [
  { id: 'cloudflare', ad: 'Cloudflare', url: 'https://cloudflare-dns.com/dns-query' },
  { id: 'google', ad: 'Google', url: 'https://dns.google/resolve' },
  { id: 'adguard', ad: 'AdGuard', url: 'https://dns.adguard-dns.com/resolve' },
  { id: 'nextdns', ad: 'NextDNS', url: 'https://dns.nextdns.io/dns-query' },
];

export async function dohSorgu(ad, tip, cozumleyici = COZUMLEYICILER[0]) {
  const r = await fetchJson(
    `${cozumleyici.url}?name=${encodeURIComponent(ad)}&type=${encodeURIComponent(tip)}`,
    { headers: { Accept: 'application/dns-json' } },
    { timeoutMs: 6000, retries: 1 },
  );

  if (!r.ok || !r.data) return { durum: null, kayitlar: [], dogrulandi: false };

  const kayitlar = (r.data.Answer || [])
    .filter((a) => TIP_ADI[a.type])
    .map((a) => ({
      ad: String(a.name || '').replace(/\.$/, ''),
      tip: TIP_ADI[a.type],
      ttl: a.TTL,
      deger: String(a.data || '').replace(/^"|"$/g, '').replace(/"\s+"/g, ''),
    }));

  return { durum: r.data.Status, kayitlar, dogrulandi: !!r.data.AD };
}

export function soaAyristir(deger) {
  const p = String(deger).split(/\s+/);
  if (p.length < 7) return null;
  return {
    birincilSunucu: p[0].replace(/\.$/, ''),
    yetkiliEposta: p[1].replace(/\.$/, '').replace(/^([^.]+)\./, '$1@'),
    seri: Number(p[2]),
    yenileme: Number(p[3]),
    tekrar: Number(p[4]),
    sonaErme: Number(p[5]),
    enAzTtl: Number(p[6]),
  };
}

export function mxAyristir(kayitlar) {
  return kayitlar
    .map((k) => {
      const [oncelik, ...ad] = k.deger.split(/\s+/);
      return { oncelik: Number(oncelik), sunucu: ad.join(' ').replace(/\.$/, ''), ttl: k.ttl };
    })
    .filter((m) => m.sunucu)
    .sort((a, b) => a.oncelik - b.oncelik);
}

export async function adresleriCoz(adlar) {
  const benzersiz = [...new Set(adlar)].slice(0, 8);
  const sonuclar = await Promise.all(
    benzersiz.map(async (ad) => {
      const [v4, v6] = await Promise.all([dohSorgu(ad, 'A'), dohSorgu(ad, 'AAAA')]);
      return [ad, [...v4.kayitlar.map((k) => k.deger), ...v6.kayitlar.map((k) => k.deger)].slice(0, 4)];
    }),
  );
  return Object.fromEntries(sonuclar);
}

export async function yayilimKontrol(alan, tip) {
  const sonuclar = await Promise.all(
    COZUMLEYICILER.map(async (c) => {
      const s = await dohSorgu(alan, tip, c);
      return {
        cozumleyici: c.ad,
        degerler: s.kayitlar.map((k) => k.deger).sort(),
        ulasildi: s.durum !== null,
      };
    }),
  );

  const imzalar = sonuclar.filter((s) => s.ulasildi).map((s) => s.degerler.join('|'));
  const tutarli = imzalar.length > 0 && new Set(imzalar).size === 1;

  return { tutarli, sonuclar };
}
