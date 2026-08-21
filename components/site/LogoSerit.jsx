import LogoKutusu from './LogoKutusu';

const KUTU_GENISLIGI = { serit: 204, izgara: 316, ortak: 316, altyapi: 168 };
const EN_AZ_GENISLIK = 1800;

function doldur(liste, birim) {
  const tekrar = Math.max(1, Math.ceil(EN_AZ_GENISLIK / (liste.length * birim)));
  return Array.from({ length: tekrar }, () => liste).flat();
}

function Oge({ marka, boyut, gizli }) {
  const govde = <LogoKutusu marka={marka} boyut={boyut} />;

  if (!marka.site) {
    return (
      <div className="shrink-0 rounded-2xl ring-1 ring-line" aria-hidden={gizli ? 'true' : undefined}>
        {govde}
      </div>
    );
  }

  return (
    <a
      href={marka.site}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-hidden={gizli ? 'true' : undefined}
      tabIndex={gizli ? -1 : undefined}
      title={`${marka.ad} — siteyi aç`}
      className="shrink-0 rounded-2xl ring-1 ring-line transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,41,66,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      {govde}
    </a>
  );
}

function Sira({ liste, yon, boyut, birim }) {
  const taban = doldur(liste, birim);
  const kopya = [...taban, ...taban];
  const sure = Math.max(22, Math.round((taban.length * birim) / 45));

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

  const birim = KUTU_GENISLIGI[boyut] ?? 204;
  const maske = 'relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]';
  const ikiSiraSigar = liste.length * birim >= EN_AZ_GENISLIK * 2;

  if (tekSira || !ikiSiraSigar) {
    return (
      <div className={maske}>
        <Sira liste={liste} yon="sol" boyut={boyut} birim={birim} />
      </div>
    );
  }

  const orta = Math.ceil(liste.length / 2);

  return (
    <div className={maske}>
      <Sira liste={liste.slice(0, orta)} yon="sol" boyut={boyut} birim={birim} />
      <Sira liste={liste.slice(orta)} yon="sag" boyut={boyut} birim={birim} />
    </div>
  );
}
