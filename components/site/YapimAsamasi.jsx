import Link from 'next/link';
import { Icon, SiteShell } from './chrome';
import { metinAl } from '@/lib/cms';

const secenekler = (m) => [
  { t: m('yapim.secenek_yazilim_baslik'), d: m('yapim.secenek_yazilim_metin'), href: '/hazir-yazilim', icon: 'sparkles' },
  { t: m('yapim.secenek_alan_adi_baslik'), d: m('yapim.secenek_alan_adi_metin'), href: '/alan-adi', icon: 'globe' },
  { t: m('yapim.secenek_iletisim_baslik'), d: m('yapim.secenek_iletisim_metin'), href: '/iletisim', icon: 'chat' },
];

export default async function YapimAsamasi({ baslik: baslikProp, ozet }) {
  const m = await metinAl();
  const baslik = baslikProp ?? m('yapim.varsayilan_baslik');
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute -top-24 left-[-10%] h-[340px] w-[340px] rounded-full bg-brand-300/25 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>

        <div className="mx-auto max-w-3xl px-5 lg:px-8 py-20 lg:py-28 text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">{m('yapim.kirinti_ana_sayfa')}</Link>
            <span>/</span>
            <span className="font-medium text-strong/70">{baslik}</span>
          </div>

          <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-brandsoft text-brandtext ring-1 ring-brandline">
            <span aria-hidden className="absolute inset-0 rounded-3xl bg-brand-400/20 motion-safe:animate-ping" />
            <Icon name="wrench" className="relative h-9 w-9" />
          </span>

          <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-brandline bg-brandsoft/80 px-3.5 py-1.5 text-[13px] font-semibold text-brandtext">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {m('yapim.rozet')}
          </span>

          <h1 className="mt-5 tipo-dev font-extrabold tracking-tight text-strong text-balance">
            {m('yapim.baslik', { baslik })}
          </h1>
          <p className="mt-5 tipo-giris text-body">
            {ozet || m('yapim.aciklama')}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://my.sunucumweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
            >
              <Icon name="user" className="h-4 w-4" /> {m('yapim.musteri_paneli')}
            </a>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong ring-1 ring-line transition hover:ring-brandtext/50"
            >
              {m('yapim.bilgi_alin')} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('yapim.bu_arada')}</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">{m('yapim.aktif_hizmetler')}</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {secenekler(m).map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-20px_rgba(15,41,66,0.18)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-24px_rgba(20,184,166,0.35)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Icon name={s.icon} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-strong">{s.t}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-body">{s.d}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-brandtext">
                {m('yapim.incele')} <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
