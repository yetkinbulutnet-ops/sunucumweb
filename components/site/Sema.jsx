import { jsonLdMetni } from '@/lib/json-ld';

export default function Sema({ veri }) {
  if (!veri) return null;
  const liste = Array.isArray(veri) ? veri : [veri];
  return liste.map((v, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdMetni(v) }} />
  ));
}
