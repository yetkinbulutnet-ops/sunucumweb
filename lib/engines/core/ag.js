import { lookup } from 'node:dns/promises';
import { networkInterfaces } from 'node:os';
import { BlockList, isIP } from 'node:net';
import http from 'node:http';
import https from 'node:https';

const OZEL_BLOK = new BlockList();
for (const [ag, onek, tur] of [
  ['0.0.0.0', 8, 'ipv4'], ['10.0.0.0', 8, 'ipv4'], ['100.64.0.0', 10, 'ipv4'], ['127.0.0.0', 8, 'ipv4'],
  ['169.254.0.0', 16, 'ipv4'], ['172.16.0.0', 12, 'ipv4'], ['192.0.0.0', 24, 'ipv4'], ['192.0.2.0', 24, 'ipv4'],
  ['192.168.0.0', 16, 'ipv4'], ['198.18.0.0', 15, 'ipv4'], ['198.51.100.0', 24, 'ipv4'], ['203.0.113.0', 24, 'ipv4'],
  ['224.0.0.0', 3, 'ipv4'],
  ['64:ff9b::', 96, 'ipv6'], ['64:ff9b:1::', 48, 'ipv6'],
  ['100::', 64, 'ipv6'], ['2001:db8::', 32, 'ipv6'], ['2002::', 16, 'ipv6'], ['fc00::', 7, 'ipv6'], ['fe80::', 10, 'ipv6'],
  ['fec0::', 10, 'ipv6'], ['ff00::', 8, 'ipv6'],
]) OZEL_BLOK.addSubnet(ag, onek, tur);

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
  const tur = isIP(adres);
  if (tur === 4) {
    if (OZEL_BLOK.check(adres, 'ipv4')) return true;
    return OZEL_V4.some(([kalip]) => kalip.test(adres));
  }
  if (tur === 6) return adres.startsWith('::') || OZEL_BLOK.check(adres, 'ipv6');
  return true;
}

export async function hedefGuvenliMi(hostname) {
  try {
    const adresler = await lookup(hostname, { all: true });
    if (!adresler.length) return { guvenli: false, sebep: 'COZULEMEDI' };
    if (adresler.some((a) => ozelIpMi(a.address) || sunucuAdresiMi(a.address.replace(/^::ffff:/i, '')))) return { guvenli: false, sebep: 'OZEL_AG' };
    const sirali = [...adresler.filter((a) => a.family === 4), ...adresler.filter((a) => a.family !== 4)];
    return { guvenli: true, adresler: sirali.map((a) => a.address), adres: sirali[0].address, aile: sirali[0].family };
  } catch {
    return { guvenli: false, sebep: 'COZULEMEDI' };
  }
}

export function sabitIstek(url, adres, aile, { headers = {}, timeoutMs = 8000 } = {}) {
  return new Promise((coz) => {
    let u;
    try {
      u = new URL(url);
    } catch {
      return coz({ res: null, error: 'NETWORK' });
    }
    const modul = u.protocol === 'http:' ? http : https;
    let bitti = false;
    const sonuclan = (deger) => {
      if (bitti) return;
      bitti = true;
      clearTimeout(zamanlayici);
      coz(deger);
    };
    const istek = modul.request(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || undefined,
        path: `${u.pathname}${u.search}`,
        method: 'GET',
        headers: { ...headers, Host: u.host },
        servername: isIP(u.hostname) ? undefined : u.hostname,
        rejectUnauthorized: false,
        lookup: (_ad, secenek, cb) => (secenek && secenek.all ? cb(null, [{ address: adres, family: aile }]) : cb(null, adres, aile)),
      },
      (yanit) => {
        const basliklar = new Headers();
        const ham = yanit.rawHeaders || [];
        for (let i = 0; i + 1 < ham.length; i += 2) {
          try {
            basliklar.append(ham[i], ham[i + 1]);
          } catch {}
        }
        yanit.resume();
        yanit.destroy();
        sonuclan({ res: { status: yanit.statusCode || 0, headers: basliklar }, error: null });
      },
    );
    const zamanlayici = setTimeout(() => {
      istek.destroy();
      sonuclan({ res: null, error: 'TIMEOUT' });
    }, timeoutMs);
    istek.on('error', () => sonuclan({ res: null, error: 'NETWORK' }));
    istek.end();
  });
}
