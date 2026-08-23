'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const Ctx = createContext(null);
const KEY = 'swb-parabirimi';

const trFmt = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const usdFmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CurrencyProvider({ children }) {
  const [parabirimi, setPB] = useState('TRY');
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

export function ParaBirimiSecici({ className = '' }) {
  const { parabirimi, setParabirimi } = useParabirimi();
  return (
    <div className={`inline-flex items-center rounded-xl bg-surface2 p-0.5 ring-1 ring-line ${className}`}>
      {[['TRY', '₺'], ['USD', '$']].map(([p, s]) => (
        <button
          key={p}
          type="button"
          onClick={() => setParabirimi(p)}
          aria-pressed={parabirimi === p}
          className={`rounded-lg px-2.5 py-1.5 text-[13px] font-bold transition-colors ${parabirimi === p ? 'bg-brand-500 text-white shadow' : 'text-body hover:text-strong'}`}
        >
          {s} {p}
        </button>
      ))}
    </div>
  );
}
