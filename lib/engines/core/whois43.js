import net from 'node:net';
import { hedefGuvenliMi } from './ag';

const SUNUCULAR = {
  tr: 'whois.trabis.gov.tr',
  'com.tr': 'whois.trabis.gov.tr',
  'net.tr': 'whois.trabis.gov.tr',
  'org.tr': 'whois.trabis.gov.tr',
  'gen.tr': 'whois.trabis.gov.tr',
  'web.tr': 'whois.trabis.gov.tr',
  'biz.tr': 'whois.trabis.gov.tr',
  'info.tr': 'whois.trabis.gov.tr',
  'bel.tr': 'whois.trabis.gov.tr',
  'av.tr': 'whois.trabis.gov.tr',
  'gov.tr': 'whois.trabis.gov.tr',
  'edu.tr': 'whois.trabis.gov.tr',
  com: 'whois.verisign-grs.com',
  net: 'whois.verisign-grs.com',
  org: 'whois.pir.org',
};

const IANA = 'whois.iana.org';
const onbellek = new Map();
const AZAMI_ONBELLEK = 1000;

export function whoisIste(sunucu, sorgu, timeoutMs = 8000) {
  return new Promise((coz) => {
    let veri = '';
    let bitti = false;
    const tamam = (sonuc) => {
      if (bitti) return;
      bitti = true;
      try { soket.destroy(); } catch {  }
      coz(sonuc);
    };

    const soket = net.connect({ host: sunucu, port: 43 }, () => soket.write(`${sorgu}\r\n`));
    soket.setEncoding('utf8');
    soket.setTimeout(timeoutMs, () => tamam({ ok: false, kod: 'ZAMAN_ASIMI' }));
    soket.on('data', (p) => { veri += p; if (veri.length > 120_000) tamam({ ok: true, metin: veri }); });
    soket.on('end', () => tamam({ ok: true, metin: veri }));
    soket.on('error', (e) => tamam({ ok: false, kod: e?.code || 'BAGLANTI' }));
  });
}

async function ianaSunucusu(uzanti) {
  if (onbellek.has(uzanti)) return onbellek.get(uzanti);

  const r = await whoisIste(IANA, uzanti, 7000);
  const sunucu = r.ok ? /^whois:\s*(\S+)/mi.exec(r.metin)?.[1] || null : null;
  onbellek.set(uzanti, sunucu);
  while (onbellek.size > AZAMI_ONBELLEK) onbellek.delete(onbellek.keys().next().value);
  return sunucu;
}

export async function whoisSunucusuBul(alan) {
  const parcalar = String(alan).toLowerCase().split('.');

  for (let i = 1; i < parcalar.length; i++) {
    const sonek = parcalar.slice(i).join('.');
    if (SUNUCULAR[sonek]) return SUNUCULAR[sonek];
  }

  for (let i = parcalar.length - 2; i >= Math.max(1, parcalar.length - 2); i--) {
    const sonek = parcalar.slice(i).join('.');
    const bulunan = await ianaSunucusu(sonek);
    if (bulunan) return bulunan;
  }

  return ianaSunucusu(parcalar[parcalar.length - 1]);
}

export async function whoisHam(alan) {
  const sunucu = await whoisSunucusuBul(alan);
  if (!sunucu) return { ok: false, kod: 'SUNUCU_YOK' };

  const ilk = await whoisIste(sunucu, alan);
  if (!ilk.ok) return { ...ilk, sunucu };

  const yonlendirme = /^[ \t]*Registrar WHOIS Server:[ \t]*([a-z0-9.-]+\.[a-z]{2,})[ \t]*$/im.exec(ilk.metin.replace(/\r/g, ''))?.[1]?.toLowerCase();
  const guvenlik = yonlendirme && yonlendirme !== sunucu ? await hedefGuvenliMi(yonlendirme) : null;
  if (guvenlik?.guvenli) {
    const ikinci = await whoisIste(guvenlik.adres, alan, 7000);
    if (ikinci.ok && ikinci.metin.length > 200) {
      return { ok: true, metin: ikinci.metin, sunucu: yonlendirme, ilkSunucu: sunucu };
    }
  }

  return { ok: true, metin: ilk.metin, sunucu };
}

const AYLAR = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

export function tarihCoz(deger) {
  if (!deger) return null;
  const temiz = String(deger).trim().replace(/\.$/, '');

  const uzunAy = /^(\d{4})-([A-Za-z]{3})-(\d{1,2})$/.exec(temiz);
  if (uzunAy) {
    const ay = AYLAR[uzunAy[2].toLowerCase()];
    if (ay !== undefined) return new Date(Date.UTC(+uzunAy[1], ay, +uzunAy[3])).toISOString();
  }

  const t = new Date(temiz);
  return Number.isNaN(t.getTime()) ? null : t.toISOString();
}

export function whoisBolum(metin, baslik) {
  const kalip = new RegExp(`\\*\\*\\s*${baslik}\\s*:?[ \\t]*\\r?\\n([\\s\\S]*?)(?=\\r?\\n[ \\t]*\\*\\*|$)`, 'i');
  const es = kalip.exec(String(metin));
  if (!es) return [];
  return es[1]
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function whoisAlanlari(metin) {
  const cikti = new Map();
  for (const satir of String(metin).split(/\r?\n/)) {
    const es = /^\s*\**\s*([A-Za-zÇĞİÖŞÜçğıöşü .\-_/]+?)\s*:\s*(.+?)\s*$/.exec(satir);
    if (!es) continue;
    const anahtar = es[1].trim().toLowerCase().replace(/[.\s_]+$/, '');
    const deger = es[2].trim();
    if (!deger || deger === '-' || /redacted|privacy|not disclosed/i.test(deger)) continue;
    if (!cikti.has(anahtar)) cikti.set(anahtar, []);
    cikti.get(anahtar).push(deger);
  }
  return cikti;
}

export const ilkAlan = (alanlar, ...adaylar) => {
  for (const ad of adaylar) {
    const d = alanlar.get(ad);
    if (d?.length) return d[0];
  }
  return null;
};
