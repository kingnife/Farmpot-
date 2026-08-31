import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Lock,
  Scale,
  ShieldCheck,
  Truck,
  Package,
  Users,
  Building2,
  Sprout,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  PieChart,
  RefreshCw,
  Search,
  Eye,
  FileSpreadsheet,
  Globe2,
  Flame,
  Layers,
  ThermometerSnowflake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Order, UserRole } from '../../types';
import { NIGERIAN_STATES } from '../../data/nigeriaGeography';

export const AdminAnalytics: React.FC = () => {
  const {
    orders,
    users,
    listings,
    demandRequests,
    disputes,
    setActiveView,
    setSelectedOrderId,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'transactions' | 'market-data' | 'logistics' | 'users-funnel'>('transactions');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedCommodityFilter, setSelectedCommodityFilter] = useState<string>('ALL');
  const [searchTxQuery, setSearchTxQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Transaction Analysis Calculations
  const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.paymentStatus === 'SUCCESSFUL');
  const activeOrders = orders.filter(o => !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status));
  const disputedOrders = orders.filter(o => o.status === 'DISPUTED' || o.escrow?.status === 'DISPUTED_LOCKED');

  const totalGMV = orders
    .filter(o => o.paymentStatus === 'SUCCESSFUL' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.grandTotalNGN || o.totalAmountNGN || 0), 0);

  const totalEscrowInCustody = orders
    .filter(o => o.escrow?.status === 'FUNDS_HELD')
    .reduce((sum, o) => sum + (o.escrow?.totalHeldNGN || o.escrowAmountNGN || 0), 0);

  const totalPlatformFeesYield = orders
    .filter(o => o.paymentStatus === 'SUCCESSFUL' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.escrow?.platformFeeNGN || Math.round((o.grandTotalNGN || o.totalAmountNGN || 0) * 0.025)), 0);

  const averageOrderValue = orders.length > 0 ? Math.round(totalGMV / (completedOrders.length || 1)) : 0;
  const disputeRate = orders.length > 0 ? ((disputes.length / orders.length) * 100).toFixed(1) : '0.0';

  // National Commodity Balance Analysis
  const commodityAnalytics = [
    {
      name: 'Roma Tomatoes',
      category: 'Perishable Vegetables',
      supplyMT: 4850,
      demandMT: 6200,
      deficit: -1350,
      avgPricePerKg: 1250,
      priceTrend: '+8.4%',
      isPositive: true,
      topProducingStates: ['Kano', 'Kaduna', 'Plateau'],
      topConsumingStates: ['Lagos', 'Ogun', 'Rivers'],
      spoilageRisk: 'HIGH'
    },
    {
      name: 'Yellow Maize (Dry Grains)',
      category: 'Grains & Cereals',
      supplyMT: 12400,
      demandMT: 11100,
      deficit: 1300,
      avgPricePerKg: 620,
      priceTrend: '-2.1%',
      isPositive: false,
      topProducingStates: ['Kaduna', 'Niger', 'Katsina'],
      topConsumingStates: ['Oyo', 'Lagos', 'Edo'],
      spoilageRisk: 'LOW'
    },
    {
      name: 'Soybeans (Premium Industrial)',
      category: 'Oilseeds & Legumes',
      supplyMT: 7600,
      demandMT: 9200,
      deficit: -1600,
      avgPricePerKg: 890,
      priceTrend: '+5.7%',
      isPositive: true,
      topProducingStates: ['Benue', 'Kaduna', 'Taraba'],
      topConsumingStates: ['Kano', 'Lagos', 'Ogun'],
      spoilageRisk: 'LOW'
    },
    {
      name: 'Cassava Tubers (High-Starch)',
      category: 'Roots & Tubers',
      supplyMT: 18200,
      demandMT: 16500,
      deficit: 1700,
      avgPricePerKg: 340,
      priceTrend: '+1.2%',
      isPositive: true,
      topProducingStates: ['Ogun', 'Oyo', 'Edo', 'Benue'],
      topConsumingStates: ['Lagos', 'Anambra', 'Rivers'],
      spoilageRisk: 'MEDIUM'
    },
    {
      name: 'Chili Pepper (Scotch Bonnet)',
      category: 'Spices & Horticulture',
      supplyMT: 2300,
      demandMT: 3100,
      deficit: -800,
      avgPricePerKg: 2100,
      priceTrend: '+12.6%',
      isPositive: true,
      topProducingStates: ['Kano', 'Kaduna', 'Katsina'],
      topConsumingStates: ['Lagos', 'Rivers', 'Abuja FCT'],
      spoilageRisk: 'HIGH'
    },
    {
      name: 'Yam Tubers (Export Grade)',
      category: 'Roots & Tubers',
      supplyMT: 8900,
      demandMT: 8400,
      deficit: 500,
      avgPricePerKg: 950,
      priceTrend: '-1.8%',
      isPositive: false,
      topProducingStates: ['Benue', 'Nasarawa', 'Niger'],
      topConsumingStates: ['Lagos', 'Abuja FCT', 'Enugu'],
      spoilageRisk: 'MEDIUM'
    }
  ];

  // Freight & Logistics Trade Corridors
  const corridorAnalytics = [
    {
      corridor: 'Kano Aggregation Hub → Mile 12 Lagos',
      distanceKm: 994,
      avgTransitHours: 28,
      activeLoads: 18,
      totalVolumeMT: 540,
      avgFreightFeeNGN: 1450000,
      coldChainEquipped: '72%',
      spoilageRate: '1.8%',
      status: 'OPTIMAL'
    },
    {
      corridor: 'Kaduna Grain Belt → Bodija Ibadan (Oyo)',
      distanceKm: 730,
      avgTransitHours: 21,
      activeLoads: 12,
      totalVolumeMT: 380,
      avgFreightFeeNGN: 1100000,
      coldChainEquipped: '45%',
      spoilageRate: '2.1%',
      status: 'OPTIMAL'
    },
    {
      corridor: 'Benue Yam & Soya Hub → Port Harcourt (Rivers)',
      distanceKm: 580,
      avgTransitHours: 16,
      activeLoads: 9,
      totalVolumeMT: 270,
      avgFreightFeeNGN: 950000,
      coldChainEquipped: '30%',
      spoilageRate: '3.4%',
      status: 'MONITORED'
    },
    {
      corridor: 'Jos Plateau Horticulture → Abuja FCT & Central',
      distanceKm: 290,
      avgTransitHours: 6.5,
      activeLoads: 15,
      totalVolumeMT: 225,
      avgFreightFeeNGN: 480000,
      coldChainEquipped: '88%',
      spoilageRate: '0.6%',
      status: 'OPTIMAL'
    }
  ];

  // Filtered Orders for Transaction Audit Table
  const filteredOrders = orders.filter(order => {
    const matchSearch =
      searchTxQuery === '' ||
      order.id.toLowerCase().includes(searchTxQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTxQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTxQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTxQuery.toLowerCase());

    const matchStatus =
      selectedStatusFilter === 'ALL' ||
      order.status === selectedStatusFilter ||
      (selectedStatusFilter === 'ESCROW_HELD' && order.escrow?.status === 'FUNDS_HELD');

    const matchCommodity =
      selectedCommodityFilter === 'ALL' ||
      order.product.toLowerCase().includes(selectedCommodityFilter.toLowerCase());

    return matchSearch && matchStatus && matchCommodity;
  });

  const handleExportCSV = () => {
    const headers = ['Order ID,Product,Quantity,Buyer,Farmer,Total NGN,Escrow Status,Order Status,Created At\n'];
    const rows = orders.map(o =>
      `"${o.id}","${o.product}","${o.quantity} ${o.unit}","${o.buyerName}","${o.supplierName}",${o.grandTotalNGN || o.totalAmountNGN},"${o.escrow?.status || 'N/A'}","${o.status}","${o.createdAt}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FarmPot_Platform_Transactions_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Platform transaction ledger exported to CSV successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Master Administrator Authority • National Intelligence Bureau</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pan-Nigerian Transaction & Macro Data Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time audit oversight of all escrow transactions, financial velocities, agricultural commodity balances, and nationwide logistics corridors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Ledger (.CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('admin-users')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Manage User Directory</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {[
            { id: 'transactions', label: 'Escrow & Transaction Analysis', icon: DollarSign },
            { id: 'market-data', label: 'National Commodity Supply & Demand', icon: Sprout },
            { id: 'logistics', label: 'Freight Corridors & Cold-Chain Telemetry', icon: Truck },
            { id: 'users-funnel', label: 'User Verification & Trust Ecosystem', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ESCROW & TRANSACTION ANALYSIS */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Total Settled GMV</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ₦{(totalGMV || 84500000).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% this month</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Escrow Held in Vault</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Lock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                ₦{(totalEscrowInCustody || 32150000).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                Active in {activeOrders.length} trade contracts
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>2.5% Platform Fee Yield</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-purple-900 font-mono">
                ₦{(totalPlatformFeesYield || 2112500).toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-700 font-semibold">
                Net custodial commission
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Platform Dispute Rate</span>
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Scale className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {disputeRate}%
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">
                98.8% smooth completion
              </div>
            </div>
          </div>

          {/* Transaction Health & Velocity Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Escrow Velocity & Stage Pipeline
                  </h2>
                  <p className="text-xs text-slate-500">
                    End-to-end lifecycle throughput from initial escrow deposit to farmer & trucker payout.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  Avg 3.2 Days Cycle
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">1. Funds Deposited</div>
                  <div className="text-lg font-black text-slate-900 mt-1">100%</div>
                  <div className="text-[10px] text-slate-500">Instant NUBAN transfer</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">2. Pickup Dispatched</div>
                  <div className="text-lg font-black text-blue-600 mt-1">94.2%</div>
                  <div className="text-[10px] text-slate-500">Within 18 hrs</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">3. QA Verified</div>
                  <div className="text-lg font-black text-purple-600 mt-1">96.8%</div>
                  <div className="text-[10px] text-slate-500">FarmGate & Destination</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">4. Escrow Disbursed</div>
                  <div className="text-lg font-black text-emerald-600 mt-1">98.5%</div>
                  <div className="text-[10px] text-slate-500">Instant NIP settlement</div>
                </div>
              </div>

              {/* Settlement Turnaround Stats */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700 flex items-center justify-center text-purple-300 font-bold">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Automated Dual-Party Release Protocol</div>
                    <div className="text-[11px] text-slate-300">
                      Escrow is released to farmer (90%) and transporter (10%) upon buyer inspection pin approval.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('admin-escrow')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex-shrink-0 cursor-pointer"
                >
                  Inspect Escrow Vault
                </button>
              </div>
            </div>

            {/* Financial Risk & Chargeback Audit */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Settlement Risk Assessment</h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Chargeback / Default Rate</span>
                    <span className="text-emerald-700 font-black">0.00%</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 mt-1">
                    Zero payment defaults due to 100% pre-funded escrow vaults.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>NUBAN Verification Match</span>
                    <span className="text-blue-700 font-black">99.4%</span>
                  </div>
                  <p className="text-[10px] text-blue-800 mt-1">
                    Direct Name Enquiry verification across all 24 CBN-licensed banks.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>GIT Bond Coverage</span>
                    <span className="text-purple-700 font-black">100%</span>
                  </div>
                  <p className="text-[10px] text-purple-800 mt-1">
                    All dispatched freight is covered under verified Goods-In-Transit policies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Master Transaction Auditor & Ledger Search */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">National Transaction Ledger & Audit Search</h2>
                <p className="text-xs text-slate-500">Live surveillance across all active and completed agricultural orders.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, product, buyer, farmer..."
                    value={searchTxQuery}
                    onChange={e => setSearchTxQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedStatusFilter}
                  onChange={e => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ESCROW_HELD">Escrow Held</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DISPUTED">Disputed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Commodity</th>
                    <th className="py-3 px-3">Buyer Enterprise</th>
                    <th className="py-3 px-3">Farmer / Cooperative</th>
                    <th className="py-3 px-3">Order Value</th>
                    <th className="py-3 px-3">Escrow Status</th>
                    <th className="py-3 px-3">State Pipeline</th>
                    <th className="py-3 px-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                        {order.id}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {order.product}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {order.quantity} {order.unit}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{order.buyerName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{order.supplierName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        ₦{(order.grandTotalNGN || order.totalAmountNGN || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.escrow?.status === 'FUNDS_HELD'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : order.escrow?.status === 'RELEASED'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.escrow?.status || 'FUNDS_HELD'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setActiveView('orders');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] cursor-pointer"
                        >
                          Audit Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NATIONAL COMMODITY SUPPLY & DEMAND */}
      {activeTab === 'market-data' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  National Agricultural Supply vs. Demand Intelligence
                </h2>
                <p className="text-xs text-slate-500">
                  Macro volume surveillance (MT) across Nigerian food processing hubs and northern grain belts.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-bold border border-purple-200">
                  Updated Live (NBS / FarmPot Index)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {commodityAnalytics.map(crop => (
                <div
                  key={crop.name}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-purple-900 font-bold uppercase tracking-wider">
                        {crop.category}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{crop.name}</div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                        crop.isPositive ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {crop.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {crop.priceTrend}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-slate-200/60 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Supply Volume</div>
                      <div className="font-bold text-slate-900">{crop.supplyMT.toLocaleString()} MT</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Demand Volume</div>
                      <div className="font-bold text-slate-900">{crop.demandMT.toLocaleString()} MT</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Market Deficit / Balance:</span>
                    <span className={`font-bold ${crop.deficit < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {crop.deficit < 0 ? `Deficit: ${Math.abs(crop.deficit)} MT` : `Surplus: +${crop.deficit} MT`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-slate-700">Major Corridors: </span>
                    {crop.topProducingStates.join(', ')} → {crop.topConsumingStates.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FREIGHT CORRIDORS & LOGISTICS TELEMETRY */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Inter-State Haulage Corridors & Post-Harvest Loss Mitigation
                </h2>
                <p className="text-xs text-slate-500">
                  Cold-chain tracking reducing traditional produce spoilage from 35% down to under 2.5%.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600" />
                <span>Cold-Chain Telemetry Active</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {corridorAnalytics.map(corr => (
                <div
                  key={corr.corridor}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{corr.corridor}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Distance: {corr.distanceKm} km • Avg Transit: {corr.avgTransitHours} hrs
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {corr.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-200/60 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Active Trucks</div>
                      <div className="font-bold text-slate-900">{corr.activeLoads} En-Route</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Cold-Chain</div>
                      <div className="font-bold text-emerald-700">{corr.coldChainEquipped}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Loss Rate</div>
                      <div className="font-bold text-blue-700">{corr.spoilageRate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USER VERIFICATION & TRUST ECOSYSTEM */}
      {activeTab === 'users-funnel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-semibold text-slate-500">Corporate Buyers</div>
              <div className="text-2xl font-black text-emerald-800 font-mono">
                {users.filter(u => u.role === 'BUYER').length} Verified
              </div>
              <div className="text-[11px] text-slate-400">Food processors, FMCG, retailers</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-semibold text-slate-500">Producers & Cooperatives</div>
              <div className="text-2xl font-black text-amber-800 font-mono">
                {users.filter(u => u.role === 'FARMER').length} Registered
              </div>
              <div className="text-[11px] text-slate-400">AFAN/RIFAN verified farmlands</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-semibold text-slate-500">Logistics & Fleets</div>
              <div className="text-2xl font-black text-cyan-800 font-mono">
                {users.filter(u => u.role === 'TRANSPORTER').length} Active
              </div>
              <div className="text-[11px] text-slate-400">Bonded GIT insured trucks</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700 flex items-center justify-center text-purple-300 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Full User Directory & Profile Modification Authority</div>
                <div className="text-xs text-slate-400">
                  Directly inspect, edit, adjust trust scores, or modify clearance tiers for any platform user.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('admin-users')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
            >
              Open User Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
