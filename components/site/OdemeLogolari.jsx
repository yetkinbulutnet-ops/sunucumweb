function Visa() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full" aria-hidden>
      <text x="24" y="22" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic" fill="#1A1F71" letterSpacing="0.5">VISA</text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full" aria-hidden>
      <circle cx="19" cy="16" r="9.5" fill="#EB001B" />
      <circle cx="29" cy="16" r="9.5" fill="#F79E1B" />
      <path d="M24 8.7a9.5 9.5 0 0 0 0 14.6 9.5 9.5 0 0 0 0-14.6z" fill="#FF5F00" />
    </svg>
  );
}

function Troy() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full" aria-hidden>
      <text x="23" y="21" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="700" fill="#00A0DF">troy</text>
      <path d="M38 11c3 1.6 3 8.4 0 10" stroke="#E30613" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M41.5 9c4 2.4 4 11.6 0 14" stroke="#E30613" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function Amex() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full" aria-hidden>
      <rect x="2" y="4" width="44" height="24" rx="3" fill="#2E77BC" />
      <text x="24" y="15" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="7" fontWeight="700" fill="#fff" letterSpacing="0.3">AMERICAN</text>
      <text x="24" y="23" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="7" fontWeight="700" fill="#fff" letterSpacing="0.3">EXPRESS</text>
    </svg>
  );
}

function Discover() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full" aria-hidden>
      <text x="21" y="21" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fontWeight="700" fill="#1A1A1A">DISCOVER</text>
      <circle cx="41" cy="17" r="5.5" fill="#F76B1C" />
    </svg>
  );
}

export const ODEME = [
  { ad: 'Visa', Logo: Visa },
  { ad: 'Mastercard', Logo: Mastercard },
  { ad: 'Troy', Logo: Troy },
  { ad: 'American Express', Logo: Amex },
  { ad: 'Discover', Logo: Discover },
];

export default function OdemeLogolari({ className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {ODEME.map(({ ad, Logo }) => (
        <li
          key={ad}
          title={ad}
          className="grid h-8 w-[52px] place-items-center rounded-md bg-white px-1.5 ring-1 ring-black/10"
        >
          <span className="sr-only">{ad}</span>
          <Logo />
        </li>
      ))}
    </ul>
  );
}
