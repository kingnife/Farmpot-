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
                      role="button"
                      tabIndex={0}
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

              {/* Role & Persona Pill with Role-Aware Dropdown */}
              <Dropdown
                id="header-user-profile-dropdown"
                align="right"
                menuClassName="w-80"
                trigger={isOpen => (
                  <div
                    role="button"
                    className={`flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl transition-colors cursor-pointer border ${
                      isOpen
                        ? 'bg-slate-100/80 border-slate-200'
                        : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col items-end text-right hidden sm:flex">
                      <span className="text-[10px] font-bold text-[#777777] uppercase tracking-widest">
                        {isAdmin ? 'ADMIN CLEARANCE' : `ROLE: ${currentUser.role}`}
                      </span>
                      <span className="text-xs font-bold text-[#1F1F1F]">
                        {currentUser.businessName || currentUser.name}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#BEE7A5] bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center text-xs font-extrabold">
                      {getInitials(currentUser.businessName || currentUser.name)}
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#334E1B]' : ''
                      }`}
                    />
                  </div>
                )}
              >
                {({ close }) => (
                  <div>
                    {isAdmin ? (
                      /* ADMIN DROPDOWN: Master Switcher & Governance Links */
                      <>
                        <div className="px-4 py-2 border-b border-[#BEE7A5] flex items-center justify-between bg-[#EDFFE0]">
                          <div className="flex items-center gap-1.5 text-[#334E1B] font-bold text-xs">
                            <ShieldCheck className="w-4 h-4 text-[#334E1B]" />
                            <span>Administrator Control</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#334E1B] font-mono font-bold border border-[#BEE7A5]">
                            TIER 4
                          </span>
                        </div>

                        <div className="p-2 space-y-1 border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('admin-analytics');
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <PieChart className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>Transaction Analytics & Data Hub</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('admin-users');
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>User Directory & Profile Authority</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('profile');
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>Profile Editor (With Master Switcher)</span>
                          </button>
                        </div>

                        {/* Quick Switch List for Admin */}
                        <div className="px-4 py-1 text-[10px] uppercase font-bold text-[#777777]">
                          Inspect & Switch Client
                        </div>
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {users.map(u => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setCurrentUserById(u.id);
                                close();
                              }}
                              className={`w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                                currentUser.id === u.id ? 'bg-[#EDFFE0] text-[#334E1B] font-bold' : ''
                              }`}
                            >
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-[#1F1F1F] flex items-center justify-center font-bold text-[10px] shrink-0">
                                {getInitials(u.businessName || u.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-[#1F1F1F] truncate">{u.name}</div>
                                <div className="text-[10px] text-[#777777] capitalize">
                                  {u.role.toLowerCase()} · {u.state}
                                </div>
                              </div>
                              {currentUser.id === u.id && (
                                <span className="w-2 h-2 rounded-full bg-[#334E1B]"></span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* OTHER ROLES (Farmer / Transporter): Persona Profile & Workspace Navigation */
                      <>
                        <div className="p-4 border-b border-slate-100 bg-[#EDFFE0]/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1F1F1F]">{currentUser.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDFFE0] text-[#334E1B] font-bold border border-[#BEE7A5]">
                              {currentUser.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#777777]">{currentUser.businessName || 'Verified Enterprise'}</div>
                          <div className="text-[10px] text-[#777777] font-mono">{currentUser.email}</div>
                        </div>

                        <div className="p-2 space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('profile');
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-[#EDFFE0]/50 flex items-center gap-2 cursor-pointer"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>My Profile & Settings</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('payments');
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-[#EDFFE0]/50 flex items-center gap-2 cursor-pointer"
                          >
                            <Wallet className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>Wallet & Escrow Vault</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('verification');
                              close();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-[#EDFFE0]/50 flex items-center gap-2 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#334E1B]" />
                            <span>Identity & KYC Verification</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              close();
                              openAuth();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1F1F1F] hover:bg-[#EDFFE0]/50 flex items-center gap-2 border-t border-slate-100 mt-1 pt-2 cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-[#334E1B]" />
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
                          close();
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
              </Dropdown>

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
