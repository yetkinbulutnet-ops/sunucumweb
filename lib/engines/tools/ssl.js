import tls from 'node:tls';
import { hedefGuvenliMi } from '../core/ag';

const ZAMAN_ASIMI = 8000;

function sertifikaOku(host) {
  return new Promise((coz) => {
    let bitti = false;
    const tamam = (sonuc) => {
      if (bitti) return;
      bitti = true;
      try { soket.destroy(); } catch {  }
      coz(sonuc);
    };

    const soket = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: false, ALPNProtocols: ['http/1.1'] },
      () => {
        const sertifika = soket.getPeerCertificate(true);
        tamam({
          ok: true,
          gecerli: soket.authorized,
          gecersizlikSebebi: soket.authorized ? null : soket.authorizationError?.toString() || null,
          protokol: soket.getProtocol(),
          sertifika,
        });
      },
    );

    soket.setTimeout(ZAMAN_ASIMI, () => tamam({ ok: false, kod: 'ZAMAN_ASIMI' }));
    soket.on('error', (e) => tamam({ ok: false, kod: 'BAGLANTI', mesaj: e?.code || 'HATA' }));
  });
}

const isim = (nesne) => nesne?.O || nesne?.CN || null;

export async function sslKontrol(host) {
  const guvenlik = await hedefGuvenliMi(host);
  if (!guvenlik.guvenli) {
    return {
      ok: false,
      kod: guvenlik.sebep,
      mesaj: guvenlik.sebep === 'OZEL_AG' ? 'Yerel ağ adresleri sorgulanamaz.' : 'Alan adı çözümlenemedi.',
    };
  }

  const sonuc = await sertifikaOku(host);
  if (!sonuc.ok) {
    return {
      ok: false,
      kod: sonuc.kod,
      mesaj: sonuc.kod === 'ZAMAN_ASIMI' ? '443 portuna bağlanılamadı (zaman aşımı).' : 'TLS bağlantısı kurulamadı.',
    };
  }

  const s = sonuc.sertifika || {};
  const bitis = s.valid_to ? new Date(s.valid_to) : null;
  const baslangic = s.valid_from ? new Date(s.valid_from) : null;
  const kalanGun = bitis ? Math.floor((bitis.getTime() - Date.now()) / 86_400_000) : null;

  const alternatifler = String(s.subjectaltname || '')
    .split(',')
    .map((p) => p.trim().replace(/^DNS:/, ''))
    .filter(Boolean);

  return {
    ok: true,
    host,
    gecerli: sonuc.gecerli,
    gecersizlikSebebi: sonuc.gecersizlikSebebi,
    protokol: sonuc.protokol,
    saglayici: isim(s.issuer),
    sahip: isim(s.subject),
    baslangic: baslangic ? baslangic.toISOString() : null,
    bitis: bitis ? bitis.toISOString() : null,
    kalanGun,
    alternatifler: alternatifler.slice(0, 12),
    alternatifSayisi: alternatifler.length,
    imzaAlgoritmasi: s.asn1Curve || s.sigalg || null,
  };
}
