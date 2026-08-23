import { notFound } from 'next/navigation';
import HazirYazilimDetay from '@/components/site/HazirYazilimDetay';
import { YAZILIMLAR } from '@/content/site/yazilimlar';
import { mutlakUrl } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return YAZILIMLAR.map((y) => ({ slug: y.id }));
}

const bul = (slug) => YAZILIMLAR.find((y) => y.id === slug) || null;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const u = bul(slug);
  if (!u) return {};
  const baslik = `${u.ad} — Hazır Yazılım`;
  const url = mutlakUrl(`/hazir-yazilim/${u.id}`);
  return {
    title: baslik,
    description: u.aciklama,
    alternates: { canonical: url },
    openGraph: { title: baslik, description: u.aciklama, images: [u.img], type: 'website', url },
    twitter: { card: 'summary_large_image', title: baslik, description: u.aciklama, images: [u.img] },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const u = bul(slug);
  if (!u) notFound();

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: u.ad,
    description: u.aciklama,
    image: mutlakUrl(u.img),
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
      <HazirYazilimDetay urun={u} />
    </>
  );
}
