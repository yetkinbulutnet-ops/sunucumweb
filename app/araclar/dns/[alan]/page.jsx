import { notFound, permanentRedirect } from 'next/navigation';
import DnsToolPage from '@/components/site/DnsToolPage';
import { aracBul } from '@/content/site/araclar';
import { dnsSorgulaOnbellekli } from '@/lib/dns-onbellek';
import { alanNormalle, gecerliAlan, dnsYolu } from '@/lib/dns-yol';
import { kanonik } from '@/lib/seo';

export const revalidate = 900;
export const fetchCache = 'force-cache';

const ARAC = aracBul('dns');

function alanCoz(ham) {
  const alan = alanNormalle(ham);
  if (!gecerliAlan(alan)) notFound();
  if (alan !== String(ham).toLowerCase()) permanentRedirect(dnsYolu(alan));
  return alan;
}

export async function generateMetadata({ params }) {
  const { alan: ham } = await params;
  const alan = alanNormalle(ham);
  if (!gecerliAlan(alan)) return {};

  return {
    title: `${alan} DNS kayıtları — A, MX, NS, TXT sorgulama`,
    description: `${alan} alan adının A, AAAA, MX, NS, TXT, SOA ve CAA kayıtlarını canlı sorgulayın. Değerleri, TTL sürelerini ve dünya genelindeki yayılım durumunu tek sayfada görün.`,
    alternates: kanonik(dnsYolu(alan)),
  };
}

export default async function Page({ params }) {
  const { alan: ham } = await params;
  const alan = alanCoz(ham);
  const sonuc = await dnsSorgulaOnbellekli(alan, 'TUM');

  return (
    <DnsToolPage
      arac={ARAC}
      alan={alan}
      veri={sonuc.ok ? sonuc.data : null}
      hata={sonuc.ok ? '' : 'Sorgu şu anda tamamlanamadı. Birkaç saniye sonra tekrar deneyin.'}
    />
  );
}
