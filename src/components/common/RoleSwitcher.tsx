import React from 'react';
import { Users, ShoppingBag, Sprout, Truck, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, users, setCurrentUserById } = useApp();

  const roleOptions: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; userMatchId: string }[] = [
    {
      role: 'BUYER',
      title: 'Buyer (Lagos Fresh Processing)',
      subtitle: 'Amina Bello • Procurement Manager',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
      userMatchId: 'usr-buyer-1',
    },
    {
      role: 'FARMER',
      title: 'Farmer (Zaria Agro Farms)',
      subtitle: 'Alhaji Musa Danladi • Kaduna State',
      icon: <Sprout className="w-4 h-4 text-amber-600" />,
      userMatchId: 'usr-farmer-1',
    },
    {
      role: 'TRANSPORTER',
      title: 'Transporter (Cold-Chain Haulage)',
      subtitle: 'Emeka Okonkwo • 15T Reefer Truck',
      icon: <Truck className="w-4 h-4 text-blue-600" />,
      userMatchId: 'usr-transporter-1',
    },
    {
      role: 'ADMIN',
      title: 'Admin & Verification Control',
      subtitle: 'Dr. Babatunde Sanusi • Super Admin',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      userMatchId: 'usr-admin-1',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 text-xs text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Persona:
          </span>
          <span className="font-semibold text-white">{currentUser.name}</span>
          <span className="text-slate-400">({currentUser.role})</span>
          <span className="text-slate-500 hidden sm:inline">• {currentUser.businessName || currentUser.state}</span>
        </div>

        {/* Persona quick switch buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-[11px] text-slate-400 mr-1 hidden lg:inline flex items-center gap-1">
            <Users className="w-3 h-3" />
            Switch View:
          </span>
          {roleOptions.map(opt => {
            const isSelected = currentUser.id === opt.userMatchId || currentUser.role === opt.role;
            return (
              <button
                key={opt.role}
                type="button"
                id={`switch-to-${opt.role.toLowerCase()}`}
                onClick={() => setCurrentUserById(opt.userMatchId)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs font-medium cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title={`Switch to ${opt.title}`}
              >
                {isSelected ? <Check className="w-3 h-3 text-white shrink-0" /> : null}
                <span>{opt.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
