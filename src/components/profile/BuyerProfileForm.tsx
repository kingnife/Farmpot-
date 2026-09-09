import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  PackageCheck,
  MapPin,
  Warehouse,
  Plus,
  X,
  Landmark,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  CreditCard,
  Briefcase,
  FileText
} from 'lucide-react';
import {
  User,
  BuyerCategoryType,
  PersonalPurchasePurpose,
  BusinessPurchasePurpose,
  BusinessPurchasingFrequency,
  OrganizationType,
  OrganizationPurchasePurpose
} from '../../types';
import { COMMODITY_SUGGESTIONS, NIGERIAN_BANKS, NIGERIAN_STATES, NIGERIAN_LGAS_BY_STATE } from '../../data/nigeriaGeography';
import { Dropdown } from '../common/Dropdown';

interface BuyerProfileFormProps {
  formData: Partial<User>;
  onChange: (updates: Partial<User>) => void;
}

export const BuyerProfileForm: React.FC<BuyerProfileFormProps> = ({ formData, onChange }) => {
  const currentCategory: BuyerCategoryType =
    (formData.buyerTypeCategory as BuyerCategoryType) ||
    (formData.buyer_type as BuyerCategoryType) ||
    'business';

  const [newCrop, setNewCrop] = useState('');
  const [newFacility, setNewFacility] = useState('');

  const targetCrops = formData.targetCrops || [];
  const facilityLocations = formData.facilityLocations || [];

  const addCrop = (cropName: string) => {
    const trimmed = cropName.trim();
    if (!trimmed || targetCrops.includes(trimmed)) return;
    onChange({ targetCrops: [...targetCrops, trimmed] });
    setNewCrop('');
  };

  const removeCrop = (cropToRemove: string) => {
    onChange({ targetCrops: targetCrops.filter(c => c !== cropToRemove) });
  };

  const addFacility = () => {
    const trimmed = newFacility.trim();
    if (!trimmed || facilityLocations.includes(trimmed)) return;
    onChange({ facilityLocations: [...facilityLocations, trimmed] });
    setNewFacility('');
  };

  const removeFacility = (loc: string) => {
    onChange({ facilityLocations: facilityLocations.filter(f => f !== loc) });
  };

  const handleCategorySwitch = (cat: BuyerCategoryType) => {
    onChange({
      buyerTypeCategory: cat,
      buyer_type: cat,
      buyerClassificationCompleted: true,
      ...(cat === 'personal'
        ? {
            businessName: formData.businessName || 'Personal Household Account',
            buyerType: 'SUPERMARKET'
          }
        : cat === 'business'
        ? {
            buyerType: 'PROCESSOR'
          }
        : {
            buyerType: 'HOTEL_RESTAURANT'
          })
    });
  };

  return (
    <div className="space-y-6">
      {/* ========================================================== */}
      {/* SECTION 1: BUYER CLASSIFICATION SELECTOR                   */}
      {/* ========================================================== */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#3F6B24] uppercase tracking-wider block">
              Buyer Category Identification
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#1F1F1F]">
              Buyer Classification & Purchase Type
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#EDFFE0] text-[#334E1B] border border-[#334E1B]/30">
            Current: {currentCategory}
          </span>
        </div>

        <p className="text-xs text-[#777777]">
          Select how you purchase on FarmPot. This changes the information requested and tailors your marketplace dashboard.
        </p>

        {/* The 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* 1. PERSONAL */}
          <button
            type="button"
            id="profile-select-personal-buyer"
            onClick={() => handleCategorySwitch('personal')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              currentCategory === 'personal'
                ? 'border-[#334E1B] bg-[#EDFFE0]/40 ring-2 ring-[#334E1B]/20'
                : 'border-stone-200 bg-stone-50 hover:border-[#3F6B24]/40 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👤</span>
                {currentCategory === 'personal' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#334E1B]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300" />
                )}
              </div>
              <div className="text-xs font-black text-[#1F1F1F]">Personal Purchase</div>
              <div className="text-[11px] font-semibold text-[#334E1B]">For yourself or household</div>
              <div className="text-[10px] text-[#777777] mt-1.5 line-clamp-2">
                Everyday family groceries (5kg tomatoes, 10kg rice, tubers, peppers).
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 text-[10px] font-bold text-[#334E1B]">
              {currentCategory === 'personal' ? '✓ Selected Category' : 'Click to Switch'}
            </div>
          </button>

          {/* 2. BUSINESS */}
          <button
            type="button"
            id="profile-select-business-buyer"
            onClick={() => handleCategorySwitch('business')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              currentCategory === 'business'
                ? 'border-[#334E1B] bg-[#EDFFE0]/40 ring-2 ring-[#334E1B]/20'
                : 'border-stone-200 bg-stone-50 hover:border-[#3F6B24]/40 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏢</span>
                {currentCategory === 'business' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#334E1B]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300" />
                )}
              </div>
              <div className="text-xs font-black text-[#1F1F1F]">Business Purchase</div>
              <div className="text-[11px] font-semibold text-[#334E1B]">For commercial business</div>
              <div className="text-[10px] text-[#777777] mt-1.5 line-clamp-2">
                Restaurants, food processors, retail chains, and commodity traders.
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 text-[10px] font-bold text-[#334E1B]">
              {currentCategory === 'business' ? '✓ Selected Category' : 'Click to Switch'}
            </div>
          </button>

          {/* 3. ORGANIZATION */}
          <button
            type="button"
            id="profile-select-org-buyer"
            onClick={() => handleCategorySwitch('organization')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              currentCategory === 'organization'
                ? 'border-[#334E1B] bg-[#EDFFE0]/40 ring-2 ring-[#334E1B]/20'
                : 'border-stone-200 bg-stone-50 hover:border-[#3F6B24]/40 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏛️</span>
                {currentCategory === 'organization' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#334E1B]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300" />
                )}
              </div>
              <div className="text-xs font-black text-[#1F1F1F]">Organization / Institution</div>
              <div className="text-[11px] font-semibold text-[#334E1B]">Schools, hospitals & NGOs</div>
              <div className="text-[10px] text-[#777777] mt-1.5 line-clamp-2">
                Bulk institutional supply, feeding programs, and audited procurement.
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 text-[10px] font-bold text-[#334E1B]">
              {currentCategory === 'organization' ? '✓ Selected Category' : 'Click to Switch'}
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 2: ADAPTIVE FIELDS ACCORDING TO BUYER CATEGORY     */}
      {/* ========================================================== */}

      {/* ----------------- IF PERSONAL BUYER ----------------- */}
      {currentCategory === 'personal' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <UserIcon className="w-4 h-4 text-[#334E1B]" />
              <span>Personal Buyer Details & Delivery Preferences</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block 4B, Admiralty Way, Lekki Phase 1"
                  value={formData.deliveryAddress || formData.address || ''}
                  onChange={e => onChange({ deliveryAddress: e.target.value, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Payment Method
                </label>
                <Dropdown
                  id="buyer-profile-personal-payment"
                  options={[
                    { value: 'Card', label: 'Debit / Credit Card (Instant)' },
                    { value: 'Bank Transfer', label: 'Direct Bank Transfer / USSD' },
                    { value: 'Escrow Vault', label: 'FarmPot Secured Escrow Wallet' },
                    { value: 'Cash on Delivery', label: 'Pay on Delivery (Selected Hubs)' },
                  ]}
                  value={formData.preferredPaymentMethod || 'Card'}
                  onChange={val => onChange({ preferredPaymentMethod: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Purchase Purpose
                </label>
                <Dropdown
                  id="buyer-profile-personal-purpose"
                  options={[
                    { value: 'Household consumption', label: 'Household consumption' },
                    { value: 'Personal use', label: 'Personal use' },
                    { value: 'Event / occasion', label: 'Event / occasion' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={formData.personalPurchasePurpose || 'Household consumption'}
                  onChange={val => onChange({ personalPurchasePurpose: val as PersonalPurchasePurpose })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Household Produce Budget (NGN ₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={formData.monthlyProcurementBudgetNGN ?? 150000}
                    onChange={e => onChange({ monthlyProcurementBudgetNGN: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- IF BUSINESS BUYER ----------------- */}
      {currentCategory === 'business' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-[#334E1B]" />
              <span>Commercial Sourcing Profile & Operations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Type
                </label>
                <Dropdown
                  id="buyer-profile-business-type"
                  options={[
                    { value: 'Restaurant / Food service', label: 'Restaurant / Food service' },
                    { value: 'Retail / Reselling', label: 'Retail / Supermarket / Reselling' },
                    { value: 'Food processing', label: 'Food processing Company' },
                    { value: 'Manufacturing', label: 'Manufacturing & Feed Mill' },
                    { value: 'Hospitality', label: 'Hospitality / Hotel Chain' },
                    { value: 'Agriculture / Farming', label: 'Agriculture / Farming Supplier' },
                    { value: 'Export', label: 'Agricultural Commodity Exporter' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={formData.businessType || 'Food processing'}
                  onChange={val => onChange({ businessType: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Purchase Purpose
                </label>
                <Dropdown
                  id="buyer-profile-biz-purpose"
                  options={[
                    { value: 'Restaurant / Food service', label: 'Restaurant / Food service' },
                    { value: 'Retail / Reselling', label: 'Retail / Reselling' },
                    { value: 'Food processing', label: 'Food processing' },
                    { value: 'Manufacturing', label: 'Manufacturing' },
                    { value: 'Hospitality', label: 'Hospitality' },
                    { value: 'Agriculture / Farming', label: 'Agriculture / Farming' },
                    { value: 'Export', label: 'Export' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={formData.businessPurchasePurpose || 'Food processing'}
                  onChange={val => onChange({ businessPurchasePurpose: val as BusinessPurchasePurpose })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Purchasing Frequency
                </label>
                <Dropdown
                  id="buyer-profile-frequency"
                  options={[
                    { value: 'One-time', label: 'One-time Purchases' },
                    { value: 'Occasional', label: 'Occasional' },
                    { value: 'Recurring', label: 'Recurring Scheduled Deliveries' },
                    { value: 'Bulk purchases', label: 'Bulk Purchases (MT)' },
                  ]}
                  value={formData.purchasingFrequency || 'Recurring'}
                  onChange={val => onChange({ purchasingFrequency: val as BusinessPurchasingFrequency })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Sourcing Budget (NGN ₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={formData.monthlyProcurementBudgetNGN ?? 25000000}
                    onChange={e => onChange({ monthlyProcurementBudgetNGN: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  CAC Registration Number (RC / BN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RC-782910"
                  value={formData.cacNumber || ''}
                  onChange={e => onChange({ cacNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Silo / Cold Warehouse Capacity (Metric Tonnes)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2500"
                  value={formData.storageWarehouseCapacityMT ?? 1000}
                  onChange={e => onChange({ storageWarehouseCapacityMT: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- IF ORGANIZATION BUYER ----------------- */}
      {currentCategory === 'organization' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Landmark className="w-4 h-4 text-[#334E1B]" />
              <span>Institutional & Organization Procurement Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Organization Type
                </label>
                <Dropdown
                  id="buyer-profile-org-type"
                  options={[
                    { value: 'Schools', label: 'Schools / Universities' },
                    { value: 'Hospitals', label: 'Hospitals / Healthcare Centers' },
                    { value: 'Hotels', label: 'Hotels / Institutional Hostels' },
                    { value: 'NGOs', label: 'NGOs / Humanitarian Relief' },
                    { value: 'Government institutions', label: 'Government Institutions' },
                    { value: 'Cooperatives', label: 'Cooperatives & Consumer Unions' },
                    { value: 'Religious organizations', label: 'Religious Organizations' },
                    { value: 'Large associations', label: 'Large Associations' },
                    { value: 'Other registered organizations', label: 'Other Registered Organizations' },
                  ]}
                  value={formData.organizationType || 'Hospitals'}
                  onChange={val => onChange({ organizationType: val as OrganizationType })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Institutional Purchase Purpose
                </label>
                <Dropdown
                  id="buyer-profile-org-purpose"
                  options={[
                    { value: 'Food supply', label: 'Food supply' },
                    { value: 'Institutional consumption', label: 'Institutional consumption' },
                    { value: 'Events', label: 'Events' },
                    { value: 'Community programs', label: 'Community programs' },
                    { value: 'Resale', label: 'Resale' },
                    { value: 'Food processing', label: 'Food processing' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={formData.organizationPurchasePurpose || 'Institutional consumption'}
                  onChange={val => onChange({ organizationPurchasePurpose: val as OrganizationPurchasePurpose })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Organization Registration / Charter Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. CAC/IT/NO/49182"
                  value={formData.organizationRegNumber || ''}
                  onChange={e => onChange({ organizationRegNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Institutional Procurement Budget (NGN ₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={formData.monthlyProcurementBudgetNGN ?? 18500000}
                    onChange={e => onChange({ monthlyProcurementBudgetNGN: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* SECTION 3: TARGET COMMODITIES CHECKLIST                    */}
      {/* ========================================================== */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <PackageCheck className="w-4 h-4 text-[#334E1B]" />
            <span>Target Commodities & Produce</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {targetCrops.length} selected
          </span>
        </div>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 rounded-xl bg-white border border-slate-200">
          {targetCrops.length === 0 && (
            <span className="text-xs text-slate-400 italic">No commodities added yet. Select from below or type custom.</span>
          )}
          {targetCrops.map(crop => (
            <span
              key={crop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EDFFE0] text-[#334E1B] text-xs font-semibold border border-[#334E1B]/30"
            >
              <span>{crop}</span>
              <button
                type="button"
                onClick={() => removeCrop(crop)}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add custom crop */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add custom commodity (e.g. Tomatoes, Yam, Rice, Soybeans)..."
            value={newCrop}
            onChange={e => setNewCrop(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCrop(newCrop);
              }
            }}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => addCrop(newCrop)}
            disabled={!newCrop.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-slate-500">Quick Add Recommendations:</div>
          <div className="flex flex-wrap gap-1.5">
            {COMMODITY_SUGGESTIONS.slice(0, 10).map(sug => {
              const isSelected = targetCrops.includes(sug);
              return (
                <button
                  key={sug}
                  type="button"
                  onClick={() => (isSelected ? removeCrop(sug) : addCrop(sug))}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#334E1B] text-white shadow-xs'
                      : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {isSelected ? `✓ ${sug}` : `+ ${sug}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 4: DELIVERY HUBS & WAREHOUSES                      */}
      {/* ========================================================== */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Warehouse className="w-4 h-4 text-[#334E1B]" />
            <span>Delivery Hubs, Commissaries & Drop-off Points</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {facilityLocations.length} active
          </span>
        </div>

        <div className="space-y-2">
          {facilityLocations.map((loc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#334E1B] flex-shrink-0" />
                <span>{loc}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFacility(loc)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="e.g. Warehouse 3, Idu Industrial Zone, Abuja or Home Residence"
              value={newFacility}
              onChange={e => setNewFacility(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFacility();
                }
              }}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
            />
            <button
              type="button"
              onClick={addFacility}
              disabled={!newFacility.trim()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 5: ESCROW SETTLEMENT BANK ACCOUNT                  */}
      {/* ========================================================== */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Landmark className="w-4 h-4 text-[#334E1B]" />
          <span>Billing, Escrow & Refund Settlement Account</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settlement Bank
            </label>
            <Dropdown
              id="buyer-profile-bank-dropdown"
              menuClassName="max-h-56"
              options={NIGERIAN_BANKS.map(bank => ({
                value: bank,
                label: bank,
              }))}
              value={formData.bankName || NIGERIAN_BANKS[0]}
              onChange={val => onChange({ bankName: val })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Account Number (NUBAN)
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="10-digit NUBAN"
              value={formData.bankAccountNumber || ''}
              onChange={e => onChange({ bankAccountNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Account Name (Verified)
            </label>
            <input
              type="text"
              placeholder="Account Name"
              value={formData.bankAccountName || ''}
              onChange={e => onChange({ bankAccountName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-[#334E1B] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
