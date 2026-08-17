import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';
import { dnsKayitlari, dohSorgu, TIPLER } from './dns';
import { whoisSorgula } from './whois';
import { sslKontrol } from './ssl';
import { epostaKontrol } from './eposta';
import { ozelIpMi } from '../core/ag';

export const ENGINE = { id: 'tools', title: 'Ağ Araçları', envFlag: 'ENGINE_TOOLS' };

const ALAN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9-]{1,63})*\.[a-z]{2,24}$/i;
const IP_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

const alanTemizle = (girdi) =>
  String(girdi || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split(':')[0];

const gecerliAlan = (alan) => ALAN_RE.test(alan) && alan.length <= 253;

export const ARACLAR = {
  dns: {
    baslik: 'DNS Kayıt Sorgulama',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      const kayitlar = await dnsKayitlari(alan, Object.keys(TIPLER).filter((t) => t !== 'PTR'));
      return ok({ alan, kayitlar });
    },
  },

  whois: {
    baslik: 'WHOIS Sorgulama',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      const sonuc = await whoisSorgula(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  ssl: {
    baslik: 'SSL Sertifika Kontrolü',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      const sonuc = await sslKontrol(alan);
      if (!sonuc.ok) return fail(sonuc.kod, sonuc.mesaj);
      return ok(sonuc);
    },
  },

  eposta: {
    baslik: 'E-posta Kayıt Kontrolü',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    async calistir(girdi) {
      const alan = alanTemizle(girdi);
      if (!gecerliAlan(alan)) return fail('BAD_INPUT', 'Geçerli bir alan adı girin.');
      const sonuc = await epostaKontrol(alan);
      return ok(sonuc);
    },
  },

  ip: {
    baslik: 'IP Sorgulama',
    girdiEtiketi: 'IP adresi',
    ornek: '8.8.8.8',
    girdiOpsiyonel: true,
    async calistir(girdi, { ziyaretciIp } = {}) {
      const adres = String(girdi || '').trim() || ziyaretciIp || '';
      if (!IP_RE.test(adres)) return fail('BAD_INPUT', 'Geçerli bir IPv4 adresi girin.');
      if (ozelIpMi(adres)) return fail('BAD_INPUT', 'Yerel ağ adresleri sorgulanamaz.');

      const tersAd = adres.split('.').reverse().join('.') + '.in-addr.arpa';
      const ptr = await dohSorgu(tersAd, 'PTR');

      return ok({
        adres,
        kendiIpiniz: !girdi && !!ziyaretciIp,
        ptr: ptr.kayitlar.map((k) => k.deger.replace(/\.$/, '')),
      });
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
