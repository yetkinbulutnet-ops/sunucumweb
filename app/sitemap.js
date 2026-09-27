import { getManifest } from '@/lib/content';
import { DNS_TIP_KODLARI } from '@/content/site/dns-tipleri';
import { mutlakUrl } from '@/lib/seo';
import { dnsYolu } from '@/lib/dns-yol';
import { urunleriGetir, yazilimVerisi, yasalBelgeleriGetir, tumBlogYazilari, blogKategorileri, araclariGetir } from '@/lib/cms';

export const revalidate = 3600;

const YONLENDIRILEN = ['ticari-bilgiler', 'sozlesmeler', 'whois', 'gizlilik-sozlesmesi', 'iade-politikasi', 'kullanim-kosullari', 'kullanim-politikasi'];
const ORNEK_ALANLAR = ['sunucumweb.com'];

const SON_GUNCELLEME = new Date('2026-08-24');

const girdi = (yol, oncelik, siklik) => ({
  url: mutlakUrl(yol),
  lastModified: SON_GUNCELLEME,
  changeFrequency: siklik,
  priority: oncelik,
});

export default async function sitemap() {
  const urunler = await urunleriGetir();
  const slugs = new Set(getManifest().pages.map((p) => p.slug).filter((s) => !YONLENDIRILEN.includes(s) && s !== 'index'));
  for (const s of Object.keys(urunler)) slugs.add(s);
  const sayfalar = [...slugs].filter((s) => urunler[s]?.durum !== 'yapim-asamasi').map((s) => girdi(`/${s}`, 0.8, 'monthly'));

  const araclar = (await araclariGetir()).map((a) => girdi(`/araclar/${a.slug}`, 0.7, 'monthly'));

  const yasal = (await yasalBelgeleriGetir()).map((b) => girdi(`/legal/${b.slug}`, 0.3, 'yearly'));

  const dnsSayfalari = ORNEK_ALANLAR.flatMap((alan) => [
    girdi(dnsYolu(alan), 0.5, 'weekly'),
    ...DNS_TIP_KODLARI.map((t) => girdi(dnsYolu(alan, t), 0.4, 'weekly')),
  ]);

  const blogYazilari = await tumBlogYazilari();
  const blog = blogYazilari.length
    ? [
        girdi('/blog', 0.8, 'daily'),
        ...(await blogKategorileri()).filter((k) => k.adet > 0).map((k) => girdi(`/blog/kategori/${k.slug}`, 0.6, 'weekly')),
        ...blogYazilari.map((y) => ({ ...girdi(`/blog/${y.slug}`, 0.7, 'monthly'), lastModified: new Date(y.guncelleme || y.tarih) })),
      ]
    : [];

  const yazilimlar = (await yazilimVerisi()).yazilimlar.map((y) => girdi(`/hazir-yazilim/${y.id}`, 0.7, 'monthly'));

  return [
    girdi('/', 1, 'weekly'),
    girdi('/kampanyalar', 0.8, 'monthly'),
    girdi('/hazir-yazilim', 0.8, 'monthly'),
    girdi('/legal', 0.4, 'yearly'),
    girdi('/araclar', 0.8, 'monthly'),
    ...sayfalar,
    ...araclar,
    ...yasal,
    ...dnsSayfalari,
    ...yazilimlar,
    ...blog,
  ];
}
