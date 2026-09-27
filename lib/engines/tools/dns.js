import { fetchJson } from '../core/http';
import { sm } from '../../sistem-metin';

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

export const SORGU_TIPLERI = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'SRV', 'CAA', 'PTR'];

const TIP_ADI = Object.fromEntries(Object.entries(TIPLER).map(([ad, no]) => [no, ad]));

export const COZUMLEYICILER = [
  { id: 'cloudflare', ad: 'Cloudflare', bolgeKod: 'kuresel', url: 'https://cloudflare-dns.com/dns-query' },
  { id: 'google', ad: 'Google', bolgeKod: 'kuresel', url: 'https://dns.google/resolve' },
  { id: 'adguard', ad: 'AdGuard', bolgeKod: 'avrupa', url: 'https://unfiltered.adguard-dns.com/resolve' },
  { id: 'nextdns', ad: 'NextDNS', bolgeKod: 'kuresel', url: 'https://dns.nextdns.io/dns-query' },
  { id: 'dnssb', ad: 'DNS.SB', bolgeKod: 'almanya', url: 'https://doh.sb/dns-query' },
  { id: 'cryptosx', ad: 'Crypto.sx', bolgeKod: 'hollanda', url: 'https://doh.crypto.sx/dns-query' },
  { id: 'tiar', ad: 'Tiar', bolgeKod: 'singapur', url: 'https://doh.tiar.app/dns-query' },
  { id: '360', ad: '360', adKod: 'sistem.dns_cozumleyici_360', bolgeKod: 'cin', url: 'https://doh.360.cn/resolve' },
  { id: 'dnspod', ad: 'DNSPod', bolgeKod: 'cin', url: 'https://doh.pub/dns-query' },
];

const BOLGE_ADI = () => ({
  kuresel: sm('sistem.dns_bolge_kuresel'),
  avrupa: sm('sistem.dns_bolge_avrupa'),
  almanya: sm('sistem.ulke_de'),
  hollanda: sm('sistem.ulke_nl'),
  singapur: sm('sistem.ulke_sg'),
  cin: sm('sistem.ulke_cn'),
});

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

export const ipMi = (deger) =>
  IPV4.test(deger) && deger.split('.').every((o) => Number(o) <= 255);

export function arpaAdi(ip) {
  return `${ip.split('.').reverse().join('.')}.in-addr.arpa`;
}

const SON_NOKTA_ATILIR = new Set(['NS', 'CNAME', 'PTR', 'MX', 'SRV', 'SOA']);

export async function dohSorgu(ad, tip, cozumleyici = COZUMLEYICILER[0]) {
  const istenen = String(tip).toUpperCase();
  const tipKodu = TIPLER[istenen];
  if (!tipKodu) return { durum: null, kayitlar: [], dogrulandi: false, takma: [] };

  const r = await fetchJson(
    `${cozumleyici.url}?name=${encodeURIComponent(ad)}&type=${tipKodu}`,
    { headers: { Accept: 'application/dns-json' } },
    { timeoutMs: 6000, retries: 1 },
  );

  if (!r.ok || !r.data) return { durum: null, kayitlar: [], dogrulandi: false, takma: [] };

  const cevaplar = (r.data.Answer || []).filter((a) => TIP_ADI[a.type]);
  const cevir = (a) => {
    const tipAdi = TIP_ADI[a.type];
    const ham = String(a.data || '').replace(/^"|"$/g, '').replace(/"\s+"/g, '');
    return {
      ad: String(a.name || '').replace(/\.$/, ''),
      tip: tipAdi,
      ttl: a.TTL,
      deger: SON_NOKTA_ATILIR.has(tipAdi) ? ham.replace(/\.$/, '') : ham,
    };
  };

  return {
    durum: r.data.Status,
    kayitlar: cevaplar.filter((a) => TIP_ADI[a.type] === istenen).map(cevir),
    takma: istenen === 'CNAME' ? [] : cevaplar.filter((a) => TIP_ADI[a.type] === 'CNAME').map(cevir),
    dogrulandi: !!r.data.AD,
  };
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

export function srvAyristir(kayitlar) {
  return kayitlar
    .map((k) => {
      const [oncelik, agirlik, port, ...hedef] = k.deger.split(/\s+/);
      return {
        oncelik: Number(oncelik),
        agirlik: Number(agirlik),
        port: Number(port),
        hedef: hedef.join(' ').replace(/\.$/, ''),
        ttl: k.ttl,
      };
    })
    .filter((s) => s.hedef)
    .sort((a, b) => a.oncelik - b.oncelik);
}

export function caaAyristir(kayitlar) {
  return kayitlar.map((k) => {
    const e = k.deger.match(/^(\d+)\s+(\w+)\s+"?([^"]*)"?/);
    return e
      ? { bayrak: Number(e[1]), etiket: e[2], deger: e[3], ttl: k.ttl }
      : { bayrak: null, etiket: null, deger: k.deger, ttl: k.ttl };
  });
}

const TXT_KALIPLARI = () => [
  [/^v=spf1/i, sm('sistem.dns_txt_spf')],
  [/^v=DKIM1/i, sm('sistem.dns_txt_dkim')],
  [/^v=DMARC1/i, sm('sistem.dns_txt_dmarc')],
  [/^v=STSv1/i, 'MTA-STS'],
  [/^v=BIMI1/i, 'BIMI'],
  [/^google-site-verification=/i, sm('sistem.dns_txt_google')],
  [/^MS=/i, sm('sistem.dns_txt_microsoft')],
  [/^facebook-domain-verification=/i, sm('sistem.dns_txt_meta')],
  [/^atlassian-/i, sm('sistem.dns_txt_atlassian')],
  [/^apple-domain-verification=/i, sm('sistem.dns_txt_apple')],
  [/verification|verify|site-token|_?domain-verify/i, sm('sistem.dns_txt_alan_dogrulama')],
];

export function txtSinifla(kayitlar) {
  const kaliplar = TXT_KALIPLARI();
  return kayitlar.map((k) => {
    const eslesme = kaliplar.find(([kalip]) => kalip.test(k.deger));
    return { ...k, sinif: eslesme ? eslesme[1] : null };
  });
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

export async function yayilimKontrol(alan, tip, kapsam = COZUMLEYICILER) {
  const bolgeAdlari = BOLGE_ADI();
  const sonuclar = await Promise.all(
    kapsam.map(async (c) => {
      const s = await dohSorgu(alan, tip, c);
      return {
        id: c.id,
        cozumleyici: c.adKod ? sm(c.adKod) : c.ad,
        bolge: bolgeAdlari[c.bolgeKod],
        degerler: s.kayitlar.map((k) => k.deger).sort(),
        ulasildi: s.durum !== null,
      };
    }),
  );

  const ulasilan = sonuclar.filter((s) => s.ulasildi);
  const imzalar = ulasilan.map((s) => s.degerler.join('|'));
  const benzersiz = [...new Set(imzalar)];
  const cogunluk = benzersiz
    .map((i) => ({ imza: i, adet: imzalar.filter((x) => x === i).length }))
    .sort((a, b) => b.adet - a.adet)[0];

  return {
    tutarli: benzersiz.length === 1 && ulasilan.length > 0,
    ulasan: ulasilan.length,
    toplam: kapsam.length,
    uyusan: cogunluk?.adet ?? 0,
    sonuclar,
  };
}
