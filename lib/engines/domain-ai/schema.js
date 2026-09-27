import { toDomainLabel, tidy } from '../core/text';
import { sm } from '@/lib/sistem-metin';

export const ALLOWED_TLDS = ['.com', '.com.tr', '.net', '.org', '.co', '.app', '.dev', '.shop', '.online', '.xyz'];

export const STYLES = ['kisa', 'acikanlam', 'yaratici', 'sektorel'];

export const STYLE_LABEL = () => ({
  kisa: sm('sistem.ai_stil_kisa_marka'),
  acikanlam: sm('sistem.ai_stil_anlami_acik'),
  yaratici: sm('sistem.ai_stil_yaratici'),
  sektorel: sm('sistem.ai_stil_sektorel'),
});

export const IDEAS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ideas'],
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'tld', 'why', 'style'],
        properties: {
          label: { type: 'string' },
          tld: { type: 'string' },
          why: { type: 'string' },
          style: { type: 'string', enum: STYLES },
        },
      },
    },
  },
};

export function sanitizeIdeas(raw, { allowedTlds = ALLOWED_TLDS, max = 8 } = {}) {
  const list = Array.isArray(raw?.ideas) ? raw.ideas : [];
  const seen = new Set();
  const out = [];

  for (const item of list) {
    const label = toDomainLabel(item?.label);
    if (!label || label.length < 3 || label.length > 20) continue;

    let tld = String(item?.tld || '').trim().toLowerCase();
    if (tld && !tld.startsWith('.')) tld = `.${tld}`;
    if (!allowedTlds.includes(tld)) tld = allowedTlds.includes('.com') ? '.com' : allowedTlds[0];

    const domain = `${label}${tld}`;
    if (seen.has(domain)) continue;
    seen.add(domain);

    out.push({
      domain,
      label,
      tld,
      why: tidy(item?.why, 90) || sm('sistem.ai_varsayilan_neden'),
      style: STYLES.includes(item?.style) ? item.style : 'yaratici',
    });

    if (out.length >= max) break;
  }

  return out;
}
