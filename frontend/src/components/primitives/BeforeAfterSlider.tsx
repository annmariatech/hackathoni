import React, { useState, useRef } from 'react';
import { Stamp } from './Stamp';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  patchName?: string;
  className?: string;
}

/**
 * BeforeAfterSlider:
 * Hand-drawn comparison slider with field photo proof before & after hyacinth harvest.
 * Rope-style drag handle with haptic feedback.
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
  afterImage = 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
  beforeLabel = 'മുമ്പ് (Before: ചാനൽ തടസ്സം)',
  afterLabel = 'ശേഷം (After: വൃത്തിയാക്കിയത്)',
  patchName = 'പുന്നമട ഫിനിഷിംഗ് ജെട്ടി (Punnamada Choke)',
  className = '',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleSliderMove(e.touches[0].clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  return (
    <div className={`p-4 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl shadow-[2px_3px_0px_var(--ink)] space-y-2 select-none ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div>
          <h4 className="font-display font-bold text-sm text-[var(--ink)]">{patchName}</h4>
          <span className="text-[10px] text-[var(--ink-soft)] font-ui">Geotagged Satellite & Camera Revisit Proof</span>
        </div>
        <Stamp type="verified" size="sm" />
      </div>

      {/* Comparison Viewport */}
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative w-full h-56 rounded-lg overflow-hidden border-2 border-[var(--ink)] cursor-ew-resize touch-none"
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white font-display text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs">
          {afterLabel}
        </div>

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current?.clientWidth || '100%',
              height: '100%',
            }}
          />
          <div className="absolute top-2 left-2 bg-[var(--laterite)] text-[var(--paper)] font-display text-[10px] px-2 py-0.5 rounded-full border border-[var(--ink)]">
            {beforeLabel}
          </div>
        </div>

        {/* Hand-Drawn Coir Rope Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[var(--paper)] border-x border-[var(--ink)] flex items-center justify-center -ml-0.5"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-[var(--kasavu)] border-2 border-[var(--ink)] shadow-md flex items-center justify-center text-[var(--ink)] font-bold text-xs">
            ⇄
          </div>
        </div>
      </div>
    </div>
  );
};
