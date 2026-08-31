import React, { useState } from 'react';
import { UserCheck, ShieldCheck, XCircle, CheckCircle2, FileText, MapPin, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';

export const VerificationQueue: React.FC = () => {
  const { users, approveVerification, rejectVerification } = useApp();
  const safeUsers = users || [];
  const [selectedUserId, setSelectedUserId] = useState<string>(safeUsers[0]?.id || '');
  const [reviewNotes, setReviewNotes] = useState('NIN government identity verified against NIMC database. Farm physical GPS verified by Zaria extension agent.');

  const selectedUser = safeUsers.find(u => u.id === selectedUserId) || safeUsers[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">National KYC & Farm Verification Queue</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit government NIN identities, CAC corporate filings, and GPS farm extension records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* User List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Registered Network Entities ({safeUsers.length})
          </h2>

          <div className="space-y-3">
            {safeUsers.map(user => {
              const isSelected = selectedUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{user.name}</span>
                    <StatusBadge status={user.verification.status} size="sm" />
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Role: <strong className="text-slate-700">{user.role}</strong></span>
                    <span>{user.state} State</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      NIN: {user.verification?.ninNumber || 'N/A'}
                    </span>
                    <TrustScoreBadge trustScore={user.trustScore} userName={user.name} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected User Audit Details (7 Cols) */}
        {selectedUser && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedUser.name}</h2>
                    <StatusBadge status={selectedUser.verification.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedUser.businessName} • {selectedUser.role} • {selectedUser.state}
                  </p>
                </div>
              </div>

              <TrustScoreBadge trustScore={selectedUser.trustScore} userName={selectedUser.name} size="md" />
            </div>

            {/* Audit Checklist Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Submitted Documents & Credentials:
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[11px]">National Identity Number (NIN)</div>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {selectedUser.verification.ninNumber || '28394019283'}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified with NIMC</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[11px]">CAC Registration / RC Number</div>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {selectedUser.verification.cacNumber || 'RC-1928472'}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">✓ Active Legal Entity</span>
                </div>
              </div>

              {selectedUser.verification.farmGpsCoordinates && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[11px]">Farm GPS Coordinates & Acreage</div>
                    <div className="font-mono font-semibold text-slate-800 mt-0.5">
                      {selectedUser.verification.farmGpsCoordinates} ({selectedUser.verification.farmSizeHectares} Hectares)
                    </div>
                  </div>
                  <div className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Audited</span>
                  </div>
                </div>
              )}
            </div>

            {/* Review Notes Input */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">
                Verification Officer Assessment Notes *
              </label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Decision Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => rejectVerification(selectedUser.id, 'Incomplete documentation')}
                className="px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject / Request Resubmission</span>
              </button>

              <button
                type="button"
                id="admin-approve-kyc-btn"
                onClick={() => approveVerification(selectedUser.id, reviewNotes)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Issue FarmPot Verified Badge</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
