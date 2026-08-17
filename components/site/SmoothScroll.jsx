'use client';
import { useEffect } from 'react';
import { AYAR, kapaliMi } from '@/lib/engines/smooth-scroll';

export default function SmoothScroll() {
  useEffect(() => {
    if (kapaliMi()) return;

    let lenis;
    let iptal = false;

    import('lenis').then(({ default: Lenis }) => {
      if (iptal) return;
      lenis = new Lenis(AYAR);
      window.__lenis = lenis;
    });

    return () => {
      iptal = true;
      window.__lenis = null;
      lenis?.destroy();
    };
  }, []);

  return null;
}
