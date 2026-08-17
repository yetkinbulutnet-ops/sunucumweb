import 'server-only';
import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';

import { KONULAR } from '@/content/site/iletisim';

export const ENGINE = { id: 'contact', title: 'İletişim Formu', envFlag: 'ENGINE_CONTACT' };

export { KONULAR };

const EPOSTA_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const TELEFON_RE = /^(\+?90)?0?5\d{9}$|^(\+?90)?0?[2-4]\d{9}$/;

const temizle = (deger, uzunluk) => String(deger ?? '').trim().slice(0, uzunluk);

export function formDogrula(govde) {
  const veri = {
    ad: temizle(govde.ad, 120),
    telefon: temizle(govde.telefon, 30).replace(/[\s()-]/g, ''),
    eposta: temizle(govde.eposta, 160).toLowerCase(),
    konu: temizle(govde.konu, 40),
    mesaj: temizle(govde.mesaj, 4000),
  };

  const hatalar = {};

  if (veri.ad.length < 3 || !veri.ad.includes(' ')) hatalar.ad = 'Ad ve soyadınızı yazın.';
  if (!EPOSTA_RE.test(veri.eposta)) hatalar.eposta = 'Geçerli bir e-posta adresi girin.';
  if (!TELEFON_RE.test(veri.telefon)) hatalar.telefon = 'Geçerli bir telefon numarası girin (05xx xxx xx xx).';
  if (!KONULAR.some((k) => k.deger === veri.konu)) hatalar.konu = 'Görüşme konusunu seçin.';
  if (veri.mesaj.length < 15) hatalar.mesaj = 'Mesajınızı biraz daha açar mısınız? (en az 15 karakter)';

  return { veri, hatalar, gecerli: Object.keys(hatalar).length === 0 };
}

export function spamMi(govde) {
  if (temizle(govde.website, 100)) return 'TUZAK';
  const gecenSure = Number(govde.sure);
  if (Number.isFinite(gecenSure) && gecenSure < 3000) return 'COK_HIZLI';
  if (/\b(https?:\/\/|viagra|casino|bitcoin|loan)\b/i.test(String(govde.mesaj || ''))) return 'ICERIK';
  return null;
}

function metinOlustur(veri, ip) {
  const konuAdi = KONULAR.find((k) => k.deger === veri.konu)?.etiket || veri.konu;
  return [
    `Konu: ${konuAdi}`,
    `Ad Soyad: ${veri.ad}`,
    `Telefon: ${veri.telefon}`,
    `E-posta: ${veri.eposta}`,
    `IP: ${ip || 'bilinmiyor'}`,
    '',
    veri.mesaj,
  ].join('\n');
}

async function epostaGonder(veri, ip) {
  const sunucu = process.env.SMTP_HOST;
  if (!sunucu) return { yontem: null };

  const { createTransport } = await import('nodemailer');
  const tasiyici = createTransport({
    host: sunucu,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '') === '1',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });

  const konuAdi = KONULAR.find((k) => k.deger === veri.konu)?.etiket || veri.konu;

  await tasiyici.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ILETISIM_ALICI || 'info@sunucumweb.com',
    replyTo: `${veri.ad} <${veri.eposta}>`,
    subject: `[Site] ${konuAdi} — ${veri.ad}`,
    text: metinOlustur(veri, ip),
  });

  return { yontem: 'eposta' };
}

export async function mesajGonder(govde, { ip } = {}) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', 'Form şu anda kapalı.');

  const tuzak = spamMi(govde);
  if (tuzak) return ok({ teslim: 'yoksayildi' });

  const { veri, hatalar, gecerli } = formDogrula(govde);
  if (!gecerli) return fail('BAD_INPUT', 'Lütfen işaretli alanları düzeltin.', { hatalar });

  try {
    const sonuc = await epostaGonder(veri, ip);
    if (sonuc.yontem === 'eposta') return ok({ teslim: 'eposta' });
  } catch {
    return fail('UPSTREAM_ERROR', 'Mesajınız iletilemedi. Lütfen telefonla ulaşın ya da tekrar deneyin.');
  }

  console.log('[iletisim]', JSON.stringify({ ...veri, ip, zaman: new Date().toISOString() }));
  return ok({ teslim: 'kayit' });
}
