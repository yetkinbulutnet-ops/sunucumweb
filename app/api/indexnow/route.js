import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { indexNowGonder, siteHaritasiUrlleri } from '@/lib/indexnow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DURUM_DOSYASI = path.join(process.cwd(), '.next', 'cache', 'indexnow-son.txt');

const indexlenebilir = () => process.env.SITE_INDEXABLE === '1';

function yetkili(req) {
  const beklenen = process.env.INDEXNOW_TOKEN || process.env.CRON_TOKEN || '';
  if (!beklenen) return false;
  const gelen =
    req.headers.get('x-cron-token') || new URL(req.url).searchParams.get('key') || '';
  return gelen === beklenen;
}

function buildKimligi() {
  try {
    return fs.readFileSync(path.join(process.cwd(), '.next', 'BUILD_ID'), 'utf8').trim();
  } catch {
    return '';
  }
}

function sonGonderilenBuild() {
  try {
    return fs.readFileSync(DURUM_DOSYASI, 'utf8').trim();
  } catch {
    return '';
  }
}

function buildKaydet(id) {
  try {
    fs.mkdirSync(path.dirname(DURUM_DOSYASI), { recursive: true });
    fs.writeFileSync(DURUM_DOSYASI, id);
  } catch {}
}

const yanitla = (veri, durum = 200) =>
  NextResponse.json(veri, { status: durum, headers: { 'Cache-Control': 'no-store' } });

export async function GET(req) {
  if (!yetkili(req)) return yanitla({ ok: false, hata: 'yetkisiz' }, 401);
  if (!indexlenebilir()) return yanitla({ ok: false, atlandi: 'indexlenemez' });

  const zorla = new URL(req.url).searchParams.get('zorla') === '1';
  const build = buildKimligi();
  if (!zorla && build && build === sonGonderilenBuild()) {
    return yanitla({ ok: true, atlandi: 'degismedi', build });
  }

  const urller = await siteHaritasiUrlleri();
  const sonuc = await indexNowGonder(urller);
  if (sonuc.ok) buildKaydet(build);
  return yanitla({ ...sonuc, build });
}

export async function POST(req) {
  if (!yetkili(req)) return yanitla({ ok: false, hata: 'yetkisiz' }, 401);
  if (!indexlenebilir()) return yanitla({ ok: false, atlandi: 'indexlenemez' });

  let govde = {};
  try {
    govde = await req.json();
  } catch {}
  const urller = Array.isArray(govde?.urls)
    ? govde.urls
    : Array.isArray(govde?.urller)
      ? govde.urller
      : [];
  if (!urller.length) return yanitla({ ok: false, hata: 'url-yok' }, 400);

  const sonuc = await indexNowGonder(urller);
  return yanitla({ ...sonuc });
}
