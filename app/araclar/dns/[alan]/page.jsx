import { notFound, permanentRedirect } from 'next/navigation';
import DnsToolPage from '@/components/site/DnsToolPage';
import { aracGetir, metinAl } from '@/lib/cms';
import { dnsSorgulaOnbellekli } from '@/lib/dns-onbellek';
import { alanNormalle, gecerliAlan, dnsYolu } from '@/lib/dns-yol';
import { kanonik } from '@/lib/seo';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const revalidate = 900;
export const fetchCache = 'force-cache';

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
  const m = await metinAl();

  return {
    title: m('dns.meta_alan_baslik', { alan }),
    description: m('dns.meta_alan_aciklama', { alan }),
    alternates: kanonik(dnsYolu(alan)),
  };
}

export default async function Page({ params }) {
  await sistemMetinHazirla();
  const { alan: ham } = await params;
  const alan = alanCoz(ham);
  const sonuc = await dnsSorgulaOnbellekli(alan, 'TUM');
  const m = await metinAl();

  return (
    <DnsToolPage
      arac={await aracGetir('dns')}
      alan={alan}
      veri={sonuc.ok ? sonuc.data : null}
      hata={sonuc.ok ? '' : m('dns.sorgu_hata')}
    />
  );
}
