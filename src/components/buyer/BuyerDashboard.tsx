import React from 'react';
import {
  PlusCircle,
  Store,
  Sparkles,
  PackageCheck,
  TrendingUp,
  Truck,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Lock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Check,
  User as UserIcon,
  Building2,
  Landmark,
  FileText,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BuyerCategoryType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';

interface BuyerDashboardProps {
  onOpenCreateRequest: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onOpenCreateRequest }) => {
  const {
    currentUser,
    demandRequests,
    orders,
    listings,
    setActiveView,
    setSelectedOrderId,
    setSelectedRequestId,
    marketPrices,
    topMatchingSuppliers,
    setIsBuyerTypeModalOpen,
  } = useApp();

  const buyerCategory: BuyerCategoryType =
    (currentUser?.buyerTypeCategory as BuyerCategoryType) ||
    (currentUser?.buyer_type as BuyerCategoryType) ||
    'business';

  const buyerRequests = (demandRequests || []).filter(r => r.buyerId === currentUser?.id);
  const buyerOrders = (orders || []).filter(o => o.buyerId === currentUser?.id);
  const activeOrder = buyerOrders.find(o => !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status)) || buyerOrders[0];

  const getInitials = (name?: string) => {
    if (!name) return 'FP';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'FP';
  };

  // Step stages for the active order stepper
  const orderSteps = [
    { key: 'AGREEMENT', label: 'Agreement', active: true },
    { key: 'PAYMENT', label: 'Payment', active: activeOrder?.escrow?.status === 'FUNDS_HELD' || activeOrder?.escrow?.status === 'RELEASED' },
    { key: 'TRANSIT', label: 'Transit', active: ['IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'COMPLETED'].includes(activeOrder?.status || '') },
    { key: 'DELIVERY', label: 'Delivery', active: ['DELIVERED', 'ACCEPTED', 'COMPLETED'].includes(activeOrder?.status || '') },
    { key: 'SETTLEMENT', label: 'Settlement', active: activeOrder?.status === 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* BUYER CATEGORY PERSONALIZATION BANNER                             */}
      {/* ================================================================= */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-[#EDFFE0] border border-[#334E1B]/20">
            {buyerCategory === 'personal' ? '👤' : buyerCategory === 'business' ? '🏢' : '🏛️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EDFFE0] text-[#334E1B] border border-[#334E1B]/30">
                {buyerCategory === 'personal'
                  ? 'Personal Buyer'
                  : buyerCategory === 'business'
                  ? 'Business Buyer'
                  : 'Organization / Institution'}
              </span>
              <span className="text-xs text-[#777777] font-medium hidden sm:inline">
                · Customized FarmPot Experience
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#1F1F1F] mt-0.5">
              {buyerCategory === 'personal'
                ? `Welcome back, ${currentUser.name} · Household Produce Hub`
                : buyerCategory === 'business'
                ? `${currentUser.businessName || 'Lagos Fresh Processing'} · Commercial Sourcing Portal`
                : `${currentUser.organizationName || currentUser.businessName || 'Institutional Healthcare'} · Bulk Procurement`}
            </h1>
            <p className="text-xs text-[#555555]">
              {buyerCategory === 'personal'
                ? 'Prioritizing simple product discovery, individual pack sizes (kg, baskets, tubers), and swift doorstep delivery.'
                : buyerCategory === 'business'
                ? 'Prioritizing bulk commercial procurement (MT), recurring contract schedules, and supplier-direct trade invoices.'
                : 'Prioritizing institutional multi-hub requisitions, audited documentation, and community feeding programs.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="buyer-dashboard-change-classification-btn"
            onClick={() => setIsBuyerTypeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-[#334E1B]/40 hover:bg-[#EDFFE0]/50 text-[#334E1B] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Change Buyer Type</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateRequest}
            className="px-3.5 py-2 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{buyerCategory === 'personal' ? 'Custom Produce Request' : 'New Procurement Request'}</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* CATEGORY-SPECIFIC QUICK ACTIONS & PRIORITY MODULES                */}
      {/* ================================================================= */}
      {buyerCategory === 'personal' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveView('browse')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Everyday Produce Baskets
            </div>
            <div className="text-[10px] text-slate-500">Tomatoes, peppers & tubers</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('orders')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Doorstep Deliveries
            </div>
            <div className="text-[10px] text-slate-500">Live order & transit status</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('wallet')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Escrow Protection
            </div>
            <div className="text-[10px] text-slate-500">Refund guarantee on delivery</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('profile')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <UserIcon className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Delivery Preferences
            </div>
            <div className="text-[10px] text-slate-500">Address & payment methods</div>
          </button>
        </div>
      )}

      {buyerCategory === 'business' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveView('browse')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Bulk Grain & Produce (MT)
            </div>
            <div className="text-[10px] text-slate-500">Wholesale direct from farms</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('contracts')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Scheduled Recurring Supply
            </div>
            <div className="text-[10px] text-slate-500">Bi-weekly factory drops</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('orders')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Invoices & Trade Receipts
            </div>
            <div className="text-[10px] text-slate-500">Audited procurement logs</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('matching')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Supplier Direct Verification
            </div>
            <div className="text-[10px] text-slate-500">Tier 2 verified aggregators</div>
          </button>
        </div>
      )}

      {buyerCategory === 'organization' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveView('my-requests')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Institutional Requisitions
            </div>
            <div className="text-[10px] text-slate-500">School & hospital food supply</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('logistics')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Multi-Facility Dispatch
            </div>
            <div className="text-[10px] text-slate-500">Direct commissary drops</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('orders')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Audit Trail Documentation
            </div>
            <div className="text-[10px] text-slate-500">Compliance receipts & certificates</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('contracts')}
            className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#334E1B] hover:bg-[#EDFFE0]/30 transition-all text-left group cursor-pointer"
          >
            <Landmark className="w-4 h-4 text-[#334E1B] mb-2" />
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#334E1B]">
              Committee Approval Board
            </div>
            <div className="text-[10px] text-slate-500">Dual-signatory procurement</div>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* MAIN TWO-COLUMN DASHBOARD CONTENT                                 */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Order & Matching Recommendations */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Order Card */}
          {activeOrder ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                      Active Order: #{activeOrder.id}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Transaction between {currentUser.businessName || currentUser.name} & {activeOrder.supplierName}, {activeOrder.supplierState}
                  </p>
                </div>
                <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wide border border-amber-200">
                  {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[11px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Produce</span>
                  <span className="font-semibold text-sm text-slate-900 truncate block">{activeOrder.product}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[11px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Quantity</span>
                  <span className="font-semibold text-sm text-slate-900 truncate block">
                    {(activeOrder.quantity || 0).toLocaleString()} {activeOrder.unit} (Grade {(activeOrder.qualityGrade || '').replace('_', ' ')})
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[11px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Total Price</span>
                  <span className="font-semibold text-sm text-slate-900 font-mono block">
                    ₦{(activeOrder.grandTotalNGN || activeOrder.produceTotalNGN || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-[#EDFFE0] rounded-xl border border-[#BEE7A5] text-center">
                  <span className="block text-[11px] text-[#334E1B] uppercase font-bold mb-1 tracking-wider">Escrow Status</span>
                  <span className="font-bold text-sm text-[#334E1B] block">
                    {activeOrder.escrow?.status === 'FUNDS_HELD' ? 'Funds Held' : (activeOrder.escrow?.status || 'PENDING').replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Sleek Milestone Stepper */}
              <div className="relative px-2 sm:px-6 my-2">
                <div className="absolute top-2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2"></div>
                <div
                  className="absolute top-2 left-6 h-1 bg-[#334E1B] -translate-y-1/2 transition-all duration-500"
                  style={{
                    width: `${
                      activeOrder.status === 'COMPLETED'
                        ? 100
                        : ['DELIVERED', 'ACCEPTED'].includes(activeOrder.status)
                        ? 75
                        : ['IN_TRANSIT', 'PICKED_UP'].includes(activeOrder.status)
                        ? 50
                        : activeOrder.escrow?.status === 'FUNDS_HELD'
                        ? 25
                        : 0
                    }%`,
                  }}
                ></div>

                <div className="relative flex justify-between">
                  {orderSteps.map((step) => (
                    <div key={step.key} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ring-4 ring-white transition-colors ${
                          step.active ? 'bg-[#334E1B]' : 'bg-slate-300'
                        }`}
                      ></div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          step.active ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderId(activeOrder.id);
                    setActiveView('orders');
                  }}
                  className="text-xs font-bold text-[#334E1B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Order Details & Escrow Certificate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('logistics')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track GPS Transit</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-800">No Orders in Active Transit</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {buyerCategory === 'personal'
                  ? 'Browse fresh commodities in personal pack sizes to place your next delivery.'
                  : 'Post a procurement demand request to receive verified farm offers directly.'}
              </p>
              <button
                type="button"
                onClick={() => setActiveView('browse')}
                className="px-4 py-2 bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Browse Available Commodities →
              </button>
            </div>
          )}

          {/* Commodity Matches Customized to Buyer Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {buyerCategory === 'personal'
                    ? 'Recommended Fresh Produce Near You'
                    : buyerCategory === 'business'
                    ? 'Top Matching Commercial Agro Suppliers'
                    : 'Institutional Bulk Produce Lots'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {buyerCategory === 'personal'
                    ? 'Everyday kitchen items with quick local fulfillment'
                    : 'Verified commercial farms matching your target crops & scale'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('browse')}
                className="text-xs font-bold text-[#334E1B] hover:underline cursor-pointer"
              >
                View Full Marketplace →
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {(listings || []).slice(0, 3).map((item, idx) => {
                const supplierState = item.farmerState || item.state || 'Kano';
                const trustScores = [96, 91, 88];

                // Scale display according to buyer type
                const displayQty =
                  buyerCategory === 'personal'
                    ? `${idx === 0 ? '10 KG Basket' : idx === 1 ? '25 KG Sack' : '50 Tubers'}`
                    : `${item.quantity} ${(item.unit || 'KG').replace('_', ' ')}`;

                const displayPrice =
                  buyerCategory === 'personal'
                    ? idx === 0 ? '₦ 9,500' : idx === 1 ? '₦ 28,000' : '₦ 35,000'
                    : `₦${(item.pricePerUnit || 0).toLocaleString()}/${(item.unit || 'unit').replace('_', ' ')}`;

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveView('matching')}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#334E1B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5]">
                        {getInitials(item.farmerName || 'Supplier')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">
                          {item.farmerName}, {supplierState}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {98 - idx * 6}% Match · {displayQty} {item.product} ({(item.qualityGrade || 'GRADE_A').replace('_', ' ')})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {displayPrice}
                      </span>
                      <div className="px-2 py-0.5 bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5] text-[10px] font-bold rounded uppercase">
                        Verified Trust {trustScores[idx] || 90}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Aside 4 Cols: Deep Luxury Emerald Supplier Profile & Market Intelligence */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* FarmPot Deep Green Luxury Supplier Card */}
          <div className="bg-[#334E1B] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-[#3F6B24]">
            <div className="relative z-10">
              <span className="text-xs font-bold text-[#EDFFE0] uppercase tracking-widest block mb-4">
                Featured Verified Producer
              </span>
              <h3 className="text-2xl font-bold mb-1 tracking-tight">Al-Hassan Farms</h3>
              <p className="text-[#EDFFE0]/90 text-sm mb-6 leading-relaxed">
                Specializing in Dry-Season Tomatoes, Maize and Pepper. Bagwai LGA, Kano State.
              </p>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#EDFFE0]/80">Trust Score</span>
                  <span className="text-xl font-bold text-white">
                    94<span className="text-sm text-[#EDFFE0] font-normal">/100</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-[#EDFFE0] rounded-full"></div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#EDFFE0]/90">
                    <span className="text-[#EDFFE0] font-bold">✓</span> Government Identity Verified (NIN/CAC)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#EDFFE0]/90">
                    <span className="text-[#EDFFE0] font-bold">✓</span> 102 Successful Deliveries Settled
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#EDFFE0]/90">
                    <span className="text-[#EDFFE0] font-bold">✓</span> Zero Quality Disputes on Record
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Market Intelligence Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 shadow-sm flex flex-col">
            <h4 className="font-bold text-slate-800 mb-4 text-base">Market Price Intelligence</h4>

            <div className="flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Avg. Price Tomatoes (Grade A)</span>
                <span className="font-bold text-[#334E1B] font-mono text-sm">
                  ₦ 910/kg <span className="text-[10px] text-[#3F6B24]">↑ 4%</span>
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Regional Demand Level</span>
                <span className="font-bold text-[#3F6B24] uppercase text-xs">High</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Active Transporters (Kano)</span>
                <span className="font-bold text-slate-800 font-mono text-sm">142 Trucks</span>
              </div>

              <div className="mt-auto pt-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Actions</p>
                  <button
                    type="button"
                    id="buyer-sidebar-create-demand-btn"
                    onClick={onOpenCreateRequest}
                    className="w-full py-2.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer"
                  >
                    {buyerCategory === 'personal' ? 'Request Fresh Produce' : 'Create Procurement Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('logistics')}
                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    Contact Logistics Fleet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
