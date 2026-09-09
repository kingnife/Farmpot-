import React, { useState } from 'react';
import { PlusCircle, Sparkles, MapPin, Calendar, DollarSign, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Dropdown } from '../common/Dropdown';

interface CreateDemandRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDemandRequestModal: React.FC<CreateDemandRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, createDemandRequest, setSelectedRequestId, setActiveView } = useApp();

  const [product, setProduct] = useState('Roma Tomatoes (Grade A)');
  const [category, setCategory] = useState<'VEGETABLES' | 'GRAINS' | 'TUBERS' | 'OIL_SEEDS' | 'FRUITS'>('VEGETABLES');
  const [variety, setVariety] = useState('UC82B High-Brix Firm Red');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'CRATE' | 'KG' | 'BAG_50KG' | 'BAG_100KG' | 'TONNE'>('CRATE');
  const [targetQualityGrade, setTargetQualityGrade] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'EXPORT_PREMIUM'>('GRADE_A');
  const [maxBudgetPerUnit, setMaxBudgetPerUnit] = useState<number>(3700);
  const [destinationState, setDestinationState] = useState('Lagos');
  const [destinationLga, setDestinationLga] = useState('Ikeja');
  const [deliveryDestination, setDeliveryDestination] = useState('Plot 14 Commercial Ave, Ikeja Industrial Estate, Lagos');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('2025-03-10');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('WEEKLY');
  const [notes, setNotes] = useState('Requires cold-chain or well-ventilated transport from farm cluster to Lagos.');

  const totalBudget = (quantity || 0) * (maxBudgetPerUnit || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !quantity || !maxBudgetPerUnit) return;

    const newReq = createDemandRequest({
      buyerId: currentUser.id,
      buyerName: `${currentUser.name} (${currentUser.businessName || 'Procurement'})`,
      buyerType: 'PROCESSOR',
      buyerState: destinationState,
      product,
      category,
      variety,
      quantity,
      unit,
      targetQualityGrade,
      maxBudgetPerUnit,
      totalBudget,
      deliveryDestination,
      destinationState,
      destinationLga,
      requiredDeliveryDate,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      notes,
      status: 'PUBLISHED',
    });

    onClose();
    setSelectedRequestId(newReq.id);
    setActiveView('matching');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Agricultural Demand Request"
      subtitle="Broadcast procurement requirement to verified Nigerian farmer clusters & cooperatives"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Commodity & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Produce Commodity *</label>
            <input
              type="text"
              required
              value={product}
              onChange={e => setProduct(e.target.value)}
              placeholder="e.g. Roma Tomatoes, Yellow Maize, Soybeans"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Category</label>
            <Dropdown
              id="modal-demand-category-dropdown"
              fullWidth
              options={[
                { value: 'VEGETABLES', label: 'Vegetables (Tomatoes, Pepper, Onions)' },
                { value: 'GRAINS', label: 'Grains (Maize, Sorghum, Millet, Rice)' },
                { value: 'TUBERS', label: 'Tubers (Cassava, Yam, Potatoes)' },
                { value: 'OIL_SEEDS', label: 'Oil Seeds & Legumes (Soybeans, Sesame)' },
                { value: 'FRUITS', label: 'Fruits & Citrus' },
              ]}
              value={category}
              onChange={val => setCategory(val as any)}
            />
          </div>
        </div>

        {/* Variety & Quality Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Preferred Variety / Seed Spec</label>
            <input
              type="text"
              value={variety}
              onChange={e => setVariety(e.target.value)}
              placeholder="e.g. UC82B, SAMMAZ-15, TME 419"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Quality Grade Required *</label>
            <Dropdown
              id="modal-demand-quality-grade-dropdown"
              fullWidth
              options={[
                { value: 'GRADE_A', label: 'Grade A (Firm, Unblemished, Industrial)' },
                { value: 'GRADE_B', label: 'Grade B (Standard Commercial Grade)' },
                { value: 'EXPORT_PREMIUM', label: 'Export Premium (EU / Global GAP)' },
              ]}
              value={targetQualityGrade}
              onChange={val => setTargetQualityGrade(val as any)}
            />
          </div>
        </div>

        {/* Volume & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Quantity *</label>
            <input
              type="number"
              required
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Unit of Measure *</label>
            <Dropdown
              id="modal-demand-unit-dropdown"
              fullWidth
              options={[
                { value: 'CRATE', label: 'Crates (approx. 25kg)' },
                { value: 'BAG_50KG', label: '50kg Bags' },
                { value: 'BAG_100KG', label: '100kg Bags' },
                { value: 'TONNE', label: 'Metric Tonnes (1,000kg)' },
                { value: 'KG', label: 'Kilograms (kg)' },
              ]}
              value={unit}
              onChange={val => setUnit(val as any)}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Max Budget / Unit (₦) *</label>
            <input
              type="number"
              required
              min={100}
              value={maxBudgetPerUnit}
              onChange={e => setMaxBudgetPerUnit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Total Budget Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <span className="font-semibold text-emerald-900">Total Estimated Procurement Budget:</span>
          <span className="text-base font-black text-emerald-800">
            ₦{totalBudget.toLocaleString()} NGN
          </span>
        </div>

        {/* Destination Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Delivery State & LGA *</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={destinationState}
                onChange={e => setDestinationState(e.target.value)}
                placeholder="State (e.g. Lagos)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <input
                type="text"
                required
                value={destinationLga}
                onChange={e => setDestinationLga(e.target.value)}
                placeholder="LGA (e.g. Ikeja)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Delivery Date *</label>
            <input
              type="date"
              required
              value={requiredDeliveryDate}
              onChange={e => setRequiredDeliveryDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Full Facility Address *</label>
          <input
            type="text"
            required
            value={deliveryDestination}
            onChange={e => setDeliveryDestination(e.target.value)}
            placeholder="Factory, warehouse or distribution center address"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Recurring Procurement Option */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900">Enable Recurring Supply Contract?</div>
            <div className="text-[11px] text-slate-500">Auto-schedule weekly or monthly delivery cycles</div>
          </div>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={e => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
          />
        </div>

        {isRecurring && (
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-3">
            <span className="font-semibold text-teal-900 shrink-0">Frequency:</span>
            <Dropdown
              id="modal-demand-frequency-dropdown"
              options={[
                { value: 'WEEKLY', label: 'Weekly Delivery' },
                { value: 'BIWEEKLY', label: 'Bi-Weekly Delivery' },
                { value: 'MONTHLY', label: 'Monthly Delivery' },
              ]}
              value={recurringFrequency}
              onChange={val => setRecurringFrequency(val as any)}
              className="flex-1"
            />
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1">Special Handling & Moisture Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Moisture tolerance, temperature requirements during haulage"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish & Run Matching Engine</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
