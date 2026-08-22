'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon, SiteShell, CtaBand } from './chrome';
import { CHECKOUT_URL } from '@/lib/engines/cart';
import { YAZILIMLAR, YAZILIM_KATEGORILERI, YAZILIM_SERIDI } from '@/content/site/yazilimlar';

const PER = 12;

const SIRALAMALAR = [
  { v: 'populer', l: 'Önerilen' },
  { v: 'fiyat-artan', l: 'Fiyat: Artan' },
  { v: 'fiyat-azalan', l: 'Fiyat: Azalan' },
  { v: 'isim', l: 'İsme göre (A-Z)' },
];

const fiyatYaz = (n) => new Intl.NumberFormat('tr-TR').format(n);
const kucuk = (s) => s.toLocaleLowerCase('tr');

function KategoriIkon({ slug }) {
  const k = YAZILIM_KATEGORILERI.find((x) => x.slug === slug);
  return <Icon name={k ? k.icon : 'layers'} className="h-4 w-4" />;
}

function Kart({ y }) {
  const kat = YAZILIM_KATEGORILERI.find((x) => x.slug === y.kategori);
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.22)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-28px_rgba(20,184,166,0.35)]">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brandsoft px-2.5 py-1 text-[11.5px] font-bold text-brandtext">
          <KategoriIkon slug={y.kategori} /> {kat ? kat.ad : 'Yazılım'}
        </span>
        {y.oneCikan && (
          <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">
            Popüler
          </span>
        )}
      </div>

      <h3 className="mt-4 text-[17px] font-extrabold text-strong">{y.ad}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{y.aciklama}</p>

      {y.etiketler?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {y.etiketler.map((e) => (
            <span key={e} className="rounded-lg bg-surface2 px-2 py-1 text-[11.5px] font-semibold text-muted ring-1 ring-line">
              {e}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted">Başlangıç</div>
          <div className="text-[20px] font-extrabold tracking-tight text-strong">
            {fiyatYaz(y.fiyat)} <span className="text-[13px] font-bold text-muted">₺</span>
          </div>
        </div>
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
        >
          Satın Al <Icon name="arrow" className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function HazirYazilimPage() {
  const [kategori, setKategori] = useState('hepsi');
  const [arama, setArama] = useState('');
  const [sirala, setSirala] = useState('populer');
  const [sayfa, setSayfa] = useState(1);
  const listeUst = useRef(null);
  const ilkRender = useRef(true);

  const sayimlar = useMemo(() => {
    const m = {};
    for (const y of YAZILIMLAR) m[y.kategori] = (m[y.kategori] || 0) + 1;
    return m;
  }, []);

  const filtrelenmis = useMemo(() => {
    let list = YAZILIMLAR;
    if (kategori !== 'hepsi') list = list.filter((y) => y.kategori === kategori);
    const q = kucuk(arama.trim());
    if (q) {
      list = list.filter((y) =>
        kucuk(`${y.ad} ${y.aciklama} ${(y.etiketler || []).join(' ')}`).includes(q)
      );
    }
    const s = [...list];
    if (sirala === 'fiyat-artan') s.sort((a, b) => a.fiyat - b.fiyat);
    else if (sirala === 'fiyat-azalan') s.sort((a, b) => b.fiyat - a.fiyat);
    else if (sirala === 'isim') s.sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
    else s.sort((a, b) => (b.oneCikan ? 1 : 0) - (a.oneCikan ? 1 : 0));
    return s;
  }, [kategori, arama, sirala]);

  useEffect(() => { setSayfa(1); }, [kategori, arama, sirala]);

  const toplamSayfa = Math.max(1, Math.ceil(filtrelenmis.length / PER));
  const guncelSayfa = Math.min(sayfa, toplamSayfa);
  const gorunen = filtrelenmis.slice((guncelSayfa - 1) * PER, guncelSayfa * PER);

  useEffect(() => {
    if (ilkRender.current) { ilkRender.current = false; return; }
    listeUst.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [guncelSayfa]);

  const sayfalar = Array.from({ length: toplamSayfa }, (_, i) => i + 1);

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
          <div className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">Ana Sayfa</Link><span>/</span>
            <span className="font-medium text-strong/70">Hazır Yazılımlar</span>
          </div>
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{YAZILIM_SERIDI.eyebrow}</span>
          <h1 className="mt-3 max-w-3xl tipo-dev font-extrabold tracking-tight text-strong text-balance">{YAZILIM_SERIDI.baslik}</h1>
          <p className="mt-5 max-w-2xl tipo-giris text-body">{YAZILIM_SERIDI.metin}</p>
        </div>
      </section>

      <div ref={listeUst} className="scroll-mt-24 mx-auto max-w-7xl px-5 lg:px-8 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-2 hidden px-1 text-[12px] font-bold uppercase tracking-wider text-muted lg:block">Kategoriler</div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [-webkit-overflow-scrolling:touch]">
              <button
                onClick={() => setKategori('hepsi')}
                className={`inline-flex shrink-0 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-colors lg:w-full ${
                  kategori === 'hepsi' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-surface text-strong ring-1 ring-line hover:bg-surface2'
                }`}
              >
                <span className="flex items-center gap-2"><Icon name="layers" className="h-4 w-4" /> Tümü</span>
                <span className={`hidden text-[12px] font-bold lg:inline ${kategori === 'hepsi' ? 'text-white/80' : 'text-muted'}`}>{YAZILIMLAR.length}</span>
              </button>
              {YAZILIM_KATEGORILERI.map((k) => {
                const aktif = kategori === k.slug;
                return (
                  <button
                    key={k.slug}
                    onClick={() => setKategori(k.slug)}
                    className={`inline-flex shrink-0 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-colors lg:w-full ${
                      aktif ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-surface text-strong ring-1 ring-line hover:bg-surface2'
                    }`}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap"><Icon name={k.icon} className="h-4 w-4" /> {k.ad}</span>
                    <span className={`hidden text-[12px] font-bold lg:inline ${aktif ? 'text-white/80' : 'text-muted'}`}>{sayimlar[k.slug] || 0}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 hidden rounded-2xl border border-line bg-surface2/60 p-5 lg:block">
              <div className="flex items-center gap-2 text-[14px] font-extrabold text-strong">
                <Icon name="chat" className="h-4 w-4 text-brandtext" /> Özel yazılım mı lazım?
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-body">İhtiyacınıza özel geliştirme için ekibimizle görüşün.</p>
              <Link href="/iletisim" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brandtext hover:underline underline-offset-4">
                Teklif alın <Icon name="arrow" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>

          <div className="mt-8 min-w-0 lg:mt-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 shadow-[0_10px_30px_-24px_rgba(15,41,66,0.35)] focus-within:border-brand-400">
                <Icon name="search" className="h-[18px] w-[18px] shrink-0 text-muted" />
                <input
                  value={arama}
                  onChange={(e) => setArama(e.target.value)}
                  type="search"
                  placeholder="Yazılım ara (ör. e-ticaret, randevu, blog)"
                  aria-label="Yazılım ara"
                  className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-strong placeholder:text-muted outline-none"
                />
              </div>
              <label className="flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-1">
                <span className="text-[13px] font-semibold text-muted">Sırala</span>
                <select
                  value={sirala}
                  onChange={(e) => setSirala(e.target.value)}
                  aria-label="Sıralama"
                  className="cursor-pointer bg-transparent py-2 pr-1 text-[14px] font-semibold text-strong outline-none"
                >
                  {SIRALAMALAR.map((s) => <option key={s.v} value={s.v} className="bg-surface text-strong">{s.l}</option>)}
                </select>
              </label>
            </div>

            <p className="mt-4 text-[13.5px] text-muted">
              <span className="font-bold text-strong">{filtrelenmis.length}</span> yazılım bulundu
              {kategori !== 'hepsi' && <> · <button onClick={() => setKategori('hepsi')} className="font-semibold text-brandtext hover:underline">filtreyi temizle</button></>}
            </p>

            {gorunen.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-line bg-surface2/50 px-6 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-muted ring-1 ring-line"><Icon name="search" className="h-6 w-6" /></span>
                <p className="mt-5 text-[16px] font-bold text-strong">Sonuç bulunamadı</p>
                <p className="mt-1.5 text-[14px] text-body">Aramanızı değiştirin veya farklı bir kategori seçin.</p>
                <button onClick={() => { setArama(''); setKategori('hepsi'); }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-600">
                  <Icon name="refresh" className="h-4 w-4" /> Filtreleri sıfırla
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {gorunen.map((y) => <Kart key={y.id} y={y} />)}
              </div>
            )}

            {toplamSayfa > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Sayfalama">
                <button
                  onClick={() => setSayfa((s) => Math.max(1, s - 1))}
                  disabled={guncelSayfa === 1}
                  aria-label="Önceki sayfa"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-strong transition-colors hover:bg-surface2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                </button>
                {sayfalar.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSayfa(n)}
                    aria-current={n === guncelSayfa}
                    className={`grid h-10 min-w-10 place-items-center rounded-xl px-3 text-[14px] font-bold transition-colors ${
                      n === guncelSayfa ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'border border-line bg-surface text-strong hover:bg-surface2'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}
                  disabled={guncelSayfa === toplamSayfa}
                  aria-label="Sonraki sayfa"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-strong transition-colors hover:bg-surface2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      <CtaBand title="Aradığınız yazılımı bulamadınız mı?" text="İhtiyacınıza özel çözüm için ekibimizle konuşun; projenizi birlikte planlayalım." />
    </SiteShell>
  );
}
