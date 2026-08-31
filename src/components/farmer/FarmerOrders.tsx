import React, { useState } from 'react';
import {
  PackageCheck,
  Lock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  DollarSign,
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const FarmerOrders: React.FC = () => {
  const {
    currentUser,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    updateOrderStatus,
    assignTransporter,
    users,
  } = useApp();

  const farmerOrders = orders.filter(o => o.supplierId === currentUser.id);
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || farmerOrders[0];

  const handlePrepareProduce = (order: Order) => {
    // Transition to READY_FOR_PICKUP or TRANSPORTER_ASSIGNED
    assignTransporter(order.id, 'usr-transporter-1');
  };

  const handleConfirmHandover = (order: Order) => {
    updateOrderStatus(order.id, 'PICKED_UP', 'Farmer handed over 500 crates to cold-chain transporter at Zaria depot.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Farm Sales Orders & Escrow Payouts</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fulfill purchase agreements, coordinate farm-gate loading, and receive verified Escrow disbursements.
        </p>
      </div>

      {farmerOrders.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <PackageCheck className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No sales orders yet</h3>
          <p className="text-xs text-slate-400">
            Publish produce or respond to buyer demand requests to start generating sales.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Orders List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Sales Pipeline ({farmerOrders.length})
            </h2>

            <div className="space-y-3">
              {farmerOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {order.id}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>

                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-slate-900">{order.product}</h3>
                      <span className="text-xs font-black text-emerald-800">
                        ₦{(order.produceTotalNGN || order.grandTotalNGN || 0).toLocaleString()} NGN
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between">
                      <span>Buyer: <strong className="text-slate-700">{order.buyerName}</strong></span>
                      <span>{(order.quantity || 0).toLocaleString()} {order.unit}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Lock className="w-3 h-3" />
                        Payout: {(order.escrow?.status || 'PENDING').replace(/_/g, ' ')}
                      </span>
                      <span>Destination: {order.deliveryLocation || order.buyerState}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Order Detail (7 Cols) */}
          {selectedOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedOrder.id}
                    </span>
                    <StatusBadge status={selectedOrder.status} size="md" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedOrder.product}</h2>
                  <p className="text-xs text-slate-500">
                    Buyer: <strong className="text-slate-800">{selectedOrder.buyerName}</strong> ({selectedOrder.buyerState})
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Your Sales Payout</div>
                  <div className="text-2xl font-black text-emerald-800">
                    ₦{(selectedOrder.produceTotalNGN || selectedOrder.grandTotalNGN || 0).toLocaleString()} NGN
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {(selectedOrder.quantity || 0).toLocaleString()} {selectedOrder.unit} @ ₦{(selectedOrder.pricePerUnit || 0).toLocaleString()}/{selectedOrder.unit}
                  </div>
                </div>
              </div>

              {/* Farmer Actions */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="text-xs font-bold text-emerald-950">Farmer Fulfillment Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === 'ESCROW_HELD' && (
                    <button
                      type="button"
                      id="farmer-prepare-produce-btn"
                      onClick={() => handlePrepareProduce(selectedOrder)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Confirm Crating & Request Cold-Chain Hauler</span>
                    </button>
                  )}

                  {selectedOrder.status === 'TRANSPORTER_ASSIGNED' && (
                    <button
                      type="button"
                      id="farmer-handover-btn"
                      onClick={() => handleConfirmHandover(selectedOrder)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Confirm Handover to Driver (Waybill Sign-off)</span>
                    </button>
                  )}

                  {selectedOrder.escrow?.status === 'RELEASED_TO_FARMER' && (
                    <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>₦{(selectedOrder.produceTotalNGN || selectedOrder.grandTotalNGN || 0).toLocaleString()} NGN Payout Settled to your Bank Account!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Escrow Custody Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  FarmPot Escrow Guarantee
                </div>
                <div className="text-slate-600">
                  Buyer has deposited <strong>₦{(selectedOrder.grandTotalNGN || selectedOrder.produceTotalNGN || 0).toLocaleString()} NGN</strong> in the secure FarmPot Escrow Vault. Funds are guaranteed and will be auto-transferred to your registered account upon destination quality sign-off.
                </div>
              </div>

              {/* Transporter Details */}
              {selectedOrder.logistics && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Assigned Transporter
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Transporter: <strong>{selectedOrder.logistics.transporterName || 'Pending'}</strong></div>
                    <div>Vehicle: <strong>{selectedOrder.logistics.transporterVehicle || 'Cold Van'}</strong></div>
                    <div>Waybill #: <strong>{selectedOrder.logistics.deliveryWaybillNumber || 'FP-WB-' + selectedOrder.id}</strong></div>
                    <div>Driver Contact: <strong>{selectedOrder.logistics.transporterPhone || selectedOrder.logistics.pickupContact}</strong></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
