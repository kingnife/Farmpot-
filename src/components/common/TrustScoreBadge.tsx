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
    if (score >= 80) return { text: 'text-[#334E1B]', bg: 'bg-[#EDFFE0]', border: 'border-[#BEE7A5]', bar: 'bg-[#334E1B]' };
    if (score >= 60) return { text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-600' };
    return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-600' };
  };

  const colors = getScoreColor(trustScore.score);

  return (
    <>
      <button
        type="button"
        id={`trust-score-badge-${userName.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={() => interactive && setShowModal(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${colors.bg} ${colors.border} ${colors.text} ${
          interactive ? 'hover:shadow-xs cursor-pointer active:scale-95' : 'cursor-default'
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#334E1B]" title="Identity Verified" />
        )}
      </button>

      {/* Trust Score Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#334E1B] p-6 text-white relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-[#EDFFE0] text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                FarmPot Verified Trust Engine
              </div>
              <h3 className="text-xl font-bold text-white">{userName}</h3>
              <p className="text-[#EDFFE0]/90 text-xs mt-0.5">
                Deterministic agricultural performance and identity verification score
              </p>

              <div className="mt-5 flex items-baseline gap-3">
                <div className="text-4xl font-extrabold tracking-tight">{trustScore.score}</div>
                <div className="text-[#EDFFE0] text-sm">/ 100 Trust Score</div>
                <div className="ml-auto bg-white/15 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-xs flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#EDFFE0]" />
                  {trustScore.score >= 90 ? 'Top Tier Partner' : 'Verified Trader'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#EDFFE0] h-full rounded-full transition-all duration-500"
                  style={{ width: `${trustScore.score}%` }}
                />
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
              <h4 className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
                Verification & Audit Checkpoints
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                  {trustScore.identityVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-[#334E1B] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-[#1F1F1F]">Identity (NIN/Govt)</div>
                    <div className="text-[11px] text-[#777777]">
                      {trustScore.identityVerified ? 'Government Verified' : 'Pending Verification'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                  {trustScore.farmOrBusinessVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-[#334E1B] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-[#1F1F1F]">Farm / CAC Audit</div>
                    <div className="text-[11px] text-[#777777]">
                      {trustScore.farmOrBusinessVerified ? 'Audited & Verified' : 'In Review'}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-[#777777] uppercase tracking-wider pt-2">
                Transaction Performance
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#777777]">Order Completion Rate</span>
                    <span className="font-bold text-[#1F1F1F]">{trustScore.orderCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#334E1B] h-full rounded-full"
                      style={{ width: `${trustScore.orderCompletionRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#777777]">Delivery Reliability Rate</span>
                    <span className="font-bold text-[#1F1F1F]">{trustScore.deliveryReliabilityRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#334E1B] h-full rounded-full"
                      style={{ width: `${trustScore.deliveryReliabilityRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#777777]">Quality Consistency Rate</span>
                    <span className="font-bold text-[#1F1F1F]">{trustScore.qualityConsistencyRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#334E1B] h-full rounded-full"
                      style={{ width: `${trustScore.qualityConsistencyRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#777777]">Response Rate</span>
                    <span className="font-bold text-[#1F1F1F]">{trustScore.responseRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#334E1B] h-full rounded-full"
                      style={{ width: `${trustScore.responseRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{trustScore.averageRating} / 5.0</span>
                  </div>
                  <div className="text-[11px] text-[#777777] mt-0.5">
                    {trustScore.totalReviews} Verified Reviews
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="font-bold text-[#1F1F1F] text-sm">{trustScore.disputeHistory}</div>
                  <div className="text-[11px] text-[#777777] mt-0.5">Dispute Risk Level</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
