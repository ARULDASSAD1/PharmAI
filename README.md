# PharmAI Repurpose Engine

An interactive, AI-powered drug repurposing and virtual screening platform. PharmAI leverages Graph Neural Network (GNN) knowledge graphs, BioBERT literature verification, dual-embedding vectorization, and in-silico toxicity modeling powered by advanced AI models.

## 🚀 Key Capabilities

- **AI-Driven Repurposing Predictions:** Predict high-affinity FDA-approved or investigational candidates for target diseases using molecular docking models and AI.
- **Interactive Knowledge Graphs & Pathway Mapping:** Dynamic SVG graph visualizer mapping disease targets, protein/gene targets, and candidate drug interactions with AI match scores.
- **In-Silico Safety & Toxicity Radar:** Evaluates hepatotoxicity, cardiotoxicity (hERG), nephrotoxicity, and neurotoxicity with overall safety indices.
- **BioBERT Literature Verification:** Real-time PubMed citation tracking with confidence scores across 35M indexed papers.
- **Clinical Protocol Recommendations:** Suggested Phase 2 trial protocols, patient cohorts, dosing recommendations, and biomarkers.
- **Publication-Ready PDF & Dataset Export:** High-DPI vector PDF executive reports, structured JSON datasets, CSV spreadsheets, and printable research summaries.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, jsPDF, html2canvas
- **Backend:** Node.js, Express, Vite, `@google/genai` (AI Full-Stack API)
- **Data & Storage:** In-memory caching with browser local storage persistence

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

```bash
# Clone the repository
git clone <your-repository-url>

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

The application will launch at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License.
