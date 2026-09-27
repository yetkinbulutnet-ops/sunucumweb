import { ToolsHubPage } from '@/components/site/ToolsPage';
import { sayfaMetinleri } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata() {
  const { araclar: m } = await sayfaMetinleri();
  return sayfaMeta({ baslik: m.seoBaslik, aciklama: m.seoAciklama, yol: '/araclar' });
}

export default function Page() {
  return <ToolsHubPage />;
}
