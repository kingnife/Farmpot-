import React from 'react';
import {
  Building2,
  Sprout,
  Truck,
  ShieldAlert,
  LogIn,
  UserPlus,
  LogOut,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthClientType, AuthPageView } from '../../types';
import { BuyerAuth } from './BuyerAuth';
import { FarmerAuth } from './FarmerAuth';
import { TransporterAuth } from './TransporterAuth';
import { AdminAuth } from './AdminAuth';

export const UnifiedAuthView: React.FC = () => {
  const {
    authClient,
    setAuthClient,
    authPage,
    setAuthPage,
    closeAuth,
    currentUser,
  } = useApp();

  const clients: {
    id: AuthClientType;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    activeBorder: string;
    activeBg: string;
  }[] = [
    {
      id: 'BUYER',
      label: 'The Buyers',
      description: 'Processors & Retailers',
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-emerald-700',
      activeBorder: 'border-emerald-600',
      activeBg: 'bg-emerald-50 text-emerald-950 font-bold shadow-sm',
    },
    {
      id: 'FARMER',
      label: 'The Farmers',
      description: 'Producers & Cooperatives',
      icon: <Sprout className="w-5 h-5" />,
      color: 'text-amber-700',
      activeBorder: 'border-amber-600',
      activeBg: 'bg-amber-50 text-amber-950 font-bold shadow-sm',
    },
    {
      id: 'TRANSPORTER',
      label: 'The Transporters',
      description: 'Freight & Fleet Carriers',
      icon: <Truck className="w-5 h-5" />,
      color: 'text-blue-700',
      activeBorder: 'border-blue-600',
      activeBg: 'bg-blue-50 text-blue-950 font-bold shadow-sm',
    },
    {
      id: 'ADMIN',
      label: 'The Admin',
      description: 'Escrow & Control Tower',
      icon: <ShieldAlert className="w-5 h-5" />,
      color: 'text-purple-700',
      activeBorder: 'border-purple-600',
      activeBg: 'bg-purple-50 text-purple-950 font-bold shadow-sm',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900/40 backdrop-blur-md fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-4xl mb-6 bg-slate-900/90 text-white rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeAuth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Return to Applet Marketplace"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Marketplace</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white">
              FarmPot Client Authentication Suite
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              4 Portals
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Close modal X button */}
          <button
            type="button"
            onClick={closeAuth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close portal window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Client Category Selector Tabs */}
      <div className="w-full max-w-4xl mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {clients.map(c => {
          const isSelected = authClient === c.id;
          return (
            <button
              key={c.id}
              type="button"
              id={`auth-tab-${c.id.toLowerCase()}`}
              onClick={() => setAuthClient(c.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `bg-white ${c.activeBorder} shadow-lg ring-2 ring-emerald-500/20 text-slate-900`
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-slate-100 ' + c.color : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {c.icon}
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                )}
              </div>

              <div>
                <div className="text-xs font-bold">{c.label}</div>
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? 'text-slate-500 font-medium' : 'text-slate-400'
                  }`}
                >
                  {c.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Client Specific Auth Component */}
      <div className="w-full max-w-4xl">
        {authClient === 'BUYER' && (
          <BuyerAuth
            initialView={authPage}
            onSwitchClient={c => setAuthClient(c)}
          />
        )}
        {authClient === 'FARMER' && (
          <FarmerAuth
            initialView={authPage}
            onSwitchClient={c => setAuthClient(c)}
          />
        )}
        {authClient === 'TRANSPORTER' && (
          <TransporterAuth
            initialView={authPage}
            onSwitchClient={c => setAuthClient(c)}
          />
        )}
        {authClient === 'ADMIN' && (
          <AdminAuth
            initialView={authPage}
            onSwitchClient={c => setAuthClient(c)}
          />
        )}
      </div>

      {/* Quick Demo Footer Notice */}
      <div className="w-full max-w-4xl mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>
            Currently viewing <strong>{authClient}</strong> Portal · Page:{' '}
            <strong className="capitalize">{authPage}</strong>
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button
            type="button"
            onClick={() => setAuthPage('login')}
            className="hover:text-emerald-400 cursor-pointer underline"
          >
            Switch to Login
          </button>
          <button
            type="button"
            onClick={() => setAuthPage('signup')}
            className="hover:text-emerald-400 cursor-pointer underline"
          >
            Switch to Sign-Up
          </button>
          <button
            type="button"
            onClick={() => setAuthPage('exit')}
            className="hover:text-emerald-400 cursor-pointer underline"
          >
            Switch to Exit Session
          </button>
        </div>
      </div>
    </div>
  );
};
