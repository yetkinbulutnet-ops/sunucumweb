import Link from 'next/link';
import { Icon, CtaBand, SiteShell, PageHero } from './chrome';
import { LEGAL as C } from '@/content/site/legal';

function Belge({ belge }) {
  const disBaglanti = belge.href.startsWith('http');
  return (
    <a
      href={belge.href}
      target={disBaglanti ? '_blank' : undefined}
      rel={disBaglanti ? 'noopener noreferrer' : undefined}
      className="mt-5 inline-flex items-center gap-2 rounded-xl border border-line bg-surface2 px-4 py-2.5 text-[13px] font-bold text-strong transition-colors hover:border-brandline hover:text-brandtext"
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

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="max-w-2xl">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.sozlesmeler.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">
            {C.sozlesmeler.baslik}
          </h2>
        </div>

        <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {C.sozlesmeler.items.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-28px_rgba(20,184,166,0.35)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[16px] font-bold text-strong text-balance">{s.baslik}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{s.ozet}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-brandtext">
                Belgeyi oku
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface2">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.ticari.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">
              {C.ticari.baslik}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-body">{C.ticari.ozet}</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {C.ticari.sutunlar.map((sutun) => (
              <div key={sutun.baslik} className="flex flex-col rounded-2xl border border-line bg-surface p-6 sm:p-7">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{sutun.baslik}</h3>
                <dl className="mt-5 flex-1 space-y-4">
                  {sutun.satirlar.map(([etiket, deger, href]) => (
                    <div key={etiket}>
                      <dt className="text-[13px] text-muted">{etiket}</dt>
                      <dd className="mt-0.5 break-words text-[15px] font-semibold leading-relaxed text-strong">
                        {href ? (
                          <a href={href} className="transition-colors hover:text-brandtext">{deger}</a>
                        ) : (
                          deger
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                {sutun.belge && <Belge belge={sutun.belge} />}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 lg:col-span-2">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">E-posta adresleri</h3>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                {C.ticari.epostalar.map(([etiket, adres]) => (
                  <div key={adres}>
                    <dt className="text-[13px] text-muted">{etiket}</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${adres}`} className="break-words text-[15px] font-semibold text-strong transition-colors hover:text-brandtext">
                        {adres}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Hizmet bilgileri</h3>
              <ul className="mt-5 space-y-2.5">
                {C.ticari.hizmetler.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-[15px] text-body">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brandsoft text-brandtext">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
