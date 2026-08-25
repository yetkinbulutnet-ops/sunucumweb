import { SiteShell, CtaBand } from '@/components/site/chrome';
import { AracKabugu, DigerAraclar } from '@/components/site/ToolsPage';
import HizTesti from '@/components/site/HizTesti';
import { aracBul } from '@/content/site/araclar';
import { sayfaMeta } from '@/lib/seo';

const ARAC = aracBul('hiz-testi');

export const metadata = sayfaMeta({
  baslik: 'İnternet Hız Testi — İndirme, Yükleme, Ping',
  aciklama: ARAC.seo,
  yol: '/araclar/hiz-testi',
});

export default function Page() {
  return (
    <SiteShell>
      <AracKabugu arac={ARAC} kirinti={[{ metin: ARAC.kisa }]} baslik={ARAC.baslik} ozet={ARAC.ozet}>
        <HizTesti />
      </AracKabugu>

      <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Bu araç ne işe yarar?</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-body">{ARAC.aciklama}</p>
      </section>

      <DigerAraclar slug="hiz-testi" />
      <CtaBand />
    </SiteShell>
  );
}
