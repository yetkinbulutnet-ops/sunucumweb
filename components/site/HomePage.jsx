'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
// Urun bulucu mantigi kendi motorunda; bu dosya sadece gosterimden sorumlu.
import { QUESTIONS, recommend } from '@/lib/engines/product-finder';
import AddToCartButton from './AddToCartButton';
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
const TLDS = ['.com', '.net', '.com.tr', '.org', '.xyz'];

const FEATURES = [
  { t: 'NVMe SSD Altyapı', d: 'En son nesil NVMe diskler ve LiteSpeed ile sitenizi rakiplerinizden kat kat hızlı sunun.', icon: 'bolt' },
  { t: '%99.9 Uptime Garantisi', d: 'Yedekli ağ, kesintisiz güç ve 7/24 izleme ile siteniz her zaman erişilebilir kalır.', icon: 'shield' },
  { t: '7/24 Uzman Destek', d: 'Gerçek insanlardan, ortalama 5 dakikada yanıt. Ticket, canlı destek ve telefon.', icon: 'headset' },
  { t: 'Ücretsiz SSL & Yedek', d: 'Tüm paketlerde ücretsiz SSL sertifikası ve otomatik günlük yedekleme dahildir.', icon: 'lock' },
];
const PLANS = [
  { name: 'Web Hosting', href: '/web-hosting', price: '49', popular: false, tag: 'Bireysel & KOBİ', feats: ['10 GB NVMe SSD', 'Sınırsız Trafik', 'Ücretsiz SSL', 'cPanel Kontrol Paneli', 'Günlük Yedekleme'] },
  { name: 'Sanal Sunucu', href: '/sanal-sunucu', price: '299', popular: true, tag: 'En Çok Tercih Edilen', feats: ['4 vCPU · 8 GB RAM', '160 GB NVMe SSD', 'Tam Root Erişimi', 'Anlık Kurulum', 'DDoS Koruması'] },
  { name: 'Dedicated Sunucu', href: '/dedicated-sunucu', price: '1.499', popular: false, tag: 'Yüksek Performans', feats: ['Fiziksel Sunucu', 'Intel Xeon İşlemci', '1 Gbps Bağlantı', 'IPMI Yönetim', 'Kurumsal SLA'] },
];
const STATS = [['%99.9', 'Uptime Garantisi'], ['10.000+', 'Mutlu Müşteri'], ['7/24', 'Uzman Destek'], ['<5dk', 'Ortalama Yanıt']];

/* ================= HERO SLIDER (gorselli) ================= */
function Hero() {
  const [i, setI] = useState(0);
  const [domain, setDomain] = useState('');
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

        {/* ---- kontroller ---- */}
        <div className="absolute bottom-5 left-0 right-0">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, n) => (
                <button
                  key={n}
                  onClick={() => go(n)}
                  aria-label={`Slayt ${n + 1}`}
                  aria-current={n === i}
                  className={`h-1.5 rounded-full transition-[transform,box-shadow,border-color,opacity] ${n === i ? 'w-8 bg-brand-400' : 'w-4 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(i - 1)} aria-label="Önceki" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25">
                <Icon name="arrow" className="w-4 h-4 rotate-180" />
              </button>
              <button onClick={() => go(i + 1)} aria-label="Sonraki" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25">
                <Icon name="arrow" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- banner altinda alan adi arama seridi (temali) ---- */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-6 lg:py-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="shrink-0">
              <div className="text-[15px] font-extrabold text-strong">Alan adınızı hemen sorgulayın</div>
              <div className="mt-0.5 text-[13px] text-muted">Yüzlerce uzantı, ücretsiz WHOIS gizliliği</div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/alan-adi'; }} className="flex-1">
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-page p-2 transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brandline/40">
                <span className="pl-3 text-muted"><Icon name="search" className="w-5 h-5" /></span>
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="firmaadi.com"
                  aria-label="Alan adı"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-strong placeholder:text-muted outline-none"
                />
                <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-600 sm:px-5 sm:text-[15px]">
                  Sorgula <Icon name="arrow" className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 pl-1 text-[13px]">
                <span className="font-medium text-muted">Popüler:</span>
                {TLDS.map((t) => <span key={t} className="font-semibold text-body">{t}</span>)}
              </div>
            </form>
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

/* ---------------- ürün bulucu banner ---------------- */
function FinderBanner({ onOpen }) {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 pt-4">
      <div className="relative overflow-hidden rounded-3xl border border-brandline/70 bg-gradient-to-br from-brandsoft to-surface px-7 py-8 sm:px-10 shadow-[0_20px_50px_-30px_rgba(13,148,136,0.4)]">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30"><Icon name="chat" className="w-6 h-6" /></span>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-strong text-balance">Hangi ürünü seçeceğinizden emin değil misiniz?</h2>
              <p className="mt-1.5 text-[15px] text-body">3 kısa soru sorun, ihtiyacınıza en uygun çözümü birlikte bulalım.</p>
            </div>
          </div>
          <button onClick={onOpen} className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-600 transition shadow-lg shadow-ink/20">
            Size Uygun Ürünü Bulalım <Icon name="arrow" className="w-4 h-4" />
          </button>
        </div>
      </div>
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

      {/* güven şeridi */}
      <section className="mt-4 border-y border-line bg-surface2"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-7"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{STATS.map(([n, l]) => (<div key={l} className="text-center md:text-left"><div className="text-2xl md:text-3xl font-extrabold text-strong">{n}</div><div className="mt-0.5 text-sm text-body">{l}</div></div>))}</div></div></section>

      {/* AI alan adi bulucu (motor kapaliysa hic basilmaz) */}
      <DomainAI />

      {/* özellikler */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Neden SunucumWEB</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Performans ve güveni bir arada sunuyoruz</h2><p className="mt-4 text-lg text-body">Altyapımızı; hız, kesintisizlik ve destek üçgeninde kurduk. Teknik detayları biz düşünelim, siz işinize odaklanın.</p></div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{FEATURES.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-20px_rgba(15,41,66,0.18)] hover:shadow-[0_24px_60px_-24px_rgba(20,184,166,0.35)] hover:-translate-y-1 transition-[transform,box-shadow,border-color,opacity] duration-300"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icon name={f.icon} /></span><h3 className="mt-5 text-lg font-bold text-strong">{f.t}</h3><p className="mt-2 text-[15px] leading-relaxed text-body">{f.d}</p></div>))}</div>
      </section>

      {/* paketler */}
      <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Paketler</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Size uygun çözümü seçin</h2><p className="mt-4 text-lg text-body">Küçük bir web sitesinden kurumsal altyapıya kadar, ihtiyacınıza göre ölçeklenen paketler.</p></div>
        <div className="mt-14 grid lg:grid-cols-3 gap-6 lg:gap-5 items-stretch">{PLANS.map((p) => (<div key={p.name} className={`relative flex flex-col rounded-3xl p-7 transition-[transform,box-shadow,border-color,opacity] duration-300 ${p.popular ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgba(15,41,66,0.6)] lg:-translate-y-4 ring-1 ring-brand-400/40' : 'bg-surface border border-line shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)]'}`}>{p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-brand-500/40">EN POPÜLER</span>}<div className={`text-xs font-bold uppercase tracking-wider ${p.popular ? 'text-brand-300' : 'text-brandtext'}`}>{p.tag}</div><div className={`mt-1.5 text-xl font-extrabold ${p.popular ? 'text-white' : 'text-strong'}`}>{p.name}</div><div className="mt-5 flex items-baseline gap-1"><span className={`text-sm font-semibold ${p.popular ? 'text-slate-300' : 'text-muted'}`}>₺</span><span className={`text-5xl font-extrabold tracking-tight ${p.popular ? 'text-white' : 'text-strong'}`}>{p.price}</span><span className={`text-sm ${p.popular ? 'text-slate-300' : 'text-muted'}`}>/ay</span></div><ul className="mt-6 space-y-3 flex-1">{p.feats.map((ft) => (<li key={ft} className="flex items-center gap-3 text-[15px]"><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.popular ? 'bg-brand-500/20 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name="check" className="w-3 h-3" /></span><span className={p.popular ? 'text-slate-200' : 'text-body'}>{ft}</span></li>))}</ul><Link href={p.href} className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold transition-[transform,box-shadow,border-color,opacity] ${p.popular ? 'bg-brand-500 text-white hover:bg-brand-400 shadow-lg shadow-brand-500/30' : 'bg-ink text-white hover:bg-brand-600'}`}>İncele <Icon name="arrow" className="w-4 h-4" /></Link><AddToCartButton item={{ name: p.name, product: p.tag, price: p.price }} tema={p.popular ? 'koyu' : 'acik'} className="mt-2 w-full" /></div>))}</div>
        <p className="mt-6 text-center text-sm text-muted">* Fiyatlar temsilîdir; gerçek paket fiyatlarınızı buraya girebilirsiniz.</p>
      </div></section>

      {/* koyu istatistik */}
      <section className="relative overflow-hidden bg-ink"><div aria-hidden className="pointer-events-none absolute inset-0"><div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand-500/20 blur-[100px]" /><div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-brand-400/10 blur-[100px]" /></div><div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20"><div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center"><div><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">Binlerce işletme altyapısını bize emanet ediyor</h2><p className="mt-4 text-lg text-slate-300">Startup'lardan kurumsal firmalara; hız, güvenlik ve kesintisiz destek arayan herkes SunucumWEB'i tercih ediyor.</p><Link href="/hakkimizda" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[15px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 transition">Hikâyemizi keşfedin <Icon name="arrow" className="w-4 h-4" /></Link></div><div className="grid grid-cols-2 gap-4">{STATS.map(([n, l]) => (<div key={l} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 backdrop-blur"><div className="text-3xl sm:text-4xl font-extrabold text-brand-300">{n}</div><div className="mt-1 text-sm text-slate-300">{l}</div></div>))}</div></div></div></section>
      <CtaBand />
    </SiteShell>
  );
}
