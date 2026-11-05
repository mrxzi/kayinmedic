import React, { useState } from 'react';
import { Shield, Save, CheckCircle2, AlertTriangle, Database, LogOut, Camera } from 'lucide-react';

export interface ToiletSchedule {
  maxToiletVisits: number;
  hydrationTargetMl: number;
  adminNotes: string;
  warningThreshold: number;
  updatedAt?: string;
}

interface AdminScheduleControlProps {
  schedule: ToiletSchedule;
  onUpdateSchedule: (newSchedule: ToiletSchedule) => void;
  currentBathroomCount: number;
  isPostgresConnected: boolean;
  postgresError: string | null;
  onLogoutAdmin?: () => void;
  onOpenAvatarModal?: () => void;
}

export const AdminScheduleControl: React.FC<AdminScheduleControlProps> = ({
  schedule,
  onUpdateSchedule,
  currentBathroomCount,
  isPostgresConnected,
  postgresError,
  onLogoutAdmin,
  onOpenAvatarModal,
}) => {
  const [maxVisits, setMaxVisits] = useState(schedule.maxToiletVisits);
  const [hydrationTarget, setHydrationTarget] = useState(schedule.hydrationTargetMl);
  const [warningThreshold, setWarningThreshold] = useState(schedule.warningThreshold);
  const [adminNotes, setAdminNotes] = useState(schedule.adminNotes);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ToiletSchedule = {
      maxToiletVisits: Number(maxVisits),
      hydrationTargetMl: Number(hydrationTarget),
      warningThreshold: Number(warningThreshold),
      adminNotes: adminNotes.trim(),
      updatedAt: new Date().toISOString(),
    };

    onUpdateSchedule(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isOverSchedule = currentBathroomCount > schedule.maxToiletVisits;
  const isCritical = currentBathroomCount >= schedule.warningThreshold;

  return (
    <div className="space-y-4">
      {/* Admin Session Banner & Logout Button */}
      {onLogoutAdmin && (
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">
              Sesi Admin Terautentikasi (PIN 2021)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAvatarModal && (
              <button
                type="button"
                onClick={onOpenAvatarModal}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/20"
                title="Ubah Foto Profil"
              >
                <Camera size={13} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
                <span>Foto Profil</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogoutAdmin}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/20"
            >
              <LogOut size={14} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Schedule Monitoring Card (Real-time vs Admin Target) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0077D7] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Monitoring Jadwal Toilet Karin
              </h3>
              <p className="text-[11px] text-slate-500">
                Perbandingan kunjungan aktual Karin vs. batas yang ditentukan Ode
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isCritical
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : isOverSchedule
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isCritical
              ? '🚨 Melebihi Ambang Kritis'
              : isOverSchedule
              ? '⚠️ Melebihi Jadwal'
              : '🟢 Dalam Batas Terjadwal'}
          </span>
        </div>

        {/* Real-time comparison metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Aktual Kunjungan
            </span>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {currentBathroomCount} <span className="text-xs font-normal text-slate-500">kali</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Target Batas Admin
            </span>
            <div className="text-xl font-extrabold text-[#0077D7] mt-0.5">
              {schedule.maxToiletVisits} <span className="text-xs font-normal text-slate-500">kali maks</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Batas Peringatan Kritis
            </span>
            <div className="text-xl font-extrabold text-rose-700 mt-0.5">
              {schedule.warningThreshold} <span className="text-xs font-normal text-slate-500">kali</span>
            </div>
          </div>
        </div>

        {/* Warning Callout if patient exceeds schedule */}
        {isOverSchedule && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle size={16} strokeWidth={2.4} color="#D97706" className="shrink-0 mt-0.5" style={{ color: '#D97706' }} />
            <div>
              <strong>Peringatan Jadwal:</strong> Karin sudah ke toilet {currentBathroomCount} kali (melebihi batas {schedule.maxToiletVisits} kali yang Anda tentukan). Pastikan Karin mengonsumsi larutan Oralit ekstra dan istirahat berbaring.
            </div>
          </div>
        )}
      </div>

      {/* 2. Admin Setting Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
            Pengaturan Jadwal Harian
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Atur Batas Toilet & Target Karin Hari Ini
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perubahan jadwal ini akan langsung terlihat di tampilan Karin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Batas BAB Hari Ini (kali):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={maxVisits}
                onChange={(e) => setMaxVisits(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0077D7]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Target frekuensi maksimal
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Target Hidrasi (ml):
              </label>
              <input
                type="number"
                step="250"
                min="1000"
                max="5000"
                value={hydrationTarget}
                onChange={(e) => setHydrationTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0077D7]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Standar 2.000–3.000 ml
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Ambang Bahaya Kritis (kali):
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0077D7]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Jika tercapai, disarankan ke dokter
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">
              Pesan / Catatan Ode untuk Karin:
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="misal: 'Target hari ini maks 3 kali ya sayang. Jangan lupa habis BAB wajib minum oralit 1 gelas!'..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0077D7]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#0077D7] hover:bg-[#005FB0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
                <span>Jadwal Berhasil Diperbarui & Disimpan!</span>
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
                <span>Simpan Pengaturan Jadwal Admin</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 3. Database & PostgreSQL Status Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077D7] shrink-0">
            <Database size={16} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">
              Status Basis Data: {isPostgresConnected ? 'Neon Serverless PostgreSQL Terhubung' : 'Penyimpanan Data Lokal (Fallback)'}
            </span>
            <p className="text-[11px] text-slate-500">
              {isPostgresConnected
                ? 'Semua chat & rekam medis tersimpan otomatis di Neon PostgreSQL Cloud (US-East-2).'
                : postgresError
                ? `PostgreSQL: ${postgresError}. Data tersimpan di server local JSON.`
                : 'Penyimpanan data lokal aktif & sinkron.'}
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
            isPostgresConnected
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          {isPostgresConnected ? '● Neon Cloud Aktif' : '● Auto-Sync Lokal'}
        </span>
      </div>
    </div>
  );
};