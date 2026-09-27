import { BlogListe } from '@/components/site/Blog';
import { listeVerisi, listeMeta, blogMetinleri } from '@/lib/blog-sayfa';
import { blogKategorileri } from '@/lib/cms';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await blogKategorileri()).map((k) => ({ kategori: k.slug }));
}

export async function generateMetadata({ params }) {
  const { kategori } = await params;
  return listeMeta({ sayfa: 1, kategori });
}

export default async function Page({ params }) {
  const { kategori } = await params;
  const v = await listeVerisi({ sayfa: 1, kategori });
  const t = await blogMetinleri();
  return (
    <BlogListe
      {...v}
      aktifKategori={v.kat.slug}
      tabanYol={`/blog/kategori/${v.kat.slug}`}
      baslik={v.kat.ad}
      aciklama={v.kat.aciklama}
      yol={[{ ad: t.anaSayfa, yol: '/' }, { ad: t.baslik, yol: '/blog' }, { ad: v.kat.ad, yol: `/blog/kategori/${v.kat.slug}` }]}
    />
  );
}
