import React from 'react';

interface ChipProps {
  label: string;
  count?: number | string;
  active?: boolean;
  variant?: 'ink' | 'laterite' | 'leaf' | 'hyacinth' | 'water';
  onClick?: () => void;
  className?: string;
}

/**
 * Chip:
 * Hand-drawn rounded chip / tag for filters and categories.
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  active = false,
  variant = 'ink',
  onClick,
  className = '',
}) => {
  const variantColors = {
    ink: active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--paper-2)] text-[var(--ink)]',
    laterite: active ? 'bg-[var(--laterite)] text-[var(--paper)]' : 'bg-[var(--paper-2)] text-[var(--laterite)]',
    leaf: active ? 'bg-[var(--leaf)] text-[var(--paper)]' : 'bg-[var(--paper-2)] text-[var(--leaf)]',
    hyacinth: active ? 'bg-[var(--hyacinth-deep)] text-[var(--paper)]' : 'bg-[var(--paper-2)] text-[var(--hyacinth-deep)]',
    water: active ? 'bg-[var(--backwater)] text-[var(--paper)]' : 'bg-[var(--paper-2)] text-[var(--backwater)]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-[var(--ink)]/40 transition-all select-none min-h-[36px] ${
        variantColors[variant]
      } ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'} ${className}`}
      style={{
        borderRadius: '16px 14px 18px 15px / 15px 18px 14px 16px',
      }}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-bold">
          {count}
        </span>
      )}
    </button>
  );
};
