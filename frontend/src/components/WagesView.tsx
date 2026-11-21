import React, { useState } from 'react';
import { PaperCard } from './primitives/PaperCard';
import { LedgerRow } from './primitives/LedgerRow';
import { BeforeAfterSlider } from './primitives/BeforeAfterSlider';
import { Stamp } from './primitives/Stamp';
import { LedgerTransaction } from '../types';
import { Receipt, X } from 'lucide-react';
import { InkButton } from './primitives/InkButton';

interface WagesViewProps {
  transactions: LedgerTransaction[];
}

export const WagesView: React.FC<WagesViewProps> = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);

  const totalDisbursed = transactions.reduce((acc, t) => acc + t.total_payout_inr, 0);
  const totalBiomassKg = transactions.reduce((acc, t) => acc + t.weight_kg, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* 1. Grand Total Notebook Ledger Header */}
      <PaperCard hasKasavu className="bg-[var(--paper)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--laterite)] font-bold uppercase tracking-wider block">
                കുടുംബശ്രീ ശേഖരണ കൂലി രജിസ്റ്റർ
              </span>
              <Stamp type="simulated" size="sm" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] mt-0.5">
              വിതരണം ചെയ്ത കൂലി (Wages Disbursed)
            </h2>
          </div>

          <div className="text-right sm:border-l sm:border-[var(--ink)]/20 sm:pl-4">
            <span className="font-display text-4xl sm:text-5xl font-black text-[var(--laterite)] block">
              ₹{totalDisbursed.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-[var(--backwater)] block mt-0.5">
              {(totalBiomassKg / 1000).toFixed(2)} ടൺ പായൽ നീക്കം ചെയ്തു
            </span>
          </div>
        </div>
      </PaperCard>

      {/* 2. Before/After Field Verification Photo Slider */}
      <PaperCard className="bg-[var(--paper)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[var(--ink-soft)] uppercase block">
              ഫീൽഡ് ഫോട്ടോ പരിശോധന · Geotag Verification
            </span>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              പുന്നമട കനാൽ ശേഖരണ തെളിവ് (Before vs After)
            </h3>
          </div>
          <Stamp type="verified" size="sm" />
        </div>

        <BeforeAfterSlider />
      </PaperCard>

      {/* 3. Ruled Handwritten Ledger Page */}
      <div className="bg-[var(--paper)] border-2 border-[var(--ink)] rounded-2xl shadow-[3px_4px_0px_var(--ink)] overflow-hidden">
        {/* Notebook Top Kasavu Strip */}
        <div className="px-4 py-3 bg-[var(--paper-2)] border-b-2 border-[var(--ink)] flex items-center justify-between">
          <span className="font-display font-bold text-sm text-[var(--ink)]">
            ലെഡ്ജർ രേഖകൾ (Chained Wage Transactions)
          </span>
          <span className="text-[11px] font-mono text-[var(--ink-soft)]">
            {transactions.length} രേഖകൾ
          </span>
        </div>

        {/* Ruled Rows */}
        <div className="divide-y divide-[var(--ink)]/15">
          {transactions.map((tx) => (
            <LedgerRow
              key={tx.tx_hash}
              id={tx.tx_hash}
              harvesterName={tx.crew_name}
              boatName="വള്ളം"
              weightKg={tx.weight_kg}
              ratePerKg={tx.rate_inr_per_kg}
              bonus={tx.bonus_inr}
              totalPayout={tx.total_payout_inr}
              dateStr={new Date(tx.timestamp).toLocaleDateString('ml-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
              status="simulated"
              onClick={() => setSelectedTx(tx)}
            />
          ))}
        </div>
      </div>

      {/* 4. Transaction Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--paper)] border-2 border-[var(--ink)] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--ink)]/30 pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[var(--backwater)]" />
                <h3 className="font-display font-bold text-base text-[var(--ink)]">
                  കൂലി രസീത് (Wage Receipt)
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg hover:bg-[var(--paper-2)] text-[var(--ink)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-ui text-xs">
              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20 flex justify-between">
                <span>ഗുണഭോക്താവ് (Harvester Crew):</span>
                <b className="font-display text-sm text-[var(--ink)]">{selectedTx.crew_name}</b>
              </div>

              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20 flex justify-between">
                <span>ശേഖരിച്ച ഭാരം (Biomass Cleared):</span>
                <b className="font-mono text-sm text-[var(--laterite)]">{selectedTx.weight_kg} kg</b>
              </div>

              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20 flex justify-between">
                <span>കൂലി നിരക്ക് (Base Rate + Bonus):</span>
                <b className="font-mono text-xs text-[var(--ink)]">
                  ₹{selectedTx.rate_inr_per_kg}/kg + ₹{selectedTx.bonus_inr} ബോണസ്
                </b>
              </div>

              <div className="p-3 bg-[var(--paper-2)] rounded-xl border-2 border-[var(--backwater)] flex justify-between items-center">
                <span>ആകെ വിതരണം (Total Payout):</span>
                <b className="font-display text-2xl font-black text-[var(--backwater)]">
                  ₹{selectedTx.total_payout_inr.toFixed(0)}
                </b>
              </div>

              <div className="text-[10px] font-mono text-[var(--ink-soft)] space-y-0.5 pt-1">
                <div>Chained Tx Hash: {selectedTx.tx_hash}</div>
                <div>Status: Simulated Bank Disbursement Complete</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Stamp type="simulated" size="md" />
              <InkButton variant="secondary" onClick={() => setSelectedTx(null)}>
                <span>അടയ്ക്കുക (Close)</span>
              </InkButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
