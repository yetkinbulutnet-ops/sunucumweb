import MetinEkle from './MetinEkle';
import { istemciMetinleri } from '@/lib/cms';

export default async function SayfaMetni({ onekler, children }) {
  return <MetinEkle metinler={await istemciMetinleri(onekler)}>{children}</MetinEkle>;
}
