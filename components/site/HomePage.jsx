'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';

import { QUESTIONS, recommend } from '@/lib/engines/product-finder';
import { scrollKilitle } from '@/lib/engines/scroll-lock';
import DomainAI from './DomainAI';
import DurumWidget from './DurumWidget';
import LogoSerit from './LogoSerit';
import Sema from './Sema';
import { sssSemasi } from '@/lib/semalar';
import { MARKALAR, MARKA_SERIDI } from '@/content/site/markalar';
import { YAZILIMLAR, YAZILIM_KATEGORILERI } from '@/content/site/yazilimlar';

const SLIDES = [
  {
    img: '/img/galeri/kabin-yogun.webp', imgAlt: 'SunucumWEB veri merkezinde sunucu kabinleri',
    eyebrow: 'NVMe hosting · cPanel · İstanbul lokasyonu',
    pre: 'Siteniz için', hl: 'hızlı NVMe hosting', post: '',
    text: 'LiteSpeed önbelleği, cPanel, ücretsiz SSL ve günlük yedekle sitenizi dakikalar içinde yayına alın. Ücretsiz taşıma ve gerçek 7/24 destek dahil.',
    cta: { t: 'Hosting paketleri', href: '/web-hosting' },
    cta2: { t: 'Ücretsiz taşıma', href: '/iletisim' },
    rozet: ['Ücretsiz site taşıma', 'refresh'], stat: ['%99.9', 'Uptime'],
  },
  {
    img: '/img/galeri/kabin-dellemc.webp', imgAlt: 'Kurumsal fiziksel dedicated sunucular',
    eyebrow: 'Fiziksel sunucu · Intel Xeon · Tam donanım',
    pre: 'Gücün tamamı sizin:', hl: 'fiziksel sunucular', post: '',
    text: 'Intel Xeon işlemciler, NVMe diskler ve IPMI yönetimiyle tüm donanım yalnızca size ait. Komşusuz performans, tam root ve DDoS korumalı premium ağ.',
    cta: { t: 'Dedicated sunucular', href: '/dedicated-sunucu' },
    cta2: { t: 'Teklif al', href: '/iletisim' },
    rozet: ['Tek kiracı, komşusuz', 'server'], stat: ['1 Gbps', 'Premium ağ'],
  },
  {
    img: '/img/galeri/kabin-gpu.webp', imgAlt: 'GPU hızlandırmalı sunucu kabinleri',
    eyebrow: 'GPU sunucu · NVIDIA · AI & render',
    pre: 'Yapay zeka ve render için', hl: 'GPU hızlandırma', post: '',
    text: 'NVIDIA GPU sunucularla model eğitimi, çıkarım ve 3B render iş yüklerinizi katlayın. CUDA hazır ortam, NVMe disk ve tam root erişimi dahil.',
    cta: { t: 'GPU sunucular', href: '/gpu-sunucu' },
    cta2: { t: 'Bize ulaşın', href: '/iletisim' },
    rozet: ['CUDA hazır ortam', 'cpu'], stat: ['NVIDIA', 'GPU'],
  },
  {
    img: '/img/galeri/kabin-anahtar.webp', imgAlt: 'Alan adınızı güvenceye alın',
    eyebrow: 'Belgesiz .com.tr · AI destekli bulucu',
    pre: 'Belgesiz', hl: '.com.tr alan adı', post: '',
    text: 'Artık evrak yok: .com.tr alan adınızı belgesiz, dakikalar içinde tescil edin. Kararsızsanız yapay zeka destekli bulucumuz size en uygun ismi önersin.',
    cta: { t: 'Alan adı sorgula', href: '/alan-adi' },
    cta2: { t: 'AI ile bul', href: '/alan-adi' },
    rozet: ['Ücretsiz WHOIS gizliliği', 'lock'], stat: ['Belgesiz', '.com.tr'],
  },
];

const FEATURES = [
  { t: 'NVMe SSD Altyapı', d: 'En son nesil NVMe diskler ve LiteSpeed ile sitenizi rakiplerinizden kat kat hızlı sunun.', icon: 'bolt' },
  { t: 'Yedekli Ağ & Güç', d: 'Çift hatlı ağ, kesintisiz güç kaynağı ve 7/24 izleme ile siteniz her zaman erişilebilir kalır.', icon: 'shield' },
  { t: '7/24 Uzman Destek', d: 'Gerçek insanlardan, ortalama 5 dakikada yanıt. Ticket, canlı destek ve telefon.', icon: 'headset' },
  { t: 'Ücretsiz SSL & Yedek', d: 'Tüm paketlerde ücretsiz SSL sertifikası ve otomatik günlük yedekleme dahildir.', icon: 'lock' },
];

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

const OZET_PAKETLER = [
  { urun: 'Web Hosting', paket: 'Profesyonel', fiyat: '99', vurgu: false, ozet: 'Kişisel ve KOBİ siteleri için hızlı NVMe hosting.', ozellikler: ['50 GB NVMe SSD', '10 Web Sitesi', 'Ücretsiz SSL', 'Günlük Yedek'], icon: 'globe' },
  { urun: 'Sanal Sunucu', paket: 'VDS 4', fiyat: '299', vurgu: true, ozet: 'Root erişimli, saniyeler içinde ölçeklenen sanal sunucu.', ozellikler: ['4 vCPU · 8 GB RAM', '160 GB NVMe SSD', 'Tam Root Erişimi', 'DDoS Koruması'], icon: 'vds' },
  { urun: 'Kurumsal Hosting', paket: 'Kurumsal M', fiyat: '699', vurgu: false, ozet: 'Yüksek trafikli kurumsal siteler için izole kaynak.', ozellikler: ['8 GB Garantili RAM', 'İzole Kaynak', 'DDoS Koruması', 'Kurumsal SLA'], icon: 'kurumsal' },
];

const SSS_ANA = [
  { q: 'Sunucularınız nerede barındırılıyor?', a: 'Isparta merkezliyiz; hizmetlerimiz yedekli güç ve soğutmaya sahip Türkiye lokasyonlu veri merkezi altyapısında çalışır. Düşük gecikme ve KVKK uyumu için verileriniz yurt içinde kalır.' },
  { q: 'Hizmetim ne kadar sürede aktif olur?', a: 'Ödeme onaylandıktan sonra hosting ve sanal sunucular çoğunlukla birkaç dakika içinde otomatik olarak kurulur. Dedicated sunucularda teslim süresi yapılandırmaya göre değişir.' },
  { q: 'Memnun kalmazsam iade alabilir miyim?', a: 'Evet. Uygun hizmetlerde 30 gün içinde koşulsuz iade garantisi sunuyoruz; detaylar iade politikamızda yer alır.' },
  { q: 'Teknik desteğe nasıl ulaşırım?', a: '7/24 canlı destek, ticket ve telefonla ulaşabilirsiniz. Ortalama ilk yanıt süremiz 5 dakikanın altındadır.' },
  { q: 'Ödeme nasıl yapılıyor?', a: 'Kredi kartı ve banka havalesi ile müşteri panelinden güvenle ödeyebilirsiniz. Tüm işlemler SSL ile şifrelenir.' },
];

function Hero() {
  const [i, setI] = useState(0);
  const [duraklat, setDuraklat] = useState(false);
  const go = useCallback((n) => setI((n + SLIDES.length) % SLIDES.length), []);
  const dokunus = useRef(null);

  useEffect(() => {
    if (duraklat) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [duraklat]);

  const dokunBasla = (e) => {
    const n = e.touches[0];
    dokunus.current = { x: n.clientX, y: n.clientY };
  };

  const dokunBitir = (e) => {
    const bas = dokunus.current;
    dokunus.current = null;
    if (!bas) return;
    const n = e.changedTouches[0];
    const dx = n.clientX - bas.x;
    const dy = n.clientY - bas.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
  };

  const s = SLIDES[i];

  return (
    <section
      className="relative touch-pan-y overflow-hidden bg-ink"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setDuraklat(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setDuraklat(false)}
      onTouchStart={dokunBasla}
      onTouchEnd={dokunBitir}
      onTouchCancel={() => { dokunus.current = null; }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-6%] h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="absolute -bottom-32 left-[-8%] h-[440px] w-[440px] rounded-full bg-brand-400/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div key={i} className="min-w-0 animate-[fadeup_0.6s_ease-out]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-semibold text-white backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              {s.eyebrow}
            </span>

            <h1 className="mt-5 text-[2rem] leading-[1.1] sm:text-[2.6rem] lg:text-5xl xl:text-[3.4rem] font-extrabold tracking-tight text-white text-balance">
              {s.pre}{' '}
              <span className="relative">
                <span className="relative z-10 text-brand-300">{s.hl}</span>
                <span aria-hidden className="absolute bottom-1 left-0 z-0 h-2.5 w-full rounded bg-brand-400/25" />
              </span>{s.post ? ' ' + s.post : ''}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-slate-300">{s.text}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={s.cta.href} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-900/40 transition-colors hover:bg-brand-400 sm:px-6 sm:py-3.5 sm:text-[15px]">
                {s.cta.t} <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href={s.cta2.href} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[14px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-6 sm:py-3.5 sm:text-[15px]">
                {s.cta2.t}
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-slate-200">
              <Icon name={s.rozet[1]} className="h-4 w-4 text-brand-300" />
              {s.rozet[0]}
            </div>
          </div>

          <div className="relative">
            <div aria-hidden className="absolute -inset-5 -z-10 rounded-[2.75rem] bg-brand-500/15 blur-[70px]" />
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
              {SLIDES.map((sl, n) => (
                <div
                  key={sl.img}
                  aria-hidden={n !== i}
                  className={`absolute inset-0 overflow-hidden rounded-3xl border border-white/10 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.75)] transition-opacity duration-700 ease-out ${n === i ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={sl.img} alt={sl.imgAlt} width={480} height={600} loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : 'auto'} className="h-full w-full object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                </div>
              ))}
              <div className="absolute -left-5 bottom-6 rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 shadow-xl backdrop-blur">
                <div className="text-xl font-extrabold leading-none text-brand-300">{s.stat[0]}</div>
                <div className="mt-1 text-[11px] text-slate-300">{s.stat[1]}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 sm:mt-12">
          {SLIDES.map((_, n) => (
            <button key={n} onClick={() => go(n)} aria-label={`Slayt ${n + 1}`} aria-current={n === i} className="group/n py-2">
              <span className={`block h-1 overflow-hidden rounded-full bg-white/25 transition-[width] duration-300 ${n === i ? 'w-12' : 'w-6 group-hover/n:bg-white/50'}`}>
                {n === i && (
                  <span key={`ilerleme-${i}-${duraklat}`} className="block h-full rounded-full bg-brand-400" style={duraklat ? { width: '100%' } : { animation: 'slaytIlerle 7s linear forwards' }} />
                )}
              </span>
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button onClick={() => go(i - 1)} aria-label="Önceki slayt" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button onClick={() => go(i + 1)} aria-label="Sonraki slayt" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductFinder({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  useEffect(() => { if (open) { setStep(0); setAns({}); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    const coz = scrollKilitle();
    return () => { window.removeEventListener('keydown', esc); coz(); };
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

function FinderBanner({ onOpen }) {
  return (
    <section className="relative overflow-hidden bg-surface2">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-page to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brandline/20 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-brandline/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
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
                3 kısa soruya cevap verin, size uygun paketi birlikte bulalım.
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

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}

function FinderTab({ onOpen }) {
  return (
    <button onClick={onOpen} className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-2 rounded-l-2xl bg-brand-600 px-3 py-4 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:pr-5 transition-[transform,box-shadow,border-color,opacity] [writing-mode:vertical-rl] rotate-180" aria-label="Ürün bulucu">
      <Icon name="chat" className="w-5 h-5 rotate-90" /> <span className="text-[13px] font-bold tracking-wide">Sana Uygun Ürün?</span>
    </button>
  );
}

const ALTYAPI_OZ = [
  { icon: 'database', t: 'Tier-3 veri merkezi', d: 'Yedekli güç, hassas iklimlendirme ve N+1 mimari ile kesintisiz çalışma.' },
  { icon: 'shield', t: '7/24 fiziksel güvenlik', d: 'Kartlı geçiş, kamera ve sürekli personel. Verileriniz yurt içinde kalır.' },
  { icon: 'wifi', t: 'Yedekli omurga', d: 'Çoklu uplink ve BGP yönlendirme ile düşük gecikmeli, kesintisiz bağlantı.' },
  { icon: 'signal', t: 'Canlı izleme (NOC)', d: 'Ağ ve donanım sürekli izlenir; sorun büyümeden çözülür.' },
];

function AltyapiVitrin() {
  return (
    <section className="border-y border-line bg-surface2">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                <img src="/img/galeri/kabin-dellemc.webp" alt="SunucumWEB veri merkezi sunucu kabinleri" width={1280} height={800} loading="lazy" className="h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl bg-ink/70 px-3 py-2 text-white backdrop-blur">
                  <Icon name="pin" className="h-4 w-4 text-brand-300" />
                  <span className="text-[12.5px] font-semibold">İstanbul · Türkiye lokasyonu</span>
                </div>
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-line">
                <img src="/img/galeri/kabin-gpu.webp" alt="GPU hızlandırmalı sunucu kabini" width={800} height={800} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-line">
                <img src="/img/galeri/kabin-acik.webp" alt="Sunucu kabini ve yapılandırılmış kablolama" width={800} height={800} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Altyapımız</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Kendi veri merkezi altyapımız, Türkiye lokasyonunda</h2>
            <p className="mt-4 tipo-metin text-body">Sunucularınız yedekli güç, hassas iklimlendirme ve sürekli izlenen bir ağ omurgasında çalışır. Donanımdan kablolamaya kadar altyapının tamamı bizim kontrolümüzde; bu da daha hızlı müdahale ve daha yüksek erişilebilirlik demek.</p>
            <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              {ALTYAPI_OZ.map((f) => (
                <div key={f.t} className="flex gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span>
                  <div className="min-w-0"><h3 className="text-[15.5px] font-bold text-strong">{f.t}</h3><p className="mt-1 text-[13.5px] leading-relaxed text-body">{f.d}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/hakkimizda" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-brand-600">Şirket profilimiz <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/sunucu-barindirma" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-[14.5px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext">Veri merkezi çözümleri</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaketlerVitrin() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Öne Çıkan Paketler</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">İhtiyacınıza göre ölçeklenen çözümler</h2>
          <p className="mt-4 tipo-metin text-body">Hosting'ten sanal sunucuya en çok tercih edilen paketler. Size en uygun yapılandırmayı birlikte belirleyelim.</p>
        </div>
        <Link href="/iletisim" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-[14px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext">
          Tüm paketler için görüşün <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
        {OZET_PAKETLER.map((p) => (
          <div key={p.urun} className={`relative flex flex-col rounded-3xl p-7 transition-[transform,box-shadow,border-color] duration-300 ${p.vurgu ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgba(15,41,66,0.6)] lg:-translate-y-3 ring-1 ring-brand-400/40' : 'bg-surface border border-line shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] hover:-translate-y-1'}`}>
            {p.vurgu && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-brand-500/40">EN POPÜLER</span>}
            <div className="flex items-center gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${p.vurgu ? 'bg-white/10 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name={p.icon} /></span>
              <div>
                <div className={`text-[12px] font-bold uppercase tracking-wide ${p.vurgu ? 'text-slate-300' : 'text-muted'}`}>{p.urun}</div>
                <div className={`text-[18px] font-extrabold ${p.vurgu ? 'text-white' : 'text-strong'}`}>{p.paket}</div>
              </div>
            </div>
            <p className={`mt-4 text-[14px] leading-relaxed ${p.vurgu ? 'text-slate-300' : 'text-body'}`}>{p.ozet}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className={`text-sm font-semibold ${p.vurgu ? 'text-slate-300' : 'text-muted'}`}>₺</span>
              <span className={`text-4xl font-extrabold tracking-tight ${p.vurgu ? 'text-white' : 'text-strong'}`}>{p.fiyat}</span>
              <span className={`text-sm ${p.vurgu ? 'text-slate-300' : 'text-muted'}`}>/ay</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {p.ozellikler.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]">
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.vurgu ? 'bg-brand-500/20 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name="check" className="w-3 h-3" /></span>
                  <span className={p.vurgu ? 'text-slate-200' : 'text-body'}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/iletisim" className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-bold transition-colors ${p.vurgu ? 'bg-brand-500 text-white hover:bg-brand-400' : 'bg-ink text-white hover:bg-brand-600'}`}>Teklif Al <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-[13px] text-muted">Paketler ihtiyacınıza göre özelleştirilebilir. Net fiyat ve yapılandırma için bizimle görüşün.</p>
    </section>
  );
}

function YazilimVitrin() {
  const one = YAZILIMLAR.filter((y) => y.oneCikan).slice(0, 4);
  const kat = (s) => YAZILIM_KATEGORILERI.find((k) => k.slug === s);
  return (
    <section className="bg-surface2 border-y border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Hazır Yazılımlar</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Kurmadan hazır, dakikalar içinde yayında</h2>
            <p className="mt-4 tipo-metin text-body">E-ticaretten kurumsal siteye, rezervasyondan eğitim platformuna; işinizi hızla internete taşıyacak hazır web yazılımları.</p>
          </div>
          <Link href="/hazir-yazilim" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600">
            Tüm yazılımlar <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {one.map((y) => {
            const k = kat(y.kategori);
            return (
              <Link key={y.id} href="/hazir-yazilim" className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white"><Icon name={k ? k.icon : 'layers'} /></span>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">{k ? k.ad : 'Yazılım'}</div>
                <h3 className="mt-1 text-[16px] font-extrabold text-strong">{y.ad}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-body">{y.aciklama}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brandtext">İncele <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MarkaSeridi() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Referanslar</span>
        <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{MARKA_SERIDI.baslik}</h2>
        <p className="mt-4 tipo-metin text-body">Altyapımızı kullanan müşterilerimiz ve birlikte iş yaptığımız kurumlar.</p>
      </div>
      <div className="mt-10"><LogoSerit liste={MARKALAR} boyut="serit" /></div>
    </section>
  );
}

function AnaSSS() {
  const [acik, setAcik] = useState(0);
  return (
    <section className="bg-surface2 border-y border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">SSS</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Aklınıza takılanlar</h2>
        </div>
        <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
          {SSS_ANA.map((f, i) => (
            <div key={f.q} className="px-6">
              <button onClick={() => setAcik(acik === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="text-[15px] font-semibold text-strong">{f.q}</span>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brandsoft text-brandtext transition-transform ${acik === i ? 'rotate-45' : ''}`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              {acik === i && <p className="pb-5 -mt-1 text-[15px] leading-relaxed text-body">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [finder, setFinder] = useState(false);
  const openF = useCallback(() => setFinder(true), []);
  const closeF = useCallback(() => setFinder(false), []);
  return (
    <SiteShell>
      <Sema veri={sssSemasi(SSS_ANA)} />
      <Hero />
      <FinderBanner onOpen={openF} />
      <FinderTab onOpen={openF} />
      <ProductFinder open={finder} onClose={closeF} />

      <DomainAI />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Neden SunucumWEB</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Performans ve güveni bir arada sunuyoruz</h2><p className="mt-4 text-lg text-body">Altyapımızı; hız, kesintisizlik ve destek üçgeninde kurduk. Teknik detayları biz düşünelim, siz işinize odaklanın.</p></div>
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

      <AltyapiVitrin />

      <PaketlerVitrin />

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

      <YazilimVitrin />

      <MarkaSeridi />

      <AnaSSS />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Sistem Durumu</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Altyapımız şeffaf ve izlenebilir</h2>
          <p className="mt-4 text-lg text-body">Servislerimizin anlık durumunu ve yanıt sürelerini canlı olarak buradan takip edebilirsiniz.</p>
        </div>
        <div className="mt-10 flex justify-center">
          <DurumWidget />
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink"><div aria-hidden className="pointer-events-none absolute inset-0"><div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand-500/20 blur-[100px]" /><div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-brand-400/10 blur-[100px]" /></div><div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20"><div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center"><div><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">Binlerce işletme altyapısını bize emanet ediyor</h2><p className="mt-4 text-lg text-slate-300">Startup'lardan kurumsal firmalara; hız, güvenlik ve kesintisiz destek arayan herkes SunucumWEB'i tercih ediyor.</p><Link href="/hakkimizda" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[15px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 transition">Hikâyemizi keşfedin <Icon name="arrow" className="w-4 h-4" /></Link></div><div className="grid grid-cols-2 gap-4">{STATS.map(([n, l]) => (<div key={l} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 backdrop-blur"><div className="text-3xl sm:text-4xl font-extrabold text-brand-300">{n}</div><div className="mt-1 text-sm text-slate-300">{l}</div></div>))}</div></div></div></section>
      <CtaBand />
    </SiteShell>
  );
}
