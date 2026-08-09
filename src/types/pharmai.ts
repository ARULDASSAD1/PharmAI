export type ToxicityRisk = string;

export interface PubMedCitation {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  bioBertConfidence: number;
  summary: string;
  pmid: string;
}

export interface ToxicityBreakdown {
  hepatotoxicity: number; // 0-100 (lower is safer)
  cardiotoxicity: number;
  nephrotoxicity: number;
  renalToxicity?: number;
  neurotoxicity?: number;
  overallSafetyScore: number; // 0-100 (higher is safer)
}

export interface ClinicalProtocol {
  phase: string;
  recommendedDosage: string;
  targetPatientCohort: string;
  primaryEndpoints: string[];
  suggestedBiomarkers: string[];
  estimatedDurationMonths: number;
}

export interface DrugCandidate {
  id: string;
  name: string;
  smiles: string;
  formula: string;
  molecularWeight: number;
  originalIndication: string;
  originalCategory: string;
  repurposedIndication: string;
  targetDiseaseId?: string;
  aiMatchScore: number; // e.g. 93
  targetGene: string;
  bindingEnergy: string; // e.g. "-8.8 kcal/mol"
  toxicityStatus: ToxicityRisk;
  toxicityBreakdown: ToxicityBreakdown;
  literatureCount: number;
  citations?: PubMedCitation[];
  protocol: ClinicalProtocol;
  mechanismSummary?: string;
  mechanismOfAction?: string;
  structureCoordinates?: { x: number; y: number; element: string }[];
}

export interface DiseaseTarget {
  id: string;
  name: string;
  category: string;
  affectedPopulation: string;
  keyProteins: string[];
  gnnEmbeddingsCount: number;
  description: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'disease' | 'protein' | 'drug';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  affinity?: string;
  description?: string;
  category?: string;
  score?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  affinity?: string;
  type?: 'targets' | 'inhibits' | 'repurposed_for' | 'interacts';
  weight?: number;
}

export interface FilterState {
  searchDisease: string;
  minScore: number;
  toxicityFilter: string;
  drugCategory: string;
}
