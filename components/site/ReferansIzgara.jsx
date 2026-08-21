'use client';
import { useMemo, useState } from 'react';
import { Icon } from './chrome';
import LogoKutusu from './LogoKutusu';

const alanAdi = (adres) =>
  String(adres || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

export default function ReferansIzgara({ musteriler, sektorler }) {
  const [secili, setSecili] = useState('tumu');

  const kullanilan = useMemo(
    () => sektorler.filter((s) => musteriler.some((m) => m.sektor === s.id)),
    [musteriler, sektorler],
  );

  const gosterilen = useMemo(
    () => (secili === 'tumu' ? musteriler : musteriler.filter((m) => m.sektor === secili)),
    [musteriler, secili],
  );

  return (
    <div>
      {kullanilan.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {[{ id: 'tumu', ad: 'Tümü' }, ...kullanilan].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSecili(s.id)}
              aria-pressed={secili === s.id}
              className={`rounded-lg px-3.5 py-2 text-[13px] font-bold transition-colors ${
                secili === s.id ? 'bg-brand-500 text-white' : 'bg-surface2 text-body hover:bg-brandsoft hover:text-brandtext'
              }`}
            >
              {s.ad}
              <span className={`ml-1.5 tabular-nums ${secili === s.id ? 'text-white/70' : 'text-muted'}`}>
                {s.id === 'tumu' ? musteriler.length : musteriler.filter((m) => m.sektor === s.id).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gosterilen.map((m) => (
          <li key={m.ad}>
            <a
              href={m.site}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-30px_rgba(20,184,166,0.4)]"
            >
              <LogoKutusu marka={m} boyut="izgara" />

              <div className="mt-4 flex flex-1 items-start justify-between gap-3 px-1">
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-strong">{m.ad}</span>
                  <span className="mt-0.5 block truncate text-[13px] text-muted">{alanAdi(m.site)}</span>
                  {m.not && <span className="mt-1.5 block text-[13px] leading-relaxed text-body">{m.not}</span>}
                </span>
                <span className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-brandtext">
                  <Icon name="arrow" className="h-4 w-4 -rotate-45 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
