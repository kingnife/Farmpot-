import React, { useState } from 'react';
import { PackageCheck, ShieldAlert, CheckCircle2, AlertTriangle, Camera, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { Modal } from '../common/Modal';

interface QualityInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const QualityInspectionModal: React.FC<QualityInspectionModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const { submitQualityInspection, raiseDispute, currentUser } = useApp();

  const [receivedQuantity, setReceivedQuantity] = useState<number>(order?.quantity || 500);
  const [actualGrade, setActualGrade] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECTED'>(
    (order?.qualityGrade as any) || 'GRADE_A'
  );
  const [defectPercentage, setDefectPercentage] = useState<number>(1.2);
  const [moistureContent, setMoistureContent] = useState<number>(13.5);
  const [notes, setNotes] = useState(
    'Produce received in pristine condition at Ikeja processing plant. Brix reading 5.2 (High-Brix), sorting defect rate 1.2% well within contract tolerance.'
  );
  const [verdict, setVerdict] = useState<'ACCEPTED' | 'DISPUTE'>('ACCEPTED');
  const [disputeReason, setDisputeReason] = useState('Severe spoilage exceeding agreed 5% contract tolerance.');

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (verdict === 'ACCEPTED') {
      submitQualityInspection(order.id, {
        inspectorId: currentUser.id,
        inspectorName: currentUser.name,
        inspectedAt: new Date().toISOString(),
        location: order.deliveryDestination,
        passed: true,
        receivedQuantity,
        actualGrade: actualGrade === 'REJECTED' ? 'GRADE_B' : actualGrade,
        defectPercentage,
        moistureContent,
        notes,
        photos: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      });
    } else {
      // Raise dispute
      raiseDispute({
        orderId: order.id,
        raisedById: currentUser.id,
        raisedByName: currentUser.name,
        raisedByRole: 'BUYER',
        reason: 'QUALITY_MISMATCH',
        description: disputeReason,
        claimedAmountNGN: order.grandTotalNGN,
        evidencePhotos: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Destination Quality & Quantity Confirmation"
      subtitle={`Formal inspection check for Order ${order.id} (${order.product})`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Order Meta Header */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">{order.product}</div>
            <div className="text-[11px] text-slate-500">
              Contract Spec: {order.quantity} {order.unit} • Grade {order.qualityGrade.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-slate-500">Supplier: {order.supplierName} ({order.supplierState})</div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-500">Escrow Locked</div>
            <div className="text-sm font-black text-emerald-800">
              ₦{(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()} NGN
            </div>
          </div>
        </div>

        {/* Verification Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Delivered Quantity ({order.unit}) *</label>
            <input
              type="number"
              required
              min={1}
              value={receivedQuantity}
              onChange={e => setReceivedQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Physical Quality Grade Tested *</label>
            <select
              value={actualGrade}
              onChange={e => setActualGrade(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="GRADE_A">Grade A (Meets Premium Specification)</option>
              <option value="GRADE_B">Grade B (Standard Commercial)</option>
              <option value="GRADE_C">Grade C (Sub-Standard / Processing Only)</option>
              <option value="REJECTED">Rejected (Severe Spoilage / Failure)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Sorting Defect / Spoilage (%) *</label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={defectPercentage}
              onChange={e => setDefectPercentage(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Moisture Content / Brix (%)</label>
            <input
              type="number"
              step="0.1"
              value={moistureContent}
              onChange={e => setMoistureContent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Verdict Selection */}
        <div className="space-y-2 pt-2">
          <label className="block font-bold text-slate-700">Inspection Verdict & Settlement Trigger *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVerdict('ACCEPTED')}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                verdict === 'ACCEPTED'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-left">
                <div className="font-bold">Accept & Release Escrow</div>
                <div className="text-[10px] text-slate-500">Auto-credits farmer & transporter</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVerdict('DISPUTE')}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                verdict === 'DISPUTE'
                  ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-left">
                <div className="font-bold">Report Defect / Dispute</div>
                <div className="text-[10px] text-slate-500">Freezes escrow & alerts Admin</div>
              </div>
            </button>
          </div>
        </div>

        {verdict === 'ACCEPTED' ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-900 text-xs">
            <div className="font-bold flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              Escrow Multi-Party Payout Summary:
            </div>
            <div>• Farmer Payout: ₦{(order.escrow?.produceAmountNGN || order.produceTotalNGN || 0).toLocaleString()} NGN → {order.supplierName}</div>
            <div>• Logistics Payout: ₦{(order.escrow?.logisticsAmountNGN || order.logisticsFeeNGN || 0).toLocaleString()} NGN → {order.logistics?.transporterName || 'Transporter'}</div>
          </div>
        ) : (
          <div>
            <label className="block font-bold text-rose-700 mb-1">Dispute Description & Evidence *</label>
            <textarea
              rows={2}
              required
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-rose-300 focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1">Inspection Notes & Test Certificate</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
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
            className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-md flex items-center gap-2 cursor-pointer ${
              verdict === 'ACCEPTED'
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                : 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/20'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>{verdict === 'ACCEPTED' ? 'Accept Produce & Release Funds' : 'Lock Escrow & Open Dispute'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
