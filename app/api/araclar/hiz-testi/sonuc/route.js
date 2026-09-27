import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { saglayiciAdi, ulkeAdi } from '@/lib/hiz';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DIZIN = path.join(process.cwd(), '.hiz-sonuc');
const TTL_MS = 24 * 60 * 60 * 1000;

function temizle() {
  try {
    const simdi = Date.now();
    for (const ad of fs.readdirSync(DIZIN)) {
      try {
        const tam = path.join(DIZIN, ad);
        if (simdi - fs.statSync(tam).mtimeMs > TTL_MS) fs.unlinkSync(tam);
      } catch {}
    }
  } catch {}
}

const sayi = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v < 1e6 ? Math.round(v * 100) / 100 : null);

export async function POST(req) {
  await sistemMetinHazirla();
  try {
    fs.mkdirSync(DIZIN, { recursive: true });
  } catch {}
  temizle();

  let govde = {};
  try {
    govde = await req.json();
  } catch {}

  const kayit = {
    indirme: sayi(govde.indirme),
    yukleme: sayi(govde.yukleme),
    ping: sayi(govde.ping),
    jitter: sayi(govde.jitter),
  };
  if (kayit.indirme == null || kayit.yukleme == null) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const asnNum = parseInt(req.headers.get('x-swb-asn') || '', 10);
  const ulkeKodu = (req.headers.get('cf-ipcountry') || '').toUpperCase().replace(/[^A-Z]/g, '');
  kayit.saglayici = await saglayiciAdi(asnNum);
  kayit.ulke = ulkeAdi(ulkeKodu);
  kayit.tarih = new Date().toISOString();

  const id = crypto.randomBytes(6).toString('hex');
  try {
    fs.writeFileSync(path.join(DIZIN, `${id}.json`), JSON.stringify(kayit));
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true, id }, { headers: { 'cache-control': 'no-store' } });
}

export async function GET(req) {
  await sistemMetinHazirla();
  const id = (new URL(req.url).searchParams.get('id') || '').replace(/[^a-f0-9]/g, '').slice(0, 24);
  if (!id) return Response.json({ ok: false }, { status: 400 });

  const tam = path.join(DIZIN, `${id}.json`);
  try {
    if (Date.now() - fs.statSync(tam).mtimeMs > TTL_MS) {
      try {
        fs.unlinkSync(tam);
      } catch {}
      return Response.json({ ok: false }, { status: 404 });
    }
    const kayit = JSON.parse(fs.readFileSync(tam, 'utf8'));
    return Response.json({ ok: true, ...kayit }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ ok: false }, { status: 404 });
  }
}
