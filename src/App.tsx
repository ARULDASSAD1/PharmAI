import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchAndFilters } from './components/SearchAndFilters';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { AiMetricsPanel } from './components/AiMetricsPanel';
import { DrugGrid } from './components/DrugGrid';
import { DrugDetailModal } from './components/DrugDetailModal';
import { AboutModal } from './components/AboutModal';
import { DatasetStatsModal } from './components/DatasetStatsModal';
import { ExportModal } from './components/ExportModal';
import { ComparisonModal } from './components/ComparisonModal';
import { PubChemModal } from './components/PubChemModal';
import { Dna, Loader2, Sparkles, CheckCircle2, Database } from 'lucide-react';

import { DISEASES, DRUG_CANDIDATES, MOCK_GRAPH_NODES } from './data/mockData';
import { DrugCandidate, FilterState, DiseaseTarget, GraphNode, GraphEdge } from './types/pharmai';
import { generateRepurposingSuite } from './utils/repurposingEngine';
import { loadSavedPredictions, savePredictionSuite } from './utils/predictionStorage';

export default function App() {
  // Selected Target Disease ID (default: 'breast-cancer')
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('breast-cancer');

  // Dynamic Custom Diseases & Candidates generated on the fly via AI
  const [customDiseases, setCustomDiseases] = useState<DiseaseTarget[]>([]);
  const [customCandidates, setCustomCandidates] = useState<Record<string, DrugCandidate[]>>({});
  const [customGraphs, setCustomGraphs] = useState<Record<string, { nodes: GraphNode[]; edges: GraphEdge[] }>>({});

  // On mount: restore all cached predictions from persistent local storage
  useEffect(() => {
    const savedMap = loadSavedPredictions();
    const loadedDiseases: DiseaseTarget[] = [];
    const loadedCandidates: Record<string, DrugCandidate[]> = {};
    const loadedGraphs: Record<string, { nodes: GraphNode[]; edges: GraphEdge[] }> = {};

    Object.entries(savedMap).forEach(([id, suite]) => {
      if (suite.disease) {
        loadedDiseases.push(suite.disease);
        loadedCandidates[id] = suite.candidates || [];
        loadedGraphs[id] = {
          nodes: suite.graphNodes || [],
          edges: suite.graphEdges || [],
        };
      }
    });

    if (loadedDiseases.length > 0) {
      setCustomDiseases(loadedDiseases);
      setCustomCandidates((prev) => ({ ...prev, ...loadedCandidates }));
      setCustomGraphs((prev) => ({ ...prev, ...loadedGraphs }));
    }
  }, []);

  // Prediction loading state
  const [predictingLoading, setPredictingLoading] = useState<boolean>(false);
  const [predictingDiseaseName, setPredictingDiseaseName] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchDisease: 'Breast Cancer',
    minScore: 70,
    toxicityFilter: 'All',
    drugCategory: 'All',
  });

  // Selected candidate highlighted in Knowledge Graph
  const [selectedCandidate, setSelectedCandidate] = useState<DrugCandidate | null>(null);

  // Modal States
  const [detailModalCandidate, setDetailModalCandidate] = useState<DrugCandidate | null>(null);
  const [compareModalCandidate, setCompareModalCandidate] = useState<DrugCandidate | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isPubChemOpen, setIsPubChemOpen] = useState<boolean>(false);

  // Gemini AI state
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  // All Diseases List (Static + Dynamic AI Predicted)
  const allDiseases = useMemo(() => {
    return [...DISEASES, ...customDiseases];
  }, [customDiseases]);

  // Active Disease Target Object
  const currentDisease = useMemo(() => {
    return allDiseases.find((d) => d.id === selectedDiseaseId) || allDiseases[0];
  }, [allDiseases, selectedDiseaseId]);

  // All Candidates for Current Disease
  const allCandidatesForDisease = useMemo(() => {
    if (customCandidates[selectedDiseaseId]) {
      return customCandidates[selectedDiseaseId];
    }
    return DRUG_CANDIDATES[selectedDiseaseId] || DRUG_CANDIDATES['breast-cancer'];
  }, [customCandidates, selectedDiseaseId]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return allCandidatesForDisease.filter((cand) => {
      // 1. Min Score
      if (cand.aiMatchScore < filters.minScore) return false;

      // 2. Safety / Toxicity Filter
      if (filters.toxicityFilter !== 'All') {
        if (filters.toxicityFilter === 'Low Toxicity / FDA Safe' && !cand.toxicityStatus.includes('FDA Approved')) return false;
        if (filters.toxicityFilter === 'Mild Warning' && !cand.toxicityStatus.includes('Mild')) return false;
        if (filters.toxicityFilter === 'High Risk' && !cand.toxicityStatus.includes('Cardiotoxicity') && !cand.toxicityStatus.includes('Alert')) return false;
      }

      // 3. Category Filter
      if (filters.drugCategory !== 'All' && cand.originalCategory !== filters.drugCategory) {
        return false;
      }

      return true;
    });
  }, [allCandidatesForDisease, filters]);

  // Graph Nodes & Edges
  const graphData = useMemo(() => {
    if (customGraphs[selectedDiseaseId]) {
      return customGraphs[selectedDiseaseId];
    }
    return MOCK_GRAPH_NODES[selectedDiseaseId] || MOCK_GRAPH_NODES['breast-cancer'];
  }, [customGraphs, selectedDiseaseId]);

  // Handle disease selection change
  const handleSelectDisease = (diseaseId: string) => {
    setSelectedDiseaseId(diseaseId);
    setSelectedCandidate(null);
    setGeminiResponse(null);
    const targetDisease = allDiseases.find((d) => d.id === diseaseId);
    if (targetDisease) {
      setFilters((prev) => ({
        ...prev,
        searchDisease: targetDisease.name,
        minScore: 50,
        toxicityFilter: 'All',
        drugCategory: 'All',
      }));
    }
  };

  // AI-powered Live Disease Search & Drug Repurposing Discovery
  const handleSearchAndPredictDisease = async (diseaseName: string) => {
    const trimmed = diseaseName.trim();
    if (!trimmed) return;

    const targetSlug = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // 1. Check if disease is already present in active state or static list
    const existing = allDiseases.find(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase() || d.id === targetSlug
    );

    if (existing && (DRUG_CANDIDATES[existing.id] || customCandidates[existing.id])) {
      handleSelectDisease(existing.id);
      return;
    }

    // 2. Check local storage cache for pre-saved predictions
    const savedMap = loadSavedPredictions();
    if (savedMap[targetSlug] || savedMap[trimmed.toLowerCase()]) {
      const cachedSuite = savedMap[targetSlug] || savedMap[trimmed.toLowerCase()];
      const diseaseId = cachedSuite.disease.id || targetSlug;

      setCustomDiseases((prev) => [cachedSuite.disease, ...prev.filter((d) => d.id !== diseaseId)]);
      setCustomCandidates((prev) => ({
        ...prev,
        [diseaseId]: cachedSuite.candidates || [],
      }));
      setCustomGraphs((prev) => ({
        ...prev,
        [diseaseId]: {
          nodes: cachedSuite.graphNodes || [],
          edges: cachedSuite.graphEdges || [],
        },
      }));

      handleSelectDisease(diseaseId);
      return;
    }

    // 3. Generate repurposing suite via backend API or AI engine
    setPredictingLoading(true);
    setPredictingDiseaseName(trimmed);

    try {
      let suiteData: { disease: DiseaseTarget; candidates: DrugCandidate[]; graphNodes: GraphNode[]; graphEdges: GraphEdge[] };

      try {
        const response = await fetch('/api/repurpose/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ diseaseName: trimmed }),
        });

        const resData = await response.json();
        if (resData.success && resData.data && resData.data.candidates && resData.data.candidates.length > 0) {
          suiteData = resData.data;
        } else {
          suiteData = generateRepurposingSuite(trimmed);
        }
      } catch {
        suiteData = generateRepurposingSuite(trimmed);
      }

      const { disease, candidates, graphNodes, graphEdges } = suiteData;

      // Assign safe ID if not present
      const diseaseId = disease.id || targetSlug;
      const normalizedDisease: DiseaseTarget = {
        id: diseaseId,
        name: disease.name || trimmed,
        category: disease.category || 'Target Indication',
        affectedPopulation: disease.affectedPopulation || 'Significant Global Burden',
        keyProteins: disease.keyProteins || ['Primary Receptor', 'Kinase Pathway'],
        gnnEmbeddingsCount: disease.gnnEmbeddingsCount || 350000,
        description: disease.description || `AI-analyzed repurposing targets for ${trimmed}.`,
      };

      // Save to local persistent storage cache
      savePredictionSuite(diseaseId, {
        disease: normalizedDisease,
        candidates: candidates || [],
        graphNodes: graphNodes || [],
        graphEdges: graphEdges || [],
      });

      // Add to custom state
      setCustomDiseases((prev) => [normalizedDisease, ...prev.filter((d) => d.id !== diseaseId)]);
      setCustomCandidates((prev) => ({
        ...prev,
        [diseaseId]: candidates || [],
      }));
      setCustomGraphs((prev) => ({
        ...prev,
        [diseaseId]: {
          nodes: graphNodes || [],
          edges: graphEdges || [],
        },
      }));

      // Switch view to newly predicted disease & reset filters
      setSelectedDiseaseId(diseaseId);
      setSelectedCandidate(null);
      setGeminiResponse(null);
      setFilters({
        searchDisease: normalizedDisease.name,
        minScore: 50,
        toxicityFilter: 'All',
        drugCategory: 'All',
      });
    } catch (err: any) {
      alert(`Error predicting drug repurposing for "${trimmed}": ${err.message}`);
    } finally {
      setPredictingLoading(false);
      setPredictingDiseaseName(null);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Call server-side Gemini API (/api/gemini/generate)
  const handleAskGemini = async (customPrompt?: string) => {
    const promptToRun =
      customPrompt ||
      `Provide a concise, high-impact biomedical mechanism hypothesis for repurposing drugs to treat ${currentDisease.name}. Explain binding affinities and target pathway interactions.`;

    setGeminiLoading(true);
    setGeminiError(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToRun,
          systemInstruction:
            'You are PharmAI, an expert AI Bio-Informatics Scientist specializing in GNN drug repurposing, binding affinities, and oncology mechanism analysis.',
          temperature: 0.3,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setGeminiError(data.error || 'Failed to generate AI response.');
      } else {
        setGeminiResponse(data.result);
      }
    } catch (err: any) {
      setGeminiError(err.message || 'Network error connecting to AI service.');
    } finally {
      setGeminiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenDocs={() => setIsAboutOpen(true)}
        onOpenPubChem={() => setIsPubChemOpen(true)}
      />

      {/* Search & Filters Controls Banner */}
      <SearchAndFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedDiseaseId={selectedDiseaseId}
        onSelectDisease={handleSelectDisease}
        onSearchAndPredict={handleSearchAndPredictDisease}
        allDiseases={allDiseases}
        predictingLoading={predictingLoading}
        activeCandidatesCount={filteredCandidates.length}
        totalCandidatesCount={allCandidatesForDisease.length}
      />

      {/* AI Disease Repurposing Prediction Loading Modal */}
      {predictingLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-cyan-800/80 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-cyan-950/80 animate-fade-in font-mono">
            <div className="relative inline-flex items-center justify-center p-5 rounded-3xl bg-cyan-950/90 border border-cyan-800 text-cyan-300">
              <Dna className="w-10 h-10 animate-spin text-cyan-400" />
              <Sparkles className="w-5 h-5 text-emerald-400 absolute -top-2 -right-2 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">
                Predicting Repurposing Suite for
              </h3>
              <p className="text-cyan-300 font-extrabold text-base bg-cyan-950/60 py-1.5 px-3 rounded-xl border border-cyan-800">
                "{predictingDiseaseName}"
              </p>
            </div>

            <div className="space-y-3 text-left text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Searching NIH PubChem & ChEMBL Bioactivity DB...</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Computing GNN Graph Embeddings (Gemini 3.6 Flash)...</span>
              </div>
              <div className="flex items-center space-x-2 text-teal-300">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Evaluating In-Silico Toxicity & Clinical Protocols...</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Executing PharmAI Graph Neural Network Pipeline
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* MAIN DASHBOARD: 2-COLUMN SPLIT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN (60% width - 7/12 cols on lg) */}
          <div className="lg:col-span-7 h-full min-h-[460px]">
            <KnowledgeGraph
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedDrugId={selectedCandidate?.id || null}
              onSelectDrug={(drugId) => {
                const found = allCandidatesForDisease.find((c) => c.id === drugId);
                if (found) setSelectedCandidate(found);
              }}
              diseaseTitle={currentDisease.name}
              candidates={allCandidatesForDisease}
            />
          </div>

          {/* RIGHT COLUMN (40% width - 5/12 cols on lg) */}
          <div className="lg:col-span-5 h-full">
            <AiMetricsPanel
              diseaseName={currentDisease.name}
              selectedDrugName={selectedCandidate?.name}
              onAskGemini={handleAskGemini}
              geminiLoading={geminiLoading}
              geminiResponse={geminiResponse}
              geminiError={geminiError}
            />
          </div>
        </div>

        {/* RANKED REPURPOSED DRUG CANDIDATES SECTION */}
        <DrugGrid
          candidates={filteredCandidates}
          selectedCandidateId={selectedCandidate?.id || null}
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          onOpenModal={(cand) => setDetailModalCandidate(cand)}
          diseaseName={currentDisease.name}
        />
      </main>

      {/* MODALS */}
      {/* 1. Drug Detail Technical Modal */}
      <DrugDetailModal
        candidate={detailModalCandidate}
        onClose={() => setDetailModalCandidate(null)}
        onAskGemini={handleAskGemini}
        geminiLoading={geminiLoading}
        geminiResponse={geminiResponse}
        onOpenCompare={(cand) => {
          setDetailModalCandidate(null);
          setCompareModalCandidate(cand);
        }}
      />

      {/* Comparison Modal triggered from Detail view */}
      {compareModalCandidate && (
        <ComparisonModal
          candidates={filteredCandidates}
          initialCandidateAId={compareModalCandidate.id}
          diseaseName={currentDisease.name}
          onClose={() => setCompareModalCandidate(null)}
          onOpenDetailModal={(cand) => {
            setCompareModalCandidate(null);
            setDetailModalCandidate(cand);
          }}
        />
      )}

      {/* 2. About PharmAI Engine Overlay */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* 3. Knowledge Graph Dataset Statistics Modal */}
      <DatasetStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />

      {/* 4. Export Repurposing Executive Report Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        diseaseName={currentDisease.name}
        candidates={filteredCandidates}
      />

      {/* 5. NIH PubChem DB Live Search Modal */}
      {isPubChemOpen && (
        <PubChemModal
          onClose={() => setIsPubChemOpen(false)}
        />
      )}
    </div>
  );
}
