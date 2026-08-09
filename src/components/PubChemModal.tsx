import React, { useState } from 'react';
import { Search, X, Database, ExternalLink, Copy, Check, FlaskConical, Dna, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface PubChemCompound {
  cid: number;
  title: string;
  iupacName?: string;
  formula?: string;
  molecularWeight?: number;
  canonicalSmiles?: string;
  isomericSmiles?: string;
  inchikey?: string;
}

interface PubChemModalProps {
  onClose: () => void;
  onSelectCompound?: (compound: PubChemCompound) => void;
}

export const PubChemModal: React.FC<PubChemModalProps> = ({ onClose, onSelectCompound }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [compound, setCompound] = useState<PubChemCompound | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSmiles, setCopiedSmiles] = useState<boolean>(false);

  const quickSearches = ['Metformin', 'Sildenafil', 'Ketamine', 'Disulfiram', 'Rapamycin', 'Memantine', 'Tacrolimus', 'Paxlovid'];

  const handleSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setCompound(null);

    try {
      // Direct call to NCBI PubChem REST API
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        term
      )}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,InChIKey/JSON`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Compound "${term}" not found in NIH PubChem database.`);
      }

      const data = await response.json();
      const props = data?.PropertyTable?.Properties?.[0];

      if (!props || !props.CID) {
        throw new Error(`No matching compound records found for "${term}".`);
      }

      setCompound({
        cid: props.CID,
        title: props.Title || term,
        iupacName: props.IUPACName,
        formula: props.MolecularFormula,
        molecularWeight: props.MolecularWeight ? parseFloat(props.MolecularWeight) : undefined,
        canonicalSmiles: props.CanonicalSMILES,
        isomericSmiles: props.IsomericSMILES,
        inchikey: props.InChIKey,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compound record from NIH PubChem.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl shadow-cyan-950/50 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-300">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                NIH PubChem DB Live Search
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Live API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct lookup against the National Institutes of Health (NIH) chemical database
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type drug or compound name (e.g. Metformin, Sildenafil, Ketamine)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Lookup</span>
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold mr-1">Quick Query:</span>
            {quickSearches.map((drug) => (
              <button
                key={drug}
                onClick={() => {
                  setQuery(drug);
                  handleSearch(drug);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-cyan-300 transition-all"
              >
                {drug}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Compound Result Card */}
          {compound && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  {/* NIH PubChem 2D Structure Image */}
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center border border-slate-700 shrink-0">
                    <img
                      src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${compound.cid}/PNG?image_size=120x120`}
                      alt={compound.title}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      {compound.title}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        CID: {compound.cid}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-md line-clamp-1">{compound.iupacName}</p>
                  </div>
                </div>

                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>NIH Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Molecular Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block uppercase">Formula</span>
                  <span className="text-emerald-300 font-bold">{compound.formula || 'N/A'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block uppercase">Mol. Weight</span>
                  <span className="text-cyan-300 font-bold">
                    {compound.molecularWeight ? `${compound.molecularWeight} g/mol` : 'N/A'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block uppercase">InChIKey</span>
                  <span className="text-slate-300 font-mono text-[10px] truncate block">{compound.inchikey || 'N/A'}</span>
                </div>
              </div>

              {/* SMILES Section */}
              {compound.canonicalSmiles && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Canonical SMILES</span>
                    <button
                      onClick={() => copyToClipboard(compound.canonicalSmiles!)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-cyan-300 flex items-center gap-1"
                    >
                      {copiedSmiles ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSmiles ? 'Copied' : 'Copy SMILES'}</span>
                    </button>
                  </div>
                  <code className="text-[11px] text-cyan-300 break-all block bg-slate-950 p-2 rounded border border-slate-800/80">
                    {compound.canonicalSmiles}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span>Connected to NIH NCBI PUG REST Service</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
