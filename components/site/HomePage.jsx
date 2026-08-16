'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
// Urun bulucu mantigi kendi motorunda; bu dosya sadece gosterimden sorumlu.
import { QUESTIONS, recommend } from '@/lib/engines/product-finder';
import DomainAI from './DomainAI';

/* ---------------- hero slider verisi ----------------
   ALTIN KURAL: banner gorselleri HER ZAMAN 1920x1080 (public/img/slider/).
   karartma: 0-100 arasi, gorselin uzerindeki koyulugu ayarlar (metin okunurlugu icin). */
const SLIDES = [
  {
    img: '/img/slider/sunucu-rack.jpg',
    karartma: 68,
    eyebrow: 'Türkiye\'nin güvenilir sunucu sağlayıcısı',
    pre: 'İşinizi', hl: 'güçlü sunuculara', post: 'taşıyın',
    text: 'Hızlı NVMe hosting, ölçeklenebilir sanal sunucular ve kurumsal dedicated çözümler. Ücretsiz SSL, günlük yedek ve gerçek 7/24 destekle.',
    cta: { t: 'Paketleri İncele', href: '/web-hosting' },
    cta2: { t: 'Sunucu Çözümleri', href: '/sanal-sunucu' },
    rozet: ['%99.9 Uptime', 'shield'],
  },
  {
    img: '/img/slider/devre-karti.jpg',
    karartma: 72,
    eyebrow: 'Saniyeler içinde online olun',
    pre: 'Alan adınızı', hl: 'hemen alın', post: '',
    text: 'Yüzlerce uzantı, uygun fiyatlar ve ücretsiz WHOIS gizliliği ile markanızı bugün güvence altına alın. Yapay zekâ destekli alan adı bulucumuzu deneyin.',
    cta: { t: 'Alan Adı Bul', href: '/alan-adi' },
    cta2: { t: 'Transfer Et', href: '/transfer' },
    rozet: ['Ücretsiz WHOIS gizliliği', 'lock'],
  },
  {
    img: '/img/slider/veri-merkezi.jpg',
    karartma: 66,
    eyebrow: 'Kesintisiz, güvenli altyapı',
    pre: 'Siteniz', hl: 'her zaman ayakta', post: 'kalsın',
    text: 'Yedekli ağ, kesintisiz güç kaynağı ve 7/24 izleme ile hizmetiniz asla durmaz. DDoS koruması tüm paketlerde dahildir.',
    cta: { t: 'Veri Merkezimiz', href: '/sunucu-barindirma' },
    cta2: { t: 'Bize Ulaşın', href: '/iletisim' },
    rozet: ['DDoS Korumalı', 'shield'],
  },
];

const FEATURES = [
  { t: 'NVMe SSD Altyapı', d: 'En son nesil NVMe diskler ve LiteSpeed ile sitenizi rakiplerinizden kat kat hızlı sunun.', icon: 'bolt' },
  { t: 'Yedekli Ağ & Güç', d: 'Çift hatlı ağ, kesintisiz güç kaynağı ve 7/24 izleme ile siteniz her zaman erişilebilir kalır.', icon: 'shield' },
  { t: '7/24 Uzman Destek', d: 'Gerçek insanlardan, ortalama 5 dakikada yanıt. Ticket, canlı destek ve telefon.', icon: 'headset' },
  { t: 'Ücretsiz SSL & Yedek', d: 'Tüm paketlerde ücretsiz SSL sertifikası ve otomatik günlük yedekleme dahildir.', icon: 'lock' },
];
/* Gercek kategoriler - her satir kendi sayfasina gider */
const KATEGORILER = [
  {
    baslik: 'Hosting', icon: 'globe', ozet: 'Web siteniz için hazır, yönetimi kolay paketler',
    urunler: [
      { t: 'Web Hosting', d: 'Bireysel & KOBİ siteleri', href: '/web-hosting' },
      { t: 'WordPress Hosting', d: 'WordPress için optimize', href: '/wordpress-hosting' },
      { t: 'Reseller Hosting', d: 'Kendi hosting işinizi kurun', href: '/reseller-hosting' },
      { t: 'Kurumsal Hosting', d: 'Yüksek trafik & izole kaynak', href: '/kurumsal-hosting' },
    ],
  },
  {
    baslik: 'Sunucular', icon: 'server', ozet: 'Tam kontrol ve yüksek performans isteyenler için', one: true,
    urunler: [
      { t: 'Sanal Sunucu (VDS)', d: 'Root erişimli, ölçeklenebilir', href: '/sanal-sunucu' },
      { t: 'Dedicated Sunucu', d: 'Fiziksel, tüm kaynak sizin', href: '/dedicated-sunucu' },
      { t: 'Premium Sunucu', d: 'Premium işlemci gücü', href: '/premium-sunucu' },
      { t: 'GPU Sunucu', d: 'Yapay zekâ, render, hesaplama', href: '/gpu-sunucu' },
      { t: 'ISP Sunucu', d: 'Servis sağlayıcılar için', href: '/isp-sunucu' },
      { t: 'ABD Sunucu', d: 'Amerika lokasyonu', href: '/abd-sunucu' },
    ],
  },
  {
    baslik: 'Alan Adı', icon: 'globe', ozet: 'Markanızı güvence altına alın',
    urunler: [
      { t: 'Alan Adı Tescil', d: 'Yeni alan adı kaydı', href: '/alan-adi' },
      { t: 'Alan Adı Transfer', d: 'Mevcut domaininizi taşıyın', href: '/transfer' },
      { t: 'WHOIS Sorgulama', d: 'Tescil bilgisi sorgulayın', href: '/whois' },
    ],
  },
  {
    baslik: 'Veri Merkezi', icon: 'database', ozet: 'Kendi donanımınız, bizim altyapımız',
    urunler: [
      { t: 'Sunucu Barındırma', d: 'Tier-3 colocation', href: '/sunucu-barindirma' },
      { t: 'IP Kiralama', d: 'Temiz IPv4 / IPv6 blokları', href: '/ip-kiralama' },
    ],
  },
];
const STATS = [['%99.9', 'Uptime Garantisi'], ['10.000+', 'Mutlu Müşteri'], ['7/24', 'Uzman Destek'], ['<5dk', 'Ortalama Yanıt']];

/* ================= HERO SLIDER (gorselli) ================= */
function Hero() {
  const [i, setI] = useState(0);
  const [duraklat, setDuraklat] = useState(false);
  const go = useCallback((n) => setI((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (duraklat) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [duraklat]);

  return (
    <section>
      {/* ---- banner: sabit yukseklik, gorsel arkada, metin onde ---- */}
      <div
        className="relative h-[440px] sm:h-[500px] lg:h-[580px] xl:h-[640px] overflow-hidden bg-ink"
        onMouseEnter={() => setDuraklat(true)}
        onMouseLeave={() => setDuraklat(false)}
      >
        {SLIDES.map((s, n) => (
          <div
            key={s.img}
            aria-hidden={n !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${n === i ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* 1920x1080 banner - kap sabit, gorsel object-cover */}
            <img
              src={s.img}
              alt=""
              width={1920}
              height={1080}
              loading={n === 0 ? 'eager' : 'lazy'}
              fetchPriority={n === 0 ? 'high' : 'auto'}
              className="h-full w-full object-cover"
            />
            {/* karartma: soldan saga koyudan aciga + genel bir kat */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  `linear-gradient(90deg, rgba(8,20,33,${s.karartma / 100}) 0%, rgba(8,20,33,${(s.karartma - 18) / 100}) 45%, rgba(8,20,33,${(s.karartma - 40) / 100}) 100%)`,
              }}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/25" />
          </div>
        ))}

        {/* ---- onde duran icerik ---- */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div key={i} className="max-w-2xl animate-[fadeup_0.7s_ease-out]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-semibold text-white backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                {SLIDES[i].eyebrow}
              </span>

              <h1 className="mt-5 text-[2rem] leading-[1.1] sm:text-[2.75rem] lg:text-5xl xl:text-[3.5rem] font-extrabold tracking-tight text-white text-balance [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
                {SLIDES[i].pre}{' '}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 text-brand-300">{SLIDES[i].hl}</span>
                  <span className="absolute bottom-1 left-0 z-0 h-2.5 w-full rounded bg-brand-400/25" />
                </span>{' '}
                {SLIDES[i].post}
              </h1>

              <p className="mt-4 max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-slate-200 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]">
                {SLIDES[i].text}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={SLIDES[i].cta.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] sm:px-6 sm:py-3.5 sm:text-[15px] font-bold text-white shadow-lg shadow-brand-900/40 transition-colors hover:bg-brand-400"
                >
                  {SLIDES[i].cta.t} <Icon name="arrow" className="w-4 h-4" />
                </Link>
                <Link
                  href={SLIDES[i].cta2.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[14px] sm:px-6 sm:py-3.5 sm:text-[15px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {SLIDES[i].cta2.t}
                </Link>
              </div>

              <div className="mt-6 hidden sm:flex items-center gap-2 text-[13px] font-semibold text-slate-200">
                <Icon name={SLIDES[i].rozet[1]} className="w-4 h-4 text-brand-300" />
                {SLIDES[i].rozet[0]}
              </div>
            </div>
          </div>
        </div>

        {/* ---- yan oklar (sol / sag) ---- */}
        <button
          onClick={() => go(i - 1)}
          aria-label="Önceki slayt"
          className="group absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/35 p-3 text-white backdrop-blur-sm transition-[background-color,border-color,transform] hover:scale-110 hover:border-white/50 hover:bg-ink/60 sm:grid lg:left-6"
        >
          <Icon name="arrow" className="w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={() => go(i + 1)}
          aria-label="Sonraki slayt"
          className="group absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/35 p-3 text-white backdrop-blur-sm transition-[background-color,border-color,transform] hover:scale-110 hover:border-white/50 hover:bg-ink/60 sm:grid lg:right-6"
        >
          <Icon name="arrow" className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* ---- alt noktalar: ilerleme cubuklu ---- */}
        <div className="absolute bottom-5 left-0 right-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 lg:px-8">
            {SLIDES.map((_, n) => (
              <button key={n} onClick={() => go(n)} aria-label={`Slayt ${n + 1}`} aria-current={n === i} className="group/n py-2">
                <span className={`block h-1 overflow-hidden rounded-full bg-white/30 transition-[width] duration-300 ${n === i ? 'w-12' : 'w-6 group-hover/n:bg-white/60'}`}>
                  {n === i && (
                    <span
                      key={`ilerleme-${i}-${duraklat}`}
                      className="block h-full rounded-full bg-brand-400"
                      style={duraklat ? { width: '100%' } : { animation: 'slaytIlerle 7s linear forwards' }}
                    />
                  )}
                </span>
              </button>
            ))}
            {/* mobilde oklar burada */}
            <div className="ml-auto flex gap-2 sm:hidden">
              <button onClick={() => go(i - 1)} aria-label="Önceki" className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-ink/35 text-white backdrop-blur-sm">
                <Icon name="arrow" className="w-4 h-4 rotate-180" />
              </button>
              <button onClick={() => go(i + 1)} aria-label="Sonraki" className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-ink/35 text-white backdrop-blur-sm">
                <Icon name="arrow" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

/* ================= ÜRÜN BULUCU (quiz popup) ================= */
/* Sorular ve oneri mantigi: lib/engines/product-finder */

function ProductFinder({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  useEffect(() => { if (open) { setStep(0); setAns({}); } }, [open]);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  const done = step >= QUESTIONS.length;
  const rec = done ? recommend(ans) : null;
  const pick = (key, v) => { const na = { ...ans, [key]: v }; setAns(na); setStep((s) => s + 1); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-[fadeup_0.2s_ease-out]" />
      <div className="relative w-full max-w-lg rounded-3xl bg-surface p-7 sm:p-9 shadow-2xl animate-[fadeup_0.35s_ease-out]">
        <button onClick={onClose} aria-label="Kapat" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface2 hover:text-strong"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        {/* ilerleme */}
        <div className="flex items-center gap-2">{QUESTIONS.map((_, n) => (<span key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n < step ? 'bg-brand-500' : n === step ? 'bg-brand-300' : 'bg-line'}`} />))}</div>

        {!done ? (
          <div key={step} className="mt-7 animate-[fadeup_0.3s_ease-out]">
            <div className="text-[13px] font-bold uppercase tracking-wider text-brandtext">Adım {step + 1} / {QUESTIONS.length}</div>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-strong text-balance">{QUESTIONS[step].q}</h3>
            <div className="mt-6 grid gap-3">
              {QUESTIONS[step].opts.map((o) => (
                <button key={o.v} onClick={() => pick(QUESTIONS[step].key, o.v)} className="group flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 text-left hover:border-brand-400 hover:bg-brandsoft/50 transition-[transform,box-shadow,border-color,opacity]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icon name={o.icon} className="w-5 h-5" /></span>
                  <span className="flex-1 text-[15px] font-semibold text-strong">{o.l}</span>
                  <Icon name="arrow" className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-[transform,box-shadow,border-color,opacity]" />
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="mt-5 text-sm font-semibold text-muted hover:text-strong">← Geri</button>}
          </div>
        ) : (
          <div className="mt-7 text-center animate-[fadeup_0.4s_ease-out]">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30"><Icon name="check" className="w-7 h-7" /></span>
            <div className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brandtext">Size önerimiz</div>
            <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-strong">{rec.name}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-body">{rec.why}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={rec.slug} onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition">{rec.name} İncele <Icon name="arrow" className="w-4 h-4" /></Link>
              <button onClick={() => { setStep(0); setAns({}); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface2 px-6 py-3.5 text-[15px] font-semibold text-strong hover:bg-line transition"><Icon name="refresh" className="w-4 h-4" /> Baştan Başla</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- ürün bulucu + güven şeridi (tek bölüm) ---------------- */
function FinderBanner({ onOpen }) {
  return (
    <section className="relative overflow-hidden bg-surface2">
      {/* yumusak gecis: ustten sayfa zeminine karisir, sert kenar olmaz */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-page to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brandline/20 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-brandline/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
        {/* ürün bulucu çağrısı */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
              <Icon name="chat" className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-strong text-balance">
                Hangi ürünü seçeceğinizden emin değil misiniz?
              </h2>
              <p className="mt-1.5 text-[15px] text-body">
                3 kısa soru sorun, ihtiyacınıza en uygun çözümü birlikte bulalım.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              onClick={onOpen}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-ink/20 transition-colors hover:bg-brand-600"
            >
              Size Uygun Ürünü Bulalım <Icon name="arrow" className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('cozumler')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext"
            >
              <Icon name="layers" className="w-4 h-4 text-brandtext" /> Tüm Ürünleri Keşfet
            </button>
          </div>
        </div>
      </div>

      {/* alttan da yumusak gecis */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}

/* ---------------- yan floating buton ---------------- */
function FinderTab({ onOpen }) {
  return (
    <button onClick={onOpen} className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-2 rounded-l-2xl bg-brand-600 px-3 py-4 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:pr-5 transition-[transform,box-shadow,border-color,opacity] [writing-mode:vertical-rl] rotate-180" aria-label="Ürün bulucu">
      <Icon name="chat" className="w-5 h-5 rotate-90" /> <span className="text-[13px] font-bold tracking-wide">Sana Uygun Ürün?</span>
    </button>
  );
}

/* ================= SAYFA ================= */
export default function HomePage() {
  const [finder, setFinder] = useState(false);
  const openF = useCallback(() => setFinder(true), []);
  const closeF = useCallback(() => setFinder(false), []);
  return (
    <SiteShell>
      <Hero />
      <FinderBanner onOpen={openF} />
      <FinderTab onOpen={openF} />
      <ProductFinder open={finder} onClose={closeF} />

      {/* AI alan adi bulucu (motor kapaliysa hic basilmaz) */}
      <DomainAI />

      {/* özellikler */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Neden SunucumWEB</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Performans ve güveni bir arada sunuyoruz</h2><p className="mt-4 text-lg text-body">Altyapımızı; hız, kesintisizlik ve destek üçgeninde kurduk. Teknik detayları biz düşünelim, siz işinize odaklanın.</p></div>
        {/* rakamlarla biz */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 md:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-brandtext">{n}</div>
              <div className="mt-1 text-[14px] font-medium text-body">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{FEATURES.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-20px_rgba(15,41,66,0.18)] hover:shadow-[0_24px_60px_-24px_rgba(20,184,166,0.35)] hover:-translate-y-1 transition-[transform,box-shadow,border-color,opacity] duration-300"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icon name={f.icon} /></span><h3 className="mt-5 text-lg font-bold text-strong">{f.t}</h3><p className="mt-2 text-[15px] leading-relaxed text-body">{f.d}</p></div>))}</div>
      </section>

      {/* çözümler: gerçek kategoriler, tıklanınca ilgili sayfaya gider */}
      <section id="cozumler" className="relative scroll-mt-28 bg-surface2 border-y border-line">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Çözümlerimiz</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Size uygun çözümü seçin</h2>
            <p className="mt-4 text-lg text-body">
              Küçük bir web sitesinden kurumsal altyapıya kadar tüm hizmetlerimiz. İhtiyacınıza tıklayın, detaylara geçelim.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-start">
            {KATEGORILER.map((k) => (
              <div
                key={k.baslik}
                className={`flex h-full flex-col rounded-3xl border bg-surface p-6 shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(20,184,166,0.35)] ${k.one ? 'border-brandline ring-1 ring-brandline' : 'border-line'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext">
                    <Icon name={k.icon} className="w-5 h-5" />
                  </span>
                  <h3 className="text-[17px] font-extrabold text-strong">{k.baslik}</h3>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-body">{k.ozet}</p>

                <ul className="mt-5 flex-1 space-y-1">
                  {k.urunler.map((u) => (
                    <li key={u.href + u.t}>
                      <Link
                        href={u.href}
                        className="group/u flex items-start gap-2 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-brandsoft"
                      >
                        <Icon name="arrow" className="mt-0.5 w-3.5 h-3.5 shrink-0 text-brandtext transition-transform group-hover/u:translate-x-0.5" />
                        <span className="min-w-0">
                          <span className="block text-[14px] font-semibold text-strong">{u.t}</span>
                          <span className="block text-[12.5px] leading-snug text-muted">{u.d}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[15px] text-body">
            Hangisinin size uygun olduğundan emin değil misiniz?{' '}
            <Link href="/iletisim" className="font-bold text-brandtext hover:underline underline-offset-4">Uzmanımıza sorun</Link>
          </p>
        </div>
      </section>

      {/* koyu istatistik */}
      <section className="relative overflow-hidden bg-ink"><div aria-hidden className="pointer-events-none absolute inset-0"><div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand-500/20 blur-[100px]" /><div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-brand-400/10 blur-[100px]" /></div><div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20"><div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center"><div><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">Binlerce işletme altyapısını bize emanet ediyor</h2><p className="mt-4 text-lg text-slate-300">Startup'lardan kurumsal firmalara; hız, güvenlik ve kesintisiz destek arayan herkes SunucumWEB'i tercih ediyor.</p><Link href="/hakkimizda" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[15px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 transition">Hikâyemizi keşfedin <Icon name="arrow" className="w-4 h-4" /></Link></div><div className="grid grid-cols-2 gap-4">{STATS.map(([n, l]) => (<div key={l} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 backdrop-blur"><div className="text-3xl sm:text-4xl font-extrabold text-brand-300">{n}</div><div className="mt-1 text-sm text-slate-300">{l}</div></div>))}</div></div></div></section>
      <CtaBand />
    </SiteShell>
  );
}
