import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Receipt, ShieldCheck, X } from 'lucide-react';
import { LedgerTransaction } from '../types';

interface SimulatedLedgerProps {
  transactions: LedgerTransaction[];
}

export const SimulatedLedger: React.FC<SimulatedLedgerProps> = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);

  const totalDisbursed = transactions.reduce((acc, t) => acc + t.total_payout_inr, 0);
  const totalBiomassKg = transactions.reduce((acc, t) => acc + t.weight_kg, 0);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Harvester Wage Ledger (കൂലി വിതരണം)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SIMULATED LEDGER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically chained wage payments released upon harvest report and geotag verification
          </p>
        </div>

        {/* Aggregates */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Total Cleared: </span>
            <span className="font-bold text-emerald-400 font-mono">{(totalBiomassKg / 1000).toFixed(2)} tons</span>
          </div>
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Disbursed Wages: </span>
            <span className="font-bold text-sky-400 font-mono">₹{totalDisbursed.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/60 uppercase font-semibold text-[10px] text-slate-400 tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Tx Hash</th>
              <th className="py-2.5 px-3">Crew / Boat</th>
              <th className="py-2.5 px-3">Weight (kg)</th>
              <th className="py-2.5 px-3">Rate</th>
              <th className="py-2.5 px-3">Choke Bonus</th>
              <th className="py-2.5 px-3">Total Payout</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {transactions.map((tx) => (
              <tr key={tx.tx_hash} className="hover:bg-slate-800/40 transition">
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                  {tx.tx_hash.slice(0, 10)}...
                </td>
                <td className="py-2.5 px-3 font-medium text-white">
                  {tx.crew_name}
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">
                  {tx.weight_kg} kg
                </td>
                <td className="py-2.5 px-3">
                  ₹{tx.rate_inr_per_kg.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-amber-400 font-medium">
                  +₹{tx.bonus_inr}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-sky-300">
                  ₹{tx.total_payout_inr.toFixed(2)}
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {tx.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="View Bank Receipt"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simulated Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">Kerala Gramin Bank Disbursal</h3>
                <span className="text-[10px] text-amber-400 uppercase font-semibold">
                  Simulated Bank Receipt (Demo Only)
                </span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 space-y-2 text-xs border border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-slate-200">{selectedTx.bank_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SHA-256 Hash:</span>
                <span className="font-mono text-[10px] text-slate-400">{selectedTx.tx_hash.slice(0, 24)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary:</span>
                <span className="font-medium text-white">{selectedTx.crew_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Biomass Weighed:</span>
                <span className="text-emerald-400 font-semibold">{selectedTx.weight_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Wage (₹3.50/kg):</span>
                <span>₹{selectedTx.base_payout_inr.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Choke Clearance Bonus:</span>
                <span className="text-amber-400 font-semibold">+₹{selectedTx.bonus_inr.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm text-sky-300">
                <span>Total Disbursed:</span>
                <span>₹{selectedTx.total_payout_inr.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
