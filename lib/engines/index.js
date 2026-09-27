import 'server-only';
import { isEngineEnabled } from './core/flags';
import { isAiConfigured } from './ai/config';
import { sm } from '../sistem-metin';
import { ENGINE as DOMAIN_AI } from './domain-ai';
import { ENGINE as DOMAIN_AVAILABILITY } from './domain-availability';
import { ENGINE as PRODUCT_FINDER } from './product-finder';
import { ENGINE as GOOGLE_REVIEWS, yorumDurumu } from './google-reviews';
import { ENGINE as TOOLS } from './tools';

export const ENGINES = [
  { ...DOMAIN_AI, needsAi: true, route: '/api/ai/domain-ideas' },
  { ...DOMAIN_AVAILABILITY, needsAi: false, route: '/api/domain/availability' },
  { ...PRODUCT_FINDER, needsAi: false, route: null },
  { ...GOOGLE_REVIEWS, needsAi: false, route: '/api/google-reviews', hazir: () => yorumDurumu().anahtarVar },
  { ...TOOLS, needsAi: false, route: '/api/araclar/[arac]' },
];

export function enginesStatus() {
  const aiReady = isAiConfigured();
  return ENGINES.map((e) => ({
    id: e.id,
    title: sm(`sistem.motor_${e.id.replace(/-/g, '_')}`),
    enabled: e.envFlag ? isEngineEnabled(e.envFlag) : true,
    ready: e.hazir ? e.hazir() : e.needsAi ? aiReady : true,
    route: e.route,
  }));
}
