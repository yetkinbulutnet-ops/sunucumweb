'use client';
import { useEffect } from 'react';
import { runWithDomShim, drawLucide } from '@/lib/runLegacy';

// Sayfaya ozel inline davranis scriptleri (mega menu, mobil menu, slider vs.)
export default function PageScripts({ code }) {
  useEffect(() => {
    runWithDomShim(code);
    drawLucide();
    // lucide gec yuklenirse diye kisa bir tekrar
    const t = setTimeout(drawLucide, 600);
    return () => clearTimeout(t);
  }, [code]);
  return null;
}
