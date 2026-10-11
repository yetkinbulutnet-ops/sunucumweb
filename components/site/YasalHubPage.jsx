import Link from 'next/link';
import { Icon, SiteShell } from './chrome';
import Sema from './Sema';
import SssListesi from './SssListesi';
import { metinAl } from '@/lib/cms';
import { ekmekKirintisi, sssSemasi } from '@/lib/semalar';
import { belgeYolu, pdfYolu } from '@/lib/yasal';

function BelgeKart({ m, b }) {
  return (
    <article className="group relative flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brandline sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface2 text-brandtext ring-1 ring-line">
          <Icon name={b.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[16.5px] font-extrabold leading-snug text-strong">
            <Link href={belgeYolu(b.slug)} className="after:absolute after:inset-0 group-hover:text-brandtext">{b.baslik}</Link>
          </h3>
          {b.ozet && <p className="mt-1.5 text-[14px] leading-relaxed text-body">{b.ozet}</p>}
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brandtext">
          {m('yasal.goruntule')} <Icon name="arrow" className="h-4 w-4" />
        </span>
        <a href={pdfYolu(b.slug)} download className="relative z-10 ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface2 px-3 text-[13px] font-bold text-strong ring-1 ring-line transition-colors hover:text-brandtext hover:ring-brandline">
          <Icon name="download" className="h-4 w-4" /> {m('yasal.pdf')}
        </a>
      </div>
    </article>
  );
}

export default async function YasalHubPage({ ust, belgeler, sss, eposta }) {
  const m = await metinAl();
  const yol = [
    { ad: m('legal.kirinti_ana_sayfa'), yol: '/' },
    { ad: m('yasal.baslik'), yol: '/yasal-belgeler' },
  ];
  const ticari = belgeler.find((b) => b.tur === 'ticari');
  const gruplar = [
    { id: 'sozlesmeler', ad: m('yasal.sozlesmeler'), liste: belgeler.filter((b) => b.tur !== 'ticari' && b.grup === 'sozlesme') },
    { id: 'politikalar', ad: m('yasal.politikalar'), liste: belgeler.filter((b) => b.tur !== 'ticari' && b.grup === 'politika') },
  ].filter((g) => g.liste.length);

  return (
    <SiteShell>
      <Sema veri={ekmekKirintisi(yol)} />
      {sss.length > 0 && <Sema veri={sssSemasi(sss)} />}
      <section className="border-b border-line bg-surface2/50">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 lg:px-8 lg:pb-12 lg:pt-12">
          <nav aria-label={m('legal.kirinti_aria')} className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">{m('legal.kirinti_ana_sayfa')}</Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-strong/70">{m('yasal.baslik')}</span>
          </nav>
          {ust.eyebrow && <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{ust.eyebrow}</p>}
          <h1 className="tipo-dev mt-3 font-extrabold text-strong text-balance">{ust.baslik || m('yasal.baslik')}</h1>
          {ust.aciklama && <p className="tipo-giris mt-3 max-w-2xl text-body">{ust.aciklama}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        {ticari && (
          <Link href={belgeYolu(ticari.slug)} className="group flex min-w-0 flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brandline sm:flex-nowrap sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext ring-1 ring-brandline">
              <Icon name="binaOfis" className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-extrabold text-strong group-hover:text-brandtext">{ticari.baslik}</span>
              {ticari.ozet && <span className="mt-1 block text-[14px] leading-relaxed text-body">{ticari.ozet}</span>}
            </span>
            <Icon name="arrow" className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brandtext" />
          </Link>
        )}

        {gruplar.map((g) => (
          <div key={g.id} className="mt-12 first:mt-0">
            <h2 id={g.id} className="text-[22px] font-extrabold tracking-tight text-strong">{g.ad}</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {g.liste.map((b) => <BelgeKart key={b.slug} m={m} b={b} />)}
            </div>
          </div>
        ))}

        {eposta && (
          <p className="mt-10 text-[14.5px] leading-relaxed text-body">
            {m('yasal.not_on')}{' '}
            <a href={`mailto:${eposta}`} className="font-bold text-brandtext hover:underline">{eposta}</a>{' '}
            {m('yasal.not_son')}
          </p>
        )}

        {sss.length > 0 && (
          <div className="mt-14 max-w-4xl">
            <h2 className="text-[22px] font-extrabold tracking-tight text-strong">{m('yasal.sss_baslik')}</h2>
            <SssListesi sss={sss} />
          </div>
        )}
      </section>
    </SiteShell>
  );
}
