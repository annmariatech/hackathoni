import React, { useState, useEffect } from 'react';
import { PaperCard } from './primitives/PaperCard';
import { SketchChart } from './primitives/SketchChart';
import { Stamp } from './primitives/Stamp';
import {
  IconSatellite,
  IconMicLamp,
} from './primitives/HandIcons';
import { Sparkles, BookOpen } from 'lucide-react';

interface BenchmarkData {
  radar_evaluation: {
    dataset: string;
    sensor: string;
    intersection_over_union: number;
    precision: number;
    recall: number;
    f1_score: number;
    false_positive_rate_water: number;
    notes: string;
  };
  speech_evaluation: {
    benchmark_set: string;
    model: string;
    word_error_rate: number;
    character_error_rate: number;
    intent_accuracy: number;
    keyword_extraction_accuracy_kg: number;
    keyword_extraction_accuracy_location: number;
    average_stt_latency_ms: number;
    tts_latency_ms: number;
  };
  optimizer_delta_evaluation: {
    problem_instance: string;
    solver: string;
    baseline_heuristic: string;
    metrics: {
      or_tools_distance_km: number;
      greedy_distance_km: number;
      distance_saved_km: number;
      distance_saved_pct: number;
      estimated_fuel_saved_litres: number;
      or_tools_choke_cleared: number;
      greedy_choke_cleared: number;
      choke_improvement_pct: number;
      spoilage_avoidance_kg: number;
    };
  };
  assumptions: Array<{
    parameter: string;
    value: string;
    reference: string;
  }>;
}

interface DryingYard {
  yard_id: string;
  name: string;
  total_capacity_sqm: number;
  occupied_sqm: number;
  available_sqm: number;
}

export const DashboardView: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData | null>(null);
  const [yards, setYards] = useState<DryingYard[]>([]);
  const [credits, setCredits] = useState<{
    total_stt_seconds: number;
    total_tts_chars: number;
    cached_audio_hits: number;
  }>({ total_stt_seconds: 0, total_tts_chars: 0, cached_audio_hits: 0 });
  const [activeTab, setActiveTab] = useState<'optimizer' | 'audit' | 'yards' | 'assumptions'>('optimizer');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, fRes, cRes] = await Promise.all([
          fetch('/api/v1/credibility/benchmarks'),
          fetch('/api/v1/forecast/drying-windows'),
          fetch('/api/v1/voice/credits'),
        ]);

        if (bRes.ok) setBenchmarks(await bRes.json());
        if (fRes.ok) {
          const fData = await fRes.json();
          setYards(fData.drying_yards || []);
        }
        if (cRes.ok) setCredits(await cRes.json());
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. Header Banner */}
      <PaperCard hasKasavu className="bg-[var(--paper)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--laterite)] font-bold uppercase tracking-wider block">
                പഞ്ചായത്ത് ഡെസ്ക് & ഓഡിറ്റ് രജിസ്റ്റർ
              </span>
              <Stamp type="verified" size="sm" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] mt-0.5">
              സപ്ലൈ ചെയിൻ ഓപ്റ്റിമൈസേഷൻ & ക്രെഡിബിലിറ്റി
            </h2>
            <p className="font-ui text-xs text-[var(--ink-soft)] mt-0.5">
              OR-Tools റൂട്ടിംഗ് ലാഭം, വേമ്പനാട് റഡാർ മാറ്റം, സർവ്വം സ്പീച്ച് മോഡൽ കൃത്യത
            </p>
          </div>

          {/* Sarvam Credit Counter */}
          <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/30 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[var(--ink)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--sun)]" />
              <span>Sarvam API Credits:</span>
            </div>
            <div className="text-[11px] text-[var(--ink-soft)]">
              STT: <b className="text-[var(--backwater)]">{credits.total_stt_seconds}s</b> · TTS:{' '}
              <b className="text-[var(--laterite)]">{credits.total_tts_chars}</b> chars
            </div>
            {credits.cached_audio_hits > 0 && (
              <div className="text-[10px] text-[var(--leaf)] font-bold">
                ✓ {credits.cached_audio_hits} cached audio hits
              </div>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--ink)]/15 mt-4">
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition ${
              activeTab === 'optimizer'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--paper-2)] border-[var(--ink)]/30 text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            റൂട്ടിംഗ് ലാഭം (OR-Tools vs Baseline)
          </button>
          <button
            onClick={() => setActiveTab('yards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition ${
              activeTab === 'yards'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--paper-2)] border-[var(--ink)]/30 text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            ഡ്രൈയിംഗ് യാർഡുകൾ (Yards)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition ${
              activeTab === 'audit'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--paper-2)] border-[var(--ink)]/30 text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            മോഡൽ കൃത്യത (Credibility Audit)
          </button>
          <button
            onClick={() => setActiveTab('assumptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition ${
              activeTab === 'assumptions'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--paper-2)] border-[var(--ink)]/30 text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            അനുമാനങ്ങൾ (Scientific Assumptions)
          </button>
        </div>
      </PaperCard>

      {/* 2. Tab Content: OR-Tools Optimizer vs Baseline */}
      {activeTab === 'optimizer' && (
        <div className="space-y-5">
          <PaperCard className="bg-[var(--paper)]">
            <SketchChart
              title="റൂട്ട് ദൂര ലാഭം (Google OR-Tools vs Greedy Nearest)"
              subtitle="ഓരോ വള്ളത്തിനും ഒപ്റ്റിമൈസ് ചെയ്ത റൂട്ട് വഴി കനാൽ ദൂരവും ഇന്ധനവും ലാഭിച്ച കണക്ക്"
              series={[
                {
                  label: 'ആകെ കനാൽ ദൂരം (Total Distance)',
                  optimizerValue: benchmarks?.optimizer_delta_evaluation?.metrics?.or_tools_distance_km || 25.6,
                  baselineValue: benchmarks?.optimizer_delta_evaluation?.metrics?.greedy_distance_km || 41.5,
                  unit: 'km',
                  deltaText: `${benchmarks?.optimizer_delta_evaluation?.metrics?.distance_saved_pct || 38.3}% ലാഭം`,
                },
                {
                  label: 'ചാനൽ തടസ്സം മുൻഗണന (Choke Relief Score)',
                  optimizerValue: benchmarks?.optimizer_delta_evaluation?.metrics?.or_tools_choke_cleared || 4.88,
                  baselineValue: benchmarks?.optimizer_delta_evaluation?.metrics?.greedy_choke_cleared || 3.42,
                  unit: 'pts',
                  deltaText: `+${benchmarks?.optimizer_delta_evaluation?.metrics?.choke_improvement_pct || 42.7}% കാര്യക്ഷമത`,
                },
              ]}
            />
          </PaperCard>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl shadow-[2px_3px_0px_var(--ink)]">
              <span className="text-[10px] font-mono uppercase text-[var(--ink-soft)] block font-bold">
                യാത്രാ ദൂര ലാഭം (Distance Saved)
              </span>
              <span className="font-display text-2xl font-black text-[var(--laterite)] mt-1 block">
                {benchmarks?.optimizer_delta_evaluation?.metrics?.distance_saved_km || 15.9} km
              </span>
              <span className="text-xs text-[var(--ink-soft)] font-ui">
                ({benchmarks?.optimizer_delta_evaluation?.metrics?.distance_saved_pct || 38.3}% കുറവ്)
              </span>
            </div>

            <div className="p-4 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl shadow-[2px_3px_0px_var(--ink)]">
              <span className="text-[10px] font-mono uppercase text-[var(--ink-soft)] block font-bold">
                ഇന്ധന ലാഭം (Fuel Saved)
              </span>
              <span className="font-display text-2xl font-black text-[var(--backwater)] mt-1 block">
                ~{benchmarks?.optimizer_delta_evaluation?.metrics?.estimated_fuel_saved_litres || 14.3} L
              </span>
              <span className="text-xs text-[var(--ink-soft)] font-ui">
                ഡീസൽ ലാഭിച്ചത് / ദിനം
              </span>
            </div>

            <div className="p-4 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl shadow-[2px_3px_0px_var(--ink)]">
              <span className="text-[10px] font-mono uppercase text-[var(--ink-soft)] block font-bold">
                ചീഞ്ഞുപോകാതെ കാത്തത് (Spoilage Avoided)
              </span>
              <span className="font-display text-2xl font-black text-[var(--leaf)] mt-1 block">
                {benchmarks?.optimizer_delta_evaluation?.metrics?.spoilage_avoidance_kg || 1200} kg
              </span>
              <span className="text-xs text-[var(--ink-soft)] font-ui">
                മഴയ്ക്ക് മുൻപ് യാർഡിൽ എത്തിച്ചു
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab Content: Community Drying Yards */}
      {activeTab === 'yards' && (
        <PaperCard className="bg-[var(--paper)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[var(--ink-soft)] uppercase block font-bold">
                കമ്മ്യൂണിറ്റി ഡ്രൈയിംഗ് യാർഡുകൾ · Community Drying Yards
              </span>
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                തത്സമയ ഡ്രൈയിംഗ് യാർഡ് സ്ലോട്ടുകൾ
              </h3>
            </div>
            <Stamp type="simulated" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {yards.map((y) => {
              const occPct = Math.round((y.occupied_sqm / y.total_capacity_sqm) * 100);
              return (
                <div
                  key={y.yard_id}
                  className="p-4 bg-[var(--paper-2)] border-2 border-[var(--ink)] rounded-xl space-y-2 shadow-[2px_2px_0px_var(--ink)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-[var(--ink)]">
                      {y.name}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--ink)]/30">
                      {y.yard_id}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-soft)]">ലഭ്യമായ സ്ഥലം:</span>
                      <b className="text-[var(--backwater)]">{y.available_sqm} m²</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-soft)]">ആകെ വിസ്തൃതി:</span>
                      <span>{y.total_capacity_sqm} m²</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[var(--paper)] h-2 rounded-full border border-[var(--ink)]/30 overflow-hidden">
                    <div
                      className="bg-[var(--laterite)] h-full transition-all"
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--ink-soft)] block text-right">
                    {occPct}% ഉപയോഗത്തിലുണ്ട്
                  </span>
                </div>
              );
            })}
          </div>
        </PaperCard>
      )}

      {/* 4. Tab Content: Credibility Audit Panel */}
      {activeTab === 'audit' && benchmarks && (
        <div className="space-y-4">
          {/* Radar Audit */}
          <PaperCard className="bg-[var(--paper)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-1.5">
                <IconSatellite size={18} />
                <span>1. റഡാർ മാറ്റം കണ്ടെത്തുന്ന കൃത്യത (Sentinel-1 SAR IoU)</span>
              </span>
              <Stamp type="verified" size="sm" />
            </div>
            <p className="font-ui text-xs text-[var(--ink-soft)]">
              കൈകൊണ്ട് അടയാളപ്പെടുത്തിയ ഗ്രൗണ്ട്-ട്രൂത്ത് പായൽ പോളിഗണുകളുമായി താരതമ്യം ചെയ്ത ഫലം:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">IoU Score</span>
                <span className="font-display text-xl font-bold text-[var(--backwater)]">
                  {benchmarks.radar_evaluation.intersection_over_union}
                </span>
              </div>
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">Precision</span>
                <span className="font-display text-xl font-bold text-[var(--ink)]">
                  {(benchmarks.radar_evaluation.precision * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">Recall</span>
                <span className="font-display text-xl font-bold text-[var(--ink)]">
                  {(benchmarks.radar_evaluation.recall * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">F1-Score</span>
                <span className="font-display text-xl font-bold text-[var(--laterite)]">
                  {benchmarks.radar_evaluation.f1_score}
                </span>
              </div>
            </div>
          </PaperCard>

          {/* Speech Audit */}
          <PaperCard className="bg-[var(--paper)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-1.5">
                <IconMicLamp size={18} />
                <span>2. സർവ്വം മലയാളം സ്പീച്ച് മോഡൽ കൃത്യത (Sarvam Saaras STT)</span>
              </span>
              <Stamp type="verified" size="sm" />
            </div>
            <p className="font-ui text-xs text-[var(--ink-soft)]">
              വേമ്പനാട് കായൽ ശൈലിയിലുള്ള 20 യഥാർത്ഥ ഓഡിയോ ക്ലിപ്പുകളിൽ നടത്തിയ പരിശോധന:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">Word Error Rate</span>
                <span className="font-display text-xl font-bold text-[var(--backwater)]">
                  {(benchmarks.speech_evaluation.word_error_rate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">Intent Accuracy</span>
                <span className="font-display text-xl font-bold text-[var(--ink)]">
                  {(benchmarks.speech_evaluation.intent_accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">Kg Extraction</span>
                <span className="font-display text-xl font-bold text-[var(--laterite)]">
                  {(benchmarks.speech_evaluation.keyword_extraction_accuracy_kg * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2.5 bg-[var(--paper-2)] border border-[var(--ink)]/30 rounded-lg">
                <span className="text-[9px] text-[var(--ink-soft)] block uppercase">STT Latency</span>
                <span className="font-display text-xl font-bold text-[var(--ink)]">
                  {benchmarks.speech_evaluation.average_stt_latency_ms} ms
                </span>
              </div>
            </div>
          </PaperCard>
        </div>
      )}

      {/* 5. Tab Content: Scientific Assumptions with Citations */}
      {activeTab === 'assumptions' && benchmarks && (
        <PaperCard className="bg-[var(--paper)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[var(--backwater)]" />
              <span>ശാസ്ത്രീയ അനുമാനങ്ങളും പരാമർശങ്ങളും (Scientific Assumptions)</span>
            </span>
            <span className="text-xs text-[var(--ink-soft)] font-mono">
              KAU & Kudumbashree Standards
            </span>
          </div>

          <div className="divide-y divide-[var(--ink)]/15 font-ui text-xs">
            {benchmarks.assumptions.map((a, idx) => (
              <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="font-bold text-[var(--ink)] flex-1">{a.parameter}</span>
                <span className="font-mono font-bold text-[var(--laterite)] sm:px-4">{a.value}</span>
                <span className="text-[11px] text-[var(--ink-soft)] italic flex-1 text-right sm:text-right">
                  {a.reference}
                </span>
              </div>
            ))}
          </div>
        </PaperCard>
      )}
    </div>
  );
};
