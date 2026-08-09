import React, { useState } from 'react';
import {
  Clock,
  DollarSign,
  ShieldCheck,
  Cpu,
  Sparkles,
  Bot,
  Send,
  RefreshCw,
  HelpCircle,
  FileCode,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AiMetricsPanelProps {
  diseaseName: string;
  selectedDrugName?: string;
  onAskGemini: (customPrompt?: string) => void;
  geminiLoading: boolean;
  geminiResponse: string | null;
  geminiError: string | null;
}

export const AiMetricsPanel: React.FC<AiMetricsPanelProps> = ({
  diseaseName,
  selectedDrugName,
  onAskGemini,
  geminiLoading,
  geminiResponse,
  geminiError,
}) => {
  const [userQuery, setUserQuery] = useState<string>('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    onAskGemini(userQuery);
    setUserQuery('');
  };

  const handleQuickPrompt = (promptText: string) => {
    onAskGemini(promptText);
  };

  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      {/* 1. Quick Impact Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Time Saved Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              R&D Time Saved
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-extrabold text-white font-mono">3 Weeks</span>
            <span className="text-xs text-slate-500 line-through font-mono">4.2 Yrs</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 98% timeline reduction
          </p>
        </div>

        {/* Cost Savings Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all" />
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Cost Saved / Drug
            </span>
            <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white font-mono">~$1.2B</div>
          <p className="text-[10px] text-teal-400 font-medium mt-1">
            Pre-validated FDA safety profiles
          </p>
        </div>

        {/* Toxicity Filter Rate Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              In-Silico Filter Rate
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white font-mono">88% Screened</div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Early toxicities rejected in silico
          </p>
        </div>
      </div>

      {/* 2. AI Scoring Model Architecture Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-200">
              Dual-Embedding Vectorization Architecture
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            BioBERT + GNN
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          PharmAI maps 3D molecular structures (SMILES) and disease pathways into a continuous mathematical space using Graph Convolutional Networks (GNN) paired with BioBERT natural language indexing across 35M+ PubMed biomedical citations.
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block">128-Dim GNN Vector</span>
            3D Binding Pocket Alignment
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-purple-400 font-bold block">BioBERT Literature Score</span>
            Mechanistic Text Evidences
          </div>
        </div>
      </div>

      {/* 3. Interactive AI Engine Assistant */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 text-slate-950">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  AI Mechanistic Reasoning Sandbox
                </h3>
                <p className="text-[10px] text-slate-400">
                  Live hypothesis generation for <strong className="text-cyan-300">{diseaseName}</strong>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Online
            </span>
          </div>

          {/* Quick AI Hypothesis triggers */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() =>
                handleQuickPrompt(
                  `Analyze the top molecular repurposing mechanism for ${
                    selectedDrugName || 'Metformin'
                  } in treating ${diseaseName}. Detail the binding pathways.`
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Synthesize Repurposing Hypothesis</span>
            </button>

            <button
              onClick={() =>
                handleQuickPrompt(
                  `Provide a concise Phase 2 Clinical Trial safety and protocol overview for testing repurposed candidates in ${diseaseName}.`
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-teal-300 transition-colors flex items-center space-x-1"
            >
              <FileCode className="w-3 h-3 text-teal-400" />
              <span>Draft Clinical Protocol</span>
            </button>
          </div>

          {/* Response Box */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 min-h-[120px] max-h-[190px] overflow-y-auto text-xs font-mono text-slate-200">
            {geminiLoading ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400 mx-auto" />
                <p className="text-slate-400 text-[11px]">
                  Consulting Bioinformatics AI Agent...
                </p>
              </div>
            ) : geminiError ? (
              <div className="text-red-400 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Error
                </p>
                <p className="text-[11px]">{geminiError}</p>
              </div>
            ) : geminiResponse ? (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-200">
                {geminiResponse}
              </div>
            ) : (
              <div className="text-slate-500 py-6 text-center space-y-1">
                <Bot className="w-6 h-6 mx-auto opacity-40 text-cyan-400" />
                <p className="text-[11px]">
                  Click a hypothesis button above or ask custom questions to evaluate GNN predictions in real time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={`Ask AI about ${diseaseName} drug targets...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={geminiLoading || !userQuery.trim()}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
