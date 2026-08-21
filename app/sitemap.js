import { getManifest } from '@/lib/content';
import { ARAC_LISTESI } from '@/content/site/araclar';
import { DNS_TIP_KODLARI } from '@/content/site/dns-tipleri';
import { mutlakUrl } from '@/lib/seo';
import { dnsYolu } from '@/lib/dns-yol';

export const dynamic = 'force-static';

const YONLENDIRILEN = ['ticari-bilgiler', 'sozlesmeler', 'whois'];
const ORNEK_ALANLAR = ['sunucumweb.com'];

const girdi = (yol, oncelik, siklik) => ({
  url: mutlakUrl(yol),
  changeFrequency: siklik,
  priority: oncelik,
});

export default function sitemap() {
  const sayfalar = getManifest()
    .pages.filter((p) => !YONLENDIRILEN.includes(p.slug) && p.slug !== 'index')
    .map((p) => girdi(`/${p.slug}`, 0.8, 'monthly'));

  const araclar = ARAC_LISTESI.map((a) => girdi(`/araclar/${a.slug}`, 0.7, 'monthly'));

  const dnsSayfalari = ORNEK_ALANLAR.flatMap((alan) => [
    girdi(dnsYolu(alan), 0.5, 'weekly'),
    ...DNS_TIP_KODLARI.map((t) => girdi(dnsYolu(alan, t), 0.4, 'weekly')),
  ]);

  return [
    girdi('/', 1, 'weekly'),
    girdi('/legal', 0.4, 'yearly'),
    girdi('/araclar', 0.8, 'monthly'),
    ...sayfalar,
    ...araclar,
    ...dnsSayfalari,
  ];
}
