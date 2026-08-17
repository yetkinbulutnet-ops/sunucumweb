import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';
import { dohSorgu, soaAyristir, mxAyristir, adresleriCoz, yayilimKontrol, TIPLER } from './dns';
import { whoisSorgula } from './whois';
import { sslKontrol } from './ssl';
import { epostaKontrol } from './eposta';
import { ipBilgisi } from './ip';
import { ozelIpMi } from '../core/ag';

export const ENGINE = { id: 'tools', title: 'Ağ Araçları', envFlag: 'ENGINE_TOOLS' };

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

export const ARACLAR = {
  dns: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      return ok(await dnsRaporu(alan));
    },
  },

  whois: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      const sonuc = await whoisSorgula(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  ssl: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      const sonuc = await sslKontrol(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  eposta: {
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      return ok(await epostaKontrol(alan));
    },
  },

  ip: {
    async calistir(girdi, { ziyaretciIp } = {}) {
      const girilen = String(girdi || '').trim();
      let adres = girilen || ziyaretciIp || '';

      if (girilen && !IP_RE.test(girilen)) {
        const alan = alanTemizle(girilen);
        if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir IPv4 adresi veya alan adı girin.');
        const a = await dohSorgu(alan, 'A');
        adres = a.kayitlar[0]?.deger || '';
        if (!adres) return fail('BAD_INPUT', `${alan} için A kaydı bulunamadı.`);
      }

      if (!IP_RE.test(adres)) return fail('BAD_INPUT', 'Geçerli bir IPv4 adresi girin.');
      if (ozelIpMi(adres)) return fail('BAD_INPUT', 'Yerel ağ adresleri sorgulanamaz.');

      const bilgi = await ipBilgisi(adres);
      return ok({ ...bilgi, kendiIpiniz: !girilen && !!ziyaretciIp, kaynakAlan: girilen && !IP_RE.test(girilen) ? alanTemizle(girilen) : null });
    },
  },
};

export async function aracCalistir(id, girdi, baglam) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', 'Araçlar şu anda kapalı.');
  const arac = ARACLAR[id];
  if (!arac) return fail('BAD_INPUT', 'Bilinmeyen araç.');
  try {
    return await arac.calistir(girdi, baglam);
  } catch {
    return fail('UPSTREAM_ERROR', 'Sorgu tamamlanamadı, lütfen tekrar deneyin.');
  }
}

export { TIPLER };
