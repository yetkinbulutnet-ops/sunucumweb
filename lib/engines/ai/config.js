import 'server-only';

/**
 * AI yapilandirmasi. GROQ_API_KEY SADECE burada okunur.
 * 'server-only' importu sayesinde bu dosya yanlislikla bir client bileseninden
 * import edilirse build HATA verir -> anahtar tarayiciya asla sizamaz.
 */

export const AI = {
  baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  get apiKey() {
    return process.env.GROQ_API_KEY || '';
  },
  models: {
    // Kaliteli akil yurutme (alan adi uretimi burada)
    smart: process.env.GROQ_MODEL_SMART || 'openai/gpt-oss-120b',
    // Hizli/ucuz isler
    fast: process.env.GROQ_MODEL_FAST || 'openai/gpt-oss-20b',
    // json_schema desteklemeyen durumlar icin yedek
    fallback: process.env.GROQ_MODEL_FALLBACK || 'llama-3.3-70b-versatile',
  },
  timeoutMs: Number(process.env.GROQ_TIMEOUT_MS || 20000),
};

export const isAiConfigured = () => AI.apiKey.length > 10;
