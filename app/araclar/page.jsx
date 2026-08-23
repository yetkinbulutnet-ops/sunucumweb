import { ToolsHubPage } from '@/components/site/ToolsPage';
import { ARACLAR_SAYFA } from '@/content/site/araclar';
import { sayfaMeta } from '@/lib/seo';

export const metadata = sayfaMeta({
  baslik: 'Ağ ve Alan Adı Araçları',
  aciklama: ARACLAR_SAYFA.lede,
  yol: '/araclar',
});

export default function Page() {
  return <ToolsHubPage />;
}
