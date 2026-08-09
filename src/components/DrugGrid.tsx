import React, { useState } from 'react';
import { LayoutGrid, Table, ArrowUpDown, Filter, Sparkles, FileText, ArrowRightLeft, Check, X } from 'lucide-react';
import { DrugCandidate } from '../types/pharmai';
import { DrugCard } from './DrugCard';
import { RadialScoreGauge } from './RadialScoreGauge';
import { ComparisonModal } from './ComparisonModal';

interface DrugGridProps {
  candidates: DrugCandidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (candidate: DrugCandidate) => void;
  onOpenModal: (candidate: DrugCandidate) => void;
  diseaseName: string;
}

export const DrugGrid: React.FC<DrugGridProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onOpenModal,
  diseaseName,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'score' | 'binding' | 'literature'>('score');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Toggle candidate for comparison (max 2)
  const toggleCompare = (candidate: DrugCandidate) => {
    setCompareIds((prev) => {
      if (prev.includes(candidate.id)) {
        return prev.filter((id) => id !== candidate.id);
      }
      if (prev.length >= 2) {
        return [prev[1], candidate.id]; // keep the last one and add new one
      }
      return [...prev, candidate.id];
    });
  };

  const handleOpenComparison = () => {
    setShowCompareModal(true);
  };

  // Sorting logic
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === 'score') return b.aiMatchScore - a.aiMatchScore;
    if (sortBy === 'binding') {
      const valA = parseFloat(a.bindingEnergy);
      const valB = parseFloat(b.bindingEnergy);
      return valA - valB; // lower energy (more negative) is higher affinity
    }
    if (sortBy === 'literature') return b.literatureCount - a.literatureCount;
    return 0;
  });

  return (
    <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Ranked Repurposed Drug Candidates</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {candidates.length} Identified
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized via GNN Binding Energy, BioBERT Citations, and In-Silico Safety Filters for <strong className="text-cyan-300">{diseaseName}</strong>
          </p>
        </div>

        {/* View Toggle, Sorting & Comparison Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Side-by-Side Compare Header Button */}
          <button
            onClick={handleOpenComparison}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-teal-950 hover:from-cyan-900 hover:to-teal-900 border border-cyan-700/80 text-cyan-300 font-extrabold text-xs shadow-md shadow-cyan-950/50 flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Side-by-Side Compare</span>
            {compareIds.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black">
                {compareIds.length}
              </span>
            )}
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 outline-none font-medium cursor-pointer"
            >
              <option value="score" className="bg-slate-900">Sort by AI Score</option>
              <option value="binding" className="bg-slate-900">Sort by Binding Energy</option>
              <option value="literature" className="bg-slate-900">Sort by Literature Count</option>
            </select>
          </div>

          {/* Grid/Table Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Detailed Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Compare Action Bar when items are checked */}
      {compareIds.length > 0 && (
        <div className="p-3 px-4 rounded-2xl bg-cyan-950/90 border border-cyan-700/80 shadow-xl flex items-center justify-between text-xs font-mono animate-fade-in">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-slate-100 font-bold">
              {compareIds.length} Candidate{compareIds.length > 1 ? 's' : ''} Selected for Head-to-Head Comparison
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenComparison}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md"
            >
              Compare Side-by-Side →
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* No Results Fallback */}
      {sortedCandidates.length === 0 && (
        <div className="py-16 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Drug Candidates Match Filter Criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting the Minimum Repurposing Score slider or clearing toxicity filters to reveal candidates.
          </p>
        </div>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && sortedCandidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedCandidates.map((candidate) => (
            <DrugCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidateId === candidate.id}
              isCompareSelected={compareIds.includes(candidate.id)}
              onSelect={(cand) => onSelectCandidate(cand)}
              onOpenModal={(cand) => onOpenModal(cand)}
              onToggleCompare={(cand) => toggleCompare(cand)}
            />
          ))}
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === 'table' && sortedCandidates.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 font-mono text-[11px] uppercase text-slate-400">
              <tr>
                <th className="py-3 px-3 text-center">Compare</th>
                <th className="py-3 px-4">Drug Candidate</th>
                <th className="py-3 px-4">Original Indication</th>
                <th className="py-3 px-4">Repurposed Target</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Target Gene</th>
                <th className="py-3 px-4">Binding Affinity</th>
                <th className="py-3 px-4">Toxicity Risk</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedCandidates.map((cand) => {
                const isComp = compareIds.includes(cand.id);
                return (
                  <tr
                    key={cand.id}
                    className={`hover:bg-slate-900/80 transition-colors ${
                      selectedCandidateId === cand.id ? 'bg-cyan-950/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleCompare(cand)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isComp
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                        }`}
                        title="Select for comparison"
                      >
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                      <span>{cand.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({cand.formula})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{cand.originalIndication}</td>
                    <td className="py-3 px-4 text-emerald-300 font-semibold">{cand.repurposedIndication}</td>
                    <td className="py-3 px-4">
                      <RadialScoreGauge score={cand.aiMatchScore} compact={true} />
                    </td>
                    <td className="py-3 px-4 text-purple-300 font-medium">{cand.targetGene}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{cand.bindingEnergy}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          cand.toxicityStatus.includes('FDA Approved')
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : cand.toxicityStatus.includes('Mild')
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}
                      >
                        {cand.toxicityStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenModal(cand)}
                        className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1 ml-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Comparison Modal Dialog */}
      {showCompareModal && (
        <ComparisonModal
          candidates={candidates}
          initialCandidateAId={compareIds[0]}
          initialCandidateBId={compareIds[1]}
          diseaseName={diseaseName}
          onClose={() => setShowCompareModal(false)}
          onOpenDetailModal={(cand) => {
            setShowCompareModal(false);
            onOpenModal(cand);
          }}
        />
      )}
    </section>
  );
};
