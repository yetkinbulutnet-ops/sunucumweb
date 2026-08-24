'use client';

import { useEffect, useRef, useState } from 'react';
import { TURNSTILE_SITE_KEY } from '@/lib/guvenlik-config';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function TurnstileGecis({ devam }) {
  const kutuRef = useRef(null);
  const formRef = useRef(null);
  const [durum, setDurum] = useState('yukleniyor'); // yukleniyor | hazir | dogrulandi | hata

  useEffect(() => {
    let iptal = false;

    function ciz() {
      if (iptal || !kutuRef.current || kutuRef.current.dataset.cizildi) return;
      if (!window.turnstile) return;
      kutuRef.current.dataset.cizildi = '1';
      window.turnstile.render(kutuRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        language: 'tr',
        callback: () => {
          setDurum('dogrulandi');
          // Turnstile gizli "cf-turnstile-response" alanını forma ekledi → gönder
          formRef.current?.requestSubmit();
        },
        'error-callback': () => setDurum('hata'),
        'expired-callback': () => window.turnstile?.reset(kutuRef.current),
      });
      setDurum('hazir');
    }

    if (window.turnstile) {
      ciz();
    } else if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = ciz;
      s.onerror = () => !iptal && setDurum('hata');
      document.head.appendChild(s);
    } else {
      // script yükleniyor; hazır olunca çiz
      const t = setInterval(() => {
        if (window.turnstile) {
          clearInterval(t);
          ciz();
        }
      }, 200);
      setTimeout(() => clearInterval(t), 15000);
    }

    return () => {
      iptal = true;
    };
  }, []);

  return (
    <form ref={formRef} method="POST" action="/api/guvenlik/dogrula" className="flex flex-col items-center">
      <input type="hidden" name="devam" value={devam} />
      <div ref={kutuRef} className="flex min-h-[68px] items-center justify-center" />

      {durum === 'yukleniyor' && (
        <p className="mt-1 text-[13px] text-muted">Güvenlik doğrulaması yükleniyor…</p>
      )}
      {durum === 'dogrulandi' && (
        <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-brandtext">
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Doğrulandı, yönlendiriliyorsunuz…
        </p>
      )}
      {durum === 'hata' && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Tekrar dene
        </button>
      )}
    </form>
  );
}
