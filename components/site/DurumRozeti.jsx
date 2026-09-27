'use client';
import { useEffect, useState } from 'react';
import { m } from '@/lib/metin';

const API = '/api/durum';
const SAYFA = 'https://status.sunucumweb.com';
const YENILEME = 60_000;

const DURUMLAR = {
  bekliyor: { metin: 'durum.sistem_durumu', nokta: 'bg-slate-500', halka: 'ring-white/10', yazi: 'text-slate-400' },
  calisiyor: { metin: 'durum.operasyonel', nokta: 'bg-emerald-400', halka: 'ring-emerald-400/25', yazi: 'text-emerald-300', nabiz: true },
  kesinti: { nokta: 'bg-amber-400', halka: 'ring-amber-400/25', yazi: 'text-amber-300', nabiz: true },
  ulasilamadi: { metin: 'durum.durum_sayfasi', nokta: 'bg-slate-500', halka: 'ring-white/10', yazi: 'text-slate-400' },
};

export default function DurumRozeti() {
  const [ozet, setOzet] = useState(null);
  const [hata, setHata] = useState(false);

  useEffect(() => {
    let iptal = false;

    const cek = async () => {
      try {
        const r = await fetch(API, { cache: 'no-store' });
        const d = await r.json();
        if (iptal) return;
        if (d?.ok && d.summary && typeof d.summary.operational === 'boolean') {
          setOzet({ ...d.summary, updated_ago: d.updated_ago });
          setHata(false);
        } else {
          setHata(true);
        }
      } catch {
        if (!iptal) setHata(true);
      }
    };

    cek();
    const t = setInterval(cek, YENILEME);
    return () => { iptal = true; clearInterval(t); };
  }, []);

  const anahtar = hata ? 'ulasilamadi' : !ozet ? 'bekliyor' : ozet.operational ? 'calisiyor' : 'kesinti';
  const stil = DURUMLAR[anahtar];
  const metin = anahtar === 'kesinti' ? m('durum.kesinti', { adet: ozet.down }) : m(stil.metin);

  return (
    <a
      href={SAYFA}
      target="_blank"
      rel="noopener noreferrer"
      title={ozet?.updated_ago ? m('durum.son_kontrol', { zaman: ozet.updated_ago }) : m('durum.sistem_durumu')}
      className={`inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[13px] font-medium ring-1 transition-colors hover:bg-white/10 ${stil.halka} ${stil.yazi}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {stil.nabiz && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${stil.nokta}`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${stil.nokta}`} />
      </span>
      <span className="whitespace-nowrap">{metin}</span>
      {ozet && anahtar === 'calisiyor' && (
        <span className="hidden text-slate-500 sm:inline">{ozet.up}/{ozet.total}</span>
      )}
    </a>
  );
}
