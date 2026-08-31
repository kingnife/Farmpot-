import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Sprout,
  Truck,
  Sparkles,
  ArrowRight,
  Eye,
  Lock,
  Star,
  ExternalLink,
  Plus,
  Save,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';
import { User, UserRole } from '../../types';
import { BuyerProfileForm } from '../profile/BuyerProfileForm';
import { FarmerProfileForm } from '../profile/FarmerProfileForm';
import { TransporterProfileForm } from '../profile/TransporterProfileForm';
import { AdminProfileForm } from '../profile/AdminProfileForm';
import { NIGERIAN_STATES, NIGERIAN_LGAS_BY_STATE } from '../../data/nigeriaGeography';

export const AdminUserDirectory: React.FC = () => {
  const {
    users,
    currentUser,
    updateUserProfile,
    setCurrentUserById,
    setActiveView,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Trust Score Adjustment Modal State
  const [userForTrustModal, setUserForTrustModal] = useState<User | null>(null);
  const [trustAdjustmentScore, setTrustAdjustmentScore] = useState<number>(85);
  const [trustAuditNote, setTrustAuditNote] = useState<string>('');

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.businessName && u.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesVerification =
      verificationFilter === 'ALL' ||
      u.verification?.status === verificationFilter;

    return matchesSearch && matchesRole && matchesVerification;
  });

  const handleStartEdit = (user: User) => {
    setSelectedUserForEdit(user);
    setEditFormData({ ...user });
  };

  const handleFieldChange = (updates: Partial<User>) => {
    setEditFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSaveUser = () => {
    if (!selectedUserForEdit) return;
    setIsSaving(true);

    setTimeout(() => {
      updateUserProfile(selectedUserForEdit.id, editFormData);
      setIsSaving(false);
      setSelectedUserForEdit(null);
      showToast(`Master Admin: Updated profile for ${selectedUserForEdit.name}`, 'success');
    }, 400);
  };

  const handleQuickVerificationChange = (userId: string, newStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'NOT_VERIFIED' | 'REJECTED') => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const isVerified = newStatus === 'VERIFIED';
    updateUserProfile(userId, {
      verification: {
        ...targetUser.verification,
        status: newStatus,
        verifiedAt: isVerified ? new Date().toISOString() : undefined,
        verifiedBy: isVerified ? 'Master Admin' : undefined,
      },
      trustScore: {
        ...targetUser.trustScore,
        score: isVerified ? Math.min(100, (targetUser.trustScore?.score || 70) + 15) : targetUser.trustScore?.score || 70,
        identityVerified: isVerified,
        farmOrBusinessVerified: isVerified
      }
    });

    showToast(`Verification status for ${targetUser.name} updated to ${newStatus}`, 'info');
  };

  const handleApplyTrustScore = () => {
    if (!userForTrustModal) return;

    updateUserProfile(userForTrustModal.id, {
      trustScore: {
        ...userForTrustModal.trustScore,
        score: trustAdjustmentScore,
        badgeLevel: trustAdjustmentScore >= 90 ? 'GOLD' : trustAdjustmentScore >= 80 ? 'SILVER' : 'BRONZE'
      }
    });

    showToast(`Deterministic Trust Score for ${userForTrustModal.name} set to ${trustAdjustmentScore}/100`, 'success');
    setUserForTrustModal(null);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'BUYER':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'FARMER':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'TRANSPORTER':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Admin Authority Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Master Administrator Authority • Central Identity & KYC Bureau</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            User Ecosystem Directory & Profile Authority
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Complete administrative jurisdiction to inspect, edit, verify, adjust trust scores, and govern all Buyers, Farmers, Transporters, and Platform Staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('admin-analytics')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Transaction Analytics</span>
          </button>
        </div>
      </div>

      {/* Directory Search & Filters */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all users by name, enterprise, phone, state, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:outline-none"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="BUYER">Buyers ({users.filter(u => u.role === 'BUYER').length})</option>
              <option value="FARMER">Farmers ({users.filter(u => u.role === 'FARMER').length})</option>
              <option value="TRANSPORTER">Transporters ({users.filter(u => u.role === 'TRANSPORTER').length})</option>
              <option value="ADMIN">Admins ({users.filter(u => u.role === 'ADMIN').length})</option>
            </select>

            <select
              value={verificationFilter}
              onChange={e => setVerificationFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:outline-none"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="NOT_VERIFIED">Not Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Stakeholder</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">KYC Status</th>
                <th className="py-3 px-3">Trust Score</th>
                <th className="py-3 px-3">Wallet / Escrow</th>
                <th className="py-3 px-3 text-right">Master Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500">{user.businessName || 'Individual Entity'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-900 font-semibold">{user.lga}, {user.state} State</div>
                    <div className="text-[10px] text-slate-400">Nigeria</div>
                  </td>

                  <td className="py-3 px-3">
                    <StatusBadge status={user.verification?.status || 'NOT_VERIFIED'} size="sm" />
                  </td>

                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUserForTrustModal(user);
                        setTrustAdjustmentScore(user.trustScore?.score || 85);
                      }}
                      className="cursor-pointer group flex items-center gap-1.5"
                      title="Click to manually adjust deterministic trust score"
                    >
                      <span className="font-black text-emerald-800 text-xs">
                        {user.trustScore?.score || 85}/100
                      </span>
                      <span className="text-[10px] text-purple-700 underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </span>
                    </button>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <div className="text-slate-900 font-bold">₦{(user.walletBalance || 0).toLocaleString()}</div>
                    {(user.escrowBalance || 0) > 0 && (
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        ₦{(user.escrowBalance || 0).toLocaleString()} held
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(user)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit profile with master authority"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      {user.verification?.status !== 'VERIFIED' ? (
                        <button
                          type="button"
                          onClick={() => handleQuickVerificationChange(user.id, 'VERIFIED')}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          title="Quick Approve Verification"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickVerificationChange(user.id, 'UNDER_REVIEW')}
                          className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                          title="Request KYC Re-audit"
                        >
                          Audit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL / DRAWER: MASTER ADMIN EDIT PROFILE FOR SELECTED USER */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-900/80 border border-purple-600 flex items-center justify-center text-purple-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                    Master Administrator Authority Mode
                  </div>
                  <h2 className="text-lg font-black text-white">
                    Editing {selectedUserForEdit.name} ({selectedUserForEdit.role})
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
              {/* General Core Attributes */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>General Contact & Identity Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Representative Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={e => handleFieldChange({ name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Enterprise Name</label>
                    <input
                      type="text"
                      value={editFormData.businessName || ''}
                      onChange={e => handleFieldChange({ businessName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                    <select
                      value={editFormData.role || selectedUserForEdit.role}
                      onChange={e => handleFieldChange({ role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="BUYER">BUYER (Food Processor / Merchant)</option>
                      <option value="FARMER">FARMER (Producer / Cooperative)</option>
                      <option value="TRANSPORTER">TRANSPORTER (Haulage / Logistics)</option>
                      <option value="ADMIN">ADMIN (Platform Custodian)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={e => handleFieldChange({ email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={e => handleFieldChange({ phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <select
                      value={editFormData.state || selectedUserForEdit.state}
                      onChange={e => {
                        const newState = e.target.value;
                        const defaultLgas = NIGERIAN_LGAS_BY_STATE[newState] || ['Central'];
                        handleFieldChange({ state: newState, lga: defaultLgas[0] || '' });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      {NIGERIAN_STATES.map(st => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Role-Specific Form Embedded */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {editFormData.role === 'BUYER' && 'Buyer Sourcing & Procurement Settings'}
                  {editFormData.role === 'FARMER' && 'Farmer Agronomic & Farmland Settings'}
                  {editFormData.role === 'TRANSPORTER' && 'Transporter Logistics & Fleet Settings'}
                  {editFormData.role === 'ADMIN' && 'Admin Governance & Clearance Settings'}
                </h3>

                {editFormData.role === 'BUYER' && (
                  <BuyerProfileForm formData={editFormData} onChange={handleFieldChange} />
                )}

                {editFormData.role === 'FARMER' && (
                  <FarmerProfileForm formData={editFormData} onChange={handleFieldChange} />
                )}

                {editFormData.role === 'TRANSPORTER' && (
                  <TransporterProfileForm formData={editFormData} onChange={handleFieldChange} />
                )}

                {editFormData.role === 'ADMIN' && (
                  <AdminProfileForm formData={editFormData} onChange={handleFieldChange} />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveUser}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Synchronizing User State...' : 'Save & Override Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TRUST SCORE ADJUSTER */}
      {userForTrustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Star className="w-4 h-4 fill-purple-600 text-purple-600" />
                <span>Admin Deterministic Trust Score Override</span>
              </div>
              <button
                type="button"
                onClick={() => setUserForTrustModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-slate-900">{userForTrustModal.name}</div>
                <div className="text-[11px] text-slate-500">{userForTrustModal.businessName || userForTrustModal.role}</div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Trust Score:</span>
                  <span className="text-base font-black text-emerald-700">{trustAdjustmentScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={trustAdjustmentScore}
                  onChange={e => setTrustAdjustmentScore(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Audit Note</label>
                <textarea
                  rows={2}
                  placeholder="Reason for manual trust score adjustment (e.g. Completed physical CAC + Farmland audit)..."
                  value={trustAuditNote}
                  onChange={e => setTrustAuditNote(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserForTrustModal(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyTrustScore}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
              >
                Apply Trust Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
