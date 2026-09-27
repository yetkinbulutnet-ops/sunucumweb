import { BlogListe } from '@/components/site/Blog';
import { listeVerisi, listeMeta, blogMetinleri } from '@/lib/blog-sayfa';

export const revalidate = 300;

export const generateMetadata = () => listeMeta({ sayfa: 1 });

export default async function Page() {
  const v = await listeVerisi({ sayfa: 1 });
  const t = await blogMetinleri();
  return (
    <BlogListe
      {...v}
      aktifKategori={null}
      tabanYol="/blog"
      baslik={t.baslik}
      aciklama={t.aciklama}
      yol={[{ ad: t.anaSayfa, yol: '/' }, { ad: t.baslik, yol: '/blog' }]}
    />
  );
}
