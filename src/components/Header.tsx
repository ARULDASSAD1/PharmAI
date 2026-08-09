import React from 'react';
import {
  Dna,
  Activity,
  FileSpreadsheet,
  BarChart3,
  BookOpen,
  Info,
  Sparkles,
  ShieldCheck,
  Database
} from 'lucide-react';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenExport: () => void;
  onOpenStats: () => void;
  onOpenDocs: () => void;
  onOpenPubChem: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAbout,
  onOpenExport,
  onOpenStats,
  onOpenDocs,
  onOpenPubChem,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Dna className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                PharmAI <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent font-extrabold">Repurpose</span>
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                v3.8 GNN
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>AI-Accelerated Drug Indication Discovery</span>
            </p>
          </div>
        </div>

        {/* Live Engine Status Indicator */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold">GNN Engine: Active</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Knowledge Graph: <strong className="text-cyan-300">2.4M Nodes</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenPubChem}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800/80 text-xs font-semibold transition-all shadow-sm"
            title="Search NIH PubChem Chemical Database"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">PubChem DB</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            title="About the Engine"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">About Engine</span>
          </button>

          <button
            onClick={onOpenStats}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            title="Dataset Statistics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
            <span>Dataset Stats</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-md shadow-cyan-900/30 text-xs font-semibold transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
