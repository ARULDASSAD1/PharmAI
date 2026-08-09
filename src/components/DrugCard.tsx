import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Dna,
  Zap,
  ExternalLink,
  BookOpen,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { DrugCandidate } from '../types/pharmai';
import { RadialScoreGauge } from './RadialScoreGauge';

interface DrugCardProps {
  candidate: DrugCandidate;
  isSelected: boolean;
  isCompareSelected?: boolean;
  onSelect: (candidate: DrugCandidate) => void;
  onOpenModal: (candidate: DrugCandidate) => void;
  onToggleCompare?: (candidate: DrugCandidate) => void;
}

export const DrugCard: React.FC<DrugCardProps> = ({
  candidate,
  isSelected,
  isCompareSelected = false,
  onSelect,
  onOpenModal,
  onToggleCompare,
}) => {
  // Color helper for toxicity risk badge
  const getToxicityBadge = (status: string) => {
    if (status.includes('FDA Approved') || status.includes('Low')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 shadow-sm shadow-emerald-950">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    }
    if (status.includes('Mild') || status.includes('Warning')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/80 shadow-sm shadow-amber-950">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/90 text-rose-300 border border-rose-700/80 shadow-sm shadow-rose-950 animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <span>{status}</span>
      </span>
    );
  };

  // Color helper for score percentage
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-cyan-400 border-cyan-500/80 bg-cyan-950/90';
    if (score >= 80) return 'text-teal-400 border-teal-500/80 bg-teal-950/90';
    return 'text-amber-400 border-amber-500/80 bg-amber-950/90';
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 relative ${
        isSelected
          ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/50'
          : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {candidate.name}
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {candidate.formula}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Original Category: <span className="text-slate-300">{candidate.originalCategory}</span>
          </p>
        </div>

        {/* AI Match Score Radial Indicator */}
        <RadialScoreGauge score={candidate.aiMatchScore} />
      </div>

      {/* Indication Mapping (Original -> Repurposed) */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Indication Translation Pathway
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium gap-2">
          {/* Original Indication */}
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="font-semibold text-slate-200">{candidate.originalIndication}</span>
          </div>

          {/* Arrow Icon */}
          <div className="flex items-center space-x-1 text-cyan-400 font-bold self-start sm:self-center">
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
              Repurposed
            </span>
          </div>

          {/* Repurposed Indication */}
          <div className="flex items-center space-x-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">{candidate.repurposedIndication}</span>
          </div>
        </div>
      </div>

      {/* Target Gene & Binding Affinity Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Target Gene / Pathway
          </span>
          <span className="font-bold text-slate-100 line-clamp-1 flex items-center gap-1">
            <Dna className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            {candidate.targetGene}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Binding Affinity
          </span>
          <span className="font-bold text-cyan-300 font-mono flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {candidate.bindingEnergy}
          </span>
        </div>
      </div>

      {/* Toxicity Status & PubMed Citation Count */}
      <div className="flex items-center justify-between pt-1">
        {getToxicityBadge(candidate.toxicityStatus)}

        <div className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span><strong>{candidate.literatureCount}</strong> PubMed Papers</span>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(candidate)}
            className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
              isCompareSelected
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-950'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle candidate for side-by-side comparison"
          >
            {isCompareSelected ? <Check className="w-3.5 h-3.5 text-cyan-300" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
            <span>{isCompareSelected ? 'Comparing' : 'Compare'}</span>
          </button>
        )}

        <button
          onClick={() => onSelect(candidate)}
          className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
            isSelected
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
              : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
          title="Highlight pathway in GNN graph"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isSelected ? 'Highlighted' : 'Highlight'}</span>
        </button>

        <button
          onClick={() => onOpenModal(candidate)}
          className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-cyan-900/30 transition-all flex items-center justify-center space-x-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};
