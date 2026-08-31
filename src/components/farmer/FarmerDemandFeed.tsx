import React from 'react';
import { FileText, Sparkles, MapPin, Calendar, DollarSign, ArrowRight, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const FarmerDemandFeed: React.FC = () => {
  const { demandRequests, startOrOpenConversation, setActiveView } = useApp();

  const handleRespondToDemand = (req: any) => {
    startOrOpenConversation({
      requestId: req.id,
      targetUserId: req.buyerId,
      targetUserName: req.buyerName,
      title: `Supply Offer for ${req.product} (${req.quantity} ${req.unit})`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Buyer Demand Request Feed</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Live procurement contracts broadcast by verified Nigerian food processors, breweries, and retail chains.
        </p>
      </div>

      <div className="space-y-4">
        {(demandRequests || []).map(req => (
          <div
            key={req.id}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <StatusBadge status={req.status} size="sm" />
                  {req.isRecurring && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      Recurring Supply
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{req.product}</h3>
                <p className="text-xs text-slate-500">
                  Buyer: <strong className="text-slate-700">{req.buyerName}</strong> ({req.buyerState})
                </p>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-emerald-800">
                  ₦{(req.maxBudgetPerUnit || 0).toLocaleString()} / {req.unit}
                </div>
                <div className="text-xs text-slate-500">
                  Required: {(req.quantity || 0).toLocaleString()} {req.unit} (Total: ₦{(req.totalBudget || 0).toLocaleString()})
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Delivery: {req.destinationLga}, {req.destinationState} State</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Required By: {req.requiredDeliveryDate}</span>
              </div>
              <div>
                <span>Target Grade: <strong>{req.targetQualityGrade ? req.targetQualityGrade.replace(/_/g, ' ') : 'Grade A'}</strong></span>
              </div>
            </div>

            {req.notes && (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{req.notes}"
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleRespondToDemand(req)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Submit Supply Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
