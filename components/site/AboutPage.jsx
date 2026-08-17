import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import { HAKKIMIZDA as C } from '@/content/site/hakkimizda';

const SEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SunucumWEB',
  legalName: 'SunucumWEB Bilişim Hizmetleri',
  url: 'https://sunucumweb.com',
  foundingDate: '2023',
  taxID: '2220195996',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hasanbey Mahallesi, Sokullu Sokak No: 16',
    addressLocality: 'Keçiborlu',
    addressRegion: 'Isparta',
    addressCountry: 'TR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+908503025809',
    email: 'destek@sunucumweb.com',
    contactType: 'customer support',
    availableLanguage: 'Turkish',
  },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SEMA) }} />

      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-[-6%] h-[420px] w-[420px] rounded-full bg-brand-300/25 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-14 pb-12 lg:pt-16 lg:pb-14">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">Ana Sayfa</Link>
            <span>/</span>
            <span className="font-medium text-strong/70">Kurumsal</span>
          </div>

          <div className="mt-6 max-w-3xl animate-[fadeup_0.6s_ease-out]">
            <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-brandtext">{C.eyebrow}</span>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-strong text-balance">
              {C.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-body sm:text-xl">{C.lede}</p>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {C.kunyeSeritler.map(([etiket, deger]) => (
              <div key={etiket}>
                <dt className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">{etiket}</dt>
                <dd className="mt-1.5 text-[17px] font-bold text-strong">{deger}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-line shadow-[0_40px_80px_-40px_rgba(15,41,66,0.5)]">
              <div className="aspect-[16/9]">
                <img
                  src={C.hikaye.gorsel.src}
                  alt={C.hikaye.gorsel.alt}
                  width={C.hikaye.gorsel.genislik}
                  height={C.hikaye.gorsel.yukseklik}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {C.hikaye.rozet && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg shadow-ink/5 sm:absolute sm:-bottom-6 sm:right-6 sm:mt-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext">
                  <Icon name={C.hikaye.rozet.icon} className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[14px] font-extrabold text-strong">{C.hikaye.rozet.baslik}</div>
                  <div className="text-[12px] text-muted">{C.hikaye.rozet.alt}</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.hikaye.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">
              {C.hikaye.baslik}
            </h2>
            {C.hikaye.paragraflar.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[16px] leading-relaxed text-body">{p}</p>
            ))}
            <Link
              href="/iletisim"
              className="mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-brandtext transition-colors hover:text-brand-500"
            >
              Bize ulaşın <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ink">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {C.rakamlar.map(([sayi, etiket]) => (
              <div key={etiket} className="flex flex-col-reverse gap-2">
                <dt className="text-sm text-slate-300">{etiket}</dt>
                <dd className="text-4xl font-extrabold tracking-tight text-brand-300 sm:text-[2.75rem]">{sayi}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.alanlar.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{C.alanlar.baslik}</h2>
          <p className="mt-4 text-lg leading-relaxed text-body">{C.alanlar.ozet}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {C.alanlar.items.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-start gap-5 rounded-2xl border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-brandline hover:shadow-[0_24px_50px_-30px_rgba(15,41,66,0.45)]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Icon name={a.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-lg font-bold text-strong">
                  {a.t}
                  <Icon name="arrow" className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brandtext" />
                </span>
                <span className="mt-2 block text-[15px] leading-relaxed text-body">{a.d}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface2">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.ilkeler.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{C.ilkeler.baslik}</h2>
          </div>

          <ol className="mt-12 grid gap-x-14 gap-y-10 lg:grid-cols-2">
            {C.ilkeler.items.map((i, n) => (
              <li key={i.t} className="flex gap-5 border-t border-line pt-6">
                <span className="text-[15px] font-extrabold tabular-nums text-brandtext">
                  {String(n + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-strong">{i.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{i.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.kunye.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{C.kunye.baslik}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-body">{C.kunye.ozet}</p>

            <a
              href={C.kunye.btkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 flex items-start gap-3 rounded-2xl border border-line bg-surface2/70 p-5 transition-colors hover:border-brandline"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <span className="text-[14px] leading-relaxed text-body">
                {C.kunye.btkMetin}
                <span className="mt-1.5 block font-semibold text-brandtext transition-transform group-hover:translate-x-0.5">
                  BTK listesinde görün →
                </span>
              </span>
            </a>

            <Link
              href="/ticari-bilgiler"
              className="mt-4 inline-flex items-center gap-2 text-[15px] font-bold text-brandtext transition-colors hover:text-brand-500"
            >
              Tüm ticari bilgiler <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <dl className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
            {C.kunye.satirlar.map(([etiket, deger]) => (
              <div key={etiket} className="grid gap-1 px-6 py-4 sm:grid-cols-[190px_1fr] sm:gap-6 sm:py-5">
                <dt className="text-[13px] font-semibold uppercase tracking-wide text-muted">{etiket}</dt>
                <dd className="break-words text-[15px] font-semibold text-strong">{deger}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        title="Altyapınızı birlikte konuşalım"
        text="Hangi paketin işinize uyduğundan emin değilseniz arayın; teknik ekibimiz doğru yapılandırmayı çıkarsın."
      />
    </SiteShell>
  );
}
