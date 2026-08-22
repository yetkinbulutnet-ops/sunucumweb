import 'server-only';

const API_URL = (process.env.WISECP_API_URL || '').replace(/\/+$/, '');
const API_KEY = process.env.WISECP_API_KEY || '';

export const wisecpHazir = () => Boolean(API_URL && API_KEY);

async function cagir(aksiyon, govde) {
  const yanit = await fetch(`${API_URL}/${aksiyon}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Apikey: API_KEY },
    body: JSON.stringify(govde),
    cache: 'no-store',
  });
  const veri = await yanit.json().catch(() => ({}));
  if (veri.status !== 'successful') throw new Error(veri.message || `WISECP ${aksiyon} yaniti basarisiz`);
  return veri.data;
}

export async function faturaOlustur({ userId, currency = 'TRY', kalemler }) {
  const items = kalemler.map((k, n) => ({
    sequence: n + 1,
    description: k.description,
    quantity: k.quantity,
    amount: k.amount,
    total: Number((k.amount * k.quantity).toFixed(2)),
    order_id: 0,
  }));
  return cagir('Billing/CreateInvoice', { user_id: userId, currency, status: 'unpaid', items });
}

export async function odemeUrl({ userId, invoiceId }) {
  const veri = await cagir('Clients/CreateClientSsoToken', {
    user_id: userId,
    destination: 'ac-ps-detail-invoice',
    destination_values: [invoiceId],
  });
  return veri?.url || '';
}
