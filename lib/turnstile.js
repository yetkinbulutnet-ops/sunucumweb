const KAYNAK = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let yukleme = null;

export const turnstileYukle = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('sunucu'));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (yukleme) return yukleme;
  yukleme = new Promise((coz, reddet) => {
    let s = document.querySelector(`script[src="${KAYNAK}"]`);
    if (!s) {
      s = document.createElement('script');
      s.src = KAYNAK;
      s.async = true;
      document.head.appendChild(s);
    }
    const bitis = Date.now() + 20000;
    const bak = setInterval(() => {
      if (window.turnstile) {
        clearInterval(bak);
        coz(window.turnstile);
      } else if (Date.now() > bitis) {
        clearInterval(bak);
        yukleme = null;
        reddet(new Error('zaman'));
      }
    }, 150);
  });
  return yukleme;
};
