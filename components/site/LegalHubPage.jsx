import Link from 'next/link';
import { Icon, CtaBand, SiteShell, PageHero } from './chrome';
import { LEGAL as C } from '@/content/site/legal';

function BelgeDugmesi({ belge }) {
  const dis = belge.href.startsWith('http');
  return (
    <a
      href={belge.href}
      target={dis ? '_blank' : undefined}
      rel={dis ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-bold text-strong transition-colors hover:border-brandline hover:text-brandtext"
    >
      <Icon name={belge.icon} className="h-4 w-4 text-brandtext" />
      {belge.etiket}
    </a>
  );
}

export default function LegalHubPage() {
  return (
    <SiteShell>
      <PageHero eyebrow={C.eyebrow} breadcrumb={C.title} title={C.title} text={C.lede} />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">{C.sozlesmeler.baslik}</h2>
          <span className="text-[13px] text-muted">{C.sozlesmeler.items.length} belge</span>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          {C.sozlesmeler.items.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-brandline"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-strong">{s.baslik}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-body">{s.ozet}</span>
              </span>
              <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brandtext" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface2">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.ticari.eyebrow}</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">{C.ticari.baslik}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-body">{C.ticari.ozet}</p>
          </div>

          <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1.45fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              <dl className="divide-y divide-line">
                {C.ticari.bilgiler.map(([etiket, deger, href]) => (
                  <div key={etiket} className="grid gap-0.5 px-5 py-3.5 sm:grid-cols-[190px_1fr] sm:gap-5 sm:px-6">
                    <dt className="text-[13px] text-muted">{etiket}</dt>
                    <dd className="break-words text-[14px] font-semibold text-strong">
                      {href ? (
                        <a href={href} className="transition-colors hover:text-brandtext">{deger}</a>
                      ) : (
                        deger
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid gap-5">
              <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Belgeler</h3>
                <div className="mt-4 flex flex-col gap-2.5">
                  {C.ticari.belgeler.map((b) => <BelgeDugmesi key={b.href} belge={b} />)}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">E-posta adresleri</h3>
                <dl className="mt-4 divide-y divide-line">
                  {C.ticari.epostalar.map(([etiket, adres]) => (
                    <div key={adres} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5 first:pt-0 last:pb-0">
                      <dt className="text-[13px] text-muted">{etiket}</dt>
                      <dd>
                        <a href={`mailto:${adres}`} className="break-all text-[14px] font-semibold text-strong transition-colors hover:text-brandtext">
                          {adres}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Hizmet bilgileri</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {C.ticari.hizmetler.map((h) => (
                    <span key={h} className="rounded-lg bg-surface2 px-3 py-1.5 text-[13px] font-semibold text-body ring-1 ring-line">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
