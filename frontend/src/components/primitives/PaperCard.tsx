import React from 'react';
import { KasavuBorder } from './KasavuBorder';

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  hasKasavu?: boolean;
  elevation?: 'flat' | 'raised';
  onClick?: () => void;
}

/**
 * PaperCard:
 * Warm kasavu cream paper card with hand-drawn rough border and optional kasavu trim.
 */
export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  className = '',
  hasKasavu = false,
  elevation = 'raised',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-[var(--paper)] text-[var(--ink)] p-4 transition-all duration-200 border-2 border-[var(--ink)]/80 ${
        elevation === 'raised'
          ? 'shadow-[3px_4px_0px_rgba(30,43,36,0.85)]'
          : 'shadow-[1px_1px_0px_rgba(30,43,36,0.6)]'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5' : ''} ${className}`}
      style={{
        // Subtle organic hand-drawn corner variation
        borderRadius: '12px 14px 11px 15px / 14px 11px 15px 12px',
      }}
    >
      {hasKasavu && (
        <div className="-mt-4 -mx-4 mb-3 rounded-t-xl overflow-hidden">
          <KasavuBorder />
        </div>
      )}
      {children}
    </div>
  );
};
