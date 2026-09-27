import { SiteShell, CtaBand } from '@/components/site/chrome';
import { AracKabugu, DigerAraclar } from '@/components/site/ToolsPage';
import HizTesti from '@/components/site/HizTesti';
import { aracGetir, metinAl } from '@/lib/cms';
import { sayfaMeta } from '@/lib/seo';
import SayfaMetni from '@/components/site/SayfaMetni';

export const revalidate = 300;

export async function generateMetadata() {
  const ARAC = await aracGetir('hiz-testi');
  const m = await metinAl();
  return sayfaMeta({ baslik: m('hiztesti.meta_baslik'), aciklama: ARAC.seo, yol: '/araclar/hiz-testi' });
}

export default async function Page() {
  const ARAC = await aracGetir('hiz-testi');
  const m = await metinAl();
  return (
    <SiteShell>
      <SayfaMetni onekler={['hiztesti']}>
      <AracKabugu arac={ARAC} kirinti={[{ metin: ARAC.kisa }]} baslik={ARAC.baslik} ozet={ARAC.ozet}>
        <HizTesti />
      </AracKabugu>

      <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('arac.ne_ise_yarar')}</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-body">{ARAC.aciklama}</p>
      </section>

      <DigerAraclar slug="hiz-testi" />
      <CtaBand />
      </SayfaMetni>
    </SiteShell>
  );
}
