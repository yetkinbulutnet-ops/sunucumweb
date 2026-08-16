import 'server-only';

export const AI = {
  baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  get apiKey() {
    return process.env.GROQ_API_KEY || '';
  },
  models: {

    smart: process.env.GROQ_MODEL_SMART || 'openai/gpt-oss-120b',

    fast: process.env.GROQ_MODEL_FAST || 'openai/gpt-oss-20b',

    fallback: process.env.GROQ_MODEL_FALLBACK || 'llama-3.3-70b-versatile',
  },
  timeoutMs: Number(process.env.GROQ_TIMEOUT_MS || 20000),
};

export const isAiConfigured = () => AI.apiKey.length > 10;
