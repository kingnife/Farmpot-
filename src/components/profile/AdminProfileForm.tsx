import React from 'react';
import { ShieldCheck, Lock, Award, KeyRound, PhoneCall, Building2, Bell, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';

interface AdminProfileFormProps {
  formData: Partial<User>;
  onChange: (updates: Partial<User>) => void;
}

export const AdminProfileForm: React.FC<AdminProfileFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Department & Clearance Tier */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Platform Clearance & Staff Hierarchy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Department Assignment
            </label>
            <select
              value={formData.department || 'EXECUTIVE'}
              onChange={e => onChange({ department: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="EXECUTIVE">Executive Oversight & Compliance</option>
              <option value="ESCROW_SETTLEMENTS">Escrow Vault & Financial Settlements</option>
              <option value="TRUST_VERIFICATION">Trust & Identity Verification Bureau</option>
              <option value="DISPUTE_TRIBUNAL">Dispute Resolution Tribunal</option>
              <option value="OPERATIONS">Operations & Logistics Oversight</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Staff Clearance Tier
            </label>
            <select
              value={formData.clearanceLevel || 'TIER_4_MASTER'}
              onChange={e => onChange({ clearanceLevel: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="TIER_4_MASTER">Tier 4: Master Custodian (Full Escrow & User Authority)</option>
              <option value="TIER_3">Tier 3: Senior Auditor (Dispute Arbitration & Approvals)</option>
              <option value="TIER_2">Tier 2: Verification Officer (KYC & Documents)</option>
              <option value="TIER_1">Tier 1: Read-Only Compliance Analyst</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Staff Badge ID Number
            </label>
            <input
              type="text"
              placeholder="e.g. FP-ADMIN-001"
              value={formData.badgeId || ''}
              onChange={e => onChange({ badgeId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Official Title / Supervisor Role
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Platform Custodian & Chief Operations Officer"
              value={formData.supervisorRole || ''}
              onChange={e => onChange({ supervisorRole: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Emergency Dispatch Hotline (Secure Phone)
            </label>
            <input
              type="text"
              placeholder="e.g. +234 802 000 9999"
              value={formData.emergencyPhone || ''}
              onChange={e => onChange({ emergencyPhone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Security & Cryptographic Hardware 2FA */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Mandatory Multi-Factor Hardware 2FA</div>
              <div className="text-[10px] text-slate-500">Requires FIDO2 WebAuthn cryptographic keys for high-value escrow disbursements</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ twoFactorEnabled: !formData.twoFactorEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              formData.twoFactorEnabled !== false ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.twoFactorEnabled !== false ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
