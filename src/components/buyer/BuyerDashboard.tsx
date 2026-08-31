import React from 'react';
import {
  PlusCircle,
  Store,
  Sparkles,
  PackageCheck,
  TrendingUp,
  Truck,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Lock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';

interface BuyerDashboardProps {
  onOpenCreateRequest: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onOpenCreateRequest }) => {
  const {
    currentUser,
    demandRequests,
    orders,
    listings,
    setActiveView,
    setSelectedOrderId,
    setSelectedRequestId,
    marketPrices,
    topMatchingSuppliers,
  } = useApp();

  const buyerRequests = (demandRequests || []).filter(r => r.buyerId === currentUser?.id);
  const buyerOrders = (orders || []).filter(o => o.buyerId === currentUser?.id);
  const activeOrder = buyerOrders.find(o => !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status)) || buyerOrders[0];

  const getInitials = (name?: string) => {
    if (!name) return 'FP';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'FP';
  };

  // Step stages for the active order stepper
  const orderSteps = [
    { key: 'AGREEMENT', label: 'Agreement', active: true },
    { key: 'PAYMENT', label: 'Payment', active: activeOrder?.escrow.status === 'FUNDS_HELD' || activeOrder?.escrow.status === 'RELEASED' },
    { key: 'TRANSIT', label: 'Transit', active: ['IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'COMPLETED'].includes(activeOrder?.status || '') },
    { key: 'DELIVERY', label: 'Delivery', active: ['DELIVERED', 'ACCEPTED', 'COMPLETED'].includes(activeOrder?.status || '') },
    { key: 'SETTLEMENT', label: 'Settlement', active: activeOrder?.status === 'COMPLETED' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 8 Cols: Active Order & Matching Recommendations */}
      <section className="lg:col-span-8 flex flex-col gap-6">
        {/* Active Order Card */}
        {activeOrder ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Active Order: #{activeOrder.id}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Transaction between {currentUser.businessName || currentUser.name} & {activeOrder.supplierName}, {activeOrder.supplierState}
                </p>
              </div>
              <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wide border border-amber-200">
                {activeOrder.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* 4-Stat Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="block text-[11px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Produce</span>
                <span className="font-semibold text-sm text-slate-900 truncate block">{activeOrder.product}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="block text-[11px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Quantity</span>
                <span className="font-semibold text-sm text-slate-900 truncate block">
                  {(activeOrder.quantity || 0).toLocaleString()} {activeOrder.unit} (Grade {(activeOrder.qualityGrade || '').replace('_', ' ')})
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="block text-[11px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Total Price</span>
                <span className="font-semibold text-sm text-slate-900 font-mono block">
                  ₦{(activeOrder.grandTotalNGN || activeOrder.produceTotalNGN || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="block text-[11px] text-emerald-600 uppercase font-bold mb-1 tracking-wider">Escrow Status</span>
                <span className="font-bold text-sm text-emerald-700 block">
                  {activeOrder.escrow?.status === 'FUNDS_HELD' ? 'Funds Held' : (activeOrder.escrow?.status || 'PENDING').replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Sleek Milestone Stepper */}
            <div className="relative px-2 sm:px-6 my-2">
              <div className="absolute top-2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2"></div>
              <div
                className="absolute top-2 left-6 h-1 bg-emerald-500 -translate-y-1/2 transition-all duration-500"
                style={{
                  width: `${
                    activeOrder.status === 'COMPLETED'
                      ? 100
                      : ['DELIVERED', 'ACCEPTED'].includes(activeOrder.status)
                      ? 75
                      : ['IN_TRANSIT', 'PICKED_UP'].includes(activeOrder.status)
                      ? 50
                      : activeOrder.escrow.status === 'FUNDS_HELD'
                      ? 25
                      : 0
                  }%`,
                }}
              ></div>

              <div className="relative flex justify-between">
                {orderSteps.map((step, idx) => (
                  <div key={step.key} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ring-4 ring-white transition-colors ${
                        step.active ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    ></div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        step.active ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <PackageCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Active Order Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Create a procurement request or browse verified farmer listings to start agricultural trade.
            </p>
            <button
              type="button"
              onClick={onOpenCreateRequest}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-100 transition-all cursor-pointer"
            >
              Create Demand Request
            </button>
          </div>
        )}

        {/* Matching Recommendations Container */}
        <div className="bg-white rounded-2xl border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-700 text-sm">Matching Recommendations</h3>
              <p className="text-[11px] text-slate-400">Deterministic scoring across distance, grade & supplier trust</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('matching')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              View All Matches →
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {(listings || []).slice(0, 3).map((item, idx) => {
              const bgColors = ['bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600', 'bg-purple-50 text-purple-600'];
              const colorClass = bgColors[idx % bgColors.length];
              const supplierState = item.farmerState || item.state || 'Kano';
              const trustScores = [96, 91, 88];

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveView('matching')}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${colorClass}`}>
                      {getInitials(item.farmerName || 'Supplier')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">
                        {item.farmerName}, {supplierState}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {98 - idx * 6}% Match · {item.quantity} {(item.unit || 'KG').replace('_', ' ')} {item.product} ({(item.qualityGrade || 'GRADE_A').replace('_', ' ')})
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      ₦{(item.pricePerUnit || 0).toLocaleString()}/{(item.unit || 'unit').replace('_', ' ')}
                    </span>
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                      Verified Trust {trustScores[idx] || 90}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aside 4 Cols: Deep Luxury Emerald Supplier Profile & Market Intelligence */}
      <aside className="lg:col-span-4 flex flex-col gap-6">
        {/* Emerald Luxury Supplier Card */}
        <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-4">
              Featured Supplier Profile
            </span>
            <h3 className="text-2xl font-bold mb-1 tracking-tight">Al-Hassan Farms</h3>
            <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
              Specializing in Dry-Season Tomatoes and Maize. Located in Bagwai LGA, Kano State.
            </p>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-emerald-200">Trust Score</span>
                <span className="text-xl font-bold text-white">
                  94<span className="text-sm text-emerald-300 font-normal">/100</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-emerald-800 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-emerald-400 rounded-full"></div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-100">
                  <span className="text-emerald-400 font-bold">✓</span> Government Identity Verified (NIN/CAC)
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-100">
                  <span className="text-emerald-400 font-bold">✓</span> 102 Successful Deliveries Settled
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-100">
                  <span className="text-emerald-400 font-bold">✓</span> Zero Quality Disputes on Record
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Market Intelligence Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 shadow-sm flex flex-col">
          <h4 className="font-bold text-slate-800 mb-4 text-base">Market Intelligence</h4>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Avg. Price Tomatoes (Grade A)</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">
                ₦ 910/kg <span className="text-[10px] text-emerald-700">↑ 4%</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Demand Level (North West)</span>
              <span className="font-bold text-blue-600 uppercase text-xs">High</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Active Transporters (Kano)</span>
              <span className="font-bold text-slate-800 font-mono text-sm">142 Trucks</span>
            </div>

            <div className="mt-auto pt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Actions</p>
                <button
                  type="button"
                  id="buyer-sidebar-create-demand-btn"
                  onClick={onOpenCreateRequest}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md shadow-emerald-100 transition-colors cursor-pointer"
                >
                  Create New Demand Request
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('logistics')}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                >
                  Contact Logistics Fleet
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
