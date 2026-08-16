import SozlesmelerPage from '@/components/site/SozlesmelerPage';

/* Bu statik route, [[...slug]] catch-all'dan once eslesir. */
export const metadata = {
  title: 'Sözleşmeler ve Yasal Belgeler - SunucumWEB',
  description: 'SunucumWEB hizmet kullanım koşulları, gizlilik sözleşmesi, iade politikası ve diğer yasal belgeler.',
};

export default function Page() {
  return <SozlesmelerPage />;
}
