import React from 'react';
import { Activity, ShieldAlert, Settings, Calendar, UserCheck, Shield } from 'lucide-react';
import type { UserSettings } from '../types';
import type { ToiletSchedule } from './AdminScheduleControl';

interface HeaderCareBannerProps {
  settings: UserSettings;
  onOpenSettings: () => void;
  onOpenWhatsApp: () => void;
  onOpenRedFlags: () => void;
  bathroomCount: number;
  totalFluidMl: number;
  targetFluidMl: number;
  logsCount: number;
  latestPainLevel: number;
  currentRole: 'patient' | 'admin';
  onToggleRole: () => void;
  schedule: ToiletSchedule;
}

export const HeaderCareBanner: React.FC<HeaderCareBannerProps> = ({
  settings,
  onOpenSettings,
  onOpenWhatsApp,
  onOpenRedFlags,
  bathroomCount,
  totalFluidMl,
  targetFluidMl,
  latestPainLevel,
  currentRole,
  onToggleRole,
  schedule,
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const hydrationPercent = Math.min(Math.round((totalFluidMl / targetFluidMl) * 100), 100);
  const isOverSchedule = bathroomCount > schedule.maxToiletVisits;

  return (
    <header className="w-full mb-4">
      {/* Top Clinical Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm mb-3.5">
        <div className="flex items-center justify-between gap-2">
          {/* Medical Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                  MEDIC CARE
                </span>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                  RAWAT MANDIRI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-teal-600" />
                Pasien: <strong className="text-slate-800">{settings.partnerName || 'Karin'}</strong>
              </p>
            </div>
          </div>

          {/* Role Switcher & Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Multi-role Account Switcher */}
            <button
              onClick={onToggleRole}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border shadow-xs ${
                currentRole === 'admin'
                  ? 'bg-teal-800 text-white border-teal-800'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Ganti Mode Pasien / Admin"
            >
              {currentRole === 'admin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-teal-200" />
                  <span>Akun: Admin</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Akun: Pasien</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenRedFlags}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
              title="Triase Tanda Bahaya Medis"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="hidden sm:inline">Triase Bahaya</span>
            </button>

            <button
              onClick={onOpenWhatsApp}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="WhatsApp Backup"
            >
              WA
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Pengaturan"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin's Scheduled Target Notice */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Observasi: {currentDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Jadwal Admin:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                isOverSchedule
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-teal-50 text-teal-800 border border-teal-200'
              }`}
            >
              Maks. {schedule.maxToiletVisits}x BAB ({bathroomCount}x tercatat)
            </span>
          </div>
        </div>
      </div>

      {/* Medical Vitals & Triage Snapshot Cards */}
      <div className="grid grid-cols-3 gap-2">
        {/* Bathroom Visits */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 text-center">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
            Frekuensi BAB
          </span>
          <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
            {bathroomCount} <span className="text-[10px] sm:text-xs font-normal text-slate-400">/ {schedule.maxToiletVisits}x</span>
          </div>
          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${isOverSchedule ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
            {isOverSchedule ? 'Lewat Batas' : 'Dalam Batas'}
          </span>
        </div>

        {/* Total Fluid Rehydration */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 text-center">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
            Asupan Cairan
          </span>
          <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
            {totalFluidMl} <span className="text-[10px] sm:text-xs font-normal text-slate-400">ml</span>
          </div>
          <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
            {hydrationPercent}% WHO
          </span>
        </div>

        {/* Pain Score VAS */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 text-center">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
            Skor Kram VAS
          </span>
          <div className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
            {latestPainLevel} <span className="text-[10px] sm:text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 bg-slate-100 text-slate-700">
            {latestPainLevel <= 3 ? 'Ringan' : latestPainLevel <= 6 ? 'Sedang' : 'Kuat'}
          </span>
        </div>
      </div>
    </header>
  );
};
