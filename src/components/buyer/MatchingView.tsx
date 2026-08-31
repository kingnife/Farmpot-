import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Calendar,
  Truck,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Building2,
  Layers,
  ArrowLeft,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MatchScoreResult, Listing } from '../../types';
import { TrustScoreBadge } from '../common/TrustScoreBadge';

interface MatchingViewProps {
  onOpenNegotiation: (listing: Listing, requestId?: string) => void;
}

export const MatchingView: React.FC<MatchingViewProps> = ({ onOpenNegotiation }) => {
  const {
    demandRequests,
    selectedRequestId,
    setSelectedRequestId,
    findMatchesForRequest,
    setActiveView,
    startOrOpenConversation,
  } = useApp();

  const activeRequest = demandRequests.find(r => r.id === selectedRequestId) || demandRequests[0];
  const matches = activeRequest ? findMatchesForRequest(activeRequest.id) : [];

  const [compareList, setCompareList] = useState<string[]>([]);

  const toggleCompare = (listingId: string) => {
    setCompareList(prev =>
      prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId]
    );
  };

  const handleContactFarmer = (match: MatchScoreResult) => {
    startOrOpenConversation({
      requestId: activeRequest?.id,
      listingId: match.listing.id,
      targetUserId: match.farmer.id,
      targetUserName: match.farmer.name,
      title: `Match Inquiry: ${match.listing.product} (${activeRequest?.quantity} ${activeRequest?.unit})`,
    });
  };

  if (!activeRequest) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
        <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
        <h3 className="text-sm font-bold text-slate-800">No active demand request selected</h3>
        <button
          type="button"
          onClick={() => setActiveView('requests')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Go to Demand Requests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Request Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => setActiveView('requests')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Demand Requests</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Explainable Supplier Matching Engine</h1>
          <p className="text-xs text-slate-500">
            Multi-factor deterministic matching connecting buyer requirement with audited Nigerian agricultural clusters.
          </p>
        </div>

        {/* Switch Request Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Selected Request:</span>
          <select
            value={activeRequest.id}
            onChange={e => setSelectedRequestId(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {(demandRequests || []).map(r => (
              <option key={r.id} value={r.id}>
                {r.id}: {r.product} ({r.quantity} {r.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Demand Request Spec Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Active Target Procurement Spec
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            {activeRequest.product} — {(activeRequest.quantity || 0).toLocaleString()} {activeRequest.unit}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-2">
            <span>Destination: {activeRequest.destinationLga || 'HQ'}, {activeRequest.destinationState || 'State'} State</span>
            <span>•</span>
            <span>Target Grade: {(activeRequest.targetQualityGrade || 'GRADE_A').replace(/_/g, ' ')}</span>
            <span>•</span>
            <span>Max Budget: ₦{(activeRequest.maxBudgetPerUnit || 0).toLocaleString()}/{activeRequest.unit}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Procurement Budget</div>
          <div className="text-xl font-black text-emerald-400">
            ₦{(activeRequest.totalBudget || (activeRequest.quantity || 0) * (activeRequest.maxBudgetPerUnit || 0)).toLocaleString()} NGN
          </div>
        </div>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <Layers className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No matching suppliers found yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your budget ceiling, grade specifications, or delivery location.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-slate-700">
              Found {matches.length} Verified Outgrower Matches (Ranked by Deterministic Fit Score)
            </span>
            <span>Deterministic Scoring Algorithm Active</span>
          </div>

          {matches.map((match, idx) => (
            <div
              key={match.listingId}
              className={`p-6 bg-white rounded-3xl border shadow-xs transition-all space-y-5 ${
                idx === 0
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Header: Score & Basic Info */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Match Score Gauge */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 text-white font-black shadow-md ${
                      match.matchScore >= 90
                        ? 'bg-emerald-700 shadow-emerald-700/20'
                        : match.matchScore >= 75
                        ? 'bg-blue-700 shadow-blue-700/20'
                        : 'bg-amber-600 shadow-amber-600/20'
                    }`}
                  >
                    <span className="text-xl leading-none">{match.matchScore}%</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5 opacity-90">
                      Match Fit
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{match.listing?.product}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {(match.listing?.qualityGrade || 'GRADE_A').replace(/_/g, ' ')}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Top Ranked Supplier
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-slate-700">{match.farmer?.name}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{match.listing?.state} State ({match.listing?.lga})</span>
                      {match.farmer?.trustScore && (
                        <TrustScoreBadge trustScore={match.farmer.trustScore} userName={match.farmer.name} size="sm" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Savings */}
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-800">
                    ₦{(match.listing?.pricePerUnit || 0).toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-500">/ {match.listing?.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Supplier Stock: {(match.listing?.quantity || 0).toLocaleString()} {match.listing?.unit}
                  </div>
                  {(match.listing?.pricePerUnit || 0) < (activeRequest.maxBudgetPerUnit || 0) && (
                    <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                      ₦{((activeRequest.maxBudgetPerUnit || 0) - (match.listing?.pricePerUnit || 0)).toLocaleString()} savings / {match.listing?.unit}
                    </div>
                  )}
                </div>
              </div>

              {/* Explainable Reasons & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-xs">
                {/* Match Reasons */}
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Match Reasons & Fit Factors:
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    {(match.matchReasons || []).map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-baseline gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Distance & Warnings */}
                <div>
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Haulage & Warning Points:
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div>
                      Transit Distance: <strong>~{match.distanceKm || 0} km</strong> ({match.listing.state} → {activeRequest.destinationState})
                    </div>
                    <div>
                      Estimated Logistics: <strong>₦{(match.estimatedLogisticsNGN || 0).toLocaleString()} NGN</strong>
                    </div>
                    {(match.warnings && match.warnings.length > 0) ? (
                      match.warnings.map((warn, wIdx) => (
                        <div key={wIdx} className="flex items-baseline gap-1.5 text-amber-700 font-medium">
                          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{warn}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-emerald-700 font-medium">
                        ✓ No logistical or quality conflicts detected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleContactFarmer(match)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat / Negotiate</span>
                  </button>

                  <a
                    href={`https://wa.me/${match.farmer.whatsapp?.replace(/\+/g, '') || '2348024445566'}?text=${encodeURIComponent(
                      `Hello Alhaji Musa. We saw your FarmPot listing for ${match.listing.product} and want to discuss supplying our Lagos processing plant.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Direct</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id={`make-offer-btn-${match.listingId}`}
                    onClick={() => onOpenNegotiation(match.listing, activeRequest.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-700/20 hover:shadow transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Make Structured Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
