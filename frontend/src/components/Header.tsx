import React, { useEffect, useState } from 'react';
import { Radio, Sparkles, Database, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'ledger' | 'credibility';
  setActiveTab: (tab: 'map' | 'ledger' | 'credibility') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [credits, setCredits] = useState<{
    total_stt_seconds: number;
    total_tts_chars: number;
    cached_audio_hits: number;
  }>({ total_stt_seconds: 0, total_tts_chars: 0, cached_audio_hits: 0 });

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/v1/voice/credits');
        if (res.ok) {
          const data = await res.json();
          setCredits(data);
        }
      } catch (e) {
        // quiet error on dev
      }
    };
    fetchCredits();
    const interval = setInterval(fetchCredits, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Payal-to-Pay <span className="font-['Noto_Sans_Malayalam'] text-emerald-400">പായൽ</span>
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Alappuzha Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Satellite-to-Wages Water Hyacinth Supply Chain & Malayalam Voice Desk
            </p>
          </div>
        </div>

        {/* Data Honesty Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>[REAL] Sentinel-1 SAR</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 font-medium">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>[REAL] Sarvam Voice</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-600/30 text-amber-300 font-medium">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>[SIMULATED] Wages & Ledger</span>
          </div>

          {/* Credit Usage Counter */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sarvam:</span>
            <span className="font-mono text-emerald-400 font-bold">{credits.total_stt_seconds}s</span> STT
            <span>·</span>
            <span className="font-mono text-sky-400 font-bold">{credits.total_tts_chars}</span> chars
            {credits.cached_audio_hits > 0 && (
              <span className="text-xs text-emerald-400/80">({credits.cached_audio_hits} cached)</span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Live Lake Map
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Harvester Ledger
          </button>
        </div>
      </div>
    </header>
  );
};
