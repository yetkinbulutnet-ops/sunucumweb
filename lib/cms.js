import { cache } from 'react';
import { cevir } from './metin';
import ISTEMCI_ANAHTARLARI from './istemci-anahtarlari.json';

const CMS_URL = (process.env.CMS_URL || 'https://cms.sunucumweb.com').replace(/\/+$/, '');
const YENILEME = Number(process.env.CMS_REVALIDATE || 300);

async function cmsGet(yol) {
  const token = process.env.CMS_TOKEN;
  if (!token) throw new Error('CMS_TOKEN tanımlı değil');
  let son;
  for (let deneme = 0; deneme < 3; deneme++) {
    if (deneme) await new Promise((c) => setTimeout(c, 400 * deneme));
    try {
      const r = await fetch(`${CMS_URL}/api/v1${yol}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: YENILEME, tags: ['cms'] },
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) return r.json();
      son = new Error(`CMS ${r.status}: ${yol}`);
      if (r.status < 500) break;
    } catch (e) {
      son = e;
    }
  }
  throw son;
}

const satirlar = (metin) =>
  String(metin || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

const planDonustur = (p) => ({
  name: p.ad,
  sub: p.altBaslik || null,
  price: p.fiyat == null ? null : Number(p.fiyat),
  oldPrice: p.eskiFiyat == null ? null : Number(p.eskiFiyat),
  discount: p.indirim || null,
  popular: !!p.populer,
  feats: satirlar(p.ozellikler),
  ...(p.detaylar?.length ? { ozet: p.detaylar.map((d) => ({ e: d.etiket || null, d: d.deger, hw: !!d.donanim })) } : {}),
  siparisYolu: p.siparisYolu || null,
});

const urunDonustur = (u) => ({
  slug: u.slug,
  durum: u.durum,
  icon: u.ikon,
  eyebrow: u.ustBaslik || u.baslik,
  title: u.baslik,
  subtitle: u.altBaslik,
  seoBaslik: u.seoBaslik || null,
  seoAciklama: u.seoAciklama || null,
  heroStats: (u.heroIstatistikleri || []).map((h) => [h.deger, h.etiket]),
  specs: (u.teknikOzellikler || []).map((s) => [s.etiket, s.deger]),
  featuresTitle: u.ozelliklerBasligi || null,
  features: (u.ozellikler || []).map((o) => ({ icon: o.ikon, t: o.baslik, d: o.aciklama })),
  faq: (u.sss || []).map((s) => ({ q: s.soru, a: s.cevap })),
  siparisKategoriYolu: u.siparisKategoriYolu || null,
  guncelleme: u.updatedAt || null,
  plans: [...(u.planlar || [])].sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0)).map(planDonustur),
});

const URUN_SORGU = [
  'sort=sira:asc',
  'pagination[pageSize]=100',
  'populate[heroIstatistikleri]=true',
  'populate[teknikOzellikler]=true',
  'populate[ozellikler]=true',
  'populate[sss]=true',
  'populate[planlar][populate][detaylar]=true',
].join('&');

export const urunleriGetir = cache(async () => {
  const j = await cmsGet(`/urunler?${URUN_SORGU}`);
  return Object.fromEntries((j.data || []).map((u) => [u.slug, urunDonustur(u)]));
});

export const urunGetir = async (slug) => (await urunleriGetir())[slug] || null;

const bugunIstanbul = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' });
const tarihYaz = (iso) => (iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }) : null);

export const kampanyalariGetir = cache(async () => {
  const j = await cmsGet('/kampanyalar?sort=sira:asc&pagination[pageSize]=100');
  const bugun = bugunIstanbul();
  const varsayilanCta = cevir(await sozluk(), 'genel.varsayilan_incele');
  return (j.data || [])
    .filter((k) => !k.bitisTarihi || k.bitisTarihi >= bugun)
    .map((k) => ({
      id: k.slug,
      kategori: k.kategori,
      icon: k.ikon,
      baslik: k.baslik,
      aciklama: k.aciklama,
      indirim: k.indirim ?? null,
      eskiFiyat: k.eskiFiyat == null ? null : Number(k.eskiFiyat),
      yeniFiyat: k.yeniFiyat == null ? null : Number(k.yeniFiyat),
      periyot: k.periyot || '',
      kupon: k.kupon || null,
      bitis: tarihYaz(k.bitisTarihi),
      rozet: k.rozet || null,
      rTon: k.rozetTonu || 'yesil',
      vurgu: !!k.vurgu,
      href: k.baglanti,
      cta: k.butonMetni || varsayilanCta,
    }));
});

const YAZILIM_SORGU = [
  'sort=sira:asc',
  'pagination[pageSize]=200',
  'populate[gorsel][fields][0]=url',
  'populate[gorsel][fields][1]=width',
  'populate[gorsel][fields][2]=height',
  'populate[gorsel][fields][3]=alternativeText',
  'populate[kategori][fields][0]=slug',
].join('&');

export const yazilimVerisi = cache(async () => {
  const [k, y] = await Promise.all([
    cmsGet('/yazilim-kategorileri?sort=sira:asc&pagination[pageSize]=100'),
    cmsGet(`/hazir-yazilimlar?${YAZILIM_SORGU}`),
  ]);
  return {
    kategoriler: (k.data || []).map((x) => ({ slug: x.slug, ad: x.ad, icon: x.ikon })),
    yazilimlar: (y.data || []).map((x) => ({
      id: x.slug,
      ad: x.ad,
      kategori: x.kategori?.slug || null,
      fiyat: Number(x.fiyat),
      eskiFiyat: x.eskiFiyat == null ? null : Number(x.eskiFiyat),
      img: x.gorsel?.url || null,
      demoUrl: x.demoUrl || null,
      oneCikan: !!x.oneCikan,
      acikKaynak: !!x.acikKaynak,
      aciklama: x.aciklama,
      etiketler: satirlar(x.etiketler),
      guncelleme: x.updatedAt || null,
    })),
  };
});

export const yasalBelgeleriGetir = cache(async () => {
  const j = await cmsGet('/yasal-belgeler?sort=sira:asc&pagination[pageSize]=100');
  return (j.data || []).map((b) => ({
    slug: b.slug,
    baslik: b.baslik,
    kisa: b.kisaAd,
    ozet: b.ozet,
    icon: b.ikon,
    seo: b.seoAciklama,
    icerik: b.icerik || '',
    grup: b.grup === 'politika' ? 'politika' : 'sozlesme',
    surum: b.surum || '',
    yururluk: b.yururlukTarihi || null,
    guncelleme: b.updatedAt || null,
  }));
});

const medya = (m) =>
  m
    ? {
        url: m.url,
        genislik: m.width || null,
        yukseklik: m.height || null,
        alt: m.alternativeText || '',
        srcSet: [
          ...Object.values(m.formats || {})
            .filter((f) => f?.url && f?.width)
            .sort((a, b) => a.width - b.width)
            .map((f) => `${f.url} ${f.width}w`),
          ...(m.width ? [`${m.url} ${m.width}w`] : []),
        ].join(', '),
      }
    : null;

const blogKart = (y) => ({
  slug: y.slug,
  baslik: y.baslik,
  ozet: y.ozet,
  kapak: medya(y.kapak),
  kategori: y.kategori ? { ad: y.kategori.ad, slug: y.kategori.slug } : null,
  tarih: y.yayinTarihi || y.publishedAt,
  guncelleme: y.updatedAt,
  oneCikan: !!y.oneCikan,
});

const BLOG_LISTE_SORGU = [
  'fields[0]=slug',
  'fields[1]=baslik',
  'fields[2]=ozet',
  'fields[3]=yayinTarihi',
  'fields[4]=oneCikan',
  'fields[5]=publishedAt',
  'fields[6]=updatedAt',
  'populate[kapak][fields][0]=url',
  'populate[kapak][fields][1]=width',
  'populate[kapak][fields][2]=height',
  'populate[kapak][fields][3]=alternativeText',
  'populate[kapak][fields][4]=formats',
  'populate[kategori][fields][0]=ad',
  'populate[kategori][fields][1]=slug',
].join('&');

export const tumBlogYazilari = cache(async () => {
  const hepsi = [];
  for (let sayfa = 1; sayfa <= 50; sayfa++) {
    const j = await cmsGet(`/blog-yazilari?${BLOG_LISTE_SORGU}&pagination[page]=${sayfa}&pagination[pageSize]=100`);
    hepsi.push(...(j.data || []).map(blogKart));
    if (sayfa >= (j.meta?.pagination?.pageCount || 1)) break;
  }
  return hepsi.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
});

export const blogKategorileri = cache(async () => {
  const [j, yazilar] = await Promise.all([cmsGet('/blog-kategorileri?sort=sira:asc&pagination[pageSize]=100'), tumBlogYazilari()]);
  return (j.data || []).map((k) => ({
    ad: k.ad,
    slug: k.slug,
    aciklama: k.aciklama || '',
    seoBaslik: k.seoBaslik || null,
    seoAciklama: k.seoAciklama || null,
    adet: yazilar.filter((y) => y.kategori?.slug === k.slug).length,
  }));
});

export const blogYazisi = cache(async (slug) => {
  const q = [
    `filters[slug][$eq]=${encodeURIComponent(slug)}`,
    'populate[kapak]=true',
    'populate[kategori][fields][0]=ad',
    'populate[kategori][fields][1]=slug',
    'populate[yazar][populate][fotograf]=true',
    'populate[sss]=true',
  ].join('&');
  const y = (await cmsGet(`/blog-yazilari?${q}`)).data?.[0];
  if (!y) return null;
  return {
    ...blogKart(y),
    icerik: y.icerik || '',
    etiketler: satirlar(y.etiketler),
    seoBaslik: y.seoBaslik || null,
    seoAciklama: y.seoAciklama || null,
    yazar: y.yazar ? { ad: y.yazar.ad, unvan: y.yazar.unvan || '', biyografi: y.yazar.biyografi || '', fotograf: medya(y.yazar.fotograf) } : null,
    sss: (y.sss || []).map((s) => ({ q: s.soru, a: s.cevap })),
  };
});

export const aktifDuyuru = cache(async () => {
  try {
    const j = await cmsGet('/duyurular?sort[0]=sira:asc&sort[1]=publishedAt:desc&pagination[pageSize]=20');
    const simdi = Date.now();
    const d = (j.data || []).find(
      (x) => (!x.baslangic || new Date(x.baslangic).getTime() <= simdi) && (!x.bitis || new Date(x.bitis).getTime() > simdi)
    );
    if (!d) return null;
    return {
      anahtar: `${d.documentId}-${new Date(d.updatedAt).getTime()}`,
      metin: d.metin,
      baglanti: d.baglanti || null,
      baglantiMetni: d.baglantiMetni || cevir(await sozluk(), 'genel.varsayilan_incele'),
      ton: d.ton || 'marka',
      kapatilabilir: d.kapatilabilir !== false,
    };
  } catch {
    return null;
  }
});

export const carkVerisi = cache(async () => {
  try {
    const [a, o] = await Promise.all([
      cmsGet('/cark-ayari'),
      cmsGet('/cark-odulleri?filters[aktif][$eq]=true&filters[agirlik][$gt]=0&sort=sira:asc&pagination[pageSize]=24&fields[0]=etiket&fields[1]=renk&fields[2]=kazanamaz'),
    ]);
    const ayar = a.data;
    const dilimler = (o.data || []).map((x) => ({ id: x.documentId, etiket: x.etiket, renk: x.renk, kazanamaz: !!x.kazanamaz }));
    if (!ayar?.aktif || dilimler.length < 2) return null;
    return {
      baslik: ayar.baslik,
      aciklama: ayar.aciklama || '',
      rozetMetni: ayar.rozetMetni || cevir(await sozluk(), 'cark.varsayilan_rozet'),
      donem: ayar.donem,
      dilimler,
    };
  } catch {
    return null;
  }
});

export const bultenAyari = cache(async () => {
  try {
    const j = await cmsGet('/bulten-ayari?fields[0]=aktif&fields[1]=footerda&fields[2]=anasayfada&fields[3]=kampanyalarda&fields[4]=blogda');
    const a = j.data;
    if (!a?.aktif) return null;
    return { footer: !!a.footerda, anasayfa: !!a.anasayfada, kampanyalar: !!a.kampanyalarda, blog: !!a.blogda };
  } catch {
    return null;
  }
});

const medyaAlani = (alan) => `populate[${alan}][fields][0]=url&populate[${alan}][fields][1]=width&populate[${alan}][fields][2]=height&populate[${alan}][fields][3]=alternativeText`;

export const markalariGetir = cache(async () => {
  const j = await cmsGet(`/markalar?sort=sira:asc&pagination[pageSize]=100&filters[aktif][$eq]=true&filters[tur][$eq]=referans&${medyaAlani('logo')}`);
  return (j.data || []).map((m) => ({
    ad: m.ad,
    site: m.site || null,
    logo: m.logo?.url || null,
    g: m.logo?.width || null,
    y: m.logo?.height || null,
    ...(m.aciklama ? { not: m.aciklama } : {}),
  }));
});

const ust = (u) => ({
  eyebrow: u?.ustBaslik || '',
  baslik: u?.baslik || '',
  aciklama: u?.aciklama || '',
  seoBaslik: u?.seoBaslik || u?.baslik || '',
  seoAciklama: u?.seoAciklama || u?.aciklama || '',
});

export const sayfaMetinleri = cache(async () => {
  const j = await cmsGet('/sayfa-metni?populate=*');
  const d = j.data || {};
  return { kampanyalar: ust(d.kampanyalar), hazirYazilim: ust(d.hazirYazilim), legal: ust(d.legal), markalar: ust(d.markalar), araclar: ust(d.araclar), yasalSss: sssler(d.yasalSss) };
});

export const bankaSayfasi = cache(async () => {
  let d = {};
  try {
    d = (await cmsGet(`/banka-sayfasi?populate[ust]=true&populate[hesaplar][populate][logo][fields][0]=url&populate[hesaplar][populate][logo][fields][1]=width&populate[hesaplar][populate][logo][fields][2]=height&populate[odemeYontemleri]=true&populate[sss]=true`)).data || {};
  } catch (e) {
    if (!/CMS 404/.test(String(e?.message))) throw e;
  }
  return {
    ust: ust(d.ust),
    hesaplar: (d.hesaplar || []).map((h) => ({
      banka: h.banka,
      sahip: h.hesapSahibi,
      iban: String(h.iban || '').replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim(),
      para: h.paraBirimi || 'TL',
      aciklama: h.aciklama || '',
      logo: h.logo?.url ? { url: h.logo.url, g: h.logo.width || 320, y: h.logo.height || 120 } : null,
    })),
    uyari: d.uyari || '',
    yontemler: (d.odemeYontemleri || []).map((o) => ({ t: o.baslik, d: o.aciklama })),
    havaleBaslik: d.havaleBaslik || '',
    havaleNotlari: satirlar(d.havaleNotlari),
    sss: sssler(d.sss),
  };
});

export const hakkimizdaGetir = cache(async () => {
  const j = await cmsGet(`/hakkimizda?${medyaAlani('fotograflar')}&populate[rakamlar]=true&populate[ilkeler]=true&populate[videolar]=true`);
  const h = j.data || {};
  return {
    seo: { title: h.seoBaslik, description: h.seoAciklama },
    title: h.baslik,
    lede: h.giris,
    rakamlar: (h.rakamlar || []).map((r) => [r.deger, r.etiket]),
    hikaye: {
      paragraflar: String(h.hikaye || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      fotograflar: (h.fotograflar || []).map((f) => ({ src: f.url, alt: f.alternativeText || '', g: f.width, y: f.height })),
    },
    veriMerkezi: {
      eyebrow: h.veriMerkeziUstBaslik || '',
      baslik: h.veriMerkeziBaslik,
      metin: h.veriMerkeziMetni,
      ozellikler: satirlar(h.veriMerkeziOzellikleri),
      kart: {
        baslik: h.kartBaslik || '',
        metin: h.kartMetni || '',
        videolar: (h.videolar || []).map((v) => ({ kutuphane: v.kutuphane, video: v.video, baslik: v.baslik })),
      },
    },
    ilkeler: { eyebrow: h.ilkelerUstBaslik || '', baslik: h.ilkelerBaslik, items: (h.ilkeler || []).map((i) => ({ t: i.baslik, d: i.aciklama })) },
    cta: { baslik: h.ctaBaslik, metin: h.ctaMetni || '' },
  };
});

export const TICARI_SLUG = 'sirket-bilgileri';

export const ticariBilgiler = cache(async () => {
  const j = await cmsGet(`/ticari-bilgi?populate[bilgiler]=true&populate[epostalar]=true&populate[kayitlar][populate][belge][fields][0]=url`);
  const t = j.data || {};
  return {
    belge: { slug: TICARI_SLUG, tur: 'ticari', baslik: t.baslik, kisa: t.kisaAd, ozet: t.ozet, icon: 'users', seo: t.seoAciklama },
    ticari: {
      bilgiler: (t.bilgiler || []).map((b) => [b.etiket, b.deger, b.baglanti || undefined]),
      epostalar: (t.epostalar || []).map((e) => [e.etiket, e.deger]),
      hizmetler: satirlar(t.hizmetler),
      kayitlar: (t.kayitlar || []).map((k) => ({
        ad: k.ad,
        aciklama: k.aciklama || '',
        href: k.belge?.url || k.baglanti || '#',
        ...(k.logoAdresi ? { logo: k.logoAdresi, en: k.logoGenislik || 160, boy: k.logoYukseklik || 60 } : { icon: 'doc' }),
      })),
    },
  };
});

const SLAYT_FORMATLARI = ['small', 'medium', 'large'];

const srcSetYap = (g) => {
  if (!g?.url) return null;
  const parca = SLAYT_FORMATLARI.map((k) => g.formats?.[k]).filter((f) => f?.url && f.width).map((f) => `${f.url} ${f.width}w`);
  if (!parca.length) return null;
  if (g.width) parca.push(`${g.url} ${g.width}w`);
  return parca.join(', ');
};

export const anasayfaSlaytlari = cache(async () => {
  const j = await cmsGet('/anasayfa-slaytlari?sort=sira:asc&pagination[pageSize]=20&filters[aktif][$eq]=true&populate[gorsel][fields][0]=url&populate[gorsel][fields][1]=width&populate[gorsel][fields][2]=height&populate[gorsel][fields][3]=alternativeText&populate[gorsel][fields][4]=formats');
  return (j.data || [])
    .filter((s) => s.gorsel?.url)
    .map((s) => ({
      img: s.gorsel.url,
      srcSet: srcSetYap(s.gorsel),
      imgAlt: s.gorsel.alternativeText || '',
      eyebrow: s.ustBaslik || '',
      pre: s.onMetin || '',
      hl: s.vurgu,
      post: s.sonMetin || '',
      text: s.aciklama,
      cta: { t: s.buton1Metni, href: s.buton1Baglanti },
      cta2: s.buton2Metni && s.buton2Baglanti ? { t: s.buton2Metni, href: s.buton2Baglanti } : null,
      rozet: s.rozetMetni ? [s.rozetMetni, s.rozetIkon || 'check'] : null,
      stat: s.istatistikDeger ? [s.istatistikDeger, s.istatistikEtiket || ''] : null,
    }));
});

const BOLUMLER = ['cozumlerBolumu', 'nedenBolumu', 'altyapiBolumu', 'paketlerBolumu', 'yazilimBolumu', 'referansBolumu', 'sssBolumu', 'durumBolumu', 'guvenBolumu'];

export const anasayfaVerisi = cache(async () => {
  const bolumler = BOLUMLER.map((b) => `populate[${b}]=true`).join('&');
  const j = await cmsGet(`/anasayfa?populate[rakamlar]=true&populate[ozellikler]=true&populate[paketler]=true&populate[sss]=true&populate[altyapiMaddeleri]=true&populate[kategoriler][populate][urunler]=true&${bolumler}`);
  const a = j.data || {};
  return {
    rakamlar: (a.rakamlar || []).map((r) => [r.deger, r.etiket]),
    ozellikler: (a.ozellikler || []).map((o) => ({ t: o.baslik, d: o.aciklama, icon: o.ikon })),
    paketler: (a.paketler || []).map((p) => ({ urun: p.urun, paket: p.paket, fiyat: p.fiyat, vurgu: !!p.vurgu, ozet: p.ozet, ozellikler: satirlar(p.ozellikler), icon: p.ikon })),
    sss: (a.sss || []).map((s) => ({ q: s.soru, a: s.cevap })),
    kategoriler: (a.kategoriler || []).map((k) => ({ baslik: k.baslik, icon: k.ikon, ozet: k.ozet || '', one: !!k.oneCikan, urunler: (k.urunler || []).map((u) => ({ t: u.metin, d: u.aciklama || '', href: u.adres })) })),
    altyapiMaddeleri: (a.altyapiMaddeleri || []).map((o) => ({ icon: o.ikon, t: o.baslik, d: o.aciklama })),
    bolumler: Object.fromEntries(BOLUMLER.map((b) => [b.replace(/Bolumu$/, ''), { eyebrow: a[b]?.ustBaslik || '', baslik: a[b]?.baslik || '', aciklama: a[b]?.aciklama || '' }])),
  };
});

const SOSYAL_IKON = {
  facebook: ['Facebook', 'M14 8h-2a1 1 0 0 0-1 1v2h3l-.4 3H11v7H8v-7H6v-3h2V9a4 4 0 0 1 4-4h2z'],
  x: ['X', 'M4 4l7.6 9.6L4.4 20h2.1l5.9-6.4 5 6.4H20l-7.6-9.6L19.5 4h-2.1l-5.4 5.9L7.4 4z'],
  instagram: ['Instagram', 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5h.01'],
  linkedin: ['LinkedIn', 'M4.5 9h3v11h-3zM6 4.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM10.5 9h3v1.6a3.4 3.4 0 0 1 3-1.6c2.4 0 3.5 1.6 3.5 4.3V20h-3v-6c0-1.5-.5-2.4-1.8-2.4-1.1 0-1.7.7-1.7 2.4v6h-3z'],
  youtube: ['YouTube', 'M21 8.5a3 3 0 0 0-2.1-2.1C17.1 6 12 6 12 6s-5.1 0-6.9.4A3 3 0 0 0 3 8.5C2.6 10.3 2.6 12 2.6 12s0 1.7.4 3.5a3 3 0 0 0 2.1 2.1C6.9 18 12 18 12 18s5.1 0 6.9-.4a3 3 0 0 0 2.1-2.1c.4-1.8.4-3.5.4-3.5s0-1.7-.4-3.5zM10.2 15.1V8.9l5.3 3.1z'],
  tiktok: ['TikTok', 'M16 3c.3 2.2 1.8 3.8 4 4v3c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6v3.2a2.8 2.8 0 1 0 2.8 2.8V3z'],
};

const menuDonustur = (m) => ({
  label: m.etiket,
  ...(m.adres && !(m.ogeler || []).length ? { href: m.adres } : {}),
  ...(m.aiRozeti ? { ai: true } : {}),
  ...((m.ogeler || []).length
    ? {
        kolon: m.kolon || 2,
        items: m.ogeler.map((o) => ({
          t: o.baslik,
          d: o.aciklama || '',
          href: o.adres,
          icon: o.ikon,
          ...(o.rozet ? { r: o.rozet, rTon: o.rozetTonu || 'yesil' } : {}),
          ...(o.logo ? { logo: o.logo } : {}),
          ...(o.vurgu ? { vurgu: true } : {}),
        })),
      }
    : {}),
});

export const siteAyarlari = cache(async () => {
  const [j, l] = await Promise.all([
    cmsGet('/site-ayari?populate[sosyalMedya]=true&populate[ustMenu][populate][ogeler]=true&populate[aracMenusu][populate][ogeler]=true&populate[altMenuler][populate][baglantilar]=true'),
    cmsGet(`/markalar?sort=sira:asc&pagination[pageSize]=100&filters[aktif][$eq]=true&filters[tur][$eq]=altyapi&${medyaAlani('logo')}`),
  ]);
  const a = j.data || {};
  return {
    firma: {
      unvan: a.firmaUnvani,
      adres: a.adres,
      adresSokak: a.adresSokak || '',
      adresIlce: a.adresIlce || '',
      adresIl: a.adresIl || '',
      postaKodu: a.postaKodu || '',
      telefon: a.telefon,
      telefonHref: a.telefonBaglanti,
      eposta: a.eposta,
      kep: a.kep || '',
      panel: a.panelAdresi,
      durum: a.durumAdresi || '',
    },
    sosyal: (a.sosyalMedya || []).filter((s) => SOSYAL_IKON[s.platform]).map((s) => ({ ad: SOSYAL_IKON[s.platform][0], href: s.adres, d: SOSYAL_IKON[s.platform][1] })),
    menu: (a.ustMenu || []).map(menuDonustur),
    aracMenu: a.aracMenusu ? menuDonustur(a.aracMenusu) : null,
    footKolon: (a.altMenuler || []).map((g) => ({ h: g.baslik, items: (g.baglantilar || []).map((b) => [b.metin, b.adres]) })),
    btk: { metin: a.btkMetni || '', liste: a.btkBaglanti || '', logo: a.btkLogo || '' },
    etbis: { metin: a.etbisMetni || '', url: a.etbisBaglanti || '', logo: a.etbisLogo || '' },
    trustpilot: a.trustpilotBaglanti ? { puan: Number(a.trustpilotPuan || 0), adet: a.trustpilotYorumSayisi || 0, url: a.trustpilotBaglanti } : null,
    googleYorumUrl: a.googleYorumBaglanti || '',
    altyapi: {
      baslik: a.altyapiBasligi || '',
      liste: (l.data || []).map((m) => ({ ad: m.ad, logo: m.logo?.url || null, g: m.logo?.width || null, y: m.logo?.height || null })),
    },
    cta: { baslik: a.ctaBaslik, metin: a.ctaMetni || '' },
  };
});

export const iletisimVerisi = cache(async () => {
  const j = await cmsGet('/iletisim?populate=*');
  const d = j.data || {};
  return {
    ust: ust(d.ust),
    kanallar: (d.kanallar || []).map((k) => ({ icon: k.ikon, t: k.baslik, v: k.deger, d: k.aciklama || '', href: k.baglanti || null })),
    konular: (d.konular || []).map((k) => ({ deger: k.kod, etiket: k.etiket })),
    basariMetni: d.basariMetni || '',
  };
});

export const MOTORLU_ARACLAR = new Set(['hiz-testi', 'dns', 'whois', 'ssl', 'eposta', 'karaliste', 'basliklar', 'ip']);

export const araclariGetir = cache(async () => {
  const j = await cmsGet('/araclar?sort=sira:asc&pagination[pageSize]=100&filters[aktif][$eq]=true');
  return (j.data || [])
    .filter((a) => MOTORLU_ARACLAR.has(a.slug))
    .map((a) => ({
      slug: a.slug,
      baslik: a.baslik,
      kisa: a.kisa,
      ozet: a.ozet,
      icon: a.ikon,
      ...(a.girdiEtiketi ? { girdiEtiketi: a.girdiEtiketi } : {}),
      ...(a.ornek ? { ornek: a.ornek } : {}),
      ...(a.girdiOpsiyonel ? { girdiOpsiyonel: true } : {}),
      aciklama: a.aciklama,
      seo: a.seo,
      guncelleme: a.updatedAt || null,
    }));
});

export const aracGetir = async (slug) => (await araclariGetir()).find((a) => a.slug === slug) || null;

export const sozluk = cache(async () => {
  const sonuc = {};
  for (let sayfa = 1; sayfa < 100; sayfa++) {
    const j = await cmsGet(`/arayuz-metinleri?fields[0]=anahtar&fields[1]=metin&sort=id:asc&pagination[page]=${sayfa}&pagination[pageSize]=100`);
    for (const x of j.data || []) sonuc[x.anahtar] = x.metin;
    if (sayfa >= (j.meta?.pagination?.pageCount || 1)) break;
  }
  return sonuc;
});

export const metinAl = async () => {
  const s = await sozluk();
  return (anahtar, degerler) => cevir(s, anahtar, degerler);
};

export const dnsTipleri = cache(async () => {
  const j = await cmsGet('/dns-kayit-tipleri?sort=sira:asc&pagination[pageSize]=100');
  return (j.data || []).map((t) => ({ tip: t.tip, ad: t.ad, kisa: t.kisa, ozet: t.ozet, ornek: t.ornek || '', aciklama: t.aciklama, ipucu: t.ipucu || '' }));
});

export const dnsTipGetir = async (tip) => (await dnsTipleri()).find((t) => t.tip === String(tip || '').toUpperCase()) || null;

const ozellikler = (l) => (l || []).map((o) => ({ icon: o.ikon, t: o.baslik, d: o.aciklama }));
const adimlar = (l) => (l || []).map((o) => ({ t: o.baslik, d: o.aciklama }));
const sssler = (l) => (l || []).map((s) => ({ q: s.soru, a: s.cevap }));

export const urunSayfasiOrtak = cache(async () => {
  const j = await cmsGet('/urun-sayfasi?populate[guvenSeridi]=true&populate[performans]=true&populate[guvenlik]=true&populate[hostingAdimlari]=true&populate[karsilastirma]=true');
  const d = j.data || {};
  return {
    serit: ozellikler(d.guvenSeridi),
    performans: ozellikler(d.performans),
    guvenlik: ozellikler(d.guvenlik),
    hostingAdim: adimlar(d.hostingAdimlari),
    karsilastirma: (d.karsilastirma || []).map((g) => ({ grup: g.baslik, satirlar: satirlar(g.satirlar) })),
  };
});

export const alanAdiSayfasi = cache(async () => {
  const j = await cmsGet('/alan-adi-sayfasi?populate=*');
  const d = j.data || {};
  return {
    tlds: (d.uzantilar || []).map((u) => [u.uzanti, u.fiyat]),
    ozellikler: ozellikler(d.ozellikler),
    adimlar: { register: adimlar(d.tescilAdimlari), transfer: adimlar(d.transferAdimlari) },
    sss: { register: sssler(d.tescilSss), transfer: sssler(d.transferSss) },
  };
});

export const istemciMetinleri = async (onekler) => {
  const s = await sozluk();
  return Object.fromEntries(ISTEMCI_ANAHTARLARI.filter((k) => onekler.includes(k.split('.')[0]) && k in s).map((k) => [k, s[k]]));
};

export const aiAyarlari = cache(async () => {
  const j = await cmsGet('/ai-ayari');
  const d = j.data || {};
  return { sistemTalimati: d.sistemTalimati || '', kullaniciSablonu: d.kullaniciSablonu || '', uzantiSatiri: d.uzantiSatiri || '', jsonTalimati: d.jsonTalimati || '' };
});
