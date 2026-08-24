import { headers } from 'next/headers';
import TurnstileGecis from './TurnstileGecis';
import { yeniKimlik } from '@/lib/guvenlik';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Güvenlik Kontrolü',
  robots: { index: false, follow: false, nocache: true },
};

export default async function GuvenlikSayfasi({ searchParams }) {
  const h = await headers();
  const ip =
    h.get('cf-connecting-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'bilinmiyor';
  const ray = (h.get('cf-ray') || '').split('-')[0];
  const kimlik = ray || yeniKimlik();

  const sp = (await searchParams) || {};
  const devamRaw = typeof sp.devam === 'string' ? sp.devam : '/';
  const devam = devamRaw.startsWith('/') && !devamRaw.startsWith('//') ? devamRaw : '/';
  const hata = sp.hata === '1';

  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-page px-4 py-10">
      {/* arka plan izgara dokusu (siteyle uyumlu) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--c-grid)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-grid)) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(circle at 50% 35%, black, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 35%, black, transparent 78%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* marka */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/25">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 5v6c0 5 3.4 8.3 8 11 4.6-2.7 8-6 8-11V5l-8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <span className="text-[19px] font-extrabold tracking-tight text-strong">
            Sunucum<span className="text-brand-500">WEB</span>
          </span>
        </div>

        {/* kart */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brandsoft text-brandtext">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-center text-[22px] font-bold leading-tight text-strong">
            Güvenlik Kontrolü
          </h1>
          <p className="mx-auto mt-3 max-w-[360px] text-center text-[14.5px] leading-relaxed text-body">
            Bağlantınız otomatik (bot / veri merkezi) trafiği olarak işaretlendi.
            Devam etmek için lütfen aşağıdaki hızlı doğrulamayı tamamlayın —
            bu genelde <strong className="font-semibold text-strong">bir kez</strong> gerekir.
          </p>

          {hata && (
            <p className="mt-4 rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-center text-[13px] font-medium text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300">
              Doğrulama tamamlanamadı. Lütfen tekrar deneyin.
            </p>
          )}

          <div className="mt-6">
            <TurnstileGecis devam={devam} />
          </div>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-muted">
            Bu adım hem sizi hem sitemizi kötüye kullanımdan korur.
            Doğrulama tamamen tarayıcınızda gerçekleşir.
          </p>
        </div>

        {/* kişiye özel alt bilgi: IP + kimlik */}
        <div className="mt-5 flex flex-col items-center gap-1 text-center text-[12px] text-muted">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono">
            <span>IP: <span className="text-body">{ip}</span></span>
            <span aria-hidden className="hidden sm:inline text-line">•</span>
            <span>Kimlik: <span className="text-body">{kimlik}</span></span>
          </div>
          <span className="text-muted">SunucumWEB · Güvenli Erişim Kontrolü</span>
        </div>
      </div>
    </main>
  );
}
