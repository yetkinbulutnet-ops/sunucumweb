'use client';
import { useEffect } from 'react';
import { runWithDomShim, drawLucide } from '@/lib/runLegacy';

export default function GlobalScripts() {
  useEffect(() => {
    let cancelled = false;
    fetch('/assets/js/script.js')
      .then((r) => r.text())
      .then((code) => {
        if (!cancelled) {
          runWithDomShim(code);
          drawLucide();
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
