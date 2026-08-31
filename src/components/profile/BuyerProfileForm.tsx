import React, { useState } from 'react';
import { Building2, DollarSign, PackageCheck, MapPin, Warehouse, Plus, X, Landmark, ShieldCheck } from 'lucide-react';
import { User } from '../../types';
import { COMMODITY_SUGGESTIONS, NIGERIAN_BANKS } from '../../data/nigeriaGeography';

interface BuyerProfileFormProps {
  formData: Partial<User>;
  onChange: (updates: Partial<User>) => void;
}

export const BuyerProfileForm: React.FC<BuyerProfileFormProps> = ({ formData, onChange }) => {
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

  return (
    <div className="space-y-6">
      {/* Sourcing Category & Budget */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>Procurement & Corporate Sourcing Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Buyer / Enterprise Type
            </label>
            <select
              value={formData.buyerType || 'PROCESSOR'}
              onChange={e => onChange({ buyerType: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="PROCESSOR">Industrial Food Processor & Mill</option>
              <option value="SUPERMARKET">Supermarket & Retail Grocery Chain</option>
              <option value="WHOLESALER">Wholesale Commodity Merchant</option>
              <option value="EXPORTER">Export Trading House</option>
              <option value="HOTEL_RESTAURANT">Hotel, Restaurant & Catering (HoReCa)</option>
            </select>
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
                className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Current: ₦{(formData.monthlyProcurementBudgetNGN || 0).toLocaleString()} per month
            </p>
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Quality Grade
            </label>
            <select
              value={formData.preferredQualityGrade || 'GRADE_A'}
              onChange={e => onChange({ preferredQualityGrade: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="EXPORT_PREMIUM">Export Premium (Highest Sort & Zero Defect)</option>
              <option value="GRADE_A">Grade A (Standard Commercial Factory Grade)</option>
              <option value="GRADE_B">Grade B (Bulk Secondary Processing Grade)</option>
              <option value="ALL">All Grades (Flexible based on price index)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Silo / Cold Warehouse Capacity (Metric Tonnes)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 2500"
              value={formData.storageWarehouseCapacityMT ?? 1000}
              onChange={e => onChange({ storageWarehouseCapacityMT: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Target Commodities Checklist */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <PackageCheck className="w-4 h-4 text-emerald-600" />
            <span>Target Sourcing Commodities</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {targetCrops.length} commodities targeted
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
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
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
            placeholder="Add custom commodity (e.g. Sesame, Ginger)..."
            value={newCrop}
            onChange={e => setNewCrop(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCrop(newCrop);
              }
            }}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => addCrop(newCrop)}
            disabled={!newCrop.trim()}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
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
                      ? 'bg-emerald-600 text-white shadow-xs'
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

      {/* Facilities & Delivery Hubs */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Warehouse className="w-4 h-4 text-emerald-600" />
            <span>Processing Plants & Drop-off Warehouses</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {facilityLocations.length} hubs active
          </span>
        </div>

        <div className="space-y-2">
          {facilityLocations.map((loc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
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
              placeholder="e.g. Warehouse 3, Idu Industrial Zone, Abuja"
              value={newFacility}
              onChange={e => setNewFacility(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFacility();
                }
              }}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addFacility}
              disabled={!newFacility.trim()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Escrow Settlement Bank Details */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>Billing & Refund Settlement Bank Account</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settlement Bank
            </label>
            <select
              value={formData.bankName || NIGERIAN_BANKS[0]}
              onChange={e => onChange({ bankName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {NIGERIAN_BANKS.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Account Name (Verified)
            </label>
            <input
              type="text"
              placeholder="Corporate Account Name"
              value={formData.bankAccountName || ''}
              onChange={e => onChange({ bankAccountName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
