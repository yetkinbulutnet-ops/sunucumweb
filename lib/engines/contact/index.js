import 'server-only';
import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';
import { sm } from '@/lib/sistem-metin';

import { iletisimVerisi } from '@/lib/cms';

export const ENGINE = { id: 'contact', envFlag: 'ENGINE_CONTACT' };

const EPOSTA_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const TELEFON_RE = /^(\+?90)?0?5\d{9}$|^(\+?90)?0?[2-4]\d{9}$/;

const temizle = (deger, uzunluk) => String(deger ?? '').trim().slice(0, uzunluk);

export function formDogrula(govde, KONULAR) {
  const veri = {
    ad: temizle(govde.ad, 120),
    telefon: temizle(govde.telefon, 30).replace(/[\s()-]/g, ''),
    eposta: temizle(govde.eposta, 160).toLowerCase(),
    konu: temizle(govde.konu, 40),
    mesaj: temizle(govde.mesaj, 4000),
  };

  const hatalar = {};

  if (veri.ad.length < 3 || !veri.ad.includes(' ')) hatalar.ad = sm('sistem.form_ad_soyad');
  if (!EPOSTA_RE.test(veri.eposta)) hatalar.eposta = sm('sistem.form_eposta');
  if (!TELEFON_RE.test(veri.telefon)) hatalar.telefon = sm('sistem.form_telefon');
  if (!KONULAR.some((k) => k.deger === veri.konu)) hatalar.konu = sm('sistem.form_konu');
  if (veri.mesaj.length < 15) hatalar.mesaj = sm('sistem.form_mesaj_kisa');

  return { veri, hatalar, gecerli: Object.keys(hatalar).length === 0 };
}

export function spamMi(govde) {
  if (temizle(govde.website, 100)) return 'TUZAK';
  const gecenSure = Number(govde.sure);
  if (Number.isFinite(gecenSure) && gecenSure < 3000) return 'COK_HIZLI';
  if (/\b(https?:\/\/|viagra|casino|bitcoin|loan)\b/i.test(String(govde.mesaj || ''))) return 'ICERIK';
  return null;
}

function metinOlustur(veri, ip, konuAdi) {
  return [
    sm('sistem.form_eposta_konu', { deger: konuAdi }),
    sm('sistem.form_eposta_ad', { deger: veri.ad }),
    sm('sistem.form_eposta_telefon', { deger: veri.telefon }),
    sm('sistem.form_eposta_eposta', { deger: veri.eposta }),
    sm('sistem.form_eposta_ip', { deger: ip || sm('sistem.form_eposta_bilinmiyor') }),
    '',
    veri.mesaj,
  ].join('\n');
}

async function epostaGonder(veri, ip, konuAdi) {
  const sunucu = process.env.SMTP_HOST;
  if (!sunucu) return { yontem: null };

  const { createTransport } = await import('nodemailer');
  const tasiyici = createTransport({
    host: sunucu,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '') === '1',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });

  await tasiyici.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ILETISIM_ALICI || 'info@sunucumweb.com',
    replyTo: `${veri.ad} <${veri.eposta}>`,
    subject: sm('sistem.form_eposta_baslik', { konu: konuAdi, ad: veri.ad }),
    text: metinOlustur(veri, ip, konuAdi),
  });

  return { yontem: 'eposta' };
}

async function panelaGonder(veri, ip, konuAdi, tarayici) {
  const gizli = process.env.CARK_SECRET;
  if (!gizli) return false;
  const r = await fetch(`${(process.env.CMS_INTERNAL_URL || 'http://127.0.0.1:3654').replace(/\/+$/, '')}/api/v1/iletisim-mesaji/yeni`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-cark-secret': gizli },
    body: JSON.stringify({ ...veri, konuAdi, ip, tarayici }),
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  return r.ok;
}

export const konulariGetir = async () => (await iletisimVerisi()).konular;

export async function mesajGonder(govde, { ip, tarayici } = {}) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', sm('sistem.form_kapali'));

  const tuzak = spamMi(govde);
  if (tuzak) return ok({ teslim: 'yoksayildi' });

  const KONULAR = await konulariGetir();
  const { veri, hatalar, gecerli } = formDogrula(govde, KONULAR);
  const konuAdi = KONULAR.find((k) => k.deger === veri.konu)?.etiket || veri.konu;
  if (!gecerli) return fail('BAD_INPUT', sm('sistem.form_alanlari_duzeltin'), { hatalar });

  try {
    if (await panelaGonder(veri, ip, konuAdi, String(tarayici || '').slice(0, 300))) return ok({ teslim: 'panel' });
  } catch {}

  try {
    const sonuc = await epostaGonder(veri, ip, konuAdi);
    if (sonuc.yontem === 'eposta') return ok({ teslim: 'eposta' });
  } catch {
    return fail('UPSTREAM_ERROR', sm('sistem.form_iletilemedi'));
  }

  console.log('[iletisim]', JSON.stringify({ ...veri, ip, zaman: new Date().toISOString() }));
  return ok({ teslim: 'kayit' });
}
