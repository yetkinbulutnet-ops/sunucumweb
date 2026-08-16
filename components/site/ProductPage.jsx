'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import AddToCartButton from './AddToCartButton';

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((f, i) => (
        <div key={i} className="px-6">
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

export default function ProductPage({ data }) {
  const d = data;
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
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-strong text-balance">{d.title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">{d.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#paketler" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition">Paketleri Gör <Icon name="arrow" className="w-4 h-4" /></a>
                <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong ring-1 ring-line hover:ring-brandtext/50 transition">Bize Ulaşın</Link>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">{d.heroStats.map(([n, l]) => (<div key={l} className="flex items-center gap-2.5"><span className="text-xl font-extrabold text-strong">{n}</span><span className="text-sm text-body">{l}</span></div>))}</div>
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

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Öne Çıkanlar</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{d.featuresTitle}</h2></div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{d.features.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-20px_rgba(15,41,66,0.18)] hover:shadow-[0_24px_60px_-24px_rgba(20,184,166,0.35)] hover:-translate-y-1 transition-[transform,box-shadow,border-color,opacity] duration-300"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icon name={f.icon} /></span><h3 className="mt-5 text-lg font-bold text-strong">{f.t}</h3><p className="mt-2 text-[15px] leading-relaxed text-body">{f.d}</p></div>))}</div>
      </section>

      <section id="paketler" className="bg-surface2 border-y border-line scroll-mt-20"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Paketler</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">{d.title} Paketleri</h2><p className="mt-4 text-lg text-body">İhtiyacınıza göre ölçeklenen, şeffaf fiyatlı paketler.</p></div>
        <div className="mt-14 grid lg:grid-cols-3 gap-6 lg:gap-5 items-stretch">{d.plans.map((p) => (<div key={p.name} className={`relative flex flex-col rounded-3xl p-7 transition-[transform,box-shadow,border-color,opacity] duration-300 ${p.popular ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgba(15,41,66,0.6)] lg:-translate-y-4 ring-1 ring-brand-400/40' : 'bg-surface border border-line shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)]'}`}>{p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-brand-500/40">EN POPÜLER</span>}<div className={`text-xl font-extrabold ${p.popular ? 'text-white' : 'text-strong'}`}>{p.name}</div><div className="mt-4 flex items-baseline gap-1"><span className={`text-sm font-semibold ${p.popular ? 'text-slate-300' : 'text-muted'}`}>₺</span><span className={`text-5xl font-extrabold tracking-tight ${p.popular ? 'text-white' : 'text-strong'}`}>{p.price}</span><span className={`text-sm ${p.popular ? 'text-slate-300' : 'text-muted'}`}>/ay</span></div><ul className="mt-6 space-y-3 flex-1">{p.feats.map((ft) => (<li key={ft} className="flex items-center gap-3 text-[15px]"><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.popular ? 'bg-brand-500/20 text-brand-300' : 'bg-brandsoft text-brandtext'}`}><Icon name="check" className="w-3 h-3" /></span><span className={p.popular ? 'text-slate-200' : 'text-body'}>{ft}</span></li>))}</ul><AddToCartButton item={{ name: p.name, product: d.title, price: p.price }} tema={p.popular ? 'dolu' : 'acik'} className="mt-8 w-full py-3.5 text-[15px]" /><Link href="/iletisim" className="mt-2 text-center text-[13px] font-semibold text-muted transition-colors hover:text-brandtext">Teklif isteyin</Link></div>))}</div>
        <p className="mt-6 text-center text-sm text-muted">* Fiyatlar temsilîdir; gerçek paket fiyatlarınızı buraya girebilirsiniz.</p>
      </div></section>

      {d.faq && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">SSS</span><h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-strong text-balance">Sık sorulan sorular</h2></div>
          <Faq items={d.faq} />
        </section>
      )}

      <CtaBand title={`${d.title} ile hemen başlayın`} />
    </SiteShell>
  );
}
