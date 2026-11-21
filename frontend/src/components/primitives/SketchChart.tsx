import React from 'react';

interface ChartSeries {
  label: string;
  optimizerValue: number;
  baselineValue: number;
  unit: string;
  deltaText: string;
}

interface SketchChartProps {
  title?: string;
  subtitle?: string;
  series: ChartSeries[];
  className?: string;
}

/**
 * SketchChart:
 * Hand-drawn comparison bar chart with hatched fills comparing OR-Tools vs Greedy Baseline.
 */
export const SketchChart: React.FC<SketchChartProps> = ({
  title = 'OR-Tools vs. Greedy Baseline Heuristic',
  subtitle = 'Empirical navigation distance and choke clearance comparison',
  series,
  className = '',
}) => {
  return (
    <div className={`p-4 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-xl shadow-[2px_3px_0px_var(--ink)] ${className}`}>
      {title && <h4 className="font-display font-bold text-base text-[var(--ink)] mb-0.5">{title}</h4>}
      {subtitle && <p className="text-xs text-[var(--ink-soft)] font-ui mb-4">{subtitle}</p>}

      <div className="space-y-4">
        {series.map((item, idx) => {
          const maxVal = Math.max(item.optimizerValue, item.baselineValue, 1);
          const optPct = Math.min(100, Math.round((item.optimizerValue / maxVal) * 100));
          const basePct = Math.min(100, Math.round((item.baselineValue / maxVal) * 100));

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs font-semibold">
                <span className="text-[var(--ink)]">{item.label}</span>
                <span className="font-mono text-xs font-bold text-[var(--laterite)]">
                  {item.deltaText}
                </span>
              </div>

              {/* OR-Tools Bar (Green/Hatched) */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="w-16 font-display font-medium text-[var(--backwater)]">OR-Tools:</span>
                  <div className="flex-1 bg-[var(--paper-2)] h-4 rounded-md border border-[var(--ink)]/40 overflow-hidden relative">
                    <div
                      className="h-full bg-[var(--backwater)] transition-all duration-500"
                      style={{
                        width: `${optPct}%`,
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)',
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-[var(--backwater)] w-14 text-right">
                    {item.optimizerValue} {item.unit}
                  </span>
                </div>

                {/* Baseline Bar (Dotted/Muted) */}
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="w-16 font-display font-medium text-[var(--ink-soft)]">Baseline:</span>
                  <div className="flex-1 bg-[var(--paper-2)] h-4 rounded-md border border-[var(--ink)]/30 overflow-hidden relative">
                    <div
                      className="h-full bg-[var(--ink-soft)]/50 transition-all duration-500"
                      style={{ width: `${basePct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[var(--ink-soft)] w-14 text-right">
                    {item.baselineValue} {item.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
