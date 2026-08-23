import { getManifest } from '@/lib/content';
import { ARAC_LISTESI } from '@/content/site/araclar';
import { LEGAL_BELGELER } from '@/content/site/legal';
import { DNS_TIP_KODLARI } from '@/content/site/dns-tipleri';
import { YAZILIMLAR } from '@/content/site/yazilimlar';
import { mutlakUrl } from '@/lib/seo';
import { dnsYolu } from '@/lib/dns-yol';

export const dynamic = 'force-static';

const YONLENDIRILEN = ['ticari-bilgiler', 'sozlesmeler', 'whois', 'isp-sunucu', 'abd-sunucu'];
const ORNEK_ALANLAR = ['sunucumweb.com'];

const SON_GUNCELLEME = new Date('2026-08-24');

const girdi = (yol, oncelik, siklik) => ({
  url: mutlakUrl(yol),
  lastModified: SON_GUNCELLEME,
  changeFrequency: siklik,
  priority: oncelik,
});

export default function sitemap() {
  const sayfalar = getManifest()
    .pages.filter((p) => !YONLENDIRILEN.includes(p.slug) && p.slug !== 'index')
    .map((p) => girdi(`/${p.slug}`, 0.8, 'monthly'));

  const araclar = ARAC_LISTESI.map((a) => girdi(`/araclar/${a.slug}`, 0.7, 'monthly'));

  const yasal = LEGAL_BELGELER.slice(1).map((b) => girdi(`/legal/${b.slug}`, 0.3, 'yearly'));

  const dnsSayfalari = ORNEK_ALANLAR.flatMap((alan) => [
    girdi(dnsYolu(alan), 0.5, 'weekly'),
    ...DNS_TIP_KODLARI.map((t) => girdi(dnsYolu(alan, t), 0.4, 'weekly')),
  ]);

  const yazilimlar = YAZILIMLAR.map((y) => girdi(`/hazir-yazilim/${y.id}`, 0.7, 'monthly'));

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
  ];
}
