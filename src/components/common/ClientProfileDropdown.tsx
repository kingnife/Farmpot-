import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  const [position, setPosition] = useState<{
    left: number;
    width: number;
    arrowLeft: number;
  }>({
    left: 0,
    width: 410,
    arrowLeft: 205,
  });

  const getInitials = (name?: string) => {
    if (!name) return 'LF';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Desired dropdown width: comfortably display menu labels without wrapping
    const targetWidth = Math.min(410, viewportWidth - 24);

    // Trigger center on screen
    const triggerCenterScreen = rect.left + rect.width / 2;

    // Ideal left on screen to align horizontal centers
    let idealLeftScreen = triggerCenterScreen - targetWidth / 2;

    // Boundary constraints: ensure dropdown never extends outside viewport
    const minScreenMargin = 12;
    if (idealLeftScreen + targetWidth > viewportWidth - minScreenMargin) {
      idealLeftScreen = viewportWidth - minScreenMargin - targetWidth;
    }
    if (idealLeftScreen < minScreenMargin) {
      idealLeftScreen = minScreenMargin;
    }

    // Convert screen coordinate to offset relative to the trigger container
    const relativeLeft = idealLeftScreen - rect.left;

    // Calculate upward arrow position so it always points directly to the trigger center
    const calculatedArrow = Math.max(
      24,
      Math.min(targetWidth - 24, triggerCenterScreen - idealLeftScreen)
    );

    setPosition({
      left: relativeLeft,
      width: targetWidth,
      arrowLeft: calculatedArrow,
    });
  }, []);

  // Recalculate position when open or on resize/scroll
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleResizeOrScroll = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isOpen, updatePosition]);

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
    <div ref={containerRef} className="relative inline-block text-left">
      {/* 1. Client selector / dropdown trigger */}
      <button
        type="button"
        ref={triggerRef}
        id="header-user-profile-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="header-client-profile-dropdown-panel"
        className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl transition-all duration-150 cursor-pointer border select-none ${
          isOpen
            ? 'bg-[#F2FAEE] border-[#334E1B]/35 ring-2 ring-[#334E1B]/15 shadow-xs'
            : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 shadow-xs'
        }`}
      >
        {/* [ Company information ] */}
        <div className="flex flex-col items-end text-right min-w-0 max-w-[190px] sm:max-w-[260px] md:max-w-[320px]">
          <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider leading-none mb-1">
            {isAdmin ? 'ADMIN CLEARANCE' : `ROLE: ${currentUser.role}`}
          </span>
          <span className="text-xs font-bold text-[#1F1F1F] leading-snug break-words">
            {currentUser.businessName || currentUser.name}
          </span>
        </div>

        {/* [ LF Circular Logo ] */}
        <div className="w-9 h-9 shrink-0 rounded-full border-2 border-[#BEE7A5] bg-[#EDFFE0] text-[#334E1B] flex items-center justify-center text-xs font-extrabold shadow-xs">
          {getInitials(currentUser.businessName || currentUser.name)}
        </div>

        {/* [ Down-chevron with smooth rotation ] */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ease-out ${
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
          className="absolute top-full mt-2.5 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150 ease-out"
          style={{
            left: `${position.left}px`,
            width: `${position.width}px`,
          }}
        >
          {/* Visual Connection Arrow pointing to the selector */}
          <div
            aria-hidden="true"
            className="absolute -top-[7px] w-3.5 h-3.5 bg-[#F2FAEE] border-t border-l border-[#BEE7A5] rotate-45 z-30"
            style={{
              left: `${position.arrowLeft}px`,
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />

          {/* Clean Floating Panel Container */}
          <div className="relative z-20 bg-white rounded-[22px] border border-[#BEE7A5]/70 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_4px_16px_rgba(51,78,27,0.06)] overflow-hidden">
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
