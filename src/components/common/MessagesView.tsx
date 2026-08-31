import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  PhoneCall,
  User,
  DollarSign,
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');

  const safeConversations = conversations || [];
  const activeConv = safeConversations.find(c => c.id === activeConversationId) || safeConversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[500px]">
      {/* Left Column: Conversations List (1/3) */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Trade Conversations
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {safeConversations.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {safeConversations.map(conv => {
            const isSelected = activeConv?.id === conv.id;
            const participants = conv.participants || [];
            const otherParticipant = participants.find(p => p.id !== currentUser?.id) || participants[0];

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-4 cursor-pointer transition-colors space-y-1 ${
                  isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    {otherParticipant?.name || 'Counterparty'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-medium truncate">{conv.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{conv.lastMessage || 'No messages yet'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Thread & Input */}
      {activeConv ? (
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeConv.title}</h3>
              <p className="text-xs text-slate-500">
                Participants: {(activeConv.participants || []).map(p => p.name).join(', ')}
              </p>
            </div>

            <a
              href="https://wa.me/2348024445566"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {(activeConv.messages || []).map(msg => {
              const isMine = msg.senderId === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-500">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed shadow-2xs ${
                      isMine
                        ? 'bg-emerald-700 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="Type message or negotiation terms..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <button
              type="submit"
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a conversation to begin negotiation
        </div>
      )}
    </div>
  );
};
