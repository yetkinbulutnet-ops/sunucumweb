const ANAHTAR = 'swb_hata_yenileme';

export const surumHatasiMi = (h) => /ChunkLoadError|Loading (CSS )?chunk|dynamically imported module|Failed to fetch|server action|deployment/i.test(`${h?.name || ''} ${h?.message || ''}`);

export const birKezYenile = () => {
  try {
    const son = Number(sessionStorage.getItem(ANAHTAR) || 0);
    if (Date.now() - son < 30000) return false;
    sessionStorage.setItem(ANAHTAR, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};
