import React from 'react';
import {
  LayoutDashboard,
  Store,
  PackageCheck,
  FileText,
  Sparkles,
  FileCheck2,
  RotateCcw,
  Truck,
  Wallet,
  MessageSquare,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Settings,
  BarChart3,
  Boxes,
  Scale,
  Lock,
  Users,
  LogOut,
  X,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getViewKeyFromPath } from '../../utils/navigationRoutes';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  aliases?: string[];
  phase2?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    openAuth,
    logoutToExitPage,
    setIsAssistantOpen,
  } = useApp();

  const handleNav = (item: NavItem) => {
    if (onCloseMobile) onCloseMobile();
    if (item.key === 'auth') {
      setActiveView('auth');
      if (openAuth) openAuth();
      return;
    }
    setActiveView(item.key);
  };

  // Determine if a navigation item is currently active (route-aware)
  const isItemActive = (itemKey: string, aliases: string[] = []): boolean => {
    // 1. Direct activeView match
    if (activeView === itemKey || aliases.includes(activeView)) {
      return true;
    }

    // 2. Route/Pathname-aware match from browser location
    if (typeof window !== 'undefined') {
      const pathOrHash = window.location.pathname !== '/' && window.location.pathname !== ''
        ? window.location.pathname
        : window.location.hash;
      const currentRouteKey = getViewKeyFromPath(pathOrHash);
      if (currentRouteKey === itemKey || aliases.includes(currentRouteKey)) {
        return true;
      }
    }

    return false;
  };

  // Build role-specific grouped navigation structure
  const getNavGroups = (): NavGroup[] => {
    const role = currentUser?.role || 'BUYER';

    if (role === 'BUYER') {
      return [
        {
          groupTitle: 'MAIN',
          items: [
            { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { key: 'browse', label: 'Marketplace', aliases: ['browse-produce', 'marketplace'], icon: <Store className="w-4 h-4" /> },
            { key: 'requests', label: 'Procurement Requests', aliases: ['my-requests', 'procurement'], icon: <FileText className="w-4 h-4" /> },
            { key: 'matching', label: 'Supplier Matches', icon: <Sparkles className="w-4 h-4" /> },
            { key: 'orders', label: 'Orders & Escrow', icon: <PackageCheck className="w-4 h-4" /> },
            { key: 'contracts', label: 'Agreed Contracts', icon: <FileCheck2 className="w-4 h-4" /> },
            { key: 'recurring', label: 'Recurring Supply', aliases: ['phase2'], phase2: true, icon: <RotateCcw className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'LOGISTICS',
          items: [
            { key: 'logistics', label: 'Logistics Tracking', aliases: ['tracking', 'freight-tracking'], icon: <Truck className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'FINANCE',
          items: [
            { key: 'payments', label: 'Wallet & Escrow', aliases: ['wallet', 'payouts', 'escrow'], icon: <Wallet className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'COMMUNICATION',
          items: [
            { key: 'messages', label: 'Messages & Chat', aliases: ['chat'], icon: <MessageSquare className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'MARKET',
          items: [
            { key: 'market-intel', label: 'Market Prices', aliases: ['market-prices'], icon: <TrendingUp className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'TRUST & COMPLIANCE',
          items: [
            { key: 'verification', label: 'KYC Verification', aliases: ['kyc'], icon: <UserCheck className="w-4 h-4" /> },
            { key: 'profile', label: 'Trust & Profile', aliases: ['trust-profile', 'trust-score'], icon: <ShieldCheck className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'ACCOUNT',
          items: [
            { key: 'auth', label: 'Client Portals & Auth', aliases: ['client-portals'], icon: <KeyRound className="w-4 h-4" /> },
            { key: 'settings', label: 'Settings', aliases: ['account-settings'], icon: <Settings className="w-4 h-4" /> },
          ]
        }
      ];
    }

    if (role === 'FARMER') {
      return [
        {
          groupTitle: 'MAIN',
          items: [
            { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { key: 'browse', label: 'Marketplace', aliases: ['browse-produce', 'marketplace'], icon: <Store className="w-4 h-4" /> },
            { key: 'listings', label: 'Produce Listings', aliases: ['produce'], icon: <Store className="w-4 h-4" /> },
            { key: 'requests-feed', label: 'Buyer Demand Feed', aliases: ['requests'], icon: <FileText className="w-4 h-4" /> },
            { key: 'orders', label: 'Orders & Sales', icon: <PackageCheck className="w-4 h-4" /> },
            { key: 'logistics', label: 'Pickups & Dispatch', aliases: ['tracking'], icon: <Truck className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'OPERATIONS',
          items: [
            { key: 'farmer-bi', label: 'Farm Intelligence', phase2: true, icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'aggregation', label: 'Farmer Aggregation', phase2: true, icon: <Boxes className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'FINANCE',
          items: [
            { key: 'payments', label: 'Wallet & Payouts', aliases: ['wallet', 'payouts', 'escrow'], icon: <Wallet className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'COMMUNICATION',
          items: [
            { key: 'messages', label: 'Messages & Chat', aliases: ['chat'], icon: <MessageSquare className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'MARKET',
          items: [
            { key: 'market-intel', label: 'Market Prices', aliases: ['market-prices'], icon: <TrendingUp className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'TRUST & COMPLIANCE',
          items: [
            { key: 'verification', label: 'Farm Verification', aliases: ['kyc'], icon: <UserCheck className="w-4 h-4" /> },
            { key: 'profile', label: 'Trust & Profile', aliases: ['trust-profile', 'trust-score'], icon: <ShieldCheck className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'ACCOUNT',
          items: [
            { key: 'auth', label: 'Client Portals & Auth', aliases: ['client-portals'], icon: <KeyRound className="w-4 h-4" /> },
            { key: 'settings', label: 'Settings', aliases: ['account-settings'], icon: <Settings className="w-4 h-4" /> },
          ]
        }
      ];
    }

    if (role === 'TRANSPORTER') {
      return [
        {
          groupTitle: 'MAIN',
          items: [
            { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { key: 'available-jobs', label: 'Available Freight Jobs', icon: <Truck className="w-4 h-4" /> },
            { key: 'active-delivery', label: 'Active Delivery Waybills', icon: <PackageCheck className="w-4 h-4" /> },
            { key: 'logistics', label: 'Logistics Tracking', aliases: ['tracking'], icon: <Truck className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'FINANCE',
          items: [
            { key: 'payments', label: 'Earnings & Payouts', aliases: ['wallet', 'payouts'], icon: <Wallet className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'COMMUNICATION',
          items: [
            { key: 'messages', label: 'Dispatch Comms', aliases: ['chat'], icon: <MessageSquare className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'MARKET',
          items: [
            { key: 'market-intel', label: 'Market Prices', aliases: ['market-prices'], icon: <TrendingUp className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'TRUST & COMPLIANCE',
          items: [
            { key: 'verification', label: 'GIT & Vehicle Docs', aliases: ['kyc'], icon: <UserCheck className="w-4 h-4" /> },
            { key: 'profile', label: 'Trust & Profile', aliases: ['trust-profile'], icon: <ShieldCheck className="w-4 h-4" /> },
          ]
        },
        {
          groupTitle: 'ACCOUNT',
          items: [
            { key: 'auth', label: 'Client Portals & Auth', aliases: ['client-portals'], icon: <KeyRound className="w-4 h-4" /> },
            { key: 'settings', label: 'Settings', aliases: ['account-settings'], icon: <Settings className="w-4 h-4" /> },
          ]
        }
      ];
    }

    // ADMIN, VERIFICATION_OFFICER, OPERATIONS, FINANCE
    return [
      {
        groupTitle: 'MAIN',
        items: [
          { key: 'dashboard', label: 'Control Tower', icon: <LayoutDashboard className="w-4 h-4" /> },
          { key: 'reports', label: 'Reports & Analytics', aliases: ['admin-analytics', 'admin-data'], icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'admin-users', label: 'User Directory & Authority', aliases: ['admin-directory'], icon: <Users className="w-4 h-4" /> },
          { key: 'orders', label: 'All Orders Pipeline', icon: <PackageCheck className="w-4 h-4" /> },
        ]
      },
      {
        groupTitle: 'OPERATIONS',
        items: [
          { key: 'admin-verification', label: 'Verification Queue', icon: <UserCheck className="w-4 h-4" /> },
          { key: 'admin-disputes', label: 'Dispute Resolution', icon: <Scale className="w-4 h-4" /> },
          { key: 'logistics', label: 'Fleet Logistics Oversight', aliases: ['tracking'], icon: <Truck className="w-4 h-4" /> },
        ]
      },
      {
        groupTitle: 'FINANCE',
        items: [
          { key: 'admin-escrow', label: 'Escrow Vault & Payouts', icon: <Lock className="w-4 h-4" /> },
          { key: 'payments', label: 'Wallet & Settlement', aliases: ['wallet', 'payouts'], icon: <Wallet className="w-4 h-4" /> },
        ]
      },
      {
        groupTitle: 'COMMUNICATION',
        items: [
          { key: 'messages', label: 'System Logs & Comms', aliases: ['chat'], icon: <MessageSquare className="w-4 h-4" /> },
        ]
      },
      {
        groupTitle: 'MARKET',
        items: [
          { key: 'market-intel', label: 'Market Surveillance', aliases: ['market-prices'], icon: <TrendingUp className="w-4 h-4" /> },
        ]
      },
      {
        groupTitle: 'ACCOUNT',
        items: [
          { key: 'profile', label: 'Trust & Profile', aliases: ['trust-profile'], icon: <ShieldCheck className="w-4 h-4" /> },
          { key: 'auth', label: 'Client Portals & Auth', aliases: ['client-portals'], icon: <KeyRound className="w-4 h-4" /> },
          { key: 'settings', label: 'Settings', aliases: ['account-settings'], icon: <Settings className="w-4 h-4" /> },
        ]
      }
    ];
  };

  const navGroups = getNavGroups();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-label="Close menu"
        />
      )}

      {/* Global Sidebar Component: Fixed on mobile, sticky in document flow on desktop */}
      <aside
        id="farmpot-global-sidebar"
        className={`
          w-[272px] shrink-0 bg-white border-r border-stone-200 flex flex-col z-40 select-none
          fixed inset-y-0 left-0 transition-transform duration-200 ease-in-out shadow-xl lg:shadow-none
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:static lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:z-20
        `}
      >
        {/* Workspace Identifier Header */}
        <div className="p-4 border-b border-stone-200/80 bg-[#FAF9F5] flex items-center justify-between shrink-0">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777] mb-0.5">
              Active Workspace
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1F1F1F] capitalize truncate">
                {(currentUser?.role || 'BUYER').replace(/_/g, ' ').toLowerCase()} Portal
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5] shrink-0">
                Live
              </span>
            </div>
          </div>
          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-stone-200/50 cursor-pointer ml-2"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FarmPot Assistant Quick Launcher */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <button
            type="button"
            id="sidebar-assistant-launcher-btn"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              setIsAssistantOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#EDFFE0] hover:bg-[#EDFFE0]/80 text-[#334E1B] border border-[#BEE7A5] rounded-xl text-xs font-bold transition-all shadow-2xs group cursor-pointer text-left"
            title="Open FarmPot Assistant"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#334E1B] text-[#EDFFE0] flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="leading-tight font-bold truncate">FarmPot Assistant</div>
                <div className="text-[10px] text-stone-500 font-normal leading-tight">Live platform guide</div>
              </div>
            </div>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#334E1B] text-[#EDFFE0] shrink-0">
              AI
            </span>
          </button>
        </div>

        {/* Organized Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 min-h-0">
          {navGroups.map((group) => (
            <div key={group.groupTitle} className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#888888] px-2.5 pt-1.5 pb-1">
                {group.groupTitle}
              </div>
              {group.items.map((item) => {
                const active = isItemActive(item.key, item.aliases);
                return (
                  <button
                    key={item.key}
                    type="button"
                    id={`nav-item-${item.key}`}
                    onClick={() => handleNav(item)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left
                      ${
                        active
                          ? 'bg-[#334E1B] text-white font-semibold shadow-xs'
                          : 'text-[#444444] hover:bg-[#EDFFE0]/60 hover:text-[#1F1F1F] font-medium'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 flex items-center justify-center shrink-0 ${active ? 'text-white' : 'text-[#777777]'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.phase2 && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        Phase 2
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Persistent Bottom Section: Sign Out & Nigeria Escrow Indicator */}
        <div className="p-3 border-t border-stone-200/80 bg-[#FAF9F5] space-y-2 shrink-0">
          {/* Sign Out / Exit Session: Visually distinct, muted red, fully functional */}
          <button
            type="button"
            id="sidebar-sign-out-btn"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              logoutToExitPage();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer text-left"
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4 text-rose-500" />
            </span>
            <span className="truncate">Sign Out / Exit Session</span>
          </button>

          {/* Federal Republic of Nigeria Escrow Badge */}
          <div className="px-3 py-2 rounded-lg bg-white border border-stone-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#EDFFE0] border border-[#334E1B]/20 flex items-center justify-center text-xs shrink-0">
              🇳🇬
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-[#1F1F1F] truncate leading-tight">
                Federal Republic of Nigeria
              </div>
              <div className="text-[10px] text-[#777777] truncate leading-tight">
                Escrow in NGN (₦)
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
