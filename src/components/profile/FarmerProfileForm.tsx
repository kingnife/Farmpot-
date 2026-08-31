import React, { useState } from 'react';
import { Sprout, Users, Landmark, Droplets, Warehouse, Plus, X, Truck, ShieldCheck } from 'lucide-react';
import { User } from '../../types';
import { COMMODITY_SUGGESTIONS, NIGERIAN_BANKS } from '../../data/nigeriaGeography';

interface FarmerProfileFormProps {
  formData: Partial<User>;
  onChange: (updates: Partial<User>) => void;
}

export const FarmerProfileForm: React.FC<FarmerProfileFormProps> = ({ formData, onChange }) => {
  const [newCrop, setNewCrop] = useState('');

  const primaryCrops = formData.primaryCrops || [];
  const deliveryCapabilities = formData.deliveryCapabilities || ['PICKUP_ONLY', 'FARMPOT_LOGISTICS'];

  const addCrop = (cropName: string) => {
    const trimmed = cropName.trim();
    if (!trimmed || primaryCrops.includes(trimmed)) return;
    onChange({ primaryCrops: [...primaryCrops, trimmed] });
    setNewCrop('');
  };

  const removeCrop = (cropToRemove: string) => {
    onChange({ primaryCrops: primaryCrops.filter(c => c !== cropToRemove) });
  };

  const toggleDeliveryCapability = (cap: string) => {
    if (deliveryCapabilities.includes(cap)) {
      onChange({ deliveryCapabilities: deliveryCapabilities.filter(c => c !== cap) });
    } else {
      onChange({ deliveryCapabilities: [...deliveryCapabilities, cap] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Farm Scale & Agronomy Specs */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Farmland Acreage & Operations Specification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Farmland Size (Hectares)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              placeholder="e.g. 45"
              value={formData.farmSizeHectares ?? 25}
              onChange={e => onChange({ farmSizeHectares: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              ≈ {((formData.farmSizeHectares || 25) * 2.471).toFixed(1)} Acres
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Storage Silo / On-Farm Capacity (MT)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 120"
              value={formData.storageCapacityTons ?? 100}
              onChange={e => onChange({ storageCapacityTons: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Established Year
            </label>
            <input
              type="number"
              min="1970"
              max="2026"
              placeholder="e.g. 2014"
              value={formData.establishedYear ?? 2016}
              onChange={e => onChange({ establishedYear: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Farming Methodology
            </label>
            <select
              value={formData.farmingMethod || 'MIXED'}
              onChange={e => onChange({ farmingMethod: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ORGANIC">Certified Organic</option>
              <option value="CONVENTIONAL">Conventional Commercial Farming</option>
              <option value="MIXED">Integrated / Mixed Agro-Ecology</option>
              <option value="HYDROPONIC">Greenhouse & Hydroponics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Irrigation Infrastructure
            </label>
            <select
              value={formData.irrigationType || 'BOREHOLE_CENTER_PIVOT'}
              onChange={e => onChange({ irrigationType: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="BOREHOLE_CENTER_PIVOT">Borehole & Center-Pivot / Sprinkler</option>
              <option value="DRIP_IRRIGATION">Precision Drip Irrigation</option>
              <option value="CANAL_FLOOD">River Basin / Gravity Canal System</option>
              <option value="RAINFED">Seasonal Rainfed Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              National ID Number (NIN)
            </label>
            <input
              type="text"
              placeholder="e.g. NIN-89301928471"
              value={formData.ninNumber || ''}
              onChange={e => onChange({ ninNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Harvest Produce Commodities */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Cultivated Commodities & Specialties</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {primaryCrops.length} crops listed
          </span>
        </div>

        {/* Selected Crop Tags */}
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 rounded-xl bg-white border border-slate-200">
          {primaryCrops.length === 0 && (
            <span className="text-xs text-slate-400 italic">No crops configured. Select from below or type custom.</span>
          )}
          {primaryCrops.map(crop => (
            <span
              key={crop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
            >
              <span>🌱 {crop}</span>
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
            placeholder="Add crop specialty (e.g. UC82B Roma Tomatoes, Habanero)..."
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

        {/* Quick Suggestions */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-slate-500">Popular Produce Recommendations:</div>
          <div className="flex flex-wrap gap-1.5">
            {COMMODITY_SUGGESTIONS.slice(0, 10).map(sug => {
              const isSelected = primaryCrops.includes(sug);
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

      {/* Cooperative & Outgrower Affiliation */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Cooperative & Outgrower Network</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cooperative / Union Name
            </label>
            <input
              type="text"
              placeholder="e.g. Zaria Irrigation Agro-Farmers Union"
              value={formData.cooperativeName || ''}
              onChange={e => onChange({ cooperativeName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cooperative / Guild Registration ID
            </label>
            <input
              type="text"
              placeholder="e.g. KAD/AFAN/2021/8492"
              value={formData.cooperativeRegId || ''}
              onChange={e => onChange({ cooperativeRegId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Produce Dispatch & Logistics Options
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'PICKUP_ONLY', label: 'FarmGate Buyer Pickup', desc: 'Buyer trucks come directly to farm gate' },
              { id: 'FARMER_DELIVERS', label: 'Farmer Direct Delivery', desc: 'Farmer delivers using own tractor/lorry' },
              { id: 'FARMPOT_LOGISTICS', label: 'FarmPot Verified Haulers', desc: 'Matched with bonded cold-chain haulers' },
            ].map(item => {
              const active = deliveryCapabilities.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleDeliveryCapability(item.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <span className={`text-xs ${active ? 'text-emerald-700 font-bold' : 'text-slate-300'}`}>
                      {active ? '✓' : '○'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Escrow Payout Bank Account */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>Escrow Harvest Disbursal Bank Account</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settlement Bank
            </label>
            <select
              value={formData.bankName || NIGERIAN_BANKS[1]}
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
              placeholder="Beneficiary Account Name"
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
