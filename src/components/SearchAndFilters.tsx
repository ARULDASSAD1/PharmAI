import React, { useState } from 'react';
import { Search, SlidersHorizontal, ShieldAlert, Filter, Sparkles, X, Dna, ArrowRight, Loader2 } from 'lucide-react';
import { FilterState, DiseaseTarget } from '../types/pharmai';

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  selectedDiseaseId: string;
  onSelectDisease: (id: string) => void;
  onSearchAndPredict: (diseaseName: string) => void;
  allDiseases: DiseaseTarget[];
  predictingLoading?: boolean;
  activeCandidatesCount: number;
  totalCandidatesCount: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  selectedDiseaseId,
  onSelectDisease,
  onSearchAndPredict,
  allDiseases,
  predictingLoading = false,
  activeCandidatesCount,
  totalCandidatesCount,
}) => {
  const [searchInput, setSearchInput] = useState<string>(filters.searchDisease || '');

  const quickPopularDiseases = [
    "Brain Cancer",
    "Breast Cancer",
    "Alzheimer's Disease",
    "Parkinson's Disease",
    "Glioblastoma",
    "Pancreatic Cancer",
    "Lung Cancer",
    "Multiple Sclerosis",
    "Crohn's Disease",
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearchAndPredict(searchInput.trim());
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Top row: AI Repurposing Search Bar */}
      <div className="space-y-2">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                onFilterChange({ searchDisease: e.target.value });
              }}
              placeholder="Search ANY disease target (e.g. Multiple Sclerosis, ALS, Crohn's, Lung Cancer, Alzheimer's)..."
              className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-inner font-mono"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ searchDisease: '' });
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={predictingLoading || !searchInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {predictingLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running GNN AI...</span>
              </>
            ) : (
              <>
                <Dna className="w-4 h-4 text-slate-950" />
                <span>Predict Repurposing (AI GNN)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Disease Target Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Target Diseases:
          </span>
          {quickPopularDiseases.map((diseaseName) => {
            const existing = allDiseases.find(
              (d) => d.name.toLowerCase() === diseaseName.toLowerCase() || d.id === diseaseName.toLowerCase().replace(/[^a-z0-9]/g, '-')
            );
            const isSelected = existing ? existing.id === selectedDiseaseId : searchInput.toLowerCase() === diseaseName.toLowerCase();

            return (
              <button
                key={diseaseName}
                onClick={() => {
                  setSearchInput(diseaseName);
                  onSearchAndPredict(diseaseName);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {diseaseName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 pt-2 border-t border-slate-800/80 items-center">
        {/* Slider: Min Repurposing Score */}
        <div className="lg:col-span-5 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center space-x-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Min AI Confidence Score</span>
            </span>
            <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
              {filters.minScore}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={filters.minScore}
            onChange={(e) => onFilterChange({ minScore: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (All Candidates)</span>
            <span>70% (Default)</span>
            <span>100% (Strict)</span>
          </div>
        </div>

        {/* Dropdown: Safety / Toxicity Filter */}
        <div className="lg:col-span-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safety / Toxicity Filter</span>
          </label>
          <select
            value={filters.toxicityFilter}
            onChange={(e) => onFilterChange({ toxicityFilter: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="All">All Toxicity Profiles</option>
            <option value="Low Toxicity / FDA Safe">FDA Approved - Low Safety Risk</option>
            <option value="Mild Warning">Mild Warning Only</option>
            <option value="High Risk">High Risk / Cardiotoxicity Alert</option>
          </select>
        </div>

        {/* Dropdown: Original Drug Category Filter */}
        <div className="lg:col-span-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Original Category</span>
          </label>
          <select
            value={filters.drugCategory}
            onChange={(e) => onFilterChange({ drugCategory: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Antidiabetics">Antidiabetics</option>
            <option value="Psychiatric">Psychiatric</option>
            <option value="Antifungal">Antifungal</option>
            <option value="Antihelminthic">Antihelminthic</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Antivirals">Antivirals</option>
            <option value="Neuroprotective">Neuroprotective</option>
          </select>
        </div>

        {/* Live Filter Counter */}
        <div className="lg:col-span-1 flex lg:flex-col justify-between items-center text-right text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Matching</span>
          <span className="font-mono text-cyan-300 font-extrabold text-sm">
            {activeCandidatesCount}/{totalCandidatesCount}
          </span>
        </div>
      </div>
    </div>
  );
};
