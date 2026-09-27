'use client';
import LogoSerit from './LogoSerit';
import { useSiteAyarlari } from './SiteAyarlari';

export default function AltyapiSerit() {
  const { altyapi } = useSiteAyarlari();
  if (!altyapi.liste.length) return null;

  return (
    <section className="border-t border-line bg-surface2/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
        <h2 className="mb-6 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-muted">
          {altyapi.baslik}
        </h2>
        <LogoSerit liste={altyapi.liste} boyut="altyapi" tekSira />
      </div>
    </section>
  );
}
