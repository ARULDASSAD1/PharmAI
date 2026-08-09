import { DiseaseTarget, DrugCandidate, GraphNode, GraphEdge } from '../types/pharmai';

const STORAGE_KEY = 'pharmai_predictions_v1';

export interface SavedPredictionSuite {
  disease: DiseaseTarget;
  candidates: DrugCandidate[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  savedAt: string;
}

export function loadSavedPredictions(): Record<string, SavedPredictionSuite> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load predictions from local cache:', e);
    return {};
  }
}

export function savePredictionSuite(
  diseaseId: string,
  suite: {
    disease: DiseaseTarget;
    candidates: DrugCandidate[];
    graphNodes: GraphNode[];
    graphEdges: GraphEdge[];
  }
): void {
  try {
    const existing = loadSavedPredictions();
    existing[diseaseId] = {
      ...suite,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save prediction suite to local cache:', e);
  }
}

export function clearSavedPredictions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear predictions:', e);
  }
}
