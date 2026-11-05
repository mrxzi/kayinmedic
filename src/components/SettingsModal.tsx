import React, { useState } from 'react';
import { X, Save, RotateCcw, User, Phone, ShieldCheck } from 'lucide-react';
import type { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onResetDailyData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetDailyData,
}) => {
  const [partnerName, setPartnerName] = useState(settings.partnerName);
  const [caregiverName, setCaregiverName] = useState(settings.caregiverName);
  const [waNumber, setWaNumber] = useState(settings.waNumber);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      partnerName: partnerName.trim() || 'Karin',
      caregiverName: caregiverName.trim() || 'Ode',
      waNumber: waNumber.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm('Reset rekam observasi dan hitungan cairan hari ini ke 0?')) {
      onResetDailyData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} strokeWidth={2.4} color="#64748B" style={{ color: '#64748B' }} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077D7]">
            <ShieldCheck size={20} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
              Konfigurasi Dashboard
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Profil Karin & Ode
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User size={14} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
              <span>Nama (Karin):</span>
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Karin"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0077D7] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User size={14} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
              <span>Nama (Ode):</span>
            </label>
            <input
              type="text"
              value={caregiverName}
              onChange={(e) => setCaregiverName(e.target.value)}
              placeholder="Ode"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0077D7] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone size={14} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
              <span>Nomor WhatsApp Pendamping (Untuk SOS Darurat):</span>
            </label>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="6281234567890"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0077D7] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Gunakan format internasional (misal 62812...)
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#0077D7] hover:bg-[#005FB0] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Save size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>

        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Reset Harian:</span>
            <span className="text-[10px] text-slate-400 block">Nol-kan hitungan toilet & cairan hari ini</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors border border-slate-200"
          >
            <RotateCcw size={14} strokeWidth={2.2} color="#E11D48" style={{ color: '#E11D48' }} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};