import LogoKutusu from './LogoKutusu';

function Oge({ marka, boyut, gizli }) {
  const govde = <LogoKutusu marka={marka} boyut={boyut} />;
  const ortak =
    'shrink-0 rounded-2xl ring-1 ring-line transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,41,66,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

  if (!marka.site) return <div className="shrink-0 rounded-2xl ring-1 ring-line">{govde}</div>;

  return (
    <a
      href={marka.site}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-hidden={gizli ? 'true' : undefined}
      tabIndex={gizli ? -1 : undefined}
      title={`${marka.ad} — siteyi aç`}
      className={ortak}
    >
      {govde}
    </a>
  );
}

function Sira({ liste, yon, sure, boyut }) {
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
          <Oge key={`${m.ad}-${i}`} marka={m} boyut={boyut} gizli={i >= liste.length} />
        ))}
      </div>
    </div>
  );
}

export default function LogoSerit({ liste, boyut = 'serit', tekSira = false }) {
  if (!liste?.length) return null;

  const maske = 'relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]';

  if (tekSira || liste.length < 6) {
    return (
      <div className={maske}>
        <Sira liste={liste} yon="sol" sure={Math.max(26, liste.length * 5)} boyut={boyut} />
      </div>
    );
  }

  const orta = Math.ceil(liste.length / 2);

  return (
    <div className={maske}>
      <Sira liste={liste.slice(0, orta)} yon="sol" sure={Math.max(28, orta * 5)} boyut={boyut} />
      <Sira liste={liste.slice(orta)} yon="sag" sure={Math.max(32, (liste.length - orta) * 5.5)} boyut={boyut} />
    </div>
  );
}
