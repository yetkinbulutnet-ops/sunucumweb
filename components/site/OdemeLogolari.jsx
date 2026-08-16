export const ODEME = [
  { ad: 'Visa', dosya: '/img/odeme/visa.webp' },
  { ad: 'Mastercard', dosya: '/img/odeme/mastercard.webp' },
  { ad: 'Troy', dosya: '/img/odeme/troy.webp' },
  { ad: 'American Express', dosya: '/img/odeme/amex.webp' },
  { ad: 'Discover', dosya: '/img/odeme/discover.webp' },
];

export default function OdemeLogolari({ className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {ODEME.map(({ ad, dosya }) => (
        <li
          key={ad}
          title={ad}
          className="grid h-[26px] w-[40px] place-items-center rounded-[5px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] ring-1 ring-black/10"
        >
          <img
            src={dosya}
            alt={ad}
            width={512}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-[18px] w-auto max-w-[32px] object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
