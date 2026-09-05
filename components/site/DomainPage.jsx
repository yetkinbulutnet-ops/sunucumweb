'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell } from './chrome';
import Sema from './Sema';
import { sssSemasi, ekmekKirintisi } from '@/lib/semalar';
import DomainAI from './DomainAI';

const TLDS = [
  ['.com', '719'], ['.com.tr', '119'], ['.net', '889'], ['.org', '539'],
  ['.tr', '209'], ['.xyz', '129'], ['.io', '2829'], ['.dev', '1289'],
  ['.co', '1229'], ['.info', '289'], ['.biz', '1479'], ['.online', '129'],
];

const STEPS = {
  register: [
    { t: 'Alan adını sorgulayın', d: 'İstediğiniz ismi yazın, uygun uzantıları anında görün.' },
    { t: 'Uzantıyı seçin', d: 'Size en uygun uzantıyı ve süreyi belirleyip sepete ekleyin.' },
    { t: 'Dakikalar içinde yayında', d: 'Ödeme sonrası alan adınız anında aktifleşir, panelden yönetirsiniz.' },
  ],
  transfer: [
    { t: 'Alan adınızı girin', d: 'Taşımak istediğiniz alan adını sorgulayın ve uygunluğunu görün.' },
    { t: 'Transfer kodunu alın', d: 'Mevcut sağlayıcınızdan EPP/transfer kodunuzu temin edin.' },
    { t: 'Taşıma tamamlansın', d: 'Onay sonrası alan adınız güvenle SunucumWEB\'e taşınır, 1 yıl uzatma hediye.' },
  ],
};

const DFEATURES = [
  { icon: 'lock', t: 'Ücretsiz WHOIS Gizliliği', d: 'Kişisel bilgileriniz WHOIS sorgularında gizli kalır, spam ve dolandırıcılıktan korunursunuz.' },
  { icon: 'gauge', t: 'Kolay DNS Yönetimi', d: 'A, CNAME, MX, TXT ve tüm kayıtlarınızı sezgisel panelden saniyeler içinde düzenleyin.' },
  { icon: 'refresh', t: 'Otomatik Yenileme', d: 'Alan adınızı asla kaybetmeyin; otomatik yenileme ve bitiş uyarılarıyla güvende kalın.' },
  { icon: 'headset', t: '7/24 Uzman Destek', d: 'Alan adı ve DNS işlemlerinizde uzman ekibimiz her an yanınızda.' },
];

const SSS = {
  register: [
    { q: 'Alan adı ne kadar sürede aktif olur?', a: 'Ödeme onaylandıktan sonra çoğu uzantı birkaç dakika içinde aktifleşir. .tr uzantılarında kurum onayı gerektiğinde süreç biraz uzayabilir.' },
    { q: 'WHOIS gizliliği ücretsiz mi?', a: 'Evet, destekleyen tüm uzantılarda WHOIS gizliliğini ücretsiz sunuyoruz; kişisel bilgileriniz sorgularda görünmez.' },
    { q: 'Sadece alan adı, hosting almadan alabilir miyim?', a: 'Elbette. Alan adını tek başına alabilir, DNS yönetimini ücretsiz panelimizden yapabilirsiniz.' },
    { q: 'Alan adımı sonradan taşıyabilir miyim?', a: 'Alan adı size aittir. Dilediğiniz zaman EPP/transfer kodunuzu alıp başka bir sağlayıcıya taşıyabilirsiniz.' },
  ],
  transfer: [
    { q: 'Transfer sırasında sitem kapanır mı?', a: 'Hayır. DNS kayıtlarınız korunduğu sürece siteniz ve e-postalarınız kesintisiz çalışmaya devam eder.' },
    { q: 'Transfer ne kadar sürer?', a: 'Onay sonrası çoğu uzantıda 1-5 gün içinde tamamlanır; süreç boyunca sizi bilgilendiririz.' },
    { q: 'Transfer ücretli mi?', a: 'Çoğu uzantıda transfer işlemi alan adınıza 1 yıl uzatma ekler; bir yıllık yenileme bedeliyle hem taşır hem süre kazanırsınız.' },
    { q: 'EPP/transfer kodunu nereden alırım?', a: 'Mevcut sağlayıcınızın panelinden talep edebilirsiniz. Takıldığınız yerde destek ekibimiz adım adım yardımcı olur.' },
  ],
};

const COPY = {
  register: {
    eyebrow: 'Alan Adı Tescil', title: 'Mükemmel alan adını bulun',
    text: 'Markanıza en uygun alan adını saniyeler içinde sorgulayın ve hemen sahiplenin.',
    ph: 'firmaadi.com', btn: 'Sorgula',
    trust: ['Ücretsiz WHOIS gizliliği', 'Anında aktivasyon', 'Kolay DNS yönetimi'],
    stepBaslik: '3 adımda alan adınız',
  },
  transfer: {
    eyebrow: 'Alan Adı Transferi', title: 'Alan adınızı bize taşıyın',
    text: 'Mevcut alan adınızı kolayca SunucumWEB\'e taşıyın; üstelik çoğu uzantıda 1 yıl uzatma hediye.',
    ph: 'taşınacakalanadi.com', btn: 'Taşımayı Başlat',
    trust: ['1 yıl uzatma hediye', 'Kesintisiz taşıma', 'Ücretsiz taşıma desteği'],
    stepBaslik: '3 adımda transfer',
  },
};

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

const SONUC = [
  { ad: 'markaniz', uz: '.com', durum: 'uygun', fiyat: '719' },
  { ad: 'markaniz', uz: '.com.tr', durum: 'uygun', fiyat: '119' },
  { ad: 'markaniz', uz: '.net', durum: 'uygun', fiyat: '889' },
  { ad: 'markaniz', uz: '.io', durum: 'alinmis' },
];

const TRANSFER_ADIM = [
  { t: 'Alan adı doğrulandı', durum: 'ok' },
  { t: 'EPP / transfer kodu alındı', durum: 'ok' },
  { t: 'Transfer başlatıldı', durum: 'aktif' },
  { t: 'Yeni panelde yönetim', durum: 'bekliyor' },
];

function SonucKart() {
  return (
    <div className="relative animate-[fadeup_0.8s_ease-out]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-400/20 opacity-70 blur-[70px]" />
      <div className="overflow-hidden rounded-3xl border border-line/80 bg-surface shadow-[0_40px_90px_-40px_rgba(15,41,66,0.5)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3.5">
          <Icon name="search" className="h-4 w-4 shrink-0 text-brandtext" />
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-strong">markaniz</span>
          <span className="rounded-lg bg-brand-500 px-2.5 py-1 text-[12px] font-bold text-white">Sorgula</span>
        </div>
        <ul className="divide-y divide-line">
          {SONUC.map((s) => {
            const uygun = s.durum === 'uygun';
            return (
              <li key={s.ad + s.uz} className="flex items-center gap-3 px-4 py-3.5">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${uygun ? 'bg-emerald-500/15 text-emerald-500' : 'bg-line text-muted'}`}>
                  <Icon name={uygun ? 'check' : 'xmark'} className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[14.5px] text-body"><span className="font-semibold text-strong">{s.ad}</span>{s.uz}</span>
                {uygun ? (
                  <span className="shrink-0 text-[14px] font-bold text-brandtext">₺{s.fiyat}</span>
                ) : (
                  <span className="shrink-0 text-[12px] font-semibold text-muted">Alınmış</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute -bottom-4 -left-2 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite] sm:-left-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name="lock" className="h-5 w-5" /></span>
        <div><div className="text-[13px] font-extrabold leading-none text-strong">Ücretsiz</div><div className="mt-1 text-[11px] text-muted">WHOIS gizliliği</div></div>
      </div>
    </div>
  );
}

function TransferKart() {
  return (
    <div className="relative animate-[fadeup_0.8s_ease-out]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-400/20 opacity-70 blur-[70px]" />
      <div className="overflow-hidden rounded-3xl border border-line/80 bg-surface shadow-[0_40px_90px_-40px_rgba(15,41,66,0.5)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3.5">
          <Icon name="refresh" className="h-4 w-4 shrink-0 text-brandtext" />
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-strong">taşınacaksite.com</span>
          <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-500 ring-1 ring-emerald-500/30">+1 yıl</span>
        </div>
        <ul className="p-2">
          {TRANSFER_ADIM.map((a) => {
            const bitti = a.durum === 'ok', aktif = a.durum === 'aktif';
            return (
              <li key={a.t} className="flex items-center gap-3 rounded-xl px-3 py-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${bitti ? 'bg-emerald-500/15 text-emerald-500' : aktif ? 'bg-brand-500 text-white' : 'bg-surface2 text-muted ring-1 ring-line'}`}>
                  {bitti ? <Icon name="check" className="h-3.5 w-3.5" /> : aktif ? <Icon name="refresh" className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                <span className={`min-w-0 flex-1 text-[14.5px] ${bitti || aktif ? 'font-semibold text-strong' : 'text-muted'}`}>{a.t}</span>
                {aktif && <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-brandtext">Sürüyor</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute -bottom-4 -left-2 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl shadow-ink/10 animate-[float_6s_ease-in-out_infinite] sm:-left-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext"><Icon name="shield" className="h-5 w-5" /></span>
        <div><div className="text-[13px] font-extrabold leading-none text-strong">Kesintisiz</div><div className="mt-1 text-[11px] text-muted">Siteniz açık kalır</div></div>
      </div>
    </div>
  );
}

export default function DomainPage({ mode = 'register' }) {
  const c = COPY[mode] || COPY.register;
  const [q, setQ] = useState('');
  return (
    <SiteShell>
      <Sema veri={[
        sssSemasi(SSS[mode]),
        ekmekKirintisi([{ ad: 'Ana Sayfa', yol: '/' }, { ad: c.eyebrow, yol: mode === 'transfer' ? '/transfer' : '/alan-adi' }]),
      ]} />
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full bg-brand-300/25 blur-[120px]" />
          <div className="absolute -top-20 left-[-10%] h-[360px] w-[360px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-2 text-sm text-muted"><Link href="/" className="hover:text-brandtext">Ana Sayfa</Link><span>/</span><span className="font-medium text-strong/70">{c.eyebrow}</span></div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brandline bg-brandsoft/80 px-3.5 py-1.5 text-[13px] font-semibold text-brandtext"><Icon name="globe" className="h-4 w-4" /> {c.eyebrow}</span>
              <h1 className="mt-5 tipo-dev font-extrabold tracking-tight text-strong text-balance">{c.title}</h1>
              <p className="mt-4 max-w-xl tipo-giris text-body">{c.text}</p>
              <form onSubmit={(e) => { e.preventDefault(); const d = q.trim(); if (!d) return; window.location.href = `https://my.sunucumweb.com/domain/${mode === 'transfer' ? 'transfer' : 'register'}?domain=${encodeURIComponent(d)}`; }} className="mt-8">
                <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-[0_20px_50px_-25px_rgba(15,41,66,0.35)] transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
                  <span className="pl-3 text-muted"><Icon name="search" className="h-5 w-5" /></span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.ph} aria-label="Alan adı" className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-strong outline-none placeholder:text-muted" />
                  <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-600 sm:px-5 sm:text-[15px]">{c.btn} <Icon name="arrow" className="h-4 w-4" /></button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-body">
                <span className="font-medium text-muted">Popüler:</span>
                {TLDS.slice(0, 5).map(([t, p]) => <span key={t}><span className="font-semibold text-strong/70">{t}</span> <span className="font-semibold text-brandtext">₺{p}</span></span>)}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-body">
                {c.trust.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-brandtext" /> {t}</span>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              {mode === 'transfer' ? <TransferKart /> : <SonucKart />}
            </div>
          </div>
        </div>
      </section>

      {mode === 'register' && <DomainAI />}

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Fiyatlar</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Popüler uzantı fiyatları</h2>
          <p className="mt-3 text-body">Aradığınız uzantı listede yoksa yüzlerce uzantı için panelden anında sorgulayabilirsiniz.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TLDS.map(([t, p]) => (
            <div key={t} className="flex flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline">
              <div className="text-2xl font-extrabold text-strong">{t}</div>
              <div className="mt-2 font-bold text-brandtext">₺{p}<span className="text-sm font-medium text-muted">/yıl</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Nasıl Çalışır</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{c.stepBaslik}</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS[mode].map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-line bg-surface p-7 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white font-extrabold">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold text-strong">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{s.d}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Avantajlar</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Alan adınız güvende ve yönetimi kolay</h2></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DFEATURES.map((f) => (<div key={f.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)] transition-[transform,box-shadow,border-color,opacity] hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white"><Icon name={f.icon} /></span><h3 className="mt-4 text-[17px] font-bold text-strong">{f.t}</h3><p className="mt-2 text-sm leading-relaxed text-body">{f.d}</p></div>))}
        </div>
      </section>

      <section className="bg-surface2 border-y border-line"><div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">SSS</span><h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Sık sorulan sorular</h2></div>
        <Faq items={SSS[mode]} />
      </div></section>

      <CtaBand title="Dijital kimliğinizi bugün oluşturun" text="Alan adınızı alın, hosting ile birleştirin; markanız internette parlasın." />
    </SiteShell>
  );
}
