'use client';
import { useEffect, useState } from 'react';

const API = '/api/durum';
const SAYFA = 'https://status.sunucumweb.com';
const YENILEME = 60_000;

const DURUM = {
  up: { nokta: 'bg-emerald-500', yazi: 'text-emerald-600 dark:text-emerald-400', etiket: 'Aktif' },
  down: { nokta: 'bg-rose-500', yazi: 'text-rose-600 dark:text-rose-400', etiket: 'Kesinti' },
  unknown: { nokta: 'bg-slate-400', yazi: 'text-muted', etiket: 'Bilinmiyor' },
};

function Sparkline({ veri }) {
  const d = (veri || []).slice(-24);
  if (!d.length) return null;
  const max = Math.max(...d, 1);
  return (
    <span className="hidden h-8 w-28 items-end gap-px sm:flex" aria-hidden>
      {d.map((v, i) => (
        <span key={i} className="flex-1 rounded-t-sm bg-brandsoft" style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />
      ))}
    </span>
  );
}

export default function DurumWidget() {
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState(false);

  useEffect(() => {
    let iptal = false;
    const cek = async () => {
      try {
        const r = await fetch(API, { cache: 'no-store' });
        const d = await r.json();
        if (iptal) return;
        if (d && d.summary) { setVeri(d); setHata(false); } else setHata(true);
      } catch { if (!iptal) setHata(true); }
    };
    cek();
    const t = setInterval(() => { if (!document.hidden) cek(); }, YENILEME);
    const gorunur = () => { if (!document.hidden) cek(); };
    document.addEventListener('visibilitychange', gorunur);
    return () => { iptal = true; clearInterval(t); document.removeEventListener('visibilitychange', gorunur); };
  }, []);

  if (hata) {
    return (
      <div className="w-full max-w-[820px] rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="text-[15px] text-body">Durum bilgisi şu an alınamadı.</p>
        <a href={SAYFA} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[14px] font-semibold text-brandtext hover:underline">Durum sayfasını aç →</a>
      </div>
    );
  }

  if (!veri) {
    return <div className="h-[220px] w-full max-w-[820px] animate-pulse rounded-2xl border border-line bg-surface2/50" aria-hidden />;
  }

  const { summary, services = [], updated_ago } = veri;
  const op = summary.operational;
  const nabizRenk = op ? 'bg-emerald-500' : 'bg-amber-500';

  return (
    <div className="w-full max-w-[820px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)]">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-surface2/50 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${nabizRenk}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${nabizRenk}`} />
          </span>
          <span className="truncate text-[15px] font-bold text-strong">
            {op ? 'Tüm sistemler operasyonel' : `${summary.down} serviste kesinti`}
          </span>
          <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[12px] font-semibold text-muted ring-1 ring-line">{summary.up}/{summary.total}</span>
        </div>
        <a href={SAYFA} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[13px] font-semibold text-brandtext transition-colors hover:underline">
          {updated_ago ? `Güncellendi: ${updated_ago}` : 'Durum sayfası'} →
        </a>
      </div>

      <ul className="divide-y divide-line">
        {services.map((s) => {
          const st = DURUM[s.status] || DURUM.unknown;
          return (
            <li key={s.id} className="flex items-center gap-3 px-5 py-3.5 sm:gap-4 sm:px-6">
              <span className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${st.nokta}`} />
                <span className="truncate text-[15px] font-semibold text-strong">{s.name}</span>
                <span className={`shrink-0 rounded-md bg-surface2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${st.yazi}`}>{st.etiket}</span>
              </span>
              <Sparkline veri={s.history} />
              <span className="hidden shrink-0 tabular-nums text-[13px] text-muted md:inline">{s.ping} ms</span>
              <span className={`shrink-0 text-right text-[13px] font-bold tabular-nums ${st.yazi}`}>%{s.uptime_percent}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
