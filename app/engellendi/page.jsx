import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { refUret, istemciIp } from '@/lib/guvenlik';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Erişim Engellendi',
  robots: { index: false, follow: false, nocache: true },
};

export default async function EngellendiSayfasi({ searchParams }) {
  const h = await headers();
  const baslikIp = istemciIp((n) => h.get(n));

  const sp = (await searchParams) || {};
  if (typeof sp.refid !== 'string' || typeof sp.ip !== 'string') {
    const refid = typeof sp.refid === 'string' ? sp.refid : refUret();
    redirect(`/engellendi?refid=${refid}&ip=${encodeURIComponent(baslikIp || 'bilinmiyor')}`);
  }

  const refid = sp.refid;
  const urlIp = sp.ip;
  const ip = baslikIp || (urlIp && urlIp !== 'bilinmiyor' ? urlIp : 'Tespit edilemedi');

  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-page px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--c-grid)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-grid)) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(circle at 50% 30%, black, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black, transparent 78%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[430px]">
        <div className="mb-7 flex justify-center">
          <img src="/icon/logo.png" alt="SunucumWEB" className="h-9 w-auto object-contain dark:brightness-0 dark:invert" />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-500/25">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" />
            </svg>
          </div>

          <h1 className="text-center text-[22px] font-bold leading-tight text-strong">Erişiminiz Engellendi</h1>
          <p className="mx-auto mt-2.5 max-w-[340px] text-center text-[14px] leading-relaxed text-body">
            Bağlantınız güvenlik politikalarımız gereği engellenmiştir. Bunun bir hata
            olduğunu düşünüyorsanız aşağıdaki bilgilerle bize ulaşın.
          </p>

          <a
            href="mailto:destek@sunucumweb.com"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-page px-5 py-3 text-[14px] font-semibold text-strong transition-colors hover:border-brandline hover:text-brandtext"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
            </svg>
            destek@sunucumweb.com
          </a>

          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-page/70">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-[12px] font-medium text-muted">IP Adresi</span>
              <span className="font-mono text-[13px] font-medium text-strong">{ip}</span>
            </div>
            <div className="h-px bg-line" />
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-[12px] font-medium text-muted">Referans No</span>
              <span className="font-mono text-[13px] font-medium text-strong">{refid}</span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] text-muted">
          © SunucumWEB Bilişim Teknolojileri · Güvenli Erişim Kontrolü
        </p>
      </div>
    </main>
  );
}
