import { fetchJson } from '../core/http';
import { rdapServerFor } from '../core/rdap';
import { whoisHam, whoisAlanlari, whoisBolum, ilkAlan, tarihCoz } from '../core/whois43';

const DURUM_ACIKLAMA = {
  'client transfer prohibited': 'Transfer kilidi açık (kayıt firması)',
  'client delete prohibited': 'Silme kilidi açık',
  'client update prohibited': 'Güncelleme kilidi açık',
  'client renew prohibited': 'Yenileme kilidi açık',
  'client hold': 'Alan adı yayından kaldırılmış',
  'server transfer prohibited': 'Transfer kilidi açık (kayıt kuruluşu)',
  'server delete prohibited': 'Silme kilidi açık (kayıt kuruluşu)',
  'server hold': 'Kayıt kuruluşu yayını durdurmuş',
  active: 'Aktif',
  ok: 'Aktif',
  inactive: 'Pasif (isim sunucusu yok)',
  'pending delete': 'Silinme sürecinde',
  'pending transfer': 'Transfer sürecinde',
  'redemption period': 'Kurtarma süresinde',
  'auto renew period': 'Otomatik yenileme süresinde',
  'add period': 'Yeni kayıt süresinde',
};

const gunFarki = (tarih) => {
  if (!tarih) return null;
  const t = new Date(tarih).getTime();
  return Number.isNaN(t) ? null : Math.round((t - Date.now()) / 86_400_000);
};

const vcard = (varlik, alan) => {
  const dizi = varlik?.vcardArray?.[1] || [];
  const satir = dizi.find((s) => s[0] === alan);
  return satir?.[3] || null;
};

function rdapIletisim(varliklar, rol) {
  const v = (varliklar || []).find((e) => (e.roles || []).includes(rol));
  if (!v) return null;
  const altlar = v.entities || [];
  const kotuyeKullanim = altlar.find((e) => (e.roles || []).includes('abuse'));
  return {
    ad: vcard(v, 'fn'),
    eposta: vcard(v, 'email') || (kotuyeKullanim ? vcard(kotuyeKullanim, 'email') : null),
    telefon: vcard(v, 'tel') || (kotuyeKullanim ? vcard(kotuyeKullanim, 'tel') : null),
    ulke: vcard(v, 'adr')?.[6] || null,
    kurum: vcard(v, 'org') || null,
    ianaId: (v.publicIds || []).find((p) => /IANA/i.test(p.type))?.identifier || null,
    site: (v.links || []).find((l) => l.rel === 'about')?.href || null,
  };
}

async function rdapSorgula(alan) {
  const sunucu = await rdapServerFor(alan);
  if (!sunucu) return null;

  const r = await fetchJson(
    `${sunucu}domain/${encodeURIComponent(alan)}`,
    { headers: { Accept: 'application/rdap+json' } },
    { timeoutMs: 9000, retries: 1 },
  );

  if (r.status === 404) return { kaynak: 'rdap', kayitli: false, alan };
  if (!r.ok || !r.data) return null;

  const d = r.data;
  const olaylar = Object.fromEntries((d.events || []).map((e) => [e.eventAction, e.eventDate]));
  const kayitFirmasi = rdapIletisim(d.entities, 'registrar');

  return {
    kaynak: 'rdap',
    kayitli: true,
    alan: String(d.ldhName || alan).toLowerCase(),
    kayitFirmasi,
    sahip: rdapIletisim(d.entities, 'registrant'),
    tarihler: {
      kayit: olaylar.registration || null,
      guncelleme: olaylar['last changed'] || null,
      bitis: olaylar.expiration || null,
      transfer: olaylar.transfer || null,
    },
    durumlar: (d.status || []).map((s) => ({
      ham: s,
      aciklama: DURUM_ACIKLAMA[String(s).toLowerCase()] || null,
    })),
    isimSunuculari: (d.nameservers || []).map((n) => String(n.ldhName || '').toLowerCase()).filter(Boolean),
    dnssec: d.secureDNS ? !!d.secureDNS.delegationSigned : null,
    sunucu,
  };
}

function whoisAyristir(alan, metin, sunucu) {
  const alanlar = whoisAlanlari(metin);
  const bulunamadi = /no match|not found|no data found|kayıt bulunamadı|no entries found/i.test(metin);

  if (bulunamadi) return { kaynak: 'whois', kayitli: false, alan, sunucu, ham: metin.trim() };

  const isimSunuculari = [
    ...(alanlar.get('name server') || []),
    ...(alanlar.get('nserver') || []),
    ...(alanlar.get('nameserver') || []),
    ...whoisBolum(metin, 'Domain Servers'),
  ]
    .map((n) => n.split(/\s+/)[0].toLowerCase().replace(/\.$/, ''))
    .filter((n) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(n));

  const durumlar = [...(alanlar.get('domain status') || []), ...(alanlar.get('status') || [])]
    .map((s) => s.split(/\s+/)[0])
    .filter(Boolean);

  return {
    kaynak: 'whois',
    kayitli: true,
    alan,
    sunucu,
    kayitFirmasi: {
      ad: ilkAlan(alanlar, 'registrar', 'sponsoring registrar', 'registrar organization', 'organization name'),
      eposta: ilkAlan(alanlar, 'registrar abuse contact email', 'abuse contact email'),
      telefon: ilkAlan(alanlar, 'registrar abuse contact phone', 'phone'),
      site: ilkAlan(alanlar, 'registrar url', 'referral url'),
      ianaId: ilkAlan(alanlar, 'registrar iana id'),
    },
    sahip: {
      ad: ilkAlan(alanlar, 'registrant name', 'registrant'),
      kurum: ilkAlan(alanlar, 'registrant organization'),
      ulke: ilkAlan(alanlar, 'registrant country', 'country'),
    },
    tarihler: {
      kayit: tarihCoz(ilkAlan(alanlar, 'creation date', 'created on', 'created', 'registration time', 'registered on')),
      guncelleme: tarihCoz(ilkAlan(alanlar, 'updated date', 'last updated', 'last update on', 'last update time')),
      bitis: tarihCoz(ilkAlan(alanlar, 'registry expiry date', 'expiration date', 'expires on', 'expiry date', 'expires')),
    },
    ekDurum: {
      dondurulmus: ilkAlan(alanlar, 'frozen status'),
      transfer: ilkAlan(alanlar, 'transfer status'),
    },
    durumlar: [...new Set(durumlar)].map((s) => ({
      ham: s,
      aciklama: DURUM_ACIKLAMA[s.toLowerCase()] || null,
    })),
    isimSunuculari: [...new Set(isimSunuculari)],
    dnssec: /dnssec:\s*(signed|yes)/i.test(metin) ? true : /dnssec:\s*(unsigned|no)/i.test(metin) ? false : null,
    ham: metin.trim().slice(0, 6000),
  };
}

export async function whoisSorgula(alan) {
  const rdap = await rdapSorgula(alan);
  let sonuc = rdap;

  if (!sonuc || (sonuc.kayitli && !sonuc.tarihler?.kayit)) {
    const ham = await whoisHam(alan);
    if (ham.ok) sonuc = whoisAyristir(alan, ham.metin, ham.sunucu);
    else if (!sonuc) return { ok: false, kod: ham.kod || 'ULASILAMADI', mesaj: 'Kayıt sunucusuna ulaşılamadı.' };
  }

  if (!sonuc) return { ok: false, kod: 'ULASILAMADI', mesaj: 'Kayıt sunucusuna ulaşılamadı.' };
  if (!sonuc.kayitli) return { ok: true, ...sonuc };

  const yasGun = sonuc.tarihler?.kayit ? -gunFarki(sonuc.tarihler.kayit) : null;

  return {
    ok: true,
    ...sonuc,
    kalanGun: gunFarki(sonuc.tarihler?.bitis),
    yasYil: yasGun !== null ? Math.floor(yasGun / 365) : null,
    yasGun,
  };
}
