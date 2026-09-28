'use client';

import { useEffect, useRef, useState } from 'react';
import { TURNSTILE_SITE_KEY } from '@/lib/guvenlik-config';
import { m } from '@/lib/metin';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function TurnstileGecis() {
  const kutuRef = useRef(null);
  const formRef = useRef(null);
  const [durum, setDurum] = useState('yukleniyor');

  useEffect(() => {
    let iptal = false;

    function ciz() {
      if (iptal || !kutuRef.current || kutuRef.current.dataset.cizildi || !window.turnstile) return;
      kutuRef.current.dataset.cizildi = '1';
      window.turnstile.render(kutuRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        language: 'tr',
        appearance: 'always',
        callback: () => setDurum('dogrulandi'),
        'error-callback': () => setDurum('hata'),
        'expired-callback': () => {
          setDurum('hazir');
          if (kutuRef.current) window.turnstile.reset(kutuRef.current);
        },
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

  const gonderilebilir = durum === 'dogrulandi';

  return (
    <form
      ref={formRef}
      method="POST"
      action="/api/guvenlik/dogrula"
      onSubmit={() => setDurum('gonderiliyor')}
      className="flex flex-col items-center gap-4"
    >
      <div ref={kutuRef} className="flex min-h-[68px] items-center justify-center" />

      <button
        type="submit"
        disabled={!gonderilebilir}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors enabled:hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {durum === 'gonderiliyor' ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {m('guvenlik.yonlendiriliyor')}
          </>
        ) : (
          <>
            {m('guvenlik.devam_et')}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>

      {durum === 'yukleniyor' && (
        <p className="text-[13px] text-muted">{m('guvenlik.yukleniyor')}</p>
      )}
      {durum === 'hazir' && (
        <p className="text-[13px] text-muted">{m('guvenlik.hazir')}</p>
      )}
      {durum === 'hata' && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-[13px] font-medium text-brandtext underline underline-offset-2"
        >
          {m('guvenlik.widget_hata')}
        </button>
      )}
    </form>
  );
}
