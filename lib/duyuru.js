export const DUYURU_ANAHTARI = 'swb_duyuru_kapali';

export const DUYURU_ON_BETIK = `try{var k=localStorage.getItem('${DUYURU_ANAHTARI}');if(k)document.documentElement.setAttribute('data-duyuru-kapali',k)}catch(e){}`;
