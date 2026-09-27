'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DUYURU_ANAHTARI } from '@/lib/duyuru';
import { m } from '@/lib/metin';

const TON = {
  marka: 'bg-brand-600 text-white',
  bilgi: 'bg-sky-600 text-white',
  kampanya: 'bg-amber-400 text-ink',
  uyari: 'bg-rose-600 text-white',
  basari: 'bg-emerald-600 text-white',
};

const GIZLI = ['/guvenlik', '/engellendi'];

export default function DuyuruBandi({ duyuru }) {
  const yol = usePathname();
  const [kapali, setKapali] = useState(false);
  if (!duyuru || kapali || GIZLI.some((g) => yol?.startsWith(g))) return null;
  const dis = duyuru.baglanti && /^https?:\/\//.test(duyuru.baglanti);
  const kapat = () => {
    try {
      localStorage.setItem(DUYURU_ANAHTARI, duyuru.anahtar);
    } catch {}
    setKapali(true);
  };
  return (
    <div id="swb-duyuru" role="region" aria-label={m('duyuru.duyuru')} className={`relative ${TON[duyuru.ton] || TON.marka}`}>
      <style dangerouslySetInnerHTML={{ __html: `html[data-duyuru-kapali="${duyuru.anahtar}"] #swb-duyuru{display:none}` }} />
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center py-2 pl-4 pr-11 text-center text-[13px] font-semibold leading-snug sm:px-12 sm:text-[14px]">
        <p className="min-w-0">
          <span>{duyuru.metin}</span>
          {duyuru.baglanti && (
            dis ? (
              <a href={duyuru.baglanti} target="_blank" rel="noopener noreferrer" className="ml-2 whitespace-nowrap underline decoration-2 underline-offset-2 hover:opacity-80" data-umami-event="duyuru-tik">
                {duyuru.baglantiMetni} →
              </a>
            ) : (
              <Link href={duyuru.baglanti} className="ml-2 whitespace-nowrap underline decoration-2 underline-offset-2 hover:opacity-80" data-umami-event="duyuru-tik">
                {duyuru.baglantiMetni} →
              </Link>
            )
          )}
        </p>
      </div>
      {duyuru.kapatilabilir && (
        <button type="button" onClick={kapat} aria-label={m('duyuru.kapat')} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg opacity-80 transition hover:bg-black/10 hover:opacity-100">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
