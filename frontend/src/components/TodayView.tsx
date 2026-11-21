import React, { useState, useEffect } from 'react';
import { PaperCard } from './primitives/PaperCard';
import { InkButton } from './primitives/InkButton';
import { BoatProgress } from './primitives/BoatProgress';
import {
  IconSun,
  IconRain,
  IconBoat,
  IconMicLamp,
} from './primitives/HandIcons';
import { Stamp } from './primitives/Stamp';

interface TodayViewProps {
  selectedCrewId: string;
  onSelectCrewId: (crewId: string) => void;
  onOpenSpeakTab: () => void;
  onOpenMapTab: () => void;
  onVerifyPhoto: (patchId: string, patchName: string) => void;
}

interface DryingWindow {
  date: string;
  condition: 'OPTIMAL_DRY' | 'MARGINAL' | 'WET_NO_HARVEST';
  precipitation_mm: number;
  sunshine_hours: number;
  relative_humidity_pct: number;
  is_harvest_safe: boolean;
}

export const TodayView: React.FC<TodayViewProps> = ({
  selectedCrewId,
  onSelectCrewId,
  onOpenSpeakTab,
  onOpenMapTab,
  onVerifyPhoto,
}) => {
  const [windows, setWindows] = useState<DryingWindow[]>([]);
  const [targetKg] = useState<number>(500);
  const [collectedKg] = useState<number>(350);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const resp = await fetch('/api/v1/forecast/drying-windows');
        if (resp.ok) {
          const data = await resp.json();
          setWindows(data.drying_windows || []);
        }
      } catch (e) {
        console.error('Failed to load forecast', e);
      }
    };
    fetchForecast();
  }, []);

  const todayForecast = windows[0] || {
    date: '2026-11-22',
    condition: 'OPTIMAL_DRY',
    precipitation_mm: 0.2,
    sunshine_hours: 8.5,
    relative_humidity_pct: 68,
    is_harvest_safe: true,
  };

  const crewDetails: Record<string, { name: string; boat: string; unit: string; target: number }> = {
    'crew-1': { name: 'ലീല & സതി', boat: 'വള്ളം 1', unit: 'കുടുംബശ്രീ യൂണിറ്റ് 1', target: 500 },
    'crew-2': { name: 'അനിത & മിനി', boat: 'വള്ളം 2', unit: 'കുടുംബശ്രീ യൂണിറ്റ് 2', target: 450 },
    'crew-3': { name: 'ഷീല & രാധ', boat: 'വള്ളം 3', unit: 'കുടുംബശ്രീ യൂണിറ്റ് 3', target: 400 },
  };

  const currentCrew = crewDetails[selectedCrewId] || crewDetails['crew-1'];

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Weather & Solar Drying Window Strip */}
      <PaperCard className="bg-[var(--paper)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[var(--sun)]/20 text-[var(--ink)] border border-[var(--ink)]/30">
              {todayForecast.precipitation_mm > 2 ? <IconRain size={26} /> : <IconSun size={26} />}
            </div>
            <div>
              <span className="text-[11px] font-mono text-[var(--ink-soft)] block uppercase">
                ഇന്നത്തെ കാലാവസ്ഥ · Drying Window
              </span>
              <span className="font-display font-bold text-base text-[var(--ink)]">
                {todayForecast.condition === 'OPTIMAL_DRY'
                  ? 'ഉണക്കാൻ അനുയോജ്യം (Optimal Dry)'
                  : todayForecast.condition === 'MARGINAL'
                  ? 'മിതമായ വെയിൽ (Marginal)'
                  : 'മഴ മുന്നറിയിപ്പ് (Wet)'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-sm font-bold text-[var(--backwater)]">
              {todayForecast.sunshine_hours} hrs വെയിൽ
            </div>
            <div className="text-[11px] text-[var(--ink-soft)] font-mono">
              മഴ: {todayForecast.precipitation_mm} mm
            </div>
          </div>
        </div>

        {/* 7-Day Mini Stepper Strip */}
        {windows.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--ink)]/15 grid grid-cols-7 gap-1 text-center">
            {windows.slice(0, 7).map((w, idx) => (
              <div
                key={w.date}
                className={`py-1.5 px-0.5 rounded border text-[9px] font-display ${
                  idx === 0
                    ? 'border-2 border-[var(--ink)] bg-[var(--paper-2)] font-bold'
                    : 'border-[var(--ink)]/20'
                }`}
              >
                <span className="block text-[8px] text-[var(--ink-soft)]">
                  {new Date(w.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                </span>
                <span className={`block font-bold mt-0.5 ${w.is_harvest_safe ? 'text-[var(--backwater)]' : 'text-[var(--laterite)]'}`}>
                  {w.is_harvest_safe ? 'വെയിൽ' : 'മഴ'}
                </span>
              </div>
            ))}
          </div>
        )}
      </PaperCard>

      {/* 2. Harvester Crew & Boat Selector */}
      <PaperCard className="bg-[var(--paper)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--paper-2)] border border-[var(--ink)]/30 text-[var(--ink)]">
              <IconBoat size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[var(--ink-soft)] block">
                ശേഖരണ വള്ളം · Harvester Crew
              </span>
              <span className="font-display font-extrabold text-lg text-[var(--ink)]">
                {currentCrew.name} ({currentCrew.boat})
              </span>
              <span className="text-xs text-[var(--ink-soft)] font-ui block">
                {currentCrew.unit}
              </span>
            </div>
          </div>

          <select
            value={selectedCrewId}
            onChange={(e) => onSelectCrewId(e.target.value)}
            className="bg-[var(--paper-2)] border-2 border-[var(--ink)] rounded-xl px-3 py-2 text-xs font-display font-bold text-[var(--ink)] focus:outline-none tap-target-48"
          >
            <option value="crew-1">വള്ളം 1 — ലീല & സതി (Kudumbashree 1)</option>
            <option value="crew-2">വള്ളം 2 — അനിത & മിനി (Kudumbashree 2)</option>
            <option value="crew-3">വള്ളം 3 — ഷീല & രാധ (Kudumbashree 3)</option>
          </select>
        </div>
      </PaperCard>

      {/* 3. Stepping Stones Route Card & BoatProgress */}
      <PaperCard hasKasavu className="bg-[var(--paper)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[var(--laterite)] font-bold uppercase tracking-wider block">
              ഇന്നത്തെ ഒപ്റ്റിമൈസ് ചെയ്ത റൂട്ട്
            </span>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              പുന്നമട കനാൽ → കൈനകരി ഡ്രൈയിംഗ് യാർഡ്
            </h3>
          </div>
          <Stamp type="simulated" size="sm" />
        </div>

        {/* Vallam sailing progress */}
        <BoatProgress
          progressPct={Math.round((collectedKg / targetKg) * 100)}
          crewName={`${currentCrew.name} (${currentCrew.boat})`}
          sourceName="പുന്നമട ജെട്ടി"
          destinationName="കൈനകരി യാർഡ്"
        />

        {/* Stepping Stones Stops List */}
        <div className="pt-2 border-t border-[var(--ink)]/20 space-y-2">
          <span className="text-xs font-display font-bold text-[var(--ink)] block">
            റൂട്ട് സ്റ്റോപ്പുകൾ (Planned Stepping Stones):
          </span>
          <div className="grid grid-cols-1 gap-2 text-xs font-ui">
            <div className="p-2.5 rounded-lg border border-[var(--ink)]/30 bg-[var(--paper-2)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--laterite)] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  <b className="font-display text-[var(--ink)]">പുന്നമട ബോട്ട് ജെട്ടി ചാനൽ</b>
                  <span className="text-[10px] text-[var(--ink-soft)] block">തടസ്സം: 88% Choke · 4,200 m²</span>
                </div>
              </div>
              <button
                onClick={() => onVerifyPhoto('patch-1', 'Punnamada Jetties Choke')}
                className="px-2.5 py-1 rounded border border-[var(--ink)] bg-[var(--paper)] text-[10px] font-display font-bold hover:bg-[var(--laterite)] hover:text-white transition"
              >
                ഫോട്ടോ എടുക്കുക
              </button>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--ink)]/30 bg-[var(--paper-2)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--backwater)] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  <b className="font-display text-[var(--ink)]">കൈനകരി വടക്ക് പാടശേഖരം</b>
                  <span className="text-[10px] text-[var(--ink-soft)] block">കരകയറ്റൽ: 350 kg ഫൈബർ പായൽ</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--backwater)]">
                പൂർത്തിയായി ✓
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--ink)]/30 bg-[var(--paper-2)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--kasavu)] text-black text-[10px] font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  <b className="font-display text-[var(--ink)]">കൈനകരി കമ്മ്യൂണിറ്റി യാർഡ്</b>
                  <span className="text-[10px] text-[var(--ink-soft)] block">ഡ്രൈയിംഗ് സ്ലോട്ട്: 850 m² ശേഷി</span>
                </div>
              </div>
              <span className="text-[10px] text-[var(--ink-soft)] font-mono">
                ETA: 1:30 PM
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={onOpenMapTab}
            className="text-[var(--backwater)] font-display font-bold underline hover:opacity-80 transition"
          >
            ഭൂപടത്തിൽ കാണുക (Open Map) →
          </button>
          <span className="font-mono text-[11px] text-[var(--ink-soft)]">
            ശേഷിക്കുന്ന ദൂരം: <b>2.4 km</b>
          </span>
        </div>
      </PaperCard>

      {/* 4. Big Primary Malayalam Call-To-Action "പറയൂ" */}
      <div className="p-5 bg-[var(--paper-2)] border-2 border-[var(--ink)] rounded-2xl shadow-[3px_4px_0px_var(--ink)] text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <IconMicLamp size={28} />
          <h3 className="font-display font-black text-xl text-[var(--ink)]">
            ശേഖരണം രേഖപ്പെടുത്തൂ
          </h3>
        </div>
        <p className="font-ui text-xs text-[var(--ink-soft)] max-w-sm mx-auto leading-relaxed">
          കായലിൽ വെച്ച് തന്നെ മലയാളത്തിൽ സംസാരിച്ച് ശേഖരിച്ച പായലിന്റെ അളവ് റിപ്പോർട്ട് ചെയ്യാം
        </p>
        <InkButton variant="primary" fullWidth onClick={onOpenSpeakTab} className="text-base py-3.5">
          <span className="flex items-center justify-center gap-2">
            <span>പറയൂ · Malayalam Voice Desk</span>
          </span>
        </InkButton>
      </div>
    </div>
  );
};
