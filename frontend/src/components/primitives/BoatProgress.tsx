import React from 'react';
import { RippleLine } from './RoughSvg';

interface BoatProgressProps {
  progressPct?: number; // 0 to 100
  crewName?: string;
  sourceName?: string;
  destinationName?: string;
  className?: string;
}

/**
 * BoatProgress:
 * Illustrated country boat (vallam) sailing along a hand-drawn ripple line
 * indicating harvest or transport journey progress.
 */
export const BoatProgress: React.FC<BoatProgressProps> = ({
  progressPct = 58,
  crewName = 'ലീല & സതി (വള്ളം 1)',
  sourceName = 'പുന്നമട ജെട്ടി',
  destinationName = 'കൈനകരി വടക്ക് യാർഡ്',
  className = '',
}) => {
  return (
    <div className={`p-4 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl shadow-[2px_3px_0px_var(--ink)] space-y-2 select-none ${className}`}>
      <div className="flex justify-between items-baseline text-xs font-display">
        <span className="font-bold text-[var(--ink)]">{crewName}</span>
        <span className="font-mono font-bold text-[var(--laterite)]">{progressPct}% സഞ്ചിരിച്ചു</span>
      </div>

      {/* Ripple Waterway Track */}
      <div className="relative pt-6 pb-2">
        {/* Animated Sailing Boat Position */}
        <div
          className="absolute top-0 transition-all duration-700 ease-out -ml-5"
          style={{ left: `${Math.max(5, Math.min(95, progressPct))}%` }}
        >
          {/* Hand-drawn Vallam SVG */}
          <svg width="36" height="24" viewBox="0 0 36 24" fill="none" className="overflow-visible animate-bounce" style={{ animationDuration: '2.5s' }}>
            {/* Wooden hull */}
            <path
              d="M2 14C8 22 28 22 34 14L30 8H6L2 14Z"
              fill="var(--paper-2)"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Oar */}
            <path d="M20 4L12 20" stroke="var(--ink)" strokeWidth="1.75" />
            {/* Hyacinth cargo */}
            <path d="M10 8C12 5 18 4 24 8" fill="var(--leaf)" stroke="var(--ink)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Hand-Drawn Water Ripple Line */}
        <RippleLine stroke="var(--backwater)" strokeWidth={2.5} />
      </div>

      {/* Source to Destination Labels */}
      <div className="flex justify-between text-[11px] text-[var(--ink-soft)] font-ui">
        <span>പുറപ്പെട്ടത്: <b>{sourceName}</b></span>
        <span>ലക്ഷ്യം: <b>{destinationName}</b></span>
      </div>
    </div>
  );
};
