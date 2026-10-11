'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m } from '@/lib/metin';
import { izinOku, izinYaz } from '@/lib/cerez-izin';

const cerezleriSil = (desen) => {
  const alanlar = ['', location.hostname, `.${location.hostname.replace(/^www\./, '')}`];
  for (const c of document.cookie.split(';')) {
    const ad = c.split('=')[0].trim();
    if (!desen.test(ad)) continue;
    for (const a of alanlar) document.cookie = `${ad}=; Max-Age=0; Path=/${a ? `; Domain=${a}` : ''}`;
  }
};

function Anahtar({ acik, kilitli, onChange, etiket }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={acik}
      aria-label={etiket}
      disabled={kilitli}
      onClick={() => onChange(!acik)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${acik ? 'bg-brand-700' : 'bg-line'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${acik ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export default function CerezBandi() {
  const [gorunur, setGorunur] = useState(false);
  const [ayrinti, setAyrinti] = useState(false);
  const [analiz, setAnaliz] = useState(false);
  const [destek, setDestek] = useState(false);

  useEffect(() => {
    const mevcut = izinOku();
    if (!mevcut) setGorunur(true);
    const ac = () => {
      const s = izinOku();
      setAnaliz(!!s?.analiz);
      setDestek(!!s?.destek);
      setAyrinti(true);
      setGorunur(true);
    };
    window.addEventListener('swb-cerez-ac', ac);
    return () => window.removeEventListener('swb-cerez-ac', ac);
  }, []);

  const kaydet = (secim) => {
    const once = izinOku();
    izinYaz(secim);
    setGorunur(false);
    setAyrinti(false);
    const geriAlindi = (once?.analiz && !secim.analiz) || (once?.destek && !secim.destek);
    if (geriAlindi) {
      if (!secim.analiz) cerezleriSil(/^_ga|^_gid|^_gcl/);
      if (!secim.destek) cerezleriSil(/^twk_|^TawkConnectionTime/);
      location.reload();
    }
  };

  if (!gorunur) return null;

  const dugme = 'inline-flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-xl px-4 text-[14px] font-bold transition-colors';

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={m('cerez.baslik')}
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[440px] rounded-2xl border border-line bg-surface p-5 text-strong shadow-[0_24px_70px_-20px_rgba(15,41,66,0.45)] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:mx-0"
    >
      <p className="text-[15px] font-extrabold">{m('cerez.baslik')}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">
        {m('cerez.metin')}{' '}
        <Link href="/yasal-belgeler/cerez-politikasi" className="font-semibold text-brandtext underline underline-offset-2">{m('cerez.politika_link')}</Link>
      </p>

      {ayrinti && (
        <ul className="mt-4 space-y-3 border-t border-line pt-4">
          <li className="flex items-start justify-between gap-4">
            <span className="min-w-0">
              <span className="block text-[14px] font-bold">{m('cerez.zorunlu')}</span>
              <span className="block text-[12.5px] leading-snug text-muted">{m('cerez.zorunlu_aciklama')}</span>
            </span>
            <Anahtar acik kilitli etiket={m('cerez.zorunlu')} onChange={() => {}} />
          </li>
          <li className="flex items-start justify-between gap-4">
            <span className="min-w-0">
              <span className="block text-[14px] font-bold">{m('cerez.analiz')}</span>
              <span className="block text-[12.5px] leading-snug text-muted">{m('cerez.analiz_aciklama')}</span>
            </span>
            <Anahtar acik={analiz} etiket={m('cerez.analiz')} onChange={setAnaliz} />
          </li>
          <li className="flex items-start justify-between gap-4">
            <span className="min-w-0">
              <span className="block text-[14px] font-bold">{m('cerez.destek')}</span>
              <span className="block text-[12.5px] leading-snug text-muted">{m('cerez.destek_aciklama')}</span>
            </span>
            <Anahtar acik={destek} etiket={m('cerez.destek')} onChange={setDestek} />
          </li>
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {ayrinti ? (
          <button type="button" onClick={() => kaydet({ analiz, destek })} className={`${dugme} bg-surface2 text-strong ring-1 ring-line hover:text-brandtext`}>
            {m('cerez.kaydet')}
          </button>
        ) : (
          <button type="button" onClick={() => setAyrinti(true)} className={`${dugme} bg-surface2 text-strong ring-1 ring-line hover:text-brandtext`}>
            {m('cerez.tercihler')}
          </button>
        )}
        <button type="button" onClick={() => kaydet({ analiz: false, destek: false })} className={`${dugme} bg-surface2 text-strong ring-1 ring-line hover:text-brandtext`}>
          {m('cerez.reddet')}
        </button>
        <button type="button" onClick={() => kaydet({ analiz: true, destek: true })} className={`${dugme} bg-brand-700 text-white hover:bg-brand-800`}>
          {m('cerez.kabul')}
        </button>
      </div>
    </div>
  );
}
