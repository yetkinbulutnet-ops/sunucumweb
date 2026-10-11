import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';
import {
  dohSorgu,
  soaAyristir,
  mxAyristir,
  srvAyristir,
  caaAyristir,
  txtSinifla,
  adresleriCoz,
  yayilimKontrol,
  arpaAdi,
  ipMi,
  TIPLER,
  SORGU_TIPLERI,
  COZUMLEYICILER,
} from './dns';
import { whoisSorgula } from './whois';
import { karaListeKontrol } from './blacklist';
import { baslikKontrol } from './basliklar';
import { sslKontrol } from './ssl';
import { epostaKontrol } from './eposta';
import { ipBilgisi } from './ip';
import { ozelIpMi } from '../core/ag';
import { sm } from '../../sistem-metin';

export const ENGINE = { id: 'tools', envFlag: 'ENGINE_TOOLS' };

const ALAN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9-]{1,63})*\.[a-z]{2,24}$/i;
const IP_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const DNS_TIPLERI = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA', 'DS'];

const alanTemizle = (girdi) =>
  String(girdi || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split(':')[0];

const gecerliAlan = (alan) => ALAN_RE.test(alan) && alan.length <= 253;

async function dnsRaporu(alan) {
  const sorgular = await Promise.all(DNS_TIPLERI.map((t) => dohSorgu(alan, t).then((s) => [t, s])));
  const harita = Object.fromEntries(sorgular);

  const mx = mxAyristir(harita.MX.kayitlar);
  const ns = harita.NS.kayitlar.map((k) => k.deger.replace(/\.$/, ''));
  const adresler = await adresleriCoz([...mx.map((m) => m.sunucu), ...ns]);
  const yayilim = await yayilimKontrol(alan, 'A');

  return {
    alan,
    tip: 'TUM',
    tumu: true,
    sorgu: alan,
    nxdomain: harita.A.durum === 3 && harita.NS.kayitlar.length === 0,
    dnssec: { imzali: harita.DS.kayitlar.length > 0, dogrulandi: harita.A.dogrulandi },
    kayitlar: DNS_TIPLERI.map((tip) => ({
      tip,
      bulundu: harita[tip].kayitlar.length > 0,
      kayitlar: harita[tip].kayitlar.map(({ ttl, deger }) => ({ ttl, deger })),
    })),
    soa: harita.SOA.kayitlar[0] ? soaAyristir(harita.SOA.kayitlar[0].deger) : null,
    mx: mx.map((m) => ({ ...m, adresler: adresler[m.sunucu] || [] })),
    ns: ns.map((n) => ({ sunucu: n, adresler: adresler[n] || [] })),
    yayilim,
  };
}

async function dnsTekTip(alan, tip, sorguAdi = alan) {
  const [sonuc, yayilim] = await Promise.all([
    dohSorgu(sorguAdi, tip),
    yayilimKontrol(sorguAdi, tip),
  ]);

  const temel = {
    alan,
    tip,
    tumu: false,
    sorgu: sorguAdi,
    bulundu: sonuc.kayitlar.length > 0,
    nxdomain: sonuc.durum === 3,
    dnssec: { dogrulandi: sonuc.dogrulandi },
    takma: sonuc.takma.map(({ ttl, deger }) => ({ ttl, deger })),
    kayitlar: sonuc.kayitlar.map(({ ttl, deger }) => ({ ttl, deger })),
    yayilim,
  };

  if (tip === 'MX') {
    const mx = mxAyristir(sonuc.kayitlar);
    const adresler = await adresleriCoz(mx.map((m) => m.sunucu));
    return { ...temel, mx: mx.map((m) => ({ ...m, adresler: adresler[m.sunucu] || [] })) };
  }

  if (tip === 'NS') {
    const ns = sonuc.kayitlar.map((k) => k.deger.replace(/\.$/, ''));
    const adresler = await adresleriCoz(ns);
    return { ...temel, ns: ns.map((n) => ({ sunucu: n, adresler: adresler[n] || [] })) };
  }

  if (tip === 'SOA') return { ...temel, soa: sonuc.kayitlar[0] ? soaAyristir(sonuc.kayitlar[0].deger) : null };
  if (tip === 'SRV') return { ...temel, srv: srvAyristir(sonuc.kayitlar) };
  if (tip === 'CAA') return { ...temel, caa: caaAyristir(sonuc.kayitlar) };
  if (tip === 'TXT') return { ...temel, kayitlar: txtSinifla(sonuc.kayitlar).map(({ ttl, deger, sinif }) => ({ ttl, deger, sinif })) };

  return temel;
}

export async function dnsSorgula(girdi, tip = 'TUM') {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', sm('sistem.arac_kapali'));

  const istenen = String(tip || 'TUM').toUpperCase();
  const ham = String(girdi || '').trim();

  if (istenen === 'PTR' && ipMi(ham)) return ok(await dnsTekTip(ham, 'PTR', arpaAdi(ham)));

  const alan = alanTemizle(ham);
  if (!gecerliAlan(alan)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_alan'));
  if (istenen === 'TUM') return ok(await dnsRaporu(alan));
  if (!SORGU_TIPLERI.includes(istenen)) return fail('BAD_INPUT', sm('sistem.arac_desteklenmeyen_tip'));

  return ok(await dnsTekTip(alan, istenen));
}

export const ARACLAR = {
  dns: {
    async calistir(girdi, { tip } = {}) {
      return dnsSorgula(girdi, tip);
    },
  },

  whois: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_alan'));
      const sonuc = await whoisSorgula(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  ssl: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_alan'));
      const sonuc = await sslKontrol(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  eposta: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_alan'));
      return ok(await epostaKontrol(alan));
    },
  },

  karaliste: {
    async calistir(girdi) {
      const ham = String(girdi || '').trim();
      const hedef = ipMi(ham) ? ham : alanTemizle(ham);

      if (ipMi(hedef)) {
        if (ozelIpMi(hedef)) return fail('BAD_INPUT', sm('sistem.arac_yerel_ag'));
      } else if (!gecerliAlan(hedef)) {
        return fail('BAD_INPUT', sm('sistem.arac_gecersiz_alan_ipv4'));
      }

      const sonuc = await karaListeKontrol(hedef);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  basliklar: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_alan'));
      const sonuc = await baslikKontrol(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  ip: {
    async calistir(girdi, { ziyaretciIp } = {}) {
      const girilen = String(girdi || '').trim();
      let adres = girilen || ziyaretciIp || '';

      if (girilen && !IP_RE.test(girilen)) {
        const alan = alanTemizle(girilen);
        if (!gecerliAlan(alan)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_ipv4_alan'));
        const a = await dohSorgu(alan, 'A');
        adres = a.kayitlar[0]?.deger || '';
        if (!adres) return fail('BAD_INPUT', sm('sistem.arac_a_kaydi_yok', { alan }));
      }

      if (!IP_RE.test(adres)) return fail('BAD_INPUT', sm('sistem.arac_gecersiz_ipv4'));
      if (ozelIpMi(adres)) return fail('BAD_INPUT', sm('sistem.arac_yerel_ag'));

      const bilgi = await ipBilgisi(adres);
      return ok({ ...bilgi, kendiIpiniz: !girilen && !!ziyaretciIp, kaynakAlan: girilen && !IP_RE.test(girilen) ? alanTemizle(girilen) : null });
    },
  },
};

export const aracVarMi = (id) => Object.prototype.hasOwnProperty.call(ARACLAR, id);

export async function aracCalistir(id, girdi, baglam) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', sm('sistem.arac_kapali'));
  const arac = aracVarMi(id) ? ARACLAR[id] : null;
  if (!arac) return fail('BAD_INPUT', sm('sistem.arac_bilinmeyen'));
  try {
    return await arac.calistir(girdi, baglam);
  } catch {
    return fail('UPSTREAM_ERROR', sm('sistem.arac_sorgu_tamamlanamadi'));
  }
}

export { TIPLER, SORGU_TIPLERI, COZUMLEYICILER };
