import React, { useState } from 'react';
import {
  Truck,
  PackageCheck,
  MapPin,
  CheckCircle2,
  Thermometer,
  ShieldCheck,
  FileCheck,
  Camera,
  Navigation,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const ActiveDeliveryView: React.FC = () => {
  const {
    currentUser,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    updateLogisticsStatus,
    updateOrderStatus,
  } = useApp();

  const assignedOrders = orders.filter(
    o => o.logistics?.transporterId === currentUser.id
  );

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || assignedOrders[0];

  const [currentTemp, setCurrentTemp] = useState<number>(11.2);
  const [waybillNotes, setWaybillNotes] = useState('Delivered in optimal condition. Seal intact, cold-chain sustained throughout 780km haul.');

  if (!selectedOrder) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
        <Truck className="w-8 h-8 mx-auto text-slate-300" />
        <h3 className="text-sm font-bold text-slate-800">No active delivery assignments</h3>
        <p className="text-xs text-slate-400">Accept an available cargo job to begin dispatch.</p>
      </div>
    );
  }

  const handleMarkPickedUp = () => {
    updateLogisticsStatus(selectedOrder.id, 'PICKED_UP', {
      currentLocation: 'Zaria Agro Loading Cluster, Kaduna',
      temperatureCelsius: currentTemp,
    });
  };

  const handleMarkInTransit = () => {
    updateLogisticsStatus(selectedOrder.id, 'IN_TRANSIT', {
      currentLocation: 'Lokoja Bypass / Ibadan Corridor',
      temperatureCelsius: currentTemp,
    });
  };

  const handleMarkDelivered = () => {
    updateLogisticsStatus(selectedOrder.id, 'DELIVERED', {
      currentLocation: selectedOrder.deliveryDestination,
      temperatureCelsius: currentTemp,
      waybillPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Active Freight Deliveries & Waybills</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Digital waybill tracking, GPS checkpoint milestones, and cold-chain temperature telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Runs List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Assigned Shipments ({assignedOrders.length})
          </h2>

          <div className="space-y-3">
            {assignedOrders.map(order => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Waybill: {order.logistics?.waybillNumber}
                    </span>
                    <StatusBadge status={order.logistics?.status || order.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{order.product}</h3>
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Route: {order.supplierState} → {order.buyerState}</span>
                    <span className="font-bold text-blue-800">
                      ₦{(order.logistics?.agreedFreightFeeNGN || order.logistics?.freightPriceNGN || order.logisticsFeeNGN || order.logisticsFreightNGN || 0).toLocaleString()} NGN
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Run Details (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Waybill #{selectedOrder.logistics?.waybillNumber || selectedOrder.logistics?.deliveryWaybillNumber || selectedOrder.id}
                </span>
                <StatusBadge status={selectedOrder.logistics?.status || selectedOrder.status} size="md" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedOrder.product}</h2>
              <p className="text-xs text-slate-500">
                Destination: <strong className="text-slate-800">{selectedOrder.deliveryDestination || selectedOrder.deliveryLocation || selectedOrder.buyerState}</strong>
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Guaranteed Freight Fee</div>
              <div className="text-2xl font-black text-blue-800">
                ₦{(selectedOrder.logistics?.agreedFreightFeeNGN || selectedOrder.logistics?.freightPriceNGN || selectedOrder.logisticsFeeNGN || selectedOrder.logisticsFreightNGN || 0).toLocaleString()} NGN
              </div>
            </div>
          </div>

          {/* Action Milestones */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
            <div className="text-xs font-bold text-blue-950">Update Dispatch Milestones:</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                id="transporter-mark-picked-up"
                onClick={handleMarkPickedUp}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>1. Confirm Picked Up at Farm</span>
              </button>

              <button
                type="button"
                id="transporter-mark-in-transit"
                onClick={handleMarkInTransit}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>2. Log In-Transit Checkpoint</span>
              </button>

              <button
                type="button"
                id="transporter-mark-delivered"
                onClick={handleMarkDelivered}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Mark Delivered at Facility</span>
              </button>
            </div>
          </div>

          {/* Live Telemetry & Temperature Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-blue-600" />
                  Reefer Cargo Telemetry
                </span>
                <span className="text-xs font-bold text-blue-700">{currentTemp}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="4"
                  max="25"
                  step="0.5"
                  value={currentTemp}
                  onChange={e => setCurrentTemp(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <p className="text-[11px] text-slate-500">Adjust simulation temperature reading</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Vehicle & Driver Specs
              </div>
              <div className="text-slate-600 space-y-0.5">
                <div>Plate: <strong>{selectedOrder.logistics?.vehiclePlate}</strong></div>
                <div>Vehicle: <strong>{selectedOrder.logistics?.vehicleType}</strong></div>
                <div>Driver: <strong>{selectedOrder.logistics?.driverName}</strong> ({selectedOrder.logistics?.driverPhone})</div>
              </div>
            </div>
          </div>

          {/* Delivery Waybill Sign-off Notes */}
          <div>
            <label className="block font-bold text-slate-700 text-xs mb-1">Waybill Sign-off Notes</label>
            <textarea
              rows={2}
              value={waybillNotes}
              onChange={e => setWaybillNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
