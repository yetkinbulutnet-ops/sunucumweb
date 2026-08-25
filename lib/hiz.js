import { dohSorgu } from '@/lib/engines/tools/dns';

export const ULKE = {
  TR: 'Türkiye', US: 'ABD', DE: 'Almanya', NL: 'Hollanda', GB: 'Birleşik Krallık',
  FR: 'Fransa', RU: 'Rusya', IE: 'İrlanda', SG: 'Singapur', JP: 'Japonya',
  CA: 'Kanada', PL: 'Polonya', IT: 'İtalya', ES: 'İspanya', RO: 'Romanya',
  BG: 'Bulgaristan', UA: 'Ukrayna', AE: 'BAE', CN: 'Çin', IN: 'Hindistan',
  AZ: 'Azerbaycan', GE: 'Gürcistan', BE: 'Belçika', SE: 'İsveç', CH: 'İsviçre',
  AT: 'Avusturya', GR: 'Yunanistan', CY: 'Kıbrıs',
};

export const ulkeAdi = (kod) => {
  const k = (kod || '').toUpperCase().replace(/[^A-Z]/g, '');
  return k ? ULKE[k] || k : null;
};

export function saglayiciTemizle(ad) {
  if (!ad) return null;
  const temiz = ad.replace(/,\s*[A-Z]{2}\s*$/, '').replace(/\s+AS\d+\s*$/i, '').trim();
  const parcalar = [...new Set(temiz.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean))];
  return parcalar[parcalar.length - 1] || temiz || null;
}

export async function saglayiciAdi(asnNum) {
  if (!Number.isFinite(asnNum) || asnNum <= 0) return null;
  try {
    const kayit = await dohSorgu(`AS${asnNum}.asn.cymru.com`, 'TXT');
    const parcalar = (kayit.kayitlar?.[0]?.deger || '').split('|').map((p) => p.trim());
    return saglayiciTemizle(parcalar[4]);
  } catch {
    return null;
  }
}
