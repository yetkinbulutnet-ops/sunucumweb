import { mapLimit } from '../core/http';
import { dohSorgu, mxAyristir, arpaAdi, ipMi } from './dns';
import { sm } from '../../sistem-metin';

export const RBL_BOLGELERI = () => [
  { id: 'spamcop', ad: 'SpamCop', bolge: 'bl.spamcop.net', tur: sm('sistem.rbl_tur_sikayet') },
  { id: 'barracuda', ad: 'Barracuda', bolge: 'b.barracudacentral.org', tur: sm('sistem.rbl_tur_itibar') },
  { id: 'psbl', ad: 'PSBL', bolge: 'psbl.surriel.com', tur: sm('sistem.rbl_tur_tuzak') },
  { id: 'mailspike', ad: 'Mailspike', bolge: 'bl.mailspike.net', tur: sm('sistem.rbl_tur_itibar') },
  { id: 'uceprotect', ad: 'UCEPROTECT L1', bolge: 'dnsbl-1.uceprotect.net', tur: sm('sistem.rbl_tur_tek_ip') },
  { id: 'dronebl', ad: 'DroneBL', bolge: 'dnsbl.dronebl.org', tur: sm('sistem.rbl_tur_bot') },
  { id: 's5h', ad: 'S5H', bolge: 'all.s5h.net', tur: sm('sistem.rbl_tur_karma') },
  { id: 'blocklistde', ad: 'Blocklist.de', bolge: 'bl.blocklist.de', tur: sm('sistem.rbl_tur_saldiri') },
  { id: 'gbudb', ad: 'GBUdb Truncate', bolge: 'truncate.gbudb.net', tur: sm('sistem.rbl_tur_istatistiksel') },
  { id: 'interserver', ad: 'InterServer', bolge: 'rbl.interserver.net', tur: sm('sistem.rbl_tur_karma') },
  { id: 'backscatterer', ad: 'Backscatterer', bolge: 'ips.backscatterer.org', tur: sm('sistem.rbl_tur_geri_sacilma') },
  {
    id: 'spamhaus',
    ad: 'Spamhaus ZEN',
    bolge: 'zen.spamhaus.org',
    tur: sm('sistem.rbl_tur_sektor_standardi'),
    not: sm('sistem.rbl_spamhaus_not'),
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
  const adresler = a.kayitlar.map((k) => ({ ip: k.deger, kaynak: sm('sistem.rbl_kaynak_a_kaydi') }));

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
  const adresler = tekIp ? [{ ip: hedef, kaynak: sm('sistem.rbl_kaynak_girilen') }] : await hedefAdresleri(hedef);

  if (!adresler.length) {
    return { ok: false, kod: 'BAD_INPUT', mesaj: sm('sistem.rbl_ip_bulunamadi') };
  }

  const bolgeler = RBL_BOLGELERI();

  const sonuclar = await mapLimit(adresler, 2, async (h) => {
    const [listeler, ptr] = await Promise.all([
      mapLimit(bolgeler, 6, (b) => bolgeSorgula(h.ip, b)),
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
    bolgeSayisi: bolgeler.length,
    bolgeler,
    sonuclar,
    temiz: listeliToplam === 0,
    listeliToplam,
  };
}
