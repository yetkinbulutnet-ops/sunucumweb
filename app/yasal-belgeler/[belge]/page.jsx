import { notFound, permanentRedirect } from 'next/navigation';
import { marked } from 'marked';
import YasalBelgePage from '@/components/site/YasalBelgePage';
import { ticariBilgiler } from '@/lib/cms';
import { belgeBul, belgeYolu, eskiBelge, tumBelgeler } from '@/lib/yasal';
import { sayfaMeta, SITE_URL } from '@/lib/seo';
import { htmlTemizle } from '@/lib/html-temizle';

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  return (await tumBelgeler()).map((b) => ({ belge: b.slug }));
}

export async function generateMetadata({ params }) {
  const { belge: slug } = await params;
  const belge = await belgeBul(slug);
  if (!belge) return {};
  return sayfaMeta({ baslik: belge.baslik, aciklama: belge.seo, yol: belgeYolu(belge.slug) });
}

export default async function Page({ params }) {
  const { belge: slug } = await params;
  const belge = await belgeBul(slug);
  if (!belge) {
    const hedef = await eskiBelge(slug);
    if (hedef) permanentRedirect(belgeYolu(hedef));
    notFound();
  }

  const html = belge.icerik
    ? htmlTemizle(marked.parse(belge.icerik, { gfm: true, breaks: false }).replace(/<table>/g, '<div class="blog-tablo"><table>').replace(/<\/table>/g, '</table></div>'))
    : '';
  const [liste, t] = await Promise.all([tumBelgeler(), ticariBilgiler()]);
  return <YasalBelgePage belge={belge} html={html} belgeler={liste} ticari={t.ticari} site={SITE_URL.replace(/^https?:\/\//, '')} />;
}
