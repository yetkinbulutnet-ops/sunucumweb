import { NextResponse } from 'next/server';
import { wisecpHazir, faturaOlustur, odemeUrl } from '@/lib/engines/wisecp';

export const runtime = 'nodejs';

const TEST_USER_ID = process.env.WISECP_TEST_USER_ID || '';

export async function POST(req) {
  if (!wisecpHazir()) return NextResponse.json({ ok: false, hata: 'wisecp-yapilandirilmadi' }, { status: 503 });

  let govde;
  try { govde = await req.json(); } catch { return NextResponse.json({ ok: false, hata: 'gecersiz-istek' }, { status: 400 }); }

  const items = Array.isArray(govde?.items) ? govde.items : [];
  const userId = govde?.userId || TEST_USER_ID;
  if (!items.length) return NextResponse.json({ ok: false, hata: 'sepet-bos' }, { status: 400 });
  if (!userId) return NextResponse.json({ ok: false, mod: 'misafir' });

  const kalemler = items
    .slice(0, 30)
    .map((i) => ({
      description: [i.product, i.name].filter(Boolean).join(' — ') || 'Urun',
      quantity: Math.max(1, Math.min(24, Number(i.qty) || 1)),
      amount: Math.max(0, Number(i.price) || 0),
    }))
    .filter((k) => k.amount > 0);

  if (!kalemler.length) return NextResponse.json({ ok: false, hata: 'gecerli-kalem-yok' }, { status: 400 });

  try {
    const fatura = await faturaOlustur({ userId, kalemler });
    let url = fatura?.share?.link || '';
    try {
      const sso = await odemeUrl({ userId, invoiceId: fatura.id });
      if (sso) url = sso;
    } catch {  }
    return NextResponse.json({ ok: true, url, invoiceId: fatura?.id });
  } catch (e) {
    return NextResponse.json({ ok: false, hata: String(e?.message || e) }, { status: 502 });
  }
}
