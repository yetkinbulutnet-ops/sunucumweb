import { notFound, permanentRedirect } from 'next/navigation';
import DnsToolPage from '@/components/site/DnsToolPage';
import { aracBul } from '@/content/site/araclar';
import { dnsSorgulaOnbellekli } from '@/lib/dns-onbellek';
import { dnsTipBul } from '@/content/site/dns-tipleri';
import { alanNormalle, gecerliHedef, tipNormalle, gecerliTip, dnsYolu } from '@/lib/dns-yol';
import { kanonik } from '@/lib/seo';

export const revalidate = 900;
export const fetchCache = 'force-cache';

const ARAC = aracBul('dns');

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
  const bilgi = dnsTipBul(tip);
  if (!bilgi || !gecerliHedef(alan, tip)) return {};

  return {
    title: `${alan} ${tip} kayıtları — DNS sorgulama`,
    description: `${alan} alan adının ${tip} kayıtlarını dokuz farklı DNS çözümleyicisinden canlı sorgulayın. ${bilgi.ozet} Değerleri, TTL sürelerini ve yayılım durumunu görün.`,
    alternates: kanonik(dnsYolu(alan, tip)),
  };
}

export default async function Page({ params }) {
  const { alan: hamAlan, tip: hamTip } = await params;
  const { alan, tip } = coz(hamAlan, hamTip);
  const sonuc = await dnsSorgulaOnbellekli(alan, tip);

  return (
    <DnsToolPage
      arac={ARAC}
      alan={alan}
      tip={tip}
      veri={sonuc.ok ? sonuc.data : null}
      hata={sonuc.ok ? '' : 'Sorgu şu anda tamamlanamadı. Birkaç saniye sonra tekrar deneyin.'}
    />
  );
}
