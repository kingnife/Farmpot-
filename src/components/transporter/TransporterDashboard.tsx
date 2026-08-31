import React from 'react';
import {
  Truck,
  PackageCheck,
  Wallet,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  Thermometer,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const TransporterDashboard: React.FC = () => {
  const { currentUser, orders, setActiveView, setSelectedOrderId } = useApp();

  const assignedOrders = (orders || []).filter(
    o => o.logistics?.transporterId === currentUser?.id
  );

  const availableJobs = (orders || []).filter(
    o => ['ESCROW_HELD', 'READY_FOR_PICKUP'].includes(o.status) && !o.logistics?.transporterId
  );

  const totalEarnings = assignedOrders
    .filter(o => o.status === 'COMPLETED' || o.escrow?.status === 'RELEASED_TO_FARMER')
    .reduce((sum, o) => sum + (o.logistics?.agreedFreightFeeNGN || o.logisticsFeeNGN || 0), 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-500/40 text-blue-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            Verified Cold-Chain Carrier • GIT Insured Fleet
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-blue-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
            Dispatch your refrigerated trucks across Nigerian agricultural corridors, maintain digital waybills, and receive guaranteed logistics freight payouts upon delivery.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              id="transporter-available-jobs-btn"
              onClick={() => setActiveView('available-jobs')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-950/30 transition-all cursor-pointer hover:scale-102"
            >
              <Truck className="w-4 h-4" />
              <span>Available Freight Jobs ({availableJobs.length + 1})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('active-delivery')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Active Waybills ({assignedOrders.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Active Delivery Runs</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{assignedOrders.length} Runs</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Cold-chain telemetry live</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Available Cargo Jobs</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{availableJobs.length + 1} Loads</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Instant dispatch allocation</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Freight Earnings</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{(totalEarnings || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Escrow Guaranteed</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-700">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Reefer Temperature</div>
            <div className="text-2xl font-black text-blue-600 mt-1">11.2°C</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Optimal Tomato Range</div>
          </div>
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-700">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Waybills */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Freight Deliveries</h2>
            <p className="text-xs text-slate-500">GPS checkpoints, temperature logs, and delivery sign-offs</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('active-delivery')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Runs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {assignedOrders.map(order => (
            <div
              key={order.id}
              onClick={() => {
                setSelectedOrderId(order.id);
                setActiveView('active-delivery');
              }}
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-500/40 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Waybill: {order.logistics?.deliveryWaybillNumber || 'WB-PENDING'}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{order.product}</h3>
                  <p className="text-xs text-slate-500">
                    Route: <strong className="text-slate-800">{order.supplierState} → {order.buyerState}</strong> ({(order.quantity || 0).toLocaleString()} {order.unit})
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-blue-800">
                    ₦{(order.logistics?.agreedFreightFeeNGN || order.logisticsFeeNGN || 0).toLocaleString()} NGN
                  </div>
                  <div className="text-[11px] text-slate-500">Freight Allocation</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>Vehicle: <strong>{order.logistics?.transporterVehicle || 'Cold Van'}</strong></span>
                <span className="font-semibold text-blue-700 flex items-center gap-1">
                  <span>Manage Delivery & Waybill</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
