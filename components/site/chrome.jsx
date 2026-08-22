'use client';
import { useState, useEffect, useRef, useCallback, useId } from 'react';
import Link from 'next/link';
import { currentTheme, toggleTheme } from '@/lib/engines/theme';
import { formatTRY, CHECKOUT_URL } from '@/lib/engines/cart';
import { scrollKilitle } from '@/lib/engines/scroll-lock';
import SmoothScroll from './SmoothScroll';
import { CartProvider, useCart } from './CartProvider';
import OdemeLogolari from './OdemeLogolari';
import DurumRozeti from './DurumRozeti';
import AltyapiSerit from './AltyapiSerit';

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
  ban: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM5.6 5.6l12.8 12.8',
  binaOfis: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M9 22v-4h6v4 M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01',
  kurumsal: 'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2 M2 12h20',
  magaza: 'M4 4h16l2 5H2z M4 9v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9 M9 19v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5',
  vds: 'M4 5h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M4 14h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z M7 7.5h.01M7 16.5h.01 M11 7.5h6M11 16.5h6',
  dedicated: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M9 6h6M9 9h6M9 12h6 M12 17h.01',
  gpu: 'M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M8 17v3M15 17v3 M5.7 11.5a2.8 2.8 0 1 0 5.6 0a2.8 2.8 0 1 0-5.6 0 M12.7 11.5a2.8 2.8 0 1 0 5.6 0a2.8 2.8 0 1 0-5.6 0 M8.5 11.5h.01M15.5 11.5h.01',
  colocation: 'M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M5 8h14M5 13h14 M8 5.5h.01M8 10.5h.01M8 15.5h.01 M11 5.5h5M11 10.5h5M11 15.5h5',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3',
};
export function Icon({ name, className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={PATHS[name] || PATHS.check} />
    </svg>
  );
}

const AiRozet = () => (
  <span className="inline-flex items-center rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-emerald-400 px-1.5 py-[3px] text-[10px] font-extrabold uppercase leading-none tracking-wide text-white shadow-sm">AI</span>
);

export const MENU = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Domain', ai: true, kolon: 3, items: [
    { t: 'Domain Tescil', d: 'Yeni domain tescil işlemleri için hemen tıklayın.', href: '/alan-adi', icon: 'globe', r: '%20 İndirim', rTon: 'yesil' },
    { t: 'Domain Transfer', d: 'Mevcut domaininizi güvenle bize transfer edin.', href: '/transfer', icon: 'refresh' },
    { t: 'Domain Sorgulama', d: 'Kayıt firması, tescil ve bitiş tarihi ile isim sunucularını görün.', href: '/araclar/whois', icon: 'search' },
  ]},
  { label: 'Hosting', kolon: 4, items: [
    { t: 'Web Hosting', d: 'Sınırsız hosting paketlerini deneyin, dakikalar içinde yayında olun.', href: '/web-hosting', icon: 'globe', r: '%20 İndirim', rTon: 'yesil', logo: '/img/altyapi/cpanel.webp' },
    { t: 'WordPress Hosting', d: 'WordPress için optimize edilmiş, hızlı ve güvenli altyapı.', href: '/wordpress-hosting', icon: 'bolt', logo: '/img/marka/wordpress.png' },
    { t: 'Reseller Hosting', d: 'Linux hosting paketleri ile kendi hosting işinizi başlatın.', href: '/reseller-hosting', icon: 'magaza', r: 'Fırsatı Yakala', rTon: 'sari' },
    { t: 'Kurumsal Hosting', d: 'Yüksek trafik ve izole kaynak gerektiren projeler için.', href: '/kurumsal-hosting', icon: 'kurumsal' },
  ]},
  { label: 'Sunucu', kolon: 2, items: [
    { t: 'Sanal Sunucu (VDS)', d: 'E5-2699 v4 sanal sunucularla projelerinizi başlatın.', href: '/sanal-sunucu', icon: 'vds', r: 'Kampanya', rTon: 'mavi' },
    { t: 'Premium Sunucu', d: 'Jet hızında diskler ve Xeon Platinum ile tam güç!', href: '/premium-sunucu', icon: 'rocket', r: 'PREMIUM', rTon: 'sari', vurgu: true, logo: '/img/marka/intel.webp' },
    { t: 'Dedicated Sunucu', d: 'Fiziksel sunucular ile maksimum performans elde edin.', href: '/dedicated-sunucu', icon: 'dedicated' },
    { t: 'GPU Sunucu', d: 'Yüksek performanslı GPU ile AI ve grafik iş yükleriniz için ideal.', href: '/gpu-sunucu', icon: 'gpu', r: 'Popüler', rTon: 'kirmizi' },
  ]},
  { label: 'Veri Merkezi', kolon: 2, items: [
    { t: 'Sunucu Barındırma', d: 'Kendi donanımınız bizim Tier-3 veri merkezimizde güvende.', href: '/sunucu-barindirma', icon: 'colocation', r: 'TIER III', rTon: 'yesil' },
    { t: 'IP Kiralama', d: 'Kolay ve hızlı IP kiralama seçenekleri ile ihtiyacınız olan adresleri hemen edinin.', href: '/ip-kiralama', icon: 'globe', r: 'Özel', rTon: 'yesil' },
  ]},
  { label: 'Hazır Yazılım', href: '/hazir-yazilim' },
  { label: 'Kurumsal', kolon: 3, items: [
    { t: 'Şirket Profili', d: 'SunucumWEB hakkında detaylı bilgi alın.', href: '/hakkimizda', icon: 'binaOfis' },
    { t: 'Legal', d: 'Sözleşmeler, yasal metinler ve resmî ticari bilgiler.', href: '/legal', icon: 'doc' },
    { t: 'İletişim', d: 'Telefon, e-posta ve destek kanallarımız.', href: '/iletisim', icon: 'chat' },
  ]},
];

export const ARAC_MENU = {
  label: 'Araçlar',
  kolon: 3,
  items: [
    { t: 'DNS Kayıt Sorgulama', d: 'Kayıt tipini seçin, dokuz çözümleyiciden canlı sorgulayın.', href: '/araclar/dns', icon: 'server' },
    { t: 'WHOIS Sorgulama', d: 'Kayıt firması, tescil ve bitiş tarihi ile isim sunucuları.', href: '/araclar/whois', icon: 'search' },
    { t: 'SSL Sertifika Kontrolü', d: 'Sertifika geçerli mi, kaç gün kaldı, kim sağlamış?', href: '/araclar/ssl', icon: 'lock' },
    { t: 'E-posta Kayıt Kontrolü', d: 'MX, SPF ve DMARC ayarlarınızı denetleyin.', href: '/araclar/eposta', icon: 'mail' },
    { t: 'Kara Liste Kontrolü', d: 'Sunucu adresiniz 12 spam kara listesinde var mı?', href: '/araclar/karaliste', icon: 'ban' },
    { t: 'HTTP Güvenlik Başlıkları', d: 'HSTS, CSP ve çerçeveleme koruması denetimi.', href: '/araclar/basliklar', icon: 'shield' },
    { t: 'IP Sorgulama', d: 'Kendi IP adresiniz ve ters DNS (PTR) kaydı.', href: '/araclar/ip', icon: 'globe' },
    { t: 'Tüm araçlar', d: 'Ücretsiz ağ ve alan adı araçlarının tamamı.', href: '/araclar', icon: 'layers' },
  ],
};

const ROZET_TON = {
  yesil: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30',
  sari: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30',
  mavi: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-sky-500/30',
  kirmizi: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/30',
};

function MegaItem({ it, onClick }) {
  return (
    <Link
      href={it.href}
      onClick={onClick}
      className={`group/i flex items-start gap-3.5 rounded-2xl border bg-surface p-4 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(15,41,66,0.35)] ${
        it.vurgu ? 'border-amber-400/60 ring-1 ring-amber-400/30' : 'border-line hover:border-brandline'
      }`}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
        it.logo ? 'bg-surface2 ring-1 ring-line' : 'bg-brandsoft text-brandtext group-hover/i:bg-brand-500 group-hover/i:text-white'
      }`}>
        {it.logo
          ? <img src={it.logo} alt="" width={128} height={128} loading="lazy" className="h-7 w-7 object-contain" />
          : <Icon name={it.icon} className="w-5 h-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-bold text-strong">{it.t}</span>
          {it.r && (
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ${ROZET_TON[it.rTon] || ROZET_TON.yesil}`}>
              {it.r}
            </span>
          )}
        </span>
        <span className="mt-1 block text-[12.5px] leading-snug text-body">{it.d}</span>
      </span>
    </Link>
  );
}

export function ThemeToggle({ variant = 'topbar' }) {
  const [tema, setTema] = useState('light');
  const [monte, setMonte] = useState(false);

  useEffect(() => { setTema(currentTheme()); setMonte(true); }, []);

  const koyu = tema === 'dark';
  const etiket = koyu ? 'Açık moda geç' : 'Koyu moda geç';

  if (variant === 'satir') {

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

export function TopBar() {
  return (
    <div className="bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="flex h-10 items-center justify-between gap-2 text-[12.5px]">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
            <a href="tel:08503025809" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-300">
              <Icon name="phone" className="w-[14px] h-[14px] text-brand-400" />
              <span className="whitespace-nowrap">0(850) 302 5809</span>
            </a>
            <span className="hidden sm:block h-3.5 w-px bg-white/15" />
            <Link
              href="/araclar"
              className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-white transition-colors hover:text-brand-300"
            >
              <Icon name="terminal" className="h-[14px] w-[14px] text-brand-400" />
              Ücretsiz Araçlar
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a href="https://durum.yetkinbulut.net" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-300 ring-1 ring-emerald-400/20 transition-colors hover:bg-emerald-500/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Ağ Durumu
            </a>
            <a href="https://my.sunucumweb.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-white transition-colors hover:text-brand-300">
              <Icon name="user" className="w-[14px] h-[14px]" />
              <span className="hidden sm:inline">Müşteri Paneli</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const odemeyeGec = () => {
    if (!items.length) return;
    window.open(items[0]?.wisecpUrl || CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!panelAcik) return;
    const esc = (e) => e.key === 'Escape' && setPanelAcik(false);
    window.addEventListener('keydown', esc);
    const coz = scrollKilitle();
    return () => { window.removeEventListener('keydown', esc); coz(); };
  }, [panelAcik, setPanelAcik]);

  if (!panelAcik) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Sepet">
      <div onClick={() => setPanelAcik(false)} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-[fadeup_0.2s_ease-out]" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-surface shadow-2xl animate-[fadeup_0.3s_ease-out]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 text-[17px] font-extrabold text-strong">
            <Icon name="cart" className="w-5 h-5 text-brandtext" /> Sepetim
            {adet > 0 && <span className="rounded-full bg-brandsoft px-2 py-0.5 text-[12px] font-bold text-brandtext">{adet}</span>}
          </h2>
          <button onClick={() => setPanelAcik(false)} aria-label="Kapat" className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-strong">
            <Icon name="xmark" className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface2 text-muted"><Icon name="cart" className="w-8 h-8" /></span>
            <p className="mt-5 text-[15px] font-semibold text-strong">Sepetiniz boş</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-body">Paketleri inceleyip beğendiğinizi sepete ekleyin.</p>
            <Link href="/hazir-yazilim" onClick={() => setPanelAcik(false)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white transition hover:bg-brand-600">
              Yazılımları İncele <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <ul className="space-y-3">
                {items.map((i) => (
                  <li key={i.id} className="rounded-2xl border border-line bg-surface2/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {i.product && <div className="text-[11px] font-bold uppercase tracking-wide text-brandtext">{i.product}</div>}
                        <div className="truncate text-[15px] font-bold text-strong">{i.name}</div>
                        <div className="mt-0.5 text-[13px] text-body">{formatTRY(i.price)}<span className="text-muted">{i.period}</span></div>
                        {i.wisecpUrl && <a href={i.wisecpUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-brandtext hover:underline">Satın Al <Icon name="arrow" className="h-3 w-3" /></a>}
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

            <div className="border-t border-line bg-surface px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] text-body">Ara toplam</span>
                <span className="text-[22px] font-extrabold text-strong">{formatTRY(toplam)}</span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">KDV ve varsa kurulum ücretleri ödeme adımında hesaplanır.</p>
              <button
                type="button"
                onClick={odemeyeGec}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
              >
                Ödemeye Geç <Icon name="arrow" className="w-4 h-4" />
              </button>
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

function BaslaModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    const coz = scrollKilitle();
    return () => { window.removeEventListener('keydown', esc); coz(); };
  }, [open, onClose]);

  if (!open) return null;

  const gruplar = [
    ...MENU.filter((m) => m.items && m.label !== 'Kurumsal'),
    { label: 'Yazılım & Araçlar', items: [
      { t: 'Hazır Yazılımlar', d: 'Kuruluma hazır e-ticaret, kurumsal site, blog ve daha fazlası.', href: '/hazir-yazilim', icon: 'sparkles' },
      { t: 'Ücretsiz Araçlar', d: 'DNS, WHOIS, SSL, e-posta ve IP sorgulama; kayıt gerekmez.', href: '/araclar', icon: 'layers' },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Hangi hizmetle başlayalım?">
      <div onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-[fadeup_0.2s_ease-out]" />
      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl animate-[fadeup_0.3s_ease-out]">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 className="text-[19px] font-extrabold tracking-tight text-strong">Nereden başlamak istersiniz?</h2>
            <p className="mt-1 text-[14px] leading-relaxed text-body">İlgilendiğiniz hizmeti seçin, sizi doğru sayfaya götürelim.</p>
          </div>
          <button onClick={onClose} aria-label="Kapat" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-strong">
            <Icon name="xmark" className="w-5 h-5" />
          </button>
        </div>

        <div data-lenis-prevent className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-5">
          {gruplar.map((g) => (
            <div key={g.label}>
              <div className="mb-2.5 flex items-center gap-3 px-1">
                <span className="text-[12px] font-bold uppercase tracking-wider text-brandtext">{g.label}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {g.items.map((it) => <MegaItem key={it.href + it.t} it={it} onClick={onClose} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [basla, setBasla] = useState(false);
  const [acc, setAcc] = useState(-1);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    if (!open) return;
    return scrollKilitle();
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-50">
      <TopBar />
      <header className={`relative transition-shadow duration-300 ${scrolled ? 'bg-surface/90 backdrop-blur-xl border-b border-line shadow-[0_4px_30px_-12px_rgba(15,41,66,0.15)]' : 'bg-surface border-b border-line'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-5 xl:px-8">
          <div className="flex h-[68px] lg:h-[74px] items-center justify-between gap-3">
            <Link href="/" className="flex shrink-0 items-center">
              <img src="/icon/logo.png" alt="SunucumWEB" className="h-7 w-auto sm:h-8 dark:brightness-0 dark:invert" />
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5" onMouseLeave={menuKapatGecikmeli}>
              {MENU.map((m, n) => {
                const acikMi = acikMenu === n;
                if (!m.items) {
                  return (
                    <Link
                      key={m.label}
                      href={m.href}
                      onMouseEnter={menuKapatHemen}
                      className="whitespace-nowrap rounded-lg px-2 py-2 text-[14px] font-medium text-strong/80 transition-colors hover:text-brandtext 2xl:px-3.5 2xl:text-[15px]"
                    >
                      {m.label}
                    </Link>
                  );
                }
                return (
                  <div key={m.label} className="static" onMouseEnter={() => menuAc(n)}>
                    <button
                      aria-expanded={acikMi}
                      onClick={() => (acikMi ? menuKapatHemen() : menuAc(n))}
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[14px] font-medium transition-colors 2xl:px-3.5 2xl:text-[15px] ${acikMi ? 'bg-brandsoft/60 text-brandtext' : 'text-strong/80 hover:text-brandtext'}`}
                    >
                      {m.label}
                      {m.ai && <AiRozet />}
                      <Icon name="chevron" className={`mt-0.5 w-3.5 h-3.5 shrink-0 transition-transform ${acikMi ? 'rotate-180' : ''}`} />
                    </button>

                    {acikMi && (
                    <div
                      className="absolute left-0 right-0 top-full z-40 pt-2 animate-[fadeup_0.18s_ease-out]"
                      onMouseEnter={() => menuAc(n)}
                    >
                      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
                        <div className="rounded-2xl border border-line bg-surface2 p-3 shadow-[0_30px_70px_-25px_rgba(15,41,66,0.45)]">
                          <div className={`grid gap-3 ${m.kolon === 2 ? 'grid-cols-2' : m.kolon === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                            {m.items.map((it) => <MegaItem key={it.href + it.t} it={it} onClick={menuKapatHemen} />)}
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <CartButton />
              <button type="button" onClick={() => setBasla(true)} className="group hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-brand-500 px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-brand-500/25 transition-[transform,box-shadow,border-color,opacity] hover:bg-brand-600 2xl:px-5 2xl:text-[15px]">
                Hemen Başla <Icon name="arrow" className="hidden h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:block" />
              </button>
              <button onClick={() => setOpen((v) => !v)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-strong transition-colors hover:bg-surface2 xl:hidden" aria-label="Menü" aria-expanded={open}>
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

      </header>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] xl:hidden" role="dialog" aria-modal="true" aria-label="Menü">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/70 animate-[fadeup_0.2s_ease-out]" />

          <div className="absolute inset-x-0 top-0 flex max-h-full flex-col bg-surface shadow-2xl animate-[fadeup_0.3s_ease-out]">
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                <img src="/icon/logo.png" alt="SunucumWEB" className="h-7 w-auto dark:brightness-0 dark:invert" />
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Kapat" className="grid h-10 w-10 place-items-center rounded-xl text-strong transition-colors hover:bg-surface2">
                <Icon name="xmark" className="w-5 h-5" />
              </button>
            </div>

            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-2">
              {[...MENU, ARAC_MENU].map((m, i) => (
                <div key={m.label} className="border-b border-line/60">
                  {!m.items ? (
                    <Link
                      href={m.href}
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-between py-3.5 text-[15px] font-semibold text-strong"
                    >
                      {m.label}
                      <Icon name="arrow" className="w-4 h-4 text-muted" />
                    </Link>
                  ) : (
                  <button
                    onClick={() => setAcc(acc === i ? -1 : i)}
                    aria-expanded={acc === i}
                    className="flex w-full items-center justify-between py-3.5 text-[15px] font-semibold text-strong"
                  >
                    <span className="inline-flex items-center gap-1.5">{m.label}{m.ai && <AiRozet />}</span>
                    <Icon name="chevron" className={`w-4 h-4 text-muted transition-transform ${acc === i ? 'rotate-180' : ''}`} />
                  </button>
                  )}
                  {m.items && acc === i && (
                    <div className="grid gap-1 pb-3 animate-[fadeup_0.25s_ease-out]">
                      {m.items.map((it) => <MegaItem key={it.href + it.t} it={it} onClick={() => setOpen(false)} />)}
                    </div>
                  )}
                </div>
              ))}

              <button type="button" onClick={() => { setOpen(false); setBasla(true); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-center font-bold text-white shadow-lg shadow-brand-500/25">
                Hemen Başla <Icon name="arrow" className="h-4 w-4" />
              </button>

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
      <BaslaModal open={basla} onClose={() => setBasla(false)} />
    </>
  );
}

const FIRMA = {
  unvan: 'SunucumWEB Bilişim Teknolojileri',
  adres: 'Hasanbey Mahallesi, Sokullu Sokak No: 16, Keçiborlu / ISPARTA',
  telefon: '0(850) 302 5809',
  telefonHref: 'tel:08503025809',
  eposta: 'destek@sunucumweb.com',
  panel: 'https://my.sunucumweb.com',
};

const BTK = {
  metin: '5651 sayılı kanun kapsamında Bilgi Teknolojileri ve İletişim Kurumu tarafından yetkilendirilmiş Yer Sağlayıcı\'dır.',
  liste: 'https://internet.btk.gov.tr/yer-saglayici-listesi?page=1&q=SunucumWEB',
  logo: 'https://cdn.yetkinweb.com/genel/genel/btklogo_320x320.png',
};

const GOOGLE_YORUM_URL = 'https://www.google.com/search?q=SunucumWEB&rldimm=10560064220033697496&tbm=lcl#lkt=LocalPoiReviews';

const FOOT_KOLON = [
  { h: 'Hosting', items: [
    ['Web Hosting', '/web-hosting'],
    ['WordPress Hosting', '/wordpress-hosting'],
    ['Reseller Hosting', '/reseller-hosting'],
    ['Kurumsal Hosting', '/kurumsal-hosting'],
  ]},
  { h: 'Sunucular', items: [
    ['Sanal Sunucu (VDS)', '/sanal-sunucu'],
    ['Premium Sunucu', '/premium-sunucu'],
    ['Dedicated Sunucu', '/dedicated-sunucu'],
    ['GPU Sunucu', '/gpu-sunucu'],
  ]},
  { h: 'Alan Adı', items: [
    ['Alan Adı Tescil', '/alan-adi'],
    ['Alan Adı Transfer', '/transfer'],
    ['WHOIS Sorgulama', '/araclar/whois'],
  ]},
  { h: 'Veri Merkezi', items: [
    ['Sunucu Barındırma', '/sunucu-barindirma'],
    ['IP Kiralama', '/ip-kiralama'],
  ]},
  { h: 'Araçlar', items: [
    ['DNS Sorgulama', '/araclar/dns'],
    ['WHOIS Sorgulama', '/araclar/whois'],
    ['SSL Kontrolü', '/araclar/ssl'],
    ['E-posta Kayıtları', '/araclar/eposta'],
    ['IP Sorgulama', '/araclar/ip'],
  ]},
  { h: 'Kurumsal', items: [
    ['Şirket Profili', '/hakkimizda'],
    ['Hazır Yazılımlar', '/hazir-yazilim'],
    ['Legal', '/legal'],
    ['İletişim', '/iletisim'],
  ]},
];

export const SOSYAL = [
  { ad: 'Facebook', href: 'https://facebook.com/sunucumweb', d: 'M14 8h-2a1 1 0 0 0-1 1v2h3l-.4 3H11v7H8v-7H6v-3h2V9a4 4 0 0 1 4-4h2z' },
  { ad: 'X', href: 'https://x.com/sunucumweb', d: 'M4 4l7.6 9.6L4.4 20h2.1l5.9-6.4 5 6.4H20l-7.6-9.6L19.5 4h-2.1l-5.4 5.9L7.4 4z' },
  { ad: 'Instagram', href: 'https://instagram.com/sunucumweb', d: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5h.01' },
  { ad: 'LinkedIn', href: 'https://linkedin.com/company/sunucumweb', d: 'M4.5 9h3v11h-3zM6 4.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM10.5 9h3v1.6a3.4 3.4 0 0 1 3-1.6c2.4 0 3.5 1.6 3.5 4.3V20h-3v-6c0-1.5-.5-2.4-1.8-2.4-1.1 0-1.7.7-1.7 2.4v6h-3z' },
  { ad: 'YouTube', href: 'https://youtube.com/@sunucumweb', d: 'M21 8.5a3 3 0 0 0-2.1-2.1C17.1 6 12 6 12 6s-5.1 0-6.9.4A3 3 0 0 0 3 8.5C2.6 10.3 2.6 12 2.6 12s0 1.7.4 3.5a3 3 0 0 0 2.1 2.1C6.9 18 12 18 12 18s5.1 0 6.9-.4a3 3 0 0 0 2.1-2.1c.4-1.8.4-3.5.4-3.5s0-1.7-.4-3.5zM10.2 15.1V8.9l5.3 3.1z' },
];

function Yildizlar({ puan }) {
  const benzersiz = useId().replace(/:/g, '');
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => {
        const dolu = Math.max(0, Math.min(1, puan - n + 1)) * 100;
        const gradId = `yz-${benzersiz}-${n}`;
        return (
          <svg key={n} viewBox="0 0 24 24" className="h-[15px] w-[15px]">
            <defs>
              <linearGradient id={gradId}>
                <stop offset={`${dolu}%`} stopColor="#FBBF24" />
                <stop offset={`${dolu}%`} stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
            </defs>
            <path fill={`url(#${gradId})`} d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z" />
          </svg>
        );
      })}
    </span>
  );
}

const YORUM_TAZELEME_MS = 5 * 60 * 1000;

function GoogleYorum() {
  const [ozet, setOzet] = useState(null);

  useEffect(() => {
    let iptal = false;
    let sonCekim = 0;

    const cek = async () => {
      try {
        const r = await fetch('/api/google-reviews', { cache: 'no-store' });
        const d = await r.json();
        if (!iptal && d?.ok) {
          sonCekim = Date.now();
          setOzet({ puan: d.puan, adet: d.adet, harita: d.harita, canli: d.canli });
        }
      } catch {  }
    };

    cek();
    const zamanlayici = setInterval(() => { if (!document.hidden) cek(); }, YORUM_TAZELEME_MS);
    const gorunurluk = () => { if (!document.hidden && Date.now() - sonCekim > YORUM_TAZELEME_MS) cek(); };
    document.addEventListener('visibilitychange', gorunurluk);

    return () => {
      iptal = true;
      clearInterval(zamanlayici);
      document.removeEventListener('visibilitychange', gorunurluk);
    };
  }, []);

  if (!ozet) {
    return (
      <span className="flex min-h-[46px] items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10" aria-hidden>
        <span className="h-5 w-5 shrink-0 rounded-full bg-white/10" />
        <span className="h-3.5 w-8 rounded bg-white/10" />
        <span className="h-3.5 w-[86px] rounded bg-white/10" />
        <span className="h-3.5 w-16 rounded bg-white/10" />
      </span>
    );
  }

  const puanYazi = ozet.puan.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <a
      href={ozet.harita || GOOGLE_YORUM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Google değerlendirmemiz 5 üzerinden ${puanYazi}, ${ozet.adet} yorum`}
      className="group flex min-h-[46px] items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
        <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
        <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.7z" />
        <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0A12 12 0 0 0 1.8 7.1l3.8 3a7.2 7.2 0 0 1 6.4-5.3z" />
      </svg>
      <span className="text-[15px] font-extrabold tabular-nums text-white">{puanYazi}</span>
      <Yildizlar puan={ozet.puan} />
      <span className="text-[13px] tabular-nums text-slate-400 group-hover:text-slate-300">
        {ozet.adet.toLocaleString('tr-TR')} yorum
      </span>
      <Icon name="arrow" className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-300" />
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,3fr)]">
          <div className="max-w-sm">
            <img src="/icon/logo.png" alt={FIRMA.unvan} className="h-8 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Isparta merkezli veri merkezimizden hosting, sanal sunucu ve dedicated sunucu hizmeti veriyoruz.
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-slate-400">{FIRMA.adres}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={FIRMA.telefonHref} className="font-bold text-white transition-colors hover:text-brand-300">{FIRMA.telefon}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${FIRMA.eposta}`} className="break-words text-slate-300 transition-colors hover:text-brand-300">{FIRMA.eposta}</a>
              </li>
            </ul>

            <a
              href={FIRMA.panel}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-400"
            >
              <Icon name="user" className="h-4 w-4" /> Müşteri Paneli
            </a>

            <ul className="mt-6 flex flex-wrap gap-2">
              {SOSYAL.map((s) => (
                <li key={s.ad}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.ad}
                    title={s.ad}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-colors hover:bg-brand-500 hover:text-white hover:ring-brand-400"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.d} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5" aria-label="Alt menü">
            {FOOT_KOLON.map((col) => (
              <div key={col.h} className="min-w-0">
                <div className="text-[13px] font-bold uppercase tracking-wider text-white">{col.h}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map(([t, h]) => (
                    <li key={h + t}>
                      <Link href={h} className="text-sm text-slate-400 transition-colors hover:text-brand-300">{t}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <GoogleYorum />

          <a
            href={BTK.liste}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex max-w-xl items-center gap-4 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <img
              src={BTK.logo}
              alt="BTK"
              width={320}
              height={320}
              loading="lazy"
              className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1"
            />
            <span className="text-[12.5px] leading-relaxed text-slate-400">
              <span className="font-semibold text-white">{FIRMA.unvan}</span>, {BTK.metin}
              <span className="ml-1 inline-block text-brand-300 transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </a>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 lg:flex-row lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-400">
            <span>© 2026 {FIRMA.unvan}</span>
            <span className="hidden text-white/20 sm:inline">|</span>
            <DurumRozeti />
          </div>

          <OdemeLogolari />
        </div>
      </div>
    </footer>
  );
}

export function CtaBand({ title = 'Bugün başlayın, farkı hemen hissedin', text = 'Dakikalar içinde kurulum, 30 gün içinde memnun kalmazsanız iade garantisi.' }) {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 sm:px-14 text-center shadow-[0_40px_90px_-40px_rgba(15,118,110,0.7)]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">{title}</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/85">{text}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-bold text-strong hover:bg-brandsoft transition">Bize Ulaşın <Icon name="arrow" className="w-4 h-4" /></Link>
            <a href="tel:08503025809" className="inline-flex items-center gap-2 rounded-xl bg-ink/20 px-6 py-3.5 text-[15px] font-semibold text-white ring-1 ring-white/25 hover:bg-ink/30 transition">0(850) 302 5809</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteShell({ children }) {
  return (
    <CartProvider>
      <SmoothScroll />
      <div className="min-h-ekran bg-page font-sans text-strong antialiased">
        <SiteHeader />
        <main>{children}</main>
        <AltyapiSerit />
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

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
