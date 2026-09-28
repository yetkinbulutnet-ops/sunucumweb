'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from './chrome';
import { m } from '@/lib/metin';

const MIN_CHARS = 15;
const MAX_CHARS = 600;

const ORNEKLER = () => [
  { t: m('alanadiai.ornek_1_baslik'), v: m('alanadiai.ornek_1_metin') },
  { t: m('alanadiai.ornek_2_baslik'), v: m('alanadiai.ornek_2_metin') },
  { t: m('alanadiai.ornek_3_baslik'), v: m('alanadiai.ornek_3_metin') },
  { t: m('alanadiai.ornek_4_baslik'), v: m('alanadiai.ornek_4_metin') },
];

const TLD_SECENEKLERI = ['.com', '.com.tr', '.net', '.org', '.co', '.app', '.dev', '.shop', '.online', '.xyz'];

const YUKLENIYOR_ADIMLARI = () => [
  m('alanadiai.yukleniyor_1'),
  m('alanadiai.yukleniyor_2'),
  m('alanadiai.yukleniyor_3'),
];

const DURUM = () => ({
  musait: { etiket: m('alanadiai.durum_musait'), icon: 'check', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  alinmis: { etiket: m('alanadiai.durum_alinmis'), icon: 'xmark', cls: 'bg-rose-50 text-rose-600 ring-rose-200' },
  bilinmiyor: { etiket: m('alanadiai.durum_bilinmiyor'), icon: 'question', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
});

const STIL_ETIKET = () => ({
  kisa: m('alanadiai.stil_kisa'),
  acikanlam: m('alanadiai.stil_acikanlam'),
  yaratici: m('alanadiai.stil_yaratici'),
  sektorel: m('alanadiai.stil_sektorel'),
});

const SIRA = { musait: 0, bilinmiyor: 1, kontrol: 1, alinmis: 2 };

function eskiUsulKopyala(metin) {
  const alan = document.createElement('textarea');
  alan.value = metin;
  alan.setAttribute('readonly', '');
  alan.style.position = 'fixed';
  alan.style.top = '0';
  alan.style.opacity = '0';
  document.body.appendChild(alan);
  alan.select();
  alan.setSelectionRange(0, metin.length);
  let oldu = false;
  try {
    oldu = document.execCommand('copy');
  } catch {
    oldu = false;
  }
  document.body.removeChild(alan);
  return oldu;
}

export default function DomainAI() {

  const [aktif, setAktif] = useState(true);
  const [brief, setBrief] = useState('');
  const [ideas, setIdeas] = useState(null);
  const [durumlar, setDurumlar] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);
  const [adim, setAdim] = useState(0);
  const [hata, setHata] = useState('');
  const [kopyalanan, setKopyalanan] = useState('');
  const [tlds, setTlds] = useState([]);
  const [filtreAcik, setFiltreAcik] = useState(false);
  const [sadeceMusait, setSadeceMusait] = useState(false);
  const [dogrudan, setDogrudan] = useState('');

  const taRef = useRef(null);
  const sonucRef = useRef(null);

  useEffect(() => {
    let iptal = false;
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => {
        const e = d?.engines?.find((x) => x.id === 'domain-ai');
        if (!iptal) setAktif(Boolean(e?.enabled && e?.ready));
      })
      .catch(() => {  });
    return () => { iptal = true; };
  }, []);

  useEffect(() => {
    if (!yukleniyor) return;
    setAdim(0);
    const t = setInterval(() => setAdim((a) => (a + 1) % YUKLENIYOR_ADIMLARI().length), 1100);
    return () => clearInterval(t);
  }, [yukleniyor]);

  useEffect(() => {
    if (!kopyalanan) return;
    const t = setTimeout(() => setKopyalanan(''), 1600);
    return () => clearTimeout(t);
  }, [kopyalanan]);

  const musaitlikGetir = useCallback(async (list) => {
    try {
      const r = await fetch('/api/domain/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: list.map((i) => i.domain) }),
      });
      const d = await r.json();
      if (!d.ok) return;
      setDurumlar(Object.fromEntries(d.results.map((x) => [x.domain, x.status])));
    } catch {

    }
  }, []);

  const uret = useCallback(async () => {
    const metin = brief.trim();
    if (metin.length < MIN_CHARS) {
      setHata(m('alanadiai.hata_kisa', { min: MIN_CHARS }));
      taRef.current?.focus();
      return;
    }
    setYukleniyor(true);
    setHata('');
    setIdeas(null);
    setDurumlar({});

    try {
      const r = await fetch('/api/ai/domain-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: metin, count: 8, tlds: tlds.length ? tlds : undefined }),
      });
      const d = await r.json();

      if (!d.ok) {
        setHata(d.error?.message || m('alanadiai.hata_genel'));
        return;
      }
      setIdeas(d.ideas);
      requestAnimationFrame(() => sonucRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      musaitlikGetir(d.ideas);
    } catch {
      setHata(m('alanadiai.hata_baglanti'));
    } finally {
      setYukleniyor(false);
    }
  }, [brief, tlds, musaitlikGetir]);

  const kopyala = async (domain) => {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(domain);
      } else if (!eskiUsulKopyala(domain)) {
        throw new Error('kopyalanamadi');
      }
      setKopyalanan(domain);
    } catch {
      setHata(m('alanadiai.hata_kopyalama'));
    }
  };

  const tldToggle = (t) => setTlds((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]));

  const sirali = ideas
    ? [...ideas]
        .map((i) => ({ ...i, durum: durumlar[i.domain] || 'kontrol' }))
        .sort((a, b) => (SIRA[a.durum] ?? 1) - (SIRA[b.durum] ?? 1))
        .filter((i) => !sadeceMusait || i.durum === 'musait')
    : null;

  const musaitSayisi = sirali ? sirali.filter((i) => i.durum === 'musait').length : 0;
  const az = brief.trim().length > 0 && brief.trim().length < MIN_CHARS;

  if (!aktif) return null;

  return (
    <section className="relative overflow-hidden bg-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-6%] h-[440px] w-[440px] rounded-full bg-brand-500/20 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-6%] h-[380px] w-[380px] rounded-full bg-brand-400/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1.5 text-[13px] font-semibold text-brand-300">
            <Icon name="sparkles" className="w-4 h-4" /> {m('alanadiai.rozet')}
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-white text-balance leading-[1.12]">
            {m('alanadiai.baslik_1')}<br className="hidden sm:block" /> {m('alanadiai.baslik_2')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-slate-300">
            {m('alanadiai.aciklama')}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-sm shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
          <div className="rounded-[1.25rem] bg-surface p-5 sm:p-7">
            <label htmlFor="ai-brief" className="block text-sm font-bold text-strong">
              {m('alanadiai.brief_etiket')}
            </label>

            <div className="relative mt-3">
              <textarea
                id="ai-brief"
                ref={taRef}
                value={brief}
                maxLength={MAX_CHARS}
                onChange={(e) => { setBrief(e.target.value); if (hata) setHata(''); }}
                onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') uret(); }}
                rows={4}
                placeholder={m('alanadiai.brief_ph')}
                className={`w-full resize-none rounded-2xl border bg-surface2/60 px-4 py-3.5 text-[15px] leading-relaxed text-strong placeholder:text-muted outline-none transition focus:bg-surface focus:ring-4 ${
                  az ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100' : 'border-line focus:border-brand-400 focus:ring-brand-100'
                }`}
              />
              <span className={`pointer-events-none absolute bottom-3 right-3 text-[11px] font-semibold tabular-nums ${az ? 'text-amber-500' : 'text-muted'}`}>
                {brief.length}/{MAX_CHARS}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-medium text-muted">{m('alanadiai.ornek_etiket')}</span>
              {ORNEKLER().map((o) => (
                <button
                  key={o.t}
                  type="button"
                  onClick={() => { setBrief(o.v); setHata(''); taRef.current?.focus(); }}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-strong/70 hover:border-brandtext/50 hover:bg-brandsoft hover:text-brandtext transition"
                >
                  {o.t}
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setFiltreAcik((v) => !v)}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-body hover:text-brandtext transition"
                aria-expanded={filtreAcik}
              >
                <Icon name="chevron" className={`w-4 h-4 transition-transform ${filtreAcik ? 'rotate-180' : ''}`} />
                {m('alanadiai.uzanti_tercihi')} {tlds.length > 0 && <span className="rounded-full bg-brandline/60 px-2 py-0.5 text-[11px] font-bold text-brandtext">{m('alanadiai.secili_sayi', { sayi: tlds.length })}</span>}
              </button>
              {filtreAcik && (
                <div className="mt-3 flex flex-wrap gap-2 animate-[fadeup_0.25s_ease-out]">
                  {TLD_SECENEKLERI.map((t) => {
                    const secili = tlds.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => tldToggle(t)}
                        aria-pressed={secili}
                        className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition ${
                          secili ? 'bg-brand-700 text-white shadow shadow-brand-500/30' : 'bg-surface2 text-body hover:bg-line'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                  {tlds.length > 0 && (
                    <button type="button" onClick={() => setTlds([])} className="px-2 text-[13px] font-semibold text-muted hover:text-strong">
                      {m('alanadiai.temizle')}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={uret}
                disabled={yukleniyor}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {yukleniyor ? (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 3a9 9 0 1 0 9 9" />
                    </svg>
                    {YUKLENIYOR_ADIMLARI()[adim]}
                  </>
                ) : (
                  <>
                    <Icon name="sparkles" className="w-4 h-4" />
                    {ideas ? m('alanadiai.yeni_fikir') : m('alanadiai.oneri_al')}
                  </>
                )}
              </button>
              <span className="text-[13px] text-muted">
                {m('alanadiai.veya')} <kbd className="rounded border border-line bg-surface2 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-body">Ctrl</kbd>
                {' + '}
                <kbd className="rounded border border-line bg-surface2 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-body">Enter</kbd>
              </span>
            </div>

            {hata && (
              <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-[14px] font-medium text-rose-700">
                <Icon name="question" className="mt-0.5 w-4 h-4 shrink-0" /> {hata}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:flex-row sm:items-center">
          <div className="shrink-0 text-[13.5px] text-slate-300">
            <span className="font-semibold text-white">{m('alanadiai.isim_var_mi')}</span>
            <span className="hidden sm:inline"> {m('alanadiai.dogrudan_sorgula')}</span>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); const d = dogrudan.trim(); if (!d) return; window.location.href = `https://my.sunucumweb.com/domain/register?domain=${encodeURIComponent(d)}`; }}
            className="flex flex-1 items-center gap-2 rounded-xl border border-white/15 bg-ink/40 p-1.5"
          >
            <span className="pl-2 text-slate-400"><Icon name="search" className="w-4 h-4" /></span>
            <input
              value={dogrudan}
              onChange={(e) => setDogrudan(e.target.value)}
              placeholder={m('alanadiai.dogrudan_ph')}
              aria-label={m('alanadiai.dogrudan_aria')}
              className="min-w-0 flex-1 bg-transparent py-1.5 text-[14px] text-white placeholder:text-slate-400 outline-none"
            />
            <button type="submit" className="shrink-0 rounded-lg bg-white/10 px-4 py-2 text-[13px] font-bold text-white ring-1 ring-white/20 transition-colors hover:bg-white/20">
              {m('alanadiai.sorgula')}
            </button>
          </form>
        </div>

        <div ref={sonucRef} aria-live="polite" className="scroll-mt-24">
          {yukleniyor && (
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-white/15" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          )}

          {sirali && !yukleniyor && (
            <div className="mt-10 animate-[fadeup_0.4s_ease-out]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[15px] text-slate-300">
                  <span className="font-bold text-white">{m('alanadiai.oneri_sayi', { sayi: ideas.length })}</span> {m('alanadiai.hazir')}
                  {musaitSayisi > 0 && <> · <span className="font-bold text-brand-300">{m('alanadiai.musait_sayi', { sayi: musaitSayisi })}</span></>}
                </p>
                <button
                  type="button"
                  onClick={() => setSadeceMusait((v) => !v)}
                  aria-pressed={sadeceMusait}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-bold ring-1 transition ${
                    sadeceMusait ? 'bg-brand-700 text-white ring-brand-400' : 'bg-white/5 text-slate-300 ring-white/15 hover:bg-white/10'
                  }`}
                >
                  {m('alanadiai.sadece_musait')}
                </button>
              </div>

              {sirali.length === 0 ? (
                <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center text-[15px] text-slate-300">
                  {m('alanadiai.bos_1')} <button type="button" onClick={() => setSadeceMusait(false)} className="font-bold text-brand-300 underline underline-offset-4">{m('alanadiai.bos_tumu')}</button> {m('alanadiai.bos_2')}
                </p>
              ) : (
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  {sirali.map((i) => {
                    const d = DURUM()[i.durum];
                    const alinmis = i.durum === 'alinmis';
                    return (
                      <div
                        key={i.domain}
                        className={`group relative overflow-hidden rounded-2xl border p-5 transition-[transform,box-shadow,border-color,opacity] duration-300 ${
                          alinmis
                            ? 'border-white/5 bg-white/[0.03] opacity-70'
                            : 'border-white/10 bg-white/[0.07] hover:-translate-y-1 hover:border-brand-400/40 hover:bg-white/[0.1]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[19px] font-extrabold tracking-tight text-white">
                              {i.label}<span className="text-brand-300">{i.tld}</span>
                            </div>
                            <span className="mt-1.5 inline-block rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-300">
                              {STIL_ETIKET()[i.style] || m('alanadiai.stil_varsayilan')}
                            </span>
                          </div>
                          {d ? (
                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${d.cls}`}>
                              <Icon name={d.icon} className="w-3 h-3" /> {d.etiket}
                            </span>
                          ) : (
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300" /> {m('alanadiai.kontrol_ediliyor')}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-[14px] leading-relaxed text-slate-300">{i.why}</p>

                        <div className="mt-4 flex items-center gap-2">
                          <a
                            href={`https://my.sunucumweb.com/domain/register?domain=${encodeURIComponent(i.domain)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-bold transition ${
                              alinmis
                                ? 'bg-white/10 text-slate-300 hover:bg-white/15'
                                : 'bg-brand-700 text-white shadow shadow-brand-500/25 hover:bg-brand-400'
                            }`}
                          >
                            {alinmis ? m('alanadiai.yine_sorgula') : m('alanadiai.hemen_al')} <Icon name="arrow" className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => kopyala(i.domain)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-[13px] font-bold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                          >
                            <Icon name={kopyalanan === i.domain ? 'check' : 'copy'} className="w-3.5 h-3.5" />
                            {kopyalanan === i.domain ? m('alanadiai.kopyalandi') : m('alanadiai.kopyala')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-6 text-center text-[13px] leading-relaxed text-muted">
                {m('alanadiai.not_1')} <span className="text-slate-300">{m('alanadiai.not_etiket')}</span> {m('alanadiai.not_2')} <span className="text-slate-300">.com.tr</span>{m('alanadiai.not_3')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
