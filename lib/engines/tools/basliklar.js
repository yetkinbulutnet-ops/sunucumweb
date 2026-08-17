import { fetchWithTimeout } from '../core/http';
import { hedefGuvenliMi } from '../core/ag';

const IZINLI_PORTLAR = new Set(['', '80', '443', '8080', '8443']);
const EN_FAZLA_ATLAMA = 5;

const KULLANICI_AJANI =
  'Mozilla/5.0 (compatible; SunucumWEBTools/1.0; +https://sunucumweb.com/araclar)';

function urlKur(girdi) {
  const ham = String(girdi || '').trim();
  const tam = /^https?:\/\//i.test(ham) ? ham : `https://${ham}`;
  try {
    const u = new URL(tam);
    if (!/^https?:$/.test(u.protocol)) return null;
    if (!IZINLI_PORTLAR.has(u.port)) return null;
    return u;
  } catch {
    return null;
  }
}

async function atlamalariIzle(baslangic) {
  const zincir = [];
  let mevcut = baslangic;

  for (let i = 0; i <= EN_FAZLA_ATLAMA; i++) {
    const guvenlik = await hedefGuvenliMi(mevcut.hostname);
    if (!guvenlik.guvenli) {
      return { zincir, yanit: null, son: mevcut, hata: guvenlik.sebep === 'OZEL_AG' ? 'OZEL_AG' : 'COZULEMEDI' };
    }

    const { res, error } = await fetchWithTimeout(
      mevcut.toString(),
      {
        method: 'GET',
        redirect: 'manual',
        headers: { 'User-Agent': KULLANICI_AJANI, Accept: 'text/html,*/*' },
      },
      8000,
    );

    if (error) return { zincir, yanit: null, son: mevcut, hata: error };

    const konum = res.headers.get('location');
    zincir.push({ url: mevcut.toString(), durum: res.status, konum: konum || null });

    if (res.status >= 300 && res.status < 400 && konum) {
      let sonraki;
      try {
        sonraki = new URL(konum, mevcut);
      } catch {
        return { zincir, yanit: res, son: mevcut, hata: null };
      }
      if (!/^https?:$/.test(sonraki.protocol) || !IZINLI_PORTLAR.has(sonraki.port)) {
        return { zincir, yanit: res, son: mevcut, hata: null };
      }
      try {
        await res.arrayBuffer();
      } catch {
        /* gövde okunamazsa yönlendirme yine de izlenir */
      }
      mevcut = sonraki;
      continue;
    }

    return { zincir, yanit: res, son: mevcut, hata: null };
  }

  return { zincir, yanit: null, son: mevcut, hata: 'COK_FAZLA_YONLENDIRME' };
}

function hstsCozumle(deger) {
  if (!deger) return null;
  const yas = Number(deger.match(/max-age=(\d+)/i)?.[1] || 0);
  return {
    ham: deger,
    maxAge: yas,
    altAlanlar: /includeSubDomains/i.test(deger),
    onYukleme: /preload/i.test(deger),
    yeterli: yas >= 15552000,
  };
}

function cerezleriCozumle(res) {
  const ham = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  return ham.slice(0, 8).map((c) => ({
    ad: c.split('=')[0].trim(),
    secure: /;\s*secure/i.test(c),
    httpOnly: /;\s*httponly/i.test(c),
    sameSite: c.match(/;\s*samesite=(\w+)/i)?.[1] || null,
  }));
}

function ifsaBul(res) {
  const alanlar = ['server', 'x-powered-by', 'x-aspnet-version', 'x-generator', 'x-drupal-cache'];
  return alanlar
    .map((ad) => ({ ad, deger: res.headers.get(ad) }))
    .filter((b) => b.deger && /[0-9]/.test(b.deger));
}

const KONTROLLER = [
  {
    id: 'hsts',
    ad: 'Strict-Transport-Security',
    puan: 20,
    aciklama: 'Tarayıcıya bu siteye yalnızca HTTPS ile bağlanmasını söyler.',
  },
  {
    id: 'csp',
    ad: 'Content-Security-Policy',
    puan: 20,
    aciklama: 'Sayfanın hangi kaynaklardan betik ve içerik yükleyebileceğini sınırlar, XSS etkisini azaltır.',
  },
  {
    id: 'nosniff',
    ad: 'X-Content-Type-Options',
    puan: 10,
    aciklama: 'Tarayıcının dosya türünü tahmin etmesini engeller.',
  },
  {
    id: 'cerceve',
    ad: 'Çerçeveleme koruması',
    puan: 15,
    aciklama: 'Sitenizin başka bir sayfanın içine gömülüp tıklama hırsızlığına araç olmasını engeller.',
  },
  {
    id: 'referrer',
    ad: 'Referrer-Policy',
    puan: 10,
    aciklama: 'Başka siteye geçişte hangi adres bilgisinin gönderileceğini belirler.',
  },
  {
    id: 'izin',
    ad: 'Permissions-Policy',
    puan: 10,
    aciklama: 'Kamera, mikrofon, konum gibi tarayıcı yeteneklerine erişimi kısıtlar.',
  },
  { id: 'https', ad: 'HTTPS yönlendirmesi', puan: 15, aciklama: 'HTTP isteklerinin şifreli adrese yönlendirilmesi.' },
];

export async function baslikKontrol(girdi) {
  const url = urlKur(girdi);
  if (!url) return { ok: false, kod: 'BAD_INPUT', mesaj: 'Geçerli bir alan adı veya adres girin.' };

  const semaBelirtilmis = /^https?:\/\//i.test(String(girdi || '').trim());

  let sonuc = null;
  let httpDenendi = false;

  if (!semaBelirtilmis) {
    httpDenendi = true;
    const httpUrl = new URL(url.toString());
    httpUrl.protocol = 'http:';
    sonuc = await atlamalariIzle(httpUrl);
    if (!sonuc.yanit) {
      httpDenendi = false;
      sonuc = null;
    }
  }

  if (!sonuc) sonuc = await atlamalariIzle(url);

  if (!sonuc.yanit) {
    const mesajlar = {
      OZEL_AG: 'Bu adres yerel ağ adresine çözümleniyor, sorgulanamaz.',
      COZULEMEDI: 'Alan adı çözümlenemedi.',
      TIMEOUT: 'Sunucu zaman aşımına uğradı.',
      COK_FAZLA_YONLENDIRME: 'Yönlendirme zinciri çok uzun.',
    };
    return { ok: false, kod: 'UPSTREAM_ERROR', mesaj: mesajlar[sonuc.hata] || 'Sunucuya ulaşılamadı.' };
  }

  const res = sonuc.yanit;
  const hsts = hstsCozumle(res.headers.get('strict-transport-security'));
  const csp = res.headers.get('content-security-policy');
  const xfo = res.headers.get('x-frame-options');
  const cerceveKorumasi = !!xfo || /frame-ancestors/i.test(csp || '');

  const durumlar = {
    hsts: hsts?.yeterli ? 'iyi' : hsts ? 'orta' : 'yok',
    csp: csp ? (/unsafe-inline|unsafe-eval/i.test(csp) ? 'orta' : 'iyi') : 'yok',
    nosniff: /nosniff/i.test(res.headers.get('x-content-type-options') || '') ? 'iyi' : 'yok',
    cerceve: cerceveKorumasi ? 'iyi' : 'yok',
    referrer: res.headers.get('referrer-policy') ? 'iyi' : 'yok',
    izin: res.headers.get('permissions-policy') ? 'iyi' : 'yok',
    https: sonuc.son.protocol === 'https:' ? (httpDenendi ? 'iyi' : 'orta') : 'yok',
  };

  const degerler = {
    hsts: hsts?.ham || null,
    csp,
    nosniff: res.headers.get('x-content-type-options'),
    cerceve: xfo || (/frame-ancestors/i.test(csp || '') ? 'CSP frame-ancestors' : null),
    referrer: res.headers.get('referrer-policy'),
    izin: res.headers.get('permissions-policy'),
    https:
      sonuc.son.protocol === 'https:'
        ? httpDenendi
          ? 'HTTP isteği HTTPS adresine yönlendiriliyor'
          : 'HTTPS çalışıyor, HTTP portundan yanıt alınamadı'
        : 'Site şifresiz HTTP üzerinden yanıt veriyor',
  };

  const kontroller = KONTROLLER.map((k) => ({
    ...k,
    durum: durumlar[k.id],
    deger: degerler[k.id],
    kazanilan: durumlar[k.id] === 'iyi' ? k.puan : durumlar[k.id] === 'orta' ? Math.round(k.puan / 2) : 0,
  }));

  const ifsalar = ifsaBul(res);
  const hamPuan = kontroller.reduce((t, k) => t + k.kazanilan, 0);
  const puan = Math.max(0, Math.min(100, hamPuan - (ifsalar.length ? 5 : 0)));

  return {
    ok: true,
    girdi: url.hostname,
    sonUrl: sonuc.son.toString(),
    durumKodu: res.status,
    zincir: sonuc.zincir,
    puan,
    kontroller,
    hsts,
    ifsalar,
    cerezler: cerezleriCozumle(res),
    sunucu: res.headers.get('server'),
    icerikTuru: res.headers.get('content-type'),
    sikistirma: res.headers.get('content-encoding'),
    onbellek: res.headers.get('cache-control'),
  };
}
