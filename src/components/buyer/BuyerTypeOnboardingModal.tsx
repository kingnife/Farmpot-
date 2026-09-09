import React, { useState } from 'react';
import {
  User as UserIcon,
  Building2,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  FileText,
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  BuyerCategoryType,
  PersonalPurchasePurpose,
  BusinessPurchasePurpose,
  BusinessPurchasingFrequency,
  OrganizationType,
  OrganizationPurchasePurpose,
  User
} from '../../types';
import { NIGERIAN_STATES, NIGERIAN_LGAS_BY_STATE } from '../../data/nigeriaGeography';
import { Dropdown } from '../common/Dropdown';

interface BuyerTypeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: BuyerCategoryType;
  mode?: 'onboarding' | 'edit';
}

export const BuyerTypeOnboardingModal: React.FC<BuyerTypeOnboardingModalProps> = ({
  isOpen,
  onClose,
  initialType,
  mode = 'onboarding'
}) => {
  const { currentUser, updateUserProfile, showToast, users } = useApp();

  // Step 1 = Select Buyer Category; Step 2 = Fill Specific Form
  const [step, setStep] = useState<1 | 2>(mode === 'edit' && initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<BuyerCategoryType | null>(
    initialType || (currentUser?.buyerTypeCategory as BuyerCategoryType) || null
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Personal Buyer Form Fields
  const [personalFullName, setPersonalFullName] = useState(
    currentUser?.name || ''
  );
  const [personalPhone, setPersonalPhone] = useState(
    currentUser?.phone || ''
  );
  const [personalEmail, setPersonalEmail] = useState(
    currentUser?.email || ''
  );
  const [personalAddress, setPersonalAddress] = useState(
    currentUser?.deliveryAddress || currentUser?.address || ''
  );
  const [personalState, setPersonalState] = useState(
    currentUser?.state || 'Lagos'
  );
  const [personalLga, setPersonalLga] = useState(
    currentUser?.lga || 'Eti-Osa'
  );
  const [personalPaymentMethod, setPersonalPaymentMethod] = useState<string>(
    currentUser?.preferredPaymentMethod || 'Card'
  );
  const [personalPurpose, setPersonalPurpose] = useState<PersonalPurchasePurpose>(
    (currentUser?.personalPurchasePurpose as PersonalPurchasePurpose) || 'Household consumption'
  );
  const [personalTargetItems, setPersonalTargetItems] = useState<string[]>([
    'Tomatoes',
    'Rice',
    'Peppers',
    'Yam Tubers'
  ]);

  // Business Buyer Form Fields
  const [businessName, setBusinessName] = useState(
    currentUser?.businessName || ''
  );
  const [businessType, setBusinessType] = useState<string>(
    currentUser?.businessType || 'Food processing'
  );
  const [businessContactPerson, setBusinessContactPerson] = useState(
    currentUser?.businessContactPerson || currentUser?.name || ''
  );
  const [businessPhone, setBusinessPhone] = useState(
    currentUser?.businessPhone || currentUser?.phone || ''
  );
  const [businessEmail, setBusinessEmail] = useState(
    currentUser?.businessEmail || currentUser?.email || ''
  );
  const [businessState, setBusinessState] = useState(
    currentUser?.state || 'Lagos'
  );
  const [businessLga, setBusinessLga] = useState(
    currentUser?.lga || 'Ikeja'
  );
  const [businessAddress, setBusinessAddress] = useState(
    currentUser?.businessLocation || currentUser?.address || ''
  );
  const [businessPurpose, setBusinessPurpose] = useState<BusinessPurchasePurpose>(
    (currentUser?.businessPurchasePurpose as BusinessPurchasePurpose) || 'Food processing'
  );
  const [businessFrequency, setBusinessFrequency] = useState<BusinessPurchasingFrequency>(
    (currentUser?.purchasingFrequency as BusinessPurchasingFrequency) || 'Recurring'
  );
  const [businessCac, setBusinessCac] = useState(
    currentUser?.cacNumber || ''
  );
  const [businessBudget, setBusinessBudget] = useState<number>(
    currentUser?.monthlyProcurementBudgetNGN || 15000000
  );

  // Organization Buyer Form Fields
  const [orgName, setOrgName] = useState(
    currentUser?.organizationName || currentUser?.businessName || ''
  );
  const [orgType, setOrgType] = useState<OrganizationType>(
    (currentUser?.organizationType as OrganizationType) || 'Hospitals'
  );
  const [orgContactPerson, setOrgContactPerson] = useState(
    currentUser?.organizationContactPerson || currentUser?.name || ''
  );
  const [orgPhone, setOrgPhone] = useState(
    currentUser?.organizationPhone || currentUser?.phone || ''
  );
  const [orgEmail, setOrgEmail] = useState(
    currentUser?.organizationEmail || currentUser?.email || ''
  );
  const [orgState, setOrgState] = useState(
    currentUser?.state || 'FCT Abuja'
  );
  const [orgLga, setOrgLga] = useState(
    currentUser?.lga || 'Abuja Municipal'
  );
  const [orgAddress, setOrgAddress] = useState(
    currentUser?.organizationLocation || currentUser?.address || ''
  );
  const [orgRegNumber, setOrgRegNumber] = useState(
    currentUser?.organizationRegNumber || ''
  );
  const [orgPurpose, setOrgPurpose] = useState<OrganizationPurchasePurpose>(
    (currentUser?.organizationPurchasePurpose as OrganizationPurchasePurpose) || 'Institutional consumption'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStep1Continue = (typeOverride?: BuyerCategoryType) => {
    const targetType = typeOverride || selectedType;
    if (!targetType) {
      setErrorMessage('Please select the type of buyer you are.');
      return;
    }
    setErrorMessage('');
    setSelectedType(targetType);
    setStep(2);
  };

  const handleSaveBuyerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      setErrorMessage('Please select the type of buyer you are.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let updates: Partial<User> = {
        buyerTypeCategory: selectedType,
        buyer_type: selectedType,
        buyerClassificationCompleted: true,
      };

      if (selectedType === 'personal') {
        updates = {
          ...updates,
          name: personalFullName || currentUser.name,
          phone: personalPhone || currentUser.phone,
          email: personalEmail || currentUser.email,
          state: personalState,
          lga: personalLga,
          address: personalAddress,
          deliveryAddress: personalAddress,
          preferredLocation: `${personalState} (${personalLga})`,
          preferredPaymentMethod: personalPaymentMethod,
          personalPurchasePurpose: personalPurpose,
          businessName: 'Personal Household Account',
          buyerType: 'SUPERMARKET',
        };
      } else if (selectedType === 'business') {
        updates = {
          ...updates,
          businessName: businessName || currentUser.businessName || 'Commercial Agro Business',
          businessType,
          businessContactPerson: businessContactPerson || currentUser.name,
          name: businessContactPerson || currentUser.name,
          businessPhone: businessPhone || currentUser.phone,
          phone: businessPhone || currentUser.phone,
          businessEmail: businessEmail || currentUser.email,
          email: businessEmail || currentUser.email,
          state: businessState,
          lga: businessLga,
          address: businessAddress,
          businessLocation: businessAddress,
          businessPurchasePurpose: businessPurpose,
          purchasingFrequency: businessFrequency,
          cacNumber: businessCac,
          monthlyProcurementBudgetNGN: Number(businessBudget),
          buyerType: 'PROCESSOR',
        };
      } else if (selectedType === 'organization') {
        updates = {
          ...updates,
          organizationName: orgName || 'Institutional Organization',
          businessName: orgName || 'Institutional Organization',
          organizationType: orgType,
          organizationContactPerson: orgContactPerson || currentUser.name,
          name: orgContactPerson || currentUser.name,
          organizationPhone: orgPhone || currentUser.phone,
          phone: orgPhone || currentUser.phone,
          organizationEmail: orgEmail || currentUser.email,
          email: orgEmail || currentUser.email,
          state: orgState,
          lga: orgLga,
          address: orgAddress,
          organizationLocation: orgAddress,
          organizationRegNumber: orgRegNumber,
          organizationPurchasePurpose: orgPurpose,
          buyerType: 'HOTEL_RESTAURANT',
        };
      }

      updateUserProfile(currentUser.id, updates);
      setIsSubmitting(false);
      showToast(`Buyer type updated to ${selectedType.toUpperCase()}!`, 'success');
      onClose();
    }, 350);
  };

  return (
    <div
      id="buyer-type-onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="buyer-type-onboarding-card"
        className="w-full max-w-4xl bg-[#EAEAE2] rounded-3xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="bg-[#334E1B] text-white px-6 py-5 flex items-center justify-between border-b border-[#3F6B24]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDFFE0]/20 flex items-center justify-center text-[#EDFFE0] border border-[#EDFFE0]/30 font-bold">
              FP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#EDFFE0]">
                  FarmPot Buyer Identification
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDFFE0] text-[#334E1B]">
                  {step === 1 ? 'Step 1 of 2: Classification' : 'Step 2 of 2: Profile Details'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {step === 1 ? 'What type of buyer are you?' : 'Complete Your Buyer Information'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* ======================= STEP 1: CATEGORY SELECTION ======================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight">
                  What type of buyer are you?
                </h3>
                <p className="text-sm sm:text-base text-[#777777] mt-2 leading-relaxed">
                  Tell us how you plan to use FarmPot so we can give you the right buying experience.
                </p>
              </div>

              {/* Error Message if user attempts without selecting */}
              {errorMessage && (
                <div
                  id="buyer-type-error-banner"
                  className="max-w-md mx-auto p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-semibold animate-in shake duration-300"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 3 Classification Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {/* 1. PERSONAL BUYER */}
                <div
                  id="card-buyer-type-personal"
                  onClick={() => {
                    setSelectedType('personal');
                    setErrorMessage('');
                  }}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                    selectedType === 'personal'
                      ? 'border-[#334E1B] bg-gradient-to-b from-[#EDFFE0]/30 to-white ring-2 ring-[#334E1B]/20 shadow-md'
                      : 'border-stone-200 hover:border-[#3F6B24]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center font-bold text-xl shadow-xs">
                        👤
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedType === 'personal'
                            ? 'border-[#334E1B] bg-[#334E1B] text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {selectedType === 'personal' && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#3F6B24] uppercase tracking-wider block">
                      Personal Purchase
                    </span>
                    <h4 className="text-xl font-bold text-[#1F1F1F] mt-1">
                      Personal
                    </h4>
                    <p className="text-xs font-semibold text-[#334E1B] mt-0.5">
                      For yourself or your household
                    </p>

                    <blockquote className="mt-3 p-2.5 rounded-xl bg-stone-50 border-l-2 border-[#334E1B] text-[11px] text-[#777777] italic">
                      "I'm buying agricultural products for myself, my household, or personal use."
                    </blockquote>

                    <p className="text-xs text-[#777777] mt-3 leading-relaxed">
                      Buy agricultural products for personal consumption or everyday household needs like 5kg tomatoes, 10kg rice, or yam tubers.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStep1Continue('personal');
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedType === 'personal'
                          ? 'bg-[#334E1B] hover:bg-[#3F6B24] text-white shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200 text-[#1F1F1F]'
                      }`}
                    >
                      <span>Continue as Personal Buyer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. BUSINESS BUYER */}
                <div
                  id="card-buyer-type-business"
                  onClick={() => {
                    setSelectedType('business');
                    setErrorMessage('');
                  }}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                    selectedType === 'business'
                      ? 'border-[#334E1B] bg-gradient-to-b from-[#EDFFE0]/30 to-white ring-2 ring-[#334E1B]/20 shadow-md'
                      : 'border-stone-200 hover:border-[#3F6B24]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center font-bold text-xl shadow-xs">
                        🏢
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedType === 'business'
                            ? 'border-[#334E1B] bg-[#334E1B] text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {selectedType === 'business' && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#3F6B24] uppercase tracking-wider block">
                      Business Purchase
                    </span>
                    <h4 className="text-xl font-bold text-[#1F1F1F] mt-1">
                      Business
                    </h4>
                    <p className="text-xs font-semibold text-[#334E1B] mt-0.5">
                      For your business
                    </p>

                    <blockquote className="mt-3 p-2.5 rounded-xl bg-stone-50 border-l-2 border-[#334E1B] text-[11px] text-[#777777] italic">
                      "I'm buying agricultural products for a business or commercial operation."
                    </blockquote>

                    <p className="text-xs text-[#777777] mt-3 leading-relaxed">
                      Buy agricultural products for restaurants, retail, processing, hospitality, farming, or commercial supply contracts.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStep1Continue('business');
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedType === 'business'
                          ? 'bg-[#334E1B] hover:bg-[#3F6B24] text-white shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200 text-[#1F1F1F]'
                      }`}
                    >
                      <span>Continue as Business Buyer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. ORGANIZATION / INSTITUTION BUYER */}
                <div
                  id="card-buyer-type-organization"
                  onClick={() => {
                    setSelectedType('organization');
                    setErrorMessage('');
                  }}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                    selectedType === 'organization'
                      ? 'border-[#334E1B] bg-gradient-to-b from-[#EDFFE0]/30 to-white ring-2 ring-[#334E1B]/20 shadow-md'
                      : 'border-stone-200 hover:border-[#3F6B24]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center font-bold text-xl shadow-xs">
                        🏛️
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedType === 'organization'
                            ? 'border-[#334E1B] bg-[#334E1B] text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {selectedType === 'organization' && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#3F6B24] uppercase tracking-wider block">
                      Organization / Institution
                    </span>
                    <h4 className="text-xl font-bold text-[#1F1F1F] mt-1">
                      Organization
                    </h4>
                    <p className="text-xs font-semibold text-[#334E1B] mt-0.5">
                      For an organization or institution
                    </p>

                    <blockquote className="mt-3 p-2.5 rounded-xl bg-stone-50 border-l-2 border-[#334E1B] text-[11px] text-[#777777] italic">
                      "I'm purchasing agricultural products on behalf of an organization, institution, or group."
                    </blockquote>

                    <p className="text-xs text-[#777777] mt-3 leading-relaxed">
                      Buy agricultural products on behalf of schools, hospitals, NGOs, cooperatives, institutions, or registered groups.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStep1Continue('organization');
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedType === 'organization'
                          ? 'bg-[#334E1B] hover:bg-[#3F6B24] text-white shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200 text-[#1F1F1F]'
                      }`}
                    >
                      <span>Continue as Organization</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom primary continue bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-300">
                <div className="flex items-center gap-2 text-xs text-[#777777]">
                  <ShieldCheck className="w-4 h-4 text-[#3F6B24]" />
                  <span>You can update your buyer type anytime from your Profile Settings.</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleStep1Continue()}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Information Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================= STEP 2: TAILORED INFORMATION FORM ======================= */}
          {step === 2 && selectedType && (
            <form onSubmit={handleSaveBuyerProfile} className="space-y-6">
              {/* Back to Step 1 Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-300">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#334E1B] hover:text-[#3F6B24] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Buyer Classification</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#777777]">Selected category:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#EDFFE0] text-[#334E1B] border border-[#334E1B]/30">
                    {selectedType} Buyer
                  </span>
                </div>
              </div>

              {/* ----------------- SUB-FORM 1: PERSONAL BUYER ----------------- */}
              {selectedType === 'personal' && (
                <div className="space-y-6">
                  {/* Category Header & Quote */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <div className="flex items-center gap-2 text-[#334E1B] font-extrabold text-sm uppercase tracking-wide">
                      <span>👤 Personal Purchase</span>
                    </div>
                    <blockquote className="mt-1 text-xs sm:text-sm text-[#777777] italic">
                      "I'm buying agricultural products for myself, my household, or personal use."
                    </blockquote>
                    <p className="text-xs text-[#777777] mt-2">
                      Keep this simple! We only collect the essentials needed to deliver fresh produce to your doorstep.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider border-b border-stone-100 pb-2">
                      Personal Contact & Delivery
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={personalFullName}
                          onChange={e => setPersonalFullName(e.target.value)}
                          placeholder="e.g. Emeka Okafor"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Phone Number (for delivery coordination) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={personalPhone}
                          onChange={e => setPersonalPhone(e.target.value)}
                          placeholder="+234 802 000 1122"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={personalEmail}
                          onChange={e => setPersonalEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Preferred State *
                        </label>
                        <Dropdown
                          id="personal-state-dropdown"
                          options={NIGERIAN_STATES.map(st => ({ value: st, label: `${st} State` }))}
                          value={personalState}
                          onChange={val => {
                            setPersonalState(val);
                            const lgas = NIGERIAN_LGAS_BY_STATE[val] || ['Central'];
                            setPersonalLga(lgas[0] || 'Central');
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          LGA / Neighborhood *
                        </label>
                        <Dropdown
                          id="personal-lga-dropdown"
                          options={(NIGERIAN_LGAS_BY_STATE[personalState] || ['Central']).map(l => ({ value: l, label: l }))}
                          value={personalLga}
                          onChange={val => setPersonalLga(val)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Preferred Payment Method *
                        </label>
                        <Dropdown
                          id="personal-payment-dropdown"
                          options={[
                            { value: 'Card', label: 'Debit / Credit Card (Instant)' },
                            { value: 'Bank Transfer', label: 'Direct Bank Transfer / USSD' },
                            { value: 'Escrow Vault', label: 'FarmPot Secured Escrow Wallet' },
                            { value: 'Cash on Delivery', label: 'Pay on Delivery (Selected Hubs)' },
                          ]}
                          value={personalPaymentMethod}
                          onChange={val => setPersonalPaymentMethod(val)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                        Delivery Address (Home or Residence) *
                      </label>
                      <input
                        type="text"
                        required
                        value={personalAddress}
                        onChange={e => setPersonalAddress(e.target.value)}
                        placeholder="House / Apartment number, Street name, Landmark, City"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                      />
                    </div>
                  </div>

                  {/* Purpose of Purchase */}
                  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider border-b border-stone-100 pb-2">
                      Purchase Purpose
                    </h4>
                    <p className="text-xs text-[#777777]">
                      Select what describes your primary buying need:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        'Household consumption',
                        'Personal use',
                        'Event / occasion',
                        'Other'
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPersonalPurpose(item as PersonalPurchasePurpose)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                            personalPurpose === item
                              ? 'bg-[#EDFFE0] border-[#334E1B] text-[#334E1B] ring-2 ring-[#334E1B]/20'
                              : 'bg-stone-50 border-stone-200 text-[#777777] hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item}</span>
                            {personalPurpose === item && <CheckCircle2 className="w-3.5 h-3.5 text-[#334E1B]" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                        Frequent Grocery Items (e.g. 5kg tomatoes, 10kg rice, 1 basket peppers, 2 yam tubers)
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[
                          '5 kg Roma Tomatoes',
                          '10 kg Parboiled Rice',
                          '1 Basket Peppers (Rodo)',
                          '2 Tubers Yam',
                          '5 kg Irish Potatoes',
                          '1 Crate Fresh Eggs'
                        ].map((sample) => (
                          <span
                            key={sample}
                            className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-[11px] font-semibold text-[#334E1B]"
                          >
                            🛒 {sample}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-FORM 2: BUSINESS BUYER ----------------- */}
              {selectedType === 'business' && (
                <div className="space-y-6">
                  {/* Category Header & Quote */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <div className="flex items-center gap-2 text-[#334E1B] font-extrabold text-sm uppercase tracking-wide">
                      <span>🏢 Business Purchase</span>
                    </div>
                    <blockquote className="mt-1 text-xs sm:text-sm text-[#777777] italic">
                      "I'm buying agricultural products for a business or commercial operation."
                    </blockquote>
                    <p className="text-xs text-[#777777] mt-2">
                      Connect directly with commercial farms, receive VAT/commercial invoices, and schedule recurring supply contracts.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider border-b border-stone-100 pb-2">
                      Business & Commercial Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Registered Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          placeholder="e.g. Tasty Table Foods Ltd / Sunrise Cafe"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Business Type *
                        </label>
                        <Dropdown
                          id="business-type-dropdown"
                          options={[
                            { value: 'Restaurant / Food service', label: 'Restaurant / Food service / Catering' },
                            { value: 'Retail / Reselling', label: 'Retail / Supermarket / Reselling' },
                            { value: 'Food processing', label: 'Industrial Food Processing Company' },
                            { value: 'Manufacturing', label: 'Agro-Manufacturing / Feed Mill' },
                            { value: 'Hospitality', label: 'Hospitality / Hotel Chain' },
                            { value: 'Agriculture / Farming', label: 'Agriculture / Seed & Agro-Dealer' },
                            { value: 'Export', label: 'Commodity Export Trading House' },
                            { value: 'Other', label: 'Other Commercial Enterprise' },
                          ]}
                          value={businessType}
                          onChange={val => setBusinessType(val)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Primary Contact Person *
                        </label>
                        <input
                          type="text"
                          required
                          value={businessContactPerson}
                          onChange={e => setBusinessContactPerson(e.target.value)}
                          placeholder="e.g. Amina Bello (Procurement Head)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Business Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={businessPhone}
                          onChange={e => setBusinessPhone(e.target.value)}
                          placeholder="+234 803 111 2233"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Official Business Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={businessEmail}
                          onChange={e => setBusinessEmail(e.target.value)}
                          placeholder="procurement@company.ng"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          CAC Registration Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={businessCac}
                          onChange={e => setBusinessCac(e.target.value)}
                          placeholder="RC-123456 or BN-987654"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Operating State *
                        </label>
                        <Dropdown
                          id="business-state-dropdown"
                          options={NIGERIAN_STATES.map(st => ({ value: st, label: `${st} State` }))}
                          value={businessState}
                          onChange={val => {
                            setBusinessState(val);
                            const lgas = NIGERIAN_LGAS_BY_STATE[val] || ['Central'];
                            setBusinessLga(lgas[0] || 'Central');
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          LGA / Commercial Hub *
                        </label>
                        <Dropdown
                          id="business-lga-dropdown"
                          options={(NIGERIAN_LGAS_BY_STATE[businessState] || ['Central']).map(l => ({ value: l, label: l }))}
                          value={businessLga}
                          onChange={val => setBusinessLga(val)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                        Business Location / Warehouse Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessAddress}
                        onChange={e => setBusinessAddress(e.target.value)}
                        placeholder="Plot number, Industrial Area / Street, Commercial Hub, City"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                      />
                    </div>
                  </div>

                  {/* Purchase Purpose & Purchasing Characteristics */}
                  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider border-b border-stone-100 pb-2 mb-2">
                        Purchase Purpose
                      </h4>
                      <p className="text-xs text-[#777777] mb-3">
                        Select your business purchase purpose:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          'Restaurant / Food service',
                          'Retail / Reselling',
                          'Food processing',
                          'Manufacturing',
                          'Hospitality',
                          'Agriculture / Farming',
                          'Export',
                          'Other'
                        ].map((purpose) => (
                          <button
                            key={purpose}
                            type="button"
                            onClick={() => setBusinessPurpose(purpose as BusinessPurchasePurpose)}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-left cursor-pointer ${
                              businessPurpose === purpose
                                ? 'bg-[#EDFFE0] border-[#334E1B] text-[#334E1B] ring-2 ring-[#334E1B]/20'
                                : 'bg-stone-50 border-stone-200 text-[#777777] hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{purpose}</span>
                              {businessPurpose === purpose && <CheckCircle2 className="w-3 h-3 text-[#334E1B] shrink-0" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
                        Business Purchasing Characteristics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'One-time', label: 'One-time Purchases', desc: 'Ad-hoc spot orders' },
                          { id: 'Occasional', label: 'Occasional', desc: 'As supply dictates' },
                          { id: 'Recurring', label: 'Recurring', desc: 'Weekly/Monthly schedule' },
                          { id: 'Bulk purchases', label: 'Bulk Purchases', desc: 'Metric Tons (MT)' },
                        ].map((freq) => (
                          <button
                            key={freq.id}
                            type="button"
                            onClick={() => setBusinessFrequency(freq.id as BusinessPurchasingFrequency)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              businessFrequency === freq.id
                                ? 'bg-[#EDFFE0] border-[#334E1B] text-[#334E1B] ring-2 ring-[#334E1B]/20'
                                : 'bg-stone-50 border-stone-200 text-[#777777] hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1F1F1F]">{freq.label}</span>
                              {businessFrequency === freq.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#334E1B]" />}
                            </div>
                            <span className="text-[10px] text-[#777777] block mt-0.5">{freq.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-FORM 3: ORGANIZATION BUYER ----------------- */}
              {selectedType === 'organization' && (
                <div className="space-y-6">
                  {/* Category Header & Quote */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <div className="flex items-center gap-2 text-[#334E1B] font-extrabold text-sm uppercase tracking-wide">
                      <span>🏛️ Organization / Institution Purchase</span>
                    </div>
                    <blockquote className="mt-1 text-xs sm:text-sm text-[#777777] italic">
                      "I'm purchasing agricultural products on behalf of an organization, institution, or group."
                    </blockquote>
                    <p className="text-xs text-[#777777] mt-2">
                      Designed for schools, hospitals, NGOs, cooperatives, and government bodies needing institutional procurement verification and audit trails.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider border-b border-stone-100 pb-2">
                      Organization & Institution Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={orgName}
                          onChange={e => setOrgName(e.target.value)}
                          placeholder="e.g. St. Jude Hospital / Green Hope NGO"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Organization Type *
                        </label>
                        <Dropdown
                          id="org-type-dropdown"
                          options={[
                            { value: 'Schools', label: 'Schools / Colleges / Universities' },
                            { value: 'Hospitals', label: 'Hospitals / Healthcare Facilities' },
                            { value: 'Hotels', label: 'Hotels / Institutional Hostels' },
                            { value: 'NGOs', label: 'NGOs / Humanitarian Relief Bodies' },
                            { value: 'Government institutions', label: 'Government Institutions / Agencies' },
                            { value: 'Cooperatives', label: 'Cooperatives / Consumer Associations' },
                            { value: 'Religious organizations', label: 'Religious Organizations / Missions' },
                            { value: 'Large associations', label: 'Large Associations / Unions' },
                            { value: 'Other registered organizations', label: 'Other Registered Organizations' },
                          ]}
                          value={orgType}
                          onChange={val => setOrgType(val as OrganizationType)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Official Contact Person *
                        </label>
                        <input
                          type="text"
                          required
                          value={orgContactPerson}
                          onChange={e => setOrgContactPerson(e.target.value)}
                          placeholder="e.g. Dr. Folake Adeleke (Director of Operations)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Official Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={orgPhone}
                          onChange={e => setOrgPhone(e.target.value)}
                          placeholder="+234 805 776 3311"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Official Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={orgEmail}
                          onChange={e => setOrgEmail(e.target.value)}
                          placeholder="procurement@organization.org.ng"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Registration / CAC / Charter Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={orgRegNumber}
                          onChange={e => setOrgRegNumber(e.target.value)}
                          placeholder="e.g. CAC/IT/NO/49182 or TIN"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          Organization State *
                        </label>
                        <Dropdown
                          id="org-state-dropdown"
                          options={NIGERIAN_STATES.map(st => ({ value: st, label: `${st} State` }))}
                          value={orgState}
                          onChange={val => {
                            setOrgState(val);
                            const lgas = NIGERIAN_LGAS_BY_STATE[val] || ['Central'];
                            setOrgLga(lgas[0] || 'Central');
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                          LGA / District *
                        </label>
                        <Dropdown
                          id="org-lga-dropdown"
                          options={(NIGERIAN_LGAS_BY_STATE[orgState] || ['Central']).map(l => ({ value: l, label: l }))}
                          value={orgLga}
                          onChange={val => setOrgLga(val)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                        Headquarters / Commissary Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={orgAddress}
                        onChange={e => setOrgAddress(e.target.value)}
                        placeholder="Campus / Facility address, Street, City"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#334E1B] text-xs font-medium outline-none bg-stone-50"
                      />
                    </div>
                  </div>

                  {/* Purchase Purpose */}
                  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider border-b border-stone-100 pb-2">
                      Purchase Purpose
                    </h4>
                    <p className="text-xs text-[#777777]">
                      Select the primary objective for your institutional sourcing:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        'Food supply',
                        'Institutional consumption',
                        'Events',
                        'Community programs',
                        'Resale',
                        'Food processing',
                        'Other'
                      ].map((purp) => (
                        <button
                          key={purp}
                          type="button"
                          onClick={() => setOrgPurpose(purp as OrganizationPurchasePurpose)}
                          className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-left cursor-pointer ${
                            orgPurpose === purp
                              ? 'bg-[#EDFFE0] border-[#334E1B] text-[#334E1B] ring-2 ring-[#334E1B]/20'
                              : 'bg-stone-50 border-stone-200 text-[#777777] hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{purp}</span>
                            {orgPurpose === purp && <CheckCircle2 className="w-3 h-3 text-[#334E1B] shrink-0" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-300">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Back to Category Selection
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Profile...</span>
                  ) : (
                    <>
                      <span>Save & Enter Buyer Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
