import Link from 'next/link';
import { Icon, CtaBand, SiteShell, PageHero } from './chrome';
import ToolRunner from './ToolRunner';
import { ARAC_LISTESI, ARACLAR_SAYFA } from '@/content/site/araclar';

function AracKarti({ arac }) {
  return (
    <Link
      href={`/araclar/${arac.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-28px_rgba(20,184,166,0.35)]"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
        <Icon name={arac.icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-[16px] font-bold text-strong text-balance">{arac.baslik}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{arac.ozet}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-brandtext">
        Aracı aç
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function ToolsHubPage() {
  return (
    <SiteShell>
      <PageHero eyebrow={ARACLAR_SAYFA.eyebrow} breadcrumb="Araçlar" title={ARACLAR_SAYFA.baslik} text={ARACLAR_SAYFA.lede} />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARAC_LISTESI.map((a) => <AracKarti key={a.slug} arac={a} />)}
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}

export function ToolDetailPage({ arac }) {
  const digerleri = ARAC_LISTESI.filter((a) => a.slug !== arac.slug);

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-300/20 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>

        <div className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/araclar" className="hover:text-brandtext">Araçlar</Link>
            <span>/</span>
            <span className="font-medium text-strong/70">{arac.kisa}</span>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/25">
              <Icon name={arac.icon} />
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{arac.baslik}</h1>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-body">{arac.ozet}</p>
            </div>
          </div>

          <div className="mt-9">
            <ToolRunner arac={arac} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Bu araç ne işe yarar?</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-body">{arac.aciklama}</p>
      </section>

      <section className="border-t border-line bg-surface2">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Diğer araçlar</h2>
          <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {digerleri.map((a) => (
              <Link
                key={a.slug}
                href={`/araclar/${a.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brandline"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <span className="text-[14px] font-bold text-strong">{a.kisa}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
