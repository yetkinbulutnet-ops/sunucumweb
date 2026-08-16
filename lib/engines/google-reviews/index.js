import 'server-only';
import { fetchJson } from '../core/http';
import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';

export const ENGINE = { id: 'google-reviews', title: 'Google Müşteri Yorumları', envFlag: 'ENGINE_GOOGLE_REVIEWS' };

export const ISLETME = {
  cid: process.env.GOOGLE_PLACE_CID || '10560064220033697496',
  placeId: process.env.GOOGLE_PLACE_ID || '',
  get haritaUrl() {
    return `https://www.google.com/maps?cid=${this.cid}`;
  },
  get yorumUrl() {
    return `https://search.google.com/local/reviews?placeid=${this.placeId}` ;
  },
};

const YEDEK = {
  puan: Number(process.env.GOOGLE_PUAN || 4.8),
  adet: Number(process.env.GOOGLE_YORUM_ADEDI || 327),
  canli: false,
};

const TTL = 6 * 60 * 60 * 1000;
let onbellek = { at: 0, veri: null };

async function placesDetay() {
  const anahtar = process.env.GOOGLE_PLACES_API_KEY;
  if (!anahtar || !ISLETME.placeId) return null;

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(ISLETME.placeId)}`;
  const r = await fetchJson(
    url,
    {
      headers: {
        'X-Goog-Api-Key': anahtar,
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri',
      },
    },
    { timeoutMs: 7000, retries: 1 },
  );

  if (!r.ok || typeof r.data?.rating !== 'number') return null;

  return {
    puan: Math.round(r.data.rating * 10) / 10,
    adet: Number(r.data.userRatingCount) || 0,
    canli: true,
  };
}

export async function yorumOzeti() {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', 'yorum motoru kapali.');

  if (onbellek.veri && Date.now() - onbellek.at < TTL) {
    return ok({ ...onbellek.veri, harita: ISLETME.haritaUrl });
  }

  const canli = await placesDetay();
  const veri = canli || YEDEK;
  onbellek = { at: Date.now(), veri };

  return ok({ ...veri, harita: ISLETME.haritaUrl });
}
