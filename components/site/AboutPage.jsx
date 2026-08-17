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

      <section className="mx-auto max-w-3xl px-5 lg:px-8 py-20 lg:py-24">
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.hikaye.eyebrow}</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">
          {C.hikaye.baslik}
        </h2>
        {C.hikaye.paragraflar.map((p) => (
          <p key={p.slice(0, 24)} className="mt-5 text-[17px] leading-relaxed text-body">{p}</p>
        ))}
      </section>

      <section className="border-y border-line bg-surface2">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.galeri.eyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">
                {C.galeri.baslik}
              </h2>
            </div>
            <p className="text-[15px] text-muted">{C.galeri.ozet}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {C.galeri.fotograflar.map((f) => (
              <figure key={f.src} className="group overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={f.src}
                    alt={f.alt}
                    width={f.g}
                    height={f.y}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
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
      </section>

      <CtaBand
        title="Altyapınızı birlikte konuşalım"
        text="Hangi paketin işinize uyduğundan emin değilseniz arayın; teknik ekibimiz doğru yapılandırmayı çıkarsın."
      />
    </SiteShell>
  );
}
