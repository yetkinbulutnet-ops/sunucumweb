import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const esit = (a, b) => {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y);
};

const manifest = () => JSON.parse(fs.readFileSync(path.join(process.cwd(), '.next', 'prerender-manifest.json'), 'utf8'));

const yenidenUret = async (yollar, onizlemeId) => {
  const kok = `http://127.0.0.1:${process.env.PORT || 3000}`;
  let sira = 0;
  const hatali = [];
  const isci = async () => {
    while (sira < yollar.length) {
      const yol = yollar[sira++];
      try {
        const r = await fetch(kok + yol, { headers: { 'x-prerender-revalidate': onizlemeId }, signal: AbortSignal.timeout(30000) });
        if (r.status >= 400) hatali.push(`${yol}:${r.status}`);
        await r.arrayBuffer();
      } catch (e) {
        hatali.push(`${yol}:${e.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, isci));
  if (hatali.length) console.error(`revalidate: ${hatali.length} sayfa uretilemedi ${hatali.slice(0, 5).join(' ')}`);
};

export async function POST(req) {
  if (!esit(req.headers.get('x-revalidate-secret'), process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ ok: false, hata: 'yetkisiz' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  revalidateTag('cms');
  const m = manifest();
  const yollar = Object.entries(m.routes)
    .filter(([yol, r]) => !yol.startsWith('/_') && !/\.(xml|webmanifest|txt)$/.test(yol) && r.initialRevalidateSeconds !== false)
    .map(([yol]) => yol);
  yenidenUret(yollar, m.preview.previewModeId).catch(() => {});
  return NextResponse.json({ ok: true, sayfa: yollar.length, zaman: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
