import React, { useState } from 'react';
import {
  Truck,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  FileText,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  Navigation,
  Fuel,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthPageView } from '../../types';

interface TransporterAuthProps {
  initialView?: AuthPageView;
  onSwitchClient?: (client: 'BUYER' | 'FARMER' | 'TRANSPORTER' | 'ADMIN') => void;
}

export const TransporterAuth: React.FC<TransporterAuthProps> = ({
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
    transportJobs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthPageView>(initialView);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('08093334455');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign up form state
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fleetSize, setFleetSize] = useState('8');
  const [maxPayloadTons, setMaxPayloadTons] = useState('30');
  const [baseState, setBaseState] = useState('Kano');
  const [baseLga, setBaseLga] = useState('Nassarawa');
  const [gitInsurance, setGitInsurance] = useState('Leadway Assurance - Policy #GIT-8820');
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([
    'REFRIGERATED_TRUCK',
    'FLATBED_TRUCK'
  ]);
  const [signupLoading, setSignupLoading] = useState(false);

  const transporterUsers = users.filter(u => u.role === 'TRANSPORTER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      loginWithCredentials(loginPhone, loginPassword, 'TRANSPORTER');
      setLoginLoading(false);
    }, 400);
  };

  const handleQuickSelectUser = (userId: string) => {
    setCurrentUserById(userId);
    closeAuth();
  };

  const toggleVehicleType = (type: string) => {
    setSelectedVehicleTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: managerName || 'Emeka Okonkwo',
          businessName: companyName || 'Niger-Transit Haulage Ltd',
          phone: phone || '+234 809 000 7788',
          email: email || 'dispatch@translogistics.ng',
          state: baseState,
          lga: baseLga,
          address: `Logistics Park, ${baseLga}, ${baseState} State`,
          walletBalance: 150000,
          escrowBalance: 0,
        },
        'TRANSPORTER'
      );
      setSignupLoading(false);
    }, 400);
  };

  // Transporter stats
  const activeJobs = transportJobs.filter(j => j.status === 'IN_TRANSIT' || j.status === 'DISPATCHED' || j.status === 'ASSIGNED');
  const totalFreightEscrow = activeJobs.reduce((sum, j) => sum + (j.freightFeeNGN || 0), 0) || 200000;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
      {/* Top Banner with Transporter Identity */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-blue-400">
                  Client Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Haulage & Logistics Fleets
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Transporters & Freight Carriers Portal
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
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Transporter Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Fleet</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'exit'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-8">
        {/* ======================= VIEW 1: TRANSPORTER LOGIN ======================= */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Sign in to Transporter Portal</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access interstate agricultural haulage loads, generate verified electronic waybills, and receive instant freight payouts.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fleet Phone Number or Dispatch Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={loginPhone}
                      onChange={e => setLoginPhone(e.target.value)}
                      placeholder="e.g. 08093334455 or dispatch@niger-transit.ng"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Fleet Security PIN / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('PIN reset instructions sent to your registered logistics dispatcher phone.')}
                      className="text-xs text-blue-700 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Forgot PIN?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>Keep active on this dispatch console</span>
                  </label>
                  <span className="text-blue-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> GIT Policy Active
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <span>Accessing Logistics Console...</span>
                  ) : (
                    <>
                      <span>Sign In to Transporter Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>New fleet operator or driver syndicate?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
                >
                  Register Carrier Fleet →
                </button>
              </div>
            </div>

            {/* Quick Demo Transporter Accounts */}
            <div className="lg:col-span-5 bg-blue-50/50 rounded-xl p-5 border border-blue-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Instant Demo Transporter Profile
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Select a certified logistics operator to view active waybills, freight assignments, and driver payouts:
                </p>

                <div className="space-y-2.5">
                  {transporterUsers.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleQuickSelectUser(t.id)}
                      className="w-full p-3 bg-white rounded-xl border border-blue-200 hover:border-blue-500 hover:bg-blue-50/70 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-blue-300"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                            {t.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {t.businessName} · {t.state}
                          </div>
                          <div className="text-[10px] text-blue-800 font-semibold font-mono">
                            ₦{(t.walletBalance || 0).toLocaleString()} Earnings · Verified Carrier
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Transporter Highlights Box */}
              <div className="mt-6 pt-4 border-t border-blue-200/80 text-[11px] text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Freight payout locked in escrow before departure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>QR Code & GPS electronic waybills supported</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VIEW 2: TRANSPORTER REGISTRATION ======================= */}
        {activeTab === 'signup' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Carrier & Haulage Company Registration</h2>
              <p className="text-xs text-slate-500 mt-1">
                Register your cold-chain or dry haulage fleet to receive high-value farm-to-factory freight contracts across Nigeria.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Logistics / Haulage Enterprise Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Sahel Freight & Cold Chain Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fleet Dispatch Manager Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={e => setManagerName(e.target.value)}
                    placeholder="e.g. Tunde Balogun"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dispatch Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 809 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Dispatch Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dispatch@sahelfreight.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Operations Hub (State) *
                  </label>
                  <select
                    value={baseState}
                    onChange={e => setBaseState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none bg-white"
                  >
                    <option value="Kano">Kano State (Northern Terminal)</option>
                    <option value="Lagos">Lagos State (Southern Port Hub)</option>
                    <option value="Kaduna">Kaduna State</option>
                    <option value="Oyo">Oyo State (Ibadan Gateway)</option>
                    <option value="Rivers">Rivers State (Port Harcourt)</option>
                    <option value="FCT Abuja">FCT Abuja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Active Fleet Size
                  </label>
                  <select
                    value={fleetSize}
                    onChange={e => setFleetSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none bg-white"
                  >
                    <option value="1">1 - 3 Trucks (Independent Operator)</option>
                    <option value="8">4 - 15 Trucks (Mid-Sized Carrier)</option>
                    <option value="25">16 - 50+ Trucks (National Logistics Fleet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Goods-In-Transit (GIT) Insurance Status
                  </label>
                  <input
                    type="text"
                    value={gitInsurance}
                    onChange={e => setGitInsurance(e.target.value)}
                    placeholder="e.g. Leadway / AIICO / Custodian Policy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Max Haulage Capacity per Single Trip
                  </label>
                  <input
                    type="number"
                    value={maxPayloadTons}
                    onChange={e => setMaxPayloadTons(e.target.value)}
                    placeholder="e.g. 30 (Tonnes)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              {/* Vehicle Types */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Vehicle Types in Fleet
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'REFRIGERATED_TRUCK', label: '❄️ Refrigerated Truck' },
                    { id: 'FLATBED_TRUCK', label: '🚛 30T Flatbed Truck' },
                    { id: 'BOX_VAN', label: '📦 Enclosed Box Van' },
                    { id: 'PICKUP_TRUCK', label: '🛻 3-5T Agro Pickup' },
                  ].map(v => {
                    const isSelected = selectedVehicleTypes.includes(v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => toggleVehicleType(v.id)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-blue-100 text-blue-950 border-blue-500 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <Navigation className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <span className="font-bold">Interstate Route Matching:</span> FarmPot algorithms automatically match your empty backhaul routes with buyers needing return transport from Northern agricultural grain hubs to Southern processing plants.
                </div>
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {signupLoading ? (
                  <span>Registering Fleet Carrier...</span>
                ) : (
                  <>
                    <span>Complete Transporter Onboarding & Claim First Load</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================= VIEW 3: TRANSPORTER EXIT PAGE ======================= */}
        {activeTab === 'exit' && (
          <div className="text-center max-w-xl mx-auto py-4">
            <div className="w-16 h-16 bg-blue-100 border-2 border-blue-300 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-blue-700" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Logistics Dispatch Session Terminated
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              Drive safely on Nigerian highways
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Your carrier dispatch session for <span className="font-semibold text-slate-800">{sessionSummary?.businessName || currentUser.businessName || 'Niger-Transit Logistics'}</span> has been signed off securely.
            </p>

            {/* Session Summary Card */}
            <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                Freight & Waybill Status Summary
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Freight Escrow in Transit</div>
                  <div className="font-bold text-blue-800 font-mono text-sm">
                    ₦{totalFreightEscrow.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Active Freight Deliveries</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    {activeJobs.length || 1} Haulage Waybills
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Available Dispatch Earnings</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    ₦{(currentUser.walletBalance || 650000).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Electronic Waybills Status</div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with Consignees
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log Back In to Fleet Dispatch</span>
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
                    onClick={() => onSwitchClient('ADMIN')}
                    className="font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    Admin
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
