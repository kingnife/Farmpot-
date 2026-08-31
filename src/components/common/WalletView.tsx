import React, { useState } from 'react';
import { Wallet, Lock, ArrowUpRight, ArrowDownLeft, PlusCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WalletView: React.FC = () => {
  const { currentUser, updateWalletBalance, orders } = useApp();
  const [depositAmount, setDepositAmount] = useState<number>(500000);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;
    updateWalletBalance(depositAmount);
    setIsDepositOpen(false);
  };

  const userOrders = (orders || []).filter(
    o => o.buyerId === currentUser?.id || o.supplierId === currentUser?.id || o.logistics?.transporterId === currentUser?.id || currentUser?.role === 'ADMIN'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">FarmPot Escrow & Wallet Vault</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your liquid working capital, pre-fund procurement escrow, and receive instant disbursements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDepositOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Top Up Working Capital (₦)</span>
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              Available Working Capital
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-800 text-emerald-200">
              Instant Payout Ready
            </span>
          </div>

          <div>
            <div className="text-3xl font-black tracking-tight text-white">
              ₦{(currentUser?.walletBalance || 0).toLocaleString()} NGN
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Available for immediate agricultural trade funding or bank withdrawal
            </p>
          </div>
        </div>

        {/* Escrow Custody Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              Active Escrow Custody
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Safe Custody Vault
            </span>
          </div>

          <div>
            <div className="text-3xl font-black tracking-tight text-emerald-400">
              ₦{(currentUser?.escrowBalance || 0).toLocaleString()} NGN
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Guaranteed funds locked in transit awaiting destination quality confirmation
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Recent Escrow & Settlement Transactions</h2>

        <div className="divide-y divide-slate-100">
          {userOrders.map(order => (
            <div key={order.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Trade Order {order.id} — {order.product}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Escrow: {(order.escrow?.status || order.status || 'PENDING').replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-slate-900">
                  ₦{(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()} NGN
                </div>
                <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top up modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Top Up FarmPot Working Capital</h3>
            <p className="text-xs text-slate-500">
              Deposit Nigerian Naira (₦) via Instant Bank Transfer, Paystack, or Flutterwave mock gateway.
            </p>

            <form onSubmit={handleDeposit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deposit Amount (₦) *</label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={50000}
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Credit ₦{(depositAmount || 0).toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
