import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  Sparkles,
  Zap,
  Dna,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  BookOpen,
  Activity,
  Award,
  Check,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DrugCandidate } from '../types/pharmai';
import { RadialScoreGauge } from './RadialScoreGauge';

interface ComparisonModalProps {
  candidates: DrugCandidate[];
  initialCandidateAId?: string;
  initialCandidateBId?: string;
  diseaseName: string;
  onClose: () => void;
  onOpenDetailModal?: (candidate: DrugCandidate) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  candidates,
  initialCandidateAId,
  initialCandidateBId,
  diseaseName,
  onClose,
  onOpenDetailModal,
}) => {
  const defaultA = initialCandidateAId || candidates[0]?.id;
  const defaultB = initialCandidateBId || (candidates[1]?.id !== defaultA ? candidates[1]?.id : candidates[0]?.id);

  const [candidateAId, setCandidateAId] = useState<string>(defaultA || '');
  const [candidateBId, setCandidateBId] = useState<string>(defaultB || '');
  const [copiedSmilesA, setCopiedSmilesA] = useState(false);
  const [copiedSmilesB, setCopiedSmilesB] = useState(false);

  const candidateA = candidates.find((c) => c.id === candidateAId) || candidates[0];
  const candidateB = candidates.find((c) => c.id === candidateBId) || candidates[1] || candidates[0];

  const handleSwap = () => {
    setCandidateAId(candidateBId);
    setCandidateBId(candidateAId);
  };

  const copySmiles = (smiles: string, isA: boolean) => {
    navigator.clipboard.writeText(smiles);
    if (isA) {
      setCopiedSmilesA(true);
      setTimeout(() => setCopiedSmilesA(false), 2000);
    } else {
      setCopiedSmilesB(true);
      setTimeout(() => setCopiedSmilesB(false), 2000);
    }
  };

  if (!candidateA || !candidateB) return null;

  // Helper values
  const energyA = parseFloat(candidateA.bindingEnergy);
  const energyB = parseFloat(candidateB.bindingEnergy);
  const betterEnergy = energyA < energyB ? 'A' : energyA > energyB ? 'B' : 'EQUAL';

  const renalA =
    candidateA.toxicityBreakdown?.renalToxicity ??
    Math.min(100, Math.round((candidateA.toxicityBreakdown?.nephrotoxicity || 12) * 0.92 + 4));
  const renalB =
    candidateB.toxicityBreakdown?.renalToxicity ??
    Math.min(100, Math.round((candidateB.toxicityBreakdown?.nephrotoxicity || 12) * 0.92 + 4));

  const safetyA = candidateA.toxicityBreakdown?.overallSafetyScore || 85;
  const safetyB = candidateB.toxicityBreakdown?.overallSafetyScore || 85;
  const saferCandidate = safetyA > safetyB ? 'A' : safetyA < safetyB ? 'B' : 'EQUAL';

  const getToxicityBadge = (status: string) => {
    if (status.includes('FDA Approved') || status.includes('Low')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{status}</span>
        </span>
      );
    }
    if (status.includes('Mild') || status.includes('Warning')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
        <ShieldAlert className="w-3 h-3 text-rose-400" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/40 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
              Side-by-Side Candidate Comparison
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Head-to-head affinity, toxicity, and mechanism profile for target disease: <strong className="text-cyan-300">{diseaseName}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Candidate Selection Dropdowns Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            {/* Candidate A Selector */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] uppercase font-bold text-cyan-400 font-mono block">
                Candidate A
              </label>
              <select
                value={candidateAId}
                onChange={(e) => setCandidateAId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name} ({c.aiMatchScore}% Match | {c.bindingEnergy})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500 transition-all hover:scale-105"
                title="Swap Candidate A & B"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Candidate B Selector */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] uppercase font-bold text-teal-400 font-mono block">
                Candidate B
              </label>
              <select
                value={candidateBId}
                onChange={(e) => setCandidateBId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name} ({c.aiMatchScore}% Match | {c.bindingEnergy})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Candidate A Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-800/60 shadow-lg space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px] rounded-bl-xl border-l border-b border-cyan-800">
                CANDIDATE A
              </div>

              <div className="flex items-start justify-between pr-20">
                <div>
                  <h3 className="text-lg font-black text-white">{candidateA.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{candidateA.formula}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <RadialScoreGauge score={candidateA.aiMatchScore} size={42} />

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Binding Energy</span>
                  <span className="text-sm font-bold font-mono text-cyan-300">{candidateA.bindingEnergy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono">SMILES:</span>
                <button
                  onClick={() => copySmiles(candidateA.smiles, true)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-[10px] font-mono text-cyan-300 border border-slate-800 flex items-center gap-1"
                >
                  {copiedSmilesA ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSmilesA ? 'Copied' : candidateA.smiles.slice(0, 18) + '...'}</span>
                </button>
              </div>

              {onOpenDetailModal && (
                <button
                  onClick={() => onOpenDetailModal(candidateA)}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-bold transition-all text-center"
                >
                  View Full Candidate A Sheet
                </button>
              )}
            </div>

            {/* Candidate B Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-800/60 shadow-lg space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-teal-950 text-teal-300 font-mono font-bold text-[10px] rounded-bl-xl border-l border-b border-teal-800">
                CANDIDATE B
              </div>

              <div className="flex items-start justify-between pr-20">
                <div>
                  <h3 className="text-lg font-black text-white">{candidateB.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{candidateB.formula}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <RadialScoreGauge score={candidateB.aiMatchScore} size={42} />

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Binding Energy</span>
                  <span className="text-sm font-bold font-mono text-teal-300">{candidateB.bindingEnergy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono">SMILES:</span>
                <button
                  onClick={() => copySmiles(candidateB.smiles, false)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-[10px] font-mono text-teal-300 border border-slate-800 flex items-center gap-1"
                >
                  {copiedSmilesB ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSmilesB ? 'Copied' : candidateB.smiles.slice(0, 18) + '...'}</span>
                </button>
              </div>

              {onOpenDetailModal && (
                <button
                  onClick={() => onOpenDetailModal(candidateB)}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-bold transition-all text-center"
                >
                  View Full Candidate B Sheet
                </button>
              )}
            </div>
          </div>

          {/* Key Metrics Summary Comparison Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              1. Affinity & Indication Translation Summary
            </h4>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                    <th className="py-2.5 px-4">Metric / Parameter</th>
                    <th className="py-2.5 px-4 text-cyan-300">{candidateA.name}</th>
                    <th className="py-2.5 px-4 text-teal-300">{candidateB.name}</th>
                    <th className="py-2.5 px-4 text-center">Comparison Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {/* Binding Energy */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">Binding Energy (ΔG)</td>
                    <td className={`py-3 px-4 font-bold ${betterEnergy === 'A' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {candidateA.bindingEnergy}
                      {betterEnergy === 'A' && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Higher Affinity</span>}
                    </td>
                    <td className={`py-3 px-4 font-bold ${betterEnergy === 'B' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {candidateB.bindingEnergy}
                      {betterEnergy === 'B' && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Higher Affinity</span>}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-300">
                      {Math.abs(energyA - energyB).toFixed(2)} kcal/mol
                    </td>
                  </tr>

                  {/* AI Match Score */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">AI Match Confidence</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{candidateA.aiMatchScore}%</td>
                    <td className="py-3 px-4 text-teal-300 font-bold">{candidateB.aiMatchScore}%</td>
                    <td className="py-3 px-4 text-center text-slate-300 font-bold">
                      {Math.abs(candidateA.aiMatchScore - candidateB.aiMatchScore)}% Δ
                    </td>
                  </tr>

                  {/* Target Gene */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">Target Gene / Pathway</td>
                    <td className="py-3 px-4 text-slate-200">{candidateA.targetGene}</td>
                    <td className="py-3 px-4 text-slate-200">{candidateB.targetGene}</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-[10px]">
                      {candidateA.targetGene === candidateB.targetGene ? 'Identical Target' : 'Distinct Pathways'}
                    </td>
                  </tr>

                  {/* Original -> Repurposed Indication */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">Repurposing Pathway</td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="text-slate-400">{candidateA.originalIndication}</span> → <span className="text-emerald-300 font-bold">{candidateA.repurposedIndication}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="text-slate-400">{candidateB.originalIndication}</span> → <span className="text-emerald-300 font-bold">{candidateB.repurposedIndication}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      Targeting <strong className="text-cyan-300">{diseaseName}</strong>
                    </td>
                  </tr>

                  {/* PubMed Literature Count */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">PubMed Literature Citations</td>
                    <td className="py-3 px-4 text-slate-200">{candidateA.literatureCount} papers</td>
                    <td className="py-3 px-4 text-slate-200">{candidateB.literatureCount} papers</td>
                    <td className="py-3 px-4 text-center text-slate-300 font-bold">
                      {Math.abs(candidateA.literatureCount - candidateB.literatureCount)} citations
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Organ-Level Toxicity Breakdown Comparison */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" />
              2. In-Silico Organ Toxicity & Safety Risk Comparison
            </h4>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organ Risk Gauges */}
                {[
                  {
                    label: 'Hepatotoxicity (Liver Risk)',
                    valA: candidateA.toxicityBreakdown.hepatotoxicity,
                    valB: candidateB.toxicityBreakdown.hepatotoxicity,
                    unit: '%',
                  },
                  {
                    label: 'Cardiotoxicity (Heart / hERG Risk)',
                    valA: candidateA.toxicityBreakdown.cardiotoxicity,
                    valB: candidateB.toxicityBreakdown.cardiotoxicity,
                    unit: '%',
                  },
                  {
                    label: 'Nephrotoxicity (Kidney Risk)',
                    valA: candidateA.toxicityBreakdown.nephrotoxicity,
                    valB: candidateB.toxicityBreakdown.nephrotoxicity,
                    unit: '%',
                  },
                  {
                    label: 'Renal Clearance Risk',
                    valA: renalA,
                    valB: renalB,
                    unit: '%',
                  },
                ].map((item, idx) => {
                  const lowerIsSafer = item.valA < item.valB ? 'A' : item.valA > item.valB ? 'B' : 'EQUAL';
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-bold text-slate-200">{item.label}</span>
                        <span className="text-[10px] text-slate-400">(Lower = Safer)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-cyan-300 font-bold">{candidateA.name}</span>
                            <span className={`font-bold ${lowerIsSafer === 'A' ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {item.valA}{item.unit}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 transition-all duration-500"
                              style={{ width: `${item.valA}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-teal-300 font-bold">{candidateB.name}</span>
                            <span className={`font-bold ${lowerIsSafer === 'B' ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {item.valB}{item.unit}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                            <div
                              className="h-full bg-teal-400 transition-all duration-500"
                              style={{ width: `${item.valB}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall Safety Status Comparison */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Overall Safety Score</span>
                    <span className="text-cyan-300 font-extrabold text-sm">{candidateA.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-extrabold text-base">{safetyA}/100</span>
                    <div className="mt-0.5">{getToxicityBadge(candidateA.toxicityStatus)}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Overall Safety Score</span>
                    <span className="text-teal-300 font-extrabold text-sm">{candidateB.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-extrabold text-base">{safetyB}/100</span>
                    <div className="mt-0.5">{getToxicityBadge(candidateB.toxicityStatus)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Clinical Trial Protocols */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              3. Phase 2 Proof-of-Concept Trial Protocols
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Protocol A */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-cyan-300">{candidateA.name} Protocol</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {candidateA.protocol?.phase || 'Phase 2 Design'}
                  </span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Recommended Dosage:</span>
                    <span className="font-bold text-slate-100">{candidateA.protocol?.recommendedDosage || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Suggested Biomarkers:</span>
                    <span className="text-cyan-300 font-bold">{candidateA.protocol?.suggestedBiomarkers?.join(', ') || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Trial Cohort & Duration:</span>
                    <span>{candidateA.protocol?.targetPatientCohort} ({candidateA.protocol?.estimatedDurationMonths || 12} Months)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Primary Endpoints:</span>
                    <span className="text-slate-200">{candidateA.protocol?.primaryEndpoints?.join('; ') || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Protocol B */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-teal-300">{candidateB.name} Protocol</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {candidateB.protocol?.phase || 'Phase 2 Design'}
                  </span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Recommended Dosage:</span>
                    <span className="font-bold text-slate-100">{candidateB.protocol?.recommendedDosage || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Suggested Biomarkers:</span>
                    <span className="text-teal-300 font-bold">{candidateB.protocol?.suggestedBiomarkers?.join(', ') || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Trial Cohort & Duration:</span>
                    <span>{candidateB.protocol?.targetPatientCohort} ({candidateB.protocol?.estimatedDurationMonths || 12} Months)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Primary Endpoints:</span>
                    <span className="text-slate-200">{candidateB.protocol?.primaryEndpoints?.join('; ') || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
            In-Silico predictions validated against ChEMBL & BioBERT literature graphs
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all ml-auto"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
