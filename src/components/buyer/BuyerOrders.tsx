import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Lock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Star,
  ShieldCheck,
  Building2,
  Calendar,
  MapPin,
  FileCheck2,
  Phone,
  ShieldAlert,
  ArrowLeft,
  Search,
  RotateCcw,
  SlidersHorizontal,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';
import { QualityInspectionModal } from './QualityInspectionModal';
import { DigitalWaybillModal } from '../logistics/DigitalWaybillModal';
import { Dropdown } from '../common/Dropdown';

export const BuyerOrders: React.FC = () => {
  const {
    orders,
    currentUser,
    selectedOrderId,
    setSelectedOrderId,
    processPayment,
    submitReview,
    users,
    setActiveView,
    startOrOpenConversation,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [productFilter, setProductFilter] = useState<string>('ALL');
  const [supplierFilter, setSupplierFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('NEWEST');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('Excellent high-brix Roma tomatoes. Exactly as specified in contract, cold-chain arrived intact.');

  const buyerOrders = useMemo(() => {
    return (orders || []).filter(
      o => o.buyerId === currentUser?.id || currentUser?.role === 'ADMIN'
    );
  }, [orders, currentUser]);

  // Derived filter options
  const productOptions = useMemo(() => [
    { value: 'ALL', label: 'All Commodities' },
    ...Array.from(new Set(buyerOrders.map(o => o.product))).map(p => ({
      value: p,
      label: p,
      badge: `${buyerOrders.filter(o => o.product === p).length}`,
    })),
  ], [buyerOrders]);

  const supplierOptions = useMemo(() => [
    { value: 'ALL', label: 'All Suppliers' },
    ...Array.from(new Set(buyerOrders.map(o => o.supplierName))).map(s => ({
      value: s,
      label: s,
      badge: `${buyerOrders.filter(o => o.supplierName === s).length}`,
    })),
  ], [buyerOrders]);

  const locationOptions = useMemo(() => {
    const states = Array.from(
      new Set(
        buyerOrders
          .map(o => (o as any).destinationState || o.buyerState || o.supplierState)
          .filter(Boolean)
      )
    );
    return [
      { value: 'ALL', label: 'All Locations' },
      ...states.map(st => ({
        value: st as string,
        label: `${st} State`,
      })),
    ];
  }, [buyerOrders]);

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PAYMENT_PENDING', label: 'Payment Pending', badge: 'Deposit' },
    { value: 'ESCROW_HELD', label: 'Escrow Held / Locked', badge: 'Vault' },
    { value: 'TRANSPORTER_ASSIGNED', label: 'Transporter Assigned', badge: 'Haulage' },
    { value: 'IN_TRANSIT', label: 'In Transit', badge: 'En Route' },
    { value: 'DELIVERED', label: 'Delivered', badge: 'Destination' },
    { value: 'ACCEPTED', label: 'Quality Accepted', badge: 'Inspected' },
    { value: 'COMPLETED', label: 'Settled & Completed', badge: 'Released' },
    { value: 'DISPUTED', label: 'Disputed', badge: 'Tribunal' },
  ];

  const deliveryOptions = [
    { value: 'ALL', label: 'All Delivery Terms' },
    { value: 'DESTINATION_DELIVERED', label: 'Destination Delivered' },
    { value: 'FARM_GATE_PICKUP', label: 'Farm Gate Pickup' },
  ];

  const sortOptions = [
    { value: 'NEWEST', label: 'Date: Newest First' },
    { value: 'OLDEST', label: 'Date: Oldest First' },
    { value: 'VALUE_HIGH', label: 'Value: High to Low' },
    { value: 'VALUE_LOW', label: 'Value: Low to High' },
    { value: 'QTY_HIGH', label: 'Quantity: High to Low' },
  ];

  const isFiltered =
    statusFilter !== 'ALL' ||
    productFilter !== 'ALL' ||
    supplierFilter !== 'ALL' ||
    locationFilter !== 'ALL' ||
    deliveryFilter !== 'ALL' ||
    sortBy !== 'NEWEST' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setProductFilter('ALL');
    setSupplierFilter('ALL');
    setLocationFilter('ALL');
    setDeliveryFilter('ALL');
    setSortBy('NEWEST');
    setSearchQuery('');
  };

  const filteredOrders = useMemo(() => {
    let list = buyerOrders.filter(o => {
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
      if (productFilter !== 'ALL' && o.product !== productFilter) return false;
      if (supplierFilter !== 'ALL' && o.supplierName !== supplierFilter) return false;

      const orderDestState = (o as any).destinationState || o.buyerState;
      if (
        locationFilter !== 'ALL' &&
        orderDestState !== locationFilter &&
        o.supplierState !== locationFilter
      ) {
        return false;
      }

      const orderDelivery =
        (o as any).deliveryTerms ||
        (o.logisticsFeeNGN > 0 ? 'DESTINATION_DELIVERED' : 'FARM_GATE_PICKUP');
      if (deliveryFilter !== 'ALL' && orderDelivery !== deliveryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          o.id.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.supplierName.toLowerCase().includes(q) ||
          (orderDestState && orderDestState.toLowerCase().includes(q)) ||
          (o.supplierState && o.supplierState.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'VALUE_HIGH') return (b.grandTotalNGN || 0) - (a.grandTotalNGN || 0);
      if (sortBy === 'VALUE_LOW') return (a.grandTotalNGN || 0) - (b.grandTotalNGN || 0);
      if (sortBy === 'QTY_HIGH') return (b.quantity || 0) - (a.quantity || 0);
      return 0;
    });
  }, [
    buyerOrders,
    statusFilter,
    productFilter,
    supplierFilter,
    locationFilter,
    deliveryFilter,
    sortBy,
    searchQuery,
  ]);

  const selectedOrder =
    filteredOrders.find(o => o.id === selectedOrderId) ||
    buyerOrders.find(o => o.id === selectedOrderId) ||
    filteredOrders[0] ||
    buyerOrders[0];

  const handlePayEscrow = (order: Order) => {
    processPayment(order.id, 'ESCROW_WALLET', order.grandTotalNGN);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    submitReview(selectedOrder.id, {
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: selectedOrder.supplierId,
      toUserName: selectedOrder.supplierName,
      rating,
      comment: reviewComment,
    });
    setShowReviewModal(false);
  };

  // State machine steps definition
  const orderSteps: { status: OrderStatus; label: string }[] = [
    { status: 'ORDER_CREATED', label: 'Agreement' },
    { status: 'ESCROW_HELD', label: 'Escrow Locked' },
    { status: 'TRANSPORTER_ASSIGNED', label: 'Dispatch' },
    { status: 'PICKED_UP', label: 'Picked Up' },
    { status: 'IN_TRANSIT', label: 'In Transit' },
    { status: 'DELIVERED', label: 'Delivered' },
    { status: 'ACCEPTED', label: 'Quality OK' },
    { status: 'COMPLETED', label: 'Settled' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    const idx = orderSteps.findIndex(s => s.status === status);
    if (idx !== -1) return idx;
    if (status === 'PAYMENT_PENDING') return 0;
    if (status === 'READY_FOR_PICKUP') return 2;
    if (status === 'QUALITY_PENDING') return 5;
    if (status === 'DISPUTED') return 6;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Procurement Orders & Escrow Lifecycle</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-party trade execution, Escrow custody, cold-chain logistics, and destination inspection.
          </p>
        </div>

        {/* Live Filter Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            Showing <strong className="text-[#334E1B] font-bold">{filteredOrders.length}</strong> of {buyerOrders.length} orders
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Procurement Interactive Filter Bar with Dropdowns */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-3">
        {/* Top row: Search + Primary Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, commodity, supplier, state..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#334E1B] focus:bg-white transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <Dropdown
            id="procurement-status-filter"
            align="left"
            menuClassName="w-60"
            trigger={isOpen => (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border select-none ${
                  statusFilter !== 'ALL'
                    ? 'bg-[#EDFFE0] border-[#BEE7A5] text-[#334E1B]'
                    : isOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">
                  {statusOptions.find(o => o.value === statusFilter)?.label || 'Status'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          {/* Commodity / Product Dropdown */}
          <Dropdown
            id="procurement-product-filter"
            align="left"
            menuClassName="w-56"
            trigger={isOpen => (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border select-none ${
                  productFilter !== 'ALL'
                    ? 'bg-[#EDFFE0] border-[#BEE7A5] text-[#334E1B]'
                    : isOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>Commodity:</span>
                <span className="truncate max-w-[100px] font-bold">
                  {productOptions.find(o => o.value === productFilter)?.label || 'All'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
            options={productOptions}
            value={productFilter}
            onChange={setProductFilter}
          />

          {/* Supplier Dropdown */}
          <Dropdown
            id="procurement-supplier-filter"
            align="left"
            menuClassName="w-60"
            trigger={isOpen => (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border select-none ${
                  supplierFilter !== 'ALL'
                    ? 'bg-[#EDFFE0] border-[#BEE7A5] text-[#334E1B]'
                    : isOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>Supplier:</span>
                <span className="truncate max-w-[110px] font-bold">
                  {supplierOptions.find(o => o.value === supplierFilter)?.label || 'All'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
            options={supplierOptions}
            value={supplierFilter}
            onChange={setSupplierFilter}
          />

          {/* Location Dropdown */}
          <Dropdown
            id="procurement-location-filter"
            align="left"
            menuClassName="w-56"
            trigger={isOpen => (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border select-none ${
                  locationFilter !== 'ALL'
                    ? 'bg-[#EDFFE0] border-[#BEE7A5] text-[#334E1B]'
                    : isOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[100px]">
                  {locationOptions.find(o => o.value === locationFilter)?.label || 'Location'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
            options={locationOptions}
            value={locationFilter}
            onChange={setLocationFilter}
          />

          {/* Delivery Terms Dropdown */}
          <Dropdown
            id="procurement-delivery-filter"
            align="right"
            menuClassName="w-64"
            trigger={isOpen => (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border select-none ${
                  deliveryFilter !== 'ALL'
                    ? 'bg-[#EDFFE0] border-[#BEE7A5] text-[#334E1B]'
                    : isOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">
                  {deliveryOptions.find(o => o.value === deliveryFilter)?.label || 'Logistics'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
            options={deliveryOptions}
            value={deliveryFilter}
            onChange={setDeliveryFilter}
          />

          {/* Sort By Dropdown */}
          <Dropdown
            id="procurement-sort-by-filter"
            align="right"
            menuClassName="w-56"
            trigger={isOpen => (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border select-none ${
                  sortBy !== 'NEWEST'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 font-bold'
                    : isOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[110px]">
                  {sortOptions.find(o => o.value === sortBy)?.label || 'Sort'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      {buyerOrders.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <PackageCheck className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No procurement orders yet</h3>
          <p className="text-xs text-slate-400">
            Publish a demand request or negotiate produce from the marketplace to create your first order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Orders List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Active Orders ({filteredOrders.length})
            </h2>

            <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    id={`order-card-${order.id}`}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
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
                      <span className="text-xs font-black text-slate-900">
                        ₦{(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between">
                      <span>
                        Supplier: <strong className="text-slate-700">{order.supplierName}</strong>
                      </span>
                      <span>
                        {order.quantity} {order.unit}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        Escrow: {order.escrow.status.replace(/_/g, ' ')}
                      </span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Order Details & State Machine (7 Cols) */}
          {selectedOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedOrder.id}
                    </span>
                    <StatusBadge status={selectedOrder.status} size="md" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedOrder.product}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supplier: <strong className="text-slate-800">{selectedOrder.supplierName}</strong> ({selectedOrder.supplierState} State)
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Total Escrow Value</div>
                    <div className="text-2xl font-black text-emerald-800">
                      ₦{(selectedOrder.grandTotalNGN || selectedOrder.produceTotalNGN || 0).toLocaleString()} NGN
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {(selectedOrder.quantity || 0).toLocaleString()} {selectedOrder.unit} @ ₦{(selectedOrder.pricePerUnit || 0).toLocaleString()}/{selectedOrder.unit}
                    </div>
                  </div>

                  {/* Order Actions Dropdown Menu */}
                  <Dropdown
                    id={`order-actions-dropdown-${selectedOrder.id}`}
                    align="right"
                    menuClassName="w-64 p-1.5"
                    trigger={isOpen => (
                      <div
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                          isOpen
                            ? 'bg-slate-100 border-slate-300 text-slate-900 ring-2 ring-slate-200'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-[#334E1B]" />
                        <span>Order Options</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  >
                    {({ close }) => (
                      <div className="space-y-1">
                        <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#777777] border-b border-slate-100">
                          Order Operations
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsWaybillOpen(true);
                            close();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 cursor-pointer text-slate-800"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Digital Waybill & Manifest</span>
                        </button>

                        {['DELIVERED', 'QUALITY_PENDING', 'IN_TRANSIT'].includes(selectedOrder.status) && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsInspectionOpen(true);
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 hover:bg-[#EDFFE0] cursor-pointer text-[#334E1B]"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>Inspect Delivery & Quality</span>
                          </button>
                        )}

                        {selectedOrder.status === 'PAYMENT_PENDING' && (
                          <button
                            type="button"
                            onClick={() => {
                              handlePayEscrow(selectedOrder);
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 hover:bg-[#EDFFE0] cursor-pointer text-[#334E1B]"
                          >
                            <Lock className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>Deposit Escrow Funds</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            startOrOpenConversation({
                              orderId: selectedOrder.id,
                              targetUserId: selectedOrder.supplierId,
                              targetUserName: selectedOrder.supplierName,
                              title: `Order #${selectedOrder.id}: ${selectedOrder.product}`,
                            });
                            close();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 cursor-pointer text-slate-800"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Direct Message Supplier</span>
                        </button>

                        {selectedOrder.status === 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewModal(true);
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 hover:bg-amber-50 cursor-pointer text-amber-800"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                            <span>Submit Supplier Review</span>
                          </button>
                        )}

                        {!['COMPLETED', 'DISPUTED', 'CANCELLED'].includes(selectedOrder.status) && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsInspectionOpen(true);
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 hover:bg-rose-50 cursor-pointer text-rose-700 border-t border-slate-100 mt-1 pt-2"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Flag Defect / Raise Dispute</span>
                          </button>
                        )}
                      </div>
                    )}
                  </Dropdown>
                </div>
              </div>

              {/* State Machine Stepper Visualizer */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Agricultural Supply Chain Execution Lifecycle
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center">
                  {orderSteps.map((st, sIdx) => {
                    const currentIdx = getStepIndex(selectedOrder.status);
                    const isPassed = sIdx <= currentIdx;
                    const isCurrent = sIdx === currentIdx;

                    return (
                      <div key={st.status} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs'
                              : isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-medium mt-1 leading-tight ${
                            isCurrent ? 'font-bold text-emerald-800' : 'text-slate-500'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Toolbar for Order Transitions */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">Next Required Action:</span>
                  <span className="text-xs font-mono text-emerald-800">
                    State: {selectedOrder.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Action 1: Fund Escrow */}
                  {selectedOrder.status === 'PAYMENT_PENDING' && (
                    <button
                      type="button"
                      id="order-fund-escrow-btn"
                      onClick={() => handlePayEscrow(selectedOrder)}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Deposit ₦{(selectedOrder.grandTotalNGN || selectedOrder.produceTotalNGN || 0).toLocaleString()} into Escrow Vault</span>
                    </button>
                  )}

                  {/* Action 2: Inspect Quality on Delivery */}
                  {['DELIVERED', 'QUALITY_PENDING', 'IN_TRANSIT'].includes(selectedOrder.status) && (
                    <button
                      type="button"
                      id="order-inspect-quality-btn"
                      onClick={() => setIsInspectionOpen(true)}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Inspect Quality & Release Escrow</span>
                    </button>
                  )}

                  {/* Action 3: Review */}
                  {selectedOrder.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Submit Trade Rating & Review</span>
                    </button>
                  )}

                  {/* Action 4: Dispute trigger */}
                  {!['COMPLETED', 'DISPUTED', 'CANCELLED'].includes(selectedOrder.status) && (
                    <button
                      type="button"
                      onClick={() => setIsInspectionOpen(true)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report Problem / Dispute</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Escrow Vault Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Escrow Card */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      FarmPot Escrow Vault
                    </span>
                    <StatusBadge status={selectedOrder.escrow.status} size="sm" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span>Produce Allocation:</span>
                      <span className="font-semibold text-slate-800">
                        ₦{(selectedOrder.escrow.produceAmountNGN || selectedOrder.produceTotalNGN || 0).toLocaleString()} NGN
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logistics Allocation:</span>
                      <span className="font-semibold text-slate-800">
                        ₦{(selectedOrder.escrow.logisticsAmountNGN || selectedOrder.logisticsFeeNGN || 0).toLocaleString()} NGN
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custody Fee (2%):</span>
                      <span className="font-semibold text-slate-800">
                        ₦{(selectedOrder.escrow.platformFeeNGN || selectedOrder.platformFeeNGN || 0).toLocaleString()} NGN
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>Total Held in Custody:</span>
                      <span>₦{(selectedOrder.escrow.totalHeldNGN || selectedOrder.grandTotalNGN || 0).toLocaleString()} NGN</span>
                    </div>
                  </div>
                </div>

                {/* Transporter & Logistics Card */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Cold-Chain Haulage
                    </span>
                    {selectedOrder.logistics && (
                      <StatusBadge status={selectedOrder.logistics.status} size="sm" />
                    )}
                  </div>

                  {selectedOrder.logistics ? (
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Hauler:</span>
                          <span className="font-semibold text-slate-800">{selectedOrder.logistics.transporterName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vehicle / Plate:</span>
                          <span className="font-semibold text-slate-800">{selectedOrder.logistics.vehiclePlate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Waybill #:</span>
                          <span className="font-mono font-bold text-blue-800">{selectedOrder.logistics.waybillNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reefer Temp:</span>
                          <span className="font-semibold text-blue-600">{selectedOrder.logistics.temperatureCelsius}°C</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(selectedOrder.id);
                            setActiveView('logistics');
                          }}
                          className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track GPS Route</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsWaybillOpen(true)}
                          className="py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Waybill</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 py-2">
                      Transporter will be matched automatically upon Escrow lock.
                    </div>
                  )}
                </div>
              </div>

              {/* Produce & Contract Specs */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contract Specifications
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">Commodity & Variety</div>
                    <div className="font-semibold text-slate-800">{selectedOrder.product}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Contract Volume</div>
                    <div className="font-semibold text-slate-800">{selectedOrder.quantity} {selectedOrder.unit}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Agreed Quality Grade</div>
                    <div className="font-semibold text-slate-800">Grade {selectedOrder.qualityGrade.replace('_', ' ')}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-slate-400 text-[11px]">Destination Facility Address</div>
                    <div className="font-semibold text-slate-800">{selectedOrder.deliveryDestination}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Estimated Delivery</div>
                    <div className="font-semibold text-slate-800">{selectedOrder.deliveryDate}</div>
                  </div>
                </div>
              </div>

              {/* Quality Inspection Report (if done) */}
              {selectedOrder.qualityInspection && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Verified Destination Quality Inspection Certificate
                    </span>
                    <span className="text-emerald-700 font-semibold">PASSED</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-emerald-900 pt-1">
                    <div>
                      Received Volume: <strong>{selectedOrder.qualityInspection.receivedQuantity} {selectedOrder.unit}</strong>
                    </div>
                    <div>
                      Tested Grade: <strong>{selectedOrder.qualityInspection.actualGrade.replace('_', ' ')}</strong>
                    </div>
                    <div>
                      Defect Rate: <strong>{selectedOrder.qualityInspection.defectPercentage}%</strong>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-800 italic pt-1">
                    "{selectedOrder.qualityInspection.notes}"
                  </div>
                </div>
              )}

              {/* Audit Timeline / History */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Audit Trail & Event History
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.historyTimeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <strong className="text-slate-800">{item.action}</strong>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quality Inspection Modal */}
      <QualityInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        order={selectedOrder}
      />

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Rate Trade with {selectedOrder.supplierName}
            </h3>
            <p className="text-xs text-slate-500">
              Your feedback updates the farmer's deterministic Trust Score across the Nigerian network.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRating(st)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          st <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Review Comments</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Waybill Modal */}
      {selectedOrder && selectedOrder.logistics && (
        <DigitalWaybillModal
          isOpen={isWaybillOpen}
          onClose={() => setIsWaybillOpen(false)}
          order={selectedOrder}
          logistics={selectedOrder.logistics}
        />
      )}
    </div>
  );
};
