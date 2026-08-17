import 'server-only';
import { fetchJson } from '../core/http';
import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';

export const ENGINE = { id: 'google-reviews', title: 'Google Müşteri Yorumları', envFlag: 'ENGINE_GOOGLE_REVIEWS' };

const ISLETME_ADI = process.env.GOOGLE_PLACE_ADI || 'SunucumWEB';
const TAZE_MS = 15 * 60 * 1000;

export const ISLETME = {
  cid: process.env.GOOGLE_PLACE_CID || '10560064220033697496',
  get haritaUrl() {
    return `https://www.google.com/maps?cid=${this.cid}`;
  },
};

const YEDEK = {
  puan: Number(process.env.GOOGLE_PUAN || 4.8),
  adet: Number(process.env.GOOGLE_YORUM_ADEDI || 327),
  canli: false,
};

let onbellek = { at: 0, veri: null };
let placeId = process.env.GOOGLE_PLACE_ID || '';
let sonHata = null;

const anahtar = () => process.env.GOOGLE_PLACES_API_KEY || '';

async function placeIdBul() {
  if (placeId) return placeId;

  const r = await fetchJson(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': anahtar(),
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({ textQuery: ISLETME_ADI, languageCode: 'tr', regionCode: 'TR' }),
    },
    { timeoutMs: 8000, retries: 1 },
  );

  const bulunan = r.ok ? r.data?.places?.[0] : null;
  if (!bulunan?.id) {
    sonHata = r.ok ? 'ISLETME_BULUNAMADI' : `ARAMA_${r.error || r.status}`;
    return '';
  }

  placeId = bulunan.id;
  return placeId;
}

async function placesDetay() {
  if (!anahtar()) {
    sonHata = 'ANAHTAR_YOK';
    return null;
  }

  const id = await placeIdBul();
  if (!id) return null;

  const r = await fetchJson(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`,
    {
      headers: {
        'X-Goog-Api-Key': anahtar(),
        'X-Goog-FieldMask': 'id,rating,userRatingCount,googleMapsUri',
        'Accept-Language': 'tr',
      },
    },
    { timeoutMs: 8000, retries: 1 },
  );

  if (!r.ok || typeof r.data?.rating !== 'number') {
    sonHata = r.ok ? 'PUAN_YOK' : `DETAY_${r.error || r.status}`;
    return null;
  }

  sonHata = null;
  return {
    puan: Math.round(r.data.rating * 10) / 10,
    adet: Number(r.data.userRatingCount) || 0,
    canli: true,
    harita: r.data.googleMapsUri || ISLETME.haritaUrl,
    placeId: r.data.id || id,
  };
}

function paketle(veri, at) {
  return {
    puan: veri.puan,
    adet: veri.adet,
    canli: !!veri.canli,
    harita: veri.harita || ISLETME.haritaUrl,
    guncellenme: at ? new Date(at).toISOString() : null,
  };
}

export async function yorumOzeti({ zorla = false } = {}) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', 'yorum motoru kapali.');

  const taze = onbellek.veri && Date.now() - onbellek.at < TAZE_MS;
  if (taze && !zorla) return ok(paketle(onbellek.veri, onbellek.at));

  const canli = await placesDetay();
  if (canli) {
    onbellek = { at: Date.now(), veri: canli };
    return ok(paketle(canli, onbellek.at));
  }

  if (onbellek.veri) return ok(paketle(onbellek.veri, onbellek.at));
  return ok(paketle(YEDEK, null));
}

export function yorumDurumu() {
  return {
    anahtarVar: !!anahtar(),
    placeId: placeId || null,
    sonCekim: onbellek.at ? new Date(onbellek.at).toISOString() : null,
    canli: !!onbellek.veri?.canli,
    hata: sonHata,
  };
}
