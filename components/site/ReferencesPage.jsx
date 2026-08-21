import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import LogoSerit from './LogoSerit';
import LogoKutusu from './LogoKutusu';
import ReferansIzgara from './ReferansIzgara';
import { REFERANSLAR as C, MUSTERILER, SEKTORLER } from '@/content/site/referanslar';

export default function ReferencesPage() {
  const varMi = MUSTERILER.length > 0;

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 right-[-6%] h-[420px] w-[420px] rounded-full bg-brand-300/25 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-14 pb-12 lg:pt-16 lg:pb-14">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">Ana Sayfa</Link>
            <span>/</span>
            <span className="font-medium text-strong/70">Referanslar</span>
          </div>

          <div className="mt-6 max-w-3xl animate-[fadeup_0.6s_ease-out]">
            <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-brandtext">{C.eyebrow}</span>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-strong text-balance">
              {C.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-body sm:text-xl">{varMi ? C.lede : C.ledeListesiz}</p>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {C.rakamlar.map(([sayi, etiket]) => (
              <div key={etiket} className="flex flex-col-reverse rounded-2xl bg-surface2/70 p-6 ring-1 ring-line">
                <dt className="mt-1 text-sm text-body">{etiket}</dt>
                <dd className="text-3xl font-extrabold text-brandtext sm:text-4xl">{sayi}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {varMi && (
        <section className="border-b border-line bg-surface2/60">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 lg:py-14">
            <h2 className="mb-7 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-muted">
              {C.seritBaslik}
            </h2>
            <LogoSerit liste={MUSTERILER} />
          </div>
        </section>
      )}

      {varMi && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.izgara.eyebrow}</span>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-strong text-balance sm:text-4xl">
            {C.izgara.baslik}
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-body">{C.izgara.metin}</p>

          <div className="mt-10">
            <ReferansIzgara musteriler={MUSTERILER} sektorler={SEKTORLER} />
          </div>
        </section>
      )}

      <section className={`${varMi ? 'border-y border-line bg-surface2/60' : ''}`}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.sektorBolumu.eyebrow}</span>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-strong text-balance sm:text-4xl">
            {C.sektorBolumu.baslik}
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-body">{C.sektorBolumu.metin}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {C.sektorBolumu.items.map((s) => (
              <div key={s.t} className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-[16px] font-bold text-strong">{s.t}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-body">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.neden.eyebrow}</span>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-strong text-balance sm:text-4xl">
          {C.neden.baslik}
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {C.neden.items.map((n) => (
            <div key={n.t} className="flex gap-4 rounded-2xl border border-line bg-surface p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brandsoft text-brandtext">
                <Icon name={n.ikon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-strong">{n.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-body">{n.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface2/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.ortaklar.eyebrow}</span>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-strong text-balance sm:text-4xl">
            {C.ortaklar.baslik}
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-body">{C.ortaklar.metin}</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {C.ortaklar.items.map((o) => (
              <li key={o.ad}>
                <a
                  href={o.site}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brandline"
                >
                  <LogoKutusu marka={o} boyut="ortak" />
                  <span className="mt-3 px-1 text-[14px] font-bold text-strong">{o.ad}</span>
                  <span className="mt-0.5 px-1 text-[13px] leading-relaxed text-muted">{o.not}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={C.cta.baslik} text={C.cta.metin} />
    </SiteShell>
  );
}
