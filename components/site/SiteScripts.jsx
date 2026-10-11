'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CerezBandi from './CerezBandi';
import { izinOku } from '@/lib/cerez-izin';

const UMAMI_SRC = 'https://istatistik.yetkinweb.com/script.js';
const UMAMI_ID = 'e2253ba7-0a0f-4696-8d27-e77254cc845d';
const TAWK_SRC = 'https://embed.tawk.to/66b732520cca4f8a7a742f23/1i4tpp5dm';
const GTM_ID = 'GTM-NLL9997R';
const GA4_ID = 'G-5Q4DXNVM9N';

export default function SiteScripts() {
  const yol = usePathname();
  const [trMi, setTrMi] = useState(false);
  const [izin, setIzin] = useState(null);

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)swb_ulke=([A-Za-z0-9]{2})/);
    setTrMi((m?.[1] || '').toUpperCase() === 'TR');
    setIzin(izinOku());
    const dinle = (e) => setIzin(e.detail);
    window.addEventListener('swb-cerez', dinle);
    return () => window.removeEventListener('swb-cerez', dinle);
  }, []);

  if (yol === '/guvenlik' || yol === '/engellendi' || yol === '/bulten') return null;

  return (
    <>
      <CerezBandi />

      {izin?.analiz && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        </>
      )}

      {trMi && (
        <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />
      )}

      {izin?.destek && (
        <Script id="tawkto" strategy="afterInteractive">
          {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src="${TAWK_SRC}";s1.charset="UTF-8";s1.setAttribute("crossorigin","*");s0.parentNode.insertBefore(s1,s0);})();`}
        </Script>
      )}
    </>
  );
}
