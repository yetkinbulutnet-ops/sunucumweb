import { notFound } from 'next/navigation';
import LegalHubPage from '@/components/site/LegalHubPage';
import { LEGAL, LEGAL_BELGELER, belgeBul } from '@/content/site/legal';
import { getLegalHtml } from '@/lib/content';
import { kanonik } from '@/lib/seo';

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

  return {
    title: kok ? LEGAL.seo.title : belge.baslik,
    description: kok ? LEGAL.seo.description : belge.seo,
    alternates: kanonik(kok ? '/legal' : `/legal/${belge.slug}`),
  };
}

export default async function Page({ params }) {
  const { belge: parcalar } = await params;
  const belge = secilen(parcalar);
  if (!belge) notFound();

  return <LegalHubPage belge={belge} html={getLegalHtml(belge.slug)} />;
}
