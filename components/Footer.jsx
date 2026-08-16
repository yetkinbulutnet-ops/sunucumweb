import parse from 'html-react-parser';
import { getFooter } from '@/lib/content';

export default function Footer() {
  return <>{parse(getFooter())}</>;
}
