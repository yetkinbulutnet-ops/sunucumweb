'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { m } from '@/lib/metin';

const KATMAN = [
  { x: 0, y: 0, olcek: 1, aci: 0, saydam: 1 },
  { x: 9, y: -2, olcek: 0.95, aci: 2, saydam: 0.6 },
  { x: 17, y: -3.5, olcek: 0.9, aci: 3.5, saydam: 0.3 },
];

const azaltilmisHareket = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function KabinSlider({ fotograflar }) {
  const adet = fotograflar.length;
  const [aktif, setAktif] = useState(0);
  const [otomatik, setOtomatik] = useState(false);
  const baslangic = useRef(null);

  const git = useCallback((yon) => setAktif((v) => (v + yon + adet) % adet), [adet]);

  useEffect(() => {
    if (!otomatik || azaltilmisHareket()) return;
    const sayac = setInterval(() => git(1), 1800);
    return () => clearInterval(sayac);
  }, [otomatik, git]);

  const basladi = (e) => {
    baslangic.current = { x: e.clientX, y: e.clientY };
  };

  const bitti = (e) => {
    const b = baslangic.current;
    baslangic.current = null;
    if (!b) return;
    const dx = e.clientX - b.x;
    const dy = e.clientY - b.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) git(dx < 0 ? 1 : -1);
  };

  return (
    <div className="mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none">
      <div
        className="relative aspect-[3/4] cursor-grab touch-pan-y select-none active:cursor-grabbing"
        role="group"
        aria-roledescription={m('hakkimizda_vm.galeri')}
        aria-label={m('hakkimizda_vm.foto_aria', { no: aktif + 1, toplam: adet })}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOtomatik(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOtomatik(false)}
        onPointerDown={basladi}
        onPointerUp={bitti}
        onPointerCancel={() => { baslangic.current = null; }}
      >
        {fotograflar.map((f, n) => {
          const fark = (n - aktif + adet) % adet;
          const k = KATMAN[fark];
          const gorunur = !!k;
          return (
            <div
              key={f.src}
              aria-hidden={fark !== 0}
              className="absolute inset-y-0 left-0 w-[84%] overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_80px_-45px_rgba(15,41,66,0.75)] transition-[transform,opacity] duration-500 ease-out"
              style={{
                transform: `translate3d(${(k?.x ?? 22)}%, ${(k?.y ?? -5)}%, 0) scale(${k?.olcek ?? 0.86}) rotate(${k?.aci ?? 5}deg)`,
                opacity: gorunur ? k.saydam : 0,
                zIndex: adet - fark,
                pointerEvents: fark === 0 ? 'auto' : 'none',
              }}
            >
              <img
                src={f.src}
                alt={f.alt}
                width={f.g}
                height={f.y}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-[13px] font-semibold tabular-nums text-muted">
          {String(aktif + 1).padStart(2, '0')} / {String(adet).padStart(2, '0')}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => git(-1)}
            aria-label={m('hakkimizda_vm.onceki_foto')}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-strong transition-colors hover:border-brandline hover:text-brandtext"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => git(1)}
            aria-label={m('hakkimizda_vm.sonraki_foto')}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-strong transition-colors hover:border-brandline hover:text-brandtext"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
