export function ok(data, meta) {
  return { ok: true, data, ...(meta ? { meta } : {}) };
}

export function fail(code, message, meta) {
  return { ok: false, error: { code, message }, ...(meta ? { meta } : {}) };
}

export const ERRORS = {
  AI_NOT_CONFIGURED: 'AI servisi yapilandirilmamis. Yoneticiye bildirin.',
  ENGINE_DISABLED: 'Bu ozellik su anda kapali.',
  BAD_INPUT: 'Girdiginiz bilgi gecersiz.',
  RATE_LIMITED: 'Cok fazla istek gonderdiniz, lutfen biraz bekleyin.',
  UPSTREAM_ERROR: 'Servise su anda ulasilamiyor, lutfen tekrar deneyin.',
  TIMEOUT: 'Islem zaman asimina ugradi, lutfen tekrar deneyin.',
  EMPTY_RESULT: 'Sonuc uretilemedi, lutfen aciklamanizi biraz genisletip tekrar deneyin.',
};

export const errorText = (code) => ERRORS[code] || ERRORS.UPSTREAM_ERROR;
