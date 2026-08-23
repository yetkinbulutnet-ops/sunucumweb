'use client';
import Link from 'next/link';

export default function Error({ reset }) {
  return (
    <div className="grid min-h-ekran place-items-center bg-page px-5 py-20 text-center">
      <div className="max-w-md">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Bir şeyler ters gitti</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">Beklenmeyen bir hata oluştu</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">
          Sorun geçici olabilir. Sayfayı yenilemeyi deneyin ya da ana sayfaya dönün. Sürerse bize ulaşın.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-600"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-surface2 px-5 py-3 text-[15px] font-semibold text-strong ring-1 ring-line transition-colors hover:bg-surface"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}
