import { BlogListe } from '@/components/site/Blog';
import { listeVerisi, listeMeta, sayfaNo, ilkSayfayaYonlendir, blogMetinleri } from '@/lib/blog-sayfa';

export const revalidate = 300;
export const dynamicParams = true;

export const generateStaticParams = () => [];

export async function generateMetadata({ params }) {
  const { kategori, sayfa } = await params;
  return listeMeta({ sayfa: Number(sayfa) || 1, kategori });
}

export default async function Page({ params }) {
  const { kategori, sayfa: ham } = await params;
  const sayfa = await sayfaNo(ham);
  ilkSayfayaYonlendir(sayfa, `/blog/kategori/${kategori}`);
  const v = await listeVerisi({ sayfa, kategori });
  const taban = `/blog/kategori/${v.kat.slug}`;
  const t = await blogMetinleri();
  return (
    <BlogListe
      {...v}
      aktifKategori={v.kat.slug}
      tabanYol={taban}
      baslik={`${v.kat.ad} ${t.sayfaAyrac(sayfa)}`}
      aciklama={v.kat.aciklama}
      yol={[{ ad: t.anaSayfa, yol: '/' }, { ad: t.baslik, yol: '/blog' }, { ad: v.kat.ad, yol: taban }, { ad: t.sayfaN(sayfa), yol: `${taban}/sayfa/${sayfa}` }]}
    />
  );
}
