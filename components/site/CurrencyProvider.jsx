'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';

const Ctx = createContext(null);
const KEY = 'swb-parabirimi';

const trFmt = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const usdFmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CurrencyProvider({ children }) {
  const [parabirimi, setPB] = useState('USD');
  const [kur, setKur] = useState(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem(KEY);
      if (p === 'USD' || p === 'TRY') setPB(p);
    } catch {  }
    fetch('/api/kur')
      .then((r) => r.json())
      .then((d) => { if (d && d.usd) setKur(d.usd); })
      .catch(() => {});
  }, []);

  const setParabirimi = useCallback((p) => {
    setPB(p);
    try { localStorage.setItem(KEY, p); } catch {  }
  }, []);

  const fiyat = useCallback((tryTutar, opts = {}) => {
    const n = Number(tryTutar) || 0;
    if (parabirimi === 'USD' && kur) return '$' + usdFmt.format(n / kur);
    return opts.sembolSonda ? trFmt.format(n) + ' ₺' : '₺' + trFmt.format(n);
  }, [parabirimi, kur]);

  const deger = useMemo(
    () => ({ parabirimi, kur, setParabirimi, fiyat, usdAktif: parabirimi === 'USD' && !!kur }),
    [parabirimi, kur, setParabirimi, fiyat],
  );
  return <Ctx.Provider value={deger}>{children}</Ctx.Provider>;
}

export function useParabirimi() {
  return useContext(Ctx) || {
    parabirimi: 'TRY', kur: null, usdAktif: false,
    setParabirimi: () => {},
    fiyat: (t, o = {}) => (o.sembolSonda ? trFmt.format(Number(t) || 0) + ' ₺' : '₺' + trFmt.format(Number(t) || 0)),
  };
}

const SECENEKLER = [
  { kod: 'USD', sembol: '$', kisa: 'USD', ad: 'Amerikan Doları' },
  { kod: 'TRY', sembol: '₺', kisa: 'TL', ad: 'Türk Lirası' },
];

export function ParaBirimiSecici({ className = '' }) {
  const { parabirimi, setParabirimi } = useParabirimi();
  const [acik, setAcik] = useState(false);
  const [monte, setMonte] = useState(false);
  const kutu = useRef(null);

  useEffect(() => { setMonte(true); }, []);

  useEffect(() => {
    if (!acik) return;
    const disari = (e) => { if (kutu.current && !kutu.current.contains(e.target)) setAcik(false); };
    const esc = (e) => e.key === 'Escape' && setAcik(false);
    document.addEventListener('pointerdown', disari);
    window.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', disari); window.removeEventListener('keydown', esc); };
  }, [acik]);

  const aktif = SECENEKLER.find((s) => s.kod === parabirimi) || SECENEKLER[0];
  const goster = monte ? aktif : SECENEKLER[0];

  return (
    <div ref={kutu} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={acik}
        aria-label={`Para birimi: ${goster.ad}`}
        data-umami-event="Para Birimi Aç"
        className="inline-flex items-center gap-1 rounded-xl bg-surface2 px-2.5 py-2 text-[13px] font-bold text-strong ring-1 ring-line transition-colors hover:bg-surface"
      >
        <span className="tabular-nums">{goster.sembol}</span>
        <span>{goster.kisa}</span>
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 text-muted transition-transform ${acik ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {acik && (
        <div role="listbox" aria-label="Para birimi seçin" className="absolute right-0 top-full z-[70] mt-1.5 w-32 overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-[0_20px_50px_-20px_rgba(15,41,66,0.5)] animate-[fadeup_0.16s_ease-out]">
          {SECENEKLER.map((s) => {
            const sec = s.kod === parabirimi;
            return (
              <button
                key={s.kod}
                type="button"
                role="option"
                aria-selected={sec}
                aria-label={s.ad}
                onClick={() => { setParabirimi(s.kod); setAcik(false); }}
                data-umami-event="Para Birimi Seç"
                data-umami-event-birim={s.kod}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-bold transition-colors ${sec ? 'bg-brandsoft text-brandtext' : 'text-body hover:bg-surface2 hover:text-strong'}`}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-surface2 text-[13px] font-bold tabular-nums ring-1 ring-line">{s.sembol}</span>
                <span className="flex-1 whitespace-nowrap">{s.kisa}</span>
                {sec && <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brandtext" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
