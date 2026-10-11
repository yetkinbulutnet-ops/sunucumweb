import BankaHesaplariPage from '@/components/site/BankaHesaplariPage';
import { bankaSayfasi, metinAl } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata() {
  const [v, m] = await Promise.all([bankaSayfasi(), metinAl()]);
  return sayfaMeta({ baslik: v.ust.seoBaslik || m('banka.baslik'), aciklama: v.ust.seoAciklama, yol: '/banka-hesaplari' });
}

export default async function Page() {
  return <BankaHesaplariPage veri={await bankaSayfasi()} />;
}
