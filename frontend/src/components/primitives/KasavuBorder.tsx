import React from 'react';

interface KasavuBorderProps {
  className?: string;
  width?: string;
}

/**
 * Kasavu Border:
 * Inspired by traditional Kerala kasavu mundu / sari borders:
 * Double ink line, gold stripe, tiny woven zigzag pattern.
 */
export const KasavuBorder: React.FC<KasavuBorderProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`} aria-hidden="true">
      {/* Top Ink Line */}
      <div className="w-full h-[1.5px] bg-[var(--ink)] opacity-70" />

      {/* Gold Stripe with Woven Zigzag Pattern */}
      <div className="w-full h-2.5 bg-[var(--kasavu)]/25 flex items-center justify-between relative overflow-hidden">
        <svg
          className="w-full h-2 text-[var(--kasavu)] opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 200 8"
        >
          <path
            d="M 0 4 L 4 1 L 8 7 L 12 1 L 16 7 L 20 1 L 24 7 L 28 1 L 32 7 L 36 1 L 40 7 L 44 1 L 48 7 L 52 1 L 56 7 L 60 1 L 64 7 L 68 1 L 72 7 L 76 1 L 80 7 L 84 1 L 88 7 L 92 1 L 96 7 L 100 1 L 104 7 L 108 1 L 112 7 L 116 1 L 120 7 L 124 1 L 128 7 L 132 1 L 136 7 L 140 1 L 144 7 L 148 1 L 152 7 L 156 1 L 160 7 L 164 1 L 168 7 L 172 1 L 176 7 L 180 1 L 184 7 L 188 1 L 192 7 L 196 1 L 200 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bottom Ink Line */}
      <div className="w-full h-[1.5px] bg-[var(--ink)] opacity-70" />
    </div>
  );
};
