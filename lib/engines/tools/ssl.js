import tls from 'node:tls';
import { hedefGuvenliMi } from '../core/ag';
import { sm } from '../../sistem-metin';

const ZAMAN_ASIMI = 8000;

const PROTOKOLLER = [
  { ad: 'TLS 1.3', surum: 'TLSv1.3', guvenli: true },
  { ad: 'TLS 1.2', surum: 'TLSv1.2', guvenli: true },
  { ad: 'TLS 1.1', surum: 'TLSv1.1', guvenli: false },
  { ad: 'TLS 1.0', surum: 'TLSv1', guvenli: false },
];

function baglan(host, adres, ek = {}, timeoutMs = ZAMAN_ASIMI) {
  return new Promise((coz) => {
    let bitti = false;
    const tamam = (sonuc) => {
      if (bitti) return;
      bitti = true;
      try { soket.destroy(); } catch {  }
      coz(sonuc);
    };

    const soket = tls.connect(
      {
        host: adres || host,
        port: 443,
        servername: host,
        rejectUnauthorized: false,
        autoSelectFamily: true,
        ...ek,
      },
      () =>
        tamam({
          ok: true,
          dogrulandi: soket.authorized,
          dogrulamaHatasi: soket.authorized ? null : soket.authorizationError?.toString() || null,
          protokol: soket.getProtocol(),
          sifreleme: soket.getCipher(),
          sertifika: soket.getPeerCertificate(true),
        }),
    );

    soket.setTimeout(timeoutMs, () => tamam({ ok: false, kod: 'ZAMAN_ASIMI' }));
    soket.on('error', (e) => tamam({ ok: false, kod: e?.code || 'BAGLANTI' }));
  });
}

const kurumAdi = (n) => n?.O || n?.CN || null;

function sertifikaOzeti(s) {
  if (!s || !s.subject) return null;
  return {
    sahip: kurumAdi(s.subject),
    saglayici: kurumAdi(s.issuer),
    baslangic: s.valid_from ? new Date(s.valid_from).toISOString() : null,
    bitis: s.valid_to ? new Date(s.valid_to).toISOString() : null,
  };
}

function zincirCikar(sertifika) {
  const zincir = [];
  let mevcut = sertifika;
  const gorulen = new Set();

  while (mevcut && zincir.length < 5) {
    const parmak = mevcut.fingerprint256 || mevcut.fingerprint;
    if (parmak && gorulen.has(parmak)) break;
    if (parmak) gorulen.add(parmak);
    const ozet = sertifikaOzeti(mevcut);
    if (ozet) zincir.push(ozet);
    mevcut = mevcut.issuerCertificate;
  }

  return zincir;
}

const alanEslesiyorMu = (host, alternatifler, cn) => {
  const adaylar = alternatifler.length ? alternatifler : [cn].filter(Boolean);
  return adaylar.some((kalip) => {
    if (kalip === host) return true;
    if (kalip.startsWith('*.')) {
      const kok = kalip.slice(2);
      return host.endsWith(`.${kok}`) && host.split('.').length === kok.split('.').length + 1;
    }
    return false;
  });
};

async function protokolDestegi(host, adres) {
  const denemeler = await Promise.all(
    PROTOKOLLER.map(async (p) => {
      const r = await baglan(host, adres, { minVersion: p.surum, maxVersion: p.surum }, 5000);
      return { ...p, destekli: !!r.ok };
    }),
  );
  return denemeler;
}

export async function sslKontrol(host) {
  const guvenlik = await hedefGuvenliMi(host);
  if (!guvenlik.guvenli) {
    return {
      ok: false,
      kod: guvenlik.sebep,
      mesaj: guvenlik.sebep === 'OZEL_AG' ? sm('sistem.arac_yerel_ag') : sm('sistem.arac_alan_cozumlenemedi'),
    };
  }

  const adres = guvenlik.adres;
  const sonuc = await baglan(host, adres);

  if (!sonuc.ok) {
    return {
      ok: false,
      kod: sonuc.kod,
      mesaj: sonuc.kod === 'ZAMAN_ASIMI' ? sm('sistem.ssl_zaman_asimi') : sm('sistem.ssl_baglanti_yok'),
    };
  }

  const s = sonuc.sertifika || {};
  const bitis = s.valid_to ? new Date(s.valid_to) : null;
  const alternatifler = String(s.subjectaltname || '')
    .split(',')
    .map((p) => p.trim().replace(/^DNS:/, ''))
    .filter(Boolean);

  const protokoller = await protokolDestegi(host, adres);

  return {
    ok: true,
    host,
    adres,
    gecerli: sonuc.dogrulandi,
    gecersizlikSebebi: sonuc.dogrulamaHatasi,
    alanEslesmesi: alanEslesiyorMu(host, alternatifler, s.subject?.CN),
    kalanGun: bitis ? Math.floor((bitis.getTime() - Date.now()) / 86_400_000) : null,
    sertifika: {
      sahip: s.subject?.CN || null,
      kurum: s.subject?.O || null,
      saglayici: kurumAdi(s.issuer),
      seriNo: s.serialNumber || null,
      baslangic: s.valid_from ? new Date(s.valid_from).toISOString() : null,
      bitis: bitis ? bitis.toISOString() : null,
      imzaAlgoritmasi: s.sigalg || null,
      anahtarTipi: s.asn1Curve ? `EC (${s.asn1Curve})` : s.bits ? `RSA ${s.bits} bit` : null,
      parmakIzi: s.fingerprint256 || null,
    },
    alternatifler,
    zincir: zincirCikar(s.issuerCertificate),
    baglanti: {
      protokol: sonuc.protokol,
      sifreleme: sonuc.sifreleme?.name || null,
      sifrelemeSurumu: sonuc.sifreleme?.version || null,
    },
    protokoller,
    eskiProtokolAcik: protokoller.some((p) => !p.guvenli && p.destekli),
  };
}
