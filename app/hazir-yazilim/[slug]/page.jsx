import { notFound } from 'next/navigation';
import HazirYazilimDetay from '@/components/site/HazirYazilimDetay';
import { yazilimVerisi, metinAl } from '@/lib/cms';
import { mutlakUrl } from '@/lib/seo';
import SayfaMetni from '@/components/site/SayfaMetni';

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const { yazilimlar } = await yazilimVerisi();
  return yazilimlar.map((y) => ({ slug: y.id }));
}

const bul = async (slug) => (await yazilimVerisi()).yazilimlar.find((y) => y.id === slug) || null;

const gorselUrl = (img) => (img && /^https?:/.test(img) ? img : mutlakUrl(img || '/'));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const u = await bul(slug);
  if (!u) return {};
  const m = await metinAl();
  const baslik = m('yazilim.meta_baslik', { ad: u.ad });
  const url = mutlakUrl(`/hazir-yazilim/${u.id}`);
  return {
    title: baslik,
    description: u.aciklama,
    alternates: { canonical: url },
    openGraph: { title: baslik, description: u.aciklama, images: [gorselUrl(u.img)], type: 'website', url },
    twitter: { card: 'summary_large_image', title: baslik, description: u.aciklama, images: [gorselUrl(u.img)] },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const veri = await yazilimVerisi();
  const u = veri.yazilimlar.find((y) => y.id === slug) || null;
  if (!u) notFound();

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: u.ad,
    description: u.aciklama,
    image: gorselUrl(u.img),
    offers: {
      '@type': 'Offer',
      price: u.fiyat,
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
      url: mutlakUrl(`/hazir-yazilim/${u.id}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <SayfaMetni onekler={['yazilim']}>
        <HazirYazilimDetay urun={u} yazilimlar={veri.yazilimlar} kategoriler={veri.kategoriler} />
      </SayfaMetni>
    </>
  );
}
