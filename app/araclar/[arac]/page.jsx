import { notFound } from 'next/navigation';
import { ToolDetailPage } from '@/components/site/ToolsPage';
import { ARAC_LISTESI, aracBul } from '@/content/site/araclar';

export const dynamicParams = false;

export function generateStaticParams() {
  return ARAC_LISTESI.map((a) => ({ arac: a.slug }));
}

export async function generateMetadata({ params }) {
  const { arac: slug } = await params;
  const arac = aracBul(slug);
  if (!arac) return {};
  return { title: arac.baslik, description: arac.seo };
}

export default async function Page({ params }) {
  const { arac: slug } = await params;
  const arac = aracBul(slug);
  if (!arac) notFound();
  return <ToolDetailPage arac={arac} />;
}
