'use client';
import { useEffect, useRef, useState } from 'react';

const SURE = 1300;

function ayristir(deger) {
  const e = String(deger).match(/^(\D*)([\d.,]+)(.*)$/);
  if (!e) return null;

  const ham = e[2];
  const sonNokta = Math.max(ham.lastIndexOf('.'), ham.lastIndexOf(','));
  const kuyruk = sonNokta === -1 ? '' : ham.slice(sonNokta + 1);
  const ondalikli = sonNokta !== -1 && kuyruk.length > 0 && kuyruk.length < 3;
  const sayi = ondalikli
    ? parseFloat(ham.slice(0, sonNokta).replace(/[.,]/g, '') + '.' + kuyruk)
    : parseFloat(ham.replace(/[.,]/g, ''));

  if (!Number.isFinite(sayi)) return null;
  if (!e[1] && !e[3] && sayi >= 1900 && sayi <= 2100) return null;

  return { onEk: e[1], sayi, sonEk: e[3], basamak: ondalikli ? kuyruk.length : 0, ayirici: !ondalikli && sonNokta !== -1 };
}

const bicimle = (sayi, basamak, ayirici) => {
  if (basamak > 0) return sayi.toFixed(basamak).replace('.', ',');
  const tam = Math.round(sayi);
  return ayirici ? tam.toLocaleString('tr-TR') : String(tam);
};

const azaltilmisHareket = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Sayac({ deger, calistir, gecikme }) {
  const [metin, setMetin] = useState(deger);
  const cozum = useRef(null);

  if (cozum.current === null) cozum.current = ayristir(deger);

  useEffect(() => {
    const c = cozum.current;
    if (!c || !calistir) return undefined;
    if (azaltilmisHareket()) {
      setMetin(deger);
      return undefined;
    }

    setMetin(c.onEk + bicimle(0, c.basamak, c.ayirici) + c.sonEk);

    let cerceve = 0;
    let baslangic = 0;
    const zamanlayici = setTimeout(() => {
      const adim = (zaman) => {
        if (!baslangic) baslangic = zaman;
        const t = Math.min((zaman - baslangic) / SURE, 1);
        const yumusak = 1 - Math.pow(1 - t, 3);
        setMetin(c.onEk + bicimle(c.sayi * yumusak, c.basamak, c.ayirici) + c.sonEk);
        if (t < 1) cerceve = requestAnimationFrame(adim);
      };
      cerceve = requestAnimationFrame(adim);
    }, gecikme);

    return () => {
      clearTimeout(zamanlayici);
      cancelAnimationFrame(cerceve);
    };
  }, [calistir, deger, gecikme]);

  return <>{cozum.current ? metin : deger}</>;
}

export default function SayacKartlari({ rakamlar }) {
  const kapRef = useRef(null);
  const [gorundu, setGorundu] = useState(false);

  useEffect(() => {
    const kap = kapRef.current;
    if (!kap) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setGorundu(true);
      return undefined;
    }

    const izleyici = new IntersectionObserver(
      (girdiler) => {
        if (girdiler[0].isIntersecting) {
          setGorundu(true);
          izleyici.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    izleyici.observe(kap);
    return () => izleyici.disconnect();
  }, []);

  return (
    <dl
      ref={kapRef}
      className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line lg:grid-cols-4"
    >
      {rakamlar.map(([sayi, etiket], i) => (
        <div
          key={etiket}
          className="group relative overflow-hidden bg-surface px-5 py-6 transition-colors hover:bg-surface2 sm:px-6"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-brand-500 transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: gorundu ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: i * 90 + 'ms' }}
          />
          <dd className="text-2xl font-extrabold tabular-nums text-strong sm:text-3xl">
            <Sayac deger={sayi} calistir={gorundu} gecikme={i * 90} />
          </dd>
          <dt className="mt-1.5 text-[13px] text-muted">{etiket}</dt>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-400/0 blur-xl transition-colors duration-500 group-hover:bg-brand-400/20"
          />
        </div>
      ))}
    </dl>
  );
}
