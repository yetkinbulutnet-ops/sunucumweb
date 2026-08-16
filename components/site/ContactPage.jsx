'use client';
import { useState } from 'react';
import { Icon, SiteShell, PageHero } from './chrome';

const INFO = [
  { icon: 'phone', t: 'Telefon', v: '0(850) 302 5809', href: 'tel:08503025809' },
  { icon: 'mail', t: 'E-posta', v: 'destek@sunucumweb.com', href: 'mailto:destek@sunucumweb.com' },
  { icon: 'chat', t: 'Canlı Destek', v: '7/24 anlık yanıt', href: 'https://my.sunucumweb.com' },
  { icon: 'pin', t: 'Adres', v: 'Türkiye · Ofis adresinizi buraya girin', href: null },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <PageHero eyebrow="İletişim" title="Size nasıl yardımcı olabiliriz?" breadcrumb="İletişim"
        text="Sorularınız, teklif talepleriniz veya teknik destek için ekibimiz 7/24 yanınızda." />
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12">
          <div className="grid sm:grid-cols-2 gap-4 content-start">
            {INFO.map((c) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brandsoft text-brandtext group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icon name={c.icon} className="w-5 h-5" /></span>
                  <div className="mt-4 text-sm font-bold uppercase tracking-wider text-muted">{c.t}</div>
                  <div className="mt-1 text-[15px] font-semibold text-strong">{c.v}</div>
                </>
              );
              return c.href
                ? <a key={c.t} href={c.href} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] hover:-translate-y-1 transition-[transform,box-shadow,border-color,opacity]">{inner}</a>
                : <div key={c.t} className="group rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)]">{inner}</div>;
            })}
            <div className="sm:col-span-2 rounded-2xl bg-ink p-6 text-white">
              <div className="flex items-center gap-2 text-brand-300"><Icon name="clock" className="w-5 h-5" /><span className="text-sm font-bold uppercase tracking-wider">Çalışma Saatleri</span></div>
              <p className="mt-3 text-sm text-slate-300">Teknik destek <span className="font-semibold text-white">7/24 kesintisiz</span> hizmetinizdedir. Satış ekibimiz hafta içi 09:00–18:00 arası ulaşılabilir.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-7 sm:p-9 shadow-[0_30px_70px_-40px_rgba(15,41,66,0.4)]">
            <h2 className="text-2xl font-extrabold tracking-tight text-strong">Bize yazın</h2>
            <p className="mt-2 text-[15px] text-body">Formu doldurun, en kısa sürede size dönelim.</p>
            {sent ? (
              <div className="mt-8 rounded-2xl bg-brandsoft p-8 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-white"><Icon name="check" /></span>
                <p className="mt-4 font-semibold text-strong">Mesajınız alındı!</p>
                <p className="mt-1 text-sm text-body">En kısa sürede size geri döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-7 grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Ad Soyad" name="ad" placeholder="Adınız Soyadınız" />
                  <Field label="E-posta" name="email" type="email" placeholder="ornek@firma.com" />
                </div>
                <Field label="Konu" name="konu" placeholder="Mesaj konusu" />
                <label className="block">
                  <span className="text-sm font-semibold text-strong">Mesajınız</span>
                  <textarea required rows={5} placeholder="Nasıl yardımcı olabiliriz?" className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-strong placeholder:text-muted outline-none focus:border-brand-400 focus:ring-4 focus:ring-brandline/40 transition" />
                </label>
                <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition">Mesajı Gönder <Icon name="arrow" className="w-4 h-4" /></button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, name, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-strong">{label}</span>
      <input required type={type} name={name} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-strong placeholder:text-muted outline-none focus:border-brand-400 focus:ring-4 focus:ring-brandline/40 transition" />
    </label>
  );
}
