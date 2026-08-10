import { GoogleGenAI } from '@google/genai';

function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY
  );
}

const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: false,
      error: 'GET method not supported on /api/gemini/generate. Please send a POST request with a prompt.',
    });
  }

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        error: 'GEMINI_API_KEY environment variable is missing in Vercel settings. Please set GEMINI_API_KEY in your Vercel Project Environment Variables.',
        result: null,
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { prompt, systemInstruction, temperature, jsonMode } = body;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const config: any = {};
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (temperature !== undefined) config.temperature = Number(temperature);
    if (jsonMode) config.responseMimeType = 'application/json';

    let lastError: any = null;
    let responseText: string | null = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt || 'Hello',
          config: Object.keys(config).length > 0 ? config : undefined,
        });
        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[Gemini API] Model ${modelName} failed: ${err.message}`);
        lastError = err;
      }
    }

    if (responseText !== null) {
      return res.status(200).json({
        success: true,
        result: responseText,
        model: 'PharmAI Engine',
      });
    }

    return res.status(200).json({
      success: false,
      error: (lastError && lastError.message) || 'Failed to call Gemini AI API.',
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      error: err.message || 'Server error calling Gemini AI API.',
    });
  }
}
