import React from 'react';
import { Stamp } from './Stamp';

interface LedgerRowProps {
  id: string;
  harvesterName: string;
  boatName: string;
  weightKg: number;
  ratePerKg?: number;
  bonus?: number;
  totalPayout: number;
  dateStr: string;
  status: 'verified' | 'pending' | 'simulated';
  onClick?: () => void;
}

/**
 * LedgerRow:
 * Ruled handwritten collector register row with authentic Malayalam typography
 * and bold Arabic numerals for key kg and ₹ amounts.
 */
export const LedgerRow: React.FC<LedgerRowProps> = ({
  id,
  harvesterName,
  boatName,
  weightKg,
  ratePerKg = 3.50,
  bonus = 500,
  totalPayout,
  dateStr,
  status,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative py-3.5 px-3 border-b border-[var(--ink)]/20 hover:bg-[var(--paper-2)]/60 transition-colors select-none ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Harvester & Boat */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-[var(--ink)]">
              {harvesterName}
            </span>
            <span className="text-xs text-[var(--ink-soft)] font-ui">({boatName})</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--ink-soft)]">
            <span>{dateStr}</span>
            <span>·</span>
            <span className="font-mono text-[11px]">₹{ratePerKg}/kg + ₹{bonus}</span>
            <span>·</span>
            <span className="font-mono text-[11px]">Tx: {id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Right: Key Figures & Status */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="font-mono font-bold text-lg text-[var(--laterite)]">
              {weightKg} kg
            </span>
            <span className="font-display font-extrabold text-lg text-[var(--backwater)]">
              ₹{totalPayout.toFixed(0)}
            </span>
          </div>

          <div className="mt-1 flex justify-end">
            <Stamp type={status} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
