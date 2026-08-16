import parse from 'html-react-parser';
import { getHeader } from '@/lib/content';

// Ortak header: sticky bar + mega menuler + mobil menu (18 sayfada birebir ayni)
export default function Header() {
  return <>{parse(getHeader())}</>;
}
