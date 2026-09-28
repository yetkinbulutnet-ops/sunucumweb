'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { m } from '@/lib/metin';

const CarkPenceresi = dynamic(() => import('./CarkPenceresi'), { ssr: false });

const GIZLI = ['/guvenlik', '/engellendi', '/bulten'];

export default function CarkRozeti({ cark }) {
  const yol = usePathname();
  const [hazir, setHazir] = useState(false);
  const [gizli, setGizli] = useState(false);
  const [acik, setAcik] = useState(false);

  useEffect(() => {
    try {
      setGizli(sessionStorage.getItem('swb_cark_gizle') === '1' || localStorage.getItem(`swb_cark_${cark.donem}`) === '1');
    } catch {}
    setHazir(true);
  }, [cark.donem]);

  if (!hazir || GIZLI.some((g) => yol?.startsWith(g))) return null;

  const gizle = () => {
    try {
      sessionStorage.setItem('swb_cark_gizle', '1');
    } catch {}
    setGizli(true);
  };

  return (
    <>
      {!gizli && !acik && (
        <div className="fixed bottom-4 left-4 z-[70] flex items-center sm:bottom-6 sm:left-6">
          <button
            type="button"
            onClick={() => setAcik(true)}
            data-umami-event="cark-ac"
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-800 to-brand-700 py-2.5 pl-2.5 pr-5 text-[14px] font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(13,148,136,0.7)] ring-1 ring-white/20 transition-transform hover:-translate-y-0.5"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <span aria-hidden className="absolute inset-0 rounded-full bg-white/30 motion-safe:animate-ping" />
              <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" strokeLinecap="round" />
              </svg>
            </span>
            {cark.rozetMetni}
          </button>
          <button
            type="button"
            onClick={gizle}
            aria-label={m('duyuru.cark_gizle')}
            className="-ml-2 grid h-7 w-7 place-items-center self-start rounded-full bg-surface text-muted shadow ring-1 ring-line hover:text-strong"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      {acik && <CarkPenceresi cark={cark} kapat={() => setAcik(false)} bitti={() => setGizli(true)} />}
    </>
  );
}
