import React from 'react';
import { FileCheck, ShieldCheck, Download, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';

export const ContractsView: React.FC = () => {
  const { orders, currentUser } = useApp();

  const userContracts = (orders || []).filter(
    o => o.buyerId === currentUser?.id || o.supplierId === currentUser?.id || o.logistics?.transporterId === currentUser?.id || currentUser?.role === 'ADMIN'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Legal Agreements & Trade Contracts</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Legally binding digital agricultural supply contracts with escrow terms, quality specifications, and logistics SLAs.
        </p>
      </div>

      <div className="space-y-4">
        {userContracts.map(contract => (
          <div
            key={contract.id}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Contract #{contract.id}
                    </span>
                    <StatusBadge status={contract.status} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{contract.product} Procurement Agreement</h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-slate-900">
                  ₦{(contract.grandTotalNGN || contract.produceTotalNGN || 0).toLocaleString()} NGN
                </div>
                <div className="text-xs text-slate-500">Total Escrow Value</div>
              </div>
            </div>

            {/* Contract Terms Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 text-[11px]">Parties Involved</span>
                <div className="font-semibold">{contract.buyerName} ↔ {contract.supplierName}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Quality Specification</span>
                <div className="font-semibold">Grade A Standard (Inspection Required)</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Dispute Governance</span>
                <div className="font-semibold text-emerald-700">FarmPot Escrow Resolution Protocol</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
