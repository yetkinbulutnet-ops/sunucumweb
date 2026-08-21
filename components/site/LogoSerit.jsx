import LogoKutusu from './LogoKutusu';

function Sira({ liste, yon, sure }) {
  const kopya = [...liste, ...liste];

  return (
    <div className="group/serit relative overflow-hidden py-2">
      <div
        className={`flex w-max gap-4 group-hover/serit:[animation-play-state:paused] motion-reduce:[animation:none] ${
          yon === 'sag'
            ? 'animate-[seritSag_var(--sure)_linear_infinite]'
            : 'animate-[seritSol_var(--sure)_linear_infinite]'
        }`}
        style={{ '--sure': `${sure}s` }}
      >
        {kopya.map((m, i) => (
          <a
            key={`${m.ad}-${i}`}
            href={m.site}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-hidden={i >= liste.length ? 'true' : undefined}
            tabIndex={i >= liste.length ? -1 : undefined}
            title={`${m.ad} — siteyi aç`}
            className="shrink-0 rounded-2xl ring-1 ring-line transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,41,66,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <LogoKutusu marka={m} boyut="serit" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function LogoSerit({ liste }) {
  if (!liste.length) return null;

  const orta = Math.ceil(liste.length / 2);
  const ust = liste.slice(0, orta);
  const alt = liste.slice(orta);

  return (
    <div className="relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <Sira liste={ust} yon="sol" sure={Math.max(28, ust.length * 5)} />
      {alt.length > 0 && <Sira liste={alt} yon="sag" sure={Math.max(32, alt.length * 5.5)} />}
    </div>
  );
}
