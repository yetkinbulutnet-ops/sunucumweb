const TR_MAP = { ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', I: 'i', İ: 'i', ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u', â: 'a', î: 'i', û: 'u' };

export function trToAscii(input = '') {
  return String(input).replace(/[çÇğĞıIİöÖşŞüÜâîû]/g, (c) => TR_MAP[c] || c).toLowerCase();
}

export function toDomainLabel(input = '') {
  const s = trToAscii(input)
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return s.length >= 3 && s.length <= 30 ? s : '';
}

export function tidy(input = '', maxLen = 120) {
  const s = String(input).replace(/\s+/g, ' ').trim();
  return s.length > maxLen ? s.slice(0, maxLen - 1).trimEnd() + '…' : s;
}

function stripControlChars(input) {
  let out = '';
  for (const ch of input) {
    const c = ch.codePointAt(0);
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c !== 127)) out += ch;
  }
  return out;
}

export function sanitizeBrief(input = '', maxLen = 600) {
  return stripControlChars(String(input))
    .replace(/\s{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLen);
}
