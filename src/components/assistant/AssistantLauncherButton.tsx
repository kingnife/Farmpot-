import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AssistantLauncherButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AssistantLauncherButton: React.FC<AssistantLauncherButtonProps> = ({
  isOpen,
  onClick,
}) => {
  if (isOpen) return null;

  return (
    <button
      type="button"
      id="farmpot-assistant-floating-launcher"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-[#334E1B] hover:bg-[#3F6B24] text-white rounded-full shadow-lg hover:shadow-xl border border-[#3F6B24] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      title="Open FarmPot Assistant (Product discovery, orders, procurement & support)"
      aria-label="Open FarmPot Assistant"
    >
      <div className="relative">
        <div className="w-7 h-7 rounded-full bg-[#EDFFE0] flex items-center justify-center text-[#334E1B] font-bold shadow-xs group-hover:scale-105 transition-transform">
          <Bot className="w-4 h-4" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#334E1B] animate-pulse"></span>
      </div>

      <div className="text-left hidden sm:block">
        <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
          <span>FarmPot Assistant</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#EDFFE0] text-[#334E1B]">
            AI
          </span>
        </div>
        <div className="text-[10px] text-[#EDFFE0]/80 leading-tight">
          How can I help you today?
        </div>
      </div>
    </button>
  );
};
