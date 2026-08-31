import React, { useState } from 'react';
import { Scale, ShieldAlert, CheckCircle2, Lock, DollarSign, ArrowRight, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const DisputeResolution: React.FC = () => {
  const { disputes, resolveDispute, orders } = useApp();
  const safeDisputes = disputes || [];
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(safeDisputes[0]?.id || '');
  const [resolutionNotes, setResolutionNotes] = useState(
    'Destination inspection confirmed 18% damage due to cold-chain interruption. Admin decision: 50% refund to Buyer, 50% partial payout to Farmer.'
  );

  const selectedDispute = safeDisputes.find(d => d.id === selectedDisputeId) || safeDisputes[0];
  const relatedOrder = selectedDispute ? (orders || []).find(o => o.id === selectedDispute.orderId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Agricultural Dispute Adjudication Center</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Mediate quality disputes, spoilage reports, and enforce deterministic Escrow vault disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dispute List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Disputes ({safeDisputes.length})
          </h2>

          <div className="space-y-3">
            {safeDisputes.map(disp => (
              <div
                key={disp.id}
                onClick={() => setSelectedDisputeId(disp.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedDispute?.id === disp.id
                    ? 'bg-white border-rose-600 ring-2 ring-rose-500/20 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {disp.id}
                  </span>
                  <StatusBadge status={disp.status} size="sm" />
                </div>

                <div className="text-xs font-bold text-slate-900">
                  Order: {disp.orderId} • Reason: {disp.reason ? disp.reason.replace(/_/g, ' ') : 'Dispute'}
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Claimant: <strong>{disp.raisedByName}</strong> ({disp.raisedByRole})</span>
                  <span className="font-bold text-rose-700">₦{(disp.claimedAmountNGN || 0).toLocaleString()} NGN</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Dispute Resolution Details (7 Cols) */}
        {selectedDispute && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    Dispute {selectedDispute.id}
                  </span>
                  <StatusBadge status={selectedDispute.status} size="md" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  Reason: {selectedDispute.reason.replace(/_/g, ' ')}
                </h2>
                <p className="text-xs text-slate-500">
                  Raised by: <strong className="text-slate-800">{selectedDispute.raisedByName}</strong> ({selectedDispute.raisedByRole})
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Disputed Escrow Sum</div>
                <div className="text-xl font-black text-rose-700">
                  ₦{(selectedDispute.claimedAmountNGN || 0).toLocaleString()} NGN
                </div>
              </div>
            </div>

            {/* Description & Claim */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Claimant's Written Report:
              </div>
              <p className="italic leading-relaxed">"{selectedDispute.description}"</p>
            </div>

            {/* Resolution Notes */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">
                Admin Adjudication Rationale & Orders *
              </label>
              <textarea
                rows={2}
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Settlement Triggers */}
            {selectedDispute.status !== 'RESOLVED' && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-700">Execute Settlement Ruling:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => resolveDispute(selectedDispute.id, 'REFUND_BUYER', resolutionNotes)}
                    className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    100% Refund to Buyer
                  </button>

                  <button
                    type="button"
                    onClick={() => resolveDispute(selectedDispute.id, 'SPLIT_SETTLEMENT', resolutionNotes)}
                    className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    50 / 50 Split Settlement
                  </button>

                  <button
                    type="button"
                    onClick={() => resolveDispute(selectedDispute.id, 'RELEASE_TO_FARMER', resolutionNotes)}
                    className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Dismiss & Release to Farmer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
