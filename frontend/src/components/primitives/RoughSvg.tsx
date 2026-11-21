import React from 'react';

interface RoughBoxProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  seed?: number;
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  fill?: string;
}

/**
 * Deterministic rough.js rectangle/container rendered once as an SVG path.
 * Zero jitter on re-render.
 */
export const RoughBox: React.FC<RoughBoxProps> = ({
  className = '',
  stroke = 'currentColor',
  strokeWidth = 2,
  roughness = 1.2,
  fill,
}) => {

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <path
        d="M 2 2 L 98 2 L 98 98 L 2 98 Z"
        fill={fill || 'none'}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: roughness > 1 ? 'url(#ink-wobble)' : undefined,
          strokeDasharray: 'none',
        }}
      />
    </svg>
  );
};

interface RippleLineProps {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * Hand-drawn water ripple divider line
 */
export const RippleLine: React.FC<RippleLineProps> = ({
  className = '',
  stroke = 'var(--water)',
  strokeWidth = 2,
}) => {
  return (
    <svg
      className={`w-full h-3 overflow-visible ${className}`}
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 0 6 Q 25 1 50 6 T 100 6 T 150 6 T 200 6 T 250 6 T 300 6 T 350 6 T 400 6"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
