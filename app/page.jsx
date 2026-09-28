import { preload } from 'react-dom';
import HomePage from '@/components/site/HomePage';
import { yazilimVerisi, markalariGetir, sayfaMetinleri, anasayfaSlaytlari, anasayfaVerisi } from '@/lib/cms';
import SayfaMetni from '@/components/site/SayfaMetni';

export const revalidate = 300;

export const metadata = { alternates: { canonical: '/' } };

export default async function Page() {
  const [{ yazilimlar, kategoriler }, markalar, metinler, slaytlar, anasayfa] = await Promise.all([
    yazilimVerisi(),
    markalariGetir(),
    sayfaMetinleri(),
    anasayfaSlaytlari(),
    anasayfaVerisi(),
  ]);
  const ilk = slaytlar[0];
  if (ilk) {
    preload(ilk.img, {
      as: 'image',
      fetchPriority: 'high',
      ...(ilk.srcSet ? { imageSrcSet: ilk.srcSet, imageSizes: '(min-width: 488px) 448px, calc(100vw - 40px)' } : {}),
    });
  }
  return (
    <SayfaMetni onekler={['anasayfa', 'urunbulucu', 'alanadiai']}>
    <HomePage
      yazilimlar={yazilimlar}
      kategoriler={kategoriler}
      markalar={markalar}
      markaSeridi={metinler.markalar}
      slaytlar={slaytlar}
      anasayfa={anasayfa}
    />
    </SayfaMetni>
  );
}
