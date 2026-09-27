import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import TurnstileGecis from './TurnstileGecis';
import { refUret, istemciIp } from '@/lib/guvenlik';
import { metinAl } from '@/lib/cms';
import SayfaMetni from '@/components/site/SayfaMetni';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const m = await metinAl();
  return {
    title: m('guvenlik.baslik'),
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function GuvenlikSayfasi({ searchParams }) {
  const h = await headers();
  const baslikIp = istemciIp((n) => h.get(n));

  const sp = (await searchParams) || {};
  if (typeof sp.refid !== 'string' || typeof sp.ip !== 'string') {
    const refid = typeof sp.refid === 'string' ? sp.refid : refUret();
    redirect(`/guvenlik?refid=${refid}&ip=${encodeURIComponent(baslikIp || 'bilinmiyor')}`);
  }

  const m = await metinAl();
  const refid = sp.refid;
  const urlIp = sp.ip;
  const ip = baslikIp || (urlIp && urlIp !== 'bilinmiyor' ? urlIp : m('guvenlik.ip_tespit_edilemedi'));
  const hata = sp.hata === '1';

  return (
    <SayfaMetni onekler={['guvenlik']}>
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
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brandsoft text-brandtext ring-1 ring-brandline">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2.2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-center text-[22px] font-bold leading-tight text-strong">{m('guvenlik.baslik')}</h1>
          <p className="mx-auto mt-2.5 max-w-[330px] text-center text-[14px] leading-relaxed text-body">
            {m('guvenlik.aciklama')}
          </p>

          {hata && (
            <p className="mt-4 rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-center text-[13px] font-medium text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300">
              {m('guvenlik.hata')}
            </p>
          )}

          <div className="mt-6">
            <TurnstileGecis />
          </div>

          <ErisimBilgi m={m} ip={ip} refid={refid} />
        </div>

        <p className="mt-5 text-center text-[12px] text-muted">
          {m('guvenlik.alt_bilgi')}
        </p>
      </div>
    </main>
    </SayfaMetni>
  );
}

function ErisimBilgi({ m, ip, refid }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-line bg-page/70">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[12px] font-medium text-muted">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
          </svg>
          {m('guvenlik.ip_adresi')}
        </span>
        <span className="font-mono text-[13px] font-medium text-strong">{ip}</span>
      </div>
      <div className="h-px bg-line" />
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[12px] font-medium text-muted">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V5a1 1 0 0 1 1-1h2M4 17v2a1 1 0 0 0 1 1h2M20 7V5a1 1 0 0 0-1-1h-2M20 17v2a1 1 0 0 1-1 1h-2" /><path d="M8 12h8" />
          </svg>
          {m('guvenlik.referans_no')}
        </span>
        <span className="font-mono text-[13px] font-medium text-strong">{refid}</span>
      </div>
    </div>
  );
}
