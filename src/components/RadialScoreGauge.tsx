import React from 'react';
import { Sparkles } from 'lucide-react';

interface RadialScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showTextLabel?: boolean;
  compact?: boolean;
}

export const RadialScoreGauge: React.FC<RadialScoreGaugeProps> = ({
  score,
  size = 38,
  strokeWidth = 3.5,
  showTextLabel = true,
  compact = false,
}) => {
  // Determine Tailwind color scale dynamically based on the score percentage value
  const getColorScheme = (val: number) => {
    if (val >= 90) {
      return {
        strokeHex: '#22d3ee', // Tailwind cyan-400
        textClass: 'text-cyan-300',
        badgeBg: 'bg-cyan-950/90 border-cyan-700/80 shadow-cyan-950/50',
        ringGlow: 'drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]',
        label: 'Strong Match',
      };
    }
    if (val >= 80) {
      return {
        strokeHex: '#2dd4bf', // Tailwind teal-400
        textClass: 'text-teal-300',
        badgeBg: 'bg-teal-950/90 border-teal-700/80 shadow-teal-950/50',
        ringGlow: 'drop-shadow-[0_0_5px_rgba(45,212,191,0.6)]',
        label: 'High Match',
      };
    }
    if (val >= 70) {
      return {
        strokeHex: '#fbbf24', // Tailwind amber-400
        textClass: 'text-amber-300',
        badgeBg: 'bg-amber-950/90 border-amber-700/80 shadow-amber-950/50',
        ringGlow: 'drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]',
        label: 'Moderate Match',
      };
    }
    return {
      strokeHex: '#f43f5e', // Tailwind rose-500
      textClass: 'text-rose-300',
      badgeBg: 'bg-rose-950/90 border-rose-700/80 shadow-rose-950/50',
      ringGlow: 'drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]',
      label: 'Low Match',
    };
  };

  const scheme = getColorScheme(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  if (compact) {
    const cSize = 28;
    const cStroke = 2.5;
    const cRadius = (cSize - cStroke) / 2;
    const cCircumference = 2 * Math.PI * cRadius;
    const cOffset = cCircumference - (Math.min(100, Math.max(0, score)) / 100) * cCircumference;

    return (
      <div className="inline-flex items-center space-x-2">
        <div className="relative inline-flex items-center justify-center shrink-0">
          <svg width={cSize} height={cSize} className="-rotate-90 transform">
            <circle
              cx={cSize / 2}
              cy={cSize / 2}
              r={cRadius}
              stroke="#1e293b"
              strokeWidth={cStroke}
              fill="none"
            />
            <circle
              cx={cSize / 2}
              cy={cSize / 2}
              r={cRadius}
              stroke={scheme.strokeHex}
              strokeWidth={cStroke}
              strokeDasharray={cCircumference}
              strokeDashoffset={cOffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className={`absolute text-[9px] font-mono font-bold ${scheme.textClass}`}>
            {score}
          </span>
        </div>
        <span className={`font-mono text-xs font-bold ${scheme.textClass}`}>{score}%</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl border ${scheme.badgeBg} shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
    >
      {/* SVG Radial Ring Gauge */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Fill Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.strokeHex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className={`transition-all duration-1000 ease-out ${scheme.ringGlow}`}
          />
        </svg>

        {/* Center Percentage */}
        <span className={`absolute text-[11px] font-mono font-black ${scheme.textClass}`}>
          {score}%
        </span>
      </div>

      {/* Text Label */}
      {showTextLabel && (
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
            AI Match
          </span>
          <span className={`text-[11px] font-mono font-extrabold leading-tight ${scheme.textClass}`}>
            {scheme.label}
          </span>
        </div>
      )}
    </div>
  );
};
