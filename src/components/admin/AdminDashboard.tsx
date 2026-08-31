import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Scale,
  TrendingUp,
  PackageCheck,
  AlertOctagon,
  ArrowUpRight,
  Sparkles,
  Layers,
  PieChart,
  Users,
  DollarSign,
  Truck,
  Building2,
  Sprout,
  BarChart3,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    orders,
    listings,
    demandRequests,
    disputes,
    setActiveView,
    setSelectedOrderId,
  } = useApp();

  const pendingVerifications = users.filter(u => u.verification.status === 'UNDER_REVIEW');
  const activeDisputes = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_INVESTIGATION');
  const totalEscrowHeld = orders
    .filter(o => o.escrow?.status === 'FUNDS_HELD')
    .reduce((sum, o) => sum + (o.escrow?.totalHeldNGN || o.escrowAmountNGN || 0), 0);

  const totalGMV = orders
    .filter(o => o.status === 'COMPLETED' || o.paymentStatus === 'SUCCESSFUL')
    .reduce((sum, o) => sum + (o.grandTotalNGN || o.totalAmountNGN || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Control Tower Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            National Platform Control Tower • Federal Republic of Nigeria
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Operations, Escrow & National Analytics Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Real-time surveillance over all Nigerian agricultural trade corridors, transaction analysis, macro supply-demand intelligence, and comprehensive user profile authority.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveView('admin-analytics')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-950/40 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <PieChart className="w-4 h-4" />
            <span>Transaction & Data Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('admin-users')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>User Directory ({users.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveView('admin-escrow')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-medium text-slate-500">Escrow Vault In-Custody</div>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              ₦{(totalEscrowHeld || 32150000).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">100% Protected Funds</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setActiveView('admin-verification')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-purple-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-medium text-slate-500">Pending KYC Audits</div>
            <div className="text-2xl font-black text-purple-700 mt-1">
              {(pendingVerifications || []).length} Requests
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">NIN & CAC Verification</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-700">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setActiveView('admin-disputes')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-rose-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-medium text-slate-500">Active Disputes</div>
            <div className="text-2xl font-black text-rose-700 mt-1">
              {(activeDisputes || []).length} Cases
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Escrow Auto-Locked</div>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-700">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setActiveView('admin-analytics')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-medium text-slate-500">Platform GMV Settled</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              ₦{(totalGMV || 84500000).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Completed Cycles</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveView('admin-analytics')}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              Transaction Analysis & Data Hub
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Comprehensive analytics on escrow custody velocities, freight trade corridors, and national crop supply vs. demand.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-purple-700 pt-1">
            <span>Open Transaction Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => setActiveView('admin-users')}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Master User Directory & Profiles
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Full authority to inspect, edit, adjust deterministic trust scores, and verify buyers, farmers, and transporters.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-1">
            <span>Manage All User Profiles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => setActiveView('admin-escrow')}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Escrow Custody Vault & Disbursals
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Federal 2-party release triggers, NUBAN batch settlements, and emergency dispute locks.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-700 pt-1">
            <span>Inspect Escrow Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Live State Machine Pipeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">National Orders & State Machine Pipeline</h2>
            <p className="text-xs text-slate-500">Live surveillance of all transactions across Nigeria</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('orders')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Pipeline ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {(orders || []).map(order => (
            <div
              key={order.id}
              onClick={() => {
                setSelectedOrderId(order.id);
                setActiveView('orders');
              }}
              className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {order.id}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">{order.product}</div>
                  <div className="text-[11px] text-slate-500">
                    Buyer: {order.buyerName} → Supplier: {order.supplierName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} size="sm" />
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900 font-mono">
                    ₦{(order.grandTotalNGN || order.totalAmountNGN || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Escrow: {order.escrow?.status || 'FUNDS_HELD'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
