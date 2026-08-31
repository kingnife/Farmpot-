import React from 'react';
import {
  Sprout,
  PlusCircle,
  PackageCheck,
  Wallet,
  TrendingUp,
  Truck,
  ShieldCheck,
  Store,
  Sparkles,
  PhoneCall,
  Clock,
  ArrowUpRight,
  Sun,
  CloudRain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';

interface FarmerDashboardProps {
  onOpenCreateListing: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onOpenCreateListing }) => {
  const {
    currentUser,
    listings,
    orders,
    demandRequests,
    setActiveView,
    setSelectedOrderId,
  } = useApp();

  const farmerListings = (listings || []).filter(l => l.farmerId === currentUser?.id);
  const farmerOrders = (orders || []).filter(o => o.supplierId === currentUser?.id);
  const activeOrders = farmerOrders.filter(o => !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status));

  const totalEarnings = farmerOrders
    .filter(o => o.status === 'COMPLETED' || o.escrow?.status === 'RELEASED_TO_FARMER')
    .reduce((sum, o) => sum + (o.produceTotalNGN || o.grandTotalNGN || 0), 0);

  const pendingEscrowPayout = farmerOrders
    .filter(o => o.escrow?.status === 'FUNDS_HELD')
    .reduce((sum, o) => sum + (o.produceTotalNGN || o.grandTotalNGN || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Verified Nigerian Outgrower • {currentUser.state} Agricultural Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Sannu da zuwa, {currentUser.name}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
            Manage your harvest inventory, negotiate with institutional industrial buyers, and receive guaranteed payouts straight to your Nigerian bank account through FarmPot Escrow.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              id="farmer-create-listing-btn"
              onClick={onOpenCreateListing}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/30 transition-all cursor-pointer hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Produce Batch</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('requests-feed')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Buyer Demand Requests ({(demandRequests || []).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Active Produce Stock</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{farmerListings.length} Batches</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {(farmerListings.reduce((sum, l) => sum + (l.quantity || 0), 0) || 0).toLocaleString()} units listed
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Escrow Payouts in Custody</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{(pendingEscrowPayout || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Guaranteed by Buyer Deposit
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Active Sales & Deliveries</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{activeOrders.length} Orders</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
              Cold-chain dispatch active
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Settled Revenue</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{(totalEarnings || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              100% Payout Rate
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-700">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Orders & Produce Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Orders & Deliveries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Farm Sales & Dispatch</h2>
              <p className="text-xs text-slate-500">Produce loading, haulage, and payout release</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('orders')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({farmerOrders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {farmerOrders.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
                <PackageCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No active orders right now</p>
              </div>
            ) : (
              farmerOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setActiveView('orders');
                  }}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {order.id}
                        </span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{order.product}</h3>
                      <p className="text-xs text-slate-500">
                        Buyer: <strong className="text-slate-700">{order.buyerName}</strong> ({order.buyerState})
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-800">
                        ₦{(order.produceTotalNGN || order.grandTotalNGN || 0).toLocaleString()} NGN
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(order.quantity || 0).toLocaleString()} {order.unit} @ ₦{(order.pricePerUnit || 0).toLocaleString()}/{order.unit}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-600">
                      Destination: <strong>{order.deliveryLocation || order.buyerState}</strong>
                    </span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span>Manage Dispatch</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Active Produce & Agronomic Weather */}
        <div className="space-y-6">
          {/* Active Produce Batches */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Listed Produce</h3>
                <p className="text-[11px] text-slate-500">Live on FarmPot Marketplace</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('listings')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {farmerListings.map(listing => (
                <div
                  key={listing.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{listing.product}</div>
                    <div className="text-[11px] text-slate-500">
                      {listing.quantity} {listing.unit} • Grade {listing.qualityGrade.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-800">
                      ₦{(listing.pricePerUnit || 0).toLocaleString()}/{listing.unit}
                    </div>
                    <StatusBadge status={listing.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenCreateListing}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Produce Batch</span>
            </button>
          </div>

          {/* Regional Agro-Weather & Market Alert */}
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl p-5 border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                {currentUser.state} Agro-Climate Monitor
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Optimal Harvest
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tomato harvest moisture is currently <strong>12.8%</strong> across the Zaria-Kano agricultural corridor. Recommend scheduled morning crating for cold-chain transport to Lagos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
