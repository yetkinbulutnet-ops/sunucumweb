import { fetchJson } from '../core/http';

export const TIPLER = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  NS: 2,
  TXT: 16,
  SOA: 6,
  CAA: 257,
  PTR: 12,
};

const TIP_ADI = Object.fromEntries(Object.entries(TIPLER).map(([ad, no]) => [no, ad]));

export async function dohSorgu(ad, tip) {
  const r = await fetchJson(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(ad)}&type=${encodeURIComponent(tip)}`,
    { headers: { Accept: 'application/dns-json' } },
    { timeoutMs: 6000, retries: 1 },
  );

  if (!r.ok || !r.data) return { durum: null, kayitlar: [] };

  const kayitlar = (r.data.Answer || [])
    .filter((a) => TIP_ADI[a.type])
    .map((a) => ({
      ad: a.name,
      tip: TIP_ADI[a.type],
      ttl: a.TTL,
      deger: String(a.data || '').replace(/^"|"$/g, ''),
    }));

  return { durum: r.data.Status, kayitlar, otorite: r.data.Authority || [] };
}

export async function dnsKayitlari(alan, tipler) {
  const istenen = tipler.filter((t) => TIPLER[t]);
  const sonuclar = await Promise.all(istenen.map((t) => dohSorgu(alan, t).then((s) => [t, s])));

  return sonuclar.map(([tip, s]) => ({
    tip,
    bulundu: s.kayitlar.length > 0,
    kayitlar: s.kayitlar.map(({ ttl, deger }) => ({ ttl, deger })),
  }));
}
