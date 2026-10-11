import YasalHubPage from '@/components/site/YasalHubPage';
import { sayfaMetinleri, ticariBilgiler } from '@/lib/cms';
import { tumBelgeler } from '@/lib/yasal';
import { sayfaMeta } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata() {
  const { legal } = await sayfaMetinleri();
  return sayfaMeta({ baslik: legal.seoBaslik, aciklama: legal.seoAciklama, yol: '/yasal-belgeler' });
}

export default async function Page() {
  const [metinler, belgeler, t] = await Promise.all([sayfaMetinleri(), tumBelgeler(), ticariBilgiler()]);
  const eposta = t.ticari.epostalar[0]?.[1] || '';
  return <YasalHubPage ust={metinler.legal} belgeler={belgeler} sss={metinler.yasalSss} eposta={eposta} />;
}
