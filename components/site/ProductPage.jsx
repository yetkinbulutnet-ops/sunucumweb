'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import AddToCartButton from './AddToCartButton';

const num = (s) => Number(String(s).replace(/\./g, '').replace(',', '.')) || 0;
const fmt = (n) => new Intl.NumberFormat('tr-TR').format(Math.round(n));

const TIP = {
  'sanal-sunucu': 'sunucu', 'premium-sunucu': 'sunucu', 'dedicated-sunucu': 'sunucu', 'gpu-sunucu': 'sunucu',
  'sunucu-barindirma': 'merkez', 'ip-kiralama': 'merkez',
};

const GUVEN = [
  { icon: 'shield', t: '%99.9 Uptime' },
  { icon: 'refresh', t: '30 Gün İade' },
  { icon: 'headset', t: '7/24 Gerçek Destek' },
];

const SERIT = [
  { icon: 'shield', t: '%99.9 Uptime', d: 'SLA garantili erişilebilirlik' },
  { icon: 'refresh', t: '30 Gün İade', d: 'Koşulsuz para iade garantisi' },
  { icon: 'headset', t: '7/24 Destek', d: 'Ortalama 5 dakikada yanıt' },
  { icon: 'bolt', t: 'Hızlı Kurulum', d: 'Dakikalar içinde aktivasyon' },
];

const PERFORMANS = [
  { icon: 'bolt', t: 'NVMe SSD Diskler', d: 'En son nesil NVMe ile üstün okuma/yazma performansı.' },
  { icon: 'gauge', t: 'LiteSpeed & Önbellek', d: 'Optimize sunucu yazılımı ve gelişmiş önbellekleme.' },
  { icon: 'pin', t: 'İstanbul Lokasyonu', d: 'Türkiye içi düşük gecikme, hedef kitlenize yakın.' },
  { icon: 'wifi', t: 'Yedekli Premium Ağ', d: 'Çift hatlı, yüksek bant genişlikli kesintisiz bağlantı.' },
];

const GUVENLIK = [
  { icon: 'shield', t: 'DDoS Koruması', d: 'Gelişmiş filtreleme ile saldırılara karşı sürekli koruma.' },
  { icon: 'lock', t: 'Ücretsiz SSL', d: 'Otomatik kurulan Let\'s Encrypt sertifikaları.' },
  { icon: 'refresh', t: 'Otomatik Yedekleme', d: 'Düzenli yedekle verileriniz her zaman güvende.' },
  { icon: 'check', t: 'Güvenlik Duvarı', d: 'Katmanlı güvenlik, kötü amaçlı trafik filtreleme.' },
];

const HOSTING_ADIM = [
  { t: 'Paketinizi seçin', d: 'İhtiyacınıza uygun paketi seçip sepete ekleyin.' },
  { t: 'Kurulum & ücretsiz taşıma', d: 'Hesabınız anında kurulur; mevcut sitenizi biz taşırız.' },
  { t: 'Dakikalar içinde yayında', d: 'Siteniz canlıda; her şeyi kolay panelden yönetin.' },
];

const OS_LISTE = ['Ubuntu', 'Debian', 'AlmaLinux', 'CentOS', 'Windows Server'];
const PANEL_LISTE = ['cPanel', 'Plesk', 'Webmin'];

const KARSILASTIRMA = [
  { grup: 'Genel Özellikler', satirlar: ['cPanel Kontrol Paneli', '24/7 FTP Erişimi', 'Haftalık Otomatik Yedekleme', 'Sınırsız Alan Adı Yönlendirme', 'Ziyaretçi & Trafik İstatistikleri', 'Şifre Korumalı Dizin', 'Özel Hata Sayfaları', 'Web Üzerinden Dosya Yönetimi'] },
  { grup: 'E-Posta Özellikleri', satirlar: ['SMTP / POP3 / IMAP', 'Web Mail Erişimi', 'Anti-Spam / Anti-Virüs', 'Otomatik Cevaplama', 'Takma Ad (Alias)', 'E-posta Yönlendirme', 'E-posta Grupları'] },
  { grup: 'Güvenlik & Altyapı', satirlar: ['Ücretsiz SSL Sertifikası', 'DDoS Koruması', 'NVMe SSD Disk', 'LiteSpeed Web Sunucusu', 'Imunify360 Güvenlik', 'Softaculous Oto Kurulum'] },
];

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
  const aylik = num(p.price);
  const yillikAy = Math.round(aylik * 10 / 12);
  const gosterilen = yillik ? yillikAy : aylik;
  const eski = yillik ? aylik : (p.oldPrice ? num(p.oldPrice) : 0);
  const rozet = yillik ? '2 ay bedava' : (p.discount || null);
  return (
    <div>
      {(eski > gosterilen || rozet) && (
        <div className="flex items-center gap-2">
          {eski > gosterilen && <span className={`text-sm line-through ${koyu ? 'text-slate-400' : 'text-muted'}`}>₺{fmt(eski)}</span>}
          {rozet && <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-extrabold text-emerald-500 ring-1 ring-emerald-500/30">{rozet}</span>}
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span className={`text-sm font-semibold ${koyu ? 'text-slate-300' : 'text-muted'}`}>₺</span>
        <span className={`text-4xl font-extrabold tracking-tight ${koyu ? 'text-white' : 'text-strong'}`}>{fmt(gosterilen)}</span>
        <span className={`text-sm ${koyu ? 'text-slate-300' : 'text-muted'}`}>/ay</span>
      </div>
    </div>
  );
}

function PlanKart({ p, urun, yillik, tip }) {
  const koyu = p.popular;
  return (
    <div className={`relative flex flex-col rounded-3xl p-7 transition-[transform,box-shadow,border-color] duration-300 ${koyu ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgba(15,41,66,0.6)] lg:-translate-y-4 ring-1 ring-brand-400/40' : 'bg-surface border border-line shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] hover:-translate-y-1'}`}>
      {koyu && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-brand-500/40">EN POPÜLER</span>}
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
        <Link href="/iletisim" className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-bold transition-colors ${koyu ? 'bg-brand-500 text-white hover:bg-brand-400' : 'bg-ink text-white hover:bg-brand-600'}`}>Teklif Al <Icon name="arrow" className="h-4 w-4" /></Link>
      ) : (
        <AddToCartButton item={{ name: p.name, product: urun.title, price: yillik ? Math.round(num(p.price) * 10 / 12) : num(p.price), period: '/ay' }} tema={koyu ? 'dolu' : 'acik'} className="mt-8 w-full py-3.5 text-[15px]" />
      )}
    </div>
  );
}

function PlanSatir({ p, urun, yillik, tip }) {
  const one = p.popular;
  return (
    <div className={`relative flex flex-col gap-6 rounded-3xl border p-6 lg:flex-row lg:items-center lg:gap-8 lg:p-7 ${one ? 'border-brand-400/50 bg-surface ring-1 ring-brand-400/30 shadow-[0_24px_60px_-30px_rgba(20,184,166,0.4)]' : 'border-line bg-surface shadow-[0_16px_50px_-32px_rgba(15,41,66,0.3)]'}`}>
      <div className="lg:w-52 lg:shrink-0">
        {one && <span className="mb-2 inline-block rounded-full bg-brand-600 px-3 py-0.5 text-[11px] font-bold text-white">EN POPÜLER</span>}
        <div className="text-lg font-extrabold text-strong">{p.name}</div>
        {p.sub && <div className="mt-0.5 text-[13px] text-muted">{p.sub}</div>}
      </div>
      <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
        {p.feats.slice(0, 9).map((ft) => (
          <div key={ft} className="flex items-start gap-2 text-[13.5px] text-body">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brandtext" /> <span>{ft}</span>
          </div>
        ))}
      </div>
      <div className="lg:w-56 lg:shrink-0 lg:text-right">
        <div className="lg:flex lg:flex-col lg:items-end"><Fiyat p={p} yillik={yillik} koyu={false} /></div>
        <div className="mt-4">
          {tip === 'merkez' ? (
            <Link href="/iletisim" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-brand-600">Teklif Al <Icon name="arrow" className="h-4 w-4" /></Link>
          ) : (
            <AddToCartButton item={{ name: p.name, product: urun.title, price: yillik ? Math.round(num(p.price) * 10 / 12) : num(p.price), period: '/ay' }} tema={one ? 'dolu' : 'acik'} className="w-full py-3 text-[14.5px]" />
          )}
        </div>
      </div>
    </div>
  );
}

function KarsilastirmaTablosu({ plans }) {
  const rows = [];
  KARSILASTIRMA.forEach((g) => { rows.push({ grup: g.grup }); g.satirlar.forEach((s) => rows.push({ satir: s })); });
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface2 px-5 py-4 text-[14px] font-extrabold text-strong">Özellik</th>
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
                  <Icon name="check" className="mx-auto h-4 w-4 text-emerald-500" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductPage({ data, slug }) {
  const d = data;
  const tip = TIP[slug] || 'hosting';
  const [yillik, setYillik] = useState(false);
  const minFiyat = Math.min(...d.plans.map((p) => num(p.price)).filter((n) => n > 0));
  const hosting = tip === 'hosting';

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full bg-brand-300/25 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div className="animate-[fadeup_0.6s_ease-out]">
              <div className="mb-5 flex items-center gap-2 text-sm text-muted"><Link href="/" className="hover:text-brandtext">Ana Sayfa</Link><span>/</span><span className="font-medium text-strong/70">{d.title}</span></div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brandline bg-brandsoft/80 px-3.5 py-1.5 text-[13px] font-semibold text-brandtext"><Icon name={d.icon} className="w-4 h-4" /> {d.eyebrow}</span>
              <h1 className="mt-5 tipo-dev font-extrabold tracking-tight text-strong text-balance">{d.title}</h1>
              <p className="mt-5 max-w-xl tipo-giris text-body">{d.subtitle}</p>

              {Number.isFinite(minFiyat) && (
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-[15px] text-muted">Başlangıç</span>
                  <span className="text-2xl font-extrabold text-strong">₺{fmt(minFiyat)}</span>
                  <span className="text-[15px] text-muted">/ay'dan</span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#paketler" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition">Paketleri Gör <Icon name="arrow" className="w-4 h-4" /></a>
                <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong ring-1 ring-line hover:ring-brandtext/50 transition">Bize Ulaşın</Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
                {GUVEN.map((g) => (
                  <span key={g.t} className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-body"><Icon name={g.icon} className="h-4 w-4 text-brandtext" /> {g.t}</span>
                ))}
              </div>
            </div>

            <div className="relative animate-[fadeup_0.8s_ease-out]">
              <div className="rounded-3xl border border-line/80 bg-surface/90 backdrop-blur p-7 shadow-[0_40px_80px_-30px_rgba(15,41,66,0.35)]">
                <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white"><Icon name={d.icon} /></span><div><div className="text-base font-extrabold text-strong">{d.title}</div><div className="text-[13px] text-muted">Teknik özet</div></div></div>
                <div className="mt-6 space-y-3">{d.specs.map(([k, v]) => (<div key={k} className="flex items-center justify-between rounded-xl bg-surface2 px-4 py-3"><span className="text-sm text-body">{k}</span><span className="text-sm font-bold text-strong">{v}</span></div>))}</div>
              </div>
              <div className="absolute -bottom-5 -left-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite]"><div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name="shield" className="w-5 h-5" /></span><div><div className="text-sm font-extrabold text-strong">%99.9 Uptime</div><div className="text-[11px] text-muted">SLA garantili</div></div></div></div>
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
        <div className="text-center max-w-2xl mx-auto"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Paketler</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{d.title} Paketleri</h2><p className="mt-4 tipo-metin text-body">İhtiyacınıza göre ölçeklenen, şeffaf fiyatlı paketler.</p></div>

        {minFiyat > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full border border-line bg-surface p-1 text-[13.5px] font-semibold">
              <button onClick={() => setYillik(false)} className={`rounded-full px-4 py-2 transition-colors ${!yillik ? 'bg-brand-500 text-white shadow' : 'text-body hover:text-strong'}`}>Aylık</button>
              <button onClick={() => setYillik(true)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${yillik ? 'bg-brand-500 text-white shadow' : 'text-body hover:text-strong'}`}>
                Yıllık <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${yillik ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'}`}>2 AY BEDAVA</span>
              </button>
            </div>
          </div>
        )}

        {hosting ? (
          <div className={`mt-12 grid gap-6 md:grid-cols-2 lg:gap-5 items-stretch ${d.plans.length >= 4 ? 'lg:grid-cols-4' : d.plans.length === 2 ? 'lg:grid-cols-2 max-w-3xl mx-auto' : 'lg:grid-cols-3'}`}>{d.plans.map((p) => <PlanKart key={p.name} p={p} urun={d} yillik={yillik} tip={tip} />)}</div>
        ) : (
          <div className="mt-12 space-y-4">{d.plans.map((p) => <PlanSatir key={p.name} p={p} urun={d} yillik={yillik} tip={tip} />)}</div>
        )}
        <p className="mt-6 text-center text-sm text-muted">Fiyatlara KDV dahil değildir. İhtiyacınıza özel yapılandırma için <Link href="/iletisim" className="font-semibold text-brandtext hover:underline">bize ulaşın</Link>.</p>
      </div></section>

      {hosting && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Karşılaştırma</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Tüm paketlerde neler var?</h2></div>
          <KarsilastirmaTablosu plans={d.plans} />
        </section>
      )}

      <section className={hosting ? 'bg-surface2 border-y border-line' : 'mx-auto max-w-7xl px-5 lg:px-8'}><div className={hosting ? 'mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24' : 'py-20 lg:py-24'}>
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Öne Çıkanlar</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{d.featuresTitle}</h2></div>
        <div className="mt-12"><OzellikGrid items={d.features} /></div>
      </div></section>

      <section className={hosting ? 'mx-auto max-w-7xl px-5 lg:px-8' : 'bg-surface2 border-y border-line'}><div className={hosting ? 'py-20 lg:py-24' : 'mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24'}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Performans</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Hız için tasarlandı</h2>
            <div className="mt-8 space-y-5">{PERFORMANS.map((f) => (<div key={f.t} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span><div><h3 className="text-[16px] font-bold text-strong">{f.t}</h3><p className="mt-1 text-[14px] leading-relaxed text-body">{f.d}</p></div></div>))}</div>
          </div>
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Güvenlik</span>
            <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Verileriniz güvende</h2>
            <div className="mt-8 space-y-5">{GUVENLIK.map((f) => (<div key={f.t} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name={f.icon} className="h-5 w-5" /></span><div><h3 className="text-[16px] font-bold text-strong">{f.t}</h3><p className="mt-1 text-[14px] leading-relaxed text-body">{f.d}</p></div></div>))}</div>
          </div>
        </div>
      </div></section>

      {tip === 'hosting' && (
        <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Nasıl Çalışır</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">3 adımda yayında</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {HOSTING_ADIM.map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-line bg-surface p-7 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white font-extrabold">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-strong">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{s.d}</p>
              </div>
            ))}
          </div>
        </div></section>
      )}

      {tip === 'sunucu' && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-10 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Tam Kontrol</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">İşletim sistemi ve panel özgürlüğü</h2><p className="mt-4 tipo-metin text-body">Kurulumda dilediğiniz işletim sistemini ve yönetim panelini seçin; tam root erişimiyle her şey sizin kontrolünüzde.</p></div>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6"><div className="text-[13px] font-bold uppercase tracking-wide text-muted">İşletim Sistemleri</div><div className="mt-3 flex flex-wrap gap-2">{OS_LISTE.map((o) => <span key={o} className="rounded-lg bg-surface2 px-3 py-1.5 text-[13px] font-semibold text-strong ring-1 ring-line">{o}</span>)}</div></div>
            <div className="rounded-2xl border border-line bg-surface p-6"><div className="text-[13px] font-bold uppercase tracking-wide text-muted">Yönetim Panelleri</div><div className="mt-3 flex flex-wrap gap-2">{PANEL_LISTE.map((o) => <span key={o} className="rounded-lg bg-surface2 px-3 py-1.5 text-[13px] font-semibold text-strong ring-1 ring-line">{o}</span>)}</div></div>
          </div>
          <p className="mt-6 text-center text-[14px] text-body"><Icon name="pin" className="mr-1 inline h-4 w-4 text-brandtext" /> İstanbul lokasyonu ile Türkiye içinden düşük gecikme.</p>
        </section>
      )}

      {d.faq && (
        <section className="border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">SSS</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Sık sorulan sorular</h2></div>
          <Faq items={d.faq} />
        </div></section>
      )}

      <CtaBand title={`${d.title} ile hemen başlayın`} />
    </SiteShell>
  );
}
