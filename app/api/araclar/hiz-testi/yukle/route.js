export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  let bayt = 0;
  const okuyucu = req.body?.getReader?.();
  if (okuyucu) {
    for (;;) {
      const { done, value } = await okuyucu.read();
      if (done) break;
      bayt += value?.byteLength || 0;
    }
  } else if (req.arrayBuffer) {
    bayt = (await req.arrayBuffer()).byteLength;
  }
  return Response.json({ ok: true, bayt }, { headers: { 'cache-control': 'no-store' } });
}
