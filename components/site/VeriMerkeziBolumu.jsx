'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from './chrome';

const VeriMerkeziKure = dynamic(() => import('./VeriMerkeziKure'), { ssr: false });

function Iskelet() {
  return (
    <div className="grid h-full place-items-center rounded-3xl border border-line bg-surface2">
      <span className="h-40 w-40 rounded-full border border-line bg-surface" />
    </div>
  );
}

export default function VeriMerkeziBolumu({ veri }) {
  const kapRef = useRef(null);
  const kureRef = useRef(null);
  const [yakinda, setYakinda] = useState(false);
  const [asama, setAsama] = useState('kure');

  useEffect(() => {
    const kap = kapRef.current;
    if (!kap) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setYakinda(true);
      return undefined;
    }

    const izleyici = new IntersectionObserver(
      (girdiler) => {
        if (girdiler[0].isIntersecting) {
          setYakinda(true);
          izleyici.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    izleyici.observe(kap);
    return () => izleyici.disconnect();
  }, []);

  const durumDegisti = useCallback((yeni) => setAsama(yeni), []);
  const apiHazir = useCallback((api) => {
    kureRef.current = api;
  }, []);

  const { konum, tesis, kart } = veri;
  const kartAcik = asama === 'yakin';

  return (
    <section id="veri-merkezi" className="scroll-mt-28 border-b border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div className="relative">
            <div ref={kapRef} className="h-[320px] sm:h-[400px] lg:h-[440px]">
              {yakinda ? (
                <VeriMerkeziKure
                  enlem={konum.enlem}
                  boylam={konum.boylam}
                  etiket={konum.etiket}
                  onDurum={durumDegisti}
                  onHazir={apiHazir}
                />
              ) : (
                <Iskelet />
              )}
            </div>

            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 transition-all duration-500 ${
                kartAcik ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              aria-hidden={!kartAcik}
            >
              <div className="pointer-events-auto rounded-2xl border border-line bg-surface/95 p-5 shadow-[0_30px_70px_-30px_rgba(15,41,66,0.55)] backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brandtext">{kart.eyebrow}</p>
                    <p className="mt-1 text-[18px] font-extrabold text-strong">{kart.baslik}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-brandsoft px-2.5 py-1 font-mono text-[11px] font-bold text-brandtext">
                    {konum.koordinat}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3">
                  {kart.satirlar.map(([etiket, deger]) => (
                    <div key={etiket} className="rounded-xl bg-surface2 px-3.5 py-2.5">
                      <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">{etiket}</dt>
                      <dd className="mt-0.5 text-[14px] font-bold text-strong">{deger}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  type="button"
                  onClick={() => kureRef.current?.geriDon()}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brandtext transition-colors hover:text-brand-500"
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                  Dünya görünümüne dön
                </button>
              </div>
            </div>

            {yakinda && !kartAcik && asama !== 'ucuyor' && (
              <p className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[12px] text-muted">
                {konum.etiket} işaretine dokunun
              </p>
            )}
          </div>

          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{veri.eyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-strong text-balance sm:text-4xl">
              {veri.baslik}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-body">{veri.metin}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Konum</dt>
                <dd className="mt-2 text-[17px] font-bold text-strong">
                  {konum.sehir}, {konum.ulke}
                </dd>
                <dd className="mt-1 font-mono text-[12px] text-muted">{konum.koordinat}</dd>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-5">
                <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Tesis</dt>
                <dd className="mt-2 text-[17px] font-bold text-strong">
                  <a
                    href={tesis.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brandtext"
                  >
                    {tesis.ad}
                  </a>
                </dd>
                <dd className="mt-1 text-[12px] text-muted">{tesis.not}</dd>
              </div>
            </dl>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {veri.ozellikler.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-body">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brandtext" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
