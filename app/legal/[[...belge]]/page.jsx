import { notFound } from 'next/navigation';
import { marked } from 'marked';
import LegalHubPage from '@/components/site/LegalHubPage';
import { yasalBelgeleriGetir, ticariBilgiler, sayfaMetinleri } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';
import { htmlTemizle } from '@/lib/html-temizle';

export const dynamicParams = true;
export const revalidate = 300;

const belgeler = async () => [(await ticariBilgiler()).belge, ...(await yasalBelgeleriGetir())];

export async function generateStaticParams() {
  const liste = await yasalBelgeleriGetir();
  return [{ belge: [] }, ...liste.map((b) => ({ belge: [b.slug] }))];
}

const secilen = async (parcalar) => {
  if (!parcalar || !parcalar.length) return (await ticariBilgiler()).belge;
  if (parcalar.length > 1) return null;
  return (await yasalBelgeleriGetir()).find((b) => b.slug === parcalar[0]) || null;
};

export async function generateMetadata({ params }) {
  const { belge: parcalar } = await params;
  const belge = await secilen(parcalar);
  if (!belge) return {};

  const kok = belge.tur === 'ticari';

  return sayfaMeta({
    baslik: belge.baslik,
    aciklama: belge.seo,
    yol: kok ? '/legal' : `/legal/${belge.slug}`,
  });
}

export default async function Page({ params }) {
  const { belge: parcalar } = await params;
  const belge = await secilen(parcalar);
  if (!belge) notFound();

  const html = belge.icerik ? htmlTemizle(marked.parse(belge.icerik, { gfm: true, breaks: false })) : '';
  const [liste, t, metinler] = await Promise.all([belgeler(), ticariBilgiler(), sayfaMetinleri()]);
  return <LegalHubPage belge={belge} html={html} belgeler={liste} metin={metinler.legal} ticari={t.ticari} />;
}
