import { istemciIp } from '@/lib/guvenlik';
import { saglayiciAdi, ulkeAdi } from '@/lib/hiz';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const ip = istemciIp((n) => req.headers.get(n));
  const asnNum = parseInt(req.headers.get('x-swb-asn') || '', 10);
  const ulkeKodu = (req.headers.get('cf-ipcountry') || '').toUpperCase().replace(/[^A-Z]/g, '');
  const saglayici = await saglayiciAdi(asnNum);

  return Response.json(
    {
      ip: ip || null,
      asn: Number.isFinite(asnNum) && asnNum > 0 ? `AS${asnNum}` : null,
      saglayici,
      ulkeKodu: ulkeKodu || null,
      ulke: ulkeAdi(ulkeKodu),
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
