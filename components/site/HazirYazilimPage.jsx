'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon, SiteShell, CtaBand } from './chrome';
import { useParabirimi } from './CurrencyProvider';
import { m } from '@/lib/metin';

const PER = 12;

const siralamalar = () => [
  { v: 'populer', l: m('yazilim.sirala_onerilen') },
  { v: 'fiyat-artan', l: m('yazilim.sirala_fiyat_artan') },
  { v: 'fiyat-azalan', l: m('yazilim.sirala_fiyat_azalan') },
  { v: 'isim', l: m('yazilim.sirala_isim') },
];

const fiyatYaz = (n) => new Intl.NumberFormat('tr-TR').format(n);
const kucuk = (s) => s.toLocaleLowerCase('tr');

function KategoriIkon({ slug, kategoriler }) {
  const k = kategoriler.find((x) => x.slug === slug);
  return <Icon name={k ? k.icon : 'layers'} className="h-4 w-4" />;
}

function IndirimRozet({ eski, yeni }) {
  if (!eski || !yeni || eski <= yeni) return null;
  const oran = Math.round((1 - yeni / eski) * 100);
  if (oran < 1) return null;
  return (
    <span className="absolute left-3 top-3 rounded-lg bg-rose-500 px-2 py-1 text-[11px] font-extrabold text-white shadow-lg">
      {m('yazilim.indirim', { oran })}
    </span>
  );
}

function Kart({ y, kategoriler }) {
  const { fiyat } = useParabirimi();
  const kat = kategoriler.find((x) => x.slug === y.kategori);
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_40px_-24px_rgba(15,41,66,0.22)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-28px_rgba(20,184,166,0.35)]">
      <Link href={`/hazir-yazilim/${y.id}`} className="relative block aspect-[4/3] overflow-hidden bg-surface2">
        <img
          src={y.img}
          alt={y.ad}
          width={800}
          height={600}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <IndirimRozet eski={y.eskiFiyat} yeni={y.fiyat} />
        {y.oneCikan && (
          <span className="absolute right-3 top-3 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow">
            {m('yazilim.populer')}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brandsoft px-2.5 py-1 text-[11.5px] font-bold text-brandtext">
          <KategoriIkon slug={y.kategori} kategoriler={kategoriler} /> {kat ? kat.ad : m('yazilim.varsayilan_kategori')}
        </span>
        <Link href={`/hazir-yazilim/${y.id}`} className="mt-3">
          <h3 className="text-[16px] font-extrabold text-strong transition-colors hover:text-brandtext">{y.ad}</h3>
        </Link>
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-body line-clamp-3">{y.aciklama}</p>

        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-baseline gap-2">
            {y.eskiFiyat > y.fiyat && (
              <span className="text-[12.5px] font-medium text-muted line-through">{fiyat(y.eskiFiyat, { sembolSonda: true })}</span>
            )}
            <span className="text-[19px] font-extrabold tracking-tight text-strong">
              {fiyat(y.fiyat, { sembolSonda: true })}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={`/hazir-yazilim/${y.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-600"
            >
              {m('yazilim.incele')} <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
            {y.demoUrl && (
              <a
                href={y.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="Demo"
                data-umami-event-urun={y.ad}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-[13.5px] font-bold text-strong transition-colors hover:border-brandline hover:text-brandtext"
              >
                {m('yazilim.demo')} <Icon name="external" className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HazirYazilimPage({ yazilimlar: YAZILIMLAR, kategoriler: YAZILIM_KATEGORILERI, seridi }) {
  const YAZILIM_SERIDI = { eyebrow: seridi.eyebrow, baslik: seridi.baslik, metin: seridi.aciklama };
  const [kategori, setKategori] = useState('hepsi');
  const [arama, setArama] = useState('');
  const [sirala, setSirala] = useState('populer');
  const [sayfa, setSayfa] = useState(1);
  const listeUst = useRef(null);
  const ilkRender = useRef(true);

  const sayimlar = useMemo(() => {
    const sayac = {};
    for (const y of YAZILIMLAR) sayac[y.kategori] = (sayac[y.kategori] || 0) + 1;
    return sayac;
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
            <Link href="/" className="hover:text-brandtext">{m('yazilim.kirinti_ana_sayfa')}</Link><span>/</span>
            <span className="font-medium text-strong/70">{m('yazilim.kirinti_hazir_yazilimlar')}</span>
          </div>
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{YAZILIM_SERIDI.eyebrow}</span>
          <h1 className="mt-3 max-w-3xl tipo-dev font-extrabold tracking-tight text-strong text-balance">{YAZILIM_SERIDI.baslik}</h1>
          <p className="mt-5 max-w-2xl tipo-giris text-body">{YAZILIM_SERIDI.metin}</p>
        </div>
      </section>

      <div ref={listeUst} className="scroll-mt-24 mx-auto max-w-7xl px-5 lg:px-8 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-2 hidden px-1 text-[12px] font-bold uppercase tracking-wider text-muted lg:block">{m('yazilim.kategoriler')}</div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [-webkit-overflow-scrolling:touch]">
              <button
                onClick={() => setKategori('hepsi')}
                className={`inline-flex shrink-0 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-colors lg:w-full ${
                  kategori === 'hepsi' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-surface text-strong ring-1 ring-line hover:bg-surface2'
                }`}
              >
                <span className="flex items-center gap-2"><Icon name="layers" className="h-4 w-4" /> {m('yazilim.tumu')}</span>
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
                <Icon name="chat" className="h-4 w-4 text-brandtext" /> {m('yazilim.ozel_baslik')}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-body">{m('yazilim.ozel_metin')}</p>
              <Link href="/iletisim" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brandtext hover:underline underline-offset-4">
                {m('yazilim.teklif_alin')} <Icon name="arrow" className="h-3.5 w-3.5" />
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
                  placeholder={m('yazilim.arama_placeholder')}
                  aria-label={m('yazilim.arama_aria')}
                  className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-strong placeholder:text-muted outline-none"
                />
              </div>
              <label className="flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-1">
                <span className="text-[13px] font-semibold text-muted">{m('yazilim.sirala')}</span>
                <select
                  value={sirala}
                  onChange={(e) => setSirala(e.target.value)}
                  aria-label={m('yazilim.siralama_aria')}
                  className="cursor-pointer bg-transparent py-2 pr-1 text-[14px] font-semibold text-strong outline-none"
                >
                  {siralamalar().map((s) => <option key={s.v} value={s.v} className="bg-surface text-strong">{s.l}</option>)}
                </select>
              </label>
            </div>

            <p className="mt-4 text-[13.5px] text-muted">
              <span className="font-bold text-strong">{filtrelenmis.length}</span> {m('yazilim.sonuc_sayisi')}
              {kategori !== 'hepsi' && <> · <button onClick={() => setKategori('hepsi')} className="font-semibold text-brandtext hover:underline">{m('yazilim.filtre_temizle')}</button></>}
            </p>

            {gorunen.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-line bg-surface2/50 px-6 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-muted ring-1 ring-line"><Icon name="search" className="h-6 w-6" /></span>
                <p className="mt-5 text-[16px] font-bold text-strong">{m('yazilim.sonuc_yok_baslik')}</p>
                <p className="mt-1.5 text-[14px] text-body">{m('yazilim.sonuc_yok_metin')}</p>
                <button onClick={() => { setArama(''); setKategori('hepsi'); }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-600">
                  <Icon name="refresh" className="h-4 w-4" /> {m('yazilim.filtre_sifirla')}
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {gorunen.map((y) => <Kart key={y.id} y={y} kategoriler={YAZILIM_KATEGORILERI} />)}
              </div>
            )}

            {toplamSayfa > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label={m('yazilim.sayfalama_aria')}>
                <button
                  onClick={() => setSayfa((s) => Math.max(1, s - 1))}
                  disabled={guncelSayfa === 1}
                  aria-label={m('yazilim.onceki_sayfa')}
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
                  aria-label={m('yazilim.sonraki_sayfa')}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-strong transition-colors hover:bg-surface2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      <CtaBand title={m('yazilim.cta_baslik')} text={m('yazilim.cta_metin')} />
    </SiteShell>
  );
}
