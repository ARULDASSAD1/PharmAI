import { GoogleGenAI } from '@google/genai';
import { generateRepurposingSuite } from '../../src/utils/repurposingEngine';

function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY
  );
}

const CANDIDATE_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];

export default async function handler(req: any, res: any) {
  // CORS & Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const diseaseName = body.diseaseName;

    if (!diseaseName || typeof diseaseName !== 'string') {
      return res.status(200).json({ success: false, error: 'diseaseName parameter is required.' });
    }

    const apiKey = getApiKey();

    // If no API Key is set in Vercel, return high-fidelity fallback immediately
    if (!apiKey) {
      const fallbackData = generateRepurposingSuite(diseaseName);
      return res.status(200).json({
        success: true,
        data: fallbackData,
        source: 'smart-repurposing-engine',
      });
    }

    // Call Gemini with a 7-second hard limit to prevent Vercel Serverless Function 10s timeout
    const fetchGeminiSuite = async () => {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `As a PharmAI Graph Neural Network (GNN) and Molecular Biology engine, generate a comprehensive drug repurposing analysis for the disease target: "${diseaseName}".
Provide 3 to 4 realistic, scientifically plausible FDA-approved or clinical-stage drug candidates that could be repurposed for "${diseaseName}".
Include precise SMILES strings, binding energy (ΔG e.g. "-9.2 kcal/mol"), target genes, concise mechanism of action, toxicity breakdown, clinical trial protocols, and knowledge graph nodes/edges. Keep text concise.

Return ONLY a valid JSON object matching this schema:
{
  "disease": {
    "id": "slug-id",
    "name": "${diseaseName}",
    "category": "Oncology",
    "affectedPopulation": "320K diagnoses annually",
    "keyProteins": ["ProteinA", "ProteinB"],
    "gnnEmbeddingsCount": 320000,
    "description": "Clinical overview of ${diseaseName}"
  },
  "candidates": [
    {
      "id": "drug-slug",
      "name": "Drug Name",
      "smiles": "Valid Canonical SMILES",
      "formula": "Chemical Formula",
      "molecularWeight": 353.4,
      "originalIndication": "Original Disease",
      "originalCategory": "Drug Class",
      "repurposedIndication": "Repurposed Target in ${diseaseName}",
      "aiMatchScore": 92,
      "bindingEnergy": "-9.2 kcal/mol",
      "targetGene": "GENE_SYMBOL",
      "toxicityStatus": "FDA Approved - Low Safety Risk",
      "literatureCount": 185,
      "mechanismOfAction": "Mechanism of action",
      "toxicityBreakdown": {
        "hepatotoxicity": 14,
        "cardiotoxicity": 9,
        "nephrotoxicity": 11,
        "overallSafetyScore": 88
      },
      "protocol": {
        "phase": "Phase 2a",
        "recommendedDosage": "250 mg BID",
        "estimatedDurationMonths": 12,
        "targetPatientCohort": "Cohort description",
        "primaryEndpoints": ["Endpoint 1"],
        "suggestedBiomarkers": ["Biomarker 1"]
      }
    }
  ],
  "graphNodes": [
    { "id": "dis-1", "label": "${diseaseName}", "type": "disease", "category": "Target Disease" },
    { "id": "p-1", "label": "Key Protein Target", "type": "protein", "category": "Target Pathway" },
    { "id": "d-1", "label": "Drug Candidate 1", "type": "drug", "category": "Small Molecule" }
  ],
  "graphEdges": [
    { "source": "d-1", "target": "p-1", "label": "Inhibits", "weight": 0.92 },
    { "source": "p-1", "target": "dis-1", "label": "Drives Disease", "weight": 0.88 }
  ]
}`;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
              maxOutputTokens: 3500,
            },
          });

          let rawText = (response.text || '').trim();
          if (rawText.startsWith('```json')) {
            rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const data = JSON.parse(rawText);
          if (data && data.disease && data.candidates && data.candidates.length > 0) {
            return data;
          }
        } catch (err: any) {
          console.warn(`[Repurpose API] Model ${modelName} failed: ${err.message}`);
        }
      }
      return null;
    };

    // 7.5s Timeout Guard for Vercel Serverless
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 7500));

    const resultData: any = await Promise.race([fetchGeminiSuite(), timeoutPromise]);

    if (resultData) {
      // Enrich graphNodes
      if (Array.isArray(resultData.graphNodes)) {
        resultData.graphNodes = resultData.graphNodes.map((n: any) => {
          if (n.type === 'drug') {
            const matchedCand = resultData.candidates.find((c: any) =>
              c.id === n.id.replace('drug-', '') ||
              c.name.toLowerCase() === n.label.toLowerCase() ||
              n.id.includes(c.id) ||
              n.label.toLowerCase().includes(c.name.toLowerCase())
            );
            const score = n.score ?? matchedCand?.aiMatchScore ?? 88;
            const category = (n.category && !n.category.toLowerCase().includes('small molecule'))
              ? n.category
              : matchedCand?.originalCategory || matchedCand?.originalIndication || 'Repurposed Drug';
            return { ...n, score, category };
          }
          return n;
        });
      }

      return res.status(200).json({
        success: true,
        data: resultData,
        source: 'pharmai-gnn-engine',
      });
    }

    // Fallback if Gemini timed out or failed
    const fallbackData = generateRepurposingSuite(diseaseName);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      source: 'smart-repurposing-engine',
    });
  } catch (err: any) {
    // Never crash or return 500; always return status 200 with fallback data
    console.error('[Repurpose API] Unhandled error:', err);
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const fallbackData = generateRepurposingSuite(body.diseaseName || 'Custom Target');
      return res.status(200).json({
        success: true,
        data: fallbackData,
        source: 'smart-fallback-engine',
      });
    } catch {
      return res.status(200).json({
        success: false,
        error: 'Error processing request.',
      });
    }
  }
}
