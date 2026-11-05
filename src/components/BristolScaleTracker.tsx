import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Droplets
} from 'lucide-react';
import { BRISTOL_SCALE_DATA } from '../data/bristolScale';
import { BristolStoolVisual } from './BristolStoolVisual';
import type { StoolLogEntry } from '../types';
import type { ToiletSchedule } from './AdminScheduleControl';

interface BristolScaleTrackerProps {
  bathroomCount: number;
  onUpdateBathroomCount: (newCount: number) => void;
  onAddLog: (log: Omit<StoolLogEntry, 'id' | 'timestamp'>) => void;
  onTriggerOralitSuggestion: () => void;
  totalFluidMl?: number;
  latestPainLevel?: number;
  schedule?: ToiletSchedule;
  onQuickAddWater?: () => void;
}

export const BristolScaleTracker: React.FC<BristolScaleTrackerProps> = ({
  bathroomCount,
  onUpdateBathroomCount,
  onAddLog,
  onTriggerOralitSuggestion,
  totalFluidMl = 0,
  latestPainLevel = 2,
  schedule,
  onQuickAddWater,
}) => {
  const [selectedType, setSelectedType] = useState<number>(4);
  const [painLevel, setPainLevel] = useState<number>(2);
  const [note, setNote] = useState<string>('');
  const [justSaved, setJustSaved] = useState<boolean>(false);

  const currentTypeInfo = BRISTOL_SCALE_DATA.find((item) => item.type === selectedType)!;
  const isDiarrhea = selectedType >= 5;
  const isOverSchedule = schedule ? bathroomCount > schedule.maxToiletVisits : false;

  const handleSaveLog = () => {
    onAddLog({
      type: selectedType,
      painLevel,
      notes: note.trim() || undefined,
    });
    onUpdateBathroomCount(bathroomCount + 1);

    if (isDiarrhea) {
      onTriggerOralitSuggestion();
    }

    setJustSaved(true);
    setNote('');
    setTimeout(() => setJustSaved(false), 2000);
  };

  const getVasInfo = (level: number) => {
    if (level <= 2) {
      return {
        text: 'Nyeri Minimal (VAS 1-2)',
        clinical: 'Pasien merasa nyaman, tidak ada spasme otot polos abdomen.',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (level <= 4) {
      return {
        text: 'Nyeri Ringan (VAS 3-4)',
        clinical: 'Spasme ringan berkala, kembung/distensi abdomen ringan.',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    if (level <= 6) {
      return {
        text: 'Nyeri Sedang (VAS 5-6)',
        clinical: 'Mulas kolik abdomen sedang, aktivitas terganggu, perlu istirahat.',
        bg: 'bg-orange-50 text-orange-800 border-orange-200',
      };
    }
    if (level <= 8) {
      return {
        text: 'Nyeri Berat (VAS 7-8)',
        clinical: 'Kram tajam menyiksa, posisi membungkuk, perlu kompres hangat & observasi.',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
      };
    }
    return {
      text: 'Nyeri Ekstrem (VAS 9-10)',
      clinical: 'Nyeri hebat konstan tak tertahankan, waspada tanda akut abdomen.',
      bg: 'bg-red-100 text-red-900 border-red-300',
    };
  };

  const vasInfo = getVasInfo(painLevel);

  return (
    <div className="space-y-4">
      {/* Real-time Triage & Schedule Summary Bar (Status Hari Ini) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077D7]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              STATUS HARI INI
            </span>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              isOverSchedule
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isOverSchedule ? '⚠️ Lewat Batas Jadwal' : 'Terkontrol Aman'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-medium">Toilet</span>
            <span className="text-base font-extrabold text-slate-900">
              {bathroomCount} <span className="text-[10px] text-slate-400 font-normal">/ {schedule?.maxToiletVisits || 3}x</span>
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-medium">Cairan</span>
            <span className="text-base font-extrabold text-[#0077D7]">
              {totalFluidMl} <span className="text-[10px] text-slate-400 font-normal">ml</span>
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-medium">Kram VAS</span>
            <span className="text-base font-extrabold text-slate-900">
              {latestPainLevel} <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>

        {/* Quick One-Tap Actions for Bedridden Patient */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdateBathroomCount(bathroomCount + 1)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
            <span>+1 Catat BAB</span>
          </button>

          {onQuickAddWater && (
            <button
              type="button"
              onClick={onQuickAddWater}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#0077D7] hover:bg-[#005FB0] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Droplets size={16} strokeWidth={2.5} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>+1 Gelas Air</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Counter Kunjungan Toilet - Mobile Optimized */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
              Parameter 01 • Frekuensi Defekasi
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Kunjungan Toilet Hari Ini
            </h3>
            <p className="text-[11px] text-slate-500">
              Evaluasi klinis kehilangan cairan (output)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => onUpdateBathroomCount(Math.max(0, bathroomCount - 1))}
                className="w-8 h-8 rounded-lg bg-white active:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
                title="Kurang 1"
              >
                <Minus size={16} strokeWidth={2.4} color="#334155" style={{ color: '#334155' }} />
              </button>
              <span className="w-10 text-center font-extrabold text-base text-slate-900">
                {bathroomCount}
              </span>
              <button
                type="button"
                onClick={() => onUpdateBathroomCount(bathroomCount + 1)}
                className="w-8 h-8 rounded-lg bg-white active:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
                title="Tambah 1"
              >
                <Plus size={16} strokeWidth={2.4} color="#334155" style={{ color: '#334155' }} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onUpdateBathroomCount(bathroomCount + 1)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0077D7] hover:bg-[#005FB0] text-white text-xs font-bold transition-colors active:scale-95 shadow-sm"
            >
              +1 Toilet
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Selector: Bristol Stool Form Scale (BSFS) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
              Parameter 02 • Skala Bristol (BSFS)
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Klasifikasi Morfologi Feses
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Skala 1 - 7
          </span>
        </div>

        {/* 7 Segmented Clinical Tiles (Scrollable or Grid) */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {BRISTOL_SCALE_DATA.map((item) => {
            const isCurrent = selectedType === item.type;
            const isItemDiarrhea = item.type >= 5;

            return (
              <button
                type="button"
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                className={`py-2.5 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[105px] shadow-xs ${
                  isCurrent
                    ? 'bg-[#0077D7] text-white border-[#0077D7] shadow-md ring-2 ring-[#0077D7]/30'
                    : isItemDiarrhea
                    ? 'bg-white border-rose-200 text-slate-700 hover:border-rose-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : isItemDiarrhea
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Tipe {item.type}
                </span>

                <div className="my-1 flex justify-center scale-90">
                  <BristolStoolVisual type={item.type} isSelected={isCurrent} />
                </div>

                <span className={`text-[10px] font-bold truncate max-w-full ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                  {item.badgeLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clinical Diagnostic Box */}
        <div className={`p-3.5 rounded-xl border ${isDiarrhea ? 'bg-rose-50/80 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${isDiarrhea ? 'bg-rose-700 text-white' : 'bg-[#0077D7] text-white'}`}>
                Diagnostik: Tipe {currentTypeInfo.type} ({currentTypeInfo.badgeLabel})
              </span>
              {isDiarrhea && (
                <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  <ShieldAlert size={14} color="#BE123C" strokeWidth={2.4} style={{ color: '#BE123C' }} />
                  Kategori Diare Aktif
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {currentTypeInfo.detailedDesc}
            </p>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 mt-2">
              <strong className="text-slate-900 block text-[11px]">Rekomendasi Klinis:</strong>
              <p className="text-slate-600 mt-0.5">{currentTypeInfo.advice}</p>
            </div>
          </div>
        </div>

        {/* Diarrhea Rehydration Prompt */}
        {isDiarrhea && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} color="#B45309" strokeWidth={2.4} className="shrink-0 mt-0.5" style={{ color: '#B45309' }} />
              <p className="text-xs text-amber-900 leading-snug">
                <strong>Pedoman WHO/Kemenkes:</strong> Minum 200–250 ml larutan Oralit setiap kali selesai BAB cair untuk mencegah dehidrasi.
              </p>
            </div>
            <button
              type="button"
              onClick={onTriggerOralitSuggestion}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
            >
              <span>+1 Gelas Oralit</span>
              <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.4} style={{ color: '#FFFFFF' }} />
            </button>
          </div>
        )}
      </div>

      {/* 3. Pain Scale: Skor Nyeri VAS (1-10) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
              Parameter 03 • Intensitas Kram (VAS)
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Skor Nyeri Abdomen (Visual Analogue Scale)
            </h3>
          </div>
          <div className={`px-2 py-0.5 rounded-lg border text-xs font-bold ${vasInfo.bg}`}>
            Skala {painLevel}/10
          </div>
        </div>

        {/* 10 Clean Number Buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isSelected = painLevel === num;
            return (
              <button
                type="button"
                key={num}
                onClick={() => setPainLevel(num)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-[#0077D7] text-white border-[#0077D7] shadow-sm ring-1 ring-[#0077D7]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <strong className="text-slate-800">{vasInfo.text}:</strong> {vasInfo.clinical}
        </p>
      </div>

      {/* 4. Clinical Entry Save */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block mb-1.5">
          Parameter 04 • Catatan Gejala Tambahan
        </span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan kecil: misal 'mual berkurang', 'perut bergemuruh', 'lemas'..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0077D7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
          />

          <button
            type="button"
            onClick={handleSaveLog}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-sm ${
              justSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0077D7] hover:bg-[#005FB0] text-white'
            }`}
          >
            {justSaved ? (
              <>
                <CheckCircle2 size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
                <span>Tercatat di Rekam Medis!</span>
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
                <span>Simpan Catatan Observasi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};