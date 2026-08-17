import { ToolsHubPage } from '@/components/site/ToolsPage';
import { ARACLAR_SAYFA } from '@/content/site/araclar';

export const metadata = {
  title: 'Ağ ve Alan Adı Araçları',
  description: ARACLAR_SAYFA.lede,
};

export default function Page() {
  return <ToolsHubPage />;
}
