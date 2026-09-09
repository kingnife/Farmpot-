import React, { useState } from 'react';
import {
  Sprout,
  Bell,
  Wallet,
  Lock,
  PlayCircle,
  Menu,
  X,
  UserCheck,
  Building2,
  ChevronDown,
  LogOut,
  KeyRound,
  ShieldCheck,
  Truck,
  Layers,
  User as UserIcon,
  PieChart,
  Users,
  ExternalLink,
  FileText,
  Sparkles,
  Clock,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustScoreBadge } from './TrustScoreBadge';
import { NotificationDrawer } from './NotificationDrawer';
import { Dropdown } from './Dropdown';
import { ClientProfileDropdown } from './ClientProfileDropdown';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const {
    currentUser,
    unreadNotificationsCount,
    startTour,
    setActiveView,
    activeView,
    users,
    setCurrentUserById,
    openAuth,
    logoutToExitPage,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

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

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Mobile Toggle & Sleek Logo */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-3 cursor-pointer select-none group"
              >
                <div className="w-8 h-8 bg-[#334E1B] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-[#3F6B24] transition-colors">
                  F
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight text-[#334E1B]">FarmPot</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E1B] bg-[#EDFFE0] px-1.5 py-0.5 rounded border border-[#BEE7A5]">
                    Nigeria 🇳🇬
                  </span>
                </div>
              </div>

              {/* Quick Navigation Tabs */}
              <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#777777]">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'dashboard'
                      ? 'text-[#334E1B] border-b-2 border-[#334E1B] font-bold'
                      : 'hover:text-[#1F1F1F]'
                  }`}
                >
                  Marketplace
                </button>

                {/* Procurement Navigation Dropdown */}
                <Dropdown
                  id="header-procurement-nav-dropdown"
                  align="left"
                  menuClassName="w-64 p-1.5"
                  trigger={isOpen => (
                    <div
                      className={`flex items-center gap-1.5 pb-1 cursor-pointer transition-colors ${
                        ['requests', 'my-requests', 'matching', 'contracts', 'phase2', 'requests-feed'].includes(activeView)
                          ? 'text-[#334E1B] border-b-2 border-[#334E1B] font-bold'
                          : 'hover:text-[#1F1F1F]'
                      }`}
                    >
                      <span>Procurement</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#334E1B]' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  )}
                >
                  {({ close }) => (
                    <div className="space-y-1">
                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#777777] border-b border-slate-100">
                        Procurement Pipeline
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('requests');
                          close();
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          activeView === 'requests' || activeView === 'my-requests'
                            ? 'bg-[#EDFFE0] text-[#334E1B] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-[#334E1B]" />
                        <div className="flex-1">
                          <div>Demand Requests</div>
                          <div className="text-[10px] text-slate-400 font-normal">Active buyer procurement specs</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('matching');
                          close();
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          activeView === 'matching'
                            ? 'bg-[#EDFFE0] text-[#334E1B] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#334E1B]" />
                        <div className="flex-1">
                          <div>Explainable Matching</div>
                          <div className="text-[10px] text-slate-400 font-normal">Deterministic supplier scoring</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('contracts');
                          close();
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          activeView === 'contracts'
                            ? 'bg-[#EDFFE0] text-[#334E1B] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#334E1B]" />
                        <div className="flex-1">
                          <div>Contracts & Escrow</div>
                          <div className="text-[10px] text-slate-400 font-normal">Digital trade agreements</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('phase2');
                          close();
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          activeView === 'phase2'
                            ? 'bg-[#EDFFE0] text-[#334E1B] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-[#334E1B]" />
                        <div className="flex-1">
                          <div>Recurring Supply Cycles</div>
                          <div className="text-[10px] text-slate-400 font-normal">Weekly/monthly schedules</div>
                        </div>
                      </button>
                    </div>
                  )}
                </Dropdown>

                <button
                  type="button"
                  onClick={() => setActiveView('orders')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'orders'
                      ? 'text-[#334E1B] border-b-2 border-[#334E1B] font-bold'
                      : 'hover:text-[#1F1F1F]'
                  }`}
                >
                  My Orders
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('logistics')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'logistics'
                      ? 'text-[#334E1B] border-b-2 border-[#334E1B] font-bold'
                      : 'hover:text-[#1F1F1F]'
                  }`}
                >
                  Logistics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView(isAdmin ? 'admin-analytics' : 'market-intel')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'market-intel' || activeView === 'admin-analytics'
                      ? 'text-[#334E1B] border-b-2 border-[#334E1B] font-bold'
                      : 'hover:text-[#1F1F1F]'
                  }`}
                >
                  {isAdmin ? 'Transaction Analytics' : 'Analytics'}
                </button>
              </div>
            </div>

            {/* Right: Quick Stats, Role Selector & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dedicated Client Auth Suite Portal Button */}
              <button
                type="button"
                id="header-client-auth-portals-button"
                onClick={() => openAuth()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Open Dedicated Client Auth & Exit Pages (Buyers, Farmers, Transporters, Admin)"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#EDFFE0]" />
                <span className="hidden sm:inline">Client Portals</span>
              </button>

              {/* Transaction Tour Button */}
              <button
                type="button"
                id="header-start-tour-button"
                onClick={startTour}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border-1.5 border-[#334E1B] hover:bg-[#EDFFE0] text-[#334E1B] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                title="Launch the End-to-End Nigerian Agricultural Trade Walkthrough"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Tour</span>
              </button>

              {/* Wallet / Escrow Quick Stat */}
              <div
                onClick={() => setActiveView('payments')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D8D8CF] bg-[#EDFFE0]/40 hover:bg-[#EDFFE0]/80 transition-colors cursor-pointer"
                title="Open FarmPot Escrow & Wallet Vault"
              >
                <div className="w-5 h-5 rounded bg-[#EDFFE0] flex items-center justify-center text-[#334E1B]">
                  <Wallet className="w-3 h-3" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#777777] font-bold uppercase tracking-wider">Wallet</div>
                  <div className="text-xs font-bold text-[#1F1F1F] font-mono">
                    ₦{(currentUser.walletBalance || 0).toLocaleString()}
                  </div>
                </div>

                {(currentUser.escrowBalance || 0) > 0 && (
                  <div className="ml-2 pl-2 border-l border-[#D8D8CF] flex items-center gap-1 text-[11px] font-semibold text-[#334E1B]">
                    <Lock className="w-3 h-3 text-[#334E1B]" />
                    <span>₦{(currentUser.escrowBalance || 0).toLocaleString()} Held</span>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <button
                type="button"
                id="header-notifications-button"
                onClick={() => setIsNotifOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#334E1B] text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Role & Persona Pill with Redesigned Role-Aware Client Profile Dropdown */}
              <ClientProfileDropdown
                currentUser={currentUser}
                isAdmin={isAdmin}
                users={users}
                setCurrentUserById={setCurrentUserById}
                setActiveView={setActiveView}
                openAuth={openAuth}
                logoutToExitPage={logoutToExitPage}
              />

              {/* Direct Quick Exit Button */}
              <button
                type="button"
                id="header-logout-button"
                onClick={() => logoutToExitPage()}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Exit Session & Sign Out"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
