import React from 'react';
import { Lock, DollarSign, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const EscrowVault: React.FC = () => {
  const { orders, releaseEscrowFunds, refundEscrowFunds } = useApp();

  const totalHeld = (orders || [])
    .filter(o => o.escrow?.status === 'FUNDS_HELD')
    .reduce((sum, o) => sum + (o.escrow?.totalHeldNGN || o.grandTotalNGN || 0), 0);

  const totalSettled = (orders || [])
    .filter(o => o.escrow?.status === 'RELEASED_TO_FARMER')
    .reduce((sum, o) => sum + (o.escrow?.totalHeldNGN || o.grandTotalNGN || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">National FarmPot Escrow Vault</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional custodial custody holding multi-party agricultural funds in Nigerian Naira (₦).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
            <div className="text-[10px] text-emerald-800 font-semibold uppercase">Total Vault Custody</div>
            <div className="text-base font-black text-emerald-900">₦{(totalHeld || 0).toLocaleString()} NGN</div>
          </div>
        </div>
      </div>

      {/* Escrow Orders Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Escrow Custodial Allocations</h2>
          <span className="text-xs text-slate-500">{(orders || []).length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Product & Volume</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Supplier Payout</th>
                <th className="p-4">Logistics Payout</th>
                <th className="p-4">Total Held</th>
                <th className="p-4">Escrow Status</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(orders || []).map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-800">{order.id}</td>
                  <td className="p-4 font-semibold text-slate-900">
                    {order.product} ({(order.quantity || 0).toLocaleString()} {order.unit})
                  </td>
                  <td className="p-4">{order.buyerName}</td>
                  <td className="p-4 font-bold text-slate-900">
                    ₦{(order.escrow?.produceAmountNGN || order.produceTotalNGN || 0).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-blue-700">
                    ₦{(order.escrow?.logisticsAmountNGN || order.logisticsFeeNGN || 0).toLocaleString()}
                  </td>
                  <td className="p-4 font-black text-emerald-800">
                    ₦{(order.escrow?.totalHeldNGN || order.grandTotalNGN || 0).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.escrow?.status || 'PENDING_DEPOSIT'} size="sm" />
                  </td>
                  <td className="p-4 text-right">
                    {order.escrow?.status === 'FUNDS_HELD' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => releaseEscrowFunds(order.id)}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Release Payouts
                        </button>
                        <button
                          type="button"
                          onClick={() => refundEscrowFunds(order.id, 'Admin override refund')}
                          className="px-2.5 py-1 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Refund
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
