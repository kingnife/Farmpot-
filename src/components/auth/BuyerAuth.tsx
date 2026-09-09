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
  DollarSign,
  User as UserIcon,
  ChevronLeft,
  Store,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  AuthPageView,
  BuyerCategoryType,
  PersonalPurchasePurpose,
  BusinessPurchasePurpose,
  BusinessPurchasingFrequency,
  OrganizationType,
  OrganizationPurchasePurpose
} from '../../types';
import { Dropdown } from '../common/Dropdown';
import { NIGERIAN_STATES, NIGERIAN_LGAS_BY_STATE } from '../../data/nigeriaGeography';

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

  // Sign up multi-step state
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [selectedBuyerType, setSelectedBuyerType] = useState<BuyerCategoryType | null>(null);
  const [buyerTypeError, setBuyerTypeError] = useState<string>('');
  const [signupLoading, setSignupLoading] = useState(false);

  // 1. Personal form state
  const [personalName, setPersonalName] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalAddress, setPersonalAddress] = useState('');
  const [personalState, setPersonalState] = useState('Lagos');
  const [personalLga, setPersonalLga] = useState('Ikeja');
  const [personalPaymentMethod, setPersonalPaymentMethod] = useState('Card');
  const [personalPurpose, setPersonalPurpose] = useState<PersonalPurchasePurpose>('Household consumption');

  // 2. Business form state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Food processing');
  const [businessContactPerson, setBusinessContactPerson] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessCac, setBusinessCac] = useState('');
  const [businessState, setBusinessState] = useState('Lagos');
  const [businessLga, setBusinessLga] = useState('Ikeja');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPurpose, setBusinessPurpose] = useState<BusinessPurchasePurpose>('Food processing');
  const [businessFrequency, setBusinessFrequency] = useState<BusinessPurchasingFrequency>('Recurring');
  const [businessBudget, setBusinessBudget] = useState('25000000');

  // 3. Organization form state
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<OrganizationType>('Hospitals');
  const [orgContactPerson, setOrgContactPerson] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgRegNumber, setOrgRegNumber] = useState('');
  const [orgState, setOrgState] = useState('Abuja (FCT)');
  const [orgLga, setOrgLga] = useState('Municipal Area Council');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgPurpose, setOrgPurpose] = useState<OrganizationPurchasePurpose>('Institutional consumption');

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

  const handleContinueFromCategorySelection = (explicitType?: BuyerCategoryType) => {
    const typeToUse = explicitType || selectedBuyerType;
    if (!typeToUse) {
      setBuyerTypeError('Please select the type of buyer you are.');
      return;
    }
    setSelectedBuyerType(typeToUse);
    setBuyerTypeError('');
    setSignupStep(2);
  };

  const handlePersonalSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: personalName || 'Personal Shopper',
          businessName: `${personalName || 'Personal'} Household Account`,
          email: personalEmail || 'shopper@farmpot.ng',
          phone: personalPhone || '+234 800 000 0000',
          state: personalState,
          lga: personalLga,
          address: personalAddress || `${personalState} Residence`,
          deliveryAddress: personalAddress || `${personalState} Residence`,
          buyerTypeCategory: 'personal',
          buyer_type: 'personal',
          buyerType: 'SUPERMARKET',
          buyerClassificationCompleted: true,
          preferredPaymentMethod: personalPaymentMethod,
          personalPurchasePurpose: personalPurpose,
          walletBalance: 150000,
          escrowBalance: 0,
        },
        'BUYER'
      );
      setSignupLoading(false);
    }, 400);
  };

  const handleBusinessSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: businessContactPerson || 'Procurement Director',
          businessName: businessName || 'Commercial Enterprise Ltd',
          email: businessEmail || 'procurement@business.ng',
          phone: businessPhone || '+234 803 000 1122',
          cacNumber: businessCac,
          businessType,
          businessPurchasePurpose: businessPurpose,
          purchasingFrequency: businessFrequency,
          monthlyProcurementBudgetNGN: Number(businessBudget) || 25000000,
          state: businessState,
          lga: businessLga,
          address: businessAddress || `${businessState} Commercial Corridor`,
          buyerTypeCategory: 'business',
          buyer_type: 'business',
          buyerType: 'PROCESSOR',
          buyerClassificationCompleted: true,
          walletBalance: 2500000,
          escrowBalance: 0,
        },
        'BUYER'
      );
      setSignupLoading(false);
    }, 400);
  };

  const handleOrgSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      signupWithRoleData(
        {
          name: orgContactPerson || 'Procurement Administrator',
          businessName: orgName || 'National Institution / NGO',
          organizationName: orgName || 'National Institution / NGO',
          organizationType: orgType,
          organizationRegNumber: orgRegNumber,
          organizationPurchasePurpose: orgPurpose,
          email: orgEmail || 'procurement@institution.org.ng',
          phone: orgPhone || '+234 802 000 3344',
          state: orgState,
          lga: orgLga,
          address: orgAddress || `${orgState} Central Facility`,
          buyerTypeCategory: 'organization',
          buyer_type: 'organization',
          buyerType: 'HOTEL_RESTAURANT',
          buyerClassificationCompleted: true,
          walletBalance: 5000000,
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      {/* Top Banner with FarmPot Buyer Identity */}
      <div className="bg-gradient-to-r from-[#1B2A10] via-[#2D4517] to-[#334E1B] p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#EDFFE0]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#EDFFE0]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#EDFFE0] text-[#334E1B]">
                  Role: Buyer
                </span>
                <span className="text-xs text-white/80 font-medium">FarmPot Marketplace Client</span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
                FarmPot Buyer Experience
              </h1>
            </div>
          </div>

          {/* Client quick switcher */}
          {onSwitchClient && (
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xs p-1 rounded-xl border border-white/10">
              <span className="text-[11px] text-white/70 px-2 font-medium">Switch Portal:</span>
              <button
                type="button"
                onClick={() => onSwitchClient('FARMER')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => onSwitchClient('TRANSPORTER')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Transporter
              </button>
              <button
                type="button"
                onClick={() => onSwitchClient('ADMIN')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 border-b border-white/15 pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'login'
                ? 'border-[#EDFFE0] text-[#EDFFE0]'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Buyer Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setSignupStep(1);
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'signup'
                ? 'border-[#EDFFE0] text-[#EDFFE0]'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register as Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exit')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'exit'
                ? 'border-[#EDFFE0] text-[#EDFFE0]'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Buyer Exit & Audit</span>
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* ======================= VIEW 1: BUYER LOGIN ======================= */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Login Credentials Form */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sign in to your Buyer Account</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access live farm listings, negotiate contracts, and manage escrow settlements.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="procurement@lagosfoods.ng"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Security Password
                    </label>
                    <span className="text-xs text-[#334E1B] hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#334E1B] focus:ring-[#334E1B] border-slate-300"
                    />
                    <span>Remember this device (30 days)</span>
                  </label>
                  <span className="text-[#334E1B] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2FA Protected
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md shadow-[#334E1B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                <span>New buyer on FarmPot?</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setSignupStep(1);
                  }}
                  className="font-bold text-[#334E1B] hover:text-[#3F6B24] cursor-pointer"
                >
                  Choose Buyer Category & Sign Up →
                </button>
              </div>
            </div>

            {/* Quick Demo Buyer Accounts */}
            <div className="lg:col-span-5 bg-stone-50 rounded-xl p-5 border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#334E1B]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Instant Demo Buyer Profiles
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Select a pre-classified demo buyer to test Personal, Business, or Organization features:
                </p>

                <div className="space-y-2.5">
                  {buyerUsers.map(b => {
                    const cat: BuyerCategoryType =
                      (b.buyerTypeCategory as BuyerCategoryType) ||
                      (b.buyer_type as BuyerCategoryType) ||
                      'business';

                    const badgeColor =
                      cat === 'personal'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : cat === 'business'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-purple-50 text-purple-800 border-purple-200';

                    const categoryTitle =
                      cat === 'personal'
                        ? 'Personal Buyer'
                        : cat === 'business'
                        ? 'Business Buyer'
                        : 'Organization Buyer';

                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleQuickSelectUser(b.id)}
                        className="w-full p-3 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={b.avatar}
                            alt={b.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#334E1B]/30"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
                                {b.name}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                {categoryTitle}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {b.businessName} · {b.state}
                            </div>
                            <div className="text-[10px] text-[#334E1B] font-semibold font-mono">
                              ₦{(b.walletBalance || 0).toLocaleString()} Wallet · Escrow Active
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#334E1B] transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] text-slate-500">
                <div className="font-semibold text-slate-700 mb-1">FarmPot Escrow Guarantee</div>
                All buyer funds remain in custody until physical delivery inspection is confirmed.
              </div>
            </div>
          </div>
        )}

        {/* ======================= VIEW 2: BUYER REGISTRATION (2-STEP) ======================= */}
        {activeTab === 'signup' && (
          <div>
            {/* STEP 1: CATEGORY SELECTION */}
            {signupStep === 1 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#EDFFE0] text-[#334E1B] border border-[#334E1B]/30">
                    Step 1 of 2 · Buyer Type Identification
                  </span>
                  <h2 className="text-2xl font-black text-[#1F1F1F] mt-3">
                    What type of buyer are you?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#777777] mt-1.5">
                    Tell us how you plan to use FarmPot so we can give you the right buying experience.
                  </p>
                </div>

                {buyerTypeError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{buyerTypeError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Personal */}
                  <div
                    onClick={() => {
                      setSelectedBuyerType('personal');
                      setBuyerTypeError('');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedBuyerType === 'personal'
                        ? 'border-[#334E1B] bg-[#EDFFE0]/40 ring-4 ring-[#334E1B]/15 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-[#3F6B24]/40 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">
                          👤
                        </div>
                        {selectedBuyerType === 'personal' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#334E1B]" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-stone-300" />
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-[#1F1F1F]">Personal Purchase</div>
                      <div className="text-xs font-semibold text-[#334E1B] mt-0.5">
                        For yourself or your household
                      </div>
                      <blockquote className="text-[11px] text-[#444444] italic border-l-2 border-[#334E1B]/40 pl-2 my-2.5">
                        "I'm buying agricultural products for myself, my household, or personal use."
                      </blockquote>
                      <p className="text-xs text-[#777777]">
                        Buy agricultural products for personal consumption or everyday household needs.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinueFromCategorySelection('personal');
                      }}
                      className="mt-4 w-full py-2.5 px-3 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Continue as Personal Buyer →
                    </button>
                  </div>

                  {/* Card 2: Business */}
                  <div
                    onClick={() => {
                      setSelectedBuyerType('business');
                      setBuyerTypeError('');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedBuyerType === 'business'
                        ? 'border-[#334E1B] bg-[#EDFFE0]/40 ring-4 ring-[#334E1B]/15 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-[#3F6B24]/40 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold">
                          🏢
                        </div>
                        {selectedBuyerType === 'business' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#334E1B]" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-stone-300" />
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-[#1F1F1F]">Business Purchase</div>
                      <div className="text-xs font-semibold text-[#334E1B] mt-0.5">
                        For your business
                      </div>
                      <blockquote className="text-[11px] text-[#444444] italic border-l-2 border-[#334E1B]/40 pl-2 my-2.5">
                        "I'm buying agricultural products for a business or commercial operation."
                      </blockquote>
                      <p className="text-xs text-[#777777]">
                        Buy agricultural products for restaurants, retail, processing, hospitality, farming, or other commercial activities.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinueFromCategorySelection('business');
                      }}
                      className="mt-4 w-full py-2.5 px-3 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Continue as Business Buyer →
                    </button>
                  </div>

                  {/* Card 3: Organization */}
                  <div
                    onClick={() => {
                      setSelectedBuyerType('organization');
                      setBuyerTypeError('');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedBuyerType === 'organization'
                        ? 'border-[#334E1B] bg-[#EDFFE0]/40 ring-4 ring-[#334E1B]/15 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-[#3F6B24]/40 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl font-bold">
                          🏛️
                        </div>
                        {selectedBuyerType === 'organization' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#334E1B]" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-stone-300" />
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-[#1F1F1F]">Organization / Institution</div>
                      <div className="text-xs font-semibold text-[#334E1B] mt-0.5">
                        For an organization or institution
                      </div>
                      <blockquote className="text-[11px] text-[#444444] italic border-l-2 border-[#334E1B]/40 pl-2 my-2.5">
                        "I'm purchasing agricultural products on behalf of an organization, institution, or group."
                      </blockquote>
                      <p className="text-xs text-[#777777]">
                        Buy agricultural products on behalf of schools, hospitals, NGOs, cooperatives, institutions, or other organizations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinueFromCategorySelection('organization');
                      }}
                      className="mt-4 w-full py-2.5 px-3 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Continue as Organization →
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => handleContinueFromCategorySelection()}
                    className="py-2.5 px-6 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold shadow-md shadow-[#334E1B]/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Proceed to Information Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: INFORMATION COLLECTION */}
            {signupStep === 2 && selectedBuyerType && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="text-xs font-bold text-[#334E1B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Change Buyer Type</span>
                  </button>

                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#EDFFE0] text-[#334E1B] border border-[#334E1B]/30">
                    Category: {selectedBuyerType}
                  </span>
                </div>

                {/* --- 1. PERSONAL FORM --- */}
                {selectedBuyerType === 'personal' && (
                  <div>
                    <div className="mb-5">
                      <h2 className="text-xl font-bold text-slate-900">Personal Purchase Registration</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        "I'm buying agricultural products for myself, my household, or personal use."
                      </p>
                    </div>

                    <form onSubmit={handlePersonalSignup} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={personalName}
                            onChange={e => setPersonalName(e.target.value)}
                            placeholder="e.g. Emeka Okafor"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={personalPhone}
                            onChange={e => setPersonalPhone(e.target.value)}
                            placeholder="+234 803 000 0000"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={personalEmail}
                            onChange={e => setPersonalEmail(e.target.value)}
                            placeholder="emeka@gmail.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Delivery Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={personalAddress}
                            onChange={e => setPersonalAddress(e.target.value)}
                            placeholder="e.g. Block 4, Victoria Island, Lagos"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Preferred State
                          </label>
                          <Dropdown
                            id="buyer-auth-personal-state"
                            options={NIGERIAN_STATES.map(s => ({ value: s, label: s }))}
                            value={personalState}
                            onChange={val => {
                              setPersonalState(val);
                              setPersonalLga((NIGERIAN_LGAS_BY_STATE[val] || [])[0] || '');
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Local Government Area (LGA)
                          </label>
                          <Dropdown
                            id="buyer-auth-personal-lga"
                            options={(NIGERIAN_LGAS_BY_STATE[personalState] || ['Central']).map(l => ({ value: l, label: l }))}
                            value={personalLga}
                            onChange={val => setPersonalLga(val)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Preferred Payment Method
                          </label>
                          <Dropdown
                            id="buyer-auth-personal-payment"
                            options={[
                              { value: 'Card', label: 'Debit / Credit Card' },
                              { value: 'Bank Transfer', label: 'Bank Transfer' },
                              { value: 'Escrow Vault', label: 'Escrow Vault' },
                              { value: 'Cash on Delivery', label: 'Cash on Delivery' },
                            ]}
                            value={personalPaymentMethod}
                            onChange={val => setPersonalPaymentMethod(val)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Purchase Purpose
                          </label>
                          <Dropdown
                            id="buyer-auth-personal-purpose"
                            options={[
                              { value: 'Household consumption', label: 'Household consumption' },
                              { value: 'Personal use', label: 'Personal use' },
                              { value: 'Event / occasion', label: 'Event / occasion' },
                              { value: 'Other', label: 'Other' },
                            ]}
                            value={personalPurpose}
                            onChange={val => setPersonalPurpose(val as PersonalPurchasePurpose)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md shadow-[#334E1B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                      >
                        {signupLoading ? (
                          <span>Setting up Personal Account...</span>
                        ) : (
                          <>
                            <span>Complete Registration & Enter Marketplace</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* --- 2. BUSINESS FORM --- */}
                {selectedBuyerType === 'business' && (
                  <div>
                    <div className="mb-5">
                      <h2 className="text-xl font-bold text-slate-900">Business Buyer Registration</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        "I'm buying agricultural products for a business or commercial operation."
                      </p>
                    </div>

                    <form onSubmit={handleBusinessSignup} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={businessName}
                            onChange={e => setBusinessName(e.target.value)}
                            placeholder="e.g. Lagos Fresh Processing Ltd"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Business Type *
                          </label>
                          <Dropdown
                            id="buyer-auth-biz-type"
                            options={[
                              { value: 'Restaurant / Food service', label: 'Restaurant / Food service' },
                              { value: 'Retail / Reselling', label: 'Retail / Supermarket / Reselling' },
                              { value: 'Food processing', label: 'Food processing' },
                              { value: 'Manufacturing', label: 'Manufacturing' },
                              { value: 'Hospitality', label: 'Hospitality' },
                              { value: 'Agriculture / Farming', label: 'Agriculture / Farming' },
                              { value: 'Export', label: 'Commodity Export' },
                              { value: 'Other', label: 'Other' },
                            ]}
                            value={businessType}
                            onChange={val => setBusinessType(val)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Contact Person *
                          </label>
                          <input
                            type="text"
                            required
                            value={businessContactPerson}
                            onChange={e => setBusinessContactPerson(e.target.value)}
                            placeholder="e.g. Funke Adeleke"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Business Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={businessPhone}
                            onChange={e => setBusinessPhone(e.target.value)}
                            placeholder="+234 803 000 1122"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Business Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={businessEmail}
                            onChange={e => setBusinessEmail(e.target.value)}
                            placeholder="procurement@lagosfoods.ng"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            CAC Number (RC/BN)
                          </label>
                          <input
                            type="text"
                            value={businessCac}
                            onChange={e => setBusinessCac(e.target.value)}
                            placeholder="e.g. RC 782910"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            State *
                          </label>
                          <Dropdown
                            id="buyer-auth-biz-state"
                            options={NIGERIAN_STATES.map(s => ({ value: s, label: s }))}
                            value={businessState}
                            onChange={val => {
                              setBusinessState(val);
                              setBusinessLga((NIGERIAN_LGAS_BY_STATE[val] || [])[0] || '');
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Local Government Area (LGA)
                          </label>
                          <Dropdown
                            id="buyer-auth-biz-lga"
                            options={(NIGERIAN_LGAS_BY_STATE[businessState] || ['Central']).map(l => ({ value: l, label: l }))}
                            value={businessLga}
                            onChange={val => setBusinessLga(val)}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Business Address / Warehouse *
                          </label>
                          <input
                            type="text"
                            required
                            value={businessAddress}
                            onChange={e => setBusinessAddress(e.target.value)}
                            placeholder="Plot 12, Industrial Scheme, Ikeja"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Purchase Purpose
                          </label>
                          <Dropdown
                            id="buyer-auth-biz-purpose"
                            options={[
                              { value: 'Food processing', label: 'Food processing' },
                              { value: 'Restaurant / Food service', label: 'Restaurant / Food service' },
                              { value: 'Retail / Reselling', label: 'Retail / Reselling' },
                              { value: 'Manufacturing', label: 'Manufacturing' },
                              { value: 'Export', label: 'Export' },
                              { value: 'Other', label: 'Other' },
                            ]}
                            value={businessPurpose}
                            onChange={val => setBusinessPurpose(val as BusinessPurchasePurpose)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Purchasing Frequency
                          </label>
                          <Dropdown
                            id="buyer-auth-biz-freq"
                            options={[
                              { value: 'One-time', label: 'One-time' },
                              { value: 'Occasional', label: 'Occasional' },
                              { value: 'Recurring', label: 'Recurring' },
                              { value: 'Bulk purchases', label: 'Bulk purchases' },
                            ]}
                            value={businessFrequency}
                            onChange={val => setBusinessFrequency(val as BusinessPurchasingFrequency)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md shadow-[#334E1B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                      >
                        {signupLoading ? (
                          <span>Setting up Business Account...</span>
                        ) : (
                          <>
                            <span>Complete Business Registration & Enter Workspace</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* --- 3. ORGANIZATION FORM --- */}
                {selectedBuyerType === 'organization' && (
                  <div>
                    <div className="mb-5">
                      <h2 className="text-xl font-bold text-slate-900">Organization / Institution Registration</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        "I'm purchasing agricultural products on behalf of an organization, institution, or group."
                      </p>
                    </div>

                    <form onSubmit={handleOrgSignup} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Organization Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)}
                            placeholder="e.g. St. Jude Healthcare & Educational Foundation"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Organization Type *
                          </label>
                          <Dropdown
                            id="buyer-auth-org-type"
                            options={[
                              { value: 'Schools', label: 'Schools / Universities' },
                              { value: 'Hospitals', label: 'Hospitals / Clinics' },
                              { value: 'Hotels', label: 'Hotels / Hostels' },
                              { value: 'NGOs', label: 'NGOs / Humanitarian Relief' },
                              { value: 'Government institutions', label: 'Government institutions' },
                              { value: 'Cooperatives', label: 'Cooperatives' },
                              { value: 'Religious organizations', label: 'Religious organizations' },
                              { value: 'Large associations', label: 'Large associations' },
                              { value: 'Other registered organizations', label: 'Other registered organizations' },
                            ]}
                            value={orgType}
                            onChange={val => setOrgType(val as OrganizationType)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Contact Person *
                          </label>
                          <input
                            type="text"
                            required
                            value={orgContactPerson}
                            onChange={e => setOrgContactPerson(e.target.value)}
                            placeholder="e.g. Dr. Folake Adeleke"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={orgPhone}
                            onChange={e => setOrgPhone(e.target.value)}
                            placeholder="+234 802 000 3344"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Official Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={orgEmail}
                            onChange={e => setOrgEmail(e.target.value)}
                            placeholder="procurement@stjudehealth.org.ng"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Registration / Identification (Optional)
                          </label>
                          <input
                            type="text"
                            value={orgRegNumber}
                            onChange={e => setOrgRegNumber(e.target.value)}
                            placeholder="e.g. CAC/IT/NO/49182"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            State *
                          </label>
                          <Dropdown
                            id="buyer-auth-org-state"
                            options={NIGERIAN_STATES.map(s => ({ value: s, label: s }))}
                            value={orgState}
                            onChange={val => {
                              setOrgState(val);
                              setOrgLga((NIGERIAN_LGAS_BY_STATE[val] || [])[0] || '');
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            LGA
                          </label>
                          <Dropdown
                            id="buyer-auth-org-lga"
                            options={(NIGERIAN_LGAS_BY_STATE[orgState] || ['Central']).map(l => ({ value: l, label: l }))}
                            value={orgLga}
                            onChange={val => setOrgLga(val)}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Facility / Commissary Delivery Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={orgAddress}
                            onChange={e => setOrgAddress(e.target.value)}
                            placeholder="Plot 402, Garki Hospital Road, Abuja"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334E1B] text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Purchase Purpose
                          </label>
                          <Dropdown
                            id="buyer-auth-org-purpose"
                            options={[
                              { value: 'Food supply', label: 'Food supply' },
                              { value: 'Institutional consumption', label: 'Institutional consumption' },
                              { value: 'Events', label: 'Events' },
                              { value: 'Community programs', label: 'Community programs' },
                              { value: 'Resale', label: 'Resale' },
                              { value: 'Food processing', label: 'Food processing' },
                              { value: 'Other', label: 'Other' },
                            ]}
                            value={orgPurpose}
                            onChange={val => setOrgPurpose(val as OrganizationPurchasePurpose)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md shadow-[#334E1B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                      >
                        {signupLoading ? (
                          <span>Setting up Organization Account...</span>
                        ) : (
                          <>
                            <span>Complete Organization Registration & Enter Workspace</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================= VIEW 3: BUYER EXIT PAGE ======================= */}
        {activeTab === 'exit' && (
          <div className="text-center max-w-xl mx-auto py-4">
            <div className="w-16 h-16 bg-[#EDFFE0] border-2 border-[#334E1B]/30 text-[#334E1B] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-[#334E1B]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#334E1B] bg-[#EDFFE0] px-2.5 py-1 rounded-full border border-[#334E1B]/20">
              Procurement Session Safely Closed
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              Thank you for trading with FarmPot
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Your buyer session for <span className="font-semibold text-slate-800">{sessionSummary?.businessName || currentUser.businessName || 'Lagos Fresh Processing'}</span> has been signed off securely.
            </p>

            {/* Session Summary Card */}
            <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                Session Audit Snapshot
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Active Escrow Safeguarded</div>
                  <div className="font-bold text-[#334E1B] font-mono text-sm">
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
                className="w-full py-3 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
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
