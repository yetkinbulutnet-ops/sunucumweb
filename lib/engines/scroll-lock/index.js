export const ENGINE = { id: 'scroll-lock', title: 'Kaydırma Kilidi' };

const GOVDE_ALANLARI = ['position', 'top', 'left', 'right', 'width', 'overflow', 'overscrollBehavior', 'paddingRight'];

let sayac = 0;
let oncekiKaydirma = 0;
let govdeYedek = null;

const iosMu = () =>
  typeof CSS !== 'undefined' && !!CSS.supports?.('-webkit-touch-callout', 'none');

function kilitle() {
  const b = document.body;
  const k = document.documentElement;
  oncekiKaydirma = window.scrollY || window.pageYOffset || 0;
  govdeYedek = Object.fromEntries(GOVDE_ALANLARI.map((a) => [a, b.style[a]]));

  const kaydirmaCubugu = window.innerWidth - k.clientWidth;
  if (kaydirmaCubugu > 0) b.style.paddingRight = `${kaydirmaCubugu}px`;
  b.style.overflow = 'hidden';
  b.style.overscrollBehavior = 'contain';

  if (iosMu()) {
    b.style.position = 'fixed';
    b.style.top = `-${oncekiKaydirma}px`;
    b.style.left = '0';
    b.style.right = '0';
    b.style.width = '100%';
  }

  window.__lenis?.stop();
}

function serbestBirak() {
  const b = document.body;
  const konumKilidiVardi = b.style.position === 'fixed';

  if (govdeYedek) GOVDE_ALANLARI.forEach((a) => { b.style[a] = govdeYedek[a]; });
  govdeYedek = null;

  if (konumKilidiVardi) window.scrollTo(0, oncekiKaydirma);
  window.__lenis?.start();
}

export function scrollKilitle() {
  if (typeof document === 'undefined') return () => {};
  sayac += 1;
  if (sayac === 1) kilitle();
  let acildi = false;
  return () => {
    if (acildi) return;
    acildi = true;
    sayac = Math.max(0, sayac - 1);
    if (sayac === 0) serbestBirak();
  };
}
