import { dohSorgu } from './dns';

const spfDegerlendir = (kayit) => {
  if (!kayit) return { durum: 'yok', mesaj: 'SPF kaydı bulunamadı. Adınıza sahte e-posta gönderilebilir.' };
  if (/[?~-]all\b/.test(kayit) === false) {
    return { durum: 'eksik', mesaj: 'SPF kaydında "all" kuralı yok; kayıt etkisiz kalabilir.' };
  }
  if (/\+all\b/.test(kayit)) return { durum: 'riskli', mesaj: '"+all" tüm sunuculara izin verir; SPF korumasını iptal eder.' };
  if (/-all\b/.test(kayit)) return { durum: 'iyi', mesaj: 'Katı SPF (-all): tanımsız sunucular reddedilir.' };
  return { durum: 'orta', mesaj: 'Yumuşak SPF (~all): tanımsız sunucular yalnızca işaretlenir.' };
};

const dmarcDegerlendir = (kayit) => {
  if (!kayit) return { durum: 'yok', mesaj: 'DMARC kaydı yok. Raporlama ve zorlama devre dışı.' };
  const politika = /p=([a-z]+)/i.exec(kayit)?.[1]?.toLowerCase();
  if (politika === 'reject') return { durum: 'iyi', mesaj: 'p=reject: sahte iletiler reddedilir.' };
  if (politika === 'quarantine') return { durum: 'orta', mesaj: 'p=quarantine: sahte iletiler spam klasörüne düşer.' };
  if (politika === 'none') return { durum: 'eksik', mesaj: 'p=none: yalnızca raporlama yapılır, engelleme yoktur.' };
  return { durum: 'eksik', mesaj: 'DMARC politikası okunamadı.' };
};

export async function epostaKontrol(alan) {
  const [mx, txt, dmarc] = await Promise.all([
    dohSorgu(alan, 'MX'),
    dohSorgu(alan, 'TXT'),
    dohSorgu(`_dmarc.${alan}`, 'TXT'),
  ]);

  const sunucular = mx.kayitlar
    .map((k) => {
      const [oncelik, ...ad] = k.deger.split(' ');
      return { oncelik: Number(oncelik), sunucu: ad.join(' ').replace(/\.$/, ''), ttl: k.ttl };
    })
    .sort((a, b) => a.oncelik - b.oncelik);

  const spfKaydi = txt.kayitlar.map((k) => k.deger).find((d) => /^v=spf1/i.test(d)) || null;
  const dmarcKaydi = dmarc.kayitlar.map((k) => k.deger).find((d) => /^v=DMARC1/i.test(d)) || null;

  return {
    ok: true,
    alan,
    mx: { bulundu: sunucular.length > 0, sunucular },
    spf: { kayit: spfKaydi, ...spfDegerlendir(spfKaydi) },
    dmarc: { kayit: dmarcKaydi, ...dmarcDegerlendir(dmarcKaydi) },
  };
}
