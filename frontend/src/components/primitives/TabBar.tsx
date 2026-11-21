import React from 'react';
import { IconBoat, IconPatch, IconMicLamp, IconLedger } from './HandIcons';

export type TabId = 'today' | 'map' | 'speak' | 'wages';

interface TabBarProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  className?: string;
}

/**
 * TabBar:
 * Bottom tab bar designed for mobile thumb zone:
 * 4 tabs: ഇന്ന് Today · ഭൂപടം Map · പറയൂ Speak (centre, raised lamp-mic) · കൂലി Wages.
 * Minimum 48px tap targets.
 */
export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onChangeTab,
  className = '',
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[var(--paper)] border-t-2 border-[var(--ink)] px-2 pt-2 pb-safe safe-pb shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${className}`}
      aria-label="Navigation Bar"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* 1. ഇന്ന് Today */}
        <button
          type="button"
          onClick={() => onChangeTab('today')}
          className={`flex flex-col items-center justify-center min-h-[52px] min-w-[64px] px-2 py-1 transition-all tap-target-48 ${
            activeTab === 'today' ? 'text-[var(--laterite)] font-bold' : 'text-[var(--ink-soft)]'
          }`}
        >
          <IconBoat size={22} strokeWidth={activeTab === 'today' ? 2.5 : 2} />
          <span className="text-[11px] font-display mt-0.5">ഇന്ന് Today</span>
        </button>

        {/* 2. ഭൂപടം Map */}
        <button
          type="button"
          onClick={() => onChangeTab('map')}
          className={`flex flex-col items-center justify-center min-h-[52px] min-w-[64px] px-2 py-1 transition-all tap-target-48 ${
            activeTab === 'map' ? 'text-[var(--laterite)] font-bold' : 'text-[var(--ink-soft)]'
          }`}
        >
          <IconPatch size={22} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
          <span className="text-[11px] font-display mt-0.5">ഭൂപടം Map</span>
        </button>

        {/* 3. പറയൂ Speak (Centre Raised Nilavilakku Lamp-Mic) */}
        <div className="relative -top-5">
          <button
            type="button"
            onClick={() => onChangeTab('speak')}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-[var(--ink)] shadow-[2px_3px_0px_var(--ink)] active:translate-y-1 transition-transform tap-target-48 ${
              activeTab === 'speak'
                ? 'bg-[var(--laterite)] text-[var(--paper)]'
                : 'bg-[var(--sun)] text-[var(--ink)]'
            }`}
            style={{
              borderRadius: '28px 30px 27px 29px / 29px 27px 30px 28px',
            }}
            aria-label="Malayalam Voice Desk (പറയൂ)"
          >
            <IconMicLamp size={26} strokeWidth={2.5} />
            <span className="text-[9px] font-display font-black leading-none mt-0.5">പറയൂ</span>
          </button>
        </div>

        {/* 4. കൂലി Wages */}
        <button
          type="button"
          onClick={() => onChangeTab('wages')}
          className={`flex flex-col items-center justify-center min-h-[52px] min-w-[64px] px-2 py-1 transition-all tap-target-48 ${
            activeTab === 'wages' ? 'text-[var(--laterite)] font-bold' : 'text-[var(--ink-soft)]'
          }`}
        >
          <IconLedger size={22} strokeWidth={activeTab === 'wages' ? 2.5 : 2} />
          <span className="text-[11px] font-display mt-0.5">കൂലി Wages</span>
        </button>
      </div>
    </nav>
  );
};
