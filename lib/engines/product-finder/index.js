export const ENGINE = { id: 'product-finder', title: 'Ürün Bulucu' };

export const QUESTIONS = [
  {
    key: 'use',
    q: 'Sunucuyu ne için kullanacaksınız?',
    opts: [
      { l: 'Web sitesi / blog', v: 'web', icon: 'globe' },
      { l: 'E-ticaret / yoğun trafik', v: 'ecom', icon: 'layers' },
      { l: 'Uygulama / özel sunucu', v: 'app', icon: 'server' },
      { l: 'Yapay zeka / render', v: 'gpu', icon: 'cpu' },
    ],
  },
  {
    key: 'scale',
    q: 'Beklediğiniz büyüklük nedir?',
    opts: [
      { l: 'Küçük · yeni başlıyorum', v: 'small', icon: 'star' },
      { l: 'Orta · büyüyen işletme', v: 'mid', icon: 'scale' },
      { l: 'Büyük · kurumsal ölçek', v: 'big', icon: 'layers' },
    ],
  },
  {
    key: 'ctrl',
    q: 'Teknik kontrol tercihiniz?',
    opts: [
      { l: 'Kolay olsun, panel yeter', v: 'easy', icon: 'gauge' },
      { l: 'Tam kontrol istiyorum (root)', v: 'root', icon: 'terminal' },
    ],
  },
];

export function recommend(a = {}) {
  if (a.use === 'gpu') {
    return { slug: '/gpu-sunucu', name: 'GPU Sunucu', why: 'Yapay zeka ve render iş yükleriniz için GPU hızlandırmalı sunucu en doğru seçim.' };
  }
  if (a.use === 'app' || a.ctrl === 'root') {
    return a.scale === 'big'
      ? { slug: '/dedicated-sunucu', name: 'Dedicated Sunucu', why: 'Tam kontrol ve büyük ölçek için tüm kaynakları size ait fiziksel sunucu.' }
      : { slug: '/sanal-sunucu', name: 'Sanal Sunucu (VDS)', why: 'Root erişimli, ölçeklenebilir ve uygun maliyetli sanal sunucu size göre.' };
  }
  if (a.use === 'ecom' || a.scale === 'big') {
    return { slug: '/kurumsal-hosting', name: 'Kurumsal Hosting', why: 'Yüksek trafik ve izole kaynak ihtiyacınız için kurumsal hosting ideal.' };
  }
  return { slug: '/web-hosting', name: 'Web Hosting', why: 'Web siteniz için hızlı, güvenli ve yönetimi kolay hosting yeterli olacaktır.' };
}
