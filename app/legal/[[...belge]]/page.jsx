import { notFound } from 'next/navigation';
import LegalHubPage from '@/components/site/LegalHubPage';
import { LEGAL_BELGELER, belgeBul } from '@/content/site/legal';
import { getLegalHtml } from '@/lib/content';
import { sayfaMeta } from '@/lib/seo';

export const dynamicParams = false;

const VARSAYILAN = LEGAL_BELGELER[0];

export function generateStaticParams() {
  return [{ belge: [] }, ...LEGAL_BELGELER.slice(1).map((b) => ({ belge: [b.slug] }))];
}

const secilen = (parcalar) => (parcalar && parcalar.length ? belgeBul(parcalar[0]) : VARSAYILAN);

export async function generateMetadata({ params }) {
  const { belge: parcalar } = await params;
  const belge = secilen(parcalar);
  if (!belge) return {};

  const kok = belge.slug === VARSAYILAN.slug;

  return sayfaMeta({
    baslik: belge.baslik,
    aciklama: belge.seo,
    yol: kok ? '/legal' : `/legal/${belge.slug}`,
  });
}

export default async function Page({ params }) {
  const { belge: parcalar } = await params;
  const belge = secilen(parcalar);
  if (!belge) notFound();

  return <LegalHubPage belge={belge} html={getLegalHtml(belge.slug)} />;
}
