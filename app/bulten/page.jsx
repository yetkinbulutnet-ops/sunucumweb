import { SiteShell } from '@/components/site/chrome';
import BultenIslem from '@/components/site/BultenIslem';
import { metinAl } from '@/lib/cms';
import SayfaMetni from '@/components/site/SayfaMetni';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const m = await metinAl();
  return {
    title: m('bulten.meta_baslik'),
    robots: { index: false, follow: false, nocache: true },
    referrer: 'no-referrer',
  };
}

export default async function BultenSayfasi({ searchParams }) {
  const sp = (await searchParams) || {};
  const islem = sp.islem === 'iptal' ? 'iptal' : 'onay';
  const token = typeof sp.t === 'string' ? sp.t.slice(0, 100) : '';
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute -top-24 left-[-10%] h-[340px] w-[340px] rounded-full bg-brand-300/25 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-xl px-5 py-20 lg:px-8 lg:py-28">
          <SayfaMetni onekler={['bulten']}>
            <BultenIslem islem={islem} token={token} />
          </SayfaMetni>
        </div>
      </section>
    </SiteShell>
  );
}
