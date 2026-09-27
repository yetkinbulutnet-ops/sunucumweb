import { notFound, permanentRedirect } from 'next/navigation';
import DnsToolPage from '@/components/site/DnsToolPage';
import { aracGetir, dnsTipGetir, metinAl } from '@/lib/cms';
import { dnsSorgulaOnbellekli } from '@/lib/dns-onbellek';
import { alanNormalle, gecerliHedef, tipNormalle, gecerliTip, dnsYolu } from '@/lib/dns-yol';
import { kanonik } from '@/lib/seo';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const revalidate = 900;
export const fetchCache = 'force-cache';

function coz(hamAlan, hamTip) {
  const tip = tipNormalle(hamTip);
  if (!gecerliTip(tip)) notFound();

  const alan = alanNormalle(hamAlan);
  if (!gecerliHedef(alan, tip)) notFound();

  if (alan !== String(hamAlan).toLowerCase() || String(hamTip) !== tip.toLowerCase()) {
    permanentRedirect(dnsYolu(alan, tip));
  }

  return { alan, tip };
}

export async function generateMetadata({ params }) {
  const { alan: hamAlan, tip: hamTip } = await params;
  const tip = tipNormalle(hamTip);
  const alan = alanNormalle(hamAlan);
  const bilgi = await dnsTipGetir(tip);
  if (!bilgi || !gecerliHedef(alan, tip)) return {};
  const m = await metinAl();

  return {
    title: m('dns.meta_tip_baslik', { alan, tip }),
    description: m('dns.meta_tip_aciklama', { alan, tip, ozet: bilgi.ozet }),
    alternates: kanonik(dnsYolu(alan, tip)),
  };
}

export default async function Page({ params }) {
  await sistemMetinHazirla();
  const { alan: hamAlan, tip: hamTip } = await params;
  const { alan, tip } = coz(hamAlan, hamTip);
  const sonuc = await dnsSorgulaOnbellekli(alan, tip);
  const m = await metinAl();

  return (
    <DnsToolPage
      arac={await aracGetir('dns')}
      alan={alan}
      tip={tip}
      veri={sonuc.ok ? sonuc.data : null}
      hata={sonuc.ok ? '' : m('dns.sorgu_hata')}
    />
  );
}
