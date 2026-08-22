import parse from 'html-react-parser';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import {
  getManifest, getPageHtml, getPageScripts, pageBySlug,
  getStandaloneHtml, getStandaloneCss, getStandaloneScripts,
} from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageScripts from '@/components/PageScripts';
import HomePage from '@/components/site/HomePage';
import ProductPage from '@/components/site/ProductPage';
import YapimAsamasi from '@/components/site/YapimAsamasi';
import ContactPage from '@/components/site/ContactPage';
import DomainPage from '@/components/site/DomainPage';
import AboutPage from '@/components/site/AboutPage';
import { HAKKIMIZDA } from '@/content/site/hakkimizda';
import { PRODUCTS } from '@/content/site/products';

export const dynamicParams = false;

const YAPIM_ASAMASI = new Set(['isp-sunucu', 'abd-sunucu']);

const YONLENDIRILEN = [
  'ticari-bilgiler',
  'sozlesmeler',
  'whois',
  'kullanim-kosullari',
  'gizlilik-sozlesmesi',
  'iade-politikasi',
  'kullanim-politikasi',
];

export function generateStaticParams() {
  const manifestten = getManifest()
    .pages.filter((p) => !YONLENDIRILEN.includes(p.slug))
    .map((p) => ({ slug: p.slug === 'index' ? [] : [p.slug] }));
  return manifestten;
}

const slugFrom = (parts) => (parts && parts.length ? parts[0] : 'index');

export async function generateMetadata({ params }) {
  const { slug: parts } = await params;
  const slug = slugFrom(parts);
  const p = pageBySlug(slug);
  if (!p) return {};
  if (slug === 'hakkimizda') {
    return { title: HAKKIMIZDA.seo.title, description: HAKKIMIZDA.seo.description };
  }
  if (YAPIM_ASAMASI.has(slug)) {
    const t = PRODUCTS[slug]?.title || p.title;
    return {
      title: t ? `${t} — Çok Yakında` : undefined,
      description: p.description || undefined,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: p.title || undefined,
    description: p.description || undefined,
    alternates: p.canonical ? { canonical: p.canonical } : undefined,
  };
}

function JsonLd({ items }) {
  return (items || []).map((j, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: j }} />
  ));
}

export default async function Page({ params }) {
  const { slug: parts } = await params;
  const slug = slugFrom(parts);

  const meta = pageBySlug(slug);
  if (!meta) notFound();

  if (slug === 'index') {
    return <HomePage />;
  }

  if (YAPIM_ASAMASI.has(slug)) {
    return <YapimAsamasi baslik={PRODUCTS[slug]?.title || meta.title} />;
  }

  if (PRODUCTS[slug]) {
    return <ProductPage data={PRODUCTS[slug]} slug={slug} />;
  }

  if (slug === 'iletisim') {
    return <ContactPage />;
  }

  if (slug === 'hakkimizda') {
    return <AboutPage />;
  }

  if (slug === 'alan-adi') return <DomainPage mode="register" />;
  if (slug === 'transfer') return <DomainPage mode="transfer" />;

  if (meta.standalone) {
    const html = getStandaloneHtml(slug);
    if (html === null) notFound();
    const css = getStandaloneCss(slug);
    const scripts = getStandaloneScripts(slug);
    return (
      <>
        {(meta.headCss || []).map((h) => (
          <link key={h} rel="stylesheet" href={h} />
        ))}
        {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
        <JsonLd items={meta.jsonld} />
        {parse(html)}
        {(meta.headJs || []).map((s) => (
          <Script key={s} src={s} strategy="afterInteractive" />
        ))}
        <PageScripts code={scripts || ''} />
      </>
    );
  }

  const html = getPageHtml(slug);
  if (html === null) notFound();
  const scripts = getPageScripts(slug);
  return (
    <>
      <Header />
      <JsonLd items={meta.jsonld} />
      {parse(html)}
      <Footer />
      <PageScripts code={scripts || ''} />
    </>
  );
}
