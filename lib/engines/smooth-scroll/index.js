export const ENGINE = { id: 'smooth-scroll' };

export const AYAR = {
  lerp: 0.12,
  wheelMultiplier: 1,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: true,
};

export const kapaliMi = () => {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
  return window.matchMedia?.('(pointer: coarse)').matches ?? false;
};
