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
import LegalPage from '@/components/site/LegalPage';
import ContactPage from '@/components/site/ContactPage';
import DomainPage from '@/components/site/DomainPage';
import { PRODUCTS } from '@/content/site/products';
import { getLegalHtml } from '@/lib/content';

const LEGAL = {
  'kullanim-kosullari': { title: 'Kullanım Koşulları', eyebrow: 'Yasal' },
  'gizlilik-sozlesmesi': { title: 'Gizlilik Sözleşmesi', eyebrow: 'Yasal' },
  'iade-politikasi': { title: 'İade Politikası', eyebrow: 'Yasal' },
  'kullanim-politikasi': { title: 'Kullanım Politikası', eyebrow: 'Yasal' },
  'ticari-bilgiler': { title: 'Ticari Bilgiler', eyebrow: 'Kurumsal' },
  'hakkimizda': { title: 'Hakkımızda', eyebrow: 'Kurumsal' },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getManifest().pages.map((p) => ({
    slug: p.slug === 'index' ? [] : [p.slug],
  }));
}

const slugFrom = (parts) => (parts && parts.length ? parts[0] : 'index');

export async function generateMetadata({ params }) {
  const { slug: parts } = await params;
  const p = pageBySlug(slugFrom(parts));
  if (!p) return {};
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

  // --- YENI modern ana sayfa (tamamen yeni tasarim) ---
  if (slug === 'index') {
    return <HomePage />;
  }

  // --- YENI urun sayfalari (12 adet, tek template) ---
  if (PRODUCTS[slug]) {
    return <ProductPage data={PRODUCTS[slug]} />;
  }

  // --- YENI iletisim sayfasi ---
  if (slug === 'iletisim') {
    return <ContactPage />;
  }

  // --- YENI alan adi / transfer / whois (temiz tasarim, arama WiseCP paneline gider) ---
  if (slug === 'alan-adi') return <DomainPage mode="register" />;
  if (slug === 'transfer') return <DomainPage mode="transfer" />;
  if (slug === 'whois') return <DomainPage mode="whois" />;

  // --- YENI legal + kurumsal sayfalar (gercek metinle, temiz prose) ---
  if (LEGAL[slug]) {
    return <LegalPage title={LEGAL[slug].title} eyebrow={LEGAL[slug].eyebrow} html={getLegalHtml(slug)} />;
  }

  // --- Standalone (WiseCP panel) sayfalar: kendi head CSS/JS'i, paylasimli chrome YOK ---
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

  // --- Normal sayfalar: ortak Header + icerik + Footer ---
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
