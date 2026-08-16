export const ODEME = [
  { ad: 'Visa', dosya: '/img/odeme/visa.webp' },
  { ad: 'Mastercard', dosya: '/img/odeme/mastercard.webp' },
  { ad: 'Troy', dosya: '/img/odeme/troy.webp' },
  { ad: 'American Express', dosya: '/img/odeme/amex.webp' },
  { ad: 'Discover', dosya: '/img/odeme/discover.webp' },
];

export default function OdemeLogolari({ className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {ODEME.map(({ ad, dosya }) => (
        <li key={ad}>
          <img
            src={dosya}
            alt={ad}
            title={ad}
            width={512}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-9 w-auto opacity-90 transition-opacity hover:opacity-100"
          />
        </li>
      ))}
    </ul>
  );
}
