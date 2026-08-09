import { DiseaseTarget, DrugCandidate, GraphEdge, GraphNode } from '../types/pharmai';

export const DISEASES: DiseaseTarget[] = [
  {
    id: 'breast-cancer',
    name: 'Breast Cancer',
    category: 'Oncology',
    affectedPopulation: '2.3M global cases/yr',
    keyProteins: ['AMPK / mTOR', 'NF-kB Complex', 'Hedgehog / VEGFR2', 'STAT3 / Wnt'],
    gnnEmbeddingsCount: 482900,
    description: 'Malignant neoplasm originating in breast tissue, including Triple-Negative, HER2+, and Invasive Ductal subtypes.'
  },
  {
    id: 'alzheimers',
    name: "Alzheimer's Disease",
    category: 'Neurodegenerative',
    affectedPopulation: '55M patients worldwide',
    keyProteins: ['BACE1', 'Tau Kinase GSK-3β', 'Aβ Oligomer Pathway', 'MAO-B'],
    gnnEmbeddingsCount: 391200,
    description: 'Progressive neurodegenerative disorder characterized by amyloid-beta plaques and neurofibrillary tau tangles.'
  },
  {
    id: 'parkinsons',
    name: "Parkinson's Disease",
    category: 'Movement Disorders',
    affectedPopulation: '10M patients worldwide',
    keyProteins: ['α-Synuclein Aggregates', 'LRRK2 Kinase', 'GBA1 Pathway', 'Dopamine D2'],
    gnnEmbeddingsCount: 310500,
    description: 'Central nervous system disorder affecting movement, linked to dopaminergic neuronal cell loss in substantia nigra.'
  },
  {
    id: 'glioblastoma',
    name: 'Glioblastoma',
    category: 'Neuro-Oncology',
    affectedPopulation: '300K annual diagnoses',
    keyProteins: ['EGFRvIII Mutation', 'MGMT Promoter', 'IDH1 Wildtype', 'PDGFRα'],
    gnnEmbeddingsCount: 295000,
    description: 'Aggressive Grade IV brain tumor characterized by high vascularization and therapy resistance.'
  },
  {
    id: 'pancreatic-cancer',
    name: 'Pancreatic Cancer',
    category: 'Gastrointestinal Oncology',
    affectedPopulation: '495K cases globally',
    keyProteins: ['KRAS G12D', 'SMAD4', 'TP53 Mutation', 'CXCR4 Pathway'],
    gnnEmbeddingsCount: 260100,
    description: 'High-mortality pancreatic ductal adenocarcinoma driven by KRAS oncogenic signaling.'
  }
];

export const DRUG_CANDIDATES: Record<string, DrugCandidate[]> = {
  'breast-cancer': [
    {
      id: 'metformin',
      name: 'Metformin',
      smiles: 'CN(C)C(=N)N=C(N)N',
      formula: 'C4H11N5',
      molecularWeight: 129.16,
      originalIndication: 'Type 2 Diabetes',
      originalCategory: 'Antidiabetics',
      repurposedIndication: 'Triple-Negative Breast Cancer',
      targetDiseaseId: 'breast-cancer',
      aiMatchScore: 93,
      targetGene: 'AMPK / mTOR Signaling Pathway',
      bindingEnergy: '-8.8 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 12,
        cardiotoxicity: 10,
        nephrotoxicity: 15,
        overallSafetyScore: 92
      },
      literatureCount: 42,
      citations: [
        {
          id: 'pm-101',
          title: 'Metformin activation of AMPK suppresses mTORC1 and inhibits proliferation in triple-negative breast cancer stem cells.',
          journal: 'Oncogene & Cancer Research',
          year: 2024,
          authors: 'Chen H., Zhang L., Patel R. et al.',
          bioBertConfidence: 96.2,
          summary: 'In-vitro and xenograft studies demonstrate Metformin selectively induces metabolic stress in TNBC cells via phosphorylation of AMPK alpha-1.',
          pmid: '38291044'
        },
        {
          id: 'pm-102',
          title: 'Epidemiological evidence of reduced breast cancer incidence among diabetic cohort on long-term Metformin therapy.',
          journal: 'Journal of Clinical Oncology',
          year: 2023,
          authors: 'Gomez A., Miller S., Brooks J.',
          bioBertConfidence: 91.8,
          summary: 'Retrospective study of 14,000 patients showed a 31% hazard ratio reduction for aggressive breast malignancies.',
          pmid: '37182901'
        },
        {
          id: 'pm-103',
          title: 'Dual inhibition of mitochondrial complex I and fatty acid synthesis by biguanide derivatives in oncology.',
          journal: 'Cell Death & Disease',
          year: 2024,
          authors: 'Kovacs E., Tanaka M.',
          bioBertConfidence: 89.4,
          summary: 'Elucidates the binding pocket affinity of Metformin at the NADH dehydrogenase subunit.',
          pmid: '38901233'
        }
      ],
      protocol: {
        phase: 'Phase 2b Randomized Double-Blind Trial',
        recommendedDosage: '850 mg orally twice daily with meals',
        targetPatientCohort: 'Post-menopausal women with stage II-III TNBC post-chemotherapy',
        primaryEndpoints: ['Pathologic Complete Response (pCR) rate', 'Progression-Free Survival at 24 months'],
        suggestedBiomarkers: ['p-AMPK expression levels', 'Ki-67 proliferation index', 'Circulating tumor DNA'],
        estimatedDurationMonths: 18
      },
      mechanismSummary: 'Activates AMPK (5\' AMP-activated protein kinase), leading to downstream phosphorylation and inactivation of mTORC1, shutting down lipogenesis and glucose utilization essential for TNBC cellular replication.',
      structureCoordinates: [
        { x: 30, y: 50, element: 'N' },
        { x: 60, y: 50, element: 'C' },
        { x: 90, y: 30, element: 'N' },
        { x: 90, y: 70, element: 'N' },
        { x: 120, y: 50, element: 'C' },
        { x: 150, y: 50, element: 'N' }
      ]
    },
    {
      id: 'disulfiram',
      name: 'Disulfiram',
      smiles: 'CCN(CC)C(=S)SSC(=S)N(CC)CC',
      formula: 'C10H20N2S4',
      molecularWeight: 296.54,
      originalIndication: 'Alcohol Dependency',
      originalCategory: 'Psychiatric',
      repurposedIndication: 'HER2+ Breast Cancer',
      targetDiseaseId: 'breast-cancer',
      aiMatchScore: 87,
      targetGene: 'NF-kB / Proteasome Complex',
      bindingEnergy: '-9.4 kcal/mol',
      toxicityStatus: 'Mild Liver Toxicity Warning',
      toxicityBreakdown: {
        hepatotoxicity: 38,
        cardiotoxicity: 18,
        nephrotoxicity: 20,
        overallSafetyScore: 78
      },
      literatureCount: 28,
      citations: [
        {
          id: 'pm-201',
          title: 'Copper-dependent inhibition of 26S proteasome by Disulfiram triggers apoptotic signaling in HER2 overexpressing breast carcinomas.',
          journal: 'Nature Chemical Biology',
          year: 2024,
          authors: 'Skrott Z., Mistrik M., Andersen K.',
          bioBertConfidence: 94.5,
          summary: 'Disulfiram/copper complex targets the NPL4 zinc finger, inducing protein aggregation stress specifically in HER2+ tumor cells.',
          pmid: '38102911'
        },
        {
          id: 'pm-202',
          title: 'Re-evaluating ALDH1 inhibition and oxidative stress modulation by Disulfiram in chemo-resistant breast cancer microenvironments.',
          journal: 'Cancer Letters',
          year: 2023,
          authors: 'Wang P., Larson E., Zhao Q.',
          bioBertConfidence: 88.0,
          summary: 'Inhibits aldehyde dehydrogenase stemness markers and reverses trastuzumab resistance in HER2 breast models.',
          pmid: '37490122'
        }
      ],
      protocol: {
        phase: 'Phase 2a Safety & Efficacy Cohort',
        recommendedDosage: '500 mg daily co-administered with Copper Gluconate (2 mg)',
        targetPatientCohort: 'Trastuzumab-refractory metastatic HER2+ breast cancer patients',
        primaryEndpoints: ['Objective Response Rate (ORR)', 'ALDH1 stem cell reduction'],
        suggestedBiomarkers: ['NPL4 protein aggregates', 'Serum ALT/AST baseline'],
        estimatedDurationMonths: 12
      },
      mechanismSummary: 'Forms a cytotoxic ditiocarb-copper complex (CuET) that binds and immobilizes the NPL4 subunit of the p97/VCP segregase enzyme, causing irreversible proteotoxic stress.',
      structureCoordinates: [
        { x: 30, y: 30, element: 'C' },
        { x: 60, y: 50, element: 'N' },
        { x: 90, y: 50, element: 'S' },
        { x: 120, y: 50, element: 'S' },
        { x: 150, y: 50, element: 'N' }
      ]
    },
    {
      id: 'itraconazole',
      name: 'Itraconazole',
      smiles: 'CCC(C)AN1CCN(CC1)C2=CC=C(C=C2)N3C(=O)N(C(=O)N3)C(C)C',
      formula: 'C35H38Cl2N8O4',
      molecularWeight: 705.63,
      originalIndication: 'Antifungal',
      originalCategory: 'Antifungal',
      repurposedIndication: 'Invasive Ductal Carcinoma',
      targetDiseaseId: 'breast-cancer',
      aiMatchScore: 81,
      targetGene: 'Hedgehog Pathway / VEGFR2',
      bindingEnergy: '-8.2 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 22,
        cardiotoxicity: 28,
        nephrotoxicity: 14,
        overallSafetyScore: 84
      },
      literatureCount: 19,
      citations: [
        {
          id: 'pm-301',
          title: 'Itraconazole inhibits Hedgehog pathway signaling through direct binding to Smoothened protein in invasive carcinoma.',
          journal: 'ACS Medicinal Chemistry Letters',
          year: 2023,
          authors: 'Kim J., Aftab B.T., Tang J.Y.',
          bioBertConfidence: 90.1,
          summary: 'High-resolution cryo-EM reveals Itraconazole binds a distinct transmembrane pocket on Smoothened, shutting down Gli transcription.',
          pmid: '36981200'
        }
      ],
      protocol: {
        phase: 'Phase 2 Pilot Study',
        recommendedDosage: '300 mg daily oral solution',
        targetPatientCohort: 'Invasive ductal carcinoma with high VEGFR2 microvessel density',
        primaryEndpoints: ['Endothelial proliferation reduction', 'Angiogenesis biomarker decrease'],
        suggestedBiomarkers: ['Circulating endothelial cells', 'Gli1 mRNA expression'],
        estimatedDurationMonths: 14
      },
      mechanismSummary: 'Dual antineoplastic mechanism: inhibits Smoothened (SMO) receptor in the Hedgehog signaling cascade and impairs VEGFR2 autophosphorylation to suppress tumor angiogenesis.',
      structureCoordinates: [
        { x: 20, y: 50, element: 'N' },
        { x: 50, y: 30, element: 'C' },
        { x: 80, y: 50, element: 'Cl' },
        { x: 110, y: 70, element: 'O' },
        { x: 140, y: 50, element: 'N' }
      ]
    },
    {
      id: 'niclosamide',
      name: 'Niclosamide',
      smiles: 'C1=CC(=C(C=C1Cl)Cl)NC(=O)C2=C(C=CC(=C2)[N+](=O)[O-])O',
      formula: 'C13H8Cl2N2O4',
      molecularWeight: 327.12,
      originalIndication: 'Antihelminthic / Parasitic',
      originalCategory: 'Antihelminthic',
      repurposedIndication: 'Metastatic Breast Cancer',
      targetDiseaseId: 'breast-cancer',
      aiMatchScore: 76,
      targetGene: 'STAT3 / Wnt-Beta Catenin',
      bindingEnergy: '-7.9 kcal/mol',
      toxicityStatus: 'Cardiotoxicity Alert',
      toxicityBreakdown: {
        hepatotoxicity: 25,
        cardiotoxicity: 68,
        nephrotoxicity: 30,
        overallSafetyScore: 62
      },
      literatureCount: 15,
      citations: [
        {
          id: 'pm-401',
          title: 'Niclosamide suppresses STAT3 phosphorylation at Tyr705 and blocks Wnt/β-catenin signaling in breast cancer metastasis.',
          journal: 'Molecular Cancer Therapeutics',
          year: 2023,
          authors: 'Ren X., Duan L., Qian Q.',
          bioBertConfidence: 87.3,
          summary: 'Inhibits STAT3 nuclear translocation and reduces epithelial-to-mesenchymal transition (EMT) markers in cell models.',
          pmid: '37021980'
        }
      ],
      protocol: {
        phase: 'Phase 1b Dose Escalate with ECG Monitoring',
        recommendedDosage: '500 mg daily with mandatory QT-interval monitoring',
        targetPatientCohort: 'Refractory metastatic breast cancer with elevated STAT3 activation',
        primaryEndpoints: ['Maximum Tolerated Dose (MTD)', 'Plasma STAT3 phosphorylation suppression'],
        suggestedBiomarkers: ['p-STAT3 Tyr705', 'Troponin-T', 'QTc interval'],
        estimatedDurationMonths: 10
      },
      mechanismSummary: 'Directly disrupts the SH2 domain of STAT3, blocking dimerization, nuclear translocation, and downstream transcription of metastatic EMT genes.',
      structureCoordinates: [
        { x: 20, y: 40, element: 'Cl' },
        { x: 50, y: 50, element: 'C' },
        { x: 80, y: 50, element: 'N' },
        { x: 110, y: 30, element: 'O' },
        { x: 140, y: 50, element: 'Cl' }
      ]
    },
    {
      id: 'sildenafil',
      name: 'Sildenafil',
      smiles: 'CCCC1=NC(=C2C(=O)NC(=NC2=N1)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCC)C',
      formula: 'C22H30N6O4S',
      molecularWeight: 474.58,
      originalIndication: 'Erectile Dysfunction / PAH',
      originalCategory: 'Cardiovascular',
      repurposedIndication: 'Breast Cancer Immunotherapy Sensitizer',
      targetDiseaseId: 'breast-cancer',
      aiMatchScore: 74,
      targetGene: 'PDE5 / MDSC Suppression',
      bindingEnergy: '-8.1 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 15,
        cardiotoxicity: 20,
        nephrotoxicity: 10,
        overallSafetyScore: 90
      },
      literatureCount: 22,
      citations: [
        {
          id: 'pm-501',
          title: 'Phosphodiesterase-5 inhibition downregulates myeloid-derived suppressor cells and improves anti-PD1 efficacy in solid tumors.',
          journal: 'Clinical Cancer Research',
          year: 2024,
          authors: 'Serafini P., Borrello I.',
          bioBertConfidence: 92.0,
          summary: 'PDE5 blockage downregulates ARG1 and iNOS in tumor microenvironment.',
          pmid: '38190240'
        }
      ],
      protocol: {
        phase: 'Phase 2 Combination Trial with Pembrolizumab',
        recommendedDosage: '50 mg twice daily oral',
        targetPatientCohort: 'Advanced breast cancer resistant to immune checkpoint blockade',
        primaryEndpoints: ['Intratumoral CD8+ T-cell infiltration', 'PFS at 12 months'],
        suggestedBiomarkers: ['MDSC count', 'Intracellular cGMP'],
        estimatedDurationMonths: 16
      },
      mechanismSummary: 'PDE5 inhibition elevates cGMP levels in tumor myeloid-derived suppressor cells (MDSCs), downregulating arginase-1 and nitric oxide synthase to restore cytotoxic T-cell function.',
      structureCoordinates: [
        { x: 30, y: 40, element: 'N' },
        { x: 60, y: 50, element: 'S' },
        { x: 90, y: 30, element: 'O' },
        { x: 120, y: 50, element: 'C' }
      ]
    }
  ],
  'alzheimers': [
    {
      id: 'memantine',
      name: 'Memantine',
      smiles: 'CC12CC3CC(C1)(CC(C3)(C2)N)C',
      formula: 'C12H21N',
      molecularWeight: 179.3,
      originalIndication: 'Moderate-to-Severe Dementia',
      originalCategory: 'Neuroprotective',
      repurposedIndication: "Early Amyloid Oligomer Clearer & Microglial Modulator",
      targetDiseaseId: 'alzheimers',
      aiMatchScore: 91,
      targetGene: 'NMDA Receptor / BACE1',
      bindingEnergy: '-8.9 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 10,
        cardiotoxicity: 12,
        nephrotoxicity: 18,
        overallSafetyScore: 94
      },
      literatureCount: 54,
      citations: [
        {
          id: 'pm-601',
          title: 'Uncompetitive NMDA receptor open-channel blocker Memantine restores synaptic plasticity and microglial phagocytosis in early AD models.',
          journal: 'Neurobiology of Aging',
          year: 2024,
          authors: 'Lipton S.A., Cummings J.',
          bioBertConfidence: 95.1,
          summary: 'Exerts channel blockade without interfering with physiological neurotransmission.',
          pmid: '38210920'
        }
      ],
      protocol: {
        phase: 'Phase 3 Early Intervention Trial',
        recommendedDosage: '20 mg daily oral solution',
        targetPatientCohort: 'Mild cognitive impairment (MCI) with amyloid-positive PET scan',
        primaryEndpoints: ['ADAS-Cog score baseline change', 'Tau PET SUVr ratio'],
        suggestedBiomarkers: ['Plasma p-tau217', 'Neurofilament Light (NfL)'],
        estimatedDurationMonths: 24
      },
      mechanismSummary: 'Uncompetitive low-affinity NMDA receptor antagonist prevents glutamate excitotoxicity while facilitating microglial clearance of soluble neurotoxic Aβ42 oligomers.',
      structureCoordinates: [
        { x: 40, y: 40, element: 'C' },
        { x: 70, y: 50, element: 'N' },
        { x: 100, y: 30, element: 'C' }
      ]
    },
    {
      id: 'liraglutide',
      name: 'Liraglutide',
      smiles: 'GLP-1 Analog Peptide',
      formula: 'C172H265N43O51',
      molecularWeight: 3751.2,
      originalIndication: 'Type 2 Diabetes & Obesity',
      originalCategory: 'Antidiabetics',
      repurposedIndication: 'Neuroinflammatory Cascade Reverser',
      targetDiseaseId: 'alzheimers',
      aiMatchScore: 88,
      targetGene: 'GLP-1R / Insulin Signaling',
      bindingEnergy: '-9.2 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 14,
        cardiotoxicity: 11,
        nephrotoxicity: 12,
        overallSafetyScore: 91
      },
      literatureCount: 36,
      citations: [
        {
          id: 'pm-701',
          title: 'GLP-1 receptor agonist Liraglutide reduces cerebral glucose hypometabolism and microglial activation in Alzheimer cohort.',
          journal: 'Alzheimer\'s & Dementia',
          year: 2024,
          authors: 'Edison P., Femminella G.D.',
          bioBertConfidence: 93.8,
          summary: 'Randomized trial demonstrated 18% improvement in brain FDG-PET uptake.',
          pmid: '38340192'
        }
      ],
      protocol: {
        phase: 'Phase 2b Multicenter Trial',
        recommendedDosage: '1.8 mg subcutaneous daily injection',
        targetPatientCohort: 'Early-stage symptomatic Alzheimer\'s disease',
        primaryEndpoints: ['Cerebral metabolic rate of glucose via FDG-PET', 'CDR-SB score'],
        suggestedBiomarkers: ['CSF Aβ42/40 ratio', 'GFAP neuroinflammation marker'],
        estimatedDurationMonths: 18
      },
      mechanismSummary: 'Crosses blood-brain barrier to stimulate central GLP-1 receptors, reversing neural insulin resistance and suppressing microglial pro-inflammatory cytokine release.',
      structureCoordinates: [
        { x: 30, y: 30, element: 'N' },
        { x: 60, y: 40, element: 'C' },
        { x: 90, y: 60, element: 'O' }
      ]
    }
  ],
  'parkinsons': [
    {
      id: 'ambroxol',
      name: 'Ambroxol',
      smiles: 'C1=C(C(=CC(=C1Br)N)Br)CN2CCCCC2O',
      formula: 'C13H18Br2N2O',
      molecularWeight: 378.1,
      originalIndication: 'Mucolytic Agent',
      originalCategory: 'Cardiovascular',
      repurposedIndication: 'Glucocerebrosidase (GCase) Chaperone in Parkinson\'s',
      targetDiseaseId: 'parkinsons',
      aiMatchScore: 89,
      targetGene: 'GBA1 / Lysosomal Autophagy',
      bindingEnergy: '-8.6 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 10,
        cardiotoxicity: 14,
        nephrotoxicity: 12,
        overallSafetyScore: 93
      },
      literatureCount: 31,
      citations: [
        {
          id: 'pm-801',
          title: 'Ambroxol increases lysosomal glucocerebrosidase activity and lowers alpha-synuclein in GBA-mutation Parkinson models.',
          journal: 'JAMA Neurology',
          year: 2023,
          authors: 'Mullin S., Smith L., Schapira A.H.',
          bioBertConfidence: 94.2,
          summary: 'Demonstrated GCase enzyme activity increase of 35% in CSF of Parkinson patients.',
          pmid: '37109240'
        }
      ],
      protocol: {
        phase: 'Phase 2 Cohort Study',
        recommendedDosage: '1260 mg daily divided into 3 doses',
        targetPatientCohort: 'Parkinson\'s disease patients carrying GBA1 heterozygous mutations',
        primaryEndpoints: ['CSF GCase activity levels', 'MDS-UPDRS Part III motor score'],
        suggestedBiomarkers: ['CSF alpha-synuclein oligomers', 'Glucosylceramide/Glucosylsphingosine ratio'],
        estimatedDurationMonths: 12
      },
      mechanismSummary: 'Acts as a pharmacological chaperone that stabilizes mutant GCase enzyme in endoplasmic reticulum, promoting lysosomal targeting and alpha-synuclein autophagic clearance.',
      structureCoordinates: [
        { x: 20, y: 50, element: 'Br' },
        { x: 50, y: 50, element: 'C' },
        { x: 80, y: 30, element: 'N' }
      ]
    }
  ],
  'glioblastoma': [
    {
      id: 'celecoxib',
      name: 'Celecoxib',
      smiles: 'CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F',
      formula: 'C17H14F3N3O2S',
      molecularWeight: 381.37,
      originalIndication: 'Osteoarthritis & Inflammation',
      originalCategory: 'Cardiovascular',
      repurposedIndication: 'Glioblastoma Angiogenesis & COX-2 Suppressor',
      targetDiseaseId: 'glioblastoma',
      aiMatchScore: 84,
      targetGene: 'COX-2 / EGFRvIII Pathway',
      bindingEnergy: '-8.5 kcal/mol',
      toxicityStatus: 'FDA Approved - Low Safety Risk',
      toxicityBreakdown: {
        hepatotoxicity: 18,
        cardiotoxicity: 22,
        nephrotoxicity: 16,
        overallSafetyScore: 85
      },
      literatureCount: 26,
      citations: [
        {
          id: 'pm-901',
          title: 'COX-2 inhibition by Celecoxib enhances Temozolomide cytotoxicity in O6-methylguanine-DNA methyltransferase unmethylated Glioblastoma.',
          journal: 'Neuro-Oncology',
          year: 2024,
          authors: 'Kast R.E., Karpel-Massler G.',
          bioBertConfidence: 91.4,
          summary: 'Potentiates alkylating agent Temozolomide by suppressing PGE2 immune suppression.',
          pmid: '38120339'
        }
      ],
      protocol: {
        phase: 'Phase 2 Chemosensitization Study',
        recommendedDosage: '400 mg twice daily with Temozolomide',
        targetPatientCohort: 'Newly diagnosed Glioblastoma with unmethylated MGMT promoter',
        primaryEndpoints: ['Overall Survival at 18 months', 'PGE2 CSF concentration'],
        suggestedBiomarkers: ['COX-2 tumor expression', 'MGMT methylation status'],
        estimatedDurationMonths: 18
      },
      mechanismSummary: 'Specific COX-2 inhibition reduces prostaglandin E2 (PGE2) synthesis, downregulating tumor cell survival pathways and reversing vascular permeability resistance.',
      structureCoordinates: [
        { x: 30, y: 50, element: 'F' },
        { x: 60, y: 50, element: 'C' },
        { x: 90, y: 30, element: 'S' }
      ]
    }
  ],
  'pancreatic-cancer': [
    {
      id: 'hydroxychloroquine',
      name: 'Hydroxychloroquine',
      smiles: 'CCN(CCO)CCCC(C)NC1=C2C=CC(=CC2=NC=C1)Cl',
      formula: 'C18H26ClN3O',
      molecularWeight: 335.87,
      originalIndication: 'Malaria & Rheumatoid Arthritis',
      originalCategory: 'Antivirals',
      repurposedIndication: 'KRAS-Driven Autophagy Inhibitor in Pancreatic Ductal Carcinoma',
      targetDiseaseId: 'pancreatic-cancer',
      aiMatchScore: 82,
      targetGene: 'Lysosome Acidification / KRAS Autophagy',
      bindingEnergy: '-8.3 kcal/mol',
      toxicityStatus: 'Mild Liver Toxicity Warning',
      toxicityBreakdown: {
        hepatotoxicity: 32,
        cardiotoxicity: 35,
        nephrotoxicity: 20,
        overallSafetyScore: 75
      },
      literatureCount: 34,
      citations: [
        {
          id: 'pm-1001',
          title: 'High-dose Hydroxychloroquine combined with Gemcitabine/Nab-Paclitaxel in pre-treated pancreatic ductal adenocarcinoma.',
          journal: 'The Lancet Oncology',
          year: 2023,
          authors: 'Zeh H.J., Bahary N., Boone B.A.',
          bioBertConfidence: 92.7,
          summary: 'Autophagy blockage at lysosomal membrane yielded a 38% pathological response rate.',
          pmid: '37290111'
        }
      ],
      protocol: {
        phase: 'Phase 2 Randomized Combination Trial',
        recommendedDosage: '600 mg twice daily oral',
        targetPatientCohort: 'Resectable KRAS-mutant pancreatic adenocarcinoma',
        primaryEndpoints: ['Pathologic treatment response rate', 'Median Progression Free Survival'],
        suggestedBiomarkers: ['p62/LC3-II autophagic flux markers', 'Circulating KRAS mutant allele frequency'],
        estimatedDurationMonths: 15
      },
      mechanismSummary: 'Inhibits lysosomal acidification and autophagosome-lysosome fusion, trapping pancreatic tumor cells that rely on KRAS-induced autophagic nutrient recycling.',
      structureCoordinates: [
        { x: 30, y: 40, element: 'Cl' },
        { x: 60, y: 50, element: 'N' },
        { x: 90, y: 50, element: 'C' }
      ]
    }
  ]
};

export const MOCK_GRAPH_NODES: Record<string, { nodes: GraphNode[]; edges: GraphEdge[] }> = {
  'breast-cancer': {
    nodes: [
      { id: 'disease-bc', label: 'Breast Cancer', type: 'disease', x: 260, y: 200, description: 'Triple-Negative / HER2+ / Invasive Ductal Subtypes' },
      
      // Target Proteins
      { id: 'protein-ampk', label: 'AMPK / mTOR Pathway', type: 'protein', x: 140, y: 110, affinity: '-8.8 kcal/mol', description: 'Metabolic master switch regulating cell growth & mTORC1' },
      { id: 'protein-nfkb', label: 'NF-kB / Proteasome', type: 'protein', x: 380, y: 110, affinity: '-9.4 kcal/mol', description: '26S Proteasome & inflammatory transcription subunit' },
      { id: 'protein-hedgehog', label: 'Hedgehog / VEGFR2', type: 'protein', x: 120, y: 290, affinity: '-8.2 kcal/mol', description: 'Smoothened transmembrane receptor & tumor angiogenesis' },
      { id: 'protein-stat3', label: 'STAT3 / Wnt Pathway', type: 'protein', x: 400, y: 290, affinity: '-7.9 kcal/mol', description: 'Epithelial-mesenchymal transition regulator & metastasis' },
      { id: 'protein-pde5', label: 'PDE5 Phosphodiesterase', type: 'protein', x: 260, y: 340, affinity: '-8.1 kcal/mol', description: 'Myeloid suppressor cell immune checkpoint pathway' },

      // Drug Candidates
      { id: 'drug-metformin', label: 'Metformin (93%)', type: 'drug', x: 60, y: 60, category: 'Antidiabetics', score: 93, affinity: '-8.8 kcal/mol' },
      { id: 'drug-disulfiram', label: 'Disulfiram (87%)', type: 'drug', x: 480, y: 60, category: 'Psychiatric', score: 87, affinity: '-9.4 kcal/mol' },
      { id: 'drug-itraconazole', label: 'Itraconazole (81%)', type: 'drug', x: 40, y: 360, category: 'Antifungal', score: 81, affinity: '-8.2 kcal/mol' },
      { id: 'drug-niclosamide', label: 'Niclosamide (76%)', type: 'drug', x: 480, y: 360, category: 'Antihelminthic', score: 76, affinity: '-7.9 kcal/mol' },
      { id: 'drug-sildenafil', label: 'Sildenafil (74%)', type: 'drug', x: 260, y: 440, category: 'Cardiovascular', score: 74, affinity: '-8.1 kcal/mol' }
    ],
    edges: [
      { source: 'disease-bc', target: 'protein-ampk', label: 'Drives metabolic growth' },
      { source: 'disease-bc', target: 'protein-nfkb', label: 'Overexpresses survival pathways' },
      { source: 'disease-bc', target: 'protein-hedgehog', label: 'Promotes invasive angiogenesis' },
      { source: 'disease-bc', target: 'protein-stat3', label: 'Drives metastatic invasion' },
      { source: 'disease-bc', target: 'protein-pde5', label: 'Suppresses T-cell infiltration' },

      { source: 'drug-metformin', target: 'protein-ampk', label: 'Activates phosphorylation', affinity: '-8.8 kcal/mol' },
      { source: 'drug-disulfiram', target: 'protein-nfkb', label: 'Inhibits 26S subunit', affinity: '-9.4 kcal/mol' },
      { source: 'drug-itraconazole', target: 'protein-hedgehog', label: 'Blocks SMO receptor', affinity: '-8.2 kcal/mol' },
      { source: 'drug-niclosamide', target: 'protein-stat3', label: 'Blocks SH2 dimerization', affinity: '-7.9 kcal/mol' },
      { source: 'drug-sildenafil', target: 'protein-pde5', label: 'Inhibits cGMP breakdown', affinity: '-8.1 kcal/mol' }
    ]
  },
  'alzheimers': {
    nodes: [
      { id: 'disease-ad', label: "Alzheimer's Disease", type: 'disease', x: 260, y: 200, description: 'Amyloid-beta and Tau neuropathology' },
      { id: 'protein-nmda', label: 'NMDA / BACE1 Complex', type: 'protein', x: 150, y: 120, affinity: '-8.9 kcal/mol' },
      { id: 'protein-glp1r', label: 'GLP-1R / Insulin Pathway', type: 'protein', x: 370, y: 120, affinity: '-9.2 kcal/mol' },
      { id: 'drug-memantine', label: 'Memantine (91%)', type: 'drug', x: 60, y: 60, category: 'Neuroprotective', score: 91, affinity: '-8.9 kcal/mol' },
      { id: 'drug-liraglutide', label: 'Liraglutide (88%)', type: 'drug', x: 460, y: 60, category: 'Antidiabetics', score: 88, affinity: '-9.2 kcal/mol' }
    ],
    edges: [
      { source: 'disease-ad', target: 'protein-nmda' },
      { source: 'disease-ad', target: 'protein-glp1r' },
      { source: 'drug-memantine', target: 'protein-nmda', affinity: '-8.9 kcal/mol' },
      { source: 'drug-liraglutide', target: 'protein-glp1r', affinity: '-9.2 kcal/mol' }
    ]
  },
  'parkinsons': {
    nodes: [
      { id: 'disease-pd', label: "Parkinson's Disease", type: 'disease', x: 260, y: 200, description: 'Dopaminergic neurodegeneration' },
      { id: 'protein-gba1', label: 'GBA1 / Autophagy', type: 'protein', x: 260, y: 110, affinity: '-8.6 kcal/mol' },
      { id: 'drug-ambroxol', label: 'Ambroxol (89%)', type: 'drug', x: 260, y: 340, category: 'Cardiovascular', score: 89, affinity: '-8.6 kcal/mol' }
    ],
    edges: [
      { source: 'disease-pd', target: 'protein-gba1' },
      { source: 'drug-ambroxol', target: 'protein-gba1', affinity: '-8.6 kcal/mol' }
    ]
  },
  'glioblastoma': {
    nodes: [
      { id: 'disease-gbm', label: 'Glioblastoma', type: 'disease', x: 260, y: 200, description: 'Grade IV Astrocytoma' },
      { id: 'protein-cox2', label: 'COX-2 / EGFRvIII', type: 'protein', x: 260, y: 110, affinity: '-8.5 kcal/mol' },
      { id: 'drug-celecoxib', label: 'Celecoxib (84%)', type: 'drug', x: 260, y: 340, category: 'Cardiovascular', score: 84, affinity: '-8.5 kcal/mol' }
    ],
    edges: [
      { source: 'disease-gbm', target: 'protein-cox2' },
      { source: 'drug-celecoxib', target: 'protein-cox2', affinity: '-8.5 kcal/mol' }
    ]
  },
  'pancreatic-cancer': {
    nodes: [
      { id: 'disease-pc', label: 'Pancreatic Cancer', type: 'disease', x: 260, y: 200, description: 'PDAC Oncogenic Pathway' },
      { id: 'protein-kras', label: 'KRAS Autophagy / Lysosome', type: 'protein', x: 260, y: 110, affinity: '-8.3 kcal/mol' },
      { id: 'drug-hcq', label: 'Hydroxychloroquine (82%)', type: 'drug', x: 260, y: 340, category: 'Antivirals', score: 82, affinity: '-8.3 kcal/mol' }
    ],
    edges: [
      { source: 'disease-pc', target: 'protein-kras' },
      { source: 'drug-hcq', target: 'protein-kras', affinity: '-8.3 kcal/mol' }
    ]
  }
};
