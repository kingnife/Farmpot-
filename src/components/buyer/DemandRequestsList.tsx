import React from 'react';
import { PlusCircle, Sparkles, MapPin, Calendar, Trash2, ArrowRight, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

interface DemandRequestsListProps {
  onOpenCreateRequest: () => void;
}

export const DemandRequestsList: React.FC<DemandRequestsListProps> = ({ onOpenCreateRequest }) => {
  const {
    currentUser,
    demandRequests,
    findMatchesForRequest,
    setSelectedRequestId,
    setActiveView,
    cancelDemandRequest,
  } = useApp();

  const buyerRequests = demandRequests.filter(r => r.buyerId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Agricultural Demand Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active procurement batches matching with verified Nigerian farmer outgrowers & cooperatives.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateRequest}
          className="flex items-center gap-2 px-4 py-2 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Demand Request</span>
        </button>
      </div>

      {buyerRequests.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-stone-200 text-center text-[#777777] space-y-3">
          <FileText className="w-8 h-8 mx-auto text-stone-300" />
          <h3 className="text-sm font-bold text-[#1F1F1F]">No demand requests created yet</h3>
          <p className="text-xs text-[#777777] max-w-sm mx-auto">
            Post your raw produce specifications to let FarmPot match you with vetted farmer clusters across Nigeria.
          </p>
          <button
            type="button"
            onClick={onOpenCreateRequest}
            className="px-4 py-2 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Create Your First Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {buyerRequests.map(req => {
            const matches = findMatchesForRequest(req.id);
            return (
              <div
                key={req.id}
                className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#3F6B24] hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <StatusBadge status={req.status} size="sm" />
                      {req.isRecurring && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5] uppercase">
                          {req.recurringFrequency} Recurring
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#1F1F1F] mt-2">{req.product}</h3>
                    {req.variety && (
                      <p className="text-xs text-[#777777]">
                        Spec: <span className="font-semibold text-[#1F1F1F]">{req.variety}</span> • Target:{' '}
                        <span className="font-semibold text-[#1F1F1F]">{req.targetQualityGrade.replace(/_/g, ' ')}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#1F1F1F]">
                      ₦{req.totalBudget.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-[#777777]">Max Budget</span>
                    </div>
                    <div className="text-xs text-[#777777] mt-0.5">
                      {req.quantity.toLocaleString()} {req.unit} @ ₦{req.maxBudgetPerUnit.toLocaleString()}/{req.unit} max
                    </div>
                  </div>
                </div>

                {/* Destination & Timing Meta */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Destination: {req.destinationLga}, {req.destinationState} State</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Required Date: {req.requiredDeliveryDate}</span>
                  </div>
                </div>

                {/* Match Banner & Action */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center text-xs font-bold border border-[#BEE7A5]">
                      {matches.length}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[#1F1F1F]">{matches.length} Verified Supplier Matches</span>
                      <span className="text-[#777777] block text-[11px]">
                        {matches.length > 0
                          ? `Top Match: ${matches[0].matchScore}% Fit (${matches[0].farmer.name})`
                          : 'Broadcasting to registered cooperatives'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => cancelDemandRequest(req.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Cancel Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      id={`view-matches-btn-${req.id}`}
                      onClick={() => {
                        setSelectedRequestId(req.id);
                        setActiveView('matching');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>View Matches & Compare</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
