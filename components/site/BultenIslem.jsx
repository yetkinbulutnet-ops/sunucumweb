'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m } from '@/lib/metin';

const istek = async (islem, token) => {
  const r = await fetch('/api/abone/islem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ islem, token }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.data) throw Object.assign(new Error(j.error?.message || ''), { durum: r.status });
  return j.data;
};

const METIN = {
  onay: { baslik: 'bulten.onay_baslik', metin: 'bulten.onay_metin', buton: 'bulten.onay_buton', tamamBaslik: 'bulten.onay_tamam_baslik', tamamMetin: 'bulten.onay_tamam_metin' },
  iptal: { baslik: 'bulten.iptal_baslik', metin: 'bulten.iptal_metin', buton: 'bulten.iptal_buton', tamamBaslik: 'bulten.iptal_tamam_baslik', tamamMetin: 'bulten.iptal_tamam_metin' },
};

export default function BultenIslem({ islem, token }) {
  const [asama, setAsama] = useState('yukleniyor');
  const [eposta, setEposta] = useState('');
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!token) return setAsama('gecersiz');
    istek('bilgi', token)
      .then((d) => {
        setEposta(d.eposta);
        if (islem === 'onay') setAsama(d.durum === 'aktif' ? 'tamam' : 'soru');
        else setAsama(d.durum === 'iptal' ? 'tamam' : 'soru');
      })
      .catch((e) => {
        if (e.durum === 404 || e.durum === 400) setAsama('gecersiz');
        else (setHata(e.message || m('bulten.islem_hata')), setAsama('hata'));
      });
  }, [islem, token]);

  const onayla = async () => {
    setAsama('gonderiliyor');
    setHata('');
    try {
      const d = await istek(islem, token);
      setEposta(d.eposta);
      setAsama('tamam');
    } catch (e) {
      setHata(e.message || m('bulten.islem_hata'));
      setAsama('soru');
    }
  };

  const k = METIN[islem] || METIN.onay;
  const baslik = asama === 'gecersiz' ? m('bulten.gecersiz_baslik') : asama === 'tamam' ? m(k.tamamBaslik) : m(k.baslik);
  const metin = asama === 'gecersiz' ? m('bulten.gecersiz_metin') : asama === 'tamam' ? m(k.tamamMetin, { eposta }) : m(k.metin, { eposta });

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 text-center shadow-sm sm:p-10" aria-live="polite">
      <span className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ring-1 ${asama === 'gecersiz' || asama === 'hata' ? 'bg-rose-500/10 text-rose-500 ring-rose-500/25' : 'bg-brandsoft text-brandtext ring-brandline'}`}>
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {asama === 'tamam' ? <path d="M5 12l5 5L20 7" /> : asama === 'gecersiz' || asama === 'hata' ? <path d="M12 8v5M12 16.5v.5M4 20h16L12 4z" /> : <><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></>}
        </svg>
      </span>
      {asama === 'yukleniyor' ? (
        <p className="mt-6 text-[15px] text-muted">{m('bulten.yukleniyor')}</p>
      ) : (
        <>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-strong text-balance sm:text-3xl">{asama === 'hata' ? m('bulten.gecersiz_baslik') : baslik}</h1>
          <p className="mt-3 break-words text-[15.5px] leading-relaxed text-body">{asama === 'hata' ? hata : metin}</p>
          {hata && asama === 'soru' && <p role="alert" className="mt-4 rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-[13.5px] font-semibold text-rose-600 ring-1 ring-rose-500/25 dark:text-rose-400">{hata}</p>}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {(asama === 'soru' || asama === 'gonderiliyor') && (
              <button
                type="button"
                onClick={onayla}
                disabled={asama === 'gonderiliyor'}
                data-umami-event={`bulten-${islem}`}
                className={`w-full rounded-xl px-6 py-3.5 text-[15px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${islem === 'iptal' ? 'bg-surface2 text-strong ring-1 ring-line hover:ring-brandline' : 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600'}`}
              >
                {asama === 'gonderiliyor' ? m('bulten.gonderiliyor') : m(k.buton)}
              </button>
            )}
            <Link href="/" className="w-full rounded-xl px-6 py-3.5 text-[15px] font-semibold text-brandtext hover:bg-brandsoft sm:w-auto">{m('bulten.ana_sayfa')}</Link>
          </div>
        </>
      )}
    </div>
  );
}
