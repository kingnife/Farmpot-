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
  ShieldAlert,
  Play,
  RotateCw,
  X,
  UserCheck
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
  const [corridorFilter, setCorridorFilter] = useState<string>('ALL');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<LogisticsCheckpoint | null>(null);
  const [isWaybillOpen, setIsWaybillOpen] = useState<boolean>(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [isPodModalOpen, setIsPodModalOpen] = useState<boolean>(false);
  const [driverNotes, setDriverNotes] = useState<string>('');
  const [checkpointNoteInput, setCheckpointNoteInput] = useState<string>('');
  const [podReceiverName, setPodReceiverName] = useState<string>('Alhaji Musa Dikko (Warehouse Manager)');
  const [podSealStatus, setPodSealStatus] = useState<'INTACT_VERIFIED' | 'DAMAGED'>('INTACT_VERIFIED');
  const [podRemarks, setPodRemarks] = useState<string>('Produce inspected at receiving dock. Temperature within spec, no transit rot.');
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
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
    if (statusFilter === 'IN_TRANSIT' && logStatus !== 'IN_TRANSIT') return false;
    if (statusFilter === 'PICKED_UP' && logStatus !== 'PICKED_UP') return false;
    if (statusFilter === 'ASSIGNED' && logStatus !== 'ASSIGNED') return false;
    if (statusFilter === 'DELIVERED' && logStatus !== 'DELIVERED') return false;

    if (corridorFilter !== 'ALL') {
      const routeStr = `${order.supplierState} → ${order.buyerState}`;
      if (!routeStr.includes(corridorFilter)) return false;
    }

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

  const handleSimulateTransit = () => {
    if (!activeOrder || !activeLogistics) return;
    setSimulationActive(true);

    // Find first non-completed checkpoint or simulate step
    const chks = activeLogistics.checkpoints || [];
    const pendingIdx = chks.findIndex(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS');

    if (pendingIdx !== -1) {
      const chk = chks[pendingIdx];
      updateLogisticsCheckpoint(
        activeOrder.id,
        chk.id,
        'COMPLETED',
        `Transit GPS waypoint confirmed via telemetry at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        11.4
      );

      // Advance overall logistics status if not in transit
      if (activeLogistics.status === 'ASSIGNED') {
        updateLogisticsStatus(activeOrder.id, 'PICKED_UP', { notes: 'Pickup completed at farm depot.' });
      } else if (activeLogistics.status === 'PICKED_UP') {
        updateLogisticsStatus(activeOrder.id, 'IN_TRANSIT', { notes: 'Cargo entered inter-state highway arterial.' });
      }
    } else {
      // All checkpoints passed, advance to delivered
      updateLogisticsStatus(activeOrder.id, 'DELIVERED', { notes: 'Arrived at consignee dock.' });
    }

    setTimeout(() => setSimulationActive(false), 800);
  };

  const handleCompletePod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    updateLogisticsStatus(activeOrder.id, 'DELIVERED', {
      notes: `Consignee POD Signed: ${podReceiverName} (Seal: ${podSealStatus}). ${podRemarks}`,
      proofPhoto: proofPhotoUrl,
    });
    setIsPodModalOpen(false);
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
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
              National Agricultural Logistics & Freight Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5]">
              Corridor Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            Real-time GPS telemetry, electronic waybills, cold-chain temperature sensors, and milestone checkpoints across Nigeria.
          </p>
        </div>

        {activeOrder && activeLogistics && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="simulate-transit-btn"
              onClick={handleSimulateTransit}
              disabled={simulationActive}
              className="px-3.5 py-2 bg-white border-1.5 border-[#334E1B] hover:bg-[#EDFFE0] text-[#334E1B] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Simulate GPS movement and progress checkpoints"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#334E1B] ${simulationActive ? 'animate-spin' : ''}`} />
              <span>Simulate Transit GPS</span>
            </button>

            <button
              type="button"
              id="open-waybill-btn"
              onClick={() => setIsWaybillOpen(true)}
              className="px-4 py-2 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Digital e-Waybill #{activeLogistics.waybillNumber || activeOrder.id}</span>
            </button>
          </div>
        )}
      </div>

      {/* Corridor Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Waybill #, Order ID (FP-10245), Plate (KMC-429-XA), Farmer, or Buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#1F1F1F] placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#334E1B]/20 focus:border-[#334E1B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-[#777777] font-bold px-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {(['ALL', 'IN_TRANSIT', 'PICKED_UP', 'ASSIGNED', 'DELIVERED'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                statusFilter === filter
                  ? 'bg-[#334E1B] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Corridor Route Fast Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-[#777777] font-semibold shrink-0">Corridor Routes:</span>
        {[
          { key: 'ALL', label: 'All Agro Corridors' },
          { key: 'Kaduna', label: 'Kaduna → Lagos (Grain & Tomato)' },
          { key: 'Benue', label: 'Benue → Port Harcourt (Yam & Citrus)' },
          { key: 'Kano', label: 'Kano → Ibadan (Groundnut & Onion)' },
          { key: 'Plateau', label: 'Jos → Abuja (Cold Vegetables)' },
        ].map(cor => (
          <button
            key={cor.key}
            type="button"
            onClick={() => setCorridorFilter(cor.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer border ${
              corridorFilter === cor.key
                ? 'bg-[#EDFFE0] text-[#334E1B] border-[#BEE7A5] font-bold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cor.label}
          </button>
        ))}
      </div>

      {/* Main Grid Layout: Left Shipment List (4 cols) & Right Telemetry Radar (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Freight Hauls (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#777777]">
              Active Shipments ({filteredOrders.length})
            </h2>
            <span className="text-[11px] text-[#334E1B] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#334E1B] animate-pulse" />
              Live Radar
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-stone-400 text-xs">
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
                        ? 'bg-[#EDFFE0]/30 border-[#334E1B] ring-2 ring-[#334E1B]/20 shadow-md'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#334E1B] bg-[#EDFFE0] px-2 py-0.5 rounded border border-[#BEE7A5]">
                        {log?.waybillNumber || `WB-${order.id}`}
                      </span>
                      <StatusBadge status={log?.status || order.status} size="sm" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#1F1F1F]">{order.product}</h3>
                      <div className="text-xs text-[#777777] mt-0.5">
                        {order.quantity.toLocaleString()} {order.unit} • Grade {order.qualityGrade.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-stone-600">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-[#334E1B]" />
                          {order.supplierState} → {order.buyerState}
                        </span>
                        <span className="font-bold text-[#334E1B]">
                          ₦{(log?.agreedFreightFeeNGN || log?.freightPriceNGN || order.logisticsFeeNGN || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#777777] flex items-center justify-between pt-1 border-t border-stone-200/60">
                        <span>Driver: <strong className="text-[#1F1F1F]">{log?.driverName || 'Assigned Driver'}</strong></span>
                        {isColdChain && (
                          <span className="text-[#334E1B] font-bold flex items-center gap-0.5">
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
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#334E1B] bg-[#EDFFE0] px-2.5 py-1 rounded-lg border border-[#BEE7A5]">
                    Waybill: {activeLogistics.waybillNumber || activeOrder.id}
                  </span>
                  <StatusBadge status={activeLogistics.status || activeOrder.status} size="md" />
                </div>
                <h2 className="text-lg font-bold text-[#1F1F1F] mt-2">
                  {activeOrder.product} ({activeOrder.quantity.toLocaleString()} {activeOrder.unit})
                </h2>
                <div className="text-xs text-[#777777] mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Origin: <strong className="text-[#1F1F1F]">{activeLogistics.pickupLocation || activeOrder.supplierState}</strong></span>
                  <span>→</span>
                  <span>Destination: <strong className="text-[#1F1F1F]">{activeLogistics.deliveryLocation || activeOrder.buyerState}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(true)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F1F1F] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#334E1B]" />
                  <span>Call Driver</span>
                </button>
                <button
                  type="button"
                  onClick={handleChatWithDriver}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F1F1F] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#334E1B]" />
                  <span>Chat Driver</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWaybillOpen(true)}
                  className="px-3.5 py-2 bg-[#EDFFE0] hover:bg-[#EDFFE0]/80 text-[#334E1B] border border-[#BEE7A5] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1F1F1F] flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#334E1B]" />
                    <span>Corridor Checkpoint Milestones</span>
                  </h3>
                  <p className="text-xs text-[#777777] mt-0.5">
                    Live transit logging through national inspection tolls and agricultural hubs.
                  </p>
                </div>

                <div className="text-xs font-bold text-[#334E1B] bg-[#EDFFE0] border border-[#BEE7A5] px-3 py-1 rounded-full">
                  {activeLogistics.checkpoints?.filter(c => c.status === 'COMPLETED').length || 1} of {activeLogistics.checkpoints?.length || 3} Completed
                </div>
              </div>

              {/* Checkpoint Timeline List */}
              <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
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
                          ? 'bg-[#EDFFE0]/50 border-[#BEE7A5] ring-2 ring-[#334E1B]/10'
                          : isCompleted
                          ? 'bg-stone-50/70 border-stone-200'
                          : 'bg-white border-stone-200 opacity-70'
                      }`}
                    >
                      {/* Checkpoint Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          isCompleted
                            ? 'bg-[#334E1B] text-white'
                            : isInProgress
                            ? 'bg-[#3F6B24] text-white animate-pulse'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                      </div>

                      {/* Checkpoint Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-[#1F1F1F]">{chk.name}</h4>
                          <div className="flex items-center gap-2">
                            {chk.temperatureC && (
                              <span className="text-xs font-mono font-bold text-[#334E1B] bg-[#EDFFE0] px-2 py-0.5 rounded border border-[#BEE7A5]">
                                {chk.temperatureC}°C
                              </span>
                            )}
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isCompleted
                                  ? 'bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5]'
                                  : isInProgress
                                  ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {chk.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-[#777777] flex flex-wrap items-center gap-3">
                          <span>State: <strong className="text-[#1F1F1F]">{chk.state}</strong></span>
                          {chk.timestamp && <span>Time: <strong className="text-[#1F1F1F]">{chk.timestamp}</strong></span>}
                          {chk.notes && <span className="italic text-stone-600">"{chk.notes}"</span>}
                        </div>

                        {/* Transporter / Admin Quick Checkpoint Actions */}
                        {(isTransporter || isAdmin) && (
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleUpdateCheckpointStatus(chk.id, 'IN_PROGRESS')}
                                className="px-3 py-1 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Mark Entering Waypoint
                              </button>
                            )}
                            {isInProgress && (
                              <button
                                type="button"
                                onClick={() => handleUpdateCheckpointStatus(chk.id, 'COMPLETED')}
                                className="px-3 py-1 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                    <Sliders className="w-5 h-5 text-[#EDFFE0]" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Transporter Dispatch Console</h3>
                      <p className="text-xs text-slate-400">Update freight status and delivery verification milestones</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#EDFFE0] bg-[#334E1B] px-2.5 py-1 rounded-lg border border-[#3F6B24]">
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
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#334E1B]"
                  />
                </div>

                {/* Action Buttons based on current state */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {activeLogistics.status === 'ASSIGNED' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus('PICKED_UP')}
                      className="px-5 py-2.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Confirm Cargo Picked Up from Farmer</span>
                    </button>
                  )}

                  {activeLogistics.status === 'PICKED_UP' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus('IN_TRANSIT')}
                      className="px-5 py-2.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start Haul (In-Transit)</span>
                    </button>
                  )}

                  {(activeLogistics.status === 'IN_TRANSIT' || activeLogistics.status === 'PICKED_UP') && (
                    <button
                      type="button"
                      onClick={() => setIsPodModalOpen(true)}
                      className="px-5 py-2.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Execute Delivery & Sign POD</span>
                    </button>
                  )}

                  {activeLogistics.status === 'DELIVERED' && (
                    <div className="p-3 bg-[#EDFFE0]/20 border border-[#BEE7A5] rounded-xl text-xs text-[#EDFFE0] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#EDFFE0]" />
                      <span>Freight marked as Delivered! POD recorded. Awaiting Buyer destination quality confirmation.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buyer Delivery Action Card */}
            {isBuyer && activeLogistics.status === 'DELIVERED' && (
              <div className="bg-[#EDFFE0] border border-[#BEE7A5] rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white text-[#334E1B] rounded-2xl border border-[#BEE7A5]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#334E1B]">
                      Produce Delivered at Your Dock!
                    </h3>
                    <p className="text-xs text-[#1F1F1F]">
                      Transporter has arrived with {activeOrder.quantity} {activeOrder.unit} of {activeOrder.product}. Please perform Quality Inspection to release Escrow.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('orders')}
                  className="px-5 py-2.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Quality Inspection & Escrow Release</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-400 space-y-3">
            <Truck className="w-12 h-12 mx-auto text-stone-300" />
            <h3 className="text-sm font-bold text-[#1F1F1F]">No shipment selected</h3>
            <p className="text-xs text-[#777777]">Select a freight assignment from the list on the left to track in real-time.</p>
          </div>
        )}
      </div>

      {/* Direct Driver Call Modal */}
      {isCallModalOpen && activeLogistics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F1F1F]">Direct Driver & Dispatch Contact</h3>
                  <p className="text-xs text-[#777777]">Freight Transit Assistance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCallModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#777777]">Assigned Driver:</span>
                <strong className="text-[#1F1F1F] font-bold">{activeLogistics.driverName || 'Kabiru Salisu'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#777777]">Fleet Operator:</span>
                <strong className="text-[#1F1F1F]">{activeLogistics.transporterName || 'Arewa Haulage Logistics Ltd'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#777777]">Vehicle Reg Plate:</span>
                <span className="font-mono font-bold text-[#334E1B] bg-[#EDFFE0] px-2 py-0.5 rounded">
                  {activeLogistics.vehiclePlate || 'KMC-429-XA'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#777777]">Direct Mobile:</span>
                <a
                  href={`tel:${activeLogistics.driverPhone || '+2348032914821'}`}
                  className="font-mono font-bold text-[#334E1B] hover:underline"
                >
                  {activeLogistics.driverPhone || '+234 803 291 4821'}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${activeLogistics.driverPhone || '+2348032914821'}`}
                className="flex-1 py-2.5 px-4 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Directly</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsCallModalOpen(false);
                  handleChatWithDriver();
                }}
                className="flex-1 py-2.5 px-4 bg-white border-1.5 border-[#334E1B] hover:bg-[#EDFFE0] text-[#334E1B] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open App Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof of Delivery (POD) Execution Modal */}
      {isPodModalOpen && activeOrder && activeLogistics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F1F1F]">Execute Proof of Delivery (POD)</h3>
                  <p className="text-xs text-[#777777]">Waybill #{activeLogistics.waybillNumber || activeOrder.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPodModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompletePod} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">
                  Receiving Consignee Official Name
                </label>
                <input
                  type="text"
                  required
                  value={podReceiverName}
                  onChange={(e) => setPodReceiverName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs text-[#1F1F1F] focus:ring-2 focus:ring-[#334E1B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">
                  Cargo Container Seal Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPodSealStatus('INTACT_VERIFIED')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer transition-all ${
                      podSealStatus === 'INTACT_VERIFIED'
                        ? 'bg-[#EDFFE0] border-[#334E1B] text-[#334E1B]'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#334E1B]" />
                      <span>Intact & Verified</span>
                    </div>
                    <span className="text-[10px] text-[#777777] font-normal block mt-1">
                      Seal #{activeLogistics.cargoSealNumber || 'NG-SEAL-892'} unbroken.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPodSealStatus('DAMAGED')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer transition-all ${
                      podSealStatus === 'DAMAGED'
                        ? 'bg-rose-50 border-rose-600 text-rose-700'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Tampered / Broken</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-1">
                      Flags dispute for security investigation.
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">
                  Arrival Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={podRemarks}
                  onChange={(e) => setPodRemarks(e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs text-[#1F1F1F] focus:ring-2 focus:ring-[#334E1B]"
                />
              </div>

              <div className="p-3 bg-[#EDFFE0]/50 border border-[#BEE7A5] rounded-xl flex items-center justify-between text-xs text-[#334E1B]">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#334E1B]" />
                  <span className="font-semibold">Stamped Waybill Photo Attached</span>
                </div>
                <span className="font-mono text-[10px] text-[#777777]">waybill_scan_doc.jpg</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPodModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dock Delivery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
