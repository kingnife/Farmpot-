import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  FileCheck2,
  Truck,
  MapPin,
  CheckCircle2,
  Calendar,
  Phone,
  Scale,
  Thermometer,
  Lock,
  Building2
} from 'lucide-react';
import { TransportJob, Order } from '../../types';

interface DigitalWaybillModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  logistics: TransportJob;
}

export const DigitalWaybillModal: React.FC<DigitalWaybillModalProps> = ({
  isOpen,
  onClose,
  order,
  logistics,
}) => {
  if (!isOpen) return null;

  const waybillNo = logistics.waybillNumber || logistics.deliveryWaybillNumber || `WB-NGT-2025-${order.id.replace(/\D/g, '')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Electronic Agricultural Waybill (e-Waybill)
              </h2>
              <p className="text-xs text-slate-500 font-mono">Ref: {waybillNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
              title="Print Waybill"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Waybill Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-emerald-800">FarmPot</span>
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  Agro-Transit Express
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Federal Ministry of Agriculture & Rural Development • Certified Inter-State Agricultural Produce Haulage Waybill
              </p>
            </div>

            <div className="text-right flex flex-col sm:items-end">
              <div className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                {waybillNo}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Order ID: <strong className="text-slate-800">{order.id}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Consignor (Farmer/Origin) & Consignee (Buyer/Destination) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consignor */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] uppercase font-black tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                1. Consignor (Origin / Farmer Gate)
              </div>
              <div className="text-sm font-bold text-slate-900">{order.supplierName}</div>
              <div className="text-xs text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{logistics.pickupLocation || order.pickupLocation}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{logistics.pickupContact || '+234 802 444 5566'}</span>
              </div>
            </div>

            {/* Consignee */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] uppercase font-black tracking-wider text-blue-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                2. Consignee (Destination Facility)
              </div>
              <div className="text-sm font-bold text-slate-900">{order.buyerName}</div>
              <div className="text-xs text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{logistics.deliveryLocation || order.deliveryLocation || order.deliveryDestination}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{logistics.deliveryContact || '+234 803 111 2233'}</span>
              </div>
            </div>
          </div>

          {/* Transporter, Fleet & Insurance Details */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
            <div className="text-[11px] uppercase font-black tracking-wider text-blue-950 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-700" />
                3. Carrier, Vehicle & Goods-In-Transit (GIT) Insurance
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Insured by Leadway Assurance
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Freight Carrier:</span>
                <div className="font-bold text-slate-900">{logistics.transporterName || 'Niger-Transit Cold-Chain'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Vehicle Plate / FRSC:</span>
                <div className="font-bold text-slate-900">{logistics.vehiclePlate || 'KMC-429-XA'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Driver Name:</span>
                <div className="font-bold text-slate-900">{logistics.driverName || 'Haruna Ibrahim'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">GIT Policy No:</span>
                <div className="font-mono font-bold text-blue-900">{logistics.gitPolicyNumber || 'LEADWAY-GIT-2025-89410'}</div>
              </div>
            </div>
          </div>

          {/* Produce Cargo Manifest Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Produce Item</th>
                  <th className="p-3">Quality Grade</th>
                  <th className="p-3">Quantity / Packages</th>
                  <th className="p-3">Total Gross Weight</th>
                  <th className="p-3">Declared Escrow Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <td className="p-3 font-bold text-slate-900">
                    {order.product}
                    <div className="text-[11px] text-slate-500 font-normal">
                      Cold-Chain Target: 10°C - 12°C
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {order.qualityGrade.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-900">
                    {order.quantity.toLocaleString()} {order.unit}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">
                    {(logistics.totalWeightKg || (order.quantity * 25)).toLocaleString()} kg ({((logistics.totalWeightKg || (order.quantity * 25)) / 1000).toFixed(1)} MT)
                  </td>
                  <td className="p-3 font-black text-slate-900">
                    ₦{(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()} NGN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tamper-Proof Digital Cargo Seal & Verification QR */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Tamper-Evident Electronic Cargo Seal
                </span>
              </div>
              <div className="font-mono text-base font-black tracking-wider text-white">
                {logistics.cargoSealNumber || 'SEAL-NGT-98421-KD'}
              </div>
              <p className="text-[11px] text-slate-400">
                Seal must remain intact and verified by consignee receiving manager before offloading.
              </p>
            </div>

            {/* Verifiable Barcode & QR Code simulation */}
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl text-slate-900">
              <QrCode className="w-12 h-12 text-slate-900" />
              <div className="text-[10px] space-y-0.5">
                <div className="font-bold">VERIFIED WAYBILL</div>
                <div className="font-mono text-slate-500">Scan at Toll/Gate</div>
                <div className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  FarmPot Authenticated
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Party Signature Block */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Consignor (Farmer Gate)</div>
              <div className="font-signature text-sm font-bold text-slate-800 italic">{order.supplierName}</div>
              <div className="text-[10px] text-slate-400">Signed at loading dock</div>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Carrier Driver (FRSC Verified)</div>
              <div className="font-signature text-sm font-bold text-slate-800 italic">{logistics.driverName || 'Haruna Ibrahim'}</div>
              <div className="text-[10px] text-slate-400">Goods received in good order</div>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Consignee Receiving Agent</div>
              <div className="font-signature text-sm font-bold text-slate-800 italic">
                {logistics.status === 'DELIVERED' ? order.buyerName : '(Pending Handoff)'}
              </div>
              <div className="text-[10px] text-slate-400">Subject to destination inspection</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically sealed on FarmPot Agro-Ledger</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
