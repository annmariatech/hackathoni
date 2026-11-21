import React, { useState, useEffect } from 'react';
import { KasavuBorder } from '../components/primitives/KasavuBorder';
import { RippleLine } from '../components/primitives/RoughSvg';
import {
  IconMicLamp,
  IconBoat,
  IconPatch,
  IconSatellite,
  IconRain,
  IconDryingYard,
  IconLedger,
  IconCoin,
  IconCamera,
  IconCheckStamp,
} from '../components/primitives/HandIcons';
import { PaperCard } from '../components/primitives/PaperCard';
import { InkButton } from '../components/primitives/InkButton';
import { Chip } from '../components/primitives/Chip';
import { Stamp } from '../components/primitives/Stamp';
import { TabBar, TabId } from '../components/primitives/TabBar';
import { BottomSheet } from '../components/primitives/BottomSheet';
import { LedgerRow } from '../components/primitives/LedgerRow';
import { SketchChart } from '../components/primitives/SketchChart';
import { LampMic } from '../components/primitives/LampMic';
import { BoatProgress } from '../components/primitives/BoatProgress';
import { BeforeAfterSlider } from '../components/primitives/BeforeAfterSlider';
import { Sun, Moon } from 'lucide-react';

export const KitPage: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.location.search.includes('dark') || window.location.hash.includes('dark');
  });
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [micListening, setMicListening] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0.6);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-250 ${isDark ? 'dark bg-[#17221D]' : 'bg-[var(--paper)]'}`}>
      {/* 390px Mobile Viewport Container */}
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-[var(--paper)] text-[var(--ink)] border-x-0 pb-28 relative">
        {/* Top App Header with Kasavu Border & Mode Toggle */}
        <div className="bg-[var(--paper)] sticky top-0 z-30 border-b border-[var(--ink)]/40">
          <KasavuBorder />
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div>
              <span className="font-display font-black text-sm text-[var(--ink)]">
                പായൽ ടു പേ
              </span>
              <span className="text-[10px] text-[var(--ink-soft)] font-ui block">
                Fieldwork Component Kit (/kit)
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-lg border border-[var(--ink)] bg-[var(--paper-2)] text-xs font-display flex items-center gap-1.5 tap-target-48"
              aria-label="Toggle Night Lamp Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[var(--sun)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
              <span>{isDark ? 'Day' : 'Night'}</span>
            </button>
          </div>
        </div>

        {/* Component Showcase Body */}
        <div className="p-4 space-y-6">
          {/* Section 1: Color Tokens */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              1. Color Tokens (വർണ്ണങ്ങൾ)
            </h3>
            <RippleLine />
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-display font-bold">
              <div className="p-2 rounded border border-[var(--ink)] bg-[#F6EEDC] text-[#1E2B24]">
                Paper<br />#F6EEDC
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#1E2B24] text-[#F6EEDC]">
                Ink<br />#1E2B24
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#B4532F] text-white">
                Laterite<br />#B4532F
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#1F6B57] text-white">
                Backwater<br />#1F6B57
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#8A6FD1] text-white">
                Hyacinth<br />#8A6FD1
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#6B9A3C] text-white">
                Leaf<br />#6B9A3C
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#F2B632] text-black">
                Sun<br />#F2B632
              </div>
              <div className="p-2 rounded border border-[var(--ink)] bg-[#C9972F] text-black">
                Kasavu<br />#C9972F
              </div>
            </div>
          </section>

          {/* Section 2: Typography & Conjuncts */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              2. Typography (ലിപി & കൂട്ടക്ഷരങ്ങൾ)
            </h3>
            <div className="p-3 bg-[var(--paper-2)] border border-[var(--ink)]/40 rounded-xl space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-4xl font-extrabold text-[var(--laterite)]">
                  350 kg
                </span>
                <span className="font-display text-3xl font-extrabold text-[var(--backwater)]">
                  ₹1,725
                </span>
              </div>
              <p className="font-display text-sm font-bold text-[var(--ink)]">
                ചിലങ്ക ഡിസ്പ്ലേ: കൈനകരി വടക്ക് പാടശേഖരം
              </p>
              <p className="font-ui text-xs text-[var(--ink-soft)] leading-relaxed">
                മഞ്ചേരി കൂട്ടക്ഷര പരീക്ഷണം: സ്ത്രീകൾ, പ്രകൃതി, പ്രത്യേകത, വർദ്ധനവ്, ലക്ഷ്യം, നെടുമുടി.
              </p>
            </div>
          </section>

          {/* Section 3: 10 Custom Hand-Drawn Icons */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              3. Hand-Drawn Icons (വരച്ച ചിഹ്നങ്ങൾ)
            </h3>
            <div className="grid grid-cols-5 gap-2 p-3 bg-[var(--paper-2)] border border-[var(--ink)]/40 rounded-xl text-center">
              <div className="flex flex-col items-center">
                <IconMicLamp />
                <span className="text-[9px] mt-1 font-display">വിളക്ക്</span>
              </div>
              <div className="flex flex-col items-center">
                <IconBoat />
                <span className="text-[9px] mt-1 font-display">വള്ളം</span>
              </div>
              <div className="flex flex-col items-center">
                <IconPatch />
                <span className="text-[9px] mt-1 font-display">പായൽ</span>
              </div>
              <div className="flex flex-col items-center">
                <IconSatellite />
                <span className="text-[9px] mt-1 font-display">റഡാർ</span>
              </div>
              <div className="flex flex-col items-center">
                <IconRain />
                <span className="text-[9px] mt-1 font-display">മഴ</span>
              </div>
              <div className="flex flex-col items-center">
                <IconDryingYard />
                <span className="text-[9px] mt-1 font-display">യാർഡ്</span>
              </div>
              <div className="flex flex-col items-center">
                <IconLedger />
                <span className="text-[9px] mt-1 font-display">രജിസ്റ്റർ</span>
              </div>
              <div className="flex flex-col items-center">
                <IconCoin />
                <span className="text-[9px] mt-1 font-display">കൂലി</span>
              </div>
              <div className="flex flex-col items-center">
                <IconCamera />
                <span className="text-[9px] mt-1 font-display">ക്യാമറ</span>
              </div>
              <div className="flex flex-col items-center">
                <IconCheckStamp />
                <span className="text-[9px] mt-1 font-display">മുദ്ര</span>
              </div>
            </div>
          </section>

          {/* Section 4: PaperCard & Kasavu Border */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              4. PaperCard & Kasavu Trim
            </h3>
            <PaperCard hasKasavu={true}>
              <h4 className="font-display font-bold text-base text-[var(--ink)]">
                പുന്നമട കനാൽ ശേഖരണം
              </h4>
              <p className="font-ui text-xs text-[var(--ink-soft)] mt-1">
                നെഹ്റു ട്രോഫി ഫിനിഷിംഗ് പോയിന്റിലെ പായൽ തടസ്സം നീക്കം ചെയ്യുന്നതിനുള്ള മുന്നറിയിപ്പ്.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <Stamp type="verified" size="sm" />
                <span className="font-mono text-xs font-bold text-[var(--laterite)]">4,200 m²</span>
              </div>
            </PaperCard>
          </section>

          {/* Section 5: InkButtons (>=48px tap targets) */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              5. InkButtons (48px+ Tap Targets)
            </h3>
            <div className="space-y-2">
              <InkButton variant="primary" fullWidth onClick={() => setIsSheetOpen(true)}>
                <span>തുടങ്ങുക · Open Bottom Sheet</span>
              </InkButton>
              <div className="grid grid-cols-2 gap-2">
                <InkButton variant="secondary">
                  <span>രേഖപ്പെടുത്തുക</span>
                </InkButton>
                <InkButton variant="backwater">
                  <span>യാർഡ് സ്ലോട്ട്</span>
                </InkButton>
              </div>
            </div>
          </section>

          {/* Section 6: Status Stamps (Data Honesty) */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              6. Status Stamps (മുദ്രകൾ)
            </h3>
            <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/40 flex flex-wrap items-center gap-3">
              <Stamp type="verified" />
              <Stamp type="pending" />
              <Stamp type="simulated" />
            </div>
          </section>

          {/* Section 7: Chips */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              7. Filter Chips
            </h3>
            <div className="flex flex-wrap gap-2">
              <Chip label="എല്ലാം All" count={6} active={true} variant="ink" />
              <Chip label="കൈനകരി" count={3} variant="leaf" />
              <Chip label="പുന്നമട" count={2} variant="laterite" />
              <Chip label="നെടുമുടി" count={1} variant="water" />
            </div>
          </section>

          {/* Section 8: Nilavilakku LampMic */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              8. Nilavilakku LampMic (വിളക്ക് മൈക്ക്)
            </h3>
            <div className="p-4 bg-[var(--paper-2)] border border-[var(--ink)]/40 rounded-xl flex flex-col items-center">
              <LampMic
                isListening={micListening}
                audioLevel={micVolume}
                onToggleRecord={() => setMicListening(!micListening)}
              />
              <div className="mt-3 text-center">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={micVolume}
                  onChange={(e) => setMicVolume(parseFloat(e.target.value))}
                  className="w-36 accent-[var(--laterite)]"
                />
                <span className="block text-[10px] text-[var(--ink-soft)] font-ui">
                  ശബ്ദ തോത് (Audio Pulse Simulation)
                </span>
              </div>
            </div>
          </section>

          {/* Section 9: BoatProgress (Vallam on Ripple) */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              9. BoatProgress (വള്ളം പുരോഗതി)
            </h3>
            <BoatProgress
              progressPct={65}
              crewName="ലീല & സതി (വള്ളം 1)"
              sourceName="പുന്നമട"
              destinationName="കൈനകരി യാർഡ്"
            />
          </section>

          {/* Section 10: Ruled Ledger Rows */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              10. Ruled Ledger Rows (കൂലി രജിസ്റ്റർ)
            </h3>
            <div className="bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl overflow-hidden shadow-[2px_3px_0px_var(--ink)]">
              <LedgerRow
                id="tx_99812763"
                harvesterName="ലീല & സതി"
                boatName="വള്ളം 1"
                weightKg={420}
                totalPayout={1970}
                dateStr="21 നവംബർ, 10:30 AM"
                status="verified"
              />
              <LedgerRow
                id="tx_99812764"
                harvesterName="അനിത & മിനി"
                boatName="വള്ളം 2"
                weightKg={350}
                totalPayout={1725}
                dateStr="21 നവംബർ, 11:45 AM"
                status="simulated"
              />
            </div>
          </section>

          {/* Section 11: Hand-Drawn SketchChart */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              11. SketchChart (OR-Tools vs Baseline)
            </h3>
            <SketchChart
              title="റൂട്ട് ദൂര ലാഭം (Route Distance Saved)"
              subtitle="OR-Tools വഴി കനാൽ ദൂരം ലാഭിച്ച കണക്ക്"
              series={[
                {
                  label: 'ആകെ ദൂരം (Total Distance)',
                  optimizerValue: 25.6,
                  baselineValue: 41.5,
                  unit: 'km',
                  deltaText: '38.3% ലാഭം',
                },
                {
                  label: 'ചാനൽ തടസ്സം റിലീഫ് (Choke Relief)',
                  optimizerValue: 4.88,
                  baselineValue: 3.42,
                  unit: 'pts',
                  deltaText: '+42.7% മുൻഗണന',
                },
              ]}
            />
          </section>

          {/* Section 12: Before/After Slider */}
          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--ink)] border-b border-[var(--ink)]/20 pb-1">
              12. Before/After Harvest Slider
            </h3>
            <BeforeAfterSlider />
          </section>
        </div>

        {/* Bottom Navigation TabBar (Sticky Thumb Zone) */}
        <TabBar activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Demo BottomSheet */}
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="കൈനകരി യാർഡ് സ്ലോട്ട് (Yard Slot Details)"
          subtitle="തത്സമയ ഡ്രൈയിംഗ് ശേഷിയും കാലാവസ്ഥാ മുന്നറിയിപ്പും"
        >
          <div className="space-y-3 font-ui text-xs">
            <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/40 flex justify-between">
              <span>ലഭ്യമായ സ്ഥലം (Available Area):</span>
              <b className="font-mono text-sm text-[var(--backwater)]">850 m²</b>
            </div>
            <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/40 flex justify-between">
              <span>മഴ സാധ്യത (Precipitation):</span>
              <b className="font-mono text-sm text-[var(--laterite)]">0.2 mm (സുരക്ഷിതം)</b>
            </div>
            <InkButton variant="primary" fullWidth onClick={() => setIsSheetOpen(false)}>
              <span>സ്ലോട്ട് സ്ഥിരീകരിക്കുക (Confirm Slot)</span>
            </InkButton>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
};
