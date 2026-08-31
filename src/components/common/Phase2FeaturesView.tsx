import React from 'react';
import { Sparkles, Calendar, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';

export const Phase2FeaturesView: React.FC = () => {
  const { recurringSchedules, aggregationBatches, toggleRecurringSchedule } = useApp();

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise Scalability Modules (Phase 2 & 3)
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          Recurring Procurement & Multi-Farmer Aggregation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
          Automated supply cycles for commercial food processors and collaborative smallholder aggregation pools across Nigerian LGAs.
        </p>
      </div>

      {/* 1. Recurring Procurement Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              Automated Recurring Procurement Schedules
            </h2>
            <p className="text-xs text-slate-500">Scheduled bi-weekly/monthly harvest deliveries</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(recurringSchedules || []).map(schedule => (
            <div
              key={schedule.id}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {schedule.id}
                </span>
                <StatusBadge status={schedule.status} size="sm" />
              </div>

              <h3 className="text-sm font-bold text-slate-900">{schedule.product}</h3>
              <div className="text-xs text-slate-500">
                Buyer: <strong>{schedule.buyerName}</strong> • Cadence: <strong>{schedule.cadence}</strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Batch Volume:</span>
                  <strong className="text-slate-800">{schedule.quantityPerDelivery} {schedule.unit}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Next Delivery Date:</span>
                  <span className="font-semibold text-emerald-700">{schedule.nextDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Escrow Deduction:</span>
                  <span className="text-emerald-700 font-bold">Enabled (₦{(schedule.budgetPerDelivery || 0).toLocaleString()})</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleRecurringSchedule(schedule.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    schedule.status === 'ACTIVE'
                      ? 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {schedule.status === 'ACTIVE' ? 'Pause Auto-Procurement' : 'Resume Auto-Procurement'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Smallholder Aggregation Batches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-700" />
              Smallholder Cooperative Aggregation Hubs
            </h2>
            <p className="text-xs text-slate-500">Combine smallholder farm yields into containerized 20T - 50T loads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(aggregationBatches || []).map(batch => (
            <div
              key={batch.id}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  {batch.id}
                </span>
                <StatusBadge status={batch.status} size="sm" />
              </div>

              <h3 className="text-sm font-bold text-slate-900">{batch.commodity}</h3>
              <div className="text-xs text-slate-500">
                Hub Depot: <strong>{batch.collectionHubLocation}</strong>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Aggregated: {batch.currentQuantity} / {batch.targetQuantity} {batch.unit}</span>
                  <span className="text-purple-700">
                    {batch.targetQuantity ? Math.round(((batch.currentQuantity || 0) / batch.targetQuantity) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${batch.targetQuantity ? Math.min(100, Math.round(((batch.currentQuantity || 0) / batch.targetQuantity) * 100)) : 0}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Participating Smallholders: <strong>{batch.participatingFarmersCount} Farms</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
