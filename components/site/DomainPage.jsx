'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import DomainAI from './DomainAI';

const TLDS = [
  ['.com', '299'], ['.com.tr', '149'], ['.net', '329'], ['.org', '319'],
  ['.xyz', '89'], ['.io', '899'], ['.dev', '449'], ['.co', '649'],
];
const STEPS = [
  { t: 'Alan adınızı girin', d: 'Taşımak istediğiniz alan adını sorgulayın ve uygunluğunu görün.' },
  { t: 'Transfer kodunu alın', d: 'Mevcut sağlayıcınızdan EPP/transfer kodunuzu temin edin.' },
  { t: 'Taşıma tamamlansın', d: 'Onay sonrası alan adınız güvenle SunucumWEB\'e taşınır.' },
];
const DFEATURES = [
  { icon: 'lock', t: 'Ücretsiz WHOIS Gizliliği', d: 'Kişisel bilgileriniz WHOIS sorgularında gizli kalır.' },
  { icon: 'gauge', t: 'Kolay DNS Yönetimi', d: 'Tüm DNS kayıtlarınızı sezgisel panelden yönetin.' },
  { icon: 'refresh', t: 'Otomatik Yenileme', d: 'Alan adınızı asla kaybetmeyin; otomatik yenileme ile güvende.' },
  { icon: 'headset', t: '7/24 Destek', d: 'Alan adı işlemlerinizde uzman ekibimiz her an yanınızda.' },
];

const COPY = {
  register: { eyebrow: 'Alan Adı', title: 'Mükemmel alan adını bulun', text: 'Markanıza en uygun alan adını saniyeler içinde sorgulayın ve hemen sahiplenin.', ph: 'firmaadi.com', btn: 'Sorgula' },
  transfer: { eyebrow: 'Alan Adı Transferi', title: 'Alan adınızı bize taşıyın', text: 'Mevcut alan adınızı kolayca SunucumWEB\'e taşıyın; üstelik 1 yıl uzatma hediye.', ph: 'taşınacakalanadi.com', btn: 'Taşımayı Başlat' },
  whois: { eyebrow: 'WHOIS Sorgu', title: 'Alan adı WHOIS sorgulama', text: 'Bir alan adının kayıtlı olup olmadığını ve tescil bilgilerini anında öğrenin.', ph: 'sorgulanacakalanadi.com', btn: 'WHOIS Sorgula' },
};

export default function DomainPage({ mode = 'register' }) {
  const c = COPY[mode];
  const [q, setQ] = useState('');
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full bg-brand-300/25 blur-[120px]" />
          <div className="absolute -top-20 left-[-10%] h-[360px] w-[360px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>
        <div className="mx-auto max-w-3xl px-5 lg:px-8 py-20 lg:py-24 text-center">
          <div className="mb-5 flex items-center justify-center gap-2 text-sm text-muted"><Link href="/" className="hover:text-brandtext">Ana Sayfa</Link><span>/</span><span className="font-medium text-strong/70">{c.eyebrow}</span></div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brandline bg-brandsoft/80 px-3.5 py-1.5 text-[13px] font-semibold text-brandtext"><Icon name="globe" className="w-4 h-4" /> {c.eyebrow}</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-strong text-balance">{c.title}</h1>
          <p className="mt-4 text-lg text-body">{c.text}</p>
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = 'https://my.sunucumweb.com'; }} className="mt-8">
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-[0_20px_50px_-25px_rgba(15,41,66,0.35)] focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100 transition">
              <span className="pl-3 text-muted"><Icon name="search" className="w-5 h-5" /></span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.ph} className="flex-1 bg-transparent py-2.5 text-[15px] text-strong placeholder:text-muted outline-none" />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-3 text-[15px] font-semibold text-white hover:bg-brand-600 transition-colors">{c.btn} <Icon name="arrow" className="w-4 h-4" /></button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] text-body">
            <span className="font-medium text-muted">Popüler:</span>
            {TLDS.slice(0, 5).map(([t, p]) => <span key={t}><span className="font-semibold text-strong/70">{t}</span> <span className="text-brandtext font-semibold">₺{p}</span></span>)}
          </div>
        </div>
      </section>

      {mode === 'register' && <DomainAI />}

      {mode !== 'whois' && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Fiyatlar</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-strong">Popüler uzantı fiyatları</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TLDS.map(([t, p]) => (
              <div key={t} className="rounded-2xl border border-line bg-surface p-6 text-center shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] hover:-translate-y-1 hover:border-brandline transition-[transform,box-shadow,border-color,opacity]">
                <div className="text-2xl font-extrabold text-strong">{t}</div>
                <div className="mt-2 text-brandtext font-bold">₺{p}<span className="text-sm font-medium text-muted">/yıl</span></div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">* Fiyatlar temsilîdir; güncel uzantı fiyatlarını buraya girebilirsiniz.</p>
        </section>
      )}

      {mode === 'transfer' && (
        <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Nasıl Çalışır</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-strong">3 adımda transfer</h2></div>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <div key={i} className="relative rounded-2xl border border-line bg-surface p-7 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white font-extrabold">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-strong">{s.t}</h3>
                <p className="mt-2 text-[15px] text-body">{s.d}</p>
              </div>
            ))}
          </div>
        </div></section>
      )}

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DFEATURES.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)] hover:-translate-y-1 transition-[transform,box-shadow,border-color,opacity]"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icon name={f.icon} /></span><h3 className="mt-4 text-[17px] font-bold text-strong">{f.t}</h3><p className="mt-2 text-sm leading-relaxed text-body">{f.d}</p></div>))}
        </div>
      </section>

      <CtaBand title="Dijital kimliğinizi bugün oluşturun" text="Alan adınızı alın, hosting ile birleştirin; markanız internette parlasın." />
    </SiteShell>
  );
}
