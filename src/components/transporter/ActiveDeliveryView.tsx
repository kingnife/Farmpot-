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
  Clock,
  FileText,
  Lock,
  Check,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { LogisticsMap } from '../logistics/LogisticsMap';
import { ColdChainTelemetryCard } from '../logistics/ColdChainTelemetryCard';
import { DigitalWaybillModal } from '../logistics/DigitalWaybillModal';
import { LogisticsCheckpoint } from '../../types';

export const ActiveDeliveryView: React.FC = () => {
  const {
    currentUser,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    updateLogisticsStatus,
    updateLogisticsCheckpoint,
    updateLogisticsTelemetry,
  } = useApp();

  const assignedOrders = orders.filter(
    o => o.logistics?.transporterId === currentUser.id
  );

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || assignedOrders[0];

  const [currentTemp, setCurrentTemp] = useState<number>(selectedOrder?.logistics?.temperatureCelsius || 11.2);
  const [waybillNotes, setWaybillNotes] = useState('Delivered in optimal condition. Seal intact, cold-chain sustained throughout haul.');
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<LogisticsCheckpoint | null>(null);

  if (!selectedOrder || !selectedOrder.logistics) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
        <Truck className="w-8 h-8 mx-auto text-slate-300" />
        <h3 className="text-sm font-bold text-slate-800">No active delivery assignments</h3>
        <p className="text-xs text-slate-400">Accept an available cargo job to begin dispatch.</p>
      </div>
    );
  }

  const logistics = selectedOrder.logistics;

  const handleMarkPickedUp = () => {
    updateLogisticsStatus(selectedOrder.id, 'PICKED_UP', {
      currentLocation: `${logistics.pickupLocation || 'Origin Depot, Kaduna'}`,
      temperatureCelsius: currentTemp,
      notes: waybillNotes,
    });
  };

  const handleMarkInTransit = () => {
    updateLogisticsStatus(selectedOrder.id, 'IN_TRANSIT', {
      currentLocation: 'Lokoja Bypass / Ibadan Expressway Transit',
      temperatureCelsius: currentTemp,
      notes: waybillNotes,
    });
  };

  const handleMarkDelivered = () => {
    updateLogisticsStatus(selectedOrder.id, 'DELIVERED', {
      currentLocation: selectedOrder.deliveryDestination || selectedOrder.deliveryLocation || 'Destination Terminal',
      temperatureCelsius: currentTemp,
      notes: waybillNotes,
      proofPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    });
  };

  const handleUpdateCheckpoint = (chkId: string, status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING') => {
    updateLogisticsCheckpoint(selectedOrder.id, chkId, status, undefined, currentTemp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Active Freight Deliveries & Waybills</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Digital waybill tracking, GPS checkpoint milestones, and cold-chain temperature telemetry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWaybillOpen(true)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Electronic Waybill #{logistics.waybillNumber || selectedOrder.id}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Runs List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
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
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
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

        {/* Selected Run Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Milestone Status */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Waybill #{logistics.waybillNumber || logistics.deliveryWaybillNumber || selectedOrder.id}
                  </span>
                  <StatusBadge status={logistics.status || selectedOrder.status} size="md" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedOrder.product}</h2>
                <p className="text-xs text-slate-500">
                  Destination: <strong className="text-slate-800">{selectedOrder.deliveryDestination || selectedOrder.deliveryLocation || selectedOrder.buyerState}</strong>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Guaranteed Freight Fee</div>
                <div className="text-2xl font-black text-blue-800">
                  ₦{(logistics.agreedFreightFeeNGN || logistics.freightPriceNGN || selectedOrder.logisticsFeeNGN || selectedOrder.logisticsFreightNGN || 0).toLocaleString()} NGN
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                    logistics.status === 'ASSIGNED'
                      ? 'bg-slate-800 hover:bg-slate-900 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>1. Confirm Picked Up at Farm</span>
                </button>

                <button
                  type="button"
                  id="transporter-mark-in-transit"
                  onClick={handleMarkInTransit}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                    logistics.status === 'PICKED_UP'
                      ? 'bg-blue-700 hover:bg-blue-800 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>2. Log In-Transit Checkpoint</span>
                </button>

                <button
                  type="button"
                  id="transporter-mark-delivered"
                  onClick={handleMarkDelivered}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                    logistics.status === 'IN_TRANSIT'
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3. Mark Delivered at Facility</span>
                </button>
              </div>
            </div>

            {/* Vehicle & Driver Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[11px]">Truck Plate:</span>
                <div className="font-bold text-slate-900">{logistics.vehiclePlate || 'KMC-429-XA'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Reefer Type:</span>
                <div className="font-bold text-slate-900">{logistics.vehicleType || '15T Reefer Truck'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Digital Seal #:</span>
                <div className="font-mono font-bold text-emerald-700">{logistics.cargoSealNumber || 'SEAL-OK'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">GIT Policy:</span>
                <div className="font-mono font-bold text-blue-900">{logistics.gitPolicyNumber || 'LEADWAY-GIT'}</div>
              </div>
            </div>

            {/* Delivery Waybill Sign-off Notes */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Waybill Sign-off & Driver Notes</label>
              <textarea
                rows={2}
                value={waybillNotes}
                onChange={e => setWaybillNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Interactive Route Map */}
          <LogisticsMap
            logistics={logistics}
            onSelectCheckpoint={setSelectedCheckpoint}
            selectedCheckpointId={selectedCheckpoint?.id}
          />

          {/* Checkpoints Interactive Progression */}
          {logistics.checkpoints && logistics.checkpoints.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Checkpoint Milestone Management</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {logistics.checkpoints.filter(c => c.status === 'COMPLETED').length} / {logistics.checkpoints.length} Cleared
                </span>
              </div>

              <div className="space-y-3">
                {logistics.checkpoints.map((chk, idx) => (
                  <div
                    key={chk.id}
                    className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                      chk.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 border-blue-300'
                        : chk.status === 'COMPLETED'
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          chk.status === 'COMPLETED'
                            ? 'bg-emerald-600 text-white'
                            : chk.status === 'IN_PROGRESS'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {chk.status === 'COMPLETED' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{chk.name} ({chk.state})</div>
                        <div className="text-[11px] text-slate-500">{chk.timestamp || 'Pending Arrival'} {chk.notes ? `• ${chk.notes}` : ''}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {chk.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateCheckpoint(chk.id, 'IN_PROGRESS')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Mark Reached
                        </button>
                      )}
                      {chk.status === 'IN_PROGRESS' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateCheckpoint(chk.id, 'COMPLETED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Clear Checkpoint</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IoT Cold Chain Telemetry Card */}
          <ColdChainTelemetryCard
            logistics={logistics}
            canEdit={true}
            onUpdateTelemetry={(temp, notes) => {
              setCurrentTemp(temp);
              updateLogisticsTelemetry(selectedOrder.id, {
                temperatureCelsius: temp,
                driverNotes: notes,
              });
            }}
          />
        </div>
      </div>

      {/* Digital Waybill Modal */}
      <DigitalWaybillModal
        isOpen={isWaybillOpen}
        onClose={() => setIsWaybillOpen(false)}
        order={selectedOrder}
        logistics={logistics}
      />
    </div>
  );
};

