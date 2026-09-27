import HazirYazilimPage from '@/components/site/HazirYazilimPage';
import { yazilimVerisi, sayfaMetinleri } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';
import SayfaMetni from '@/components/site/SayfaMetni';

export const revalidate = 300;

export async function generateMetadata() {
  const { hazirYazilim: m } = await sayfaMetinleri();
  return sayfaMeta({ baslik: m.seoBaslik, aciklama: m.seoAciklama, yol: '/hazir-yazilim' });
}

function JsonLd({ yazilimlar }) {
  const veri = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hazır Yazılımlar',
    itemListElement: yazilimlar.map((y, i) => ({
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

export default async function Page() {
  const [{ yazilimlar, kategoriler }, metinler] = await Promise.all([yazilimVerisi(), sayfaMetinleri()]);
  return (
    <>
      <JsonLd yazilimlar={yazilimlar} />
      <SayfaMetni onekler={['yazilim']}>
        <HazirYazilimPage yazilimlar={yazilimlar} kategoriler={kategoriler} seridi={metinler.hazirYazilim} />
      </SayfaMetni>
    </>
  );
}
