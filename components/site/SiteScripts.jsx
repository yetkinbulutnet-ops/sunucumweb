'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const UMAMI_SRC = 'https://istatistik.yetkinweb.com/script.js';
const UMAMI_ID = 'e2253ba7-0a0f-4696-8d27-e77254cc845d';
const TAWK_SRC = 'https://embed.tawk.to/66b732520cca4f8a7a742f23/1i4tpp5dm';

export default function SiteScripts() {
  const yol = usePathname();
  if (yol === '/guvenlik' || yol === '/engellendi') return null;

  return (
    <>
      <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />
      <Script id="tawkto" strategy="afterInteractive">
        {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src="${TAWK_SRC}";s1.charset="UTF-8";s1.setAttribute("crossorigin","*");s0.parentNode.insertBefore(s1,s0);})();`}
      </Script>
    </>
  );
}
