import Link from 'next/link';
import parse from 'html-react-parser';
import { Icon, SiteShell } from './chrome';
import Sema from './Sema';
import YazdirButonu from './YazdirButonu';
import { metinAl } from '@/lib/cms';
import { ekmekKirintisi } from '@/lib/semalar';
import { belgeYolu, pdfYolu, tarihKisa } from '@/lib/yasal';

const PROSE = `
.legal-prose h2{font-size:1.3rem;font-weight:800;color:rgb(var(--c-strong));margin:2rem 0 .7rem;letter-spacing:-.01em}
.legal-prose h2:first-child{margin-top:0}
.legal-prose h3{font-size:1.05rem;font-weight:700;color:rgb(var(--c-strong));opacity:.92;margin:1.5rem 0 .45rem}
.legal-prose p{color:rgb(var(--c-body));line-height:1.75;margin:.65rem 0;font-size:15px}
.legal-prose a{color:rgb(var(--c-brandtext));font-weight:600;overflow-wrap:anywhere}
.legal-prose strong{color:rgb(var(--c-strong))}
.legal-prose table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:14px;color:rgb(var(--c-body))}
.legal-prose td,.legal-prose th{border:1px solid rgb(var(--c-line));padding:.55rem .7rem;text-align:left;vertical-align:top}
.legal-prose th{color:rgb(var(--c-strong));background:rgb(var(--c-surface2))}
.legal-prose ul,.legal-prose ol{margin:.9rem 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.5rem}
.legal-prose ol{counter-reset:madde}
.legal-prose li{position:relative;padding-left:1.65rem;color:rgb(var(--c-body));line-height:1.7;font-size:15px}
.legal-prose ul>li::before{content:'';position:absolute;left:.15rem;top:.6em;width:.45rem;height:.45rem;border-radius:9999px;background:rgb(var(--c-brandtext))}
.legal-prose ol>li{counter-increment:madde}
.legal-prose ol>li::before{content:counter(madde) '.';position:absolute;left:0;top:0;font-weight:700;color:rgb(var(--c-brandtext))}
.legal-prose .blog-tablo{overflow-x:auto;margin:1rem 0}
.legal-prose .blog-tablo table{margin:0}
.yalniz-yazdir{display:none}
@media print{
  @page{size:A4;margin:16mm 14mm}
  html,body,.bg-page{background:#fff!important}
  .min-h-ekran>*:not(main),.yazdirma-gizle,iframe,[class*="tawk"],[id*="tawk"]{display:none!important}
  .yalniz-yazdir{display:block!important}
  .yasal-belge,.yasal-belge *{color:#111!important;background:transparent!important;box-shadow:none!important}
  .yasal-belge a{color:#0f766e!important;text-decoration:none}
  .yasal-belge .legal-prose td,.yasal-belge .legal-prose th{border-color:#bbb!important}
  .yasal-belge .legal-prose li::before{background:#111!important;color:#111!important}
  .yasal-belge h2,.yasal-belge h3{break-after:avoid}
  .yasal-belge tr,.yasal-belge li{break-inside:avoid}
  .yasal-izgara{display:block!important}
  .yasal-bolum{padding:0!important;max-width:none!important}
}
`;

function Kenar({ m, aktif, belgeler }) {
  const gruplar = [
    { ad: m('yasal.sirket'), liste: belgeler.filter((b) => b.tur === 'ticari') },
    { ad: m('yasal.sozlesmeler'), liste: belgeler.filter((b) => b.tur !== 'ticari' && b.grup === 'sozlesme') },
    { ad: m('yasal.politikalar'), liste: belgeler.filter((b) => b.tur !== 'ticari' && b.grup === 'politika') },
  ].filter((g) => g.liste.length);

  const oge = (b) => {
    const secili = b.slug === aktif;
    return (
      <li key={b.slug} className="shrink-0 snap-start lg:shrink">
        <Link
          href={belgeYolu(b.slug)}
          aria-current={secili ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors lg:px-4 lg:py-2.5 ${
            secili ? 'bg-brandsoft text-brandtext ring-1 ring-brandline' : 'bg-surface2 text-body hover:bg-brandsoft hover:text-brandtext lg:bg-transparent'
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
  };

  return (
    <nav aria-label={m('legal.kenar_aria')} className="yazdirma-gizle min-w-0 lg:sticky lg:top-28">
      <ul className="flex snap-x gap-2 overflow-x-auto pb-2 lg:hidden">{gruplar.flatMap((g) => g.liste).map(oge)}</ul>
      <div className="hidden lg:block">
        {gruplar.map((g) => (
          <div key={g.ad} className="mb-5 last:mb-0">
            <p className="px-4 text-[12px] font-bold uppercase tracking-[0.14em] text-muted">{g.ad}</p>
            <ul className="mt-2 flex flex-col gap-1">{g.liste.map(oge)}</ul>
          </div>
        ))}
        <div className="mt-6 rounded-2xl border border-line bg-surface2 p-4">
          <p className="text-[13px] leading-relaxed text-body">
            {m('legal.soru_on')}{' '}
            <Link href="/iletisim" className="font-bold text-brandtext hover:text-brand-500">{m('legal.soru_link')}</Link>{' '}
            {m('legal.soru_son')}
          </p>
        </div>
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
                {href ? <a href={href} className="transition-colors hover:text-brandtext">{deger}</a> : deger}
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
                  <a href={`mailto:${adres}`} className="break-all text-[14px] font-semibold text-strong transition-colors hover:text-brandtext">{adres}</a>
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
            <span key={h} className="rounded-lg bg-surface2 px-3 py-1.5 text-[13px] font-semibold text-body ring-1 ring-line">{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function YazdirmaUstu({ ticari, site }) {
  return (
    <div className="yalniz-yazdir mb-6 border-b border-line pb-4">
      <img src="/icon/logo.png" width={2297} height={332} alt="" className="h-8 w-auto" />
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-0.5 text-[10.5px] leading-snug">
        {ticari.bilgiler.map(([etiket, deger]) => (
          <p key={etiket}><strong>{etiket}:</strong> {deger}</p>
        ))}
        {ticari.epostalar[0] && <p><strong>{ticari.epostalar[0][0]}:</strong> {ticari.epostalar[0][1]}</p>}
        <p><strong>Web:</strong> {site}</p>
      </div>
    </div>
  );
}

export default async function YasalBelgePage({ belge, html, belgeler, ticari, site }) {
  const m = await metinAl();
  const yol = [
    { ad: m('legal.kirinti_ana_sayfa'), yol: '/' },
    { ad: m('yasal.baslik'), yol: '/yasal-belgeler' },
    { ad: belge.baslik, yol: belgeYolu(belge.slug) },
  ];
  const tarih = tarihKisa(belge.yururluk || belge.guncelleme);
  const dugme = 'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[14px] font-bold transition-colors';

  return (
    <SiteShell>
      <style dangerouslySetInnerHTML={{ __html: PROSE }} />
      <Sema veri={ekmekKirintisi(yol)} />
      <section className="yazdirma-gizle border-b border-line bg-surface2/50">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8 lg:pt-12">
          <nav aria-label={m('legal.kirinti_aria')} className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {yol.map((p, i) => (
              <span key={p.yol} className="flex min-w-0 items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {i < yol.length - 1 ? <Link href={p.yol} className="hover:text-brandtext">{p.ad}</Link> : <span className="truncate font-medium text-strong/70">{p.ad}</span>}
              </span>
            ))}
          </nav>
          <p className="tipo-dev mt-4 font-extrabold text-strong text-balance">{m('yasal.baslik')}</p>
        </div>
      </section>

      <section className="yasal-bolum mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="yasal-izgara grid min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <Kenar m={m} aktif={belge.slug} belgeler={belgeler} />

          <article className="yasal-belge min-w-0">
            <YazdirmaUstu ticari={ticari} site={site} />
            <header className="border-b border-line pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="tipo-bolum min-w-0 font-extrabold text-strong">{belge.baslik}</h1>
                <div className="yazdirma-gizle flex shrink-0 flex-wrap gap-2">
                  <YazdirButonu etiket={m('yasal.yazdir')} className={`${dugme} bg-surface text-strong ring-1 ring-line hover:text-brandtext hover:ring-brandline`}>
                    <Icon name="printer" className="h-4 w-4" /> {m('yasal.yazdir')}
                  </YazdirButonu>
                  <a href={pdfYolu(belge.slug)} download className={`${dugme} bg-brand-700 text-white hover:bg-brand-800`}>
                    <Icon name="download" className="h-4 w-4" /> {m('yasal.pdf_indir')}
                  </a>
                </div>
              </div>
              {belge.ozet && <p className="mt-2 text-[15px] leading-relaxed text-body">{belge.ozet}</p>}
              {(belge.surum || tarih) && (
                <p className="mt-3 flex flex-wrap gap-2 text-[13px] text-muted">
                  {belge.surum && <span className="rounded-lg bg-surface2 px-2.5 py-1 ring-1 ring-line">{m('yasal.surum', { surum: belge.surum })}</span>}
                  {tarih && <span className="rounded-lg bg-surface2 px-2.5 py-1 ring-1 ring-line">{m(belge.yururluk ? 'yasal.yururluk' : 'yasal.guncelleme', { tarih })}</span>}
                </p>
              )}
            </header>

            {belge.tur === 'ticari' ? <TicariIcerik m={m} T={ticari} /> : <div className="legal-prose mt-7">{parse(html || '')}</div>}
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
