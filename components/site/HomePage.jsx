'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import BultenFormu from './BultenFormu';

import { QUESTIONS, recommend } from '@/lib/engines/product-finder';
import { m } from '@/lib/metin';
import { scrollKilitle } from '@/lib/engines/scroll-lock';
import DomainAI from './DomainAI';
import DurumWidget from './DurumWidget';
import LogoSerit from './LogoSerit';
import Sema from './Sema';
import { sssSemasi } from '@/lib/semalar';

const SLAYT_BOYUTLARI = '(min-width: 488px) 448px, calc(100vw - 40px)';

function Hero({ slaytlar: SLIDES }) {
  const [i, setI] = useState(0);
  const [duraklat, setDuraklat] = useState(false);
  const adet = SLIDES.length;
  const go = useCallback((n) => setI((n + adet) % adet), [adet]);
  const dokunus = useRef(null);

  useEffect(() => {
    if (duraklat || adet < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % adet), 7000);
    return () => clearInterval(t);
  }, [duraklat, adet]);

  const dokunBasla = (e) => {
    const n = e.touches[0];
    dokunus.current = { x: n.clientX, y: n.clientY };
  };

  const dokunBitir = (e) => {
    const bas = dokunus.current;
    dokunus.current = null;
    if (!bas) return;
    const n = e.changedTouches[0];
    const dx = n.clientX - bas.x;
    const dy = n.clientY - bas.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
  };

  const s = SLIDES[i];
  if (!s) return null;

  return (
    <section
      className="relative touch-pan-y overflow-hidden bg-ink"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setDuraklat(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setDuraklat(false)}
      onTouchStart={dokunBasla}
      onTouchEnd={dokunBitir}
      onTouchCancel={() => { dokunus.current = null; }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-6%] h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="absolute -bottom-32 left-[-8%] h-[440px] w-[440px] rounded-full bg-brand-400/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div key={i} className="min-w-0 animate-[fadeup_0.6s_ease-out] lg:flex lg:min-h-[460px] lg:flex-col lg:justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-semibold text-white backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              {s.eyebrow}
            </span>

            <h1 className="mt-5 text-[2rem] leading-[1.1] sm:text-[2.6rem] lg:text-5xl xl:text-[3.4rem] font-extrabold tracking-tight text-white text-balance">
              {s.pre}{' '}
              <span className="relative">
                <span className="relative z-10 text-brand-300">{s.hl}</span>
                <span aria-hidden className="absolute bottom-1 left-0 z-0 h-2.5 w-full rounded bg-brand-400/25" />
              </span>{s.post ? ' ' + s.post : ''}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-slate-300">{s.text}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={s.cta.href} className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-900/40 transition-colors hover:bg-brand-800 sm:px-6 sm:py-3.5 sm:text-[15px]">
                {s.cta.t} <Icon name="arrow" className="h-4 w-4" />
              </Link>
              {s.cta2 && <Link href={s.cta2.href} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[14px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-6 sm:py-3.5 sm:text-[15px]">
                {s.cta2.t}
              </Link>}
            </div>

            {s.rozet && (
              <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-slate-200">
                <Icon name={s.rozet[1]} className="h-4 w-4 text-brand-300" />
                {s.rozet[0]}
              </div>
            )}
          </div>

          <div className="relative">
            <div aria-hidden className="absolute -inset-5 -z-10 rounded-[2.75rem] bg-brand-500/15 blur-[70px]" />
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
              {SLIDES.map((sl, n) => (
                <div
                  key={sl.img}
                  aria-hidden={n !== i}
                  className={`absolute inset-0 overflow-hidden rounded-3xl border border-white/10 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.75)] transition-opacity duration-700 ease-out ${n === i ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={sl.img} srcSet={sl.srcSet || undefined} sizes={sl.srcSet ? SLAYT_BOYUTLARI : undefined} alt={sl.imgAlt} width={800} height={600} loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : 'auto'} className="h-full w-full object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                </div>
              ))}
              {s.stat && <div className="absolute -left-5 bottom-6 rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 shadow-xl backdrop-blur">
                <div className="text-xl font-extrabold leading-none text-brand-300">{s.stat[0]}</div>
                <div className="mt-1 text-[11px] text-slate-300">{s.stat[1]}</div>
              </div>}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 sm:mt-12">
          {SLIDES.map((_, n) => (
            <button key={n} onClick={() => go(n)} aria-label={m('anasayfa.slayt', { no: n + 1 })} aria-current={n === i} className="group/n py-2">
              <span className={`block h-1 overflow-hidden rounded-full bg-white/25 transition-[width] duration-300 ${n === i ? 'w-12' : 'w-6 group-hover/n:bg-white/50'}`}>
                {n === i && (
                  <span key={`ilerleme-${i}-${duraklat}`} className="block h-full rounded-full bg-brand-400" style={duraklat ? { width: '100%' } : { animation: 'slaytIlerle 7s linear forwards' }} />
                )}
              </span>
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button onClick={() => go(i - 1)} aria-label={m('anasayfa.onceki_slayt')} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button onClick={() => go(i + 1)} aria-label={m('anasayfa.sonraki_slayt')} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductFinder({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  useEffect(() => { if (open) { setStep(0); setAns({}); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    const coz = scrollKilitle();
    return () => { window.removeEventListener('keydown', esc); coz(); };
  }, [open, onClose]);
  if (!open) return null;
  const sorular = QUESTIONS();
  const done = step >= sorular.length;
  const rec = done ? recommend(ans) : null;
  const pick = (key, v) => { const na = { ...ans, [key]: v }; setAns(na); setStep((s) => s + 1); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-[fadeup_0.2s_ease-out]" />
      <div className="relative w-full max-w-lg rounded-3xl bg-surface p-7 sm:p-9 shadow-2xl animate-[fadeup_0.35s_ease-out]">
        <button onClick={onClose} aria-label={m('genel.kapat')} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface2 hover:text-strong"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        <div className="flex items-center gap-2">{sorular.map((_, n) => (<span key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n < step ? 'bg-brand-500' : n === step ? 'bg-brand-300' : 'bg-line'}`} />))}</div>

        {!done ? (
          <div key={step} className="mt-7 animate-[fadeup_0.3s_ease-out]">
            <div className="text-[13px] font-bold uppercase tracking-wider text-brandtext">{m('urunbulucu.adim', { adim: step + 1, toplam: sorular.length })}</div>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-strong text-balance">{sorular[step].q}</h3>
            <div className="mt-6 grid gap-3">
              {sorular[step].opts.map((o) => (
                <button key={o.v} onClick={() => pick(sorular[step].key, o.v)} className="group flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 text-left hover:border-brand-400 hover:bg-brandsoft/50 transition-[transform,box-shadow,border-color,opacity]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext group-hover:bg-brand-700 group-hover:text-white transition-colors"><Icon name={o.icon} className="w-5 h-5" /></span>
                  <span className="flex-1 text-[15px] font-semibold text-strong">{o.l}</span>
                  <Icon name="arrow" className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-[transform,box-shadow,border-color,opacity]" />
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="mt-5 text-sm font-semibold text-muted hover:text-strong">{m('urunbulucu.geri')}</button>}
          </div>
        ) : (
          <div className="mt-7 text-center animate-[fadeup_0.4s_ease-out]">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-500/30"><Icon name="check" className="w-7 h-7" /></span>
            <div className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brandtext">{m('urunbulucu.onerimiz')}</div>
            <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-strong">{rec.name}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-body">{rec.why}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={rec.slug} onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-800 transition">{m('urunbulucu.urun_incele', { ad: rec.name })} <Icon name="arrow" className="w-4 h-4" /></Link>
              <button onClick={() => { setStep(0); setAns({}); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface2 px-6 py-3.5 text-[15px] font-semibold text-strong hover:bg-line transition"><Icon name="refresh" className="w-4 h-4" /> {m('urunbulucu.bastan')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FinderBanner({ onOpen }) {
  return (
    <section className="relative overflow-hidden bg-surface2">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-page to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brandline/20 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-brandline/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-600/25">
              <Icon name="chat" className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-strong text-balance">
                {m('anasayfa.bulucu_baslik')}
              </h2>
              <p className="mt-1.5 text-[15px] text-body">
                {m('anasayfa.bulucu_metin')}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              onClick={onOpen}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-ink/20 transition-colors hover:bg-brand-600"
            >
              {m('anasayfa.bulucu_buton')} <Icon name="arrow" className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('cozumler')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext"
            >
              <Icon name="layers" className="w-4 h-4 text-brandtext" /> {m('anasayfa.tum_urunler')}
            </button>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}

function FinderTab({ onOpen }) {
  return (
    <button onClick={onOpen} className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-2 rounded-l-2xl bg-brand-700 px-3 py-4 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-800 hover:pr-5 transition-[transform,box-shadow,border-color,opacity] [writing-mode:vertical-rl] rotate-180" aria-label={m('anasayfa.urun_bulucu')}>
      <Icon name="chat" className="w-5 h-5 rotate-90" /> <span className="text-[13px] font-bold tracking-wide">{m('anasayfa.sana_uygun')}</span>
    </button>
  );
}

function AltyapiVitrin({ maddeler: ALTYAPI_OZ, b }) {
  return (
    <section className="border-y border-line bg-surface2">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                <img src="/img/galeri/kabin-dellemc.webp" alt={m('anasayfa.alt_kabinler')} width={1280} height={800} loading="lazy" className="h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl bg-ink/70 px-3 py-2 text-white backdrop-blur">
                  <Icon name="pin" className="h-4 w-4 text-brand-300" />
                  <span className="text-[12.5px] font-semibold">{m('anasayfa.lokasyon')}</span>
                </div>
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-line">
                <img src="/img/galeri/kabin-gpu.webp" alt={m('anasayfa.alt_gpu')} width={800} height={800} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-line">
                <img src="/img/galeri/kabin-acik.webp" alt={m('anasayfa.alt_kablolama')} width={800} height={800} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{b.eyebrow}</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{b.baslik}</h2>
            <p className="mt-4 tipo-metin text-body">{b.aciklama}</p>
            <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              {ALTYAPI_OZ.map((f) => (
                <div key={f.t} className="flex gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span>
                  <div className="min-w-0"><h3 className="text-[15.5px] font-bold text-strong">{f.t}</h3><p className="mt-1 text-[13.5px] leading-relaxed text-body">{f.d}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/hakkimizda" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-brand-600">{m('anasayfa.sirket_profili')} <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/sunucu-barindirma" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-[14.5px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext">{m('anasayfa.vm_cozumleri')}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaketlerVitrin({ paketler: OZET_PAKETLER, b }) {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{b.eyebrow}</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{b.baslik}</h2>
          <p className="mt-4 tipo-metin text-body">{b.aciklama}</p>
        </div>
        <Link href="/iletisim" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-[14px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext">
          {m('anasayfa.tum_paketler')} <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
        {OZET_PAKETLER.map((p) => (
          <div key={p.urun} className={`relative flex flex-col rounded-3xl p-7 transition-[transform,box-shadow,border-color] duration-300 ${p.vurgu ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgba(15,41,66,0.6)] lg:-translate-y-3 ring-1 ring-brand-400/40' : 'bg-surface border border-line shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] hover:-translate-y-1'}`}>
            {p.vurgu && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-700 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-brand-500/40">{m('anasayfa.en_populer')}</span>}
            <div className="flex items-center gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${p.vurgu ? 'bg-white/10 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name={p.icon} /></span>
              <div>
                <div className={`text-[12px] font-bold uppercase tracking-wide ${p.vurgu ? 'text-slate-300' : 'text-muted'}`}>{p.urun}</div>
                <div className={`text-[18px] font-extrabold ${p.vurgu ? 'text-white' : 'text-strong'}`}>{p.paket}</div>
              </div>
            </div>
            <p className={`mt-4 text-[14px] leading-relaxed ${p.vurgu ? 'text-slate-300' : 'text-body'}`}>{p.ozet}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className={`text-sm font-semibold ${p.vurgu ? 'text-slate-300' : 'text-muted'}`}>₺</span>
              <span className={`text-4xl font-extrabold tracking-tight ${p.vurgu ? 'text-white' : 'text-strong'}`}>{p.fiyat}</span>
              <span className={`text-sm ${p.vurgu ? 'text-slate-300' : 'text-muted'}`}>{m('anasayfa.ay')}</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {p.ozellikler.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]">
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.vurgu ? 'bg-brand-500/20 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name="check" className="w-3 h-3" /></span>
                  <span className={p.vurgu ? 'text-slate-200' : 'text-body'}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/iletisim" className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-bold transition-colors ${p.vurgu ? 'bg-brand-700 text-white hover:bg-brand-400' : 'bg-ink text-white hover:bg-brand-600'}`}>{m('anasayfa.teklif_al')} <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-[13px] text-muted">{m('anasayfa.paket_notu')}</p>
    </section>
  );
}

function YazilimVitrin({ yazilimlar: YAZILIMLAR, kategoriler: YAZILIM_KATEGORILERI, b }) {
  const one = YAZILIMLAR.filter((y) => y.oneCikan).slice(0, 4);
  const kat = (s) => YAZILIM_KATEGORILERI.find((k) => k.slug === s);
  return (
    <section className="bg-surface2 border-y border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{b.eyebrow}</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{b.baslik}</h2>
            <p className="mt-4 tipo-metin text-body">{b.aciklama}</p>
          </div>
          <Link href="/hazir-yazilim" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-800">
            {m('anasayfa.tum_yazilimlar')} <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {one.map((y) => {
            const k = kat(y.kategori);
            return (
              <Link key={y.id} href="/hazir-yazilim" className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-700 group-hover:text-white"><Icon name={k ? k.icon : 'layers'} /></span>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">{k ? k.ad : m('anasayfa.yazilim')}</div>
                <h3 className="mt-1 text-[16px] font-extrabold text-strong">{y.ad}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-body">{y.aciklama}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brandtext">{m('anasayfa.incele')} <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MarkaSeridi({ markalar: MARKALAR, baslik, b }) {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{b.eyebrow}</span>
        <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{baslik}</h2>
        <p className="mt-4 tipo-metin text-body">{b.aciklama}</p>
      </div>
      <div className="mt-10"><LogoSerit liste={MARKALAR} boyut="serit" /></div>
    </section>
  );
}

function AnaSSS({ sss: SSS_ANA, b }) {
  const [acik, setAcik] = useState(0);
  return (
    <section className="bg-surface2 border-y border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{b.eyebrow}</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{b.baslik}</h2>
        </div>
        <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
          {SSS_ANA.map((f, i) => (
            <div key={f.q} className="px-6">
              <button onClick={() => setAcik(acik === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="text-[15px] font-semibold text-strong">{f.q}</span>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brandsoft text-brandtext transition-transform ${acik === i ? 'rotate-45' : ''}`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              {acik === i && <p className="pb-5 -mt-1 text-[15px] leading-relaxed text-body">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ yazilimlar, kategoriler, markalar, markaSeridi, slaytlar, anasayfa }) {
  const { rakamlar: STATS, ozellikler: FEATURES, paketler, sss: SSS_ANA, kategoriler: KATEGORILER, altyapiMaddeleri, bolumler: B } = anasayfa;
  const [finder, setFinder] = useState(false);
  const openF = useCallback(() => setFinder(true), []);
  const closeF = useCallback(() => setFinder(false), []);
  return (
    <SiteShell>
      <Sema veri={sssSemasi(SSS_ANA)} />
      <Hero slaytlar={slaytlar} />
      <FinderBanner onOpen={openF} />
      <FinderTab onOpen={openF} />
      <ProductFinder open={finder} onClose={closeF} />

      <DomainAI />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{B.neden.eyebrow}</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{B.neden.baslik}</h2><p className="mt-4 text-lg text-body">{B.neden.aciklama}</p></div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 md:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-brandtext">{n}</div>
              <div className="mt-1 text-[14px] font-medium text-body">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{FEATURES.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-20px_rgba(15,41,66,0.18)] hover:shadow-[0_24px_60px_-24px_rgba(20,184,166,0.35)] hover:-translate-y-1 transition-[transform,box-shadow,border-color,opacity] duration-300"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext group-hover:bg-brand-700 group-hover:text-white transition-colors"><Icon name={f.icon} /></span><h3 className="mt-5 text-lg font-bold text-strong">{f.t}</h3><p className="mt-2 text-[15px] leading-relaxed text-body">{f.d}</p></div>))}</div>
      </section>

      <AltyapiVitrin maddeler={altyapiMaddeleri} b={B.altyapi} />

      <PaketlerVitrin paketler={paketler} b={B.paketler} />

      <section id="cozumler" className="relative scroll-mt-28 bg-surface2 border-y border-line">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{B.cozumler.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{B.cozumler.baslik}</h2>
            <p className="mt-4 text-lg text-body">
              {B.cozumler.aciklama}
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-start">
            {KATEGORILER.map((k) => (
              <div
                key={k.baslik}
                className={`flex h-full flex-col rounded-3xl border bg-surface p-6 shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(20,184,166,0.35)] ${k.one ? 'border-brandline ring-1 ring-brandline' : 'border-line'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext">
                    <Icon name={k.icon} className="w-5 h-5" />
                  </span>
                  <h3 className="text-[17px] font-extrabold text-strong">{k.baslik}</h3>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-body">{k.ozet}</p>

                <ul className="mt-5 flex-1 space-y-1">
                  {k.urunler.map((u) => (
                    <li key={u.href + u.t}>
                      <Link
                        href={u.href}
                        className="group/u flex items-start gap-2 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-brandsoft"
                      >
                        <Icon name="arrow" className="mt-0.5 w-3.5 h-3.5 shrink-0 text-brandtext transition-transform group-hover/u:translate-x-0.5" />
                        <span className="min-w-0">
                          <span className="block text-[14px] font-semibold text-strong">{u.t}</span>
                          <span className="block text-[12.5px] leading-snug text-muted">{u.d}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[15px] text-body">
            {m('anasayfa.emin_degil')}{' '}
            <Link href="/iletisim" className="font-bold text-brandtext hover:underline underline-offset-4">{m('anasayfa.uzmana_sorun')}</Link>
          </p>
        </div>
      </section>

      <YazilimVitrin yazilimlar={yazilimlar} kategoriler={kategoriler} b={B.yazilim} />

      <MarkaSeridi markalar={markalar} baslik={markaSeridi.baslik} b={B.referans} />

      <AnaSSS sss={SSS_ANA} b={B.sss} />
      <BultenFormu kaynak="anasayfa" />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{B.durum.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{B.durum.baslik}</h2>
          <p className="mt-4 text-lg text-body">{B.durum.aciklama}</p>
        </div>
        <div className="mt-10 flex justify-center">
          <DurumWidget />
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink"><div aria-hidden className="pointer-events-none absolute inset-0"><div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand-500/20 blur-[100px]" /><div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-brand-400/10 blur-[100px]" /></div><div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20"><div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center"><div><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">{B.guven.baslik}</h2><p className="mt-4 text-lg text-slate-300">{B.guven.aciklama}</p><Link href="/hakkimizda" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[15px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 transition">{m('anasayfa.hikayemiz')} <Icon name="arrow" className="w-4 h-4" /></Link></div><div className="grid grid-cols-2 gap-4">{STATS.map(([n, l]) => (<div key={l} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 backdrop-blur"><div className="text-3xl sm:text-4xl font-extrabold text-brand-300">{n}</div><div className="mt-1 text-sm text-slate-300">{l}</div></div>))}</div></div></div></section>
      <CtaBand />
    </SiteShell>
  );
}
