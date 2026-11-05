import React, { useState, useRef } from 'react';
import { Camera, X, Check, RotateCcw, Upload, User, Shield } from 'lucide-react';
import type { UserSettings } from '../types';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  initialRole?: 'patient' | 'admin';
  onSaveAvatar: (role: 'patient' | 'admin', avatarUrl?: string) => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialRole = 'patient',
  onSaveAvatar,
}) => {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'admin'>(initialRole);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentSavedAvatar = selectedRole === 'patient' ? settings.patientAvatar : settings.adminAvatar;
  const activeAvatar = preview !== null ? preview : currentSavedAvatar;

  const handleRoleChange = (role: 'patient' | 'admin') => {
    setSelectedRole(role);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize and optimize image to max 400x400 for fast loading
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreview(optimizedDataUrl);
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (preview !== null) {
      onSaveAvatar(selectedRole, preview);
    }
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan ke avatar ilustrasi bawaan?')) {
      onSaveAvatar(selectedRole, undefined);
      setPreview(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} strokeWidth={2.4} color="#64748B" style={{ color: '#64748B' }} />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077D7]">
            <Camera size={16} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            Ubah Foto Profil
          </h3>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => handleRoleChange('patient')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'patient'
                ? 'bg-white text-[#0077D7] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={14} strokeWidth={2.4} />
            <span>{settings.partnerName || 'Karin'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-white text-[#0077D7] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield size={14} strokeWidth={2.4} />
            <span>{settings.caregiverName || 'Ode'}</span>
          </button>
        </div>

        {/* Avatar Circular Preview */}
        <div className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-28 h-28 rounded-full border-4 border-[#0077D7] p-1 shadow-lg bg-white overflow-hidden flex items-center justify-center">
            {activeAvatar ? (
              <img
                src={activeAvatar}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <svg viewBox="0 0 44 44" className="w-full h-full rounded-full" fill="none">
                <rect width="44" height="44" fill="#EBF3FA" />
                <circle cx="22" cy="16" r="8" fill="#FBBF24" />
                <circle cx="22" cy="15" r="6" fill="#FDE68A" />
                <path
                  d="M13 18 C13 10 31 10 31 18 C31 22 28 25 22 25 C16 25 13 22 13 18 Z"
                  fill="#0077D7"
                />
                <ellipse cx="22" cy="18" rx="4.5" ry="5" fill="#FED7AA" />
                <circle cx="20.5" cy="17" r="0.8" fill="#1E293B" />
                <circle cx="23.5" cy="17" r="0.8" fill="#1E293B" />
                <path d="M21 20 C21.5 20.8 22.5 20.8 23 20" stroke="#EA580C" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M8 40 C8 31 14 26 22 26 C30 26 36 31 36 40 Z" fill="#0A6EC7" />
              </svg>
            )}
          </div>

          {/* Camera overlay hover icon */}
          <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
            <Camera size={24} strokeWidth={2.4} />
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#0077D7] text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white shadow-md active:scale-95"
            title="Pilih Foto"
          >
            <Camera size={14} strokeWidth={2.4} color="#FFFFFF" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
           <strong>{selectedRole === 'patient' ? (settings.partnerName || 'Karin') : (settings.caregiverName || 'Ode')}</strong>.
        </p>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
          >
            <Upload size={14} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
            <span>Pilih File Foto Baru</span>
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0077D7] hover:bg-[#005FB0] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Check size={16} strokeWidth={2.5} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Simpan Foto Profil Ini</span>
            </button>
          )}

          {currentSavedAvatar && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="w-full py-2 px-3 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center justify-center gap-1"
            >
              <RotateCcw size={12} strokeWidth={2.2} />
              <span>Kembalikan ke Avatar Ilustrasi Bawaan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};