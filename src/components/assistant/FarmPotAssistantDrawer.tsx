import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Package,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Truck,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Listing, Order } from '../../types';
import { AssistantMessage, AssistantAction } from './types';
import {
  INITIAL_ASSISTANT_MESSAGE,
  QUICK_START_OPTIONS,
  processAssistantQuery,
  AssistantEngineContext
} from './assistantEngine';
import { ProductCardInChat } from './ProductCardInChat';

interface FarmPotAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateDemand: () => void;
  onOpenCreateListing: () => void;
  onOpenNegotiation: (listing?: Listing) => void;
  onOpenInspection: (order?: Order) => void;
}

export const FarmPotAssistantDrawer: React.FC<FarmPotAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCreateDemand,
  onOpenCreateListing,
  onOpenNegotiation,
  onOpenInspection,
}) => {
  const {
    listings,
    orders,
    demandRequests,
    currentUser,
    marketPrices,
    conversations,
    setActiveView,
    setSelectedOrderId,
    setSelectedListingId,
    startTour,
    openAuth,
    startOrOpenConversation,
  } = useApp();

  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    try {
      const saved = localStorage.getItem('farmpot_assistant_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [INITIAL_ASSISTANT_MESSAGE];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('farmpot_assistant_chat', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  const engineContext: AssistantEngineContext = {
    listings: listings || [],
    orders: orders || [],
    demandRequests: demandRequests || [],
    currentUser: currentUser as any,
    marketPrices: marketPrices || [],
    conversationsCount: (conversations || []).length,
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputQuery;
    if (!rawText.trim()) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate snappy realistic thinking delay
    setTimeout(() => {
      const botResponse = processAssistantQuery(rawText, engineContext);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 380);
  };

  const handleResetConversation = () => {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    try {
      localStorage.removeItem('farmpot_assistant_chat');
    } catch {
      // ignore
    }
  };

  const handleExecuteAction = (action: AssistantAction) => {
    switch (action.type) {
      case 'NAVIGATE':
        if (action.payload?.view) {
          setActiveView(action.payload.view);
        }
        break;

      case 'OPEN_DEMAND_MODAL':
        onOpenCreateDemand();
        break;

      case 'OPEN_LISTING_MODAL':
        onOpenCreateListing();
        break;

      case 'OPEN_NEGOTIATION':
        if (action.payload?.listing) {
          setSelectedListingId(action.payload.listing.id);
          onOpenNegotiation(action.payload.listing);
        } else {
          onOpenNegotiation();
        }
        break;

      case 'OPEN_INSPECTION':
        if (action.payload?.order) {
          setSelectedOrderId(action.payload.order.id);
          onOpenInspection(action.payload.order);
        } else {
          onOpenInspection();
        }
        break;

      case 'OPEN_SUPPORT_CHAT': {
        const supportConvId = startOrOpenConversation({
          targetUserId: 'usr-admin-1',
          targetUserName: 'FarmPot Official Escrow & Operations Desk',
          title: 'FarmPot Support Inquiry',
        });
        setActiveView('messages');
        break;
      }

      case 'OPEN_AUTH':
        openAuth(action.payload?.clientType || 'FARMER');
        break;

      case 'START_TOUR':
        startTour();
        break;

      case 'CLARIFY_OPTION':
        if (action.payload?.clarifyPrompt) {
          handleSendMessage(action.payload.clarifyPrompt);
        }
        break;

      case 'EXTERNAL_LINK':
        if (action.payload?.url) {
          window.open(action.payload.url, '_blank', 'noopener,noreferrer');
        }
        break;

      default:
        break;
    }
  };

  // If minimized, display a sleek docked mini bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2">
        <div
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-2.5 bg-[#334E1B] text-white rounded-full shadow-xl border border-[#3F6B24] cursor-pointer hover:bg-[#3F6B24] transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-[#EDFFE0] flex items-center justify-center text-[#334E1B]">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs font-bold">FarmPot Assistant</div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-w-[460px] h-[640px] max-h-[calc(100vh-4rem)] flex flex-col bg-[#FAFAF8] rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden text-[#1F1F1F] font-sans antialiased animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="bg-[#334E1B] text-white px-4 py-3 sm:px-5 flex items-center justify-between border-b border-[#3F6B24] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-[#EDFFE0] flex items-center justify-center text-[#334E1B] font-bold text-sm shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#334E1B]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight text-white">FarmPot Assistant</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#EDFFE0]/20 text-[#EDFFE0] px-1.5 py-0.2 rounded border border-[#EDFFE0]/30">
                Official Guide
              </span>
            </div>
            <p className="text-[11px] text-[#EDFFE0]/80">Connected to Live Nigerian Market Catalog</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1 text-white/80">
          <button
            type="button"
            onClick={handleResetConversation}
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Minimize Assistant"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Persistent Quick-Start Shortcut Bar (Available even mid-conversation per specification) */}
      <div className="bg-[#EDFFE0]/60 border-b border-[#BEE7A5]/40 px-3 py-1.5 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 min-w-max text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E1B] shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick:
          </span>
          {QUICK_START_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSendMessage(opt.query)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#EDFFE0] text-stone-700 hover:text-[#334E1B] border border-stone-200/80 hover:border-[#334E1B]/30 font-medium text-[11px] whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} text-left`}
            >
              {/* Message Content Bubble */}
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-2xs text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-white border border-stone-200/80 text-stone-900 rounded-tl-xs'
                    : 'bg-[#334E1B] text-white rounded-tr-xs shadow-xs'
                }`}
              >
                {/* Formatted Text */}
                <div className="whitespace-pre-line break-words font-normal">
                  {msg.text.split('\n').map((line, lIdx) => {
                    // Render bullet points nicely
                    if (line.startsWith('- ') || line.startsWith('• ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 my-1">
                          <span className={isAssistant ? 'text-[#334E1B] font-bold' : 'text-[#EDFFE0]'}>•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Inline Product Cards (Live catalog integration) */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    {msg.products.map((card, cIdx) => (
                      <ProductCardInChat
                        key={card.listing.id || cIdx}
                        cardData={card}
                        onNegotiate={listing => {
                          setSelectedListingId(listing.id);
                          onOpenNegotiation(listing);
                        }}
                        onViewInMarketplace={listing => {
                          setSelectedListingId(listing.id);
                          setActiveView('marketplace');
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Direct Working Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {msg.actions.map(action => {
                      const isPrimary = action.variant === 'primary';
                      const isSecondary = action.variant === 'secondary';

                      let btnClass = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ';
                      if (isPrimary) {
                        btnClass += 'bg-[#334E1B] text-white hover:bg-[#3F6B24] shadow-xs';
                      } else if (isSecondary) {
                        btnClass += 'bg-[#EDFFE0] text-[#334E1B] hover:bg-[#EDFFE0]/80 border border-[#BEE7A5]';
                      } else {
                        btnClass += 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200';
                      }

                      return (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => handleExecuteAction(action)}
                          className={btnClass}
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick replies pills for follow-up */}
              {isAssistant && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pl-1">
                  {msg.quickReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => handleSendMessage(reply)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100/80 hover:bg-white text-stone-700 hover:text-[#334E1B] border border-stone-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-2xl border border-stone-200/80 w-fit text-stone-500 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#334E1B] animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-[#334E1B] animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-[#334E1B] animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-xs ml-1 text-stone-400 font-medium">Checking live FarmPot catalog...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-stone-200 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask about products, orders, escrow, procurement..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#334E1B]/30 focus:border-[#334E1B] text-stone-900 placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-[#334E1B] hover:bg-[#3F6B24] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-colors cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-stone-400">
          <span>FarmPot Intelligence · Real-time Catalog</span>
          <span>Zero Decorative UI</span>
        </div>
      </div>
    </div>
  );
};
