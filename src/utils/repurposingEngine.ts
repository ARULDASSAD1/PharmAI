import { DiseaseTarget, DrugCandidate, GraphEdge, GraphNode } from '../types/pharmai';

export interface RepurposingSuite {
  disease: DiseaseTarget;
  candidates: DrugCandidate[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
}

export function generateRepurposingSuite(diseaseName: string): RepurposingSuite {
  const cleanName = diseaseName.trim().charAt(0).toUpperCase() + diseaseName.trim().slice(1);
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'custom-disease';
  const lower = cleanName.toLowerCase();

  // Specific high-fidelity domain profiles for popular searched diseases
  if (lower.includes('brain') || lower.includes('glioma') || lower.includes('glioblastoma')) {
    return generateBrainCancerSuite(slug, cleanName);
  }

  if (lower.includes('lung')) {
    return generateLungCancerSuite(slug, cleanName);
  }

  if (lower.includes('colon') || lower.includes('colorectal')) {
    return generateColonCancerSuite(slug, cleanName);
  }

  if (lower.includes('multiple sclerosis') || lower.includes('ms')) {
    return generateMSSuite(slug, cleanName);
  }

  // Generic/Universal Disease Generator for ANY searched disease
  return generateGenericSuite(slug, cleanName);
}

function generateBrainCancerSuite(slug: string, cleanName: string): RepurposingSuite {
  const disease: DiseaseTarget = {
    id: slug,
    name: cleanName,
    category: 'Neuro-Oncology',
    affectedPopulation: '320K diagnoses annually',
    keyProteins: ['EGFRvIII Mutation', 'MGMT Promoter', 'mTOR / AMPK', 'IDH1 Wildtype', 'PDGFRα'],
    gnnEmbeddingsCount: 420000,
    description: `Primary central nervous system malignancy characterized by infiltrative growth, blood-brain barrier impermeability, and resistance to standard alkylating therapies.`
  };

  const candidates: DrugCandidate[] = [
    {
      id: `${slug}-disulfiram`,
      name: 'Disulfiram',
      smiles: 'CCN(CC)C(=S)SSC(=S)N(CC)CC',
      formula: 'C10H20N2S4',
      molecularWeight: 296.54,
      originalIndication: 'Alcohol Dependency',
      originalCategory: 'Psychiatric / FDA Approved',
      repurposedIndication: `NPL4 complex inhibition & proteasome clearance in ${cleanName}`,
      aiMatchScore: 96,
      bindingEnergy: '-9.6 kcal/mol',
      targetGene: 'NPL4 / ALDH1A1 / NF-kB',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 248,
      mechanismOfAction: `Crosses the Blood-Brain Barrier (BBB). Forms a copper complex (CuET) that targets NPL4, causing proteotoxic stress and stem cell clearance in glioma stem-like cells.`,
      toxicityBreakdown: { hepatotoxicity: 18, cardiotoxicity: 10, nephrotoxicity: 12, overallSafetyScore: 90 },
      protocol: {
        phase: 'Phase 2b Clinical Trial',
        recommendedDosage: '500 mg daily + Copper Gluconate (2 mg BID)',
        estimatedDurationMonths: 18,
        targetPatientCohort: `Patients with recurrent Grade IV ${cleanName} with unmethylated MGMT`,
        primaryEndpoints: ['6-Month Progression-Free Survival (PFS6)', 'MRI T1-contrast Tumor Regression'],
        suggestedBiomarkers: ['NPL4 protein aggregates in CSF', 'Serum Copper Levels', 'ALDH1A1 Expression']
      }
    },
    {
      id: `${slug}-metformin`,
      name: 'Metformin',
      smiles: 'CN(C)C(=N)N=C(N)N',
      formula: 'C4H11N5',
      molecularWeight: 129.16,
      originalIndication: 'Type 2 Diabetes',
      originalCategory: 'Metabolic / Antidiabetic',
      repurposedIndication: `AMPK metabolic axis activation & glioma stem cell suppression`,
      aiMatchScore: 92,
      bindingEnergy: '-9.2 kcal/mol',
      targetGene: 'AMPK / mTORC1 / Complex I',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 310,
      mechanismOfAction: `Activates AMPK pathway to downregulate mTORC1, suppressing mitochondrial oxidative phosphorylation in CD133+ tumor-initiating brain cancer stem cells.`,
      toxicityBreakdown: { hepatotoxicity: 8, cardiotoxicity: 6, nephrotoxicity: 10, overallSafetyScore: 95 },
      protocol: {
        phase: 'Phase 2a Efficacy Trial',
        recommendedDosage: '1000 mg BID oral extended release',
        estimatedDurationMonths: 12,
        targetPatientCohort: `Newly diagnosed ${cleanName} patients undergoing temozolomide chemoradiation`,
        primaryEndpoints: ['Overall Survival (OS)', 'Glioma Stem Cell Density Reduction'],
        suggestedBiomarkers: ['Phospho-AMPK alpha 1/2', 'Serum Lactate', 'Ki-67 Index']
      }
    },
    {
      id: `${slug}-itraconazole`,
      name: 'Itraconazole',
      smiles: 'CCC(C)AN1CCN(CC1)C2=CC=C(C=C2)N3C(=O)N(C(=O)N3)C(C)C',
      formula: 'C35H38Cl2N8O4',
      molecularWeight: 705.63,
      originalIndication: 'Antifungal',
      originalCategory: 'Antifungal',
      repurposedIndication: `Hedgehog (Smoothened) & mTOR signaling blockade`,
      aiMatchScore: 88,
      bindingEnergy: '-8.9 kcal/mol',
      targetGene: 'Smoothened (SMO) / VDAC1',
      toxicityStatus: 'FDA Approved - Mild Warning',
      literatureCount: 165,
      mechanismOfAction: `Inhibits Hedgehog signaling by directly binding Smoothened (SMO) and suppresses tumor angiogenesis by blocking VDAC1 in ${cleanName} microvessels.`,
      toxicityBreakdown: { hepatotoxicity: 24, cardiotoxicity: 22, nephrotoxicity: 14, overallSafetyScore: 82 },
      protocol: {
        phase: 'Phase 2 Pilot Study',
        recommendedDosage: '200 mg BID oral solution',
        estimatedDurationMonths: 14,
        targetPatientCohort: `Recurrent or refractory ${cleanName} post-radiation`,
        primaryEndpoints: ['Vascular Perfusion Reduction on DCE-MRI', 'Overall Survival at 1 Year'],
        suggestedBiomarkers: ['Circulating Endothelial Cells', 'Gli1 mRNA levels in CSF']
      }
    },
    {
      id: `${slug}-memantine`,
      name: 'Memantine',
      smiles: 'CC13CC2CC(C1)(CC(C2)(C3)N)C',
      formula: 'C12H21N',
      molecularWeight: 179.3,
      originalIndication: "Alzheimer's Disease",
      originalCategory: 'Neurology / Neuroprotective',
      repurposedIndication: `Excitotoxicity prevention & glutamate receptor blockade in brain parenchyma`,
      aiMatchScore: 85,
      bindingEnergy: '-8.4 kcal/mol',
      targetGene: 'NMDA Receptor (NR2B / NR2A)',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 130,
      mechanismOfAction: `Uncompetitive NMDA receptor antagonist that attenuates tumor-associated glutamate excitotoxicity and slows neuronal invasion by ${cleanName} cells.`,
      toxicityBreakdown: { hepatotoxicity: 10, cardiotoxicity: 12, nephrotoxicity: 8, overallSafetyScore: 92 },
      protocol: {
        phase: 'Phase 2 Neuro-Oncology Trial',
        recommendedDosage: '10 mg BID orally',
        estimatedDurationMonths: 12,
        targetPatientCohort: `Patients undergoing brain radiotherapy for ${cleanName}`,
        primaryEndpoints: ['Cognitive Functioning Preservation (MMSE)', 'Invasive Front Reduction'],
        suggestedBiomarkers: ['CSF Glutamate concentration', 'Volumetric MRI expansion rate']
      }
    },
    {
      id: `${slug}-chloroquine`,
      name: 'Chloroquine',
      smiles: 'CCN(CC)CCCC(C)NC1=C2C=CC(=CC2=NC=C1)Cl',
      formula: 'C18H26ClN3',
      molecularWeight: 319.87,
      originalIndication: 'Malaria / Autoimmune',
      originalCategory: 'Antimalarial',
      repurposedIndication: `Autophagy lysosomal blockage in chemo-resistant brain cancer cells`,
      aiMatchScore: 82,
      bindingEnergy: '-8.2 kcal/mol',
      targetGene: 'Lysosome / Autophagosome / TLR9',
      toxicityStatus: 'FDA Approved - Mild Warning',
      literatureCount: 190,
      mechanismOfAction: `De-acidifies autophagolysosomes, blocking autophagy flux and sensitizing radio-resistant ${cleanName} stem cells to DNA-damaging agents.`,
      toxicityBreakdown: { hepatotoxicity: 20, cardiotoxicity: 28, nephrotoxicity: 16, overallSafetyScore: 80 },
      protocol: {
        phase: 'Phase 2 Combination Trial',
        recommendedDosage: '150 mg daily orally',
        estimatedDurationMonths: 15,
        targetPatientCohort: `Recurrent ${cleanName} patients treated with Alkylating Agents`,
        primaryEndpoints: ['Median Survival Time', 'Autophagosome Accumulation Index'],
        suggestedBiomarkers: ['LC3-II protein levels', 'p62/SQSTM1 IHC score']
      }
    }
  ];

  const graphNodes: GraphNode[] = [
    { id: `${slug}-dis`, label: cleanName, type: 'disease', category: 'Neuro-Oncology Target' },
    { id: `${slug}-p1`, label: 'NPL4 / Proteasome', type: 'protein', category: 'Proteotoxic Stress' },
    { id: `${slug}-p2`, label: 'AMPK / mTORC1 Axis', type: 'protein', category: 'Stem Cell Bioenergetics' },
    { id: `${slug}-p3`, label: 'Smoothened / VDAC1', type: 'protein', category: 'Hedgehog & Angiogenesis' },
    { id: `${slug}-p4`, label: 'NMDA Receptor Complex', type: 'protein', category: 'Glutamate Excitotoxicity' },
    { id: `${slug}-d1`, label: 'Disulfiram', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d2`, label: 'Metformin', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d3`, label: 'Itraconazole', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d4`, label: 'Memantine', type: 'drug', category: 'Repurposed Candidate' }
  ];

  const graphEdges: GraphEdge[] = [
    { source: `${slug}-d1`, target: `${slug}-p1`, label: 'Binds NPL4 Complex', weight: 0.96 },
    { source: `${slug}-d2`, target: `${slug}-p2`, label: 'Activates AMPK', weight: 0.92 },
    { source: `${slug}-d3`, target: `${slug}-p3`, label: 'Inhibits SMO', weight: 0.88 },
    { source: `${slug}-d4`, target: `${slug}-p4`, label: 'Blocks NMDAR', weight: 0.85 },
    { source: `${slug}-p1`, target: `${slug}-dis`, label: 'Proteasome Overload', weight: 0.94 },
    { source: `${slug}-p2`, target: `${slug}-dis`, label: 'Drives Glioma Proliferation', weight: 0.90 },
    { source: `${slug}-p3`, target: `${slug}-dis`, label: 'Sustains Tumor Angiogenesis', weight: 0.87 },
    { source: `${slug}-p4`, target: `${slug}-dis`, label: 'Triggers Neuronal Invasion', weight: 0.84 }
  ];

  return { disease, candidates, graphNodes, graphEdges };
}

function generateLungCancerSuite(slug: string, cleanName: string): RepurposingSuite {
  const disease: DiseaseTarget = {
    id: slug,
    name: cleanName,
    category: 'Thoracic Oncology',
    affectedPopulation: '2.2M diagnoses worldwide',
    keyProteins: ['EGFR Exon 19/21', 'KRAS G12C', 'ALK Fusion', 'PD-L1 Expression'],
    gnnEmbeddingsCount: 460000,
    description: `Malignancy of bronchial and pulmonary tissue, including Non-Small Cell Lung Cancer (NSCLC) and Small Cell Lung Cancer (SCLC).`
  };

  const candidates: DrugCandidate[] = [
    {
      id: `${slug}-metformin`,
      name: 'Metformin',
      smiles: 'CN(C)C(=N)N=C(N)N',
      formula: 'C4H11N5',
      molecularWeight: 129.16,
      originalIndication: 'Type 2 Diabetes',
      originalCategory: 'Antidiabetics',
      repurposedIndication: `EGFR-TKI sensitization & LKB1-AMPK signaling in ${cleanName}`,
      aiMatchScore: 93,
      bindingEnergy: '-9.3 kcal/mol',
      targetGene: 'LKB1 / AMPK / mTOR',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 380,
      mechanismOfAction: `Activates LKB1-dependent AMPK signaling to overcome TKI resistance and induce apoptosis in EGFR-mutant ${cleanName} cells.`,
      toxicityBreakdown: { hepatotoxicity: 10, cardiotoxicity: 8, nephrotoxicity: 12, overallSafetyScore: 93 },
      protocol: {
        phase: 'Phase 2 Combo Trial',
        recommendedDosage: '1000 mg BID orally',
        estimatedDurationMonths: 18,
        targetPatientCohort: `Patients with advanced EGFR+ ${cleanName} receiving Osimertinib`,
        primaryEndpoints: ['PFS Rate at 12 Months', 'Circulating Tumor DNA Clearance'],
        suggestedBiomarkers: ['ctDNA EGFR allele frequency', 'Serum Lactate']
      }
    },
    {
      id: `${slug}-itraconazole`,
      name: 'Itraconazole',
      smiles: 'CCC(C)AN1CCN(CC1)C2=CC=C(C=C2)N3C(=O)N(C(=O)N3)C(C)C',
      formula: 'C35H38Cl2N8O4',
      molecularWeight: 705.63,
      originalIndication: 'Antifungal',
      originalCategory: 'Antifungal',
      repurposedIndication: `Anti-angiogenesis & VEGFR2 autophosphorylation suppression`,
      aiMatchScore: 89,
      bindingEnergy: '-8.9 kcal/mol',
      targetGene: 'VEGFR2 / mTOR / Cholesterol Transport',
      toxicityStatus: 'FDA Approved - Mild Warning',
      literatureCount: 210,
      mechanismOfAction: `Inhibits endothelial VEGFR2 trafficking and suppresses tumor blood vessel formation in aggressive ${cleanName} tumors.`,
      toxicityBreakdown: { hepatotoxicity: 22, cardiotoxicity: 20, nephrotoxicity: 14, overallSafetyScore: 84 },
      protocol: {
        phase: 'Phase 2 Trial',
        recommendedDosage: '200 mg BID oral solution',
        estimatedDurationMonths: 14,
        targetPatientCohort: `Refractory non-squamous ${cleanName} cohort`,
        primaryEndpoints: ['Objective Response Rate (ORR)', 'Overall Survival'],
        suggestedBiomarkers: ['Serum VEGF levels', 'Circulating Endothelial Progenitors']
      }
    }
  ];

  const graphNodes: GraphNode[] = [
    { id: `${slug}-dis`, label: cleanName, type: 'disease', category: 'Thoracic Oncology' },
    { id: `${slug}-p1`, label: 'LKB1 / AMPK Axis', type: 'protein', category: 'Metabolic Control' },
    { id: `${slug}-p2`, label: 'VEGFR2 Endothelial Cascade', type: 'protein', category: 'Angiogenesis' },
    { id: `${slug}-d1`, label: 'Metformin', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d2`, label: 'Itraconazole', type: 'drug', category: 'Repurposed Candidate' }
  ];

  const graphEdges: GraphEdge[] = [
    { source: `${slug}-d1`, target: `${slug}-p1`, label: 'Activates LKB1', weight: 0.93 },
    { source: `${slug}-d2`, target: `${slug}-p2`, label: 'Inhibits VEGFR2', weight: 0.89 },
    { source: `${slug}-p1`, target: `${slug}-dis`, label: 'Suppresses Tumor Growth', weight: 0.91 },
    { source: `${slug}-p2`, target: `${slug}-dis`, label: 'Drives Neo-vascularization', weight: 0.88 }
  ];

  return { disease, candidates, graphNodes, graphEdges };
}

function generateColonCancerSuite(slug: string, cleanName: string): RepurposingSuite {
  const disease: DiseaseTarget = {
    id: slug,
    name: cleanName,
    category: 'Gastrointestinal Oncology',
    affectedPopulation: '1.9M cases annually',
    keyProteins: ['KRAS G12D', 'BRAF V600E', 'APC / Wnt Pathway', 'EGFR / COX-2'],
    gnnEmbeddingsCount: 410000,
    description: `Gastrointestinal adenocarcinoma arising from epithelial lining of the large intestine or rectum.`
  };

  const candidates: DrugCandidate[] = [
    {
      id: `${slug}-aspirin`,
      name: 'Aspirin (Acetylsalicylic Acid)',
      smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
      formula: 'C9H8O4',
      molecularWeight: 180.16,
      originalIndication: 'Analgesic / Antiplatelet',
      originalCategory: 'NSAID / FDA Approved',
      repurposedIndication: `COX-2 pathway & PIK3CA mutant signaling suppression in ${cleanName}`,
      aiMatchScore: 94,
      bindingEnergy: '-9.1 kcal/mol',
      targetGene: 'COX-1 / COX-2 / PI3K Axis',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 420,
      mechanismOfAction: `Irreversibly inhibits COX-2 and downstream PGE2 production, preventing adenomatous polyp recurrence and suppressing PI3K signaling in ${cleanName}.`,
      toxicityBreakdown: { hepatotoxicity: 12, cardiotoxicity: 8, nephrotoxicity: 18, overallSafetyScore: 91 },
      protocol: {
        phase: 'Phase 3 Adjuvant Trial',
        recommendedDosage: '100 mg daily orally',
        estimatedDurationMonths: 36,
        targetPatientCohort: `Patients with resected Stage II/III PIK3CA-mutant ${cleanName}`,
        primaryEndpoints: ['Disease-Free Survival (DFS)', 'Recurrence Rate'],
        suggestedBiomarkers: ['PIK3CA mutation status', 'Stool COX-2 expression']
      }
    },
    {
      id: `${slug}-metformin`,
      name: 'Metformin',
      smiles: 'CN(C)C(=N)N=C(N)N',
      formula: 'C4H11N5',
      molecularWeight: 129.16,
      originalIndication: 'Type 2 Diabetes',
      originalCategory: 'Antidiabetics',
      repurposedIndication: `Wnt/beta-catenin and intestinal crypt stem cell inhibition`,
      aiMatchScore: 91,
      bindingEnergy: '-9.0 kcal/mol',
      targetGene: 'AMPK / Wnt / β-Catenin',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 295,
      mechanismOfAction: `Downregulates nuclear Wnt/β-catenin translocation in colon crypt epithelial cells and decreases polyp formation in ${cleanName} models.`,
      toxicityBreakdown: { hepatotoxicity: 8, cardiotoxicity: 6, nephrotoxicity: 10, overallSafetyScore: 95 },
      protocol: {
        phase: 'Phase 2 Prevention Study',
        recommendedDosage: '850 mg BID orally',
        estimatedDurationMonths: 24,
        targetPatientCohort: `Patients with high-risk colorectal adenomas`,
        primaryEndpoints: ['Adenomatous Polyp Count Reduction', 'Crypt Proliferation Rate'],
        suggestedBiomarkers: ['Phospho-AMPK levels', 'Crypt Ki-67 index']
      }
    }
  ];

  const graphNodes: GraphNode[] = [
    { id: `${slug}-dis`, label: cleanName, type: 'disease', category: 'Gastrointestinal Oncology' },
    { id: `${slug}-p1`, label: 'COX-2 / PGE2 Pathway', type: 'protein', category: 'Inflammatory Tumor microenvironment' },
    { id: `${slug}-p2`, label: 'Wnt / β-Catenin Axis', type: 'protein', category: 'Intestinal Stem Cells' },
    { id: `${slug}-d1`, label: 'Aspirin', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d2`, label: 'Metformin', type: 'drug', category: 'Repurposed Candidate' }
  ];

  const graphEdges: GraphEdge[] = [
    { source: `${slug}-d1`, target: `${slug}-p1`, label: 'Inhibits COX-2', weight: 0.94 },
    { source: `${slug}-d2`, target: `${slug}-p2`, label: 'Downregulates Wnt', weight: 0.91 },
    { source: `${slug}-p1`, target: `${slug}-dis`, label: 'Promotes Tumorigenesis', weight: 0.93 },
    { source: `${slug}-p2`, target: `${slug}-dis`, label: 'Drives Stem Proliferation', weight: 0.90 }
  ];

  return { disease, candidates, graphNodes, graphEdges };
}

function generateMSSuite(slug: string, cleanName: string): RepurposingSuite {
  const disease: DiseaseTarget = {
    id: slug,
    name: cleanName,
    category: 'Autoimmune Neuro-Immunology',
    affectedPopulation: '2.8M cases globally',
    keyProteins: ['S1P Receptor 1', 'VLA-4 Integrin', 'CD20 B-Cell Target', 'DHODH Enzyme'],
    gnnEmbeddingsCount: 350000,
    description: `Chronic autoimmune demyelinating disease of the central nervous system resulting in axonal degeneration.`
  };

  const candidates: DrugCandidate[] = [
    {
      id: `${slug}-clemastine`,
      name: 'Clemastine Fumarate',
      smiles: 'CC(C1=CC=C(C=C1)Cl)C2=CC=CC=N2.C(CCN3CCCC3)O',
      formula: 'C21H26ClNO',
      molecularWeight: 343.89,
      originalIndication: 'Allergies / Antihistamine',
      originalCategory: 'Antihistamine / FDA Approved',
      repurposedIndication: `Oligodendrocyte precursor cell differentiation & remyelination in ${cleanName}`,
      aiMatchScore: 95,
      bindingEnergy: '-9.5 kcal/mol',
      targetGene: 'Muscarinic M1 Receptor / HRH1',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 180,
      mechanismOfAction: `Antagonizes M1 muscarinic receptors to promote oligodendrocyte precursor cell (OPC) differentiation and active myelin sheath repair in demyelinated optic and spinal nerve axons.`,
      toxicityBreakdown: { hepatotoxicity: 10, cardiotoxicity: 12, nephrotoxicity: 8, overallSafetyScore: 93 },
      protocol: {
        phase: 'Phase 2b Remyelination Trial',
        recommendedDosage: '5.36 mg BID orally',
        estimatedDurationMonths: 12,
        targetPatientCohort: `Patients with relapsing MS presenting chronic optic neuropathy`,
        primaryEndpoints: ['Visual Evoked Potential (VEP) Latency Delay Improvement', 'Brain MRI Myelin Water Fraction'],
        suggestedBiomarkers: ['VEP latency (ms)', 'Serum Neurofilament Light Chain (sNfL)']
      }
    },
    {
      id: `${slug}-metformin`,
      name: 'Metformin',
      smiles: 'CN(C)C(=N)N=C(N)N',
      formula: 'C4H11N5',
      molecularWeight: 129.16,
      originalIndication: 'Type 2 Diabetes',
      originalCategory: 'Antidiabetics',
      repurposedIndication: `Endogenous neural stem cell rejuvenation & remyelination enhancement`,
      aiMatchScore: 90,
      bindingEnergy: '-9.0 kcal/mol',
      targetGene: 'AMPK / OPC Rejuvenation',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 145,
      mechanismOfAction: `Rejuvenates aged oligodendrocyte progenitor cells by restoring responsiveness to differentiation cues in ${cleanName} tissue.`,
      toxicityBreakdown: { hepatotoxicity: 8, cardiotoxicity: 6, nephrotoxicity: 10, overallSafetyScore: 95 },
      protocol: {
        phase: 'Phase 2 Clinical Study',
        recommendedDosage: '1000 mg BID orally',
        estimatedDurationMonths: 18,
        targetPatientCohort: `Progressive ${cleanName} cohort`,
        primaryEndpoints: ['Expanded Disability Status Scale (EDSS)', 'Magnetization Transfer Ratio (MTR) on MRI'],
        suggestedBiomarkers: ['sNfL baseline', 'CSF Glial Fibrillary Acidic Protein (GFAP)']
      }
    }
  ];

  const graphNodes: GraphNode[] = [
    { id: `${slug}-dis`, label: cleanName, type: 'disease', category: 'Autoimmune Neuro-Immunology' },
    { id: `${slug}-p1`, label: 'Muscarinic M1 Receptor', type: 'protein', category: 'OPC Differentiation Brake' },
    { id: `${slug}-p2`, label: 'AMPK Rejuvenation Axis', type: 'protein', category: 'Progenitor Cell Bioenergetics' },
    { id: `${slug}-d1`, label: 'Clemastine', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d2`, label: 'Metformin', type: 'drug', category: 'Repurposed Candidate' }
  ];

  const graphEdges: GraphEdge[] = [
    { source: `${slug}-d1`, target: `${slug}-p1`, label: 'Antagonizes M1', weight: 0.95 },
    { source: `${slug}-d2`, target: `${slug}-p2`, label: 'Stimulates AMPK', weight: 0.90 },
    { source: `${slug}-p1`, target: `${slug}-dis`, label: 'Blocks Remyelination', weight: 0.94 },
    { source: `${slug}-p2`, target: `${slug}-dis`, label: 'Restores Myelin Sheath', weight: 0.89 }
  ];

  return { disease, candidates, graphNodes, graphEdges };
}

function generateGenericSuite(slug: string, cleanName: string): RepurposingSuite {
  const disease: DiseaseTarget = {
    id: slug,
    name: cleanName,
    category: 'Target Disease Target',
    affectedPopulation: 'Significant Global Patient Population',
    keyProteins: ['mTOR / AMPK Pathway', 'NF-kB Proinflammatory Axis', 'VEGFR / Angiogenesis Target', 'Proteasome Complex'],
    gnnEmbeddingsCount: 385000,
    description: `Targeted AI PharmAI Graph Neural Network repurposing profile for ${cleanName}, analyzing molecular bioactivity and high-affinity candidate molecules.`
  };

  const candidates: DrugCandidate[] = [
    {
      id: `${slug}-metformin`,
      name: 'Metformin',
      smiles: 'CN(C)C(=N)N=C(N)N',
      formula: 'C4H11N5',
      molecularWeight: 129.16,
      originalIndication: 'Type 2 Diabetes',
      originalCategory: 'Antidiabetics / FDA Approved',
      repurposedIndication: `AMPK activation & metabolic cellular stress downregulation in ${cleanName}`,
      aiMatchScore: 94,
      bindingEnergy: '-9.4 kcal/mol',
      targetGene: 'AMPK / mTOR / Complex I',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 220,
      mechanismOfAction: `Activates 5' AMP-activated protein kinase (AMPK) to downregulate mTOR signalling, alleviating pathological cellular stress in ${cleanName}.`,
      toxicityBreakdown: { hepatotoxicity: 10, cardiotoxicity: 8, nephrotoxicity: 12, overallSafetyScore: 94 },
      protocol: {
        phase: 'Phase 2b Clinical Protocol',
        recommendedDosage: '850 mg BID orally',
        estimatedDurationMonths: 18,
        targetPatientCohort: `Patients diagnosed with progressive or refractory ${cleanName}`,
        primaryEndpoints: ['Progression-Free Survival (PFS)', 'Target Biomarker Modulation'],
        suggestedBiomarkers: ['Phospho-AMPK expression', 'Serum Inflammatory Cytokines', 'Ki-67 Index']
      }
    },
    {
      id: `${slug}-disulfiram`,
      name: 'Disulfiram',
      smiles: 'CCN(CC)C(=S)SSC(=S)N(CC)CC',
      formula: 'C10H20N2S4',
      molecularWeight: 296.54,
      originalIndication: 'Alcohol Dependency',
      originalCategory: 'Psychiatric / FDA Approved',
      repurposedIndication: `Proteasome complex targeted degradation & NPL4 stress in ${cleanName}`,
      aiMatchScore: 90,
      bindingEnergy: '-9.1 kcal/mol',
      targetGene: 'NPL4 / NF-kB / ALDH1A1',
      toxicityStatus: 'Mild Liver Toxicity Warning',
      literatureCount: 155,
      mechanismOfAction: `Chelates intracellular copper to form CuET complexes that target NPL4, causing protein aggregation and cell apoptosis in ${cleanName}.`,
      toxicityBreakdown: { hepatotoxicity: 30, cardiotoxicity: 14, nephrotoxicity: 16, overallSafetyScore: 82 },
      protocol: {
        phase: 'Phase 2a Proof-of-Concept',
        recommendedDosage: '500 mg daily + Copper Gluconate',
        estimatedDurationMonths: 12,
        targetPatientCohort: `Advanced ${cleanName} cohort`,
        primaryEndpoints: ['Objective Response Rate (ORR)', 'Apoptotic Clearance'],
        suggestedBiomarkers: ['NPL4 aggregate accumulation', 'ALT/AST safety monitoring']
      }
    },
    {
      id: `${slug}-itraconazole`,
      name: 'Itraconazole',
      smiles: 'CCC(C)AN1CCN(CC1)C2=CC=C(C=C2)N3C(=O)N(C(=O)N3)C(C)C',
      formula: 'C35H38Cl2N8O4',
      molecularWeight: 705.63,
      originalIndication: 'Antifungal',
      originalCategory: 'Antifungal',
      repurposedIndication: `Smoothened Hedgehog signaling & microvessel angiogenesis blockade in ${cleanName}`,
      aiMatchScore: 87,
      bindingEnergy: '-8.7 kcal/mol',
      targetGene: 'Smoothened (SMO) / VEGFR2',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      literatureCount: 110,
      mechanismOfAction: `Binds Smoothened receptor in Hedgehog cascade and inhibits endothelial VEGFR2 autophosphorylation to suppress disease progression in ${cleanName}.`,
      toxicityBreakdown: { hepatotoxicity: 22, cardiotoxicity: 24, nephrotoxicity: 15, overallSafetyScore: 84 },
      protocol: {
        phase: 'Phase 2 Pilot Study',
        recommendedDosage: '300 mg daily oral solution',
        estimatedDurationMonths: 14,
        targetPatientCohort: `Vascularized ${cleanName} patient cohort`,
        primaryEndpoints: ['Microvessel Density Reduction', 'Overall Survival'],
        suggestedBiomarkers: ['Circulating Endothelial Cells', 'Gli1 mRNA levels']
      }
    },
    {
      id: `${slug}-ketamine`,
      name: 'Ketamine',
      smiles: 'CNC1(CCCCC1=O)C2=CC=CC=C2Cl',
      formula: 'C13H16ClNO',
      molecularWeight: 237.73,
      originalIndication: 'Anesthetic / Depression',
      originalCategory: 'Neurology',
      repurposedIndication: `Neuro-inflammatory cascade & NMDA receptor modulation in ${cleanName}`,
      aiMatchScore: 84,
      bindingEnergy: '-8.3 kcal/mol',
      targetGene: 'NMDAR / BDNF Signaling',
      toxicityStatus: 'FDA Approved - Mild Warning',
      literatureCount: 125,
      mechanismOfAction: `Modulates glutamatergic neurotransmission and stimulates neurotrophic signaling pathways in ${cleanName} neural pathways.`,
      toxicityBreakdown: { hepatotoxicity: 14, cardiotoxicity: 22, nephrotoxicity: 10, overallSafetyScore: 86 },
      protocol: {
        phase: 'Phase 2 Trial',
        recommendedDosage: '0.5 mg/kg IV infusion twice weekly',
        estimatedDurationMonths: 10,
        targetPatientCohort: `Symptomatic ${cleanName} patients`,
        primaryEndpoints: ['Symptom Severity Score Reduction', 'Inflammatory Marker Lowering'],
        suggestedBiomarkers: ['Serum BDNF', 'CSF Glutamate concentration']
      }
    }
  ];

  const graphNodes: GraphNode[] = [
    { id: `${slug}-dis`, label: cleanName, type: 'disease', category: 'Target Disease' },
    { id: `${slug}-p1`, label: 'AMPK / mTOR Axis', type: 'protein', category: 'Metabolic Signaling' },
    { id: `${slug}-p2`, label: 'NPL4 Proteasomal Pathway', type: 'protein', category: 'Proteotoxic Stress' },
    { id: `${slug}-p3`, label: 'Smoothened / VEGFR2', type: 'protein', category: 'Angiogenesis' },
    { id: `${slug}-d1`, label: 'Metformin', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d2`, label: 'Disulfiram', type: 'drug', category: 'Repurposed Candidate' },
    { id: `${slug}-d3`, label: 'Itraconazole', type: 'drug', category: 'Repurposed Candidate' }
  ];

  const graphEdges: GraphEdge[] = [
    { source: `${slug}-d1`, target: `${slug}-p1`, label: 'Activates AMPK', weight: 0.94 },
    { source: `${slug}-d2`, target: `${slug}-p2`, label: 'Inhibits NPL4', weight: 0.90 },
    { source: `${slug}-d3`, target: `${slug}-p3`, label: 'Blocks SMO', weight: 0.87 },
    { source: `${slug}-p1`, target: `${slug}-dis`, label: 'Suppresses Pathology', weight: 0.92 },
    { source: `${slug}-p2`, target: `${slug}-dis`, label: 'Induces Apoptosis', weight: 0.88 },
    { source: `${slug}-p3`, target: `${slug}-dis`, label: 'Inhibits Neo-vascularization', weight: 0.85 }
  ];

  return { disease, candidates, graphNodes, graphEdges };
}
