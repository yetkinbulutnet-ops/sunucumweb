'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import Sema from './Sema';
import { sssSemasi, ekmekKirintisi } from '@/lib/semalar';
import DomainAI from './DomainAI';
import { m } from '@/lib/metin';

const COPY = () => ({
  register: {
    eyebrow: m('alanadi.tescil_etiket'), title: m('alanadi.tescil_baslik'),
    text: m('alanadi.tescil_aciklama'),
    ph: m('alanadi.tescil_ph'), btn: m('alanadi.tescil_buton'),
    trust: [m('alanadi.tescil_guven_1'), m('alanadi.tescil_guven_2'), m('alanadi.tescil_guven_3')],
    stepBaslik: m('alanadi.tescil_adim_baslik'),
  },
  transfer: {
    eyebrow: m('alanadi.transfer_etiket'), title: m('alanadi.transfer_baslik'),
    text: m('alanadi.transfer_aciklama'),
    ph: m('alanadi.transfer_ph'), btn: m('alanadi.transfer_buton'),
    trust: [m('alanadi.transfer_guven_1'), m('alanadi.transfer_guven_2'), m('alanadi.transfer_guven_3')],
    stepBaslik: m('alanadi.transfer_adim_baslik'),
  },
});

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((f, i) => (
        <div key={f.q} className="px-6">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
            <span className="text-[15px] font-semibold text-strong">{f.q}</span>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brandsoft text-brandtext transition-transform ${open === i ? 'rotate-45' : ''}`}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
          </button>
          {open === i && <p className="pb-5 -mt-1 text-[15px] leading-relaxed text-body">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

const SONUC = () => [
  { ad: m('alanadi.ornek_marka'), uz: '.com', durum: 'uygun', fiyat: '719' },
  { ad: m('alanadi.ornek_marka'), uz: '.com.tr', durum: 'uygun', fiyat: '119' },
  { ad: m('alanadi.ornek_marka'), uz: '.net', durum: 'uygun', fiyat: '889' },
  { ad: m('alanadi.ornek_marka'), uz: '.io', durum: 'alinmis' },
];

const TRANSFER_ADIM = () => [
  { t: m('alanadi.transfer_adim_1'), durum: 'ok' },
  { t: m('alanadi.transfer_adim_2'), durum: 'ok' },
  { t: m('alanadi.transfer_adim_3'), durum: 'aktif' },
  { t: m('alanadi.transfer_adim_4'), durum: 'bekliyor' },
];

function SonucKart() {
  return (
    <div className="relative animate-[fadeup_0.8s_ease-out]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-400/20 opacity-70 blur-[70px]" />
      <div className="overflow-hidden rounded-3xl border border-line/80 bg-surface shadow-[0_40px_90px_-40px_rgba(15,41,66,0.5)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3.5">
          <Icon name="search" className="h-4 w-4 shrink-0 text-brandtext" />
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-strong">{m('alanadi.ornek_marka')}</span>
          <span className="rounded-lg bg-brand-700 px-2.5 py-1 text-[12px] font-bold text-white">{m('alanadi.tescil_buton')}</span>
        </div>
        <ul className="divide-y divide-line">
          {SONUC().map((s) => {
            const uygun = s.durum === 'uygun';
            return (
              <li key={s.ad + s.uz} className="flex items-center gap-3 px-4 py-3.5">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${uygun ? 'bg-emerald-500/15 text-emerald-500' : 'bg-line text-muted'}`}>
                  <Icon name={uygun ? 'check' : 'xmark'} className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[14.5px] text-body"><span className="font-semibold text-strong">{s.ad}</span>{s.uz}</span>
                {uygun ? (
                  <span className="shrink-0 text-[14px] font-bold text-brandtext">₺{s.fiyat}</span>
                ) : (
                  <span className="shrink-0 text-[12px] font-semibold text-muted">{m('alanadi.alinmis')}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute -bottom-4 -left-2 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite] sm:-left-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name="lock" className="h-5 w-5" /></span>
        <div><div className="text-[13px] font-extrabold leading-none text-strong">{m('alanadi.rozet_ucretsiz')}</div><div className="mt-1 text-[11px] text-muted">{m('alanadi.rozet_whois')}</div></div>
      </div>
    </div>
  );
}

function TransferKart() {
  return (
    <div className="relative animate-[fadeup_0.8s_ease-out]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-400/20 opacity-70 blur-[70px]" />
      <div className="overflow-hidden rounded-3xl border border-line/80 bg-surface shadow-[0_40px_90px_-40px_rgba(15,41,66,0.5)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3.5">
          <Icon name="refresh" className="h-4 w-4 shrink-0 text-brandtext" />
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-strong">{m('alanadi.ornek_transfer')}</span>
          <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30">{m('alanadi.arti_bir_yil')}</span>
        </div>
        <ul className="p-2">
          {TRANSFER_ADIM().map((a) => {
            const bitti = a.durum === 'ok', aktif = a.durum === 'aktif';
            return (
              <li key={a.t} className="flex items-center gap-3 rounded-xl px-3 py-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${bitti ? 'bg-emerald-500/15 text-emerald-500' : aktif ? 'bg-brand-700 text-white' : 'bg-surface2 text-muted ring-1 ring-line'}`}>
                  {bitti ? <Icon name="check" className="h-3.5 w-3.5" /> : aktif ? <Icon name="refresh" className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                <span className={`min-w-0 flex-1 text-[14.5px] ${bitti || aktif ? 'font-semibold text-strong' : 'text-muted'}`}>{a.t}</span>
                {aktif && <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-brandtext">{m('alanadi.suruyor')}</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute -bottom-4 -left-2 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite] sm:-left-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name="shield" className="h-5 w-5" /></span>
        <div><div className="text-[13px] font-extrabold leading-none text-strong">{m('alanadi.rozet_kesintisiz')}</div><div className="mt-1 text-[11px] text-muted">{m('alanadi.rozet_acik_kalir')}</div></div>
      </div>
    </div>
  );
}

export default function DomainPage({ mode = 'register', veri }) {
  const { tlds: TLDS, adimlar: STEPS, ozellikler: DFEATURES, sss: SSS } = veri;
  const kopya = COPY();
  const c = kopya[mode] || kopya.register;
  const [q, setQ] = useState('');
  return (
    <SiteShell>
      <Sema veri={[
        sssSemasi(SSS[mode]),
        ekmekKirintisi([{ ad: m('alanadi.ana_sayfa'), yol: '/' }, { ad: c.eyebrow, yol: mode === 'transfer' ? '/transfer' : '/alan-adi' }]),
      ]} />
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full bg-brand-300/25 blur-[120px]" />
          <div className="absolute -top-20 left-[-10%] h-[360px] w-[360px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-2 text-sm text-muted"><Link href="/" className="hover:text-brandtext">{m('alanadi.ana_sayfa')}</Link><span>/</span><span className="font-medium text-strong/70">{c.eyebrow}</span></div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brandline bg-brandsoft/80 px-3.5 py-1.5 text-[13px] font-semibold text-brandtext"><Icon name="globe" className="h-4 w-4" /> {c.eyebrow}</span>
              <h1 className="mt-5 tipo-dev font-extrabold tracking-tight text-strong text-balance">{c.title}</h1>
              <p className="mt-4 max-w-xl tipo-giris text-body">{c.text}</p>
              <form onSubmit={(e) => { e.preventDefault(); const d = q.trim(); if (!d) return; window.location.href = `https://my.sunucumweb.com/domain/${mode === 'transfer' ? 'transfer' : 'register'}?domain=${encodeURIComponent(d)}`; }} className="mt-8">
                <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-[0_20px_50px_-25px_rgba(15,41,66,0.35)] transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
                  <span className="pl-3 text-muted"><Icon name="search" className="h-5 w-5" /></span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.ph} aria-label={m('alanadi.arama_aria')} className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-strong outline-none placeholder:text-muted" />
                  <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-600 sm:px-5 sm:text-[15px]">{c.btn} <Icon name="arrow" className="h-4 w-4" /></button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-body">
                <span className="font-medium text-muted">{m('alanadi.populer')}</span>
                {TLDS.slice(0, 5).map(([t, p]) => <span key={t}><span className="font-semibold text-strong/70">{t}</span> <span className="font-semibold text-brandtext">₺{p}</span></span>)}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-body">
                {c.trust.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-brandtext" /> {t}</span>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              {mode === 'transfer' ? <TransferKart /> : <SonucKart />}
            </div>
          </div>
        </div>
      </section>

      {mode === 'register' && <DomainAI />}

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('alanadi.fiyatlar_etiket')}</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('alanadi.fiyatlar_baslik')}</h2>
          <p className="mt-3 text-body">{m('alanadi.fiyatlar_aciklama')}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TLDS.map(([t, p]) => (
            <div key={t} className="flex flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline">
              <div className="text-2xl font-extrabold text-strong">{t}</div>
              <div className="mt-2 font-bold text-brandtext">₺{p}<span className="text-sm font-medium text-muted">{m('alanadi.yil_eki')}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('alanadi.nasil_calisir')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{c.stepBaslik}</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS[mode].map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-line bg-surface p-7 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-700 text-white font-extrabold">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold text-strong">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{s.d}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('alanadi.avantajlar_etiket')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('alanadi.avantajlar_baslik')}</h2></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DFEATURES.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)] transition-[transform,box-shadow,border-color,opacity] hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-700 group-hover:text-white"><Icon name={f.icon} /></span><h3 className="mt-4 text-[17px] font-bold text-strong">{f.t}</h3><p className="mt-2 text-sm leading-relaxed text-body">{f.d}</p></div>))}
        </div>
      </section>

      <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('alanadi.sss_etiket')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('alanadi.sss_baslik')}</h2></div>
        <Faq items={SSS[mode]} />
      </div></section>

      <CtaBand title={m('alanadi.cta_baslik')} text={m('alanadi.cta_metin')} />
    </SiteShell>
  );
}
