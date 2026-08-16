import parse from 'html-react-parser';
import { getFooter } from '@/lib/content';

// Ortak footer (footerv2-container) - 18 sayfada birebir ayni
export default function Footer() {
  return <>{parse(getFooter())}</>;
}
