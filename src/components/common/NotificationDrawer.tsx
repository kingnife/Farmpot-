import React from 'react';
import { X, CheckCheck, Bell, ArrowRight, ShieldAlert, Truck, DollarSign, PackageCheck, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveView,
    setSelectedOrderId,
  } = useApp();

  if (!isOpen) return null;

  const userNotifs = (notifications || []).filter(n => n.userId === currentUser?.id || n.userId === 'all');

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ESCROW':
      case 'PAYMENT':
      case 'SETTLEMENT':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'TRANSPORT':
      case 'PICKUP':
      case 'DELIVERY':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'QUALITY':
      case 'MATCH':
      case 'OFFER':
      case 'AGREEMENT':
        return <PackageCheck className="w-4 h-4 text-amber-600" />;
      case 'DISPUTE':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'VERIFICATION':
        return <FileCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (n: NotificationItem) => {
    markNotificationAsRead(n.id);
    onClose();

    if (n.targetType === 'ORDER' && n.targetId) {
      setSelectedOrderId(n.targetId);
      setActiveView('orders');
    } else if (n.targetType === 'REQUEST') {
      setActiveView('requests');
    } else if (n.targetType === 'LISTING') {
      setActiveView('listings');
    } else if (n.targetType === 'VERIFICATION') {
      setActiveView('verification');
    } else if (n.targetType === 'WALLET') {
      setActiveView('payments');
    } else if (n.targetType === 'DISPUTE') {
      setActiveView('disputes');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Activity & Notifications</h3>
                <p className="text-[11px] text-slate-500">{userNotifs.length} event updates</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {userNotifs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              userNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 hover:bg-slate-50/80 transition-colors cursor-pointer relative flex gap-3.5 items-start ${
                    !n.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-4 right-4" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
