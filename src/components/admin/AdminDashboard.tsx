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
  Layers
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
    .filter(o => o.escrow.status === 'FUNDS_HELD')
    .reduce((sum, o) => sum + o.escrow.totalHeldNGN, 0);

  const totalGMV = orders
    .filter(o => o.status === 'COMPLETED' || o.paymentStatus === 'SUCCESSFUL')
    .reduce((sum, o) => sum + o.grandTotalNGN, 0);

  return (
    <div className="space-y-6">
      {/* Control Tower Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            National Platform Control Tower • Federal Republic of Nigeria
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Operations & Escrow Command Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time surveillance over all Nigerian agricultural corridors, institutional verification queues, Escrow vault custody, and dispute adjudication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('admin-verification')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-950/40 cursor-pointer flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Verification Queue ({pendingVerifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('admin-escrow')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-950/40 cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            <span>Escrow Vault</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Escrow Vault In-Custody</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              ₦{(totalEscrowHeld || 0).toLocaleString()} NGN
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Protected Funds</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Pending KYC Audits</div>
            <div className="text-2xl font-black text-purple-700 mt-1">
              {(pendingVerifications || []).length} Requests
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">NIN & Farm Coordinates</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-700">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
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

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Platform GMV Settled</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{(totalGMV || 0).toLocaleString()} NGN
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Completed Cycles</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live State Machine Pipeline */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
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
                  <div className="text-xs font-black text-slate-900">₦{(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">Escrow: {order.escrow?.status || 'PENDING'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
