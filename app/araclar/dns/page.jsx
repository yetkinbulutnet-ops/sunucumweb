import DnsToolPage from '@/components/site/DnsToolPage';
import { aracBul } from '@/content/site/araclar';
import { kanonik } from '@/lib/seo';

const ARAC = aracBul('dns');

export const metadata = {
  title: 'DNS Kayıt Sorgulama — A, AAAA, MX, NS, TXT, CAA',
  description:
    'Alan adının DNS kayıtlarını dokuz farklı genel çözümleyiciden canlı sorgulayın. Kayıt tipini seçin, değerleri ve yayılım durumunu anında görün.',
  alternates: kanonik('/araclar/dns'),
};

export default function Page() {
  return <DnsToolPage arac={ARAC} />;
}
