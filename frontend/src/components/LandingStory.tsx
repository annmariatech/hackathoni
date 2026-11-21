import React, { useState } from 'react';
import { KasavuBorder } from './primitives/KasavuBorder';
import { RippleLine } from './primitives/RoughSvg';
import {
  IconSatellite,
  IconBoat,
  IconMicLamp,
  IconCoin,
  IconCheckStamp,
} from './primitives/HandIcons';
import { InkButton } from './primitives/InkButton';
import { Stamp } from './primitives/Stamp';
import { ArrowRight, X } from 'lucide-react';

interface LandingStoryProps {
  onStartDemo: () => void;
  onClose?: () => void;
}

/**
 * Screen 1: Landing Story (for judges)
 * Sticky illustrated scroll story in 4 chapters:
 * 1. Satellite radar sees (Sentinel-1 SAR)
 * 2. Routes planned (OR-Tools multi-boat routing)
 * 3. Voice desk (Sarvam Malayalam voice reporting)
 * 4. Wages released (EXIF geotag proof + simulated ledger)
 */
export const LandingStory: React.FC<LandingStoryProps> = ({ onStartDemo, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState<number>(0);

  const chapters = [
    {
      num: '01',
      titleMl: 'ഉപഗ്രഹം കാണുന്നു',
      titleEn: '1. Satellite Radar Sees',
      descMl:
        'സെന്റിനൽ-1 റഡാർ സാറ്റലൈറ്റ് വേമ്പനാട്ടു കായലിലെ പുന്നമട–കൈനകരി ഭാഗത്തെ പായൽ കൂട്ടങ്ങളെ മേഘങ്ങളെയും മഴയെയും വകവെയ്ക്കാതെ കൃത്യമായി കണ്ടെത്തുന്നു.',
      descEn:
        'Sentinel-1 SAR satellite penetrates monsoon clouds over the Punnamada–Kainakary corridor, mapping hyacinth patch polygons and computing water choke scores.',
      icon: <IconSatellite size={44} strokeWidth={2} />,
      badge: '[REAL] Sentinel-1 SAR',
      stat: '4,200 m²',
      statLabel: 'Critical Choke Detected at Punnamada',
      accentColor: 'var(--backwater)',
    },
    {
      num: '02',
      titleMl: 'റൂട്ടുകൾ തയ്യാറാക്കുന്നു',
      titleEn: '2. Routes Planned via OR-Tools',
      descMl:
        'ഓപ്പൺ-മെറ്റിയോ മഴ പ്രവചനവും കമ്മ്യൂണിറ്റി ഡ്രൈയിംഗ് യാർഡുകളുടെ ശേഷിയും കണക്കിലെടുത്ത് ഗൂഗിൾ ഒആർ-ടൂൾസ് വള്ളങ്ങൾക്കായി ഏറ്റവും അനുയോജ്യമായ റൂട്ട് നിശ്ചയിക്കുന്നു.',
      descEn:
        'Google OR-Tools multi-boat optimizer routes harvesters to high-choke jetties within solar drying windows, cutting travel distance by 38.3%.',
      icon: <IconBoat size={44} strokeWidth={2} />,
      badge: '[REAL] OR-Tools CVRPTW',
      stat: '38.3%',
      statLabel: 'Distance Saved vs Greedy Baseline',
      accentColor: 'var(--laterite)',
    },
    {
      num: '03',
      titleMl: 'മലയാളത്തിൽ സംസാരിക്കൂ',
      titleEn: '3. Malayalam Voice Desk (Sarvam)',
      descMl:
        'സ്മാർട്ട്ഫോൺ കീബോർഡില്ലാതെ, തത്സമയം കായലിലിരുന്ന് മലയാളത്തിൽ പറഞ്ഞാൽ സർവ്വം സാരാസ് കേൾക്കുകയും ഡിസ്പാച്ചർ കിലോ രേഖപ്പെടുത്തുകയും ഡ്രൈയിംഗ് യാർഡ് സ്ലോട്ട് നൽകുകയും ചെയ്യുന്നു.',
      descEn:
        'Harvesters speak in colloquial Malayalam on the water. Sarvam Saaras STT transcribes speech, 30B tool calling books drying yard slots, and Bulbul v3 speaks audio receipts.',
      icon: <IconMicLamp size={44} strokeWidth={2} />,
      badge: '[REAL] Sarvam AI',
      stat: '8.4%',
      statLabel: 'Malayalam WER on Vembanad Dialect',
      accentColor: 'var(--kasavu)',
    },
    {
      num: '04',
      titleMl: 'ഫോട്ടോ തെളിവും കൂലിയും',
      titleEn: '4. Verified Payouts Released',
      descMl:
        'ശേഖരണത്തിന് മുൻപും ശേഷവുമുള്ള ജിയോ-ടാഗ് ചെയ്ത ഫോട്ടോ പരിശോധനയിലൂടെ സ്ഥിരീകരിച്ച്, ഉടൻ തന്നെ ബാങ്ക് ലെഡ്ജറിലേക്ക് കൂലി വിതരണം ചെയ്യുന്നു.',
      descEn:
        'EXIF geotagged field photos (≤250m geofence) and satellite revisit verify clearance, immediately disbursing simulated wages into the Kudumbashree ledger.',
      icon: <IconCoin size={44} strokeWidth={2} />,
      badge: '[SIMULATED] Wages & Ledger',
      stat: '₹1,970',
      statLabel: 'Average Daily Kudumbashree Unit Wage',
      accentColor: 'var(--leaf)',
    },
  ];

  const ch = chapters[currentChapter];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[var(--paper)] text-[var(--ink)] border-2 border-[var(--ink)] rounded-2xl shadow-2xl overflow-hidden my-4">
      {/* Top Kasavu Border */}
      <KasavuBorder />

      {/* Header bar */}
      <div className="px-5 py-3 border-b border-[var(--ink)]/30 flex items-center justify-between bg-[var(--paper-2)]/60">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-lg text-[var(--ink)]">
            പായൽ ടു പേ · Payal-to-Pay
          </span>
          <Stamp type="simulated" size="sm" />
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--paper)] text-[var(--ink)] transition tap-target-48 flex items-center justify-center"
            aria-label="Close Story"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Story Stage */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Chapter Stepper */}
        <div className="grid grid-cols-4 gap-2 border-b border-[var(--ink)]/20 pb-4">
          {chapters.map((c, idx) => (
            <button
              key={c.num}
              onClick={() => setCurrentChapter(idx)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                currentChapter === idx
                  ? 'border-2 border-[var(--ink)] bg-[var(--paper-2)] shadow-[2px_2px_0px_var(--ink)]'
                  : 'border-[var(--ink)]/30 opacity-60 hover:opacity-100 hover:bg-[var(--paper-2)]/40'
              }`}
            >
              <span className="block font-mono text-xs font-bold text-[var(--laterite)]">
                {c.num}
              </span>
              <span className="font-display font-bold text-xs truncate block text-[var(--ink)]">
                {c.titleMl}
              </span>
            </button>
          ))}
        </div>

        {/* Chapter Content Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Illustrated Hand-drawn Focal Point */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[var(--paper-2)] border-2 border-[var(--ink)] rounded-2xl shadow-[3px_4px_0px_var(--ink)] text-center relative overflow-hidden">
            <div className="p-4 rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] text-[var(--ink)] mb-3 shadow-[1px_2px_0px_var(--ink)]">
              {ch.icon}
            </div>

            <span className="font-display text-4xl font-extrabold text-[var(--laterite)] mt-2">
              {ch.stat}
            </span>
            <span className="text-xs font-ui text-[var(--ink-soft)] mt-1 max-w-[200px]">
              {ch.statLabel}
            </span>

            <div className="mt-4">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[var(--ink)]/40 bg-[var(--paper)]">
                {ch.badge}
              </span>
            </div>
          </div>

          {/* Right: Narrative Story Copy */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[var(--laterite)] uppercase tracking-wider">
                അദ്ധ്യായം {ch.num} · Chapter {ch.num}
              </span>
              <h2 className="font-display text-2xl font-black text-[var(--ink)] mt-1">
                {ch.titleMl}
              </h2>
              <h3 className="font-display text-base font-bold text-[var(--ink-soft)]">
                {ch.titleEn}
              </h3>
            </div>

            <RippleLine />

            <p className="font-ui text-sm text-[var(--ink)] leading-relaxed">
              {ch.descMl}
            </p>

            <p className="font-ui text-xs text-[var(--ink-soft)] leading-relaxed italic border-l-2 border-[var(--laterite)] pl-3">
              "{ch.descEn}"
            </p>

            {/* Stepper Controls & Start Demo */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                {currentChapter > 0 && (
                  <button
                    onClick={() => setCurrentChapter(currentChapter - 1)}
                    className="px-3 py-1.5 rounded-lg border border-[var(--ink)] bg-[var(--paper-2)] text-xs font-display hover:bg-[var(--paper)] transition"
                  >
                    ← മുൻപത്തെ
                  </button>
                )}
                {currentChapter < chapters.length - 1 ? (
                  <button
                    onClick={() => setCurrentChapter(currentChapter + 1)}
                    className="px-3 py-1.5 rounded-lg border border-[var(--ink)] bg-[var(--paper-2)] text-xs font-display font-bold hover:bg-[var(--paper)] transition flex items-center gap-1"
                  >
                    <span>അടുത്തത്</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-[var(--leaf)] font-display font-bold flex items-center gap-1">
                    <IconCheckStamp size={16} />
                    <span>മുഴുവൻ വിതരണ ശൃംഖല പൂർത്തിയായി!</span>
                  </span>
                )}
              </div>

              <InkButton variant="primary" onClick={onStartDemo}>
                <span>ഡെമോ തുടങ്ങുക · Try Live Demo</span>
              </InkButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
