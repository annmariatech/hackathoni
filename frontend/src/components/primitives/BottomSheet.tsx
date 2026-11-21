import React from 'react';
import { X } from 'lucide-react';
import { KasavuBorder } from './KasavuBorder';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * BottomSheet:
 * Mobile slide-up sheet with rope-style drag handle, hand-inked borders, and kasavu trim.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        className="relative w-full max-w-lg bg-[var(--paper)] text-[var(--ink)] border-t-2 border-x-2 border-[var(--ink)] rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.18)] max-h-[85vh] flex flex-col z-10 safe-pb animate-in slide-in-from-bottom duration-250"
        style={{
          borderRadius: '24px 24px 0 0',
        }}
      >
        {/* Rope-Style Coir Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-grab" onClick={onClose}>
          <div
            className="w-14 h-2 rounded-full border border-[var(--ink)]/50 bg-[#C49A45]/40"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, var(--kasavu) 0, var(--kasavu) 2px, transparent 0, transparent 4px)',
            }}
          />
        </div>

        {/* Kasavu Accent Line */}
        <KasavuBorder className="my-1" />

        {/* Header */}
        {(title || subtitle) && (
          <div className="px-5 pt-2 pb-3 flex items-start justify-between border-b border-[var(--ink)]/15">
            <div>
              {title && <h3 className="font-display text-lg font-bold text-[var(--ink)]">{title}</h3>}
              {subtitle && <p className="text-xs text-[var(--ink-soft)] font-ui">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-[var(--ink-soft)] hover:text-[var(--ink)] tap-target-48 rounded-full"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
