/**
 * Motor acma/kapama anahtarlari.
 * .env icinde ENGINE_DOMAIN_AI=0 yazmak o motoru kapatir; site calismaya devam eder,
 * UI ilgili bolumu gizler. AI katmanindan bagimsizdir ki AI kullanmayan motorlar da
 * bu dosyayi kullanabilsin.
 */
export const isEngineEnabled = (envName) => process.env[envName] !== '0';
