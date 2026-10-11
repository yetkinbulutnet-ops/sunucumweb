import KampanyalarPage from '@/components/site/KampanyalarPage';
import { kampanyalariGetir, sayfaMetinleri } from '@/lib/cms';
import { mutlakUrl, sayfaMeta } from '@/lib/seo';
import SayfaMetni from '@/components/site/SayfaMetni';
import { jsonLdMetni } from '@/lib/json-ld';

export const revalidate = 300;

export async function generateMetadata() {
  const { kampanyalar: m } = await sayfaMetinleri();
  return sayfaMeta({ baslik: m.seoBaslik, aciklama: m.seoAciklama, yol: '/kampanyalar' });
}

function JsonLd({ kampanyalar }) {
  const veri = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kampanyalar',
    itemListElement: kampanyalar.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Offer',
        name: k.baslik,
        description: k.aciklama,
        category: k.kategori,
        price: k.yeniFiyat,
        priceCurrency: 'TRY',
        url: mutlakUrl(k.href),
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdMetni(veri) }} />;
}

export default async function Page() {
  const [kampanyalar, metinler] = await Promise.all([kampanyalariGetir(), sayfaMetinleri()]);
  return (
    <>
      <JsonLd kampanyalar={kampanyalar} />
      <SayfaMetni onekler={['kampanya']}>
        <KampanyalarPage kampanyalar={kampanyalar} meta={metinler.kampanyalar} />
      </SayfaMetni>
    </>
  );
}
