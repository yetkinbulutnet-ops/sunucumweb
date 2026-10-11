'use client';

import { useEffect, useRef, useState } from 'react';

export default function IbanKopyala({ iban, etiket, tamam }) {
  const [oldu, setOldu] = useState(false);
  const zaman = useRef(null);
  useEffect(() => () => clearTimeout(zaman.current), []);

  const kopyala = async () => {
    const duz = iban.replace(/\s+/g, '');
    try {
      await navigator.clipboard.writeText(duz);
    } catch {
      const t = document.createElement('textarea');
      t.value = duz;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setOldu(true);
    clearTimeout(zaman.current);
    zaman.current = setTimeout(() => setOldu(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={kopyala}
      className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-bold transition-colors ${oldu ? 'bg-brand-700 text-white' : 'bg-surface text-strong ring-1 ring-line hover:text-brandtext hover:ring-brandline'}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        {oldu ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M9 9h10v11H9zM5 15H4V4h11v1" />}
      </svg>
      <span aria-live="polite">{oldu ? tamam : etiket}</span>
    </button>
  );
}
