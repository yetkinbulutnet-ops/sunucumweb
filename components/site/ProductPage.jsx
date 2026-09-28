'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import AddToCartButton from './AddToCartButton';
import { useSiteAyarlari } from './SiteAyarlari';
import { siparisUrl } from '@/content/site/wisecp-siparis';
import { useParabirimi } from './CurrencyProvider';
import Sema from './Sema';
import { urunSemasi, sssSemasi, ekmekKirintisi } from '@/lib/semalar';
import { m } from '@/lib/metin';

const SUNUCU_GORSEL = '/img/urun/sunucu.webp';
const SLUG_GORSEL = { 'sanal-sunucu': '/img/urun/xeon.webp', 'premium-sunucu': '/img/urun/xeon-platinum.webp', 'gpu-sunucu': '/img/urun/ekran-karti.webp', 'dedicated-sunucu': '/img/urun/dedicated.webp' };

const HERO_GORSEL = {
  'sanal-sunucu': { src: '/img/urun/xeon.webp' },
  'premium-sunucu': { src: '/img/urun/xeon-platinum.webp' },
  'gpu-sunucu': { src: '/img/urun/ekran-karti.webp' },
  'dedicated-sunucu': { src: '/img/urun/dedicated.webp' },
  'sunucu-barindirma': { src: '/img/galeri/kabin-dellemc.webp', foto: true },
  'ip-kiralama': { src: '/img/urun/ip-kiralama.webp' },
};

const HERO_TON = {
  'sanal-sunucu': 'bg-brand-400/25', 'premium-sunucu': 'bg-amber-400/25',
  'dedicated-sunucu': 'bg-sky-400/25', 'gpu-sunucu': 'bg-violet-400/25',
  'sunucu-barindirma': 'bg-emerald-400/25', 'ip-kiralama': 'bg-cyan-400/25',
  'web-hosting': 'bg-brand-400/25', 'wordpress-hosting': 'bg-sky-400/25',
  'reseller-hosting': 'bg-violet-400/25', 'kurumsal-hosting': 'bg-indigo-400/25',
};
const HOSTING_ALTYAPI_ADLARI = ['cPanel', 'LiteSpeed', 'CloudLinux', 'Imunify360', 'JetBackup', 'Softaculous'];

const num = (s) => {
  if (typeof s === 'number') return s;
  if (s == null) return 0;
  return Number(String(s).replace(/\./g, '').replace(',', '.')) || 0;
};
const fmt = (n) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n);

const TIP = {
  'sanal-sunucu': 'sunucu', 'premium-sunucu': 'sunucu', 'dedicated-sunucu': 'sunucu', 'gpu-sunucu': 'sunucu',
  'sunucu-barindirma': 'merkez', 'ip-kiralama': 'merkez',
};

const OS_LOGO = [
  { ad: 'Ubuntu', logo: '/img/os/ubuntu.webp' },
  { ad: 'Debian', logo: '/img/os/debian.webp' },
  { ad: 'AlmaLinux', logo: '/img/os/almalinux.webp' },
  { ad: 'CentOS', logo: '/img/os/centos.webp' },
  { ad: 'Windows Server', logo: '/img/os/windows-server.webp' },
];
const PANEL_LOGO = [{ ad: 'cPanel', logo: '/img/altyapi/cpanel.webp' }];

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((f, i) => (
        <div key={f.q} className="px-6">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
            <span className="text-[15px] font-semibold text-strong">{f.q}</span>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brandsoft text-brandtext transition-transform ${open === i ? 'rotate-45' : ''}`}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
          </button>
          {open === i && <p className="pb-5 -mt-1 text-[15px] leading-relaxed text-body">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

function OzellikGrid({ items }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
      {items.map((f) => (
        <div key={f.t} className="rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span>
          <h3 className="mt-4 text-[16px] font-bold text-strong">{f.t}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-body">{f.d}</p>
        </div>
      ))}
    </div>
  );
}

function Fiyat({ p, yillik, koyu }) {
  const { fiyat } = useParabirimi();
  const aylik = num(p.price);
  if (aylik <= 0) {
    return <div className={`text-[19px] font-extrabold ${koyu ? 'text-white' : 'text-strong'}`}>{m('urun.fiyat_gorusun')}</div>;
  }
  const yillikAy = Math.round(aylik * 10 / 12);
  const gosterilen = yillik ? yillikAy : aylik;
  const eski = yillik ? aylik : (p.oldPrice ? num(p.oldPrice) : 0);
  const rozet = yillik ? m('urun.iki_ay_bedava') : (p.discount || null);
  return (
    <div>
      {(eski > gosterilen || rozet) && (
        <div className="flex items-center gap-2">
          {eski > gosterilen && <span className={`text-sm line-through ${koyu ? 'text-slate-400' : 'text-muted'}`}>{fiyat(eski)}</span>}
          {rozet && <span className={`rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-extrabold ring-1 ring-emerald-500/30 ${koyu ? 'text-emerald-300' : 'text-emerald-700 dark:text-emerald-400'}`}>{rozet}</span>}
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-extrabold tracking-tight ${koyu ? 'text-white' : 'text-strong'}`}>{fiyat(gosterilen)}</span>
        <span className={`text-sm ${koyu ? 'text-slate-300' : 'text-muted'}`}>{m('urun.ay_eki')}</span>
      </div>
    </div>
  );
}

function PlanKart({ p, urun, yillik, tip, slug }) {
  const koyu = p.popular;
  return (
    <div className={`relative flex flex-col rounded-3xl p-7 transition-[transform,box-shadow,border-color] duration-300 ${koyu ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgba(15,41,66,0.6)] lg:-translate-y-4 ring-1 ring-brand-400/40' : 'bg-surface border border-line shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] hover:-translate-y-1'}`}>
      {koyu && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-700 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-brand-500/40">{m('urun.en_populer')}</span>}
      <div className={`text-xl font-extrabold ${koyu ? 'text-white' : 'text-strong'}`}>{p.name}</div>
      {p.sub && <div className={`mt-1 text-[13px] ${koyu ? 'text-slate-400' : 'text-muted'}`}>{p.sub}</div>}
      <div className="mt-4"><Fiyat p={p} yillik={yillik} koyu={koyu} /></div>
      <ul className="mt-6 space-y-3 flex-1">
        {p.feats.map((ft) => (
          <li key={ft} className="flex items-start gap-3 text-[14.5px]">
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${koyu ? 'bg-brand-500/20 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name="check" className="w-3 h-3" /></span>
            <span className={koyu ? 'text-slate-200' : 'text-body'}>{ft}</span>
          </li>
        ))}
      </ul>
      {tip === 'merkez' ? (
        <Link href="/iletisim" className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-bold transition-colors ${koyu ? 'bg-brand-700 text-white hover:bg-brand-400' : 'bg-ink text-white hover:bg-brand-600'}`}>{m('urun.teklif_al')} <Icon name="arrow" className="h-4 w-4" /></Link>
      ) : (
        <AddToCartButton item={{ name: p.name, product: urun.title, price: yillik ? Math.round(num(p.price) * 10 / 12) : num(p.price), period: '/ay' }} href={siparisUrl(urun, p)} tema={koyu ? 'dolu' : 'acik'} className="mt-8 w-full py-3.5 text-[15px]" />
      )}
    </div>
  );
}

function PlanSatir({ p, urun, yillik, tip, gorsel, slug }) {
  const one = p.popular;
  const ozet = p.ozet || p.feats.map((f) => ({ e: null, d: f, hw: false }));
  const hw = ozet.filter((o) => o.hw);
  const ekstra = ozet.filter((o) => !o.hw);
  const specler = hw.length ? hw : ozet;
  return (
    <div className={`relative flex flex-col gap-5 rounded-3xl border p-6 lg:flex-row lg:items-center lg:gap-6 ${one ? 'border-brand-400/50 bg-surface ring-1 ring-brand-400/30 shadow-[0_24px_60px_-30px_rgba(20,184,166,0.4)]' : 'border-line bg-surface shadow-[0_16px_50px_-32px_rgba(15,41,66,0.3)]'}`}>
      {gorsel && (
        <div className="hidden shrink-0 sm:block lg:w-28">
          <img src={gorsel} alt={m('urun.plan_gorsel_alt', { ad: p.name })} width={480} height={360} loading="lazy" className="mx-auto h-14 w-auto object-contain lg:h-[72px]" />
        </div>
      )}
      <div className="lg:w-44 lg:shrink-0">
        {one && <span className="mb-2 inline-block rounded-full bg-brand-700 px-3 py-0.5 text-[11px] font-bold text-white">{m('urun.en_populer')}</span>}
        <div className="text-lg font-extrabold text-strong">{p.name}</div>
        {p.sub && <div className="mt-0.5 text-[12.5px] leading-snug text-muted">{p.sub}</div>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {specler.map((o) => (
            <div key={o.d} className="min-w-0">
              {o.e ? (
                <>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-muted">{o.e}</div>
                  <div className="mt-0.5 text-[14px] font-bold text-strong">{o.d}</div>
                </>
              ) : (
                <div className="flex items-start gap-1.5 text-[13.5px] text-body"><Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brandtext" /> <span>{o.d}</span></div>
              )}
            </div>
          ))}
        </div>
        {hw.length > 0 && ekstra.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3">
            {ekstra.map((o) => (
              <span key={o.d} className="inline-flex items-center gap-1.5 text-[12.5px] text-body"><Icon name="check" className="h-3.5 w-3.5 shrink-0 text-brandtext" /> {o.d}</span>
            ))}
          </div>
        )}
      </div>
      <div className="lg:w-52 lg:shrink-0 lg:text-right">
        <div className="lg:flex lg:flex-col lg:items-end"><Fiyat p={p} yillik={yillik} koyu={false} /></div>
        <div className="mt-4">
          {tip === 'merkez' ? (
            <Link href="/iletisim" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-brand-600">{m('urun.teklif_al')} <Icon name="arrow" className="h-4 w-4" /></Link>
          ) : (
            <AddToCartButton item={{ name: p.name, product: urun.title, price: yillik ? Math.round(num(p.price) * 10 / 12) : num(p.price), period: '/ay' }} href={siparisUrl(urun, p)} tema={one ? 'dolu' : 'acik'} className="w-full py-3 text-[14.5px]" />
          )}
        </div>
      </div>
    </div>
  );
}

function KarsilastirmaTablosu({ plans, KARSILASTIRMA }) {
  const rows = [];
  KARSILASTIRMA.forEach((g) => { rows.push({ grup: g.grup }); g.satirlar.forEach((s) => rows.push({ satir: s })); });
  return (
    <div tabIndex={0} role="region" aria-label={m('urun.karsilastirma_baslik')} className="overflow-x-auto rounded-2xl border border-line bg-surface outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface2 px-5 py-4 text-[14px] font-extrabold text-strong">{m('urun.tablo_ozellik')}</th>
            {plans.map((p) => (
              <th key={p.name} className={`px-4 py-4 text-center text-[14px] font-extrabold ${p.popular ? 'text-brandtext' : 'text-strong'}`}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => r.grup ? (
            <tr key={`g${i}`}>
              <td colSpan={plans.length + 1} className="sticky left-0 bg-brandsoft/40 px-5 py-2.5 text-[12.5px] font-extrabold uppercase tracking-wide text-brandtext">{r.grup}</td>
            </tr>
          ) : (
            <tr key={`s${i}`} className="border-t border-line">
              <td className="sticky left-0 z-10 bg-surface px-5 py-3 text-[14px] text-body">{r.satir}</td>
              {plans.map((p) => (
                <td key={p.name} className="px-4 py-3 text-center">
                  <Icon name="check" className="mx-auto h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DonanimGorsel({ d, gorsel, tonGlow }) {
  const [s0, s1] = d.specs || [];
  const ilk = d.heroStats?.[0];
  return (
    <div className="relative animate-[fadeup_0.8s_ease-out]">
      <div aria-hidden className={`absolute -inset-6 -z-10 rounded-[2.5rem] ${tonGlow} opacity-70 blur-[70px]`} />
      <div className="relative overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-b from-surface to-surface2 p-3 shadow-[0_40px_90px_-40px_rgba(15,41,66,0.5)]">
        <div className="relative overflow-hidden rounded-2xl">
          {gorsel.foto ? (
            <div className="relative aspect-[4/3]">
              <img src={gorsel.src} alt={m('urun.hero_foto_alt', { urun: d.title })} width={1200} height={900} loading="eager" fetchPriority="high" className="h-full w-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="grid aspect-[4/3] place-items-center bg-[radial-gradient(circle_at_50%_38%,rgb(var(--c-surface2)),rgb(var(--c-surface)))] p-6">
              <img src={gorsel.src} alt={m('urun.hero_gorsel_alt', { urun: d.title })} width={900} height={700} loading="eager" fetchPriority="high" className="max-h-full w-auto object-contain drop-shadow-[0_30px_45px_rgba(15,41,66,0.4)]" />
            </div>
          )}
        </div>
      </div>

      {ilk && (
        <div className="absolute -right-2 -top-3 flex items-center gap-2 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-xl shadow-ink/10 sm:-right-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brandsoft text-brandtext"><Icon name={d.icon} className="h-4 w-4" /></span>
          <div><div className="text-[13px] font-extrabold leading-none text-strong">{ilk[0]}</div><div className="mt-1 text-[10px] uppercase tracking-wide text-muted">{ilk[1]}</div></div>
        </div>
      )}
      {s0 && (
        <div className="absolute -bottom-4 -left-2 flex items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite] sm:-left-4">
          <div><div className="text-[10px] uppercase tracking-wide text-muted">{s0[0]}</div><div className="text-[13px] font-bold text-strong">{s0[1]}</div></div>
          {s1 && <div className="border-l border-line pl-4"><div className="text-[10px] uppercase tracking-wide text-muted">{s1[0]}</div><div className="text-[13px] font-bold text-strong">{s1[1]}</div></div>}
        </div>
      )}
    </div>
  );
}

function HostingGorsel({ d, tonGlow }) {
  const metr = d.heroStats || [];
  return (
    <div className="relative animate-[fadeup_0.8s_ease-out]">
      <div aria-hidden className={`absolute -inset-6 -z-10 rounded-[2.5rem] ${tonGlow} opacity-70 blur-[70px]`} />
      <div className="relative overflow-hidden rounded-3xl border border-line/80 bg-surface shadow-[0_40px_90px_-40px_rgba(15,41,66,0.5)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-400/70" /><span className="h-3 w-3 rounded-full bg-amber-400/70" /><span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-page px-3 py-1.5 text-[12px] text-muted"><Icon name="lock" className="h-3.5 w-3.5 shrink-0 text-brandtext" /><span className="truncate">{m('urun.ornek_adres')}</span></span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={d.icon} className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1"><div className="h-2.5 w-28 max-w-full rounded bg-strong/15" /><div className="mt-1.5 h-2 w-20 max-w-full rounded bg-line" /></div>
          </div>
          <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-brand-500/15 to-brand-400/5 ring-1 ring-line" />
          <div className="mt-3 grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-surface2 ring-1 ring-line" />)}</div>
        </div>
        {metr.length > 0 && (
          <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-surface2/60">
            {metr.map(([v, k]) => (
              <div key={k} className="min-w-0 px-3 py-3 text-center"><div className="truncate text-[15px] font-extrabold text-strong">{v}</div><div className="mt-0.5 truncate text-[10.5px] uppercase tracking-wide text-muted">{k}</div></div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute -bottom-4 -left-2 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite] sm:-left-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name="bolt" className="h-5 w-5" /></span>
        <div><div className="text-[13px] font-extrabold leading-none text-strong">LiteSpeed</div><div className="mt-1 text-[11px] text-muted">{m('urun.onbellekli_hiz')}</div></div>
      </div>
    </div>
  );
}

function HeroVisual({ d, gorsel, tonGlow }) {
  return gorsel ? <DonanimGorsel d={d} gorsel={gorsel} tonGlow={tonGlow} /> : <HostingGorsel d={d} tonGlow={tonGlow} />;
}

export default function ProductPage({ data, slug, ortak }) {
  const { serit: SERIT, performans: PERFORMANS, guvenlik: GUVENLIK, hostingAdim: HOSTING_ADIM, karsilastirma: KARSILASTIRMA } = ortak;
  const HOSTING_ALTYAPI = useSiteAyarlari().altyapi.liste.filter((a) => HOSTING_ALTYAPI_ADLARI.includes(a.ad));
  const d = data;
  const tip = TIP[slug] || 'hosting';
  const { fiyat } = useParabirimi();
  const [yillik, setYillik] = useState(false);
  const minFiyat = Math.min(...d.plans.map((p) => num(p.price)).filter((n) => n > 0));
  const hosting = tip === 'hosting';

  const gorsel = SLUG_GORSEL[slug] || (tip === 'sunucu' ? SUNUCU_GORSEL : undefined);
  const heroGorsel = HERO_GORSEL[slug];
  const tonGlow = HERO_TON[slug] || 'bg-brand-300/25';

  return (
    <SiteShell>
      <Sema veri={[
        urunSemasi({ ad: d.title, aciklama: d.subtitle, yol: `/${slug}`, gorsel, planlar: (d.plans || []).map((p) => ({ name: p.name, fiyat: num(p.price) })) }),
        ...(d.faq ? [sssSemasi(d.faq)] : []),
        ekmekKirintisi([{ ad: m('urun.ana_sayfa'), yol: '/' }, { ad: d.eyebrow || d.title, yol: `/${slug}` }]),
      ]} />
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className={`absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full ${tonGlow} blur-[120px]`} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="min-w-0 animate-[fadeup_0.6s_ease-out]">
              <div className="mb-5 flex items-center gap-2 text-sm text-muted"><Link href="/" className="hover:text-brandtext">{m('urun.ana_sayfa')}</Link><span>/</span><span className="font-medium text-strong/70">{d.title}</span></div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brandline bg-brandsoft/80 px-3.5 py-1.5 text-[13px] font-semibold text-brandtext"><Icon name={d.icon} className="h-4 w-4" /> {d.eyebrow}</span>
              <h1 className="mt-5 tipo-dev font-extrabold tracking-tight text-strong text-balance">{d.title}</h1>
              <p className="mt-5 max-w-xl tipo-giris text-body">{d.subtitle}</p>

              {Number.isFinite(minFiyat) && (
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-[15px] text-muted">{m('urun.baslangic')}</span>
                  <span className="text-2xl font-extrabold text-strong">{fiyat(minFiyat)}</span>
                  <span className="text-[15px] text-muted">{m('urun.aydan')}</span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#paketler" className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-800">{m('urun.paketleri_gor')} <Icon name="arrow" className="h-4 w-4" /></a>
                <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong ring-1 ring-line transition hover:ring-brandtext/50">{m('urun.bize_ulasin')}</Link>
              </div>

              {d.heroStats?.length > 0 && (
                <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
                  {d.heroStats.map(([v, k]) => (
                    <div key={k} className="min-w-0 rounded-2xl border border-line bg-surface/70 px-3 py-3 text-center backdrop-blur">
                      <dt className="truncate text-[15px] font-extrabold text-strong sm:text-[17px]">{v}</dt>
                      <dd className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wide text-muted">{k}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="min-w-0">
              <HeroVisual d={d} gorsel={heroGorsel} tonGlow={tonGlow} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface2/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-5 py-8 lg:grid-cols-4 lg:px-8">
          {SERIT.map((s) => (
            <div key={s.t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={s.icon} className="h-5 w-5" /></span>
              <div className="min-w-0"><div className="text-[14px] font-extrabold text-strong">{s.t}</div><div className="text-[12.5px] text-muted">{s.d}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section id="paketler" className="scroll-mt-20 bg-surface2 border-b border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.paketler_etiket')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.paketler_baslik', { urun: d.title })}</h2><p className="mt-4 tipo-metin text-body">{m('urun.paketler_aciklama')}</p></div>

        {minFiyat > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full border border-line bg-surface p-1 text-[13.5px] font-semibold">
              <button onClick={() => setYillik(false)} className={`rounded-full px-4 py-2 transition-colors ${!yillik ? 'bg-brand-700 text-white shadow' : 'text-body hover:text-strong'}`}>{m('urun.aylik')}</button>
              <button onClick={() => setYillik(true)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${yillik ? 'bg-brand-700 text-white shadow' : 'text-body hover:text-strong'}`}>
                {m('urun.yillik')} <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${yillik ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'}`}>{m('urun.iki_ay_bedava_rozet')}</span>
              </button>
            </div>
          </div>
        )}

        {hosting ? (
          <div className={`mt-12 grid gap-6 md:grid-cols-2 lg:gap-5 items-stretch ${d.plans.length >= 4 ? 'lg:grid-cols-4' : d.plans.length === 2 ? 'lg:grid-cols-2 max-w-3xl mx-auto' : 'lg:grid-cols-3'}`}>{d.plans.map((p) => <PlanKart key={p.name} p={p} urun={d} yillik={yillik} tip={tip} slug={slug} />)}</div>
        ) : (
          <div className="mt-12 space-y-4">{d.plans.map((p) => <PlanSatir key={p.name} p={p} urun={d} yillik={yillik} tip={tip} gorsel={tip === 'sunucu' ? (SLUG_GORSEL[slug] || SUNUCU_GORSEL) : null} slug={slug} />)}</div>
        )}
        <p className="mt-6 text-center text-sm text-muted">{m('urun.kdv_notu')} <Link href="/iletisim" className="font-semibold text-brandtext hover:underline">{m('urun.kdv_notu_link')}</Link>.</p>
      </div></section>

      {hosting && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.karsilastirma_etiket')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.karsilastirma_baslik')}</h2></div>
          <KarsilastirmaTablosu plans={d.plans} KARSILASTIRMA={KARSILASTIRMA} />

          <div className="mx-auto mt-20 mb-10 max-w-2xl text-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.altyapi_etiket')}</span>
            <h3 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.altyapi_baslik')}</h3>
            <p className="mt-3 tipo-metin text-body">{m('urun.altyapi_aciklama')}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {HOSTING_ALTYAPI.map((a) => (
              <div key={a.ad} className="grid h-16 w-32 place-items-center rounded-2xl bg-white px-5 ring-1 ring-line sm:w-36">
                <img src={a.logo} alt={m('urun.logo_alt', { ad: a.ad })} width={a.g} height={a.y} loading="lazy" className="max-h-8 w-auto max-w-[120px] object-contain" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={hosting ? 'bg-surface2 border-y border-line' : 'mx-auto max-w-7xl px-5 lg:px-8'}><div className={hosting ? 'mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24' : 'py-20 lg:py-24'}>
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.one_cikanlar')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{d.featuresTitle}</h2></div>
        <div className="mt-12"><OzellikGrid items={d.features} /></div>
      </div></section>

      <section className={hosting ? 'mx-auto max-w-7xl px-5 lg:px-8' : 'bg-surface2 border-y border-line'}><div className={hosting ? 'py-20 lg:py-24' : 'mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24'}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.performans_etiket')}</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.performans_baslik')}</h2>
            <div className="mt-8 space-y-5">{PERFORMANS.map((f) => (<div key={f.t} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span><div><h3 className="text-[16px] font-bold text-strong">{f.t}</h3><p className="mt-1 text-[14px] leading-relaxed text-body">{f.d}</p></div></div>))}</div>
          </div>
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.guvenlik_etiket')}</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.guvenlik_baslik')}</h2>
            <div className="mt-8 space-y-5">{GUVENLIK.map((f) => (<div key={f.t} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span><div><h3 className="text-[16px] font-bold text-strong">{f.t}</h3><p className="mt-1 text-[14px] leading-relaxed text-body">{f.d}</p></div></div>))}</div>
          </div>
        </div>
      </div></section>

      {tip === 'hosting' && (
        <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.nasil_calisir')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.adim_baslik')}</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {HOSTING_ADIM.map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-line bg-surface p-7 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-700 text-white font-extrabold">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-strong">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{s.d}</p>
              </div>
            ))}
          </div>
        </div></section>
      )}

      {tip === 'sunucu' && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-10 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.tam_kontrol_etiket')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.tam_kontrol_baslik')}</h2><p className="mt-4 tipo-metin text-body">{m('urun.tam_kontrol_aciklama')}</p></div>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6"><div className="text-[13px] font-bold uppercase tracking-wide text-muted">{m('urun.isletim_sistemleri')}</div><div className="mt-4 flex flex-wrap items-center gap-3">{OS_LOGO.map((o) => <div key={o.ad} title={o.ad} className="grid h-14 w-24 place-items-center rounded-xl bg-white px-3 ring-1 ring-line"><img src={o.logo} alt={m('urun.logo_alt', { ad: o.ad })} width={200} height={120} loading="lazy" className="max-h-9 w-auto max-w-full object-contain" /></div>)}</div></div>
            <div className="rounded-2xl border border-line bg-surface p-6"><div className="text-[13px] font-bold uppercase tracking-wide text-muted">{m('urun.yonetim_paneli')}</div><div className="mt-4 flex flex-wrap items-center gap-3">{PANEL_LOGO.map((o) => <div key={o.ad} title={o.ad} className="grid h-14 w-24 place-items-center rounded-xl bg-white px-3 ring-1 ring-line"><img src={o.logo} alt={m('urun.logo_alt', { ad: o.ad })} width={200} height={80} loading="lazy" className="max-h-8 w-auto max-w-full object-contain" /></div>)}</div></div>
          </div>
          <p className="mt-6 text-center text-[14px] text-body"><Icon name="pin" className="mr-1 inline h-4 w-4 text-brandtext" /> {m('urun.lokasyon_notu')}</p>
        </section>
      )}

      {d.faq && (
        <section className="border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('urun.sss_etiket')}</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('urun.sss_baslik')}</h2></div>
          <Faq items={d.faq} />
        </div></section>
      )}

      <CtaBand title={m('urun.cta_baslik', { urun: d.title })} />
    </SiteShell>
  );
}
