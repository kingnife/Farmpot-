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
  Search,
  Filter,
  Phone,
  MessageSquare,
  AlertCircle,
  Check,
  Eye,
  FileText,
  Radio,
  Sliders,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { LogisticsMap } from './LogisticsMap';
import { ColdChainTelemetryCard } from './ColdChainTelemetryCard';
import { DigitalWaybillModal } from './DigitalWaybillModal';
import { TransportJob, LogisticsCheckpoint, Order } from '../../types';

export const LogisticsTrackingHub: React.FC = () => {
  const {
    currentUser,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    updateLogisticsStatus,
    updateLogisticsCheckpoint,
    updateLogisticsTelemetry,
    startOrOpenConversation,
    setActiveView,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_TRANSIT' | 'PICKED_UP' | 'ASSIGNED' | 'DELIVERED'>('ALL');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<LogisticsCheckpoint | null>(null);
  const [isWaybillOpen, setIsWaybillOpen] = useState<boolean>(false);
  const [driverNotes, setDriverNotes] = useState<string>('');
  const [checkpointNoteInput, setCheckpointNoteInput] = useState<string>('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');

  // Filter orders that have transport logistics jobs
  const logisticsOrders = orders.filter(o => o.logistics !== undefined);

  // Active user role context
  const isTransporter = currentUser.role === 'TRANSPORTER';
  const isAdmin = currentUser.role === 'ADMIN';
  const isBuyer = currentUser.role === 'BUYER';
  const isFarmer = currentUser.role === 'FARMER';

  // Apply search & status filter
  const filteredOrders = logisticsOrders.filter(order => {
    const waybill = order.logistics?.waybillNumber || order.logistics?.deliveryWaybillNumber || '';
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      waybill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.logistics?.driverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.logistics?.vehiclePlate || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const logStatus = order.logistics?.status;
    if (statusFilter === 'IN_TRANSIT') return logStatus === 'IN_TRANSIT';
    if (statusFilter === 'PICKED_UP') return logStatus === 'PICKED_UP';
    if (statusFilter === 'ASSIGNED') return logStatus === 'ASSIGNED';
    if (statusFilter === 'DELIVERED') return logStatus === 'DELIVERED';

    return true;
  });

  // Selected Order
  const activeOrder =
    orders.find(o => o.id === selectedOrderId && o.logistics) ||
    filteredOrders[0] ||
    logisticsOrders[0];

  const activeLogistics = activeOrder?.logistics;

  const handleAdvanceStatus = (nextStatus: TransportJob['status']) => {
    if (!activeOrder) return;
    updateLogisticsStatus(activeOrder.id, nextStatus, {
      notes: driverNotes || `Logistics updated to ${nextStatus.replace(/_/g, ' ')}`,
      proofPhoto: proofPhotoUrl,
    });
  };

  const handleUpdateCheckpointStatus = (chkId: string, nextStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING') => {
    if (!activeOrder) return;
    updateLogisticsCheckpoint(
      activeOrder.id,
      chkId,
      nextStatus,
      checkpointNoteInput || undefined,
      activeLogistics?.temperatureCelsius
    );
    setCheckpointNoteInput('');
  };

  const handleChatWithDriver = () => {
    if (!activeOrder || !activeLogistics) return;
    startOrOpenConversation({
      orderId: activeOrder.id,
      targetUserId: activeLogistics.transporterId,
      targetUserName: activeLogistics.driverName || activeLogistics.transporterName,
      title: `Freight Delivery: ${activeOrder.product} (${activeOrder.id})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              National Agricultural Logistics & Freight Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Corridor Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time GPS telemetry, electronic waybills, cold-chain temperature sensors, and milestone checkpoints across Nigeria.
          </p>
        </div>

        {activeOrder && activeLogistics && (
          <button
            type="button"
            onClick={() => setIsWaybillOpen(true)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>Digital e-Waybill #{activeLogistics.waybillNumber || activeOrder.id}</span>
          </button>
        )}
      </div>

      {/* Corridor Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Waybill #, Order ID (FP-10245), Plate (KMC-429-XA), Farmer, or Buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-bold px-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {(['ALL', 'IN_TRANSIT', 'PICKED_UP', 'ASSIGNED', 'DELIVERED'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout: Left Shipment List (4 cols) & Right Telemetry Radar (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Freight Hauls (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Shipments ({filteredOrders.length})
            </h2>
            <span className="text-[11px] text-blue-600 font-semibold">Live Feed</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              No shipments found matching current filter.
            </div>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredOrders.map(order => {
                const isSelected = activeOrder?.id === order.id;
                const log = order.logistics;
                const isColdChain = (log?.temperatureCelsius || 0) > 0;

                return (
                  <div
                    key={order.id}
                    id={`shipment-card-${order.id}`}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {log?.waybillNumber || `WB-${order.id}`}
                      </span>
                      <StatusBadge status={log?.status || order.status} size="sm" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{order.product}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {order.quantity.toLocaleString()} {order.unit} • Grade {order.qualityGrade.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {order.supplierState} → {order.buyerState}
                        </span>
                        <span className="font-bold text-blue-800">
                          ₦{(log?.agreedFreightFeeNGN || log?.freightPriceNGN || order.logisticsFeeNGN || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span>Driver: <strong className="text-slate-700">{log?.driverName || 'Assigned Driver'}</strong></span>
                        {isColdChain && (
                          <span className="text-teal-600 font-bold flex items-center gap-0.5">
                            <Thermometer className="w-3 h-3" />
                            {log?.temperatureCelsius}°C
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map, Checkpoint Timeline & Controls (8 cols) */}
        {activeOrder && activeLogistics ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Shipment Summary Strip */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Waybill: {activeLogistics.waybillNumber || activeOrder.id}
                  </span>
                  <StatusBadge status={activeLogistics.status || activeOrder.status} size="md" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  {activeOrder.product} ({activeOrder.quantity.toLocaleString()} {activeOrder.unit})
                </h2>
                <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Origin: <strong className="text-slate-800">{activeLogistics.pickupLocation || activeOrder.supplierState}</strong></span>
                  <span>→</span>
                  <span>Destination: <strong className="text-slate-800">{activeLogistics.deliveryLocation || activeOrder.buyerState}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleChatWithDriver}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact Transporter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWaybillOpen(true)}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View e-Waybill</span>
                </button>
              </div>
            </div>

            {/* Interactive Logistics Map */}
            <LogisticsMap
              logistics={activeLogistics}
              onSelectCheckpoint={(chk) => setSelectedCheckpoint(chk)}
              selectedCheckpointId={selectedCheckpoint?.id}
            />

            {/* Checkpoint Milestone Progress Bar & Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <span>Corridor Checkpoint Milestones</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live transit logging through national inspection tolls and agricultural hubs.
                  </p>
                </div>

                <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {activeLogistics.checkpoints?.filter(c => c.status === 'COMPLETED').length || 1} of {activeLogistics.checkpoints?.length || 3} Completed
                </div>
              </div>

              {/* Checkpoint Timeline List */}
              <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeLogistics.checkpoints?.map((chk, index) => {
                  const isCompleted = chk.status === 'COMPLETED';
                  const isInProgress = chk.status === 'IN_PROGRESS';
                  const isPending = chk.status === 'PENDING';

                  return (
                    <div
                      key={chk.id}
                      id={`chk-item-${chk.id}`}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                        isInProgress
                          ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10'
                          : isCompleted
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-white border-slate-200 opacity-70'
                      }`}
                    >
                      {/* Checkpoint Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                      </div>

                      {/* Checkpoint Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{chk.name}</h4>
                          <div className="flex items-center gap-2">
                            {chk.temperatureC && (
                              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                {chk.temperatureC}°C
                              </span>
                            )}
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isInProgress
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {chk.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                          <span>State: <strong className="text-slate-700">{chk.state}</strong></span>
                          {chk.timestamp && <span>Time: <strong className="text-slate-700">{chk.timestamp}</strong></span>}
                          {chk.notes && <span className="italic text-slate-600">"{chk.notes}"</span>}
                        </div>

                        {/* Transporter / Admin Quick Checkpoint Actions */}
                        {(isTransporter || isAdmin) && (
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleUpdateCheckpointStatus(chk.id, 'IN_PROGRESS')}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Mark Entering Waypoint
                              </button>
                            )}
                            {isInProgress && (
                              <button
                                type="button"
                                onClick={() => handleUpdateCheckpointStatus(chk.id, 'COMPLETED')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Complete Checkpoint</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* IoT Cold Chain Telemetry Card */}
            <ColdChainTelemetryCard
              logistics={activeLogistics}
              canEdit={isTransporter || isAdmin}
              onUpdateTelemetry={(temp, notes) => {
                updateLogisticsTelemetry(activeOrder.id, {
                  temperatureCelsius: temp,
                  driverNotes: notes,
                });
              }}
            />

            {/* Transporter / Dispatch Control Console */}
            {(isTransporter || isAdmin) && (
              <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Transporter Dispatch Console</h3>
                      <p className="text-xs text-slate-400">Update freight status and delivery verification milestones</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800">
                    Driver Mode
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300">Driver Transit Log / Notes</label>
                  <input
                    type="text"
                    value={driverNotes}
                    onChange={(e) => setDriverNotes(e.target.value)}
                    placeholder="e.g., Transit through Lokoja bypass. Reefer operating smoothly at 11°C, seal intact."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Action Buttons based on current state */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {activeLogistics.status === 'ASSIGNED' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus('PICKED_UP')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Confirm Cargo Picked Up from Farmer</span>
                    </button>
                  )}

                  {activeLogistics.status === 'PICKED_UP' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus('IN_TRANSIT')}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start Haul (In-Transit)</span>
                    </button>
                  )}

                  {(activeLogistics.status === 'IN_TRANSIT' || activeLogistics.status === 'PICKED_UP') && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus('DELIVERED')}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Delivery at Consignee Dock</span>
                    </button>
                  )}

                  {activeLogistics.status === 'DELIVERED' && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Freight marked as Delivered! Awaiting Buyer destination quality confirmation.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buyer Delivery Action Card */}
            {isBuyer && activeLogistics.status === 'DELIVERED' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-900">
                      Produce Delivered at Your Dock!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Transporter has arrived with {activeOrder.quantity} {activeOrder.unit} of {activeOrder.product}. Please perform Quality Inspection to release Escrow.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('orders')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Quality Inspection & Escrow Release</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
            <Truck className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">No shipment selected</h3>
            <p className="text-xs text-slate-500">Select a freight assignment from the list on the left to track in real-time.</p>
          </div>
        )}
      </div>

      {/* Digital Waybill Modal */}
      {activeOrder && activeLogistics && (
        <DigitalWaybillModal
          isOpen={isWaybillOpen}
          onClose={() => setIsWaybillOpen(false)}
          order={activeOrder}
          logistics={activeLogistics}
        />
      )}
    </div>
  );
};
