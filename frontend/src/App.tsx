import React, { useState, useEffect } from 'react';
import { Header, MainTab } from './components/Header';
import { TodayView } from './components/TodayView';
import { MapView } from './components/MapView';
import { SpeakView } from './components/SpeakView';
import { WagesView } from './components/WagesView';
import { DashboardView } from './components/DashboardView';
import { LandingStory } from './components/LandingStory';
import { PhotoVerificationModal } from './components/PhotoVerificationModal';
import { TabBar, TabId } from './components/primitives/TabBar';
import { KitPage } from './pages/KitPage';
import { PatchCollection, LedgerTransaction, VoiceInteractionResponse } from './types';
import { Sparkles } from 'lucide-react';

const INITIAL_TRANSACTIONS: LedgerTransaction[] = [
  {
    tx_hash: '9f82ab7164c0923e1104e8d2',
    timestamp: '2026-11-21T10:30:00Z',
    crew_id: 'crew-1',
    crew_name: 'ലീല & സതി (Kudumbashree Unit 1)',
    patch_id: 'patch-1',
    yard_id: 'yard-kainakary',
    weight_kg: 420.0,
    rate_inr_per_kg: 3.50,
    base_payout_inr: 1470.0,
    bonus_inr: 500.0,
    total_payout_inr: 1970.0,
    status: 'DISBURSED',
    bank_reference: 'KGB-UPI-9941204',
    is_simulated: true,
  },
  {
    tx_hash: '3b18dfa89104c99a0029ed71',
    timestamp: '2026-11-21T11:45:00Z',
    crew_id: 'crew-2',
    crew_name: 'അനിത & മിനി (Kudumbashree Unit 2)',
    patch_id: 'patch-2',
    yard_id: 'yard-punnamada',
    weight_kg: 350.0,
    rate_inr_per_kg: 3.50,
    base_payout_inr: 1225.0,
    bonus_inr: 500.0,
    total_payout_inr: 1725.0,
    status: 'DISBURSED',
    bank_reference: 'KGB-UPI-9941381',
    is_simulated: true,
  },
  {
    tx_hash: '7e44ca01994bbf384112e803',
    timestamp: '2026-11-21T14:15:00Z',
    crew_id: 'crew-3',
    crew_name: 'ഷീല & രാധ (Kudumbashree Unit 3)',
    patch_id: 'patch-3',
    yard_id: 'yard-nedumudi',
    weight_kg: 310.0,
    rate_inr_per_kg: 3.50,
    base_payout_inr: 1085.0,
    bonus_inr: 500.0,
    total_payout_inr: 1585.0,
    status: 'DISBURSED',
    bank_reference: 'KGB-UPI-9941590',
    is_simulated: true,
  },
];

const INITIAL_PATCHES: PatchCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'patch-1',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.350, 9.505],
            [76.354, 9.506],
            [76.353, 9.509],
            [76.349, 9.508],
            [76.350, 9.505],
          ],
        ],
      },
      properties: {
        feature_type: 'PATCH',
        patch_id: 'patch-1',
        name: 'പുന്നമട ബോട്ട് ജെട്ടി ചാനൽ (Punnamada Jetties Choke)',
        area_sqm: 4200,
        biomass_est_kg: 10500,
        choke_score: 0.88,
        growth_trend: 'EXPANDING',
        nearest_jetty: 'Punnamada Finishing Jetty (45m)',
        detected_at: '2026-11-20T08:45:00Z',
        is_simulated: false,
      },
    },
    {
      type: 'Feature',
      id: 'patch-2',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.381, 9.495],
            [76.386, 9.497],
            [76.385, 9.501],
            [76.380, 9.499],
            [76.381, 9.495],
          ],
        ],
      },
      properties: {
        feature_type: 'PATCH',
        patch_id: 'patch-2',
        name: 'കൈനകരി വടക്ക് പാടശേഖരം (Kainakary North Padasekharam)',
        area_sqm: 3500,
        biomass_est_kg: 8750,
        choke_score: 0.74,
        growth_trend: 'EXPANDING',
        nearest_jetty: 'Kainakary Jetty (80m)',
        detected_at: '2026-11-20T08:45:00Z',
        is_simulated: false,
      },
    },
    {
      type: 'Feature',
      id: 'boat-1',
      geometry: {
        type: 'Point',
        coordinates: [76.352, 9.507],
      },
      properties: {
        feature_type: 'BOAT',
        crew_id: 'crew-1',
        crew_name: 'വള്ളം 1 (ലീല & സതി)',
        boat_type: 'Wooden Country Boat',
        capacity_kg: 600,
      },
    },
  ],
  metadata: {
    total_patches: 6,
    total_biomass_kg: 34910,
    source: 'Sentinel-1 GRD SAR',
    is_simulated: false,
  },
};

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'app' | 'kit'>(() => {
    return window.location.hash.includes('kit') || window.location.pathname.includes('/kit')
      ? 'kit'
      : 'app';
  });

  const [activeTab, setActiveTab] = useState<MainTab>(() => {
    const h = window.location.hash.toLowerCase();
    if (h.includes('map')) return 'map';
    if (h.includes('speak')) return 'speak';
    if (h.includes('wages') || h.includes('ledger')) return 'wages';
    if (h.includes('dash')) return 'dashboard';
    return 'today';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.location.search.includes('dark') || window.location.hash.includes('dark');
  });
  const [showStory, setShowStory] = useState<boolean>(() => {
    return window.location.hash.includes('story');
  });
  const [selectedCrewId, setSelectedCrewId] = useState<string>('crew-1');

  const [patches, setPatches] = useState<PatchCollection | null>(INITIAL_PATCHES);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(INITIAL_TRANSACTIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [verifyingPatch, setVerifyingPatch] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('kit')) {
        setViewMode('kit');
      } else {
        setViewMode('app');
        if (h.includes('story')) setShowStory(true);
        if (h.includes('map')) setActiveTab('map');
        if (h.includes('speak')) setActiveTab('speak');
        if (h.includes('wages') || h.includes('ledger')) setActiveTab('wages');
        if (h.includes('dash')) setActiveTab('dashboard');
        if (h.includes('today')) setActiveTab('today');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const fetchPatches = async () => {
    try {
      const res = await fetch('/api/v1/geo/patches');
      if (res.ok) setPatches(await res.json());
    } catch (e) {
      console.error('Failed to load patches', e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/v1/ledger/transactions');
      if (res.ok) setTransactions(await res.json());
    } catch (e) {
      console.error('Failed to load transactions', e);
    }
  };

  useEffect(() => {
    fetchPatches();
    fetchTransactions();
  }, []);

  const handleInteractionComplete = (res: VoiceInteractionResponse) => {
    fetchPatches();
    fetchTransactions();
    setToastMessage(`മലയാളം റെക്കോർഡിംഗ് രേഖപ്പെടുത്തി: "${res.dispatcher_response_malayalam.slice(0, 45)}..."`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  // If viewing standalone component kit
  if (viewMode === 'kit') {
    return (
      <div className="relative">
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={() => {
              window.location.hash = '';
              setViewMode('app');
            }}
            className="px-3 py-1.5 bg-[var(--ink)] text-[var(--paper)] border-2 border-[var(--ink)] rounded-xl text-xs font-display font-bold shadow-lg hover:opacity-90 transition tap-target-48"
          >
            ← Back to Payal App
          </button>
        </div>
        <KitPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col transition-colors selection:bg-[var(--laterite)]/20 selection:text-[var(--laterite)]">
      {/* 1. Authentic Kasavu Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenStory={() => setShowStory(true)}
        onOpenKit={() => {
          window.location.hash = 'kit';
          setViewMode('kit');
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-[var(--paper-2)] border-2 border-[var(--backwater)] text-[var(--ink)] text-xs font-display font-bold p-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[var(--sun)] shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-12">
        {/* Judge Story Modal / Inline Overlay */}
        {showStory && (
          <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto p-4 flex items-center justify-center">
            <LandingStory
              onStartDemo={() => setShowStory(false)}
              onClose={() => setShowStory(false)}
            />
          </div>
        )}

        {/* View Switching */}
        {activeTab === 'today' && (
          <TodayView
            selectedCrewId={selectedCrewId}
            onSelectCrewId={setSelectedCrewId}
            onOpenSpeakTab={() => setActiveTab('speak')}
            onOpenMapTab={() => setActiveTab('map')}
            onVerifyPhoto={(id, name) => setVerifyingPatch({ id, name })}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <MapView
              patches={patches}
              selectedCrewId={selectedCrewId}
              onVerifyPhoto={(id, name) => setVerifyingPatch({ id, name })}
            />
          </div>
        )}

        {activeTab === 'speak' && (
          <SpeakView
            selectedCrewId={selectedCrewId}
            onInteractionComplete={handleInteractionComplete}
          />
        )}

        {activeTab === 'wages' && <WagesView transactions={transactions} />}

        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      {/* 3. Mobile Thumb-Zone TabBar (< 768px) */}
      <div className="md:hidden">
        <TabBar
          activeTab={activeTab === 'dashboard' ? 'today' : (activeTab as TabId)}
          onChangeTab={(t) => setActiveTab(t as MainTab)}
        />
      </div>

      {/* 4. Photo Verification Modal */}
      {verifyingPatch && (
        <PhotoVerificationModal
          patchId={verifyingPatch.id}
          patchName={verifyingPatch.name}
          crewId={selectedCrewId}
          onVerified={() => {
            fetchPatches();
            fetchTransactions();
            setToastMessage('ഫീൽഡ് ഫോട്ടോ സ്ഥിരീകരിച്ചു! ബാങ്ക് കൂലി ലെഡ്ജറിൽ എത്തി.');
            setTimeout(() => setToastMessage(null), 5000);
          }}
          onClose={() => setVerifyingPatch(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--ink)]/20 py-4 px-6 text-center text-xs font-ui text-[var(--ink-soft)] hidden md:block">
        പായൽ ടു പേ (Payal-to-Pay) · The Houseboat Hackathon, Alappuzha · Place & People / Voice & Language Track
      </footer>
    </div>
  );
};

export default App;
