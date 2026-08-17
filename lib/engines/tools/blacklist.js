import { mapLimit } from '../core/http';
import { dohSorgu, mxAyristir, arpaAdi, ipMi } from './dns';

export const RBL_BOLGELERI = [
  { id: 'spamcop', ad: 'SpamCop', bolge: 'bl.spamcop.net', tur: 'Şikâyet tabanlı' },
  { id: 'barracuda', ad: 'Barracuda', bolge: 'b.barracudacentral.org', tur: 'İtibar' },
  { id: 'psbl', ad: 'PSBL', bolge: 'psbl.surriel.com', tur: 'Tuzak hesap' },
  { id: 'mailspike', ad: 'Mailspike', bolge: 'bl.mailspike.net', tur: 'İtibar' },
  { id: 'uceprotect', ad: 'UCEPROTECT L1', bolge: 'dnsbl-1.uceprotect.net', tur: 'Tek IP' },
  { id: 'dronebl', ad: 'DroneBL', bolge: 'dnsbl.dronebl.org', tur: 'Bot / zararlı' },
  { id: 's5h', ad: 'S5H', bolge: 'all.s5h.net', tur: 'Karma' },
  { id: 'blocklistde', ad: 'Blocklist.de', bolge: 'bl.blocklist.de', tur: 'Saldırı bildirimi' },
  { id: 'gbudb', ad: 'GBUdb Truncate', bolge: 'truncate.gbudb.net', tur: 'İstatistiksel' },
  { id: 'interserver', ad: 'InterServer', bolge: 'rbl.interserver.net', tur: 'Karma' },
  { id: 'backscatterer', ad: 'Backscatterer', bolge: 'ips.backscatterer.org', tur: 'Geri saçılma' },
  {
    id: 'spamhaus',
    ad: 'Spamhaus ZEN',
    bolge: 'zen.spamhaus.org',
    tur: 'Sektör standardı',
    not: 'Spamhaus, genel DNS çözümleyicilerinden gelen sorguları yanıtlamıyor. Sonucu spamhaus.org üzerindeki kendi sorgu sayfasından kontrol edin.',
    baglanti: 'https://check.spamhaus.org/',
  },
];

const HATA_KODLARI = /^127\.255\.255\.(25[0-4])$/;

function kodYorumla(degerler) {
  if (degerler.some((d) => HATA_KODLARI.test(d))) return { durum: 'sorgulanamadi', kodlar: degerler };
  const gecerli = degerler.filter((d) => d.startsWith('127.'));
  if (!gecerli.length) return { durum: 'temiz', kodlar: [] };
  return { durum: 'listede', kodlar: gecerli };
}

async function bolgeSorgula(ip, bolge) {
  const ad = `${ip.split('.').reverse().join('.')}.${bolge.bolge}`;
  const sonuc = await dohSorgu(ad, 'A');

  if (sonuc.durum === null) return { id: bolge.id, durum: 'sorgulanamadi', kodlar: [], sebep: null };

  const { durum, kodlar } = kodYorumla(sonuc.kayitlar.map((k) => k.deger));
  if (durum !== 'listede') return { id: bolge.id, durum, kodlar, sebep: null };

  const txt = await dohSorgu(ad, 'TXT');
  return { id: bolge.id, durum, kodlar, sebep: txt.kayitlar[0]?.deger || null };
}

async function hedefAdresleri(alan) {
  const [a, mx] = await Promise.all([dohSorgu(alan, 'A'), dohSorgu(alan, 'MX')]);
  const adresler = a.kayitlar.map((k) => ({ ip: k.deger, kaynak: 'A kaydı' }));

  const sunucular = mxAyristir(mx.kayitlar).slice(0, 3);
  const mxAdresleri = await mapLimit(sunucular, 3, async (m) => {
    const r = await dohSorgu(m.sunucu, 'A');
    return r.kayitlar.map((k) => ({ ip: k.deger, kaynak: `MX: ${m.sunucu}` }));
  });

  const tumu = [...adresler, ...mxAdresleri.flat()];
  const gorulen = new Set();
  return tumu.filter((h) => (gorulen.has(h.ip) ? false : gorulen.add(h.ip))).slice(0, 4);
}

export async function karaListeKontrol(hedef) {
  const tekIp = ipMi(hedef);
  const adresler = tekIp ? [{ ip: hedef, kaynak: 'Girilen adres' }] : await hedefAdresleri(hedef);

  if (!adresler.length) {
    return { ok: false, kod: 'BAD_INPUT', mesaj: 'Bu alan adı için sorgulanabilir bir IP adresi bulunamadı.' };
  }

  const sonuclar = await mapLimit(adresler, 2, async (h) => {
    const [listeler, ptr] = await Promise.all([
      mapLimit(RBL_BOLGELERI, 6, (b) => bolgeSorgula(h.ip, b)),
      dohSorgu(arpaAdi(h.ip), 'PTR'),
    ]);
    return {
      ...h,
      ptr: ptr.kayitlar[0]?.deger || null,
      listeler,
      listeliSayi: listeler.filter((l) => l.durum === 'listede').length,
    };
  });

  const listeliToplam = sonuclar.reduce((t, s) => t + s.listeliSayi, 0);

  return {
    ok: true,
    hedef,
    tur: tekIp ? 'ip' : 'alan',
    adresSayisi: adresler.length,
    bolgeSayisi: RBL_BOLGELERI.length,
    bolgeler: RBL_BOLGELERI,
    sonuclar,
    temiz: listeliToplam === 0,
    listeliToplam,
  };
}
