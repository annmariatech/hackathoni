import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * 10 Custom Hand-Drawn Icons for Alappuzha Backwater Supply Chain:
 * 24px strokes, round caps, 2.25px stroke-width:
 * mic-lamp, boat, patch, satellite, rain, drying-yard, ledger, coin, camera, check-stamp.
 */

// 1. Nilavilakku Lamp with flame-microphone
export const IconMicLamp: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Lamp Base and Stem */}
    <path d="M7 21h10M12 21v-7M9 14h6" />
    {/* Oil Lamp Bowl */}
    <path d="M5 14c0 1.5 3 2.5 7 2.5s7-1 7-2.5c0-1.2-2.5-2.2-6-2.4" />
    {/* Sacred Flame / Microphone Core */}
    <path d="M12 3c-1.5 2-3 4-1 6.5a2.5 2.5 0 0 0 4 0c2-2.5.5-4.5-1-6.5" fill="var(--sun)" fillOpacity="0.3" />
    {/* Wick Glow Arc */}
    <path d="M12 7v2" stroke="var(--laterite)" />
  </svg>
);

// 2. Vallam (Country Boat / Vanchi)
export const IconBoat: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Wooden Boat Hull with Curved Bow & Stern */}
    <path d="M2 13c3 5 17 5 20 0l-3-4H5l-3 4z" />
    {/* Harvester Oar / Paddle */}
    <path d="M14 6l-5 12" />
    <path d="M8 18c-.8.8-1.5 1.5-1 2s1.2-.2 2-1" />
    {/* Hyacinth cargo mound */}
    <path d="M8 9c1-1.5 3-2 5-2s4 .8 5 2" stroke="var(--leaf)" />
  </svg>
);

// 3. Water Hyacinth Patch (Floristic polygon)
export const IconPatch: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Floating Hyacinth Bulbous Mat */}
    <path d="M4 14c-1-3 1-7 4-8 3-1 5 1 6 3 2-2 5-2 6 0 2 3 0 7-3 8-3 1-9 1-13-3z" fill="var(--leaf)" fillOpacity="0.25" />
    {/* Violet Flower Petal */}
    <path d="M12 8c.5-2 1.5-2 2-1s.5 2-1 3-1.5 0-1-2z" fill="var(--hyacinth)" />
    <circle cx="13" cy="9" r="1" fill="var(--sun)" />
  </svg>
);

// 4. Sentinel-1 Satellite (SAR Radar)
export const IconSatellite: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Satellite Body */}
    <rect x="9" y="9" width="6" height="6" rx="1" />
    {/* Solar Wings */}
    <path d="M3 7l6 4M3 13l6-2M15 11l6-4M15 13l6 4" />
    <path d="M3 7v6M21 7v6" />
    {/* Radar Beam Pulses */}
    <path d="M10 18c1 1.5 3 1.5 4 0" stroke="var(--backwater)" />
    <path d="M8 21c2.5 2 5.5 2 8 0" stroke="var(--backwater)" />
  </svg>
);

// 5. Rain & Monsoonal Cloud
export const IconRain: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Cloud Outline */}
    <path d="M4 12a4 4 0 0 1 7-2 4 4 0 0 1 7 2 3 3 0 0 1-1 6H5a3 3 0 0 1-1-6z" />
    {/* Angled Coastal Raindrops */}
    <path d="M8 17l-2 4M13 17l-2 4M18 17l-2 4" stroke="var(--backwater)" />
  </svg>
);

// 5b. Sun (വെയിൽ / Solar Drying)
export const IconSun: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4" fill="var(--sun)" fillOpacity="0.4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="var(--sun)" />
  </svg>
);

// 6. Drying Yard (Thatched Drying Shed / Mat Area)
export const IconDryingYard: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Open Shed Roof */}
    <path d="M2 9l10-5 10 5" />
    <path d="M4 9v10M20 9v10M12 9v10" />
    {/* Spread Drying Fibres */}
    <path d="M7 15h10M7 18h10" stroke="var(--kasavu)" strokeDasharray="2 2" />
  </svg>
);

// 7. Ledger / Field Register Notebook
export const IconLedger: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Notebook Cover & Spine */}
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 3v18" />
    {/* Ruled lines */}
    <path d="M11 8h6M11 12h6M11 16h4" stroke="var(--ink-soft)" />
  </svg>
);

// 8. Rupee Coin (നാണയം)
export const IconCoin: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    {/* Rupee Symbol (₹) */}
    <path d="M9 7h6M9 10h5M9 7v6c2 0 3 0 3-2M11 13l3.5 4.5" />
  </svg>
);

// 9. Camera / Geotag Field Proof
export const IconCamera: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 8h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
    <circle cx="12" cy="14" r="3.5" />
  </svg>
);

// 10. Check Stamp / Official Seal
export const IconCheckStamp: React.FC<IconProps> = ({ className = '', size = 24, strokeWidth = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
    <path d="M8 12.5l2.5 2.5 5.5-5.5" stroke="var(--laterite)" />
  </svg>
);
