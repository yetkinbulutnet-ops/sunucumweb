import { sm } from '@/lib/sistem-metin';

export function ok(data, meta) {
  return { ok: true, data, ...(meta ? { meta } : {}) };
}

export function fail(code, message, meta) {
  return { ok: false, error: { code, message }, ...(meta ? { meta } : {}) };
}

export const ERRORS = () => ({
  AI_NOT_CONFIGURED: sm('sistem.hata_ai_yapilandirilmamis'),
  ENGINE_DISABLED: sm('sistem.hata_kapali'),
  BAD_INPUT: sm('sistem.hata_gecersiz_girdi'),
  RATE_LIMITED: sm('sistem.hata_cok_fazla_istek'),
  UPSTREAM_ERROR: sm('sistem.hata_servis_ulasilamiyor'),
  TIMEOUT: sm('sistem.hata_zaman_asimi'),
  EMPTY_RESULT: sm('sistem.hata_sonuc_yok'),
});

export const errorText = (code) => {
  const hatalar = ERRORS();
  return hatalar[code] || hatalar.UPSTREAM_ERROR;
};
