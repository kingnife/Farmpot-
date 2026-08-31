import React, { useState } from 'react';
import {
  ShieldAlert,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  UserCheck,
  Building,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  Scale,
  Landmark,
  BadgeCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthPageView } from '../../types';

interface AdminAuthProps {
  initialView?: AuthPageView;
  onSwitchClient?: (client: 'BUYER' | 'FARMER' | 'TRANSPORTER' | 'ADMIN') => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  initialView = 'login',
  onSwitchClient
}) => {
  const {
    loginWithCredentials,
    signupWithRoleData,
    closeAuth,
    sessionSummary,
    users,
    setCurrentUserById,
    currentUser,
    orders,
    disputes,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthPageView>(initialView);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@farmpot.ng');
  const [loginSecretKey, setLoginSecretKey] = useState('••••••••••••');
  const [securityPin, setSecurityPin] = useState('9482');
  const [loginLoading, setLoginLoading] = useState(false);

  // Staff onboarding form state
  const [officerName, setOfficerName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('ESCROW_VAULT');
  const [staffBadgeId, setStaffBadgeId] = useState('');
  const [supervisorToken, setSupervisorToken] = useState('FP-SEC-AUTH-2026');
  const [signupLoading, setSignupLoading] = useState(false);

  const adminUsers = users.filter(u => u.role === 'ADMIN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      loginWithCredentials(loginEmail, loginSecretKey, 'ADMIN');
      setLoginLoading(false);
    }, 400);
  };

  const handleQuickSelectUser = (userId: string) => {
    setCurrentUserById(userId);
    closeAuth();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: officerName || 'Compliance Officer',
          businessName: `FarmPot ${department.replace(/_/g, ' ')} Unit`,
          email: officialEmail || 'officer@farmpot.ng',
          phone: phone || '+234 802 000 9988',
          state: 'FCT Abuja',
          lga: 'Municipal',
          address: 'FarmPot Operations Center, Central Business District, Abuja',
          walletBalance: 0,
          escrowBalance: 0,
        },
        'ADMIN'
      );
      setSignupLoading(false);
    }, 400);
  };

  // Admin stats
  const totalEscrowPool = orders.reduce((sum, o) => sum + (o.escrowAmountNGN || o.totalAmountNGN || 0), 0) || 142400000;
  const pendingDisputesCount = disputes.filter(d => d.status !== 'RESOLVED').length;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      {/* Top Banner with Admin Identity */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
                  Control Tower
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Operations & Trust HQ
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                FarmPot Control Tower & Escrow Custody
              </h1>
            </div>
          </div>

          {/* Sub-view switcher */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-sm text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Staff Clearance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'exit'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-8">
        {/* ======================= VIEW 1: ADMIN LOGIN ======================= */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-purple-600">
                    Restricted Area · 256-Bit TLS
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Admin Control Tower Authentication</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authorize multi-million Naira escrow disbursements, manage KYC verification dossiers, and supervise logistics fleets.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Admin Master Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="admin@farmpot.ng"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Master Password / Key
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={loginSecretKey}
                        onChange={e => setLoginSecretKey(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      2FA Hardware PIN
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        maxLength={6}
                        value={securityPin}
                        onChange={e => setSecurityPin(e.target.value)}
                        placeholder="e.g. 9482"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm outline-none font-mono tracking-widest transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2.5">
                  <BadgeCheck className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>
                    <strong>Security Clearance Level:</strong> Tier 4 Super Administrator with full Escrow Vault Release Privileges.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <span>Verifying Security Clearance...</span>
                  ) : (
                    <>
                      <span>Enter Admin Control Tower</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>New operations staff member?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
                >
                  Staff Enrollment Flow →
                </button>
              </div>
            </div>

            {/* Quick Demo Admin Account */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Active Admin Custodian
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Select the lead platform controller to inspect system analytics, KYC verification queues, and dispute arbitrations:
                </p>

                <div className="space-y-2.5">
                  {adminUsers.map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleQuickSelectUser(a.id)}
                      className="w-full p-3 bg-slate-800/90 rounded-xl border border-slate-700 hover:border-purple-500 hover:bg-purple-950/40 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={a.avatar}
                          alt={a.name}
                          className="w-10 h-10 rounded-full object-cover border border-purple-400"
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300">
                            {a.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Head of Escrow & Platform Trust · Abuja HQ
                          </div>
                          <div className="text-[10px] text-purple-300 font-semibold font-mono">
                            ₦{(a.escrowBalance || 87500000).toLocaleString()} Vault Custody
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Policy Box */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Immutable blockchain audit hashes enabled</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-signatory vault approval workflow active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VIEW 2: ADMIN STAFF ONBOARDING ======================= */}
        {activeTab === 'signup' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Operations & Verification Staff Enrollment</h2>
              <p className="text-xs text-slate-500 mt-1">
                Register authorized operations officers, dispute arbiters, or verification agents with supervisor cryptographic token clearance.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={e => setOfficerName(e.target.value)}
                    placeholder="e.g. Dr. Ngozi Achebe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official FarmPot Staff Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={officialEmail}
                    onChange={e => setOfficialEmail(e.target.value)}
                    placeholder="ngozi.achebe@farmpot.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Department / Bureau *
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm outline-none bg-white"
                  >
                    <option value="ESCROW_VAULT">Escrow Vault & Settlement Treasury</option>
                    <option value="VERIFICATION_OFFICE">KYC & Farmland Verification Bureau</option>
                    <option value="DISPUTE_ARBITRATION">Commercial Dispute Resolution Tribunal</option>
                    <option value="LOGISTICS_OVERSIGHT">Interstate Fleet & Logistics Control</option>
                    <option value="COMMODITY_SURVEILLANCE">Commodity Surveillance & Anti-Gouging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Staff Badge / Service Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffBadgeId}
                    onChange={e => setStaffBadgeId(e.target.value)}
                    placeholder="e.g. FP-OPS-8841"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Secure Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 802 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supervisor Authorization Clearance Token *
                  </label>
                  <input
                    type="text"
                    required
                    value={supervisorToken}
                    onChange={e => setSupervisorToken(e.target.value)}
                    placeholder="FP-SEC-AUTH-XXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                <Landmark className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-900">
                  <span className="font-bold">Compliance & Audit Mandate:</span> All actions performed in the Control Tower, including document approvals, escrow vault releases, and dispute resolutions, are permanently recorded with timestamped cryptographic hashes.
                </div>
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {signupLoading ? (
                  <span>Issuing Staff Clearance...</span>
                ) : (
                  <>
                    <span>Enroll Staff Profile & Launch Control Tower</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================= VIEW 3: ADMIN EXIT PAGE ======================= */}
        {activeTab === 'exit' && (
          <div className="text-center max-w-xl mx-auto py-4">
            <div className="w-16 h-16 bg-purple-100 border-2 border-purple-300 text-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-purple-700" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Admin Session Locked Safely
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              Control Tower Terminal Logged Out
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Your administrative session for <span className="font-semibold text-slate-800">{sessionSummary?.businessName || currentUser.businessName || 'FarmPot Operations Headquarters'}</span> has been terminated.
            </p>

            {/* Session Summary Card */}
            <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                Platform Vault & System State
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Total Escrow Vault Reserves</div>
                  <div className="font-bold text-purple-800 font-mono text-sm">
                    ₦142,400,000
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Pending Dispute Tickets</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    {pendingDisputesCount} Active Arbitrations
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Audit Trail Lock</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    {new Date().toLocaleTimeString()} Encrypted
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Automated Bot Oversight</div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active 24/7 Monitoring
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Re-Authenticate Admin Session</span>
              </button>

              <button
                type="button"
                onClick={closeAuth}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Return to Live Marketplace View
              </button>

              {onSwitchClient && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span>Switch to another client:</span>
                  <button
                    type="button"
                    onClick={() => onSwitchClient('BUYER')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Buyers Hub
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => onSwitchClient('FARMER')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Farmers Hub
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => onSwitchClient('TRANSPORTER')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Transporters Hub
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
