function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY
  );
}

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = getApiKey();
    return res.status(200).json({
      hasKey: !!apiKey,
      model: 'PharmAI Engine',
    });
  } catch (err: any) {
    return res.status(200).json({
      hasKey: false,
      error: err.message || 'Status check failed',
    });
  }
}
