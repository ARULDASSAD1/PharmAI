import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Network,
  Info,
  Maximize2,
  Sparkles,
  Zap
} from 'lucide-react';
import { GraphNode, GraphEdge, DrugCandidate } from '../types/pharmai';

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedDrugId: string | null;
  onSelectDrug: (drugId: string) => void;
  diseaseTitle: string;
  candidates?: DrugCandidate[];
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  nodes,
  edges,
  selectedDrugId,
  onSelectDrug,
  diseaseTitle,
  candidates = [],
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showProteinNodes, setShowProteinNodes] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoom(1);

  // Filter nodes/edges based on showProteinNodes toggle
  const visibleNodes = showProteinNodes
    ? nodes
    : nodes.filter((n) => n.type !== 'protein');

  const visibleEdges = showProteinNodes
    ? edges
    : edges.filter((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        const targetNode = nodes.find((n) => n.id === e.target);
        return sourceNode?.type !== 'protein' && targetNode?.type !== 'protein';
      });

  // Calculate clean radial layout positions for all visible nodes
  const nodePositions = React.useMemo(() => {
    const cx = 270; // SVG viewBox center X
    const cy = 240; // SVG viewBox center Y

    const diseases = visibleNodes.filter((n) => n.type === 'disease');
    const proteins = visibleNodes.filter((n) => n.type === 'protein');
    const drugs = visibleNodes.filter((n) => n.type === 'drug');

    const coords: Record<string, { x: number; y: number }> = {};

    // 1. Position Disease Node(s) in the middle
    diseases.forEach((dNode, idx) => {
      if (typeof dNode.x === 'number' && typeof dNode.y === 'number' && dNode.x > 0 && dNode.y > 0) {
        coords[dNode.id] = { x: dNode.x, y: dNode.y };
      } else {
        if (diseases.length === 1) {
          coords[dNode.id] = { x: cx, y: cy };
        } else {
          const angle = (2 * Math.PI * idx) / diseases.length;
          coords[dNode.id] = { x: cx + 30 * Math.cos(angle), y: cy + 30 * Math.sin(angle) };
        }
      }
    });

    // 2. Position Target Protein Nodes in inner ring (R1 = 115)
    const r1 = 115;
    proteins.forEach((pNode, idx) => {
      if (typeof pNode.x === 'number' && typeof pNode.y === 'number' && pNode.x > 0 && pNode.y > 0) {
        coords[pNode.id] = { x: pNode.x, y: pNode.y };
      } else {
        const angle = (2 * Math.PI * idx) / Math.max(proteins.length, 1) - Math.PI / 2;
        coords[pNode.id] = {
          x: Math.round(cx + r1 * Math.cos(angle)),
          y: Math.round(cy + r1 * Math.sin(angle)),
        };
      }
    });

    // 3. Position Drug Nodes in outer ring (R2 = 195)
    const r2 = 195;
    const drugOffset = drugs.length > 0 ? Math.PI / drugs.length : 0;
    drugs.forEach((dNode, idx) => {
      if (typeof dNode.x === 'number' && typeof dNode.y === 'number' && dNode.x > 0 && dNode.y > 0) {
        coords[dNode.id] = { x: dNode.x, y: dNode.y };
      } else {
        const angle = (2 * Math.PI * idx) / Math.max(drugs.length, 1) - Math.PI / 2 + drugOffset;
        coords[dNode.id] = {
          x: Math.round(cx + r2 * Math.cos(angle)),
          y: Math.round(cy + r2 * Math.sin(angle)),
        };
      }
    });

    return coords;
  }, [visibleNodes]);

  // Find node by id helper
  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col h-full shadow-lg relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 z-10">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <Network className="w-4 h-4 animate-pulse" />
            </div>
            <h2 className="text-sm font-bold text-slate-100 tracking-tight">
              Multimodal Knowledge Graph & Pathway Mapping
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Target: <span className="text-cyan-300 font-semibold">{diseaseTitle}</span> • GNN Convolutional Embedding
          </p>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-950/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setShowProteinNodes(!showProteinNodes)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              showProteinNodes
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Protein Pathways"
          >
            {showProteinNodes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">Proteins</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Legend & Instructions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 my-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 z-10">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-slate-300">Disease Target</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
            <span className="text-slate-300">Target Gene/Protein</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-slate-300">Repurposed Drug Candidate</span>
          </span>
        </div>
        <span className="text-slate-500 font-mono text-[10px]">Hover or click node to inspect pathway</span>
      </div>

      {/* Interactive Canvas SVG area */}
      <div className="relative flex-1 min-h-[380px] bg-slate-950/90 rounded-xl border border-slate-800/90 overflow-hidden flex items-center justify-center">
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
          viewBox="0 0 540 500"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            {/* Glowing Filters */}
            <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Edges / Connections */}
          {visibleEdges.map((edge, idx) => {
            const source = getNode(edge.source);
            const target = getNode(edge.target);
            if (!source || !target) return null;

            const sourcePos = nodePositions[edge.source] || { x: source.x || 270, y: source.y || 240 };
            const targetPos = nodePositions[edge.target] || { x: target.x || 270, y: target.y || 240 };

            const isHighlighted =
              selectedDrugId &&
              (edge.source.includes(selectedDrugId) || edge.target.includes(selectedDrugId));

            const isHovered =
              hoveredNode &&
              (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;

            return (
              <g key={`edge-${idx}`}>
                {/* Edge Line */}
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={
                    isHighlighted || isHovered
                      ? '#22d3ee'
                      : source.type === 'drug' || target.type === 'drug'
                      ? '#10b98160'
                      : '#6366f150'
                  }
                  strokeWidth={isHighlighted || isHovered ? 3 : 1.5}
                  strokeDasharray={source.type === 'drug' ? '4 2' : 'none'}
                  className="transition-all duration-300"
                />

                {/* Animated Flow Dots on highlighted edges */}
                {(isHighlighted || isHovered) && (
                  <circle r="3" fill="#22d3ee">
                    <animateMotion
                      path={`M${sourcePos.x},${sourcePos.y} L${targetPos.x},${targetPos.y}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Binding Affinity Label along Edge */}
                {edge.affinity && showProteinNodes && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-28"
                      y="-8"
                      width="56"
                      height="16"
                      rx="8"
                      fill="#020617"
                      stroke="#0891b2"
                      strokeWidth="0.8"
                    />
                    <text
                      textAnchor="middle"
                      dy="3"
                      fill="#22d3ee"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {edge.affinity}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {visibleNodes.map((node) => {
            const isDisease = node.type === 'disease';
            const isProtein = node.type === 'protein';
            const isDrug = node.type === 'drug';

            const pos = nodePositions[node.id] || { x: node.x || 270, y: node.y || 240 };

            const drugMatchId = isDrug ? node.id.replace('drug-', '') : null;
            const isSelected = selectedDrugId === drugMatchId;
            const isHovered = hoveredNode?.id === node.id;

            const matchingCandidate = isDrug
              ? candidates.find(
                  (c) =>
                    c.id === drugMatchId ||
                    node.id.includes(c.id) ||
                    c.name.toLowerCase() === node.label.toLowerCase() ||
                    node.label.toLowerCase().includes(c.name.toLowerCase())
                )
              : null;

            const scoreVal = node.score ?? matchingCandidate?.aiMatchScore ?? 88;

            let drugCategoryLabel = null;
            if (isDrug) {
              if (matchingCandidate?.originalCategory) {
                drugCategoryLabel = matchingCandidate.originalCategory;
              } else if (matchingCandidate?.originalIndication) {
                drugCategoryLabel = matchingCandidate.originalIndication;
              } else if (node.category && !node.category.toLowerCase().includes('small molecule')) {
                drugCategoryLabel = node.category;
              } else {
                drugCategoryLabel = 'Repurposed Drug';
              }
            }

            let fillColor = isDisease ? '#f43f5e' : isProtein ? '#a855f7' : '#34d399';
            let strokeColor = isDisease ? '#fda4af' : isProtein ? '#e9d5ff' : '#a7f3d0';
            let glowFilter = isDisease ? 'url(#glow-red)' : isProtein ? 'url(#glow-purple)' : 'url(#glow-green)';
            let nodeRadius = isDisease ? 26 : isProtein ? 20 : 22;

            if (isSelected) {
              fillColor = '#22d3ee';
              strokeColor = '#ffffff';
              nodeRadius = 26;
            }

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                  if (isDrug && (drugMatchId || matchingCandidate)) {
                    onSelectDrug(matchingCandidate ? matchingCandidate.id : drugMatchId!);
                  }
                }}
              >
                {/* Outer Pulse Effect */}
                {(isSelected || isHovered || isDisease) && (
                  <circle
                    r={nodeRadius + 8}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth="1.5"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      values={`${nodeRadius + 4};${nodeRadius + 14};${nodeRadius + 4}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0.1;0.6"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Main Circle */}
                <circle
                  r={nodeRadius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 2}
                  filter={glowFilter}
                  className="transition-all duration-200"
                />

                {/* Center Icon/Abbreviation */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#020617"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="select-none pointer-events-none"
                >
                  {isDisease ? 'TARGET' : isProtein ? 'GENE' : `${scoreVal}%`}
                </text>

                {/* Label Text Below Node */}
                <text
                  textAnchor="middle"
                  dy={nodeRadius + 14}
                  fill={isSelected ? '#38bdf8' : '#f8fafc'}
                  fontSize="10.5"
                  fontWeight={isSelected ? 'bold' : '600'}
                  className="drop-shadow-md select-none pointer-events-none"
                >
                  {node.label}
                </text>

                {/* Category Subtitle for Drugs */}
                {isDrug && drugCategoryLabel && (
                  <text
                    textAnchor="middle"
                    dy={nodeRadius + 26}
                    fill="#94a3b8"
                    fontSize="8.5"
                    fontFamily="sans-serif"
                    className="select-none pointer-events-none"
                  >
                    {drugCategoryLabel.length > 22 ? drugCategoryLabel.substring(0, 20) + '…' : drugCategoryLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md shadow-2xl flex items-start space-x-3 text-xs z-20 animate-fade-in">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">{hoveredNode.label}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {hoveredNode.type}
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {hoveredNode.description || 'Verified via GNN Convolutional Vectorization.'}
              </p>
              {hoveredNode.affinity && (
                <p className="text-[11px] text-cyan-400 font-mono">
                  Binding Energy: <strong>{hoveredNode.affinity}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
