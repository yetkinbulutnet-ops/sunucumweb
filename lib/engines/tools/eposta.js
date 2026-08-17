import { dohSorgu, mxAyristir, adresleriCoz } from './dns';

const DKIM_SECICILER = [
  'default', 'google', 'selector1', 'selector2', 'k1', 'k2', 'mail', 'dkim',
  's1', 's2', 'mandrill', 'zoho', 'everlytickey1', 'protonmail', 'sendgrid', 'cpanel',
];

const SPF_LOOKUP_MEKANIZMALARI = /^(include|a|mx|ptr|exists|redirect)/i;

function spfAyristir(kayit) {
  if (!kayit) {
    return { durum: 'yok', mesaj: 'SPF kaydı bulunamadı. Adınıza sahte e-posta gönderilmesi kolaylaşır.' };
  }

  const parcalar = kayit.split(/\s+/).slice(1);
  const includeler = parcalar.filter((p) => /^include:/i.test(p)).map((p) => p.slice(8));
  const ipler = parcalar.filter((p) => /^ip4:|^ip6:/i.test(p)).map((p) => p.split(':').slice(1).join(':'));
  const lookupSayisi = parcalar.filter((p) => SPF_LOOKUP_MEKANIZMALARI.test(p.replace(/^[+\-~?]/, ''))).length;
  const hepsi = /([+\-~?])all\b/.exec(kayit)?.[1] || null;

  let durum = 'orta';
  let mesaj = 'Yumuşak SPF (~all): tanımsız sunucular yalnızca işaretlenir.';

  if (!hepsi) {
    durum = 'eksik';
    mesaj = 'Kayıtta "all" kuralı yok; SPF pratikte hiçbir gönderimi engellemez.';
  } else if (hepsi === '+') {
    durum = 'riskli';
    mesaj = '"+all" tüm dünyaya izin verir; SPF korumasını tamamen iptal eder.';
  } else if (hepsi === '-') {
    durum = 'iyi';
    mesaj = 'Katı SPF (-all): tanımlı olmayan sunucuların gönderimi reddedilir.';
  } else if (hepsi === '?') {
    durum = 'eksik';
    mesaj = 'Nötr SPF (?all): alıcı sunucuya hiçbir yönlendirme yapılmaz.';
  }

  return {
    durum,
    mesaj,
    hepsi,
    includeler,
    ipler,
    lookupSayisi,
    lookupAsimi: lookupSayisi > 10,
  };
}

function dmarcAyristir(kayit) {
  if (!kayit) {
    return { durum: 'yok', mesaj: 'DMARC kaydı yok. Sahte gönderimler engellenmez, rapor da alınmaz.' };
  }

  const oku = (anahtar) => new RegExp(`${anahtar}=([^;\\s]+)`, 'i').exec(kayit)?.[1] || null;
  const politika = (oku('p') || '').toLowerCase();
  const yuzde = oku('pct') ? Number(oku('pct')) : 100;

  const tablo = {
    reject: { durum: 'iyi', mesaj: 'p=reject: kimlik doğrulaması başarısız iletiler reddedilir.' },
    quarantine: { durum: 'orta', mesaj: 'p=quarantine: şüpheli iletiler spam klasörüne düşer.' },
    none: { durum: 'eksik', mesaj: 'p=none: yalnızca raporlama yapılır, hiçbir ileti engellenmez.' },
  };

  return {
    ...(tablo[politika] || { durum: 'eksik', mesaj: 'DMARC politikası okunamadı.' }),
    politika: politika || null,
    altAlanPolitikasi: oku('sp'),
    yuzde,
    raporAdresi: oku('rua'),
    hataRaporu: oku('ruf'),
    dkimHizalama: oku('adkim') === 's' ? 'katı' : 'gevşek',
    spfHizalama: oku('aspf') === 's' ? 'katı' : 'gevşek',
  };
}

async function dkimAra(alan) {
  const sonuclar = await Promise.all(
    DKIM_SECICILER.map(async (secici) => {
      const s = await dohSorgu(`${secici}._domainkey.${alan}`, 'TXT');
      const kayit = s.kayitlar.map((k) => k.deger).find((d) => /v=DKIM1|k=rsa|p=/i.test(d));
      return kayit ? { secici, kayit } : null;
    }),
  );
  return sonuclar.filter(Boolean);
}

export async function epostaKontrol(alan) {
  const [mx, txt, dmarc, mtaSts, bimi, dkim] = await Promise.all([
    dohSorgu(alan, 'MX'),
    dohSorgu(alan, 'TXT'),
    dohSorgu(`_dmarc.${alan}`, 'TXT'),
    dohSorgu(`_mta-sts.${alan}`, 'TXT'),
    dohSorgu(`default._bimi.${alan}`, 'TXT'),
    dkimAra(alan),
  ]);

  const sunucular = mxAyristir(mx.kayitlar);
  const adresler = sunucular.length ? await adresleriCoz(sunucular.map((s) => s.sunucu)) : {};

  const spfKaydi = txt.kayitlar.map((k) => k.deger).find((d) => /^v=spf1/i.test(d)) || null;
  const dmarcKaydi = dmarc.kayitlar.map((k) => k.deger).find((d) => /^v=DMARC1/i.test(d)) || null;
  const mtaStsKaydi = mtaSts.kayitlar.map((k) => k.deger).find((d) => /^v=STSv1/i.test(d)) || null;
  const bimiKaydi = bimi.kayitlar.map((k) => k.deger).find((d) => /^v=BIMI1/i.test(d)) || null;

  const spf = { kayit: spfKaydi, ...spfAyristir(spfKaydi) };
  const dmarcSonuc = { kayit: dmarcKaydi, ...dmarcAyristir(dmarcKaydi) };

  const puan =
    (sunucular.length ? 30 : 0) +
    (spf.durum === 'iyi' ? 30 : spf.durum === 'orta' ? 20 : 0) +
    (dmarcSonuc.durum === 'iyi' ? 30 : dmarcSonuc.durum === 'orta' ? 20 : dmarcSonuc.durum === 'eksik' ? 10 : 0) +
    (dkim.length ? 10 : 0);

  return {
    ok: true,
    alan,
    puan,
    mx: {
      bulundu: sunucular.length > 0,
      sunucular: sunucular.map((s) => ({ ...s, adresler: adresler[s.sunucu] || [] })),
    },
    spf,
    dmarc: dmarcSonuc,
    dkim: { bulundu: dkim.length > 0, kayitlar: dkim },
    mtaSts: { kayit: mtaStsKaydi, bulundu: !!mtaStsKaydi },
    bimi: { kayit: bimiKaydi, bulundu: !!bimiKaydi },
  };
}
