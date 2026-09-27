import { m } from '@/lib/metin';

export const ENGINE = { id: 'product-finder' };

export const QUESTIONS = () => [
  {
    key: 'use',
    q: m('urunbulucu.s1_soru'),
    opts: [
      { l: m('urunbulucu.s1_web'), v: 'web', icon: 'globe' },
      { l: m('urunbulucu.s1_ecom'), v: 'ecom', icon: 'layers' },
      { l: m('urunbulucu.s1_app'), v: 'app', icon: 'server' },
      { l: m('urunbulucu.s1_gpu'), v: 'gpu', icon: 'cpu' },
    ],
  },
  {
    key: 'scale',
    q: m('urunbulucu.s2_soru'),
    opts: [
      { l: m('urunbulucu.s2_small'), v: 'small', icon: 'star' },
      { l: m('urunbulucu.s2_mid'), v: 'mid', icon: 'scale' },
      { l: m('urunbulucu.s2_big'), v: 'big', icon: 'layers' },
    ],
  },
  {
    key: 'ctrl',
    q: m('urunbulucu.s3_soru'),
    opts: [
      { l: m('urunbulucu.s3_easy'), v: 'easy', icon: 'gauge' },
      { l: m('urunbulucu.s3_root'), v: 'root', icon: 'terminal' },
    ],
  },
];

export function recommend(a = {}) {
  if (a.use === 'gpu') {
    return { slug: '/gpu-sunucu', name: m('urunbulucu.gpu_ad'), why: m('urunbulucu.gpu_neden') };
  }
  if (a.use === 'app' || a.ctrl === 'root') {
    return a.scale === 'big'
      ? { slug: '/dedicated-sunucu', name: m('urunbulucu.dedicated_ad'), why: m('urunbulucu.dedicated_neden') }
      : { slug: '/sanal-sunucu', name: m('urunbulucu.vds_ad'), why: m('urunbulucu.vds_neden') };
  }
  if (a.use === 'ecom' || a.scale === 'big') {
    return { slug: '/kurumsal-hosting', name: m('urunbulucu.kurumsal_ad'), why: m('urunbulucu.kurumsal_neden') };
  }
  return { slug: '/web-hosting', name: m('urunbulucu.web_ad'), why: m('urunbulucu.web_neden') };
}
