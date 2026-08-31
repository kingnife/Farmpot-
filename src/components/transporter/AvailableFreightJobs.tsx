import React from 'react';
import { Truck, MapPin, Calendar, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AvailableFreightJobs: React.FC = () => {
  const { orders, assignTransporter, currentUser, setSelectedOrderId, setActiveView } = useApp();

  const availableOrders = orders.filter(
    o => ['ESCROW_HELD', 'READY_FOR_PICKUP', 'ORDER_CREATED'].includes(o.status)
  );

  const handleAcceptJob = (orderId: string) => {
    assignTransporter(orderId, currentUser.id);
    setSelectedOrderId(orderId);
    setActiveView('active-delivery');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Available Agricultural Freight Jobs</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Guaranteed haulage contracts across Nigerian routes with payments pre-funded in FarmPot Escrow.
        </p>
      </div>

      <div className="space-y-4">
        {availableOrders.map(order => (
          <div
            key={order.id}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Order Ref: {order.id}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Escrow Locked & Guaranteed
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {order.product} — {(order.quantity || 0).toLocaleString()} {order.unit}
                </h3>
                <p className="text-xs text-slate-500">
                  Cargo Origin: <strong className="text-slate-700">{order.supplierName}</strong> ({order.supplierState})
                </p>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-blue-800">
                  ₦{(order.logisticsFeeNGN || order.logisticsFreightNGN || order.logistics?.agreedFreightFeeNGN || order.escrow?.logisticsAmountNGN || 0).toLocaleString()} NGN
                </div>
                <div className="text-xs text-slate-500">Logistics Payout</div>
              </div>
            </div>

            {/* Route & Requirements */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div>
                <div className="text-slate-400 text-[11px]">Loading Location</div>
                <div className="font-semibold">{order.supplierState} Farm Hub</div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Destination Facility</div>
                <div className="font-semibold">{order.deliveryDestination}</div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Required Vehicle Spec</div>
                <div className="font-semibold text-blue-700">15T Refrigerated Reefer Truck (10-12°C)</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>GIT Insurance Coverage Active</span>
              </div>

              <button
                type="button"
                id={`accept-freight-job-${order.id}`}
                onClick={() => handleAcceptJob(order.id)}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Accept Freight & Generate Waybill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
