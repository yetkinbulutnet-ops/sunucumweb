import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import KabinSlider from './KabinSlider';
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

            <a
              href={C.btk.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:border-brandline hover:text-brandtext"
            >
              <Icon name="shield" className="h-4 w-4 text-brandtext" />
              {C.btk.metin}
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-9 lg:grid-cols-4 lg:gap-x-10">
            {C.rakamlar.map(([sayi, etiket]) => (
              <div key={etiket} className="flex flex-col-reverse gap-1.5">
                <dt className="text-[13px] font-medium text-muted sm:text-[14px]">{etiket}</dt>
                <dd className="text-[2rem] font-extrabold leading-none tracking-tight text-strong sm:text-[2.5rem] lg:text-[2.75rem]">
                  {sayi}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{C.hikaye.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">
              {C.hikaye.baslik}
            </h2>
            {C.hikaye.paragraflar.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[17px] leading-relaxed text-body">{p}</p>
            ))}
          </div>

          <KabinSlider fotograflar={C.hikaye.fotograflar} />
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

      <CtaBand title={C.cta.baslik} text={C.cta.metin} />
    </SiteShell>
  );
}
