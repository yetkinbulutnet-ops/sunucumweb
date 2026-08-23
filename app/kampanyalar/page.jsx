import KampanyalarPage from '@/components/site/KampanyalarPage';
import { KAMPANYALAR } from '@/content/site/kampanyalar';
import { mutlakUrl } from '@/lib/seo';

export const metadata = {
  title: 'Kampanyalar — Hosting, Sunucu ve Alan Adı Fırsatları | SunucumWEB',
  description:
    'SunucumWEB güncel kampanyaları: hosting, sanal sunucu (VDS) ve alan adı hizmetlerinde sınırlı süreli indirimler. Kampanya kodunu sipariş sırasında girin.',
  alternates: { canonical: mutlakUrl('/kampanyalar') },
};

function JsonLd() {
  const veri = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kampanyalar',
    itemListElement: KAMPANYALAR.map((k, i) => ({
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }} />;
}

export default function Page() {
  return (
    <>
      <JsonLd />
      <KampanyalarPage />
    </>
  );
}
