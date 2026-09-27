import { notFound } from 'next/navigation';
import { getManifest, pageBySlug } from '@/lib/content';
import ProductPage from '@/components/site/ProductPage';
import YapimAsamasi from '@/components/site/YapimAsamasi';
import ContactPage from '@/components/site/ContactPage';
import DomainPage from '@/components/site/DomainPage';
import AboutPage from '@/components/site/AboutPage';
import { urunleriGetir, urunGetir, hakkimizdaGetir, markalariGetir, sayfaMetinleri, iletisimVerisi, siteAyarlari, urunSayfasiOrtak, alanAdiSayfasi, ticariBilgiler, metinAl } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';
import SayfaMetni from '@/components/site/SayfaMetni';

export const dynamicParams = true;
export const revalidate = 300;

const YONLENDIRILEN = [
  'ticari-bilgiler',
  'sozlesmeler',
  'whois',
  'kullanim-kosullari',
  'gizlilik-sozlesmesi',
  'iade-politikasi',
  'kullanim-politikasi',
];

export async function generateStaticParams() {
  const slugs = new Set(getManifest().pages.map((p) => p.slug).filter((s) => !YONLENDIRILEN.includes(s)));
  for (const s of Object.keys(await urunleriGetir())) slugs.add(s);
  slugs.delete('index');
  return [...slugs].map((s) => ({ slug: s }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = pageBySlug(slug);
  const pr = await urunGetir(slug);
  if (!p && !pr) return {};
  if (slug === 'hakkimizda') {
    const h = await hakkimizdaGetir();
    return sayfaMeta({ baslik: h.seo.title, aciklama: h.seo.description, yol: '/hakkimizda' });
  }
  if (pr?.durum === 'yapim-asamasi') {
    return {
      title: (await metinAl())('yapim.meta_baslik', { ad: pr.title }),
      description: pr.seoAciklama || pr.subtitle || undefined,
      robots: { index: false, follow: true },
    };
  }
  return sayfaMeta({
    baslik: (pr && (pr.seoBaslik || pr.title)) || p?.title || undefined,
    aciklama: pr ? pr.seoAciklama || pr.subtitle : (p?.description || undefined),
    yol: `/${slug}`,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;

  const urun = await urunGetir(slug);
  if (urun) {
    if (urun.durum === 'yapim-asamasi') return <YapimAsamasi baslik={urun.title} />;
    return (
      <SayfaMetni onekler={['urun']}>
        <ProductPage data={urun} slug={slug} ortak={await urunSayfasiOrtak()} />
      </SayfaMetni>
    );
  }

  const meta = pageBySlug(slug);
  if (!meta) notFound();

  if (slug === 'iletisim') {
    return (
      <SayfaMetni onekler={['iletisim']}>
        <ContactPage veri={await iletisimVerisi()} />
      </SayfaMetni>
    );
  }

  if (slug === 'hakkimizda') {
    const [veri, markalar, metinler, ayar, ticari] = await Promise.all([hakkimizdaGetir(), markalariGetir(), sayfaMetinleri(), siteAyarlari(), ticariBilgiler()]);
    const resmiUnvan = ticari.ticari.bilgiler.find(([etiket]) => etiket === 'Şirket ünvanı')?.[1] || ayar.firma.unvan;
    return (
      <SayfaMetni onekler={['hakkimizda_vm']}>
        <AboutPage veri={veri} markalar={markalar} markaSeridi={metinler.markalar} ayar={ayar} resmiUnvan={resmiUnvan} />
      </SayfaMetni>
    );
  }

  if (slug === 'alan-adi' || slug === 'transfer') {
    return (
      <SayfaMetni onekler={['alanadi', 'alanadiai']}>
        <DomainPage mode={slug === 'alan-adi' ? 'register' : 'transfer'} veri={await alanAdiSayfasi()} />
      </SayfaMetni>
    );
  }

  notFound();
}
