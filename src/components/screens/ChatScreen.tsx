import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Shield,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ChatScreenProps {
  transactionId: string;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ transactionId, onBack }) => {
  const { transactions, messages, sendChatMessage, currentUser } = useApp();
  const [inputText, setInputText] = useState('');

  const tx = transactions.find(t => t.id === transactionId);
  if (!tx) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#DFD5C8] text-center">
        <p className="text-xs text-[#786D65]">Transaction conversation not found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-[#9E6E4F] font-semibold cursor-pointer">
          Go back
        </button>
      </div>
    );
  }

  const isBorrower = currentUser ? currentUser.id === tx.borrowerId : false;
  const otherPartyName = isBorrower ? tx.ownerName : tx.borrowerName;
  const conversationMessages = messages.filter(m => m.transactionId === tx.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(tx.id, inputText);
    setInputText('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#DFD5C8] overflow-hidden shadow-sm flex flex-col h-[650px]">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#DFD5C8] bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-neutral-100 text-[#786D65] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xs font-bold text-[#28231F]">{otherPartyName}</h3>
            <p className="text-[10px] text-[#786D65]">
              {isBorrower ? 'Community Lender' : 'Verified Borrower'} · Transaction #{tx.id.slice(-6)}
            </p>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-md bg-[#F7F3EC] text-[#9E6E4F] border border-[#9E6E4F]/20 text-[10px] font-bold">
          {tx.status.replace('_', ' ')}
        </div>
      </div>

      {/* Safety Notice Ribbon */}
      <div className="bg-[#F7F3EC] px-4 py-2 border-b border-[#9E6E4F]/20 text-[11px] text-[#28231F] flex items-center gap-2 shrink-0">
        <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>LendLoop Safety: Always meet in public transit hubs and inspect condition before exchanging OTP.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F3EC]/20">
        {conversationMessages.length === 0 ? (
          <div className="text-center py-12 text-[#786D65] text-xs">
            <p>No messages yet. Say hi and agree on a convenient public handover spot!</p>
          </div>
        ) : (
          conversationMessages.map(msg => {
            const isMe = currentUser ? msg.senderId === currentUser.id : false;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                    isMe
                      ? 'bg-[#9E6E4F] text-white rounded-tr-sm'
                      : 'bg-white text-[#28231F] border border-[#DFD5C8] rounded-tl-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-[#786D65] px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#9E6E4F]" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#DFD5C8] bg-white flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={`Message ${otherPartyName}...`}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#DFD5C8] outline-none focus:border-[#9E6E4F] bg-white text-[#28231F]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`p-2.5 rounded-xl text-white transition-all cursor-pointer ${
            inputText.trim() ? 'bg-[#9E6E4F] hover:bg-[#855739]' : 'bg-neutral-300 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
