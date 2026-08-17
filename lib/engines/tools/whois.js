import { fetchJson } from '../core/http';
import { rdapServerFor } from '../core/rdap';

const ROL_ADI = {
  registrant: 'Kayıt sahibi',
  administrative: 'Yönetici',
  technical: 'Teknik',
  registrar: 'Kayıt firması',
  abuse: 'Kötüye kullanım',
};

const DURUM_ADI = {
  'client transfer prohibited': 'Transfer kilidi açık',
  'client delete prohibited': 'Silme kilidi açık',
  'client update prohibited': 'Güncelleme kilidi açık',
  'server transfer prohibited': 'Sunucu transfer kilidi',
  active: 'Aktif',
  ok: 'Aktif',
  inactive: 'Pasif',
  'pending delete': 'Silinme bekliyor',
  'redemption period': 'Kurtarma süresinde',
};

function vcardAd(entity) {
  const dizi = entity?.vcardArray?.[1] || [];
  const satir = dizi.find((s) => s[0] === 'fn');
  return satir?.[3] || null;
}

export async function whoisSorgula(alan) {
  const sunucu = await rdapServerFor(alan);
  if (!sunucu) {
    return { ok: false, kod: 'RDAP_YOK', mesaj: 'Bu uzantı için RDAP sunucusu bulunamadı; .tr uzantılarında nic.tr sorgulayın.' };
  }

  const r = await fetchJson(
    `${sunucu}domain/${encodeURIComponent(alan)}`,
    { headers: { Accept: 'application/rdap+json' } },
    { timeoutMs: 9000, retries: 1 },
  );

  if (r.status === 404) return { ok: true, kayitli: false, alan };
  if (!r.ok || !r.data) return { ok: false, kod: 'ULASILAMADI', mesaj: 'Kayıt sunucusuna ulaşılamadı.' };

  const d = r.data;
  const olaylar = Object.fromEntries((d.events || []).map((e) => [e.eventAction, e.eventDate]));
  const kayitFirmasi = (d.entities || []).find((e) => (e.roles || []).includes('registrar'));

  const iletisim = (d.entities || [])
    .filter((e) => (e.roles || []).some((rol) => ROL_ADI[rol] && rol !== 'registrar'))
    .map((e) => ({
      rol: ROL_ADI[(e.roles || []).find((rol) => ROL_ADI[rol])] || 'İlgili',
      ad: vcardAd(e),
    }))
    .filter((e) => e.ad);

  return {
    ok: true,
    kayitli: true,
    alan: d.ldhName || alan,
    kayitFirmasi: kayitFirmasi ? vcardAd(kayitFirmasi) : null,
    tarihler: {
      kayit: olaylar.registration || null,
      guncelleme: olaylar['last changed'] || olaylar['last update of RDAP database'] || null,
      bitis: olaylar.expiration || null,
    },
    durumlar: (d.status || []).map((s) => DURUM_ADI[String(s).toLowerCase()] || s),
    isimSunuculari: (d.nameservers || []).map((n) => String(n.ldhName || '').toLowerCase()).filter(Boolean),
    iletisim,
    kaynak: sunucu,
  };
}
