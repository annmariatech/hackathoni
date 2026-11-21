import React from 'react';
import { IconCheckStamp } from './HandIcons';

interface StampProps {
  type: 'verified' | 'pending' | 'simulated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Stamp:
 * Status marks that NEVER convey information by colour alone:
 * - verified: round rubber stamp + checkmark
 * - pending: dashed outline with clock/dots
 * - simulated: official diagonal ink stamp "SIMULATED / സിമുലേറ്റഡ്"
 */
export const Stamp: React.FC<StampProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  if (type === 'verified') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--backwater)] border-2 border-[var(--backwater)] rounded-full px-2.5 py-0.5 select-none ${
          size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm px-3.5 py-1' : 'text-xs'
        } ${className}`}
        style={{
          transform: 'rotate(-4deg)',
          borderRadius: '24px 22px 25px 23px / 22px 25px 23px 24px',
        }}
      >
        <IconCheckStamp size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2.5} />
        <span>Verified / സാക്ഷ്യപ്പെടുത്തിയത്</span>
      </div>
    );
  }

  if (type === 'pending') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-medium text-[var(--ink-soft)] border-2 border-dashed border-[var(--ink-soft)] rounded-lg px-2.5 py-0.5 select-none ${
          size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm px-3.5 py-1' : 'text-xs'
        } ${className}`}
        style={{
          borderRadius: '8px 10px 8px 10px',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[var(--sun)] animate-pulse" />
        <span>Pending / കാത്തിരിക്കുന്നു</span>
      </div>
    );
  }

  // Simulated rubber ink stamp (Required for Data Honesty on mock datasets)
  return (
    <div
      className={`inline-block font-mono font-black uppercase tracking-widest text-[var(--laterite)] border-2 border-[var(--laterite)] px-2 py-0.5 select-none ${
        size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs px-3 py-1' : 'text-[10px]'
      } ${className}`}
      style={{
        transform: 'rotate(-5deg)',
        boxShadow: '1px 1px 0px rgba(180,83,47,0.3)',
      }}
    >
      SIMULATED / സിമുലേറ്റഡ്
    </div>
  );
};
