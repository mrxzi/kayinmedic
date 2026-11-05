import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ArrowLeft, 
  Sparkles, 
  CheckCheck, 
  User, 
  Shield, 
  Trash2,
  Camera 
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderRole: 'patient' | 'admin';
  senderName: string;
  content: string;
  createdAt: string;
}

interface InAppChatProps {
  currentRole: 'patient' | 'admin';
  patientName: string;
  adminName: string;
  patientAvatar?: string;
  adminAvatar?: string;
  onBack: () => void;
  onOpenAvatarModal?: () => void;
}

export const InAppChat: React.FC<InAppChatProps> = ({
  currentRole,
  patientName,
  adminName,
  patientAvatar,
  adminAvatar,
  onBack,
  onOpenAvatarModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Instant optimistic message sending
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const senderName = currentRole === 'admin' ? (adminName || 'Ode') : (patientName || 'Karin');
    const tempId = 'temp_' + Date.now();
    const optimisticMsg: ChatMessage = {
      id: tempId,
      senderRole: currentRole,
      senderName,
      content: text,
      createdAt: new Date().toISOString(),
    };

    // Optimistically show message immediately in UI!
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText('');
    setIsSending(true);
    setTimeout(() => scrollToBottom('smooth'), 50);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: currentRole,
          senderName,
          content: text,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.message) {
          // Replace optimistic message with saved Neon database record
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? saved.message : m))
          );
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Khusus Admin: Reset seluruh riwayat chat di database
  const handleClearChat = async () => {
    if (window.confirm('Hapus seluruh riwayat chat di database? Semua pesan akan dihapus permanen.')) {
      try {
        const res = await fetch('/api/messages', { method: 'DELETE' });
        if (res.ok) {
          setMessages([]);
        }
      } catch (err) {
        console.error('Error clearing messages:', err);
      }
    }
  };

  const partnerDisplayName = currentRole === 'patient' 
    ? (adminName || 'Ode')
    : (patientName || 'Karin');

  const partnerSubtitle = 'Online • Terhubung';

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto bg-[#EEF2F6] flex flex-col h-full shadow-2xl overflow-hidden">
      {/* 1. Full-Width WhatsApp/Medisy Style Chat Header */}
      <header className="bg-gradient-to-r from-[#0077D7] to-[#0A85EA] text-white px-3.5 py-3 shadow-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-colors border border-white/20"
            title="Kembali ke Beranda"
          >
            <ArrowLeft size={20} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
          </button>

          {/* Partner Avatar with Online Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={onOpenAvatarModal}
              className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden focus:outline-none hover:ring-2 hover:ring-white/60 active:scale-95 transition-all"
              title="Klik untuk ubah foto profil"
            >
              {(currentRole === 'patient' ? adminAvatar : patientAvatar) ? (
                <img
                  src={currentRole === 'patient' ? adminAvatar : patientAvatar}
                  alt={partnerDisplayName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg viewBox="0 0 40 40" className="w-full h-full rounded-full" fill="none">
                  <rect width="40" height="40" fill="#EBF3FA" />
                  <circle cx="20" cy="15" r="7" fill="#0077D7" />
                  <path d="M8 36 C8 28 14 24 20 24 C26 24 32 28 32 36 Z" fill="#0077D7" />
                  <circle cx="20" cy="14" r="5.5" fill="#FED7AA" />
                  {currentRole === 'admin' ? (
                    <path d="M14 12 C14 8 26 8 26 12 C26 14 26 18 20 18 C14 18 14 14 14 12 Z" fill="#005FB0" />
                  ) : (
                    <path d="M15 10 C15 7 25 7 25 10 Z" fill="#334155" />
                  )}
                </svg>
              )}
            </button>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0077D7] absolute -bottom-0.5 -right-0.5 shadow-xs pointer-events-none" />
          </div>

          <div>
            <h2 className="font-extrabold text-sm sm:text-base leading-tight text-white flex items-center gap-1.5">
              <span>{partnerDisplayName}</span>
            </h2>
            <p className="text-[11px] text-cyan-200 font-medium">
              {partnerSubtitle}
            </p>
          </div>
        </div>

        {/* Action buttons on header right */}
        <div className="flex items-center gap-1.5">
          {onOpenAvatarModal && (
            <button
              type="button"
              onClick={onOpenAvatarModal}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-colors border border-white/20"
              title="Ubah Foto Profil"
            >
              <Camera size={14} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
            </button>
          )}

          {/* Khusus Admin: Tombol Reset Chat */}
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={handleClearChat}
              className="px-2.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/20 transition-all shadow-xs"
              title="Reset & Hapus Seluruh Riwayat Chat"
            >
              <Trash2 size={12} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Reset Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Messages Scroll Area (Fills 100% of height) */}
      <main className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-[#F8FAFC] flex flex-col justify-start">
        {/* Chat Security & Neon Database Encryption Notice */}
        <div className="text-center my-1">
          <span className="inline-block bg-white/90 border border-slate-200 text-slate-500 text-[10px] font-semibold px-3 py-1 rounded-full shadow-xs">
            
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="my-auto py-12 text-center text-slate-400">
            <Sparkles size={28} strokeWidth={2} color="#0077D7" className="mx-auto mb-2 opacity-70" style={{ color: '#0077D7' }} />
            <h4 className="font-bold text-sm text-slate-700">Belum Ada Pesan</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === currentRole;
            const msgTime = new Date(msg.createdAt).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                {/* Sender Tag with custom avatar circle */}
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 mb-1 px-1">
                  <div className="w-4 h-4 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center border border-slate-300">
                    {(msg.senderRole === 'patient' ? patientAvatar : adminAvatar) ? (
                      <img
                        src={msg.senderRole === 'patient' ? patientAvatar : adminAvatar}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : msg.senderRole === 'admin' ? (
                      <Shield size={9} color="#0077D7" style={{ color: '#0077D7' }} />
                    ) : (
                      <User size={9} color="#059669" style={{ color: '#059669' }} />
                    )}
                  </div>
                  <span>{msg.senderName}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] px-4 py-2.5 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-[#0077D7] to-[#0A85EA] text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                  {/* Timestamp & Delivery Double-Checkmark */}
                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                      isMe ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    <span>{msgTime}</span>
                    <CheckCheck size={12} strokeWidth={2.4} />
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* 3. Modern Input Bar at the Bottom (Clean without quick pills) */}
      <footer className="p-3 bg-white border-t border-slate-200/80 shrink-0 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentRole === 'admin'
                ? `Ketik pesan untuk ${patientName || 'Karin'}...`
                : `Ketik pesan untuk ${adminName || 'Ode'}...`
            }
            className="flex-1 bg-slate-100 border border-slate-200 focus:border-[#0077D7] focus:bg-white rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
          />

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#0077D7] hover:bg-[#005FB0] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shrink-0"
            title="Kirim Pesan"
          >
            <Send size={18} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
          </button>
        </form>
      </footer>
    </div>
  );
};