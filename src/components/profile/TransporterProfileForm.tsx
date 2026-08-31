import React, { useState } from 'react';
import { Truck, ShieldCheck, Landmark, ThermometerSnowflake, Plus, X, MapPin } from 'lucide-react';
import { User } from '../../types';
import { NIGERIAN_BANKS, NIGERIAN_STATES } from '../../data/nigeriaGeography';

interface TransporterProfileFormProps {
  formData: Partial<User>;
  onChange: (updates: Partial<User>) => void;
}

const VEHICLE_CONFIGS = [
  { id: 'REFRIGERATED_TRUCK', label: 'Refrigerated Cold-Chain Trucks (2°C – 8°C)', desc: 'For perishable tomatoes, leafy greens, dairy, and fruits' },
  { id: 'FLATBED_TRUCK', label: 'Heavy 30-Tonne Flatbed Lorries', desc: 'For bagged grains, tubers, cassava, and palletized agro cargo' },
  { id: 'BOX_VAN', label: 'Enclosed 15-Tonne Dry Box Vans', desc: 'For weather-protected grain transport and packaged products' },
  { id: 'PICKUP_TRUCK', label: 'Agile 3-Tonne Agro Pickups', desc: 'For last-mile farm-to-hub rapid evacuations' },
];

const INSURANCE_PROVIDERS = [
  'Leadway Assurance Nigeria PLC',
  'AIICO Insurance PLC',
  'Custodian and Allied Insurance',
  'Cornerstone Insurance PLC',
  'Sovereign Trust Insurance PLC',
  'AXA Mansard Insurance',
  'Nem Insurance PLC'
];

export const TransporterProfileForm: React.FC<TransporterProfileFormProps> = ({ formData, onChange }) => {
  const [customState, setCustomState] = useState('');

  const vehicleTypes = formData.vehicleTypes || ['REFRIGERATED_TRUCK', 'FLATBED_TRUCK'];
  const coverageStates = formData.coverageStates || ['Kano', 'Kaduna', 'Oyo', 'Lagos'];

  const toggleVehicle = (vType: any) => {
    if (vehicleTypes.includes(vType)) {
      if (vehicleTypes.length === 1) return; // keep at least 1
      onChange({ vehicleTypes: vehicleTypes.filter(v => v !== vType) });
    } else {
      onChange({ vehicleTypes: [...vehicleTypes, vType] });
    }
  };

  const toggleCoverageState = (st: string) => {
    if (coverageStates.includes(st)) {
      onChange({ coverageStates: coverageStates.filter(s => s !== st) });
    } else {
      onChange({ coverageStates: [...coverageStates, st] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Fleet & Haulage Specifications */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Haulage Fleet Capacity & Commercial Specifications</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Active Fleet Size (Vehicles)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              placeholder="e.g. 14"
              value={formData.fleetSize ?? 10}
              onChange={e => onChange({ fleetSize: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Max Single Payload Capacity (MT)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              placeholder="e.g. 35"
              value={formData.maxPayloadTons ?? 30}
              onChange={e => onChange({ maxPayloadTons: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              FRSC Fleet Compliance ID
            </label>
            <input
              type="text"
              placeholder="e.g. FRSC-RTC-KAN-849"
              value={formData.frscFleetNumber || ''}
              onChange={e => onChange({ frscFleetNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Cold-Chain Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <ThermometerSnowflake className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Active Cold-Chain Refrigeration Equipped</div>
              <div className="text-[10px] text-slate-500">Fleet trucks are fitted with calibrated thermal sensors & refrigeration units</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ temperatureControlled: !formData.temperatureControlled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              formData.temperatureControlled !== false ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.temperatureControlled !== false ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Vehicle Categories Configuration */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Operational Vehicle Configurations in Fleet</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {vehicleTypes.length} types registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VEHICLE_CONFIGS.map(item => {
            const active = vehicleTypes.includes(item.id as any);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleVehicle(item.id)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 opacity-75'
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

      {/* Coverage Corridor States */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Active Geographic Coverage States across Nigeria</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {coverageStates.length} states covered
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-white border border-slate-200 max-h-40 overflow-y-auto">
          {NIGERIAN_STATES.map(stateName => {
            const active = coverageStates.includes(stateName);
            return (
              <button
                key={stateName}
                type="button"
                onClick={() => toggleCoverageState(stateName)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {active ? `✓ ${stateName}` : `+ ${stateName}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* GIT Insurance Policy */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Goods-In-Transit (GIT) Comprehensive Cargo Insurance</span>
          </div>
          <button
            type="button"
            onClick={() => onChange({ gitInsuranceActive: !formData.gitInsuranceActive })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              formData.gitInsuranceActive !== false ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.gitInsuranceActive !== false ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Insurance Underwriter Provider
            </label>
            <select
              value={formData.insuranceProvider || INSURANCE_PROVIDERS[0]}
              onChange={e => onChange({ insuranceProvider: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {INSURANCE_PROVIDERS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              GIT Policy Certificate Number
            </label>
            <input
              type="text"
              placeholder="e.g. LEADWAY-GIT-2025-89410"
              value={formData.gitPolicyNumber || ''}
              onChange={e => onChange({ gitPolicyNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Escrow Payout Bank Account */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>Freight Settlement & Escrow Disbursal Bank Account</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settlement Bank
            </label>
            <select
              value={formData.bankName || NIGERIAN_BANKS[3]}
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
