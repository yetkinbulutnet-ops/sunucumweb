import parse from 'html-react-parser';
import { getHeader } from '@/lib/content';

export default function Header() {
  return <>{parse(getHeader())}</>;
}
