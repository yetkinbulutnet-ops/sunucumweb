import DnsToolPage from '@/components/site/DnsToolPage';
import { aracGetir, metinAl } from '@/lib/cms';
import { kanonik } from '@/lib/seo';

export async function generateMetadata() {
  const m = await metinAl();
  return {
    title: m('dns.meta_baslik'),
    description: m('dns.meta_aciklama'),
    alternates: kanonik('/araclar/dns'),
  };
}

export const revalidate = 300;

export default async function Page() {
  return <DnsToolPage arac={await aracGetir('dns')} />;
}
