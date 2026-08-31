import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Truck, Sparkles, FileCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Listing, DemandRequest } from '../../types';
import { Modal } from '../common/Modal';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing | null;
  requestId?: string;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  isOpen,
  onClose,
  listing,
  requestId,
}) => {
  const {
    currentUser,
    demandRequests,
    createStructuredOffer,
    createOrderFromOffer,
    setSelectedOrderId,
    setActiveView,
  } = useApp();

  const req = demandRequests.find(r => r.id === requestId);

  const [quantity, setQuantity] = useState<number>(req?.quantity || listing?.minOrderQuantity || 500);
  const [offeredPricePerUnit, setOfferedPricePerUnit] = useState<number>(listing?.pricePerUnit || 3500);
  const [qualityGrade, setQualityGrade] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'EXPORT_PREMIUM'>(
    listing?.qualityGrade || 'GRADE_A'
  );
  const [deliveryTerms, setDeliveryTerms] = useState<'FARM_GATE_PICKUP' | 'DESTINATION_DELIVERED'>(
    'DESTINATION_DELIVERED'
  );
  const [paymentTerms, setPaymentTerms] = useState<'FULL_ESCROW' | 'DEPOSIT_50_BALANCE_ON_DELIVERY'>(
    'FULL_ESCROW'
  );
  const [notes, setNotes] = useState(
    'Payment to be locked in FarmPot Escrow Vault. Requires cold-chain freight from farm loading to Lagos processing plant.'
  );

  if (!listing) return null;

  const totalProduceAmount = quantity * offeredPricePerUnit;
  const estimatedFreight = deliveryTerms === 'DESTINATION_DELIVERED' ? 200000 : 0;
  const platformFee = Math.round(totalProduceAmount * 0.02);
  const grandTotal = totalProduceAmount + estimatedFreight + platformFee;

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();

    const offer = createStructuredOffer({
      requestId: req?.id,
      listingId: listing.id,
      buyerId: currentUser.id,
      buyerName: `${currentUser.name} (${currentUser.businessName || 'Procurement'})`,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      product: listing.product,
      quantity,
      unit: listing.unit,
      offeredPricePerUnit,
      totalAmountNGN: totalProduceAmount,
      qualityGrade,
      deliveryTerms,
      paymentTerms,
      notes,
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    });

    // Auto-create binding order from offer for demo/test flow
    const createdOrder = createOrderFromOffer(offer.id);

    onClose();
    setSelectedOrderId(createdOrder.id);
    setActiveView('orders');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Structured Agricultural Offer"
      subtitle={`Binding trade proposal to ${listing.farmerName} for ${listing.product}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
        {/* Produce Overview Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Product & Variety</div>
            <div className="text-sm font-bold text-slate-900">{listing.product} ({listing.variety})</div>
            <div className="text-[11px] text-slate-500">Origin: {listing.lga}, {listing.state} State</div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Supplier Listed Price</div>
            <div className="text-sm font-bold text-emerald-800">
              ₦{(listing.pricePerUnit || 0).toLocaleString()} / {listing.unit || 'unit'}
            </div>
            <div className="text-[11px] text-slate-500">Available: {(listing.quantity || 0).toLocaleString()} {listing.unit || 'units'}</div>
          </div>
        </div>

        {/* Offer Volume & Price Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Volume ({listing.unit}) *</label>
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
            <label className="block font-bold text-slate-700 mb-1">Offered Price / {listing.unit} (₦) *</label>
            <input
              type="number"
              required
              min={100}
              value={offeredPricePerUnit}
              onChange={e => setOfferedPricePerUnit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Quality Grade Specification *</label>
            <select
              value={qualityGrade}
              onChange={e => setQualityGrade(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="GRADE_A">Grade A (Premium High Brix)</option>
              <option value="GRADE_B">Grade B (Standard Commercial)</option>
              <option value="EXPORT_PREMIUM">Export Premium</option>
            </select>
          </div>
        </div>

        {/* Delivery Terms & Payment Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Logistics / Delivery Terms *</label>
            <select
              value={deliveryTerms}
              onChange={e => setDeliveryTerms(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="DESTINATION_DELIVERED">
                Destination Delivered (FarmPot Transporter Network)
              </option>
              <option value="FARM_GATE_PICKUP">Farm Gate Pickup (Buyer Self-Arranged)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Escrow Payment Terms *</label>
            <select
              value={paymentTerms}
              onChange={e => setPaymentTerms(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="FULL_ESCROW">100% Locked in Escrow Vault (Recommended)</option>
              <option value="DEPOSIT_50_BALANCE_ON_DELIVERY">50% Deposit + 50% on Quality Confirmation</option>
            </select>
          </div>
        </div>

        {/* Financial Escrow Breakdown Table */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            FarmPot Escrow Settlement Breakdown
          </div>

          <div className="space-y-1.5 text-xs text-emerald-950">
            <div className="flex justify-between">
              <span>Produce Value ({quantity} {listing.unit} @ ₦{(offeredPricePerUnit || 0).toLocaleString()}):</span>
              <span className="font-bold">₦{(totalProduceAmount || 0).toLocaleString()} NGN</span>
            </div>
            <div className="flex justify-between">
              <span>Cold-Chain Logistics Freight:</span>
              <span className="font-bold">₦{(estimatedFreight || 0).toLocaleString()} NGN</span>
            </div>
            <div className="flex justify-between">
              <span>FarmPot Platform Custody Fee (2%):</span>
              <span className="font-bold">₦{(platformFee || 0).toLocaleString()} NGN</span>
            </div>
            <div className="pt-2 border-t border-emerald-200/80 flex justify-between text-sm font-extrabold text-emerald-900">
              <span>Total Escrow Commitment:</span>
              <span>₦{(grandTotal || 0).toLocaleString()} NGN</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Offer Terms & Quality Tolerances</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
            <FileCheck className="w-4 h-4" />
            <span>Generate Binding Trade Agreement</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
