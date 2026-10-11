'use client';

import { useEffect, useMemo, useState } from 'react';

const sadelestir = (s) =>
  String(s || '')
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const SIRALAMALAR = ['yeni', 'eski', 'az'];

export default function BlogArama({ yazilar, kartlar, kategoriler, kategoriSecimi, t, children }) {
  const [q, setQ] = useState('');
  const [sira, setSira] = useState('yeni');
  const [kat, setKat] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const ilkQ = (p.get('q') || '').slice(0, 100);
    const ilkSira = SIRALAMALAR.includes(p.get('sira')) ? p.get('sira') : 'yeni';
    const ilkKat = kategoriSecimi && kategoriler.some((k) => k.slug === p.get('kategori')) ? p.get('kategori') : '';
    if (ilkQ) setQ(ilkQ);
    if (ilkSira !== 'yeni') setSira(ilkSira);
    if (ilkKat) setKat(ilkKat);
  }, [kategoriler, kategoriSecimi]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const ayarla = (a, v) => (v ? p.set(a, v) : p.delete(a));
    ayarla('q', q.trim());
    ayarla('sira', sira === 'yeni' ? '' : sira);
    ayarla('kategori', kat);
    const ek = p.toString();
    const yeni = `${window.location.pathname}${ek ? `?${ek}` : ''}${window.location.hash}`;
    if (yeni !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, '', yeni);
  }, [q, sira, kat]);

  const aktif = q.trim() !== '' || sira !== 'yeni' || kat !== '';

  const sonuc = useMemo(() => {
    if (!aktif) return [];
    const kelimeler = sadelestir(q).split(/\s+/).filter(Boolean);
    const liste = yazilar.filter((y) => {
      if (kat && y.kategori !== kat) return false;
      if (!kelimeler.length) return true;
      const metin = sadelestir(`${y.baslik} ${y.ozet} ${y.kategoriAd}`);
      return kelimeler.every((k) => metin.includes(k));
    });
    if (sira === 'eski') liste.sort((a, b) => a.zaman - b.zaman);
    else if (sira === 'az') liste.sort((a, b) => a.baslik.localeCompare(b.baslik, 'tr'));
    else liste.sort((a, b) => b.zaman - a.zaman);
    return liste;
  }, [aktif, q, sira, kat, yazilar]);

  const temizle = () => {
    setQ('');
    setSira('yeni');
    setKat('');
  };

  const alan = 'h-12 w-full min-w-0 rounded-xl border border-line bg-surface px-4 text-[15px] text-strong outline-none transition-colors focus:border-brandline focus:ring-2 focus:ring-brand-500/20';

  return (
    <>
      <form role="search" onSubmit={(e) => e.preventDefault()} className={`mt-8 grid gap-3 ${kategoriSecimi ? 'sm:grid-cols-[minmax(0,1fr)_220px_200px]' : 'sm:grid-cols-[minmax(0,1fr)_220px]'}`}>
        <label className="relative block min-w-0">
          <span className="sr-only">{t.araEtiket}</span>
          <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input type="search" value={q} maxLength={100} onChange={(e) => setQ(e.target.value)} placeholder={t.araYer} className={`${alan} pl-11`} />
        </label>
        {kategoriSecimi && (
          <label className="block min-w-0">
            <span className="sr-only">{t.kategoriEtiket}</span>
            <select value={kat} onChange={(e) => setKat(e.target.value)} className={alan}>
              <option value="">{t.tumKategoriler}</option>
              {kategoriler.map((k) => (
                <option key={k.slug} value={k.slug}>{k.ad}</option>
              ))}
            </select>
          </label>
        )}
        <label className="block min-w-0">
          <span className="sr-only">{t.siraEtiket}</span>
          <select value={sira} onChange={(e) => setSira(e.target.value)} className={alan}>
            <option value="yeni">{t.siraYeni}</option>
            <option value="eski">{t.siraEski}</option>
            <option value="az">{t.siraAz}</option>
          </select>
        </label>
      </form>

      {!aktif ? (
        children
      ) : (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-[14px] font-semibold text-body">{sonuc.length ? t.sonucN.replace('{n}', sonuc.length) : t.sonucYok}</p>
            <button type="button" onClick={temizle} className="text-[14px] font-bold text-brandtext hover:underline">{t.temizle}</button>
          </div>
          {sonuc.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sonuc.map((y) => <div key={y.slug} className="min-w-0">{kartlar[y.slug]}</div>)}
            </div>
          )}
        </div>
      )}
    </>
  );
}
