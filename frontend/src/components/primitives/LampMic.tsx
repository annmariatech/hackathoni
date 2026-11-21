import React from 'react';

interface LampMicProps {
  isListening?: boolean;
  audioLevel?: number; // 0.0 to 1.0
  onToggleRecord?: () => void;
  className?: string;
}

/**
 * LampMic:
 * Nilavilakku (traditional Kerala brass lamp) microphone interface.
 * The oil-lamp flame pulses and grows proportionally with spoken audio input level.
 */
export const LampMic: React.FC<LampMicProps> = ({
  isListening = false,
  audioLevel = 0.4,
  onToggleRecord,
  className = '',
}) => {
  // Flame scaling factor based on live audio volume
  const flameScale = isListening ? 1.0 + Math.min(1.2, audioLevel * 1.5) : 1.0;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <button
        type="button"
        onClick={onToggleRecord}
        className={`relative group w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 tap-target-48 border-2 border-[var(--ink)] ${
          isListening
            ? 'bg-[var(--laterite)] shadow-[0_0_24px_rgba(242,182,50,0.6)]'
            : 'bg-[var(--paper-2)] hover:bg-[#E5D7B7] shadow-[3px_4px_0px_var(--ink)]'
        }`}
        style={{
          borderRadius: '52px 56px 50px 54px / 54px 50px 56px 52px',
        }}
        aria-label={isListening ? 'Stop Recording' : 'Start Spoken Malayalam Recording'}
      >
        {/* Animated Sacred Lamp Flame */}
        <div
          className="relative transition-transform duration-100 ease-out flex items-center justify-center"
          style={{ transform: `scale(${flameScale})` }}
        >
          {/* Flame Aura */}
          {isListening && (
            <div className="absolute w-12 h-16 rounded-full bg-[var(--sun)]/40 blur-md animate-pulse" />
          )}

          {/* Hand-drawn Nilavilakku Flame SVG */}
          <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Warm Amber Flame */}
            <path
              d="M22 2C16 12 6 22 10 36C12 43 17 48 22 48C27 48 32 43 34 36C38 22 28 12 22 2Z"
              fill={isListening ? 'var(--sun)' : 'var(--kasavu)'}
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Inner Golden Core */}
            <path
              d="M22 14C19 20 14 26 16 34C17 38 19 41 22 41C25 41 27 38 28 34C30 26 25 20 22 14Z"
              fill="var(--laterite)"
              opacity="0.85"
            />
            {/* Lamp Wick */}
            <path d="M22 42V48" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Brass Lamp Oil Bowl Base */}
        <svg width="56" height="20" viewBox="0 0 56 20" fill="none" className="mt-0.5">
          <path
            d="M4 4C8 14 48 14 52 4C48 2 8 2 4 4Z"
            fill="var(--kasavu)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <path d="M24 13V18H32V13" stroke="var(--ink)" strokeWidth="2" />
        </svg>

        <span className="font-display font-extrabold text-[11px] text-[var(--ink)] mt-1">
          {isListening ? 'കേൾക്കുന്നു...' : 'പറയൂ Speak'}
        </span>
      </button>

      {/* Ripple Sound Waves when Active */}
      {isListening && (
        <div className="flex items-center gap-1 mt-3">
          {[0.3, 0.7, 1.0, 0.6, 0.9, 0.4, 0.8].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[var(--laterite)] rounded-full animate-bounce"
              style={{
                height: `${Math.max(6, h * 24)}px`,
                animationDelay: `${i * 90}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
