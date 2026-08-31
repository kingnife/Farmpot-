import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle2, AlertTriangle, Star, X } from 'lucide-react';
import { TrustScoreBreakdown } from '../../types';

interface TrustScoreBadgeProps {
  trustScore: TrustScoreBreakdown;
  userName?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  trustScore,
  userName = 'Member',
  size = 'md',
  interactive = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-600' };
    if (score >= 75) return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-600' };
    if (score >= 60) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
    return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500' };
  };

  const colors = getScoreColor(trustScore.score);

  return (
    <>
      <button
        type="button"
        id={`trust-score-badge-${userName.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={() => interactive && setShowModal(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${colors.bg} ${colors.border} ${colors.text} ${
          interactive ? 'hover:shadow-sm cursor-pointer active:scale-95' : 'cursor-default'
        } ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-sm font-semibold'
            : 'px-2.5 py-1 text-xs font-medium'
        }`}
        title="Click to view verified Trust Score breakdown"
      >
        <ShieldCheck className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>Trust {trustScore.score}/100</span>
        {trustScore.identityVerified && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Identity Verified" />
        )}
      </button>

      {/* Trust Score Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                FarmPot Verified Trust Engine
              </div>
              <h3 className="text-xl font-bold text-white">{userName}</h3>
              <p className="text-emerald-100 text-xs mt-0.5">
                Deterministic agricultural performance and identity verification score
              </p>

              <div className="mt-5 flex items-baseline gap-3">
                <div className="text-4xl font-extrabold tracking-tight">{trustScore.score}</div>
                <div className="text-emerald-200 text-sm">/ 100 Trust Score</div>
                <div className="ml-auto bg-white/15 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-xs flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-300" />
                  {trustScore.score >= 90 ? 'Top Tier Partner' : 'Verified Trader'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-emerald-950/60 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${trustScore.score}%` }}
                />
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Verification & Audit Checkpoints
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center gap-2.5">
                  {trustScore.identityVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-medium text-slate-800">Identity (NIN/Govt)</div>
                    <div className="text-[11px] text-slate-500">
                      {trustScore.identityVerified ? 'Government Verified' : 'Pending Verification'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center gap-2.5">
                  {trustScore.farmOrBusinessVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-medium text-slate-800">Farm / CAC Audit</div>
                    <div className="text-[11px] text-slate-500">
                      {trustScore.farmOrBusinessVerified ? 'Audited & Verified' : 'In Review'}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">
                Transaction Performance
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Order Completion Rate</span>
                    <span className="font-semibold text-slate-800">{trustScore.orderCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${trustScore.orderCompletionRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Delivery Reliability Rate</span>
                    <span className="font-semibold text-slate-800">{trustScore.deliveryReliabilityRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${trustScore.deliveryReliabilityRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Quality Consistency Rate</span>
                    <span className="font-semibold text-slate-800">{trustScore.qualityConsistencyRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${trustScore.qualityConsistencyRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Response Rate</span>
                    <span className="font-semibold text-slate-800">{trustScore.responseRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${trustScore.responseRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{trustScore.averageRating} / 5.0</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {trustScore.totalReviews} Verified Reviews
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="font-bold text-slate-800 text-sm">{trustScore.disputeHistory}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Dispute Risk Level</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
