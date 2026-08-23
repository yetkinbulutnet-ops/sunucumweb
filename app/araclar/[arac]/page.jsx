import { notFound } from 'next/navigation';
import { ToolDetailPage } from '@/components/site/ToolsPage';
import { ARAC_LISTESI, aracBul } from '@/content/site/araclar';
import { sayfaMeta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return ARAC_LISTESI.filter((a) => a.slug !== 'dns').map((a) => ({ arac: a.slug }));
}

export async function generateMetadata({ params }) {
  const { arac: slug } = await params;
  const arac = aracBul(slug);
  if (!arac) return {};
  return sayfaMeta({ baslik: arac.baslik, aciklama: arac.seo, yol: `/araclar/${slug}` });
}

export default async function Page({ params }) {
  const { arac: slug } = await params;
  const arac = aracBul(slug);
  if (!arac) notFound();
  return <ToolDetailPage arac={arac} />;
}
