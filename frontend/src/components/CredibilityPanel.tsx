import React, { useState, useEffect } from 'react';
import { ShieldCheck, Target, Mic, TrendingUp, BookOpen, Download } from 'lucide-react';

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

export const CredibilityPanel: React.FC = () => {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'radar' | 'speech' | 'optimizer' | 'assumptions'>('radar');

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const resp = await fetch('/api/v1/credibility/benchmarks');
        if (resp.ok) {
          const json = await resp.json();
          setData(json);
        }
      } catch (e) {
        console.error('Failed to load benchmarks', e);
      }
    };
    fetchBenchmarks();
  }, []);

  if (!data) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
        Loading credibility evaluation benchmarks...
      </div>
    );
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payal_credibility_benchmarks.json';
    a.click();
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Credibility & Evidence Panel (ഓഡിറ്റ് & തെളിവുകൾ)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
              AUDITED BENCHMARKS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical ground-truth verification across satellite SAR, Malayalam speech, optimizer delta, and transparent assumptions
          </p>
        </div>

        <button
          onClick={exportJSON}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit JSON
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setActiveSubTab('radar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'radar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Radar SAR vs Ground Truth
        </button>
        <button
          onClick={() => setActiveSubTab('speech')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'speech' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          Sarvam Speech Accuracy (20 Clips)
        </button>
        <button
          onClick={() => setActiveSubTab('optimizer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'optimizer' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Optimizer vs Baseline Delta
        </button>
        <button
          onClick={() => setActiveSubTab('assumptions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'assumptions' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Assumptions & Scientific Citations
        </button>
      </div>

      {/* Tab 1: Radar SAR Evaluation */}
      {activeSubTab === 'radar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Mean IoU
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {data.radar_evaluation.intersection_over_union}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Intersection-over-Union</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Precision
              </span>
              <span className="text-xl font-extrabold text-sky-400 font-mono">
                {(data.radar_evaluation.precision * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">True Positives / Predicted</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Recall
              </span>
              <span className="text-xl font-extrabold text-indigo-400 font-mono">
                {(data.radar_evaluation.recall * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">True Positives / Ground Truth</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                False Positive Rate
              </span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">
                {(data.radar_evaluation.false_positive_rate_water * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">On Open Water Surfaces</span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white">Physical SAR Principles & Water Masking:</h4>
            <p>{data.radar_evaluation.notes}</p>
            <div className="text-[11px] text-slate-400 pt-1">
              <b>Evaluation Ground Truth:</b> {data.radar_evaluation.dataset}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Speech AI Evaluation */}
      {activeSubTab === 'speech' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Word Error Rate (WER)
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {(data.speech_evaluation.word_error_rate * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Saaras Malayalam STT</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Character Error Rate
              </span>
              <span className="text-xl font-extrabold text-sky-400 font-mono">
                {(data.speech_evaluation.character_error_rate * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Malayalam Script</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                KG Spotting Accuracy
              </span>
              <span className="text-xl font-extrabold text-emerald-300 font-mono">
                {(data.speech_evaluation.keyword_extraction_accuracy_kg * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Payload Extracted Correctly</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Location Accuracy
              </span>
              <span className="text-xl font-extrabold text-indigo-400 font-mono">
                {(data.speech_evaluation.keyword_extraction_accuracy_location * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Canal / Jetty Named</span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white">Audio Benchmark Protocol:</h4>
            <p>
              Benchmarked on 20 authentic field audio recordings in Malayalam (including Travancore inland canal dialects, ambient boat motor drone, and English loanwords like "jetty", "kilo", "boat").
            </p>
            <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
              <span>Avg STT Latency: <b>{data.speech_evaluation.average_stt_latency_ms}ms</b></span>
              <span>Bulbul v3 TTS Latency: <b>{data.speech_evaluation.tts_latency_ms}ms</b></span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Optimizer Delta */}
      {activeSubTab === 'optimizer' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Distance Saved vs Greedy
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                {data.optimizer_delta_evaluation.metrics.distance_saved_pct}%
              </div>
              <div className="text-xs text-slate-300">
                Saved {data.optimizer_delta_evaluation.metrics.distance_saved_km} km of canal navigation
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Fuel Conserved
              </span>
              <div className="text-2xl font-extrabold text-sky-400 font-mono">
                ~{data.optimizer_delta_evaluation.metrics.estimated_fuel_saved_litres} Litres
              </div>
              <div className="text-xs text-slate-300">
                Reduced boat emissions in Vembanad Ramsar wetland
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Choke Points Cleared Prioritized
              </span>
              <div className="text-2xl font-extrabold text-amber-300 font-mono">
                +{data.optimizer_delta_evaluation.metrics.choke_improvement_pct}%
              </div>
              <div className="text-xs text-slate-300">
                High-priority passenger ferry routes unblocked first
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl text-xs text-slate-300">
            <b>Mathematical Formulation:</b> Multi-boat Capacitated Vehicle Routing Problem with Time Windows (CVRPTW) solved via Google OR-Tools constraint programming. Constraints incorporate boat payload limits, daylight harvest hours, and Open-Meteo rain cutoffs to avoid rot.
          </div>
        </div>
      )}

      {/* Tab 4: Assumptions & Citations */}
      {activeSubTab === 'assumptions' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 uppercase font-semibold text-[10px] text-slate-400 tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Parameter</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Reference / Institutional Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {data.assumptions.map((a, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-white">{a.parameter}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">{a.value}</td>
                  <td className="py-2.5 px-3 text-slate-400">{a.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
