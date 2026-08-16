import 'server-only';
import { isEngineEnabled } from './core/flags';
import { isAiConfigured } from './ai/config';
import { ENGINE as DOMAIN_AI } from './domain-ai';
import { ENGINE as DOMAIN_AVAILABILITY } from './domain-availability';
import { ENGINE as PRODUCT_FINDER } from './product-finder';

/**
 * Motor kayit defteri.
 * Yeni motor eklerken sadece klasorunu acip buraya bir satir ekleyin.
 * Burasi motorlari CALISTIRMAZ, sadece listeler -> hicbir motor digerini etkilemez.
 */

export const ENGINES = [
  { ...DOMAIN_AI, needsAi: true, route: '/api/ai/domain-ideas' },
  { ...DOMAIN_AVAILABILITY, needsAi: false, route: '/api/domain/availability' },
  { ...PRODUCT_FINDER, needsAi: false, route: null }, // istemci tarafi, saf fonksiyon
];

/** Saglik durumu: hangi motor acik, AI anahtari var mi. /api/health bunu doner. */
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
