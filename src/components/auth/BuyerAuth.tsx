import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  MapPin,
  FileText,
  UserPlus,
  LogIn,
  LogOut,
  RotateCcw,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthPageView } from '../../types';

interface BuyerAuthProps {
  initialView?: AuthPageView;
  onSwitchClient?: (client: 'BUYER' | 'FARMER' | 'TRANSPORTER' | 'ADMIN') => void;
}

export const BuyerAuth: React.FC<BuyerAuthProps> = ({
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
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthPageView>(initialView);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('procurement@lagosfoods.ng');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign up form state
  const [companyName, setCompanyName] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [repName, setRepName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [buyerType, setBuyerType] = useState('PROCESSOR');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');
  const [address, setAddress] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('50000000');
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([
    'Soybeans',
    'Yellow Maize',
    'Roma Tomatoes'
  ]);
  const [signupLoading, setSignupLoading] = useState(false);

  const buyerUsers = users.filter(u => u.role === 'BUYER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      loginWithCredentials(loginEmail, loginPassword, 'BUYER');
      setLoginLoading(false);
    }, 400);
  };

  const handleQuickSelectUser = (userId: string) => {
    setCurrentUserById(userId);
    closeAuth();
  };

  const toggleCommodity = (item: string) => {
    setSelectedCommodities(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: repName || 'Procurement Director',
          businessName: companyName || 'Commercial Foods & Agro Ltd',
          email: email || 'procurement@company.ng',
          phone: phone || '+234 803 000 1122',
          state,
          lga,
          address: address || `${state} Commercial Zone`,
          walletBalance: 2500000,
          escrowBalance: 0,
        },
        'BUYER'
      );
      setSignupLoading(false);
    }, 400);
  };

  // Exit stats
  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id);
  const activeBuyerOrders = buyerOrders.filter(o => !['SETTLED', 'CANCELLED', 'REFUNDED'].includes(o.status));
  const escrowSecured = activeBuyerOrders.reduce((sum, o) => sum + (o.escrowAmountNGN || o.totalAmountNGN || 0), 0) || currentUser.escrowBalance || 1850000;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
      {/* Top Banner with Buyer Identity */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  Client Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Institutional Buyers
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Buyers & Food Processors Hub
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
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up / Onboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'exit'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
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
        {/* ======================= VIEW 1: BUYER LOGIN ======================= */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Sign in to Buyer Portal</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access verified commodity supply pipelines, escrow settlements, and direct farm contracts.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Corporate Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="e.g. procurement@lagosfoods.ng or 08031112233"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Account Password / Security PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to registered email with SMS OTP confirmation.')}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Remember this device (30 days)</span>
                  </label>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2FA Protected
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <span>Authenticating Buyer...</span>
                  ) : (
                    <>
                      <span>Sign In to Buyer Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>New institutional or FMCG buyer?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Create Buyer Account →
                </button>
              </div>
            </div>

            {/* Quick Demo Buyer Accounts */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Instant Demo Buyer Profiles
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Select a verified demo buyer to immediately enter the buyer marketplace with preloaded orders & escrow funds:
                </p>

                <div className="space-y-2.5">
                  {buyerUsers.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleQuickSelectUser(b.id)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={b.avatar}
                          alt={b.name}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                            {b.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {b.businessName} · {b.state}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold font-mono">
                            ₦{(b.walletBalance || 0).toLocaleString()} Wallet · Tier 2 Verified
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Escrow held with Central Bank regulated vault</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Moisture & Brix quality inspection before release</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VIEW 2: BUYER SIGN-UP / ONBOARDING ======================= */}
        {activeTab === 'signup' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Institutional Buyer Registration</h2>
              <p className="text-xs text-slate-500 mt-1">
                Register your food processing facility, retail chain, or commodity export firm for bulk direct sourcing.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Entity Registered Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Dangote Agro Processing Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CAC Registration Number (RC / BN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cacNumber}
                    onChange={e => setCacNumber(e.target.value)}
                    placeholder="e.g. RC 892014"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Authorized Procurement Officer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={repName}
                    onChange={e => setRepName(e.target.value)}
                    placeholder="e.g. Chinedu Okafor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="procurement@company.com.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Buyer Classification *
                  </label>
                  <select
                    value={buyerType}
                    onChange={e => setBuyerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none bg-white"
                  >
                    <option value="PROCESSOR">Food & Grain Processor / Mill</option>
                    <option value="SUPERMARKET">Supermarket / Retail Chain</option>
                    <option value="WHOLESALER">National Commodity Wholesaler</option>
                    <option value="EXPORTER">Agricultural Commodity Exporter</option>
                    <option value="HOTEL_RESTAURANT">Hotel, Restaurant & Institutional (HORECA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Delivery Hub State *
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none bg-white"
                  >
                    <option value="Lagos">Lagos State</option>
                    <option value="Kano">Kano State</option>
                    <option value="Ogun">Ogun State</option>
                    <option value="Kaduna">Kaduna State</option>
                    <option value="Oyo">Oyo State</option>
                    <option value="Rivers">Rivers State</option>
                    <option value="FCT Abuja">FCT Abuja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Monthly Procurement (NGN)
                  </label>
                  <select
                    value={monthlyBudget}
                    onChange={e => setMonthlyBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none bg-white font-mono"
                  >
                    <option value="10000000">₦ 10,000,000 / month (Tier 1)</option>
                    <option value="50000000">₦ 50,000,000 / month (Tier 2)</option>
                    <option value="200000000">₦ 200,000,000+ / month (Enterprise)</option>
                  </select>
                </div>
              </div>

              {/* Target Commodities Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Sourcing Commodities
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Soybeans',
                    'Yellow Maize',
                    'White Maize',
                    'Roma Tomatoes',
                    'Dry Ginger',
                    'Sesame Seeds',
                    'Cassava Chips',
                    'Sorghum',
                    'Palm Oil',
                    'Paddy Rice'
                  ].map(c => {
                    const isSelected = selectedCommodities.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCommodity(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">Enterprise Trust Verification:</span> Upon sign-up, your organization receives instant Sandbox access. Uploading your CAC certificate in the KYC tab unlocks ₦100M+ escrow trading capacity.
                </div>
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {signupLoading ? (
                  <span>Registering Organization...</span>
                ) : (
                  <>
                    <span>Complete Buyer Registration & Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================= VIEW 3: BUYER EXIT PAGE ======================= */}
        {activeTab === 'exit' && (
          <div className="text-center max-w-xl mx-auto py-4">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-700" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Procurement Session Safely Closed
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              Thank you for trading with FarmPot
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Your buyer corporate session for <span className="font-semibold text-slate-800">{sessionSummary?.businessName || currentUser.businessName || 'Lagos Fresh Processing'}</span> has been signed off securely.
            </p>

            {/* Session Summary Card */}
            <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                Session Audit Snapshot
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Active Escrow Safeguarded</div>
                  <div className="font-bold text-emerald-700 font-mono text-sm">
                    ₦{escrowSecured.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Procurement Orders in Pipeline</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    {activeBuyerOrders.length || 2} Orders
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Available Wallet Balance</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    ₦{(currentUser.walletBalance || 4850000).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Sign-Off Security Status</div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All Contracts Locked
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log Back In as Buyer</span>
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
                    onClick={() => onSwitchClient('FARMER')}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Farmers Portal
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => onSwitchClient('TRANSPORTER')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Transporters Portal
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
