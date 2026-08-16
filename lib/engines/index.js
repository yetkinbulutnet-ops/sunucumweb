import 'server-only';
import { isEngineEnabled } from './core/flags';
import { isAiConfigured } from './ai/config';
import { ENGINE as DOMAIN_AI } from './domain-ai';
import { ENGINE as DOMAIN_AVAILABILITY } from './domain-availability';
import { ENGINE as PRODUCT_FINDER } from './product-finder';

export const ENGINES = [
  { ...DOMAIN_AI, needsAi: true, route: '/api/ai/domain-ideas' },
  { ...DOMAIN_AVAILABILITY, needsAi: false, route: '/api/domain/availability' },
  { ...PRODUCT_FINDER, needsAi: false, route: null },
];

export function enginesStatus() {
  const aiReady = isAiConfigured();
  return ENGINES.map((e) => ({
    id: e.id,
    title: e.title,
    enabled: e.envFlag ? isEngineEnabled(e.envFlag) : true,
    ready: e.needsAi ? aiReady : true,
    route: e.route,
  }));
}
