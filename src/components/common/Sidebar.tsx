import React from 'react';
import {
  LayoutDashboard,
  Store,
  FileText,
  PackageCheck,
  TrendingUp,
  Truck,
  Wallet,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Boxes,
  PieChart,
  Scale,
  Users,
  AlertOctagon,
  FileCheck2,
  PhoneCall,
  Sliders,
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    unreadNotificationsCount,
    featureFlags,
  } = useApp();

  const handleNav = (viewKey: string) => {
    setActiveView(viewKey);
    if (onCloseMobile) onCloseMobile();
  };

  // Build role-specific navigation menu
  const getNavItems = () => {
    const role = currentUser?.role || 'BUYER';

    if (role === 'BUYER') {
      return [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: 'browse-produce', label: 'Browse Produce', icon: <Store className="w-4 h-4" /> },
        { key: 'requests', label: 'Demand Requests', icon: <FileText className="w-4 h-4" /> },
        { key: 'matching', label: 'Supplier Matches', icon: <Sparkles className="w-4 h-4 text-emerald-600" /> },
        { key: 'orders', label: 'Orders & Escrow', icon: <PackageCheck className="w-4 h-4" /> },
        { key: 'contracts', label: 'Agreed Contracts', icon: <FileCheck2 className="w-4 h-4" /> },
        {
          key: 'recurring',
          label: 'Recurring Procurement',
          icon: <RotateCcw className="w-4 h-4 text-teal-600" />,
          phase2: true,
        },
        { key: 'logistics', label: 'Logistics Tracking', icon: <Truck className="w-4 h-4" /> },
        { key: 'payments', label: 'Wallet & Escrow', icon: <Wallet className="w-4 h-4" /> },
        { key: 'messages', label: 'Messages & Chat', icon: <MessageSquare className="w-4 h-4" /> },
        { key: 'market-intel', label: 'Market Prices', icon: <TrendingUp className="w-4 h-4" /> },
        { key: 'verification', label: 'KYC Verification', icon: <UserCheck className="w-4 h-4" /> },
        { key: 'profile', label: 'Trust & Profile', icon: <ShieldCheck className="w-4 h-4" /> },
      ];
    }

    if (role === 'FARMER') {
      return [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: 'listings', label: 'My Produce Listings', icon: <Store className="w-4 h-4" /> },
        { key: 'requests-feed', label: 'Buyer Demand Feed', icon: <FileText className="w-4 h-4" /> },
        { key: 'orders', label: 'Orders & Sales', icon: <PackageCheck className="w-4 h-4" /> },
        { key: 'logistics', label: 'Pickups & Dispatch', icon: <Truck className="w-4 h-4" /> },
        { key: 'payments', label: 'Payouts & Escrow', icon: <Wallet className="w-4 h-4" /> },
        { key: 'messages', label: 'Buyer Negotiations', icon: <MessageSquare className="w-4 h-4" /> },
        { key: 'trust-score', label: 'Trust Score & Reviews', icon: <ShieldCheck className="w-4 h-4" /> },
        {
          key: 'farmer-bi',
          label: 'Farm Intelligence',
          icon: <PieChart className="w-4 h-4 text-emerald-600" />,
          phase2: true,
        },
        {
          key: 'aggregation',
          label: 'Farmer Aggregation',
          icon: <Boxes className="w-4 h-4 text-amber-600" />,
          phase2: true,
        },
        { key: 'market-intel', label: 'Market Benchmarks', icon: <TrendingUp className="w-4 h-4" /> },
        { key: 'verification', label: 'Farm Verification', icon: <UserCheck className="w-4 h-4" /> },
        { key: 'profile', label: 'Farm Profile', icon: <Sliders className="w-4 h-4" /> },
      ];
    }

    if (role === 'TRANSPORTER') {
      return [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: 'available-jobs', label: 'Available Freight Jobs', icon: <Truck className="w-4 h-4 text-blue-600" /> },
        { key: 'active-delivery', label: 'Active Delivery / Waybills', icon: <PackageCheck className="w-4 h-4" /> },
        { key: 'payments', label: 'Earnings & Payouts', icon: <Wallet className="w-4 h-4" /> },
        { key: 'messages', label: 'Dispatch Comms', icon: <MessageSquare className="w-4 h-4" /> },
        { key: 'verification', label: 'GIT & Vehicle Docs', icon: <UserCheck className="w-4 h-4" /> },
        { key: 'profile', label: 'Fleet Profile', icon: <ShieldCheck className="w-4 h-4" /> },
      ];
    }

    // ADMIN, VERIFICATION_OFFICER, OPERATIONS, FINANCE
    return [
      { key: 'dashboard', label: 'Control Tower', icon: <LayoutDashboard className="w-4 h-4" /> },
      { key: 'admin-verification', label: 'Verification Queue', icon: <UserCheck className="w-4 h-4 text-purple-600" /> },
      { key: 'admin-users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
      { key: 'admin-listings', label: 'Listings & Requests', icon: <Store className="w-4 h-4" /> },
      { key: 'orders', label: 'All Orders Pipeline', icon: <PackageCheck className="w-4 h-4" /> },
      { key: 'admin-escrow', label: 'Escrow Vault & Payouts', icon: <Lock className="w-4 h-4 text-emerald-600" /> },
      { key: 'admin-disputes', label: 'Dispute Resolution', icon: <Scale className="w-4 h-4 text-rose-600" /> },
      { key: 'logistics', label: 'Fleet Logistics Oversight', icon: <Truck className="w-4 h-4" /> },
      { key: 'admin-analytics', label: 'Data Hub & Analytics', icon: <PieChart className="w-4 h-4" /> },
      { key: 'market-intel', label: 'Commodity Surveillance', icon: <TrendingUp className="w-4 h-4" /> },
      { key: 'messages', label: 'System Logs & Comms', icon: <MessageSquare className="w-4 h-4" /> },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-64px)]">
      {/* Role Pill Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
          Active Workspace
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white capitalize">
            {(currentUser?.role || 'BUYER').replace(/_/g, ' ').toLowerCase()} Portal
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Live
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              type="button"
              id={`nav-item-${item.key}`}
              onClick={() => handleNav(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-900/40'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.phase2 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  Phase 2
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Nigerian Market Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-sm">
            🇳🇬
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-200">Federal Republic of Nigeria</div>
            <div className="text-[10px] text-slate-400">All prices denominated in NGN (₦)</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
