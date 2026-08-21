import ReferencesPage from '@/components/site/ReferencesPage';
import { REFERANSLAR } from '@/content/site/referanslar';
import { kanonik } from '@/lib/seo';

export const metadata = {
  title: REFERANSLAR.seo.title,
  description: REFERANSLAR.seo.description,
  alternates: kanonik('/referanslar'),
};

export default function Page() {
  return <ReferencesPage />;
}
