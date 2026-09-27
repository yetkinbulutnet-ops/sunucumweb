import { m } from '@/lib/metin';

const BOYUT = {
  serit: { kutu: 'h-[76px] w-[188px]', gorsel: 'max-h-9 max-w-[136px]', harf: 'text-xl' },
  izgara: { kutu: 'h-[92px] w-full', gorsel: 'max-h-11 max-w-[168px]', harf: 'text-2xl' },
  ortak: { kutu: 'h-[72px] w-full', gorsel: 'max-h-8 max-w-[128px]', harf: 'text-lg' },
  altyapi: { kutu: 'h-[62px] w-[152px]', gorsel: 'max-h-7 max-w-[110px]', harf: 'text-base' },
};

const basHarfler = (ad) =>
  String(ad || '')
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toLocaleUpperCase('tr-TR');

export default function LogoKutusu({ marka, boyut = 'izgara' }) {
  const o = BOYUT[boyut] || BOYUT.izgara;

  return (
    <div className={`grid ${o.kutu} place-items-center rounded-2xl bg-white px-5`}>
      {marka.logo ? (
        <img
          src={marka.logo}
          alt={m('genel.logo_alt', { ad: marka.ad })}
          width={marka.g || 168}
          height={marka.y || 44}
          loading="lazy"
          decoding="async"
          className={`${o.gorsel} h-auto w-auto object-contain`}
        />
      ) : (
        <span className="flex items-center gap-2.5">
          <span className={`grid h-9 w-9 place-items-center rounded-xl bg-brand-500 ${o.harf} font-extrabold leading-none text-white`}>
            {basHarfler(marka.ad)}
          </span>
          <span className="max-w-[112px] truncate text-[14px] font-bold text-ink-700">{marka.ad}</span>
        </span>
      )}
    </div>
  );
}
