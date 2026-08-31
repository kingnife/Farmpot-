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
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustScoreBadge } from './TrustScoreBadge';
import { NotificationDrawer } from './NotificationDrawer';

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
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-emerald-700 transition-colors">
                  F
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight text-emerald-900">FarmPot</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Nigeria 🇳🇬
                  </span>
                </div>
              </div>

              {/* Quick Navigation Tabs */}
              <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-500">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'dashboard'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('orders')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'orders'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold'
                      : 'hover:text-slate-800'
                  }`}
                >
                  My Orders
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('logistics')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'logistics'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Logistics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('market-intel')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'market-intel'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Right: Quick Stats, Role Selector & Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Transaction Tour Button */}
              <button
                type="button"
                id="header-start-tour-button"
                onClick={startTour}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 transition-colors cursor-pointer"
                title="Launch the End-to-End Nigerian Agricultural Trade Walkthrough"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Transaction Tour</span>
              </button>

              {/* Wallet / Escrow Quick Stat */}
              <div
                onClick={() => setActiveView('payments')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Open FarmPot Escrow & Wallet Vault"
              >
                <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Wallet className="w-3 h-3" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wallet</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    ₦{(currentUser.walletBalance || 0).toLocaleString()}
                  </div>
                </div>

                {(currentUser.escrowBalance || 0) > 0 && (
                  <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <Lock className="w-3 h-3 text-emerald-600" />
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
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Role & Persona Pill with Sleek Styling */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-end text-right hidden sm:flex">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Role: {currentUser.role.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {currentUser.businessName || currentUser.name}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 text-xs font-extrabold">
                    {getInitials(currentUser.businessName || currentUser.name)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown to switch roles & personas */}
                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Switch Platform Persona
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {(users || []).map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setCurrentUserById(u.id);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                            currentUser.id === u.id ? 'bg-emerald-50/70 text-emerald-900 font-bold' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {getInitials(u.businessName || u.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">{u.name}</div>
                            <div className="text-[10px] text-slate-500 capitalize">
                              {u.role.replace(/_/g, ' ').toLowerCase()} · {u.state}
                            </div>
                          </div>
                          {currentUser.id === u.id && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

