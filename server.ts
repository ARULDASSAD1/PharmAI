import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateRepurposingSuite } from './src/utils/repurposingEngine';

dotenv.config();

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Endpoints
  app.get('/api/gemini/status', (req, res) => {
    res.json({
      hasKey: !!process.env.GEMINI_API_KEY,
      model: 'gemini-3.6-flash',
    });
  });

  app.post('/api/gemini/generate', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        error: 'GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.',
        result: null,
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const { prompt, systemInstruction, temperature, jsonMode } = req.body;

      const config: any = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (temperature !== undefined) config.temperature = Number(temperature);
      if (jsonMode) config.responseMimeType = 'application/json';

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt || 'Hello',
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      res.json({
        success: true,
        result: response.text,
        model: 'gemini-3.6-flash',
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to call AI API',
      });
    }
  });

  // Endpoint: AI-Powered Disease Drug Repurposing Predictor
  app.post('/api/repurpose/predict', async (req, res) => {
    const { diseaseName } = req.body;
    if (!diseaseName || typeof diseaseName !== 'string') {
      return res.status(400).json({ success: false, error: 'diseaseName parameter is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If API Key is missing, use smart fallback generator immediately
    if (!apiKey) {
      console.log(`[Repurpose API] No GEMINI_API_KEY found. Generating smart suite for "${diseaseName}"`);
      const fallbackData = generateRepurposingSuite(diseaseName);
      return res.json({
        success: true,
        data: fallbackData,
        source: 'smart-repurposing-engine',
      });
    }

    // 2. Try Gemini 3.6 Flash API
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `As a PharmAI Graph Neural Network (GNN) and Molecular Biology engine, generate a comprehensive drug repurposing analysis for the disease target: "${diseaseName}".
Provide 4 to 5 realistic, scientifically plausible FDA-approved or clinical-stage drug candidate molecules that could be repurposed for "${diseaseName}".
Include precise SMILES strings, binding energy (ΔG in kcal/mol like "-9.8"), target genes, concise mechanism of action, toxicity breakdown, clinical trial protocols, and knowledge graph nodes/edges for visualization. Keep descriptions concise to maintain valid JSON output.

Return ONLY a valid JSON object following this exact schema:
{
  "disease": {
    "id": "slug-id",
    "name": "${diseaseName}",
    "category": "Oncology",
    "affectedPopulation": "320K diagnoses annually",
    "keyProteins": ["ProteinA", "ProteinB", "ProteinC"],
    "gnnEmbeddingsCount": 320000,
    "description": "Clinical overview of ${diseaseName}"
  },
  "candidates": [
    {
      "id": "drug-slug",
      "name": "Drug Name",
      "smiles": "Valid Canonical SMILES string",
      "formula": "Chemical Formula e.g. C16H19N3O4S",
      "molecularWeight": 353.4,
      "originalIndication": "Original Approved Disease",
      "originalCategory": "Drug Class",
      "repurposedIndication": "Repurposed Indication in ${diseaseName}",
      "aiMatchScore": 92,
      "bindingEnergy": "-9.2 kcal/mol",
      "targetGene": "GENE_SYMBOL",
      "toxicityStatus": "FDA Approved - Low Safety Risk",
      "literatureCount": 185,
      "mechanismOfAction": "Concise mechanism description in ${diseaseName}",
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
        "primaryEndpoints": ["Endpoint 1", "Endpoint 2"],
        "suggestedBiomarkers": ["Biomarker 1", "Biomarker 2"]
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

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      });

      let rawText = (response.text || '').trim();
      if (rawText.startsWith('```json')) {
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedData = JSON.parse(rawText);
      if (!parsedData.disease || !parsedData.candidates || parsedData.candidates.length === 0) {
        throw new Error('Incomplete data structure from Gemini model.');
      }

      // Enrich graphNodes to include proper score and category fields
      if (Array.isArray(parsedData.graphNodes)) {
        parsedData.graphNodes = parsedData.graphNodes.map((n: any) => {
          if (n.type === 'drug') {
            const matchedCand = parsedData.candidates.find((c: any) =>
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

      res.json({
        success: true,
        data: parsedData,
        source: 'gemini-3.6-flash',
      });
    } catch (err: any) {
      console.warn(`[Repurpose API] Gemini call failed (${err.message}). Using fallback generator for "${diseaseName}"`);
      const fallbackData = generateRepurposingSuite(diseaseName);
      res.json({
        success: true,
        data: fallbackData,
        source: 'smart-fallback-engine',
      });
    }
  });

  // Serve static assets in production vs Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Express full-stack server running on http://localhost:${port}`);
  });
}

startServer();
