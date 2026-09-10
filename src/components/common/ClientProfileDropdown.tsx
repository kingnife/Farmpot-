import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  User,
  Wallet,
  BadgeCheck,
  KeyRound,
  LogOut,
  PieChart,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { User as AppUser } from '../../types';
import { useDropdownPositioning } from '../../hooks/useDropdownPositioning';

interface ClientProfileDropdownProps {
  currentUser: AppUser;
  isAdmin: boolean;
  users: AppUser[];
  setCurrentUserById: (userId: string) => void;
  setActiveView: (view: any) => void;
  openAuth: (client?: any, page?: any) => void;
  logoutToExitPage: (reason?: string) => void;
}

export const ClientProfileDropdown: React.FC<ClientProfileDropdownProps> = ({
  currentUser,
  isAdmin,
  users,
  setCurrentUserById,
  setActiveView,
  openAuth,
  logoutToExitPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position detection and boundary clamping using useDropdownPositioning hook
  const position = useDropdownPositioning({
    triggerRef,
    containerRef,
    menuRef,
    isOpen,
    preferredHorizontal: 'center',
    margin: 12,
    offsetY: 10,
    targetWidth: 410,
    maxAllowedHeight: 650,
  });

  const getInitials = (name?: string) => {
    if (!name) return 'LF';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Click outside and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const buyerMenuItems = [
    {
      id: 'profile',
      label: 'My Profile & Settings',
      icon: User,
      action: () => setActiveView('profile'),
    },
    {
      id: 'payments',
      label: 'Wallet & Escrow Vault',
      icon: Wallet,
      action: () => setActiveView('payments'),
    },
    {
      id: 'verification',
      label: 'Identity & KYC Verification',
      icon: BadgeCheck,
      action: () => setActiveView('verification'),
    },
    {
      id: 'switch-client',
      label: 'Switch Client (Auth Portal)',
      icon: KeyRound,
      action: () => openAuth(),
    },
  ];

  return (
    <div
      ref={containerRef}
      id="header-client-profile-dropdown"
      className={`relative inline-block text-left ${isOpen ? 'z-dropdown-elevated-wrapper z-dropdown-wrapper z-[110]' : 'z-auto'}`}
    >
      {/* 1. Client selector / dropdown trigger */}
      <button
        type="button"
        ref={triggerRef}
        id="header-user-profile-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="header-client-profile-dropdown-panel"
        className={`flex items-center gap-1.5 sm:gap-2.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all duration-150 cursor-pointer border select-none h-9 sm:h-11 ${
          isOpen
            ? 'bg-[#F2FAEE] border-[#334E1B]/35 ring-2 ring-[#334E1B]/15 shadow-xs'
            : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 shadow-xs'
        }`}
      >
        {/* [ Company information ] */}
        <div className="hidden sm:flex flex-col items-end text-right min-w-0 max-w-[130px] md:max-w-[180px] lg:max-w-[240px] justify-center">
          <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider leading-none whitespace-nowrap truncate max-w-full">
            {isAdmin ? 'ADMIN CLEARANCE' : `ROLE: ${currentUser.role}`}
          </span>
          <span
            className="text-xs font-bold text-[#1F1F1F] leading-tight truncate whitespace-nowrap max-w-full mt-1"
            title={currentUser.businessName || currentUser.name}
          >
            {currentUser.businessName || currentUser.name}
          </span>
        </div>

        {/* [ LF Circular Logo ] */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full border border-[#BEE7A5] bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center text-[10px] sm:text-xs font-extrabold shadow-2xs">
          {getInitials(currentUser.businessName || currentUser.name)}
        </div>

        {/* [ Down-chevron with smooth rotation ] */}
        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-180 text-[#334E1B]' : ''
          }`}
        />
      </button>

      {/* 2. Dropdown Floating Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          id="header-client-profile-dropdown-panel"
          role="menu"
          aria-label="Client Profile Menu"
          className={`absolute z-dropdown-elevated z-dropdown z-[120] duration-150 ease-out ${
            position.vertical === 'top'
              ? 'bottom-full mb-2.5 animate-in fade-in zoom-in-95 slide-in-from-bottom-1'
              : 'top-full mt-2.5 animate-in fade-in zoom-in-95 slide-in-from-top-1'
          }`}
          style={{
            left: `${position.left}px`,
            width: `${position.width}px`,
            maxHeight: `${position.maxHeight}px`,
          }}
        >
          {/* Visual Connection Arrow pointing to the selector */}
          <div
            aria-hidden="true"
            className={`absolute w-3.5 h-3.5 bg-[#F2FAEE] z-30 ${
              position.vertical === 'top'
                ? '-bottom-[7px] border-b border-r border-[#BEE7A5]'
                : '-top-[7px] border-t border-l border-[#BEE7A5]'
            }`}
            style={{
              left: `${position.arrowLeft}px`,
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />

          {/* Clean Floating Panel Container */}
          <div
            className="relative z-20 bg-white rounded-[22px] border border-[#BEE7A5]/70 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_4px_16px_rgba(51,78,27,0.06)] overflow-hidden overflow-y-auto overscroll-contain"
            style={{ maxHeight: `${position.maxHeight}px` }}
          >
            {isAdmin ? (
              /* Admin Clearance Menu Layout */
              <>
                {/* Admin Profile Header */}
                <div className="px-6 pt-5 pb-4 bg-gradient-to-b from-[#F2FAEE] to-[#F8FCF5] border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-extrabold text-[#1F1F1F] tracking-tight leading-snug truncate">
                        {currentUser.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-snug truncate">
                        {currentUser.businessName || 'Governance & Superadmin'}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 font-mono truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5] text-[10px] font-extrabold tracking-wider uppercase shrink-0 shadow-2xs">
                      TIER 4 ADMIN
                    </span>
                  </div>
                </div>

                {/* Admin Quick Governance Links */}
                <div className="p-3 space-y-1 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setActiveView('admin-analytics');
                    }}
                    className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer hover:bg-[#EDFFE0]/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EDFFE0]/70 text-[#334E1B] flex items-center justify-center shrink-0 group-hover:bg-[#334E1B] group-hover:text-white transition-colors duration-150 shadow-2xs">
                        <PieChart className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#1F1F1F] group-hover:text-[#334E1B] transition-colors duration-150 truncate">
                        Transaction Analytics & Data Hub
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#334E1B] group-hover:translate-x-0.5 transition-all duration-150 shrink-0 ml-2" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setActiveView('admin-users');
                    }}
                    className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer hover:bg-[#EDFFE0]/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EDFFE0]/70 text-[#334E1B] flex items-center justify-center shrink-0 group-hover:bg-[#334E1B] group-hover:text-white transition-colors duration-150 shadow-2xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#1F1F1F] group-hover:text-[#334E1B] transition-colors duration-150 truncate">
                        User Directory & Profile Authority
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#334E1B] group-hover:translate-x-0.5 transition-all duration-150 shrink-0 ml-2" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setActiveView('profile');
                    }}
                    className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer hover:bg-[#EDFFE0]/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EDFFE0]/70 text-[#334E1B] flex items-center justify-center shrink-0 group-hover:bg-[#334E1B] group-hover:text-white transition-colors duration-150 shadow-2xs">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#1F1F1F] group-hover:text-[#334E1B] transition-colors duration-150 truncate">
                        Profile Editor (With Master Switcher)
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#334E1B] group-hover:translate-x-0.5 transition-all duration-150 shrink-0 ml-2" />
                  </button>
                </div>

                {/* Inspect & Switch Client List */}
                <div className="px-5 py-2 text-[10px] uppercase font-bold text-[#777777] bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                  <span>Inspect & Switch Client</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#334E1B]" />
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-50 p-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setCurrentUserById(u.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 rounded-xl text-left flex items-center gap-2.5 hover:bg-[#EDFFE0]/50 transition-colors cursor-pointer ${
                        currentUser.id === u.id ? 'bg-[#EDFFE0] text-[#334E1B] font-bold' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-[#1F1F1F] flex items-center justify-center font-bold text-[10px] shrink-0 border border-slate-200">
                        {getInitials(u.businessName || u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#1F1F1F] truncate">{u.name}</div>
                        <div className="text-[10px] text-[#777777] capitalize">
                          {u.role.toLowerCase()} · {u.state}
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <span className="w-2 h-2 rounded-full bg-[#334E1B] shrink-0"></span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Buyer / Client Standard Menu Layout */
              <>
                {/* 3. Profile header */}
                <div className="px-6 pt-5 pb-4 bg-gradient-to-b from-[#F2FAEE] to-[#F8FCF5] border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Amina Bello (strongest text) */}
                      <h3 className="text-[15px] font-extrabold text-[#1F1F1F] tracking-tight leading-snug truncate">
                        {currentUser.name || 'Amina Bello'}
                      </h3>

                      {/* Lagos Fresh Processing & Foods Ltd (secondary text) */}
                      <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-snug truncate">
                        {currentUser.businessName || 'Lagos Fresh Processing & Foods Ltd'}
                      </p>

                      {/* procurement@lagosfoods.ng (smaller and muted) */}
                      <p className="text-[11px] font-medium text-slate-400 mt-1 font-mono truncate">
                        {currentUser.email || 'procurement@lagosfoods.ng'}
                      </p>
                    </div>

                    {/* Rounded Green BUYER badge */}
                    <span className="px-2.5 py-1 rounded-full bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5] text-[10px] font-extrabold tracking-wider uppercase shrink-0 shadow-2xs">
                      {currentUser.role || 'BUYER'}
                    </span>
                  </div>
                </div>

                {/* 4 & 5. Four clearly separated interactive menu options */}
                <div className="p-3 space-y-1">
                  {buyerMenuItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`header-menu-item-${item.id}`}
                        onClick={() => {
                          setIsOpen(false);
                          item.action();
                        }}
                        className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer hover:bg-[#EDFFE0]/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#EDFFE0]/70 text-[#334E1B] flex items-center justify-center shrink-0 group-hover:bg-[#334E1B] group-hover:text-white transition-colors duration-150 shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-[#1F1F1F] group-hover:text-[#334E1B] transition-colors duration-150 truncate">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#334E1B] group-hover:translate-x-0.5 transition-all duration-150 shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* 6. Logout section */}
            <div className="p-3 pt-2 border-t border-slate-100 bg-slate-50/40 rounded-b-[22px]">
              <button
                type="button"
                id="header-menu-logout-button"
                onClick={() => {
                  setIsOpen(false);
                  logoutToExitPage();
                }}
                className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/60 transition-all duration-150 cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-700 group-hover:text-white transition-colors duration-150 shadow-2xs">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-rose-700 group-hover:text-rose-900 transition-colors duration-150 truncate">
                    Logout & View Exit Summary
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-700 group-hover:translate-x-0.5 transition-all duration-150 shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
