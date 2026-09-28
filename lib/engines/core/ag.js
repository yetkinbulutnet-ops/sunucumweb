import { lookup } from 'node:dns/promises';
import { networkInterfaces } from 'node:os';

const OZEL_V4 = [
  [/^0\./, 'bu-adres'],
  [/^10\./, 'ozel-ag'],
  [/^127\./, 'yerel'],
  [/^169\.254\./, 'link-local'],
  [/^192\.168\./, 'ozel-ag'],
  [/^198\.(1[89])\./, 'kiyaslama'],
  [/^22[4-9]\.|^23\d\./, 'coklu-yayin'],
  [/^24[0-9]\.|^25[0-5]\./, 'ayrilmis'],
];

let yerelAdresler = null;
function sunucuAdresiMi(adres) {
  if (!yerelAdresler) {
    yerelAdresler = new Set();
    try {
      for (const liste of Object.values(networkInterfaces())) for (const a of liste || []) yerelAdresler.add(a.address.toLowerCase());
    } catch {}
    for (const a of String(process.env.SUNUCU_IPLERI || '').split(',')) if (a.trim()) yerelAdresler.add(a.trim().toLowerCase());
  }
  return yerelAdresler.has(adres.toLowerCase());
}

export function ozelIpMi(ip) {
  let adres = String(ip || '').trim();
  const eslenik = adres.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (eslenik) adres = eslenik[1];

  if (adres.includes(':')) {
    const k = adres.toLowerCase();
    return k === '::1' || k.startsWith('fc') || k.startsWith('fd') || k.startsWith('fe80') || k === '::';
  }

  const parcalar = adres.split('.').map(Number);
  if (parcalar.length !== 4 || parcalar.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;

  if (parcalar[0] === 172 && parcalar[1] >= 16 && parcalar[1] <= 31) return true;
  if (parcalar[0] === 100 && parcalar[1] >= 64 && parcalar[1] <= 127) return true;

  return OZEL_V4.some(([kalip]) => kalip.test(adres));
}

export async function hedefGuvenliMi(hostname) {
  try {
    const adresler = await lookup(hostname, { all: true });
    if (!adresler.length) return { guvenli: false, sebep: 'COZULEMEDI' };
    if (adresler.some((a) => ozelIpMi(a.address) || sunucuAdresiMi(a.address.replace(/^::ffff:/i, '')))) return { guvenli: false, sebep: 'OZEL_AG' };
    return { guvenli: true, adresler: adresler.map((a) => a.address) };
  } catch {
    return { guvenli: false, sebep: 'COZULEMEDI' };
  }
}
