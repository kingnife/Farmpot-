import React, { useState } from 'react';
import {
  Sprout,
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
  Wheat,
  Tractor,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthPageView } from '../../types';

interface FarmerAuthProps {
  initialView?: AuthPageView;
  onSwitchClient?: (client: 'BUYER' | 'FARMER' | 'TRANSPORTER' | 'ADMIN') => void;
}

export const FarmerAuth: React.FC<FarmerAuthProps> = ({
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
    listings,
    orders,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthPageView>(initialView);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('08024445566');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign up form state
  const [farmerName, setFarmerName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cooperativeName, setCooperativeName] = useState('');
  const [state, setState] = useState('Kaduna');
  const [lga, setLga] = useState('Zaria');
  const [farmSizeHectares, setFarmSizeHectares] = useState('15');
  const [storageCapacityTons, setStorageCapacityTons] = useState('50');
  const [bankAccount, setBankAccount] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([
    'Yellow Maize',
    'Roma Tomatoes',
    'Soybeans'
  ]);
  const [signupLoading, setSignupLoading] = useState(false);

  const farmerUsers = users.filter(u => u.role === 'FARMER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      loginWithCredentials(loginIdentifier, loginPassword, 'FARMER');
      setLoginLoading(false);
    }, 400);
  };

  const handleQuickSelectUser = (userId: string) => {
    setCurrentUserById(userId);
    closeAuth();
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: farmerName || 'Alhaji Sani Bello',
          businessName: farmName || 'Bello Heritage Agro Ventures',
          phone: phone || '+234 802 000 3344',
          email: email || 'sani.bello@agro.ng',
          state,
          lga,
          address: `${lga} Farm Settlement Cluster, ${state} State`,
          walletBalance: 0,
          escrowBalance: 0,
        },
        'FARMER'
      );
      setSignupLoading(false);
    }, 400);
  };

  // Farmer metrics
  const farmerListings = listings.filter(l => l.farmerId === currentUser.id);
  const farmerOrders = orders.filter(o => o.supplierId === currentUser.id);
  const pendingFarmerPayout = farmerOrders
    .filter(o => !['SETTLED', 'CANCELLED', 'REFUNDED'].includes(o.status))
    .reduce((sum, o) => sum + (o.totalAmountNGN || 0), 0) || 1650000;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
      {/* Top Banner with Farmer Identity */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-amber-950 p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Client Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Producers & Cooperatives
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Farmers & Agro-Suppliers Portal
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
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Farmer Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Farm</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'exit'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
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
        {/* ======================= VIEW 1: FARMER LOGIN ======================= */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Sign in to Farmer Portal</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your harvest listings, view instant buyer demand requests, and withdraw verified escrow payouts.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 08024445566 or musa.farms@zaria-agro.ng"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Farm PIN / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('SMS PIN reminder sent to registered phone number.')}
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <span>Keep me logged in on this phone</span>
                  </label>
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SMS OTP Verified
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <span>Accessing Farmer Dashboard...</span>
                  ) : (
                    <>
                      <span>Sign In to Farmer Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>New grower or cooperative lead?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  Register Your Farm →
                </button>
              </div>
            </div>

            {/* Quick Demo Farmer Accounts */}
            <div className="lg:col-span-5 bg-amber-50/50 rounded-xl p-5 border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Instant Demo Farmer Profiles
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Select a verified demo farmer to inspect active produce listings, buyer negotiations, and payout vaults:
                </p>

                <div className="space-y-2.5">
                  {farmerUsers.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleQuickSelectUser(f.id)}
                      className="w-full p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-500 hover:bg-amber-50/70 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-300"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                            {f.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {f.businessName} · {f.state}
                          </div>
                          <div className="text-[10px] text-amber-800 font-semibold font-mono">
                            ₦{(f.walletBalance || 0).toLocaleString()} Balance · {f.verification.status}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Farmer Benefits Box */}
              <div className="mt-6 pt-4 border-t border-amber-200/80 text-[11px] text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Escrow upfront lock before harvest dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct bank / MoMo payout within 2 hours of confirmation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VIEW 2: FARMER REGISTRATION ======================= */}
        {activeTab === 'signup' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Farmer & Cooperative Enrollment</h2>
              <p className="text-xs text-slate-500 mt-1">
                List your agricultural harvest directly to certified industrial food processors and institutional off-takers across Nigeria.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Lead Farmer / Cooperative Rep Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={e => setFarmerName(e.target.value)}
                    placeholder="e.g. Alhaji Sani Bello"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Farm / Plantation / Outgrower Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={e => setFarmName(e.target.value)}
                    placeholder="e.g. Zaria Gold Agribusiness Cluster"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number (For Buyer Alerts) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 802 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cooperative Affiliation (Optional)
                  </label>
                  <input
                    type="text"
                    value={cooperativeName}
                    onChange={e => setCooperativeName(e.target.value)}
                    placeholder="e.g. All Farmers Association of Nigeria (AFAN)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Farm Location State *
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none bg-white"
                  >
                    <option value="Kaduna">Kaduna State</option>
                    <option value="Kano">Kano State</option>
                    <option value="Benue">Benue State</option>
                    <option value="Oyo">Oyo State</option>
                    <option value="Plateau">Plateau State</option>
                    <option value="Niger">Niger State</option>
                    <option value="Ogun">Ogun State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Local Government Area (LGA) *
                  </label>
                  <input
                    type="text"
                    required
                    value={lga}
                    onChange={e => setLga(e.target.value)}
                    placeholder="e.g. Zaria, Kura, Iseyin, Gboko"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Cultivated Area (Hectares)
                  </label>
                  <input
                    type="number"
                    value={farmSizeHectares}
                    onChange={e => setFarmSizeHectares(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Storage / Silo Capacity (Metric Tonnes)
                  </label>
                  <input
                    type="number"
                    value={storageCapacityTons}
                    onChange={e => setStorageCapacityTons(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              {/* Primary Harvest Crops */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Harvest Crops
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Yellow Maize',
                    'White Maize',
                    'Roma Tomatoes',
                    'Soybeans',
                    'Cassava Roots',
                    'Yam Tubers',
                    'Dry Split Ginger',
                    'Sesame Seeds',
                    'Sorghum',
                    'Paddy Rice'
                  ].map(c => {
                    const isSelected = selectedCrops.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCrop(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 text-amber-950 border-amber-500 font-bold'
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

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Tractor className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">FarmPot Field Agents:</span> Once enrolled, a local verification officer in your LGA can verify your farm coordinates to grant your profile the Verified Producer badge with 2x higher match ranking.
                </div>
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {signupLoading ? (
                  <span>Creating Farmer Profile...</span>
                ) : (
                  <>
                    <span>Complete Farm Registration & Publish First Listing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================= VIEW 3: FARMER EXIT PAGE ======================= */}
        {activeTab === 'exit' && (
          <div className="text-center max-w-xl mx-auto py-4">
            <div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wheat className="w-8 h-8 text-amber-700" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Farm Session Successfully Closed
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              May your harvest be bountiful
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Your farm manager session for <span className="font-semibold text-slate-800">{sessionSummary?.businessName || currentUser.businessName || 'Danladi Heritage Farms'}</span> has been signed off securely.
            </p>

            {/* Session Summary Card */}
            <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                Farm Produce & Escrow Summary
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Escrow Payouts in Queue</div>
                  <div className="font-bold text-amber-800 font-mono text-sm">
                    ₦{pendingFarmerPayout.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Active Live Listings</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    {farmerListings.length || 3} Commodities Listed
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Available Withdrawable Balance</div>
                  <div className="font-bold text-slate-800 font-mono text-sm">
                    ₦{(currentUser.walletBalance || 2340000).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">SMS Notification Alerts</div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active on registered SIM
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log Back In to Farm Portal</span>
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
                    onClick={() => onSwitchClient('TRANSPORTER')}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Transporters Hub
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
