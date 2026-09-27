'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TURNSTILE_SITE_KEY } from '@/lib/guvenlik-config';
import { m } from '@/lib/metin';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const RENK = {
  turkuaz: ['#14b8a6', '#ffffff'],
  lacivert: ['#1c3a57', '#ffffff'],
  amber: ['#f59e0b', '#0f2942'],
  gul: ['#f43f5e', '#ffffff'],
  mor: ['#8b5cf6', '#ffffff'],
  yesil: ['#10b981', '#ffffff'],
  gri: ['#64748b', '#ffffff'],
};

const nokta = (aci, r) => {
  const rad = (aci * Math.PI) / 180;
  return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)];
};

function Cark({ dilimler, aci, sure, donusBitti }) {
  const n = dilimler.length;
  const d = 360 / n;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_20px_40px_rgba(15,41,66,0.35)]" role="img" aria-label={m('cark.cark_aria')}>
        <circle cx="100" cy="100" r="99" fill="#0f2942" />
        <g
          style={{ transform: `rotate(${aci}deg)`, transformOrigin: '100px 100px', transition: sure ? `transform ${sure}ms cubic-bezier(0.12, 0.72, 0.1, 1)` : 'none' }}
          onTransitionEnd={donusBitti}
        >
          {dilimler.map((s, i) => {
            const a0 = -90 + i * d;
            const a1 = a0 + d;
            const [x0, y0] = nokta(a0, 94);
            const [x1, y1] = nokta(a1, 94);
            const [dolgu, yazi] = RENK[s.renk] || RENK.turkuaz;
            const orta = a0 + d / 2;
            return (
              <g key={s.id}>
                <path d={`M100 100 L${x0} ${y0} A94 94 0 ${d > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={dolgu} stroke="#0f2942" strokeWidth="1.2" />
                <g transform={`rotate(${orta} 100 100)`}>
                  <text x="152" y="100" textAnchor="middle" dominantBaseline="central" fill={yazi} fontSize={n > 8 ? 7 : 8.5} fontWeight="800" letterSpacing="0.3" style={{ fontFamily: 'inherit' }}>
                    {s.etiket}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
        <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#0f2942" strokeWidth="3" />
        <circle cx="100" cy="100" r="6" fill="#14b8a6" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute left-1/2 top-[-6px] h-8 w-8 -translate-x-1/2 drop-shadow" aria-hidden="true">
        <path d="M12 22L3 4h18z" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function CarkPenceresi({ cark, kapat, bitti }) {
  const [asama, setAsama] = useState('form');
  const [eposta, setEposta] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [pazarlama, setPazarlama] = useState(false);
  const [token, setToken] = useState('');
  const [hata, setHata] = useState('');
  const [sonuc, setSonuc] = useState(null);
  const [aci, setAci] = useState(0);
  const [sure, setSure] = useState(0);
  const [kopyalandi, setKopyalandi] = useState(false);
  const [tekrar, setTekrar] = useState(false);
  const tsRef = useRef(null);
  const tsId = useRef(null);
  const girisRef = useRef(null);
  const otomatik = useRef(false);

  useEffect(() => {
    const onceki = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    girisRef.current?.focus();
    return () => {
      document.body.style.overflow = onceki;
    };
  }, []);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && asama !== 'donuyor' && kapat();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [asama, kapat]);

  const formAcik = asama !== 'sonuc';

  useEffect(() => {
    if (!formAcik) {
      try {
        if (tsId.current != null) window.turnstile?.remove(tsId.current);
      } catch {}
      tsId.current = null;
      return;
    }
    let iptal = false;
    const ciz = () => {
      if (iptal || !tsRef.current || tsId.current != null || !window.turnstile) return;
      tsId.current = window.turnstile.render(tsRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        language: 'tr',
        size: 'flexible',
        callback: (t) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };
    if (window.turnstile) ciz();
    else {
      let s = document.querySelector(`script[src="${TURNSTILE_SRC}"]`);
      if (!s) {
        s = document.createElement('script');
        s.src = TURNSTILE_SRC;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener('load', ciz);
      const t = setInterval(() => window.turnstile && (clearInterval(t), ciz()), 300);
      setTimeout(() => clearInterval(t), 20000);
    }
    return () => {
      iptal = true;
    };
  }, [formAcik]);

  const tokenYenile = () => {
    setToken('');
    try {
      if (tsId.current != null) window.turnstile.reset(tsId.current);
    } catch {}
  };

  const gonder = async (e) => {
    e?.preventDefault();
    setHata('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta.trim())) return setHata(m('cark.hata_eposta'));
    if (!kvkk) return setHata(m('cark.hata_kvkk'));
    if (!token) return setHata(m('cark.hata_dogrulama'));
    setAsama('gonderiliyor');
    try {
      const r = await fetch('/api/cark/cevir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eposta: eposta.trim(), kvkk, pazarlama, token }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.data) {
        setHata(j.error?.message || m('cark.hata_genel'));
        setAsama('form');
        tokenYenile();
        return;
      }
      const n = cark.dilimler.length;
      const idx = Math.max(0, cark.dilimler.findIndex((d) => d.id === j.data.odul));
      const dilim = 360 / n;
      const sapma = (Math.random() - 0.5) * dilim * 0.6;
      const azHareket = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      setSonuc(j.data);
      setSure(azHareket ? 600 : 5200);
      setAsama('donuyor');
      requestAnimationFrame(() => setAci((onceki) => onceki - (((onceki % 360) + 360) % 360) + 360 * (azHareket ? 1 : 6) + (360 - (idx * dilim + dilim / 2)) + sapma));
      if (!(j.data.kazanamaz && j.data.kalanHak > 0)) {
        try {
          localStorage.setItem(`swb_cark_${cark.donem}`, '1');
        } catch {}
      }
    } catch {
      setHata(m('cark.hata_baglanti'));
      setAsama('form');
      tokenYenile();
    }
  };

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(sonuc.kupon);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {}
  };

  const hakVar = !!(sonuc && sonuc.kazanamaz && sonuc.kalanHak > 0);

  const kapatVeBitir = () => {
    if (asama === 'sonuc' && !hakVar) bitti();
    kapat();
  };

  const tekrarla = () => {
    setHata('');
    setToken('');
    setTekrar(true);
    otomatik.current = true;
    setAsama('form');
  };

  useEffect(() => {
    if (tekrar && otomatik.current && asama === 'form' && token) {
      otomatik.current = false;
      gonder();
    }
  });

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cark-baslik" onClick={(e) => e.target === e.currentTarget && asama !== 'donuyor' && kapatVeBitir()}>
      <div className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
        <button type="button" onClick={kapatVeBitir} disabled={asama === 'donuyor'} aria-label={m('cark.kapat')} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-xl text-muted transition hover:bg-surface2 hover:text-strong disabled:opacity-40">
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 items-center justify-center bg-gradient-to-br from-brandsoft to-surface2 px-8 pb-6 pt-12 md:py-10">
            <Cark dilimler={cark.dilimler} aci={aci} sure={sure} donusBitti={() => asama === 'donuyor' && setAsama('sonuc')} />
          </div>
          <div className="min-w-0 p-6 sm:p-8">
            {asama !== 'sonuc' ? (
              <form onSubmit={gonder} noValidate>
                <h2 id="cark-baslik" className="pr-8 text-2xl font-extrabold tracking-tight text-strong text-balance">{cark.baslik}</h2>
                {cark.aciklama && <p className="mt-2 text-[14.5px] leading-relaxed text-body">{cark.aciklama}</p>}
                <label className="mt-5 block text-[13px] font-bold text-strong" htmlFor="cark-eposta">{m('cark.eposta_etiket')}</label>
                <input
                  ref={girisRef}
                  id="cark-eposta"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={eposta}
                  onChange={(e) => setEposta(e.target.value)}
                  disabled={asama !== 'form'}
                  readOnly={tekrar}
                  placeholder={m('cark.eposta_placeholder')}
                  className="mt-1.5 w-full min-w-0 rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-strong outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
                />
                <label className="mt-4 flex items-start gap-2.5 text-[13px] leading-snug text-body">
                  <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} disabled={asama !== 'form'} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500" />
                  <span>
                    <Link href="/legal/gizlilik-sozlesmesi" target="_blank" className="font-semibold text-brandtext underline">{m('cark.kvkk_link')}</Link> {m('cark.kvkk_metin')}
                  </span>
                </label>
                <label className="mt-2.5 flex items-start gap-2.5 text-[13px] leading-snug text-body">
                  <input type="checkbox" checked={pazarlama} onChange={(e) => setPazarlama(e.target.checked)} disabled={asama !== 'form'} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500" />
                  <span>{m('cark.pazarlama')}</span>
                </label>
                <div ref={tsRef} className="mt-4 min-h-[65px] w-full" />
                {hata && <p role="alert" className="mt-3 rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-[13.5px] font-semibold text-rose-600 ring-1 ring-rose-500/25 dark:text-rose-400">{hata}</p>}
                <button
                  type="submit"
                  disabled={asama !== 'form'}
                  data-umami-event="cark-cevir"
                  className="mt-4 w-full rounded-xl bg-brand-500 px-5 py-3.5 text-[15px] font-extrabold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {asama === 'form' ? m('cark.cevir') : asama === 'gonderiliyor' ? m('cark.hazirlaniyor') : m('cark.donuyor')}
                </button>
                <p className="mt-3 text-center text-[12px] text-muted">{m('cark.kural')}</p>
              </form>
            ) : hakVar ? (
              <div className="flex h-full flex-col justify-center">
                <h2 id="cark-baslik" className="text-2xl font-extrabold tracking-tight text-strong text-balance">{m('cark.tekrar_baslik')}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{m('cark.tekrar_metin')}</p>
                <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-brandsoft px-3.5 py-1.5 text-[13px] font-bold text-brandtext ring-1 ring-brandline">{m('cark.kalan_hak', { adet: sonuc.kalanHak })}</span>
                <button type="button" onClick={tekrarla} data-umami-event="cark-tekrar" className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3.5 text-[15px] font-extrabold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600">{m('cark.tekrar_cevir')}</button>
              </div>
            ) : sonuc.kazanamaz || !sonuc.kupon ? (
              <div className="flex h-full flex-col justify-center">
                <h2 id="cark-baslik" className="text-2xl font-extrabold tracking-tight text-strong">{m('cark.kaybetti_baslik')}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{m('cark.kaybetti_metin')}</p>
                <Link href="/kampanyalar" onClick={kapatVeBitir} className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3.5 text-[15px] font-extrabold text-white hover:bg-brand-600">{m('cark.kampanyalari_gor')}</Link>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-center">
                <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('cark.tebrikler')}</span>
                <h2 id="cark-baslik" className="mt-2 text-2xl font-extrabold tracking-tight text-strong text-balance">{m('cark.kazandin', { ad: sonuc.ad })}</h2>
                {sonuc.aciklama && <p className="mt-2 text-[14.5px] leading-relaxed text-body">{sonuc.aciklama}</p>}
                <div className="mt-5 flex items-stretch gap-2">
                  <code className="flex min-w-0 flex-1 items-center justify-center truncate rounded-xl border-2 border-dashed border-brandline bg-brandsoft px-4 py-3 font-mono text-lg font-extrabold tracking-wider text-brandtext">{sonuc.kupon}</code>
                  <button type="button" onClick={kopyala} className="shrink-0 rounded-xl bg-surface2 px-4 text-[14px] font-bold text-strong ring-1 ring-line hover:ring-brandline">{kopyalandi ? m('cark.kopyalandi') : m('cark.kopyala')}</button>
                </div>
                {sonuc.gecerlilik && <p className="mt-2 text-[13px] text-muted">{m('cark.gecerlilik', { gecerlilik: sonuc.gecerlilik })}</p>}
                <p className="mt-3 text-[13.5px] text-body">{m('cark.eposta_gonderildi')}</p>
                <Link href={sonuc.baglanti || '/kampanyalar'} onClick={kapatVeBitir} className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3.5 text-[15px] font-extrabold text-white hover:bg-brand-600" data-umami-event="cark-kupon-kullan">{m('cark.hemen_kullan')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
