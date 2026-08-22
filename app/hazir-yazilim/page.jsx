import HazirYazilimPage from '@/components/site/HazirYazilimPage';
import { YAZILIMLAR } from '@/content/site/yazilimlar';
import { mutlakUrl } from '@/lib/seo';

export const metadata = {
  title: 'Hazır Yazılımlar — Kuruluma Hazır Web Yazılımları | SunucumWEB',
  description:
    'E-ticaret, kurumsal tanıtım, blog, rezervasyon, eğitim ve daha fazlası. Mobil uyumlu, SEO dostu, kurulumu bize ait hazır web yazılımları SunucumWEB altyapısında yayında.',
  alternates: { canonical: mutlakUrl('/hazir-yazilim') },
};

function JsonLd() {
  const veri = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hazır Yazılımlar',
    itemListElement: YAZILIMLAR.map((y, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: y.ad,
        description: y.aciklama,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: y.fiyat, priceCurrency: 'TRY' },
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }} />;
}

export default function Page() {
  return (
    <>
      <JsonLd />
      <HazirYazilimPage />
    </>
  );
}
