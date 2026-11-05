import React from 'react';
import { Camera, Activity, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { UserSettings } from '../types';
import type { ToiletSchedule } from './AdminScheduleControl';

interface MedisyHeaderProps {
  settings: UserSettings;
  currentRole: 'patient' | 'admin';
  schedule: ToiletSchedule;
  bathroomCount: number;
  totalFluidMl: number;
  waterGlasses?: number;
  oralitGlasses?: number;
  onOpenAvatarModal?: () => void;
}

export const MedisyHeader: React.FC<MedisyHeaderProps> = ({
  settings,
  currentRole,
  schedule,
  bathroomCount,
  totalFluidMl,
  waterGlasses = 0,
  oralitGlasses = 0,
  onOpenAvatarModal,
}) => {
  const isOverSchedule = bathroomCount > schedule.maxToiletVisits;
  const currentAvatar = currentRole === 'admin' ? settings.adminAvatar : settings.patientAvatar;
  const hydrationPercent = Math.min(100, Math.round((totalFluidMl / (schedule.hydrationTargetMl || 2500)) * 100));

  return (
    <div className="bg-medisy-header rounded-b-[36px] px-5 pt-[max(1.5rem,env(safe-area-inset-top,1.5rem))] pb-9 text-white shadow-lg relative">
      {/* Decorative concentric background circle rings matching reference photo */}
      <div className="absolute top-2 right-2 w-32 h-32 rounded-full border border-white/20 pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-44 h-44 rounded-full border border-white/15 pointer-events-none" />

      {/* Top Bar with Profile Avatar & Greeting */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        {/* Profile Avatar with clickable photo change */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAvatarModal}
            className="relative group focus:outline-none transition-transform hover:scale-105 active:scale-95 text-left"
            title="Klik untuk ubah foto profil"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/90 p-0.5 shadow-md bg-white overflow-hidden shrink-0 flex items-center justify-center">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Foto Profil"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                /* Crisp vector patient avatar that NEVER breaks offline */
                <svg viewBox="0 0 44 44" className="w-full h-full rounded-full" fill="none">
                  <rect width="44" height="44" fill="#EBF3FA" />
                  <circle cx="22" cy="16" r="8" fill="#FBBF24" />
                  <circle cx="22" cy="15" r="6" fill="#FDE68A" />
                  {/* Hijab / Headcover styling matching reference photo */}
                  <path
                    d="M13 18 C13 10 31 10 31 18 C31 22 28 25 22 25 C16 25 13 22 13 18 Z"
                    fill="#0077D7"
                  />
                  <ellipse cx="22" cy="18" rx="4.5" ry="5" fill="#FED7AA" />
                  <circle cx="20.5" cy="17" r="0.8" fill="#1E293B" />
                  <circle cx="23.5" cy="17" r="0.8" fill="#1E293B" />
                  <path d="M21 20 C21.5 20.8 22.5 20.8 23 20" stroke="#EA580C" strokeWidth="0.8" strokeLinecap="round" />
                  <path
                    d="M8 40 C8 31 14 26 22 26 C30 26 36 31 36 40 Z"
                    fill="#0A6EC7"
                  />
                </svg>
              )}
            </div>

            {/* Camera badge indicator */}
            <span
              className="w-4 h-4 rounded-full bg-white text-[#0077D7] absolute -bottom-0.5 -right-0.5 flex items-center justify-center shadow-md border border-[#0077D7]"
              title="Ganti Foto"
            >
              <Camera size={9} strokeWidth={2.8} color="#0077D7" style={{ color: '#0077D7' }} />
            </span>
          </button>

          <div>
            <span className="text-xs text-white/80 font-medium block">
              {currentRole === 'admin' ? 'Selamat bertugas,' : 'Cepet Sembuh'}
            </span>
            <button
              type="button"
              onClick={onOpenAvatarModal}
              className="text-left text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight hover:underline flex items-center gap-1.5"
              title="Klik untuk ubah foto profil"
            >
              <span>{currentRole === 'admin' ? settings.caregiverName || 'Ode' : settings.partnerName || 'Karin'}</span>
            </button>
          </div>
        </div>

        {/* Change photo button on top right */}
        <div className="text-right">
          <button
            type="button"
            onClick={onOpenAvatarModal}
            className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-[10px] font-bold text-white border border-white/20 transition-all flex items-center gap-1 shadow-xs"
            title="Ubah Foto Profil"
          >
            <Camera size={11} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
            <span>Ganti Foto</span>
          </button>
        </div>
      </div>

      {/* Floating Healthcare Card: STATUS HARIAN (Toilet & Asupan Cairan Hari Ini) */}
      <div className="mt-3.5 bg-gradient-to-br from-[#0B5CAD] via-[#0A6EC7] to-[#0284C7] rounded-3xl p-4 sm:p-4.5 shadow-xl border border-white/25 relative overflow-hidden">
        {/* Top Header of Card: Clean Status Pill */}
        <div className="mb-3 z-10 relative">
          <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 px-3 py-1 rounded-full text-white inline-flex items-center gap-1.5 shadow-xs">
            <Activity size={12} strokeWidth={2.6} color="#67E8F9" style={{ color: '#67E8F9' }} />
            <span>STATUS HARIAN OBSERVASI</span>
          </span>
        </div>

        {/* 2 Primary Stat Columns: Hari Ini Berapa Kali ke Toilet & Asupan Cairan */}
        <div className="grid grid-cols-2 gap-2.5 z-10 relative">
          {/* Column 1: Kunjungan Toilet / BAB */}
          <div className="bg-white/15 hover:bg-white/20 transition-all rounded-2xl p-3 backdrop-blur-xs border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wide block mb-0.5">
                Ke Toilet Hari Ini
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                  {bathroomCount}
                </span>
                <span className="text-xs font-semibold text-white/80">
                  /{schedule.maxToiletVisits}x BAB
                </span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center gap-1">
              {isOverSchedule ? (
                <span className="bg-amber-300 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <AlertTriangle size={10} strokeWidth={2.6} />
                  <span>Di Atas Target</span>
                </span>
              ) : (
                <span className="bg-emerald-300 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <CheckCircle2 size={10} strokeWidth={2.6} />
                  <span>Terkontrol Aman</span>
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Asupan Cairan & Oralit */}
          <div className="bg-white/15 hover:bg-white/20 transition-all rounded-2xl p-3 backdrop-blur-xs border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wide block mb-0.5 flex items-center justify-between">
                <span>Cairan Masuk</span>
                <span className="text-cyan-200 font-extrabold text-[10px]">{hydrationPercent}%</span>
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                  {totalFluidMl}
                </span>
                <span className="text-xs font-semibold text-white/80">
                  /{schedule.hydrationTargetMl} ml
                </span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-white/15 text-[10px] text-cyan-100 font-medium flex items-center gap-1">
              <Droplets size={11} strokeWidth={2.4} color="#67E8F9" style={{ color: '#67E8F9' }} />
              <span>{waterGlasses} Gelas • {oralitGlasses} Oralit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots (1 capsule dot + 3 circle dots, matching Medisy style) */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5">
        <span className="w-4 h-1.5 rounded-full bg-white shadow-xs" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>
    </div>
  );
};