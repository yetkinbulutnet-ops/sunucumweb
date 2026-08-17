import { unstable_cache } from 'next/cache';
import { dnsSorgula } from '@/lib/engines/tools';

export const dnsSorgulaOnbellekli = unstable_cache(
  async (alan, tip) => dnsSorgula(alan, tip),
  ['dns-sorgu'],
  { revalidate: 900 },
);
