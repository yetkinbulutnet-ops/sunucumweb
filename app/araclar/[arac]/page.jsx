import { notFound } from 'next/navigation';
import { ToolDetailPage } from '@/components/site/ToolsPage';
import { araclariGetir, aracGetir } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';

export const dynamicParams = true;

export const revalidate = 300;

export async function generateStaticParams() {
  return (await araclariGetir()).filter((a) => a.slug !== 'dns' && a.slug !== 'hiz-testi').map((a) => ({ arac: a.slug }));
}

export async function generateMetadata({ params }) {
  const { arac: slug } = await params;
  const arac = await aracGetir(slug);
  if (!arac || arac.slug === 'dns' || arac.slug === 'hiz-testi') return {};
  return sayfaMeta({ baslik: arac.baslik, aciklama: arac.seo, yol: `/araclar/${slug}` });
}

export default async function Page({ params }) {
  const { arac: slug } = await params;
  const arac = await aracGetir(slug);
  if (!arac || arac.slug === 'dns' || arac.slug === 'hiz-testi') notFound();
  return <ToolDetailPage arac={arac} />;
}
