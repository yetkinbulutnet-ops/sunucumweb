'use client';

export default function YazdirButonu({ etiket, className, children }) {
  return (
    <button type="button" onClick={() => window.print()} className={className} aria-label={etiket}>
      {children}
    </button>
  );
}
