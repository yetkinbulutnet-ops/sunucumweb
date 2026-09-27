import { BlogListe } from '@/components/site/Blog';
import { listeVerisi, listeMeta, sayfaNo, ilkSayfayaYonlendir, blogMetinleri } from '@/lib/blog-sayfa';

export const revalidate = 300;
export const dynamicParams = true;

export const generateStaticParams = () => [];

export async function generateMetadata({ params }) {
  const { sayfa } = await params;
  return listeMeta({ sayfa: Number(sayfa) || 1 });
}

export default async function Page({ params }) {
  const { sayfa: ham } = await params;
  const sayfa = await sayfaNo(ham);
  ilkSayfayaYonlendir(sayfa, '/blog');
  const v = await listeVerisi({ sayfa });
  const t = await blogMetinleri();
  return (
    <BlogListe
      {...v}
      aktifKategori={null}
      tabanYol="/blog"
      baslik={`${t.baslik} ${t.sayfaAyrac(sayfa)}`}
      aciklama={t.aciklama}
      yol={[{ ad: t.anaSayfa, yol: '/' }, { ad: t.baslik, yol: '/blog' }, { ad: t.sayfaN(sayfa), yol: `/blog/sayfa/${sayfa}` }]}
    />
  );
}
