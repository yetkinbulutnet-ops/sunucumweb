import Link from 'next/link';
import parse from 'html-react-parser';
import { Icon, SiteShell } from './chrome';
import { TICARI_SLUG, metinAl } from '@/lib/cms';

const PROSE = `
.legal-prose h2{font-size:1.3rem;font-weight:800;color:rgb(var(--c-strong));margin:2rem 0 .7rem;letter-spacing:-.01em}
.legal-prose h2:first-child{margin-top:0}
.legal-prose h3{font-size:1.05rem;font-weight:700;color:rgb(var(--c-strong));opacity:.92;margin:1.5rem 0 .45rem}
.legal-prose p{color:rgb(var(--c-body));line-height:1.75;margin:.65rem 0;font-size:15px}
.legal-prose a{color:rgb(var(--c-brandtext));font-weight:600}
.legal-prose strong{color:rgb(var(--c-strong))}
.legal-prose table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:14px;color:rgb(var(--c-body))}
.legal-prose td,.legal-prose th{border:1px solid rgb(var(--c-line));padding:.55rem .7rem;text-align:left}
.legal-prose ul{margin:.9rem 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.5rem}
.legal-prose li{position:relative;padding-left:1.65rem;color:rgb(var(--c-body));line-height:1.7;font-size:15px}
.legal-prose li::before{content:'';position:absolute;left:.15rem;top:.6em;width:.45rem;height:.45rem;border-radius:9999px;background:rgb(var(--c-brandtext))}
`;

const yol = (slug) => (slug === TICARI_SLUG ? '/legal' : `/legal/${slug}`);

function Kenar({ m, aktif, belgeler: LEGAL_BELGELER }) {
  return (
    <nav aria-label={m('legal.kenar_aria')} className="min-w-0 lg:sticky lg:top-28">
      <p className="hidden text-[12px] font-bold uppercase tracking-[0.14em] text-muted lg:block">{m('legal.belgeler')}</p>

      <ul className="flex snap-x gap-2 overflow-x-auto pb-2 lg:mt-4 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
        {LEGAL_BELGELER.map((b) => {
          const secili = b.slug === aktif;
          return (
            <li key={b.slug} className="shrink-0 snap-start lg:shrink">
              <Link
                href={yol(b.slug)}
                aria-current={secili ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors lg:px-4 lg:py-3 ${
                  secili
                    ? 'bg-brandsoft text-brandtext ring-1 ring-brandline'
                    : 'bg-surface2 text-body hover:bg-brandsoft hover:text-brandtext lg:bg-transparent'
                }`}
              >
                <Icon name={b.icon} className={`h-4 w-4 shrink-0 ${secili ? 'text-brandtext' : 'text-muted'}`} />
                <span className="whitespace-nowrap lg:whitespace-normal">
                  <span className="lg:hidden">{b.kisa}</span>
                  <span className="hidden lg:inline">{b.baslik}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 hidden rounded-2xl border border-line bg-surface2 p-4 lg:block">
        <p className="text-[13px] leading-relaxed text-body">
          {m('legal.soru_on')}{' '}
          <Link href="/iletisim" className="font-bold text-brandtext hover:text-brand-500">
            {m('legal.soru_link')}
          </Link>{' '}
          {m('legal.soru_son')}
        </p>
      </div>
    </nav>
  );
}

function TicariIcerik({ m, T }) {

  return (
    <div className="mt-7">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <dl className="divide-y divide-line">
          {T.bilgiler.map(([etiket, deger, href]) => (
            <div key={etiket} className="grid gap-0.5 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-5 sm:px-6">
              <dt className="text-[13px] text-muted">{etiket}</dt>
              <dd className="break-words text-[14px] font-semibold text-strong">
                {href ? (
                  <a href={href} className="transition-colors hover:text-brandtext">
                    {deger}
                  </a>
                ) : (
                  deger
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{m('legal.resmi_kayitlar')}</h3>
          <div className="mt-4 flex flex-col gap-3">
            {T.kayitlar.map((k) => {
              const dis = k.href.startsWith('http');
              return (
                <a
                  key={k.ad}
                  href={k.href}
                  target={dis ? '_blank' : undefined}
                  rel={dis ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-surface2 p-3 transition-colors hover:border-brandline"
                >
                  {k.logo ? (
                    <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                      <img src={k.logo} alt={k.ad} width={k.en} height={k.boy} loading="lazy" className="max-h-8 w-auto max-w-full object-contain" />
                    </span>
                  ) : (
                    <span className="grid h-12 w-20 shrink-0 place-items-center rounded-lg bg-brandsoft">
                      <Icon name={k.icon} className="h-5 w-5 text-brandtext" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-strong">{k.ad}</span>
                    <span className="block text-[12.5px] leading-snug text-muted">{k.aciklama}</span>
                  </span>
                  <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brandtext" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{m('legal.epostalar')}</h3>
          <dl className="mt-4 divide-y divide-line">
            {T.epostalar.map(([etiket, adres]) => (
              <div key={adres} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5 first:pt-0 last:pb-0">
                <dt className="text-[13px] text-muted">{etiket}</dt>
                <dd>
                  <a
                    href={`mailto:${adres}`}
                    className="break-all text-[14px] font-semibold text-strong transition-colors hover:text-brandtext"
                  >
                    {adres}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{m('legal.hizmet_kapsami')}</h3>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {T.hizmetler.map((h) => (
            <span key={h} className="rounded-lg bg-surface2 px-3 py-1.5 text-[13px] font-semibold text-body ring-1 ring-line">
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function LegalHubPage({ belge, html, belgeler, metin: C, ticari }) {
  const m = await metinAl();
  return (
    <SiteShell>
      <section className="border-b border-line bg-surface2/50">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-10 pb-8 lg:pt-12">
          <nav aria-label={m('legal.kirinti_aria')} className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">{m('legal.kirinti_ana_sayfa')}</Link>
            <span>/</span>
            <Link href="/legal" className="hover:text-brandtext">{m('legal.kirinti_legal')}</Link>
            <span>/</span>
            <span className="font-medium text-strong/70">{belge.baslik}</span>
          </nav>

          <h1 className="tipo-dev mt-4 font-extrabold text-strong text-balance">{C.baslik}</h1>
          <p className="tipo-giris mt-3 max-w-2xl text-body">{C.aciklama}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-10 lg:py-14">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <Kenar m={m} aktif={belge.slug} belgeler={belgeler} />

          <article className="min-w-0">
            <header className="border-b border-line pb-5">
              <h2 className="tipo-bolum font-extrabold text-strong">{belge.baslik}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{belge.ozet}</p>
            </header>

            {belge.tur === 'ticari' ? (
              <TicariIcerik m={m} T={ticari} />
            ) : (
              <>
                <style dangerouslySetInnerHTML={{ __html: PROSE }} />
                <div className="legal-prose mt-7">{parse(html || '')}</div>
              </>
            )}
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
