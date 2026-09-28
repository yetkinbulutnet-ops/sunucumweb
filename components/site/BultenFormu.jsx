'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { m } from '@/lib/metin';
import { turnstileYukle } from '@/lib/turnstile';
import { TURNSTILE_SITE_KEY } from '@/lib/guvenlik-config';
import { useSiteAyarlari } from './SiteAyarlari';

const EPOSTA_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const METIN = {
  footer: ['bulten.baslik_footer', 'bulten.aciklama_footer'],
  anasayfa: ['bulten.baslik_anasayfa', 'bulten.aciklama_anasayfa'],
  kampanyalar: ['bulten.baslik_kampanyalar', 'bulten.aciklama_kampanyalar'],
  blog: ['bulten.baslik_blog', 'bulten.aciklama_blog'],
};

function Zarf({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

export default function BultenFormu({ kaynak }) {
  const ayar = useSiteAyarlari()?.bulten;
  const kimlik = useId();
  const koyu = kaynak === 'footer';
  const [eposta, setEposta] = useState('');
  const [izin, setIzin] = useState(false);
  const [bal, setBal] = useState('');
  const [durum, setDurum] = useState('bos');
  const [mesaj, setMesaj] = useState('');
  const kutu = useRef(null);
  const widget = useRef(null);
  const token = useRef('');

  useEffect(
    () => () => {
      try {
        if (widget.current != null) window.turnstile?.remove(widget.current);
      } catch {}
    },
    []
  );

  if (!ayar?.[kaynak]) return null;

  const hazirla = async () => {
    if (widget.current != null || !kutu.current) return;
    try {
      const ts = await turnstileYukle();
      if (widget.current != null || !kutu.current) return;
      widget.current = ts.render(kutu.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: koyu ? 'dark' : 'auto',
        language: 'tr',
        size: 'flexible',
        appearance: 'interaction-only',
        callback: (t) => {
          token.current = t;
        },
        'expired-callback': () => {
          token.current = '';
        },
        'error-callback': () => {
          token.current = '';
        },
      });
    } catch {}
  };

  const tokenBekle = async () => {
    await hazirla();
    const bitis = Date.now() + 12000;
    while (!token.current && Date.now() < bitis) await new Promise((r) => setTimeout(r, 200));
    return token.current;
  };

  const sifirla = () => {
    token.current = '';
    try {
      if (widget.current != null) window.turnstile.reset(widget.current);
    } catch {}
  };

  const gonder = async (e) => {
    e.preventDefault();
    setMesaj('');
    const adres = eposta.trim();
    if (!EPOSTA_RE.test(adres)) return (setDurum('hata'), setMesaj(m('bulten.hata_eposta')));
    if (!izin) return (setDurum('hata'), setMesaj(m('bulten.hata_izin')));
    setDurum('gonderiliyor');
    const t = await tokenBekle();
    if (!t) return (setDurum('hata'), setMesaj(m('bulten.hata_dogrulama')));
    try {
      const r = await fetch('/api/abone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eposta: adres, izin, kaynak, token: t, web: bal }),
      });
      const j = await r.json().catch(() => ({}));
      sifirla();
      if (!r.ok || !j.data) return (setDurum('hata'), setMesaj(j.error?.message || m('bulten.hata_genel')));
      setDurum(j.data.durum === 'aktif' ? 'aktif' : 'beklemede');
      setMesaj(j.data.durum === 'aktif' ? m('bulten.basari_aktif') : m('bulten.basari_onay', { eposta: adres }));
    } catch {
      sifirla();
      setDurum('hata');
      setMesaj(m('bulten.hata_baglanti'));
    }
  };

  const tamam = durum === 'aktif' || durum === 'beklemede';
  const [baslikAnahtari, aciklamaAnahtari] = METIN[kaynak] || METIN.footer;
  const baslik = m(baslikAnahtari);
  const aciklama = m(aciklamaAnahtari);

  const govde = (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${koyu ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25' : 'bg-brandsoft text-brandtext ring-1 ring-brandline'}`}>
            <Zarf className="h-5 w-5" />
          </span>
          <span className={`text-[12px] font-bold uppercase tracking-[0.14em] ${koyu ? 'text-brand-300' : 'text-brandtext'}`}>{m('bulten.ust_baslik')}</span>
        </div>
        <h2 className={`mt-3 text-xl font-extrabold tracking-tight text-balance sm:text-2xl ${koyu ? 'text-white' : 'text-strong'}`}>{baslik}</h2>
        {aciklama && <p className={`mt-2 text-[14.5px] leading-relaxed ${koyu ? 'text-slate-400' : 'text-body'}`}>{aciklama}</p>}
      </div>
      <div className="min-w-0">
        {tamam ? (
          <div role="status" className={`flex items-start gap-3 rounded-2xl px-4 py-4 text-[14.5px] leading-relaxed ${koyu ? 'bg-brand-500/10 text-slate-200 ring-1 ring-brand-400/25' : 'bg-brandsoft text-strong ring-1 ring-brandline'}`}>
            <svg viewBox="0 0 24 24" className={`mt-0.5 h-5 w-5 shrink-0 ${koyu ? 'text-brand-300' : 'text-brandtext'}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span className="min-w-0 break-words">{mesaj}</span>
          </div>
        ) : (
          <form onSubmit={gonder} noValidate>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor={`${kimlik}-e`} className="sr-only">{m('bulten.eposta_etiket')}</label>
              <input
                id={`${kimlik}-e`}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={eposta}
                onChange={(e) => setEposta(e.target.value)}
                onFocus={hazirla}
                disabled={durum === 'gonderiliyor'}
                placeholder={m('bulten.eposta_placeholder')}
                className={`min-w-0 flex-1 rounded-xl px-4 py-3 text-[15px] outline-none transition focus:ring-4 ${koyu ? 'border border-white/15 bg-white/5 text-white placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-400/20' : 'border border-line bg-page text-strong focus:border-brand-500 focus:ring-brand-500/15'}`}
              />
              <button
                type="submit"
                disabled={durum === 'gonderiliyor'}
                data-umami-event={`bulten-${kaynak}`}
                className="shrink-0 rounded-xl bg-brand-700 px-5 py-3 text-[15px] font-bold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {durum === 'gonderiliyor' ? m('bulten.gonderiliyor') : m('bulten.buton')}
              </button>
            </div>
            <div aria-hidden="true" className="sr-only">
              <input type="text" tabIndex={-1} autoComplete="off" value={bal} onChange={(e) => setBal(e.target.value)} />
            </div>
            <label className={`mt-3 flex items-start gap-2.5 text-[13px] leading-snug ${koyu ? 'text-slate-400' : 'text-body'}`}>
              <input type="checkbox" checked={izin} onChange={(e) => (setIzin(e.target.checked), hazirla())} disabled={durum === 'gonderiliyor'} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500" />
              <span className="min-w-0">
                <Link href="/legal/gizlilik-sozlesmesi" target="_blank" className={`font-semibold underline ${koyu ? 'text-brand-300' : 'text-brandtext'}`}>{m('bulten.izin_link')}</Link> {m('bulten.izin_metni')}
              </span>
            </label>
            <div ref={kutu} className="w-full [&>*]:mt-3" />
            {durum === 'hata' && mesaj && (
              <p role="alert" className={`mt-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ring-1 ${koyu ? 'bg-rose-500/10 text-rose-300 ring-rose-400/25' : 'bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:text-rose-400'}`}>{mesaj}</p>
            )}
            <p className={`mt-2.5 text-[12px] ${koyu ? 'text-slate-400' : 'text-muted'}`}>{m('bulten.not')}</p>
          </form>
        )}
      </div>
    </div>
  );

  if (koyu) return <div className="relative mb-12 overflow-hidden rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8">{govde}</div>;

  return (
    <section className="mx-auto max-w-7xl px-5 pt-16 lg:px-8 lg:pt-20">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-300/20 blur-[90px]" />
        <div className="relative">{govde}</div>
      </div>
    </section>
  );
}
