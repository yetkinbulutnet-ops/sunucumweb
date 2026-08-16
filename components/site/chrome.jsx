'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { currentTheme, toggleTheme } from '@/lib/engines/theme';
import { formatTRY, CHECKOUT_URL } from '@/lib/engines/cart';
import { CartProvider, useCart } from './CartProvider';

/* ---------------- ikon seti ---------------- */
const PATHS = {
  bolt: 'M13 2 3 14h7l-1 8 10-12h-7z',
  shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z',
  headset: 'M4 13a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2m-11-7v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2zm16 0v5',
  lock: 'M6 10V8a6 6 0 1 1 12 0v2m-9 0h6a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z',
  check: 'M20 6 9 17l-5-5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevron: 'M6 9l6 6 6-6',
  search: 'M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
  server: 'M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18',
  cpu: 'M6 6h12v12H6zM9 9h6v6H9M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  cloud: 'M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11.6 1.5A3.5 3.5 0 0 1 18 18z',
  gauge: 'M12 14l3-3M4 20a8 8 0 1 1 16 0zM12 14a2 2 0 1 0 0-4',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v4l3 2',
  phone: 'M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail: 'M4 5h16v14H4zM4 6l8 6 8-6',
  pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 10a2 2 0 1 0 0-.01',
  star: 'M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9 9z',
  users: 'M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  refresh: 'M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M18 4v5h-5M6 20v-5h5',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  wifi: 'M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01',
  scale: 'M12 3v18M7 8h10M5 8l-2 6a3 3 0 0 0 6 0zM19 8l-2 6a3 3 0 0 0 6 0z',
  rocket: 'M5 15l-2 5 5-2M9 11a10 10 0 0 1 8-6c1 4-1 7-6 9M9 11l4 4M9 11l-4 1 1 3 3 1 1-4',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6',
  chat: 'M4 5h16v11H9l-5 4z',
  terminal: 'M4 5h16v14H4zM7 9l3 3-3 3M13 15h4',
  sparkles: 'M11 3l1.7 4.3L17 9l-4.3 1.7L11 15l-1.7-4.3L5 9l4.3-1.7zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z',
  copy: 'M9 9h10v11H9zM5 15H4V4h11v1',
  xmark: 'M6 6l12 12M18 6L6 18',
  question: 'M9.2 9a3 3 0 1 1 3.8 2.9c-.6.2-1 .8-1 1.5v.6M12 17.5h.01',
  pencil: 'M4 20h4L20 8l-4-4L4 16zM14 6l4 4',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  moon: 'M20.5 14.8A8.5 8.5 0 0 1 9.2 3.5a8.5 8.5 0 1 0 11.3 11.3z',
  cart: 'M2.5 4h2l2.2 10.5h10L19 7H6.2M9 19.5a1.2 1.2 0 1 0 0-.01M16.5 19.5a1.2 1.2 0 1 0 0-.01',
  trash: 'M4 7h16M9.5 7V4.5h5V7M6.5 7l1 12.5h9L17.5 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4.5 21a7.5 7.5 0 0 1 15 0',
  signal: 'M4.5 20v-3.5M9.5 20v-7M14.5 20v-10.5M19.5 20V6',
};
export function Icon({ name, className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={PATHS[name] || PATHS.check} />
    </svg>
  );
}

/* ---------------- navigasyon (eski site mega menü yapısı) ---------------- */
/* one: mega menunun sag kolonundaki tanitim karti (opsiyonel) */
export const MENU = [
  { label: 'Domain', one: { t: 'AI Alan Adı Bulucu', d: 'İşinizi anlatın, yapay zekâ size uygun alan adlarını bulsun ve müsaitliğini kontrol etsin.', href: '/alan-adi', icon: 'sparkles' }, items: [
    { t: 'Domain Tescil', d: 'Yeni alan adı kaydı', href: '/alan-adi', icon: 'globe' },
    { t: 'Domain Transfer', d: 'Mevcut domaininizi taşıyın', href: '/transfer', icon: 'refresh' },
    { t: 'Domain Sorgulama', d: 'WHOIS sorgulama', href: '/whois', icon: 'search' },
  ]},
  { label: 'Hosting', one: { t: 'Hangi paket bana uygun?', d: '3 kısa soruya cevap verin, ihtiyacınıza en uygun çözümü birlikte bulalım.', href: '/web-hosting', icon: 'chat' }, items: [
    { t: 'Web Hosting', d: 'Bireysel & KOBİ siteleri', href: '/web-hosting', icon: 'globe' },
    { t: 'WordPress Hosting', d: 'WordPress için optimize', href: '/wordpress-hosting', icon: 'bolt' },
    { t: 'Reseller Hosting', d: 'Kendi hosting işinizi kurun', href: '/reseller-hosting', icon: 'users' },
    { t: 'Kurumsal Hosting', d: 'Yüksek trafik & izole kaynak', href: '/kurumsal-hosting', icon: 'layers' },
  ]},
  { label: 'Sunucu', wide: true, one: { t: 'Kurumsal SLA', d: '%99.9 uptime garantisi, DDoS koruması ve 7/24 uzman destek tüm sunucularda dahil.', href: '/dedicated-sunucu', icon: 'shield' }, items: [
    { t: 'Sanal Sunucu (VDS)', d: 'Root erişimli, ölçeklenebilir', href: '/sanal-sunucu', icon: 'server' },
    { t: 'Premium Sunucu', d: 'Premium işlemci gücü', href: '/premium-sunucu', icon: 'rocket' },
    { t: 'Dedicated Sunucu', d: 'Fiziksel, tam kontrol', href: '/dedicated-sunucu', icon: 'server' },
    { t: 'GPU Sunucu', d: 'AI, render, hesaplama', href: '/gpu-sunucu', icon: 'cpu' },
    { t: 'ISP Sunucu', d: 'Servis sağlayıcılar için', href: '/isp-sunucu', icon: 'wifi' },
    { t: 'ABD Sunucu', d: 'Amerika lokasyonu', href: '/abd-sunucu', icon: 'globe' },
  ]},
  { label: 'Veri Merkezi', one: { t: 'Tier-3 İstanbul', d: 'Yedekli enerji, yedekli ağ ve 7/24 fiziksel güvenlik ile kesintisiz altyapı.', href: '/sunucu-barindirma', icon: 'database' }, items: [
    { t: 'Sunucu Barındırma', d: 'Tier-3 colocation', href: '/sunucu-barindirma', icon: 'database' },
    { t: 'IP Kiralama', d: 'Temiz IPv4 / IPv6 blokları', href: '/ip-kiralama', icon: 'globe' },
  ]},
  { label: 'Kurumsal', one: { t: 'Bize ulaşın', d: 'Sorularınız için 7/24 uzman ekibimiz yanınızda. Ortalama yanıt süresi 5 dakika.', href: '/iletisim', icon: 'headset' }, items: [
    { t: 'Şirket Profili', d: 'Hakkımızda', href: '/hakkimizda', icon: 'users' },
    { t: 'Ticari Bilgiler', d: 'Resmi şirket bilgileri', href: '/ticari-bilgiler', icon: 'doc' },
    { t: 'İletişim', d: 'Bize ulaşın', href: '/iletisim', icon: 'phone' },
    { t: 'İade Politikası', d: 'İade koşulları', href: '/iade-politikasi', icon: 'refresh' },
    { t: 'Kullanım Koşulları', d: 'Hizmet şartları', href: '/kullanim-kosullari', icon: 'doc' },
  ]},
];

function MegaItem({ it, onClick }) {
  return (
    <Link
      href={it.href}
      onClick={onClick}
      className="group/i flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-brandsoft"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brandsoft text-brandtext transition-colors group-hover/i:bg-brand-500 group-hover/i:text-white">
        <Icon name={it.icon} className="w-5 h-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[14px] font-semibold text-strong">
          {it.t}
          <Icon name="arrow" className="w-3.5 h-3.5 shrink-0 -translate-x-1 text-brandtext opacity-0 transition-[transform,box-shadow,border-color,opacity] group-hover/i:translate-x-0 group-hover/i:opacity-100" />
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-body">{it.d}</span>
      </span>
    </Link>
  );
}

/* mega menunun sag kolonundaki tanitim karti */
function MegaOne({ one, onClick }) {
  if (!one) return null;
  return (
    <Link
      href={one.href}
      onClick={onClick}
      className="group/o flex flex-col justify-between rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white transition-shadow hover:shadow-lg hover:shadow-brand-700/40"
    >
      <span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
          <Icon name={one.icon} className="w-5 h-5" />
        </span>
        <span className="mt-3 block text-[14px] font-bold">{one.t}</span>
        <span className="mt-1 block text-[12.5px] leading-snug text-white/80">{one.d}</span>
      </span>
      <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-bold">
        İncele <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover/o:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------------- tema anahtari (acik / koyu) ---------------- */
export function ThemeToggle({ variant = 'topbar' }) {
  const [tema, setTema] = useState('light');
  const [monte, setMonte] = useState(false);

  useEffect(() => { setTema(currentTheme()); setMonte(true); }, []);

  const koyu = tema === 'dark';
  const etiket = koyu ? 'Açık moda geç' : 'Koyu moda geç';

  if (variant === 'satir') {
    // mobil menu icindeki genis satir
    return (
      <button
        onClick={() => setTema(toggleTheme())}
        className="flex w-full items-center justify-between rounded-xl bg-surface2 px-4 py-3 text-[15px] font-semibold text-strong"
      >
        <span className="flex items-center gap-2.5">
          <Icon name={monte && koyu ? 'sun' : 'moon'} className="w-[18px] h-[18px] text-brandtext" />
          {monte ? (koyu ? 'Açık mod' : 'Koyu mod') : 'Tema'}
        </span>
        <span className={`relative h-6 w-11 rounded-full transition-colors ${monte && koyu ? 'bg-brand-500' : 'bg-line'}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[transform,box-shadow,border-color,opacity] ${monte && koyu ? 'left-[22px]' : 'left-0.5'}`} />
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTema(toggleTheme())}
      aria-label={etiket}
      title={etiket}
      className="inline-grid h-7 w-7 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      {monte ? <Icon name={koyu ? 'sun' : 'moon'} className="w-[17px] h-[17px]" /> : <span className="block h-[17px] w-[17px]" />}
    </button>
  );
}

/* ---------------- ust menu (header'in ustundeki ince serit) ---------------- */
export function TopBar() {
  return (
    <div className="bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="flex h-10 items-center justify-between gap-2 text-[12.5px]">
          {/* sol taraf */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
            <a href="tel:08503025809" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-300">
              <Icon name="phone" className="w-[14px] h-[14px] text-brand-400" />
              <span className="whitespace-nowrap">0(850) 302 5809</span>
            </a>
            <span className="hidden sm:block h-3.5 w-px bg-white/15" />
            <Link href="/iletisim" className="hidden sm:inline-block transition-colors hover:text-white">İletişim</Link>
            <span className="hidden md:block h-3.5 w-px bg-white/15" />
            <a href="https://my.sunucumweb.com" target="_blank" rel="noopener noreferrer" className="hidden md:inline-block transition-colors hover:text-white">Hızlı Destek</a>
          </div>

          {/* sag taraf */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-300 ring-1 ring-emerald-400/20" title="Tüm sistemler çalışıyor">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Ağ Durumu
            </span>
            <a href="https://my.sunucumweb.com" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <Icon name="chat" className="w-[14px] h-[14px]" /> Canlı Destek
            </a>
            <span className="hidden sm:block h-3.5 w-px bg-white/15" />
            <a href="https://my.sunucumweb.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-300">
              <Icon name="user" className="w-[14px] h-[14px]" />
              <span className="hidden sm:inline">Müşteri Girişi</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- sepet ---------------- */
function CartButton() {
  const { adet, setPanelAcik, sonEklenen } = useCart();
  return (
    <div className="relative">
      <button
        onClick={() => setPanelAcik(true)}
        aria-label={`Sepet (${adet} ürün)`}
        className="relative inline-grid h-11 w-11 place-items-center rounded-xl text-strong transition-colors hover:bg-surface2"
      >
        <Icon name="cart" className="w-[22px] h-[22px]" />
        {adet > 0 && (
          <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-surface">
            {adet}
          </span>
        )}
      </button>
      {sonEklenen && (
        <span className="pointer-events-none absolute right-0 top-full z-50 mt-1 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg animate-[fadeup_0.25s_ease-out] sm:block">
          {sonEklenen} sepete eklendi
        </span>
      )}
    </div>
  );
}

function CartDrawer() {
  const { items, adet, toplam, panelAcik, setPanelAcik, cikar, adetAyarla, temizle } = useCart();

  useEffect(() => {
    if (!panelAcik) return;
    const esc = (e) => e.key === 'Escape' && setPanelAcik(false);
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [panelAcik, setPanelAcik]);

  if (!panelAcik) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Sepet">
      <div onClick={() => setPanelAcik(false)} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-[fadeup_0.2s_ease-out]" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-surface shadow-2xl animate-[fadeup_0.3s_ease-out]">
        {/* baslik */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 text-[17px] font-extrabold text-strong">
            <Icon name="cart" className="w-5 h-5 text-brandtext" /> Sepetim
            {adet > 0 && <span className="rounded-full bg-brandsoft px-2 py-0.5 text-[12px] font-bold text-brandtext">{adet}</span>}
          </h2>
          <button onClick={() => setPanelAcik(false)} aria-label="Kapat" className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-strong">
            <Icon name="xmark" className="w-5 h-5" />
          </button>
        </div>

        {/* icerik */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface2 text-muted"><Icon name="cart" className="w-8 h-8" /></span>
            <p className="mt-5 text-[15px] font-semibold text-strong">Sepetiniz boş</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-body">Paketleri inceleyip beğendiğinizi sepete ekleyin.</p>
            <Link href="/web-hosting" onClick={() => setPanelAcik(false)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white transition hover:bg-brand-600">
              Paketleri İncele <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-3">
                {items.map((i) => (
                  <li key={i.id} className="rounded-2xl border border-line bg-surface2/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {i.product && <div className="text-[11px] font-bold uppercase tracking-wide text-brandtext">{i.product}</div>}
                        <div className="truncate text-[15px] font-bold text-strong">{i.name}</div>
                        <div className="mt-0.5 text-[13px] text-body">{formatTRY(i.price)}<span className="text-muted">{i.period}</span></div>
                      </div>
                      <button onClick={() => cikar(i.id)} aria-label={`${i.name} paketini sepetten çıkar`} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-rose-50 hover:text-rose-600">
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-line bg-surface">
                        <button onClick={() => adetAyarla(i.id, i.qty - 1)} aria-label="Azalt" className="grid h-8 w-8 place-items-center text-body transition-colors hover:text-brandtext"><Icon name="minus" className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center text-[14px] font-bold tabular-nums text-strong">{i.qty}</span>
                        <button onClick={() => adetAyarla(i.id, i.qty + 1)} aria-label="Artır" className="grid h-8 w-8 place-items-center text-body transition-colors hover:text-brandtext"><Icon name="plus" className="w-3.5 h-3.5" /></button>
                      </div>
                      <span className="text-[15px] font-extrabold text-strong">{formatTRY(i.price * i.qty)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={temizle} className="mt-4 text-[13px] font-semibold text-muted transition-colors hover:text-rose-600">Sepeti boşalt</button>
            </div>

            {/* ozet */}
            <div className="border-t border-line bg-surface px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] text-body">Ara toplam</span>
                <span className="text-[22px] font-extrabold text-strong">{formatTRY(toplam)}<span className="text-[13px] font-medium text-muted">/ay</span></span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">KDV ve varsa kurulum ücretleri ödeme adımında hesaplanır.</p>
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
              >
                Ödemeye Geç <Icon name="arrow" className="w-4 h-4" />
              </a>
              <button onClick={() => setPanelAcik(false)} className="mt-2 w-full rounded-xl px-5 py-2.5 text-[14px] font-semibold text-body transition-colors hover:text-strong">
                Alışverişe devam et
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- header ---------------- */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [acc, setAcc] = useState(-1);
  const [scrolled, setScrolled] = useState(false);

  /* Mega menu: fare panele giderken aradaki bosluktan gecince kapanmasin diye
     CSS :hover yerine gecikmeli JS kontrolu kullaniyoruz. */
  const [acikMenu, setAcikMenu] = useState(-1);
  const kapatmaZamani = useRef(null);
  const menuAc = useCallback((n) => {
    if (kapatmaZamani.current) clearTimeout(kapatmaZamani.current);
    setAcikMenu(n);
  }, []);
  const menuKapatGecikmeli = useCallback(() => {
    if (kapatmaZamani.current) clearTimeout(kapatmaZamani.current);
    kapatmaZamani.current = setTimeout(() => setAcikMenu(-1), 260);
  }, []);
  const menuKapatHemen = useCallback(() => {
    if (kapatmaZamani.current) clearTimeout(kapatmaZamani.current);
    setAcikMenu(-1);
  }, []);
  useEffect(() => () => { if (kapatmaZamani.current) clearTimeout(kapatmaZamani.current); }, []);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && menuKapatHemen();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [menuKapatHemen]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  /* mobil menu acikken arka plan kaymasin */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ust menu + header BIRLIKTE sticky */}
      <div className="sticky top-0 z-50">
      <TopBar />
      <header className={`relative transition-shadow duration-300 ${scrolled ? 'bg-surface/90 backdrop-blur-xl border-b border-line shadow-[0_4px_30px_-12px_rgba(15,41,66,0.15)]' : 'bg-surface border-b border-line'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="flex h-[68px] lg:h-[74px] items-center justify-between gap-3">
            <Link href="/" className="flex shrink-0 items-center">
              <img src="/icon/logo.png" alt="SunucumWEB" className="h-7 w-auto sm:h-8 dark:brightness-0 dark:invert" />
            </Link>

            {/* masaustu mega menu */}
            <nav className="hidden lg:flex items-center gap-0.5" onMouseLeave={menuKapatGecikmeli}>
              {MENU.map((m, n) => {
                const acikMi = acikMenu === n;
                return (
                  <div key={m.label} className="static" onMouseEnter={() => menuAc(n)}>
                    <button
                      aria-expanded={acikMi}
                      onClick={() => (acikMi ? menuKapatHemen() : menuAc(n))}
                      className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors ${acikMi ? 'bg-brandsoft/60 text-brandtext' : 'text-strong/80 hover:text-brandtext'}`}
                    >
                      {m.label}
                      <Icon name="chevron" className={`mt-0.5 w-3.5 h-3.5 transition-transform ${acikMi ? 'rotate-180' : ''}`} />
                    </button>

                    {/* panel: header genisliginde. pt-2 fare koprusu gorevi gorur.
                        NOT: opacity/transform gecisi yerine kosullu render + hazir animasyon
                        kullaniyoruz; Chromium'da bu tur gecisler eski degerde donabiliyor. */}
                    {acikMi && (
                    <div
                      className="absolute left-0 right-0 top-full z-40 pt-2 animate-[fadeup_0.18s_ease-out]"
                      onMouseEnter={() => menuAc(n)}
                    >
                      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
                        <div className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_70px_-25px_rgba(15,41,66,0.45)] ${m.one ? 'grid grid-cols-[1fr_280px]' : ''}`}>
                          <div className={`p-3 ${m.wide ? 'grid grid-cols-3 gap-1' : 'grid grid-cols-2 gap-1'}`}>
                            {m.items.map((it) => <MegaItem key={it.href + it.t} it={it} onClick={menuKapatHemen} />)}
                          </div>
                          {m.one && (
                            <div className="border-l border-line bg-surface2/60 p-3">
                              <MegaOne one={m.one} onClick={menuKapatHemen} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* sag: sepet + CTA */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <CartButton />
              <Link href="/web-hosting" className="group hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-brand-500/25 transition-[transform,box-shadow,border-color,opacity] hover:bg-brand-600 lg:px-5 lg:text-[15px]">
                Hemen Başla <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button onClick={() => setOpen((v) => !v)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-strong transition-colors hover:bg-surface2 lg:hidden" aria-label="Menü" aria-expanded={open}>
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

      </header>
      </div>

      {/* ---- mobil menu: SAYFAYI ITMEZ, ustune acilir ---- */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menü">
          {/* arka plan: sade koyu perde (blur yok - renk bozulmasin) */}
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/70 animate-[fadeup_0.2s_ease-out]" />

          <div className="absolute inset-x-0 top-0 flex max-h-full flex-col bg-surface shadow-2xl animate-[fadeup_0.3s_ease-out]">
            {/* baslik */}
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                <img src="/icon/logo.png" alt="SunucumWEB" className="h-7 w-auto dark:brightness-0 dark:invert" />
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Kapat" className="grid h-10 w-10 place-items-center rounded-xl text-strong transition-colors hover:bg-surface2">
                <Icon name="xmark" className="w-5 h-5" />
              </button>
            </div>

            {/* icerik */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-2">
              {MENU.map((m, i) => (
                <div key={m.label} className="border-b border-line/60">
                  <button
                    onClick={() => setAcc(acc === i ? -1 : i)}
                    aria-expanded={acc === i}
                    className="flex w-full items-center justify-between py-3.5 text-[15px] font-semibold text-strong"
                  >
                    {m.label}
                    <Icon name="chevron" className={`w-4 h-4 text-muted transition-transform ${acc === i ? 'rotate-180' : ''}`} />
                  </button>
                  {acc === i && (
                    <div className="grid gap-1 pb-3 animate-[fadeup_0.25s_ease-out]">
                      {/* mobilde de mega menu icerigi: ikon + baslik + aciklama */}
                      {m.items.map((it) => <MegaItem key={it.href + it.t} it={it} onClick={() => setOpen(false)} />)}
                      {m.one && <div className="mt-1"><MegaOne one={m.one} onClick={() => setOpen(false)} /></div>}
                    </div>
                  )}
                </div>
              ))}

              <Link href="/web-hosting" onClick={() => setOpen(false)} className="mt-4 block rounded-xl bg-brand-500 px-5 py-3.5 text-center font-bold text-white shadow-lg shadow-brand-500/25">
                Hemen Başla
              </Link>

              {/* ust menunun mobil karsiligi */}
              <div className="mt-4 rounded-2xl border border-line bg-surface2/60 p-3">
                <div className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Hızlı erişim</div>
                <div className="grid grid-cols-2 gap-2">
                  <a href="tel:08503025809" className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13px] font-semibold text-strong ring-1 ring-line">
                    <Icon name="phone" className="w-4 h-4 text-brandtext" /> Ara
                  </a>
                  <a href="https://my.sunucumweb.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13px] font-semibold text-strong ring-1 ring-line">
                    <Icon name="user" className="w-4 h-4 text-brandtext" /> Müşteri Girişi
                  </a>
                  <a href="https://my.sunucumweb.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13px] font-semibold text-strong ring-1 ring-line">
                    <Icon name="chat" className="w-4 h-4 text-brandtext" /> Canlı Destek
                  </a>
                  <span className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-[13px] font-semibold text-strong ring-1 ring-line">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Ağ Durumu
                  </span>
                </div>
                <div className="mt-2"><ThemeToggle variant="satir" /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}

/* ---------------- footer ---------------- */
const FOOT = [
  { h: 'Domain', items: [['Domain Tescil', '/alan-adi'], ['Domain Transfer', '/transfer'], ['WHOIS Sorgu', '/whois']] },
  { h: 'Hosting', items: [['Web Hosting', '/web-hosting'], ['WordPress Hosting', '/wordpress-hosting'], ['Reseller Hosting', '/reseller-hosting'], ['Kurumsal Hosting', '/kurumsal-hosting']] },
  { h: 'Sunucular', items: [['Sanal Sunucu', '/sanal-sunucu'], ['Dedicated Sunucu', '/dedicated-sunucu'], ['GPU Sunucu', '/gpu-sunucu'], ['ABD Sunucu', '/abd-sunucu']] },
  { h: 'Veri Merkezi', items: [['Sunucu Barındırma', '/sunucu-barindirma'], ['IP Kiralama', '/ip-kiralama'], ['ISP Sunucu', '/isp-sunucu']] },
  { h: 'Kurumsal', items: [['Hakkımızda', '/hakkimizda'], ['İletişim', '/iletisim'], ['Ticari Bilgiler', '/ticari-bilgiler'], ['Kullanım Koşulları', '/kullanim-kosullari']] },
];
export function SiteFooter() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
          <div className="max-w-xs">
            <img src="/icon/logo.png" alt="SunucumWEB" className="h-8 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed text-muted">Türkiye'nin güvenilir hosting ve sunucu sağlayıcısı. Hızlı altyapı, kesintisiz destek.</p>
            <a href="tel:08503025809" className="mt-5 inline-block text-lg font-bold text-white">0(850) 302 5809</a>
          </div>
          {FOOT.map((col) => (
            <div key={col.h}>
              <div className="text-sm font-bold uppercase tracking-wider text-white">{col.h}</div>
              <ul className="mt-4 space-y-2.5">{col.items.map(([t, h]) => (<li key={h + t}><Link href={h} className="text-sm text-muted hover:text-brand-300 transition-colors">{t}</Link></li>))}</ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-7 text-sm text-muted">
          <span>© 2026 SunucumWEB Bilişim Teknolojileri. Tüm hakları saklıdır.</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500" /> Tüm sistemler çalışıyor</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- tekrar kullanılabilir CTA ---------------- */
export function CtaBand({ title = 'Bugün başlayın, farkı hemen hissedin', text = 'Dakikalar içinde kurulum, 30 gün içinde memnun kalmazsanız iade garantisi.' }) {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 sm:px-14 text-center shadow-[0_40px_90px_-40px_rgba(15,118,110,0.7)]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">{title}</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/85">{text}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/web-hosting" className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-bold text-strong hover:bg-brandsoft transition">Paketleri İncele <Icon name="arrow" className="w-4 h-4" /></Link>
            <a href="tel:08503025809" className="inline-flex items-center gap-2 rounded-xl bg-ink/20 px-6 py-3.5 text-[15px] font-semibold text-white ring-1 ring-white/25 hover:bg-ink/30 transition">0(850) 302 5809</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- sayfa çerçevesi ---------------- */
export function SiteShell({ children }) {
  return (
    <CartProvider>
      <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif" }} className="min-h-screen bg-page text-strong antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

/* ---------------- iç sayfa hero ---------------- */
export function PageHero({ eyebrow, title, text, breadcrumb }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        {breadcrumb && (<div className="mb-5 flex items-center gap-2 text-sm text-muted"><Link href="/" className="hover:text-brandtext">Ana Sayfa</Link><span>/</span><span className="text-strong/70 font-medium">{breadcrumb}</span></div>)}
        {eyebrow && <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{eyebrow}</span>}
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl font-extrabold tracking-tight text-strong text-balance">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">{text}</p>}
      </div>
    </section>
  );
}
