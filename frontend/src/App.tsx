import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { PushToTalk } from './components/PushToTalk';
import { SimulatedLedger } from './components/SimulatedLedger';
import { PatchCollection, LedgerTransaction, VoiceInteractionResponse } from './types';
import { Ship } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'ledger' | 'credibility'>('map');
  const [patches, setPatches] = useState<PatchCollection | null>(null);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [selectedCrewId, setSelectedCrewId] = useState<string>('crew-1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPatches = async () => {
    try {
      const res = await fetch('/api/v1/geo/patches');
      if (res.ok) {
        const data = await res.json();
        setPatches(data);
      }
    } catch (e) {
      console.error('Failed to load patches', e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/v1/ledger/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (e) {
      console.error('Failed to load transactions', e);
    }
  };

  useEffect(() => {
    fetchPatches();
    fetchTransactions();
  }, []);

  const handleInteractionComplete = (res: VoiceInteractionResponse) => {
    // Re-fetch patches (boat location updated) and transactions (wage logged)
    fetchPatches();
    fetchTransactions();

    setToastMessage(`Malayalam Voice Dispatched: "${res.dispatcher_response_malayalam.slice(0, 40)}..."`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-['Noto_Sans_Malayalam']">
          <Ship className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-emerald-400" />
              Active Harvester Boat:
            </span>
            <select
              value={selectedCrewId}
              onChange={(e) => setSelectedCrewId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="crew-1">വള്ളം 1 — ലീല & സതി (Kudumbashree Unit 1)</option>
              <option value="crew-2">വള്ളം 2 — അനിത & മിനി (Kudumbashree Unit 2)</option>
              <option value="crew-3">വള്ളം 3 — ഷീല & രാധ (Kudumbashree Unit 3)</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>AOI: <b>Punnamada–Kainakary Corridor</b> (Vembanad Lake)</span>
            <span>·</span>
            <span>Target: <b>Choke Point Clearance & Women's Craft Fibre Supply</b></span>
          </div>
        </div>

        {/* View Switch */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Column */}
            <div className="lg:col-span-8 space-y-4">
              <MapView patches={patches} selectedCrewId={selectedCrewId} />

              {/* Quick Summary Strip */}
              {patches && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Detected Patches</span>
                    <span className="text-lg font-extrabold text-white font-mono">{patches.metadata.total_patches}</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Biomass</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      {(patches.metadata.total_biomass_kg / 1000).toFixed(1)} tons
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critical Choke</span>
                    <span className="text-lg font-extrabold text-rose-400 font-mono">Punnamada Jetty</span>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Desk Column */}
            <div className="lg:col-span-4 space-y-4">
              <PushToTalk
                onInteractionComplete={handleInteractionComplete}
                selectedCrewId={selectedCrewId}
              />
            </div>
          </div>
        )}

        {/* Ledger Tab View */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <SimulatedLedger transactions={transactions} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Payal-to-Pay (പായൽ) · The Houseboat Hackathon, Alappuzha · Place & People / Voice & Language Track
      </footer>
    </div>
  );
};
export default App;
