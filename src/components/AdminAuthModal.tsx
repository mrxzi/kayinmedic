import React, { useState, useEffect, useRef } from 'react';
import { Shield, KeyRound, ArrowLeft, Check, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.trim() === '2021') {
      onSuccess();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-slate-200 p-6 shadow-2xl relative text-center">
        {/* Shield Icon Header */}
        <div className="w-14 h-14 rounded-2xl bg-[#0077D7] text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-[#0077D7]/30">
          <Shield size={28} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Akses Khusus Admin
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
          
        </p>

        {/* PIN Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setError(false);
                setPin(e.target.value.replace(/[^0-9]/g, ''));
              }}
              onKeyDown={handleKeyDown}
              placeholder="••••"
              className={`w-full text-center tracking-[0.5em] text-2xl font-mono font-extrabold py-3 px-4 rounded-2xl border-2 transition-all focus:outline-none ${
                error
                  ? 'border-rose-500 bg-rose-50/50 text-rose-900 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50 focus:border-[#0077D7] focus:bg-white text-slate-900'
              }`}
            />
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
              <KeyRound size={20} strokeWidth={2.2} color="#94A3B8" style={{ color: '#94A3B8' }} />
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200 animate-shake">
              <AlertCircle size={14} strokeWidth={2.4} color="#E11D48" style={{ color: '#E11D48' }} />
              <span>Kode PIN salah! Masukkan kode 2021</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={pin.length === 0}
              className="w-full py-3 rounded-2xl bg-[#0077D7] hover:bg-[#005FB0] disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Check size={18} strokeWidth={2.5} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Verifikasi & Buka Panel Admin</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2.4} color="#64748B" style={{ color: '#64748B' }} />
              <span>Batal & Kembali ke Beranda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};