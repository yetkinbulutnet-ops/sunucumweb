import { m } from '@/lib/metin';

export const TON = {
  iyi: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/25',
  orta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/25',
  eksik: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/25',
  riskli: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/25',
  yok: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/25',
  notr: 'bg-surface2 text-body ring-line',
};

export const tarihYaz = (deger) => {
  if (!deger) return null;
  const t = new Date(deger);
  return Number.isNaN(t.getTime()) ? null : t.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const sureYaz = (saniye) => {
  if (!Number.isFinite(saniye)) return '—';
  if (saniye >= 86400) return m('arac.sure_gun', { n: Math.round(saniye / 86400) });
  if (saniye >= 3600) return m('arac.sure_saat', { n: Math.round(saniye / 3600) });
  if (saniye >= 60) return m('arac.sure_dakika', { n: Math.round(saniye / 60) });
  return m('arac.sure_saniye', { n: saniye });
};

export function Kutu({ baslik, ek, children, genis }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 sm:p-6 ${genis ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{baslik}</h3>
        {ek}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Satir({ etiket, deger, kod }) {
  if (deger === null || deger === undefined || deger === '') return null;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line/70 py-2.5 last:border-0">
      <span className="shrink-0 text-[13px] text-muted">{etiket}</span>
      <span className={`min-w-0 break-all text-right text-[14px] font-semibold text-strong ${kod ? 'font-mono text-[13px]' : ''}`}>{deger}</span>
    </div>
  );
}

export function Rozet({ durum = 'notr', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${TON[durum]}`}>
      {children}
    </span>
  );
}

export function Bos({ children }) {
  return <p className="text-[14px] text-body">{children}</p>;
}
