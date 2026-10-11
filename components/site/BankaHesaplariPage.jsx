import Link from 'next/link';
import { Icon, SiteShell } from './chrome';
import Sema from './Sema';
import SssListesi from './SssListesi';
import IbanKopyala from './IbanKopyala';
import { metinAl } from '@/lib/cms';
import { ekmekKirintisi, sssSemasi } from '@/lib/semalar';
import { belgeYolu } from '@/lib/yasal';

function HesapKarti({ m, h }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_20px_60px_-36px_rgba(15,41,66,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
        {h.logo ? (
          <span className="flex h-14 items-center rounded-xl bg-white px-4 ring-1 ring-line">
            <img src={h.logo.url} alt={h.banka} width={h.logo.g} height={h.logo.y} loading="lazy" className="h-8 w-auto max-w-[180px] object-contain" />
          </span>
        ) : (
          <span className="flex items-center gap-3 text-[18px] font-extrabold text-strong">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brandsoft text-brandtext ring-1 ring-brandline"><Icon name="bank" className="h-5 w-5" /></span>
            {h.banka}
          </span>
        )}
        <span className="rounded-full bg-surface2 px-3 py-1 text-[13px] font-bold text-body ring-1 ring-line">{m(`banka.para_${h.para}`) || h.para}</span>
      </div>
      <dl className="divide-y divide-line">
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 sm:px-7">
          <dt className="text-[13px] text-muted">{m('banka.banka')}</dt>
          <dd className="text-[15px] font-semibold text-strong">{h.banka}</dd>
        </div>
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 sm:px-7">
          <dt className="text-[13px] text-muted">{m('banka.hesap_sahibi')}</dt>
          <dd className="text-[15px] font-semibold text-strong">{h.sahip}</dd>
        </div>
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-6 sm:px-7">
          <dt className="text-[13px] text-muted">{m('banka.iban')}</dt>
          <dd className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <span className="min-w-0 break-words font-mono text-[16px] font-bold tracking-wide text-strong sm:text-[17px]">{h.iban}</span>
            <IbanKopyala iban={h.iban} etiket={m('banka.kopyala')} tamam={m('banka.kopyalandi')} />
          </dd>
        </div>
      </dl>
      {h.aciklama && <p className="border-t border-line bg-surface2/60 px-5 py-3 text-[13.5px] leading-relaxed text-body sm:px-7">{h.aciklama}</p>}
    </article>
  );
}

export default async function BankaHesaplariPage({ veri }) {
  const m = await metinAl();
  const { ust, hesaplar, uyari, yontemler, havaleBaslik, havaleNotlari, sss } = veri;
  const yol = [
    { ad: m('legal.kirinti_ana_sayfa'), yol: '/' },
    { ad: ust.baslik || m('banka.baslik'), yol: '/banka-hesaplari' },
  ];

  return (
    <SiteShell>
      <Sema veri={ekmekKirintisi(yol)} />
      {sss.length > 0 && <Sema veri={sssSemasi(sss)} />}
      <section className="border-b border-line bg-surface2/50">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 lg:px-8 lg:pb-12 lg:pt-12">
          <nav aria-label={m('legal.kirinti_aria')} className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">{m('legal.kirinti_ana_sayfa')}</Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-strong/70">{ust.baslik || m('banka.baslik')}</span>
          </nav>
          {ust.eyebrow && <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{ust.eyebrow}</p>}
          <h1 className="tipo-dev mt-3 font-extrabold text-strong text-balance">{ust.baslik || m('banka.baslik')}</h1>
          {ust.aciklama && <p className="tipo-giris mt-3 max-w-2xl text-body">{ust.aciklama}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          <div className="min-w-0 space-y-6">
            {hesaplar.length ? hesaplar.map((h) => <HesapKarti key={h.iban} m={m} h={h} />) : <p className="rounded-2xl border border-line bg-surface p-6 text-body">{m('banka.bos')}</p>}
            {uyari && (
              <div role="note" className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-[14px] leading-relaxed text-strong sm:p-5">
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
                <p>{uyari}</p>
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-6">
            {yontemler.length > 0 && (
              <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
                <h2 className="text-[19px] font-extrabold tracking-tight text-strong">{m('banka.odeme_yontemleri')}</h2>
                <ul className="mt-4 space-y-4">
                  {yontemler.map((y) => (
                    <li key={y.t} className="flex gap-3">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface2 text-brandtext ring-1 ring-line">
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-strong">{y.t}</h3>
                        <p className="mt-0.5 text-[14px] leading-relaxed text-body">{y.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {havaleNotlari.length > 0 && (
              <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
                <h2 className="text-[19px] font-extrabold tracking-tight text-strong">{havaleBaslik || m('banka.havale_baslik')}</h2>
                <ul className="mt-4 space-y-3">
                  {havaleNotlari.map((n) => (
                    <li key={n} className="relative pl-5 text-[14px] leading-relaxed text-body before:absolute before:left-0.5 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brandtext">{n}</li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-line pt-4 text-[13.5px] leading-relaxed text-body">
                  {m('banka.ilgili_on')}{' '}
                  <Link href={belgeYolu('iptal-ve-iade-kosullari')} className="font-bold text-brandtext hover:underline">{m('banka.ilgili_iade')}</Link>{' '}
                  {m('banka.ilgili_ve')}{' '}
                  <Link href={belgeYolu('mesafeli-satis-sozlesmesi')} className="font-bold text-brandtext hover:underline">{m('banka.ilgili_mesafeli')}</Link>{' '}
                  {m('banka.ilgili_son')}
                </p>
              </div>
            )}
          </div>
        </div>

        {sss.length > 0 && (
          <div className="mt-14 max-w-4xl">
            <h2 className="text-[22px] font-extrabold tracking-tight text-strong">{m('banka.sss_baslik')}</h2>
            <SssListesi sss={sss} />
          </div>
        )}
      </section>
    </SiteShell>
  );
}
