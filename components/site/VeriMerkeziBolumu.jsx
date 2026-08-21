'use client';
import { useEffect, useRef, useState } from 'react';
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
  const [yakinda, setYakinda] = useState(false);

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

  const { konum, tesis } = veri;

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div ref={kapRef} className="h-[320px] sm:h-[400px] lg:h-[440px]">
            {yakinda ? (
              <VeriMerkeziKure enlem={konum.enlem} boylam={konum.boylam} etiket={konum.etiket} />
            ) : (
              <Iskelet />
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
