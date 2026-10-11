import { notFound } from 'next/navigation';
import { BlogDetay } from '@/components/site/Blog';
import { blogYazisi, tumBlogYazilari } from '@/lib/cms';
import { makaleIsle } from '@/lib/blog';
import { sayfaMeta } from '@/lib/seo';

export const revalidate = 300;
export const dynamicParams = true;

const SLUG_RE = /^[a-z0-9-]{1,120}$/;

const yaziGetir = async (slug) => {
  if (!SLUG_RE.test(String(slug || ''))) return null;
  if (!(await tumBlogYazilari()).some((y) => y.slug === slug)) return null;
  return blogYazisi(slug);
};

export async function generateStaticParams() {
  return (await tumBlogYazilari()).map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const y = await yaziGetir(slug);
  if (!y) return {};
  const meta = sayfaMeta({
    baslik: y.seoBaslik || y.baslik,
    aciklama: y.seoAciklama || y.ozet,
    yol: `/blog/${y.slug}`,
    ogGorsel: y.kapak?.url || undefined,
    tip: 'article',
  });
  meta.openGraph = {
    ...meta.openGraph,
    publishedTime: y.tarih,
    modifiedTime: y.guncelleme || y.tarih,
    ...(y.kategori ? { section: y.kategori.ad } : {}),
    ...(y.etiketler.length ? { tags: y.etiketler } : {}),
    authors: [y.yazar?.ad || 'SunucumWEB Ekibi'],
  };
  return meta;
}

export default async function Page({ params }) {
  const { slug } = await params;
  const yazi = await yaziGetir(slug);
  if (!yazi) notFound();
  const hepsi = await tumBlogYazilari();
  const digerleri = hepsi.filter((y) => y.slug !== yazi.slug);
  const ayniKategori = yazi.kategori ? digerleri.filter((y) => y.kategori?.slug === yazi.kategori.slug) : [];
  const ilgili = [...ayniKategori, ...digerleri.filter((y) => !ayniKategori.includes(y))].slice(0, 3);
  return <BlogDetay yazi={yazi} islenmis={makaleIsle(yazi.icerik)} ilgili={ilgili} />;
}
