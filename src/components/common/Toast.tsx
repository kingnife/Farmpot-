import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-900/95 border-emerald-700 text-emerald-100',
    error: 'bg-rose-900/95 border-rose-700 text-rose-100',
    warning: 'bg-amber-900/95 border-amber-700 text-amber-100',
    info: 'bg-slate-900/95 border-slate-700 text-slate-100',
  }[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md max-w-md ${bgStyles}`}>
        {icons[toast.type]}
        <div className="text-xs font-medium pr-2">{toast.message}</div>
      </div>
    </div>
  );
};
