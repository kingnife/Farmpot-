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
  ExternalLink
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
    openAuth,
    logoutToExitPage,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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
                  onClick={() => setActiveView(isAdmin ? 'admin-analytics' : 'market-intel')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeView === 'market-intel' || activeView === 'admin-analytics'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold'
                      : 'hover:text-slate-800'
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Open Dedicated Client Auth & Exit Pages (Buyers, Farmers, Transporters, Admin)"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Client Portals</span>
              </button>

              {/* Transaction Tour Button */}
              <button
                type="button"
                id="header-start-tour-button"
                onClick={startTour}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 transition-colors cursor-pointer"
                title="Launch the End-to-End Nigerian Agricultural Trade Walkthrough"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Tour</span>
              </button>

              {/* Wallet / Escrow Quick Stat */}
              <div
                onClick={() => setActiveView('payments')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
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

              {/* Role & Persona Pill with Role-Aware Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-end text-right hidden sm:flex">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {isAdmin ? 'ADMIN CLEARANCE' : `ROLE: ${currentUser.role}`}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {currentUser.businessName || currentUser.name}
                    </span>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-extrabold ${
                      isAdmin
                        ? 'bg-purple-100 border-purple-300 text-purple-900'
                        : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {getInitials(currentUser.businessName || currentUser.name)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {isAdmin ? (
                      /* ADMIN DROPDOWN: Master Switcher & Governance Links */
                      <>
                        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
                          <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>Administrator Control</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-mono font-bold">
                            TIER 4
                          </span>
                        </div>

                        <div className="p-2 space-y-1 border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('admin-analytics');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <PieChart className="w-3.5 h-3.5 text-purple-600" />
                            <span>Transaction Analytics & Data Hub</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('admin-users');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Users className="w-3.5 h-3.5 text-purple-600" />
                            <span>User Directory & Profile Authority</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('profile');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Profile Editor (With Master Switcher)</span>
                          </button>
                        </div>

                        {/* Quick Switch List for Admin */}
                        <div className="px-4 py-1 text-[10px] uppercase font-bold text-slate-400">
                          Inspect & Switch Client
                        </div>
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {users.map(u => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setCurrentUserById(u.id);
                                setIsRoleDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                                currentUser.id === u.id ? 'bg-purple-50 text-purple-900 font-bold' : ''
                              }`}
                            >
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {getInitials(u.businessName || u.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{u.name}</div>
                                <div className="text-[10px] text-slate-500 capitalize">
                                  {u.role.toLowerCase()} · {u.state}
                                </div>
                              </div>
                              {currentUser.id === u.id && (
                                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* NON-ADMIN DROPDOWN: Personal Profile & Workspace Navigation */
                      <>
                        <div className="p-4 border-b border-slate-100 bg-slate-50/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                              {currentUser.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{currentUser.businessName || 'Verified Enterprise'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{currentUser.email}</div>
                        </div>

                        <div className="p-2 space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('profile');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>My Profile & Settings</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('payments');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Wallet & Escrow Vault</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('verification');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Identity & KYC Verification</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsRoleDropdownOpen(false);
                              openAuth();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100 mt-1 pt-2"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                            <span>Switch Client (Auth Portal)</span>
                          </button>
                        </div>
                      </>
                    )}

                    {/* Exit / Logout Option */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRoleDropdownOpen(false);
                          logoutToExitPage();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout & View Exit Summary</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
