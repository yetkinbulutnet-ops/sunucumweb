import Link from 'next/link';
import { SiteShell, Icon } from '@/components/site/chrome';
import { metinAl } from '@/lib/cms';

export default async function NotFound() {
  const m = await metinAl();
  return (
    <SiteShell>
      <main className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"><div className="absolute -top-24 right-[-8%] h-96 w-96 rounded-full bg-brand-200/40 blur-[120px]" /></div>
        <div className="mx-auto max-w-2xl px-5 py-28 text-center">
          <div className="text-[7rem] font-extrabold leading-none text-brand-500">404</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{m('hata.bulunamadi_baslik')}</h1>
          <p className="mt-4 text-lg text-slate-600">{m('hata.bulunamadi_metin')}</p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-800 transition">
            <Icon name="arrow" className="w-4 h-4 rotate-180" /> {m('hata.ana_sayfaya_don')}
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
