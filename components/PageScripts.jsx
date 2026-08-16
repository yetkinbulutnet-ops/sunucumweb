'use client';
import { useEffect } from 'react';
import { runWithDomShim, drawLucide } from '@/lib/runLegacy';

export default function PageScripts({ code }) {
  useEffect(() => {
    runWithDomShim(code);
    drawLucide();

    const t = setTimeout(drawLucide, 600);
    return () => clearTimeout(t);
  }, [code]);
  return null;
}
