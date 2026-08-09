import React from 'react';
import {
  X,
  Dna,
  AlertOctagon,
  Sparkles,
  Cpu,
  CheckCircle2,
  Database,
  Layers,
  ShieldCheck,
  TrendingUp,
  Zap
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 border-b border-slate-800 p-6 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Dna className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                About PharmAI Repurpose Engine
              </h2>
              <p className="text-xs text-slate-400">
                Next-Gen AI Platform for In-Silico Drug Indication Discovery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* SECTION 1: THE PROBLEM STATEMENT */}
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <h3 className="uppercase tracking-wider">The Problem Statement</h3>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-200 space-y-1.5 leading-relaxed pl-1">
              <li>
                Traditional drug discovery takes <strong>10–15 years</strong> and costs upwards of <strong>$2.6 Billion</strong> per approved drug candidate.
              </li>
              <li>
                Over <strong>90% of candidate molecules fail</strong> during clinical trial phases due to unforeseen toxicities, off-target interactions, or lack of in-vivo efficacy.
              </li>
            </ul>
          </div>

          {/* SECTION 2: OUR SOLUTION */}
          <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/80 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <h3 className="uppercase tracking-wider">Our Solution</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              PharmAI is an AI-accelerated drug repurposing platform that screens existing FDA-approved drugs to identify new therapeutic indications in <strong>days rather than years</strong>. By leveraging pre-validated human safety profiles, PharmAI bypasses early Phase 1 safety bottlenecks.
            </p>
          </div>

          {/* SECTION 3: ARCHITECTURE & AI PIPELINE */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
              <Cpu className="w-4 h-4 shrink-0" />
              <h3 className="uppercase tracking-wider">Architecture & AI Pipeline</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Multimodal Data Integration
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Unifies DrugBank, ChEMBL, PubChem, and 35M+ PubMed literature abstracts into a synchronized knowledge repository.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Biomedical Knowledge Graph
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Maps complex interaction networks across 2.4M nodes spanning diseases, target proteins, genes, and approved chemical compounds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Dual-Embedding Vectorization
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Converts 3D molecular structures and disease pathways into continuous mathematical space for high-precision Graph Convolutional Network (GNN) matching.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Virtual Toxicity Screening
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Predicts liver (hepatotoxicity) and heart (cardiotoxicity) risks early in silico to eliminate high-risk molecules before clinical trials.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: KEY ADVANTAGES */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <h3 className="uppercase tracking-wider">Key Advantages</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-lg font-extrabold text-cyan-400 font-mono">80%+</span>
                <p className="text-slate-300 font-semibold text-[11px]">Timeline Reduction</p>
                <p className="text-slate-500 text-[10px]">Early-stage discovery in weeks</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-lg font-extrabold text-teal-400 font-mono font-bold">$1.2B+</span>
                <p className="text-slate-300 font-semibold text-[11px]">R&D Cost Savings</p>
                <p className="text-slate-500 text-[10px]">Per approved drug candidate</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-lg font-extrabold text-emerald-400 font-mono">3.8x</span>
                <p className="text-slate-300 font-semibold text-[11px]">Success Rate</p>
                <p className="text-slate-500 text-[10px]">Pre-validated FDA safety</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-20 bg-slate-900/95 border-t border-slate-800 p-4 flex justify-end backdrop-blur-md">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Got It, Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
