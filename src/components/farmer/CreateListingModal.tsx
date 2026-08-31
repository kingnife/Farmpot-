import React, { useState } from 'react';
import { PlusCircle, Store, MapPin, Calendar, Camera, DollarSign, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createListing, setSelectedListingId, setActiveView } = useApp();

  const [product, setProduct] = useState('Fresh Roma Tomatoes');
  const [category, setCategory] = useState<'VEGETABLES' | 'GRAINS' | 'TUBERS' | 'OIL_SEEDS' | 'FRUITS'>('VEGETABLES');
  const [variety, setVariety] = useState('UC82B High-Brix Firm Red');
  const [quantity, setQuantity] = useState<number>(1200);
  const [unit, setUnit] = useState<'CRATE' | 'KG' | 'BAG_50KG' | 'BAG_100KG' | 'TONNE'>('CRATE');
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(200);
  const [pricePerUnit, setPricePerUnit] = useState<number>(3500);
  const [qualityGrade, setQualityGrade] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'EXPORT_PREMIUM'>('GRADE_A');
  const [harvestDate, setHarvestDate] = useState('2025-03-05');
  const [availabilityDate, setAvailabilityDate] = useState('2025-03-06');
  const [state, setState] = useState(currentUser.state || 'Kaduna');
  const [lga, setLga] = useState(currentUser.lga || 'Zaria');
  const [farmLocation, setFarmLocation] = useState('Zaria Agro Cluster, Km 12 Zaria-Kano Road, Kaduna');
  const [deliveryCapability, setDeliveryCapability] = useState<'FARM_GATE' | 'REGIONAL_DELIVERY' | 'NATIONWIDE_COLD_CHAIN'>(
    'NATIONWIDE_COLD_CHAIN'
  );
  const [description, setDescription] = useState(
    'Farm-gate freshly harvested Roma Tomatoes. Sorted and packed in standard 25kg plastic crates. High solid content, excellent shelf-life for industrial paste processing or retail distribution.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !quantity || !pricePerUnit) return;

    const newListing = createListing({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      product,
      category,
      variety,
      quantity,
      unit,
      minOrderQuantity,
      pricePerUnit,
      qualityGrade,
      harvestDate,
      availabilityDate,
      state,
      lga,
      farmLocation,
      photos: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      deliveryCapability,
      description,
      status: 'PUBLISHED',
      isVerifiedFarm: currentUser.verification.status === 'VERIFIED',
    });

    onClose();
    setSelectedListingId(newListing.id);
    setActiveView('listings');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List Agricultural Produce Batch"
      subtitle="Publish your harvest inventory to verified Nigerian food processors, aggregators, and supermarkets"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Commodity & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Produce Commodity Name *</label>
            <input
              type="text"
              required
              value={product}
              onChange={e => setProduct(e.target.value)}
              placeholder="e.g. Fresh Roma Tomatoes"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Produce Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="VEGETABLES">Vegetables (Tomatoes, Pepper, Onions)</option>
              <option value="GRAINS">Grains (Maize, Rice, Sorghum)</option>
              <option value="TUBERS">Tubers (Cassava, Yam, Potatoes)</option>
              <option value="OIL_SEEDS">Oil Seeds (Soybeans, Sesame)</option>
              <option value="FRUITS">Fruits & Citrus</option>
            </select>
          </div>
        </div>

        {/* Variety & Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Variety / Cultivar Spec</label>
            <input
              type="text"
              value={variety}
              onChange={e => setVariety(e.target.value)}
              placeholder="e.g. UC82B High-Brix, Cobra F1"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Quality Grade *</label>
            <select
              value={qualityGrade}
              onChange={e => setQualityGrade(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="GRADE_A">Grade A (Premium High Brix / Clean)</option>
              <option value="GRADE_B">Grade B (Standard Commercial)</option>
              <option value="EXPORT_PREMIUM">Export Premium (GAP Certified)</option>
            </select>
          </div>
        </div>

        {/* Volume, Unit & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Available Quantity *</label>
            <input
              type="number"
              required
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Unit of Measure *</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="CRATE">Crates (approx. 25kg)</option>
              <option value="BAG_50KG">50kg Bags</option>
              <option value="BAG_100KG">100kg Bags</option>
              <option value="TONNE">Metric Tonnes</option>
              <option value="KG">Kilograms</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Price per {unit} (₦) *</label>
            <input
              type="number"
              required
              min={100}
              value={pricePerUnit}
              onChange={e => setPricePerUnit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Minimum Order Quantity ({unit}) *</label>
            <input
              type="number"
              required
              min={1}
              value={minOrderQuantity}
              onChange={e => setMinOrderQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Logistics / Delivery Capability *</label>
            <select
              value={deliveryCapability}
              onChange={e => setDeliveryCapability(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="NATIONWIDE_COLD_CHAIN">Nationwide Reefer / Cold-Chain Haulage</option>
              <option value="REGIONAL_DELIVERY">Regional Transport (Statewide)</option>
              <option value="FARM_GATE">Farm Gate Loading Only</option>
            </select>
          </div>
        </div>

        {/* Harvest Date & Farm Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Harvest Date *</label>
            <input
              type="date"
              required
              value={harvestDate}
              onChange={e => setHarvestDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Farm State & LGA *</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="State"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                required
                value={lga}
                onChange={e => setLga(e.target.value)}
                placeholder="LGA"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Farm Location & Loading Depot *</label>
          <input
            type="text"
            required
            value={farmLocation}
            onChange={e => setFarmLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Produce Description & Crating Specs</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit */}
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
            <Store className="w-4 h-4" />
            <span>Publish to Marketplace</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
