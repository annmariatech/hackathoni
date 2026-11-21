import React from 'react';
import { KasavuBorder } from './primitives/KasavuBorder';
import { Stamp } from './primitives/Stamp';
import { Sun, Moon, BookOpen, Palette } from 'lucide-react';

export type MainTab = 'today' | 'map' | 'speak' | 'wages' | 'dashboard';

interface HeaderProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenStory: () => void;
  onOpenKit: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenStory,
  onOpenKit,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[var(--paper)] text-[var(--ink)] border-b-2 border-[var(--ink)]/40 shadow-sm transition-colors">
      {/* Top Kasavu Border */}
      <KasavuBorder />

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('today')}
            className="text-left select-none hover:opacity-90 transition"
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl text-[var(--ink)] tracking-tight">
                പായൽ ടു പേ
              </span>
              <span className="font-display text-xs text-[var(--laterite)] font-bold hidden sm:inline">
                Payal-to-Pay
              </span>
              <Stamp type="simulated" size="sm" />
            </div>
            <span className="text-[10px] text-[var(--ink-soft)] font-ui block">
              വേമ്പനാട്ട് കായൽ ഉപഗ്രഹ-കൂലി വിതരണ ശൃംഖല · Alappuzha
            </span>
          </button>
        </div>

        {/* Data Honesty Badges */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-[var(--backwater)]/10 text-[var(--backwater)] border border-[var(--backwater)]/30 font-bold">
            [REAL] Sentinel-1 SAR
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--laterite)]/10 text-[var(--laterite)] border border-[var(--laterite)]/30 font-bold">
            [REAL] Sarvam Saaras & Bulbul
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--sun)]/20 text-black border border-[var(--sun)] font-bold">
            [SIMULATED] Wages & Ledger
          </span>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Story for Judges */}
          <button
            onClick={onOpenStory}
            className="px-2.5 py-1.5 rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-2)] hover:bg-[var(--paper)] text-xs font-display font-bold text-[var(--ink)] flex items-center gap-1.5 transition shadow-[1px_2px_0px_var(--ink)] tap-target-48"
            title="Open 4-Chapter Project Story"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--laterite)]" />
            <span className="hidden sm:inline">കഥ ·</span>
            <span>Story</span>
          </button>

          {/* Component Kit Link */}
          <button
            onClick={onOpenKit}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--ink)]/40 bg-[var(--paper-2)] hover:bg-[var(--paper)] text-xs font-display text-[var(--ink)] flex items-center gap-1 transition tap-target-48"
            title="View Component Kit"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--backwater)]" />
            <span>/kit</span>
          </button>

          {/* Day / Night Lamp Toggle */}
          <button
            onClick={onToggleTheme}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--ink)] bg-[var(--paper-2)] hover:bg-[var(--paper)] text-xs font-display flex items-center gap-1.5 transition tap-target-48"
            aria-label="Toggle Night Lamp Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[var(--sun)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--ink)]" />
            )}
            <span className="hidden sm:inline">{isDark ? 'Day' : 'Night'}</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs (Hidden on mobile where bottom TabBar takes over) */}
      <div className="hidden md:block border-t border-[var(--ink)]/20 bg-[var(--paper-2)]/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs font-display font-bold">
          <button
            onClick={() => onSelectTab('today')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'today'
                ? 'border-[var(--laterite)] text-[var(--laterite)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            ഇന്ന് Today
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'map'
                ? 'border-[var(--laterite)] text-[var(--laterite)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            ഭൂപടം Map
          </button>
          <button
            onClick={() => onSelectTab('speak')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'speak'
                ? 'border-[var(--laterite)] text-[var(--laterite)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            പറയൂ Speak (Sarvam)
          </button>
          <button
            onClick={() => onSelectTab('wages')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'wages'
                ? 'border-[var(--laterite)] text-[var(--laterite)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            കൂലി Wages
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-[var(--laterite)] text-[var(--laterite)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            ഡാഷ്‌ബോർഡ് Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};
