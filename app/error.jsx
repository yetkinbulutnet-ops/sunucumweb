'use client';
import Link from 'next/link';
import { m } from '@/lib/metin';

export default function Error({ reset }) {
  return (
    <div className="grid min-h-ekran place-items-center bg-page px-5 py-20 text-center">
      <div className="max-w-md">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{m('hata.eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">{m('hata.baslik')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">
          {m('hata.metin')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-600"
          >
            {m('hata.tekrar_dene')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-surface2 px-5 py-3 text-[15px] font-semibold text-strong ring-1 ring-line transition-colors hover:bg-surface"
          >
            {m('hata.ana_sayfaya_don_kucuk')}
          </Link>
        </div>
      </div>
    </div>
  );
}
