import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Warehouse } from 'lucide-react';

interface DryingWindow {
  date: string;
  condition: 'OPTIMAL_DRY' | 'MARGINAL' | 'WET_NO_HARVEST';
  precipitation_mm: number;
  sunshine_hours: number;
  relative_humidity_pct: number;
  is_harvest_safe: boolean;
}

interface DryingYard {
  yard_id: string;
  name: string;
  total_capacity_sqm: number;
  occupied_sqm: number;
  available_sqm: number;
}

export const DryingYardSlots: React.FC = () => {
  const [windows, setWindows] = useState<DryingWindow[]>([]);
  const [yards, setYards] = useState<DryingYard[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const resp = await fetch('/api/v1/forecast/drying-windows');
        if (resp.ok) {
          const data = await resp.json();
          setWindows(data.drying_windows || []);
          setYards(data.drying_yards || []);
        }
      } catch (e) {
        console.error('Failed to load forecast', e);
      }
    };
    fetchForecast();
  }, []);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-sky-400" />
            Open-Meteo Drying Forecast & Yard Slots
          </h2>
        </div>
      </div>

      {/* 7-Day Drying Windows */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          7-Day Harvest Feasibility Windows:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {windows.map((w) => {
            const isOptimal = w.condition === 'OPTIMAL_DRY';
            const isMarginal = w.condition === 'MARGINAL';

            return (
              <div
                key={w.date}
                className={`p-3 rounded-xl border text-center transition ${
                  isOptimal
                    ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                    : isMarginal
                    ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                    : 'bg-rose-950/40 border-rose-600/40 text-rose-300'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-300">
                  {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                </div>
                <div className="my-1.5 flex justify-center">
                  {isOptimal ? (
                    <Sun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <CloudRain className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  {isOptimal ? 'Optimal' : isMarginal ? 'Marginal' : 'No Harvest'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {w.precipitation_mm}mm · {w.sunshine_hours}h sun
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drying Yard Capacities */}
      <div className="border-t border-slate-800 pt-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Registered Community Drying Yards:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {yards.map((yard) => {
            const pct = Math.round((yard.occupied_sqm / yard.total_capacity_sqm) * 100);
            return (
              <div
                key={yard.yard_id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white text-xs truncate">{yard.name}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Capacity: {yard.available_sqm} m² free</span>
                    <span className="font-bold text-white">{pct}% full</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
